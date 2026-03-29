import { Redis } from "@upstash/redis";

let redis = null;

// In-memory fallback when Redis is not available
const memoryStore = {
  data: new Map(),
  get: async (key) => memoryStore.data.get(key) || null,
  set: async (key, value, options) => {
    memoryStore.data.set(key, value);
    if (options?.ex) {
      setTimeout(() => memoryStore.data.delete(key), options.ex * 1000);
    }
    return "OK";
  },
  del: async (key) => {
    memoryStore.data.delete(key);
    return 1;
  },
  keys: async (pattern) => {
    const regex = new RegExp(pattern.replace("*", ".*"));
    return Array.from(memoryStore.data.keys()).filter((k) => regex.test(k));
  },
  hset: async (key, field, value) => {
    const hash = memoryStore.data.get(key) || {};
    hash[field] = value;
    memoryStore.data.set(key, hash);
    return 1;
  },
  hget: async (key, field) => {
    const hash = memoryStore.data.get(key);
    return hash ? hash[field] : null;
  },
  hgetall: async (key) => memoryStore.data.get(key) || null,
  hdel: async (key, field) => {
    const hash = memoryStore.data.get(key);
    if (hash) {
      delete hash[field];
      memoryStore.data.set(key, hash);
    }
    return 1;
  },
};

export async function initRedis() {
  if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    try {
      redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });
      await redis.ping();
      console.log("Connected to Upstash Redis");
    } catch (error) {
      console.warn(
        "Failed to connect to Redis, using in-memory store:",
        error.message,
      );
      redis = memoryStore;
    }
  } else {
    console.log("No Redis credentials, using in-memory store");
    redis = memoryStore;
  }
}

export function getRedis() {
  return redis || memoryStore;
}

// User session helpers
export async function setUserData(userId, data) {
  const r = getRedis();
  await r.set(`user:${userId}`, JSON.stringify(data));
}

export async function getUserData(userId) {
  const r = getRedis();
  const data = await r.get(`user:${userId}`);
  return data ? (typeof data === "string" ? JSON.parse(data) : data) : null;
}

// Resume storage
export async function saveResume(userId, resumeData) {
  const r = getRedis();
  await r.set(`resume:${userId}`, JSON.stringify(resumeData));
}

export async function getResume(userId) {
  const r = getRedis();
  const data = await r.get(`resume:${userId}`);
  return data ? (typeof data === "string" ? JSON.parse(data) : data) : null;
}

export async function deleteResume(userId) {
  const r = getRedis();
  await r.del(`resume:${userId}`);
}

// Application tracking
export async function saveApplication(userId, application) {
  const r = getRedis();
  const key = `applications:${userId}`;
  const apps = await getApplications(userId);
  apps.push(application);
  await r.set(key, JSON.stringify(apps));
}

export async function getApplications(userId) {
  const r = getRedis();
  const data = await r.get(`applications:${userId}`);
  return data ? (typeof data === "string" ? JSON.parse(data) : data) : [];
}

export async function updateApplication(userId, appId, updates) {
  const r = getRedis();
  const apps = await getApplications(userId);
  const index = apps.findIndex((a) => a.id === appId);
  if (index !== -1) {
    apps[index] = { ...apps[index], ...updates };
    await r.set(`applications:${userId}`, JSON.stringify(apps));
    return apps[index];
  }
  return null;
}

export async function deleteApplication(userId, appId) {
  const r = getRedis();
  const apps = await getApplications(userId);
  const filtered = apps.filter((a) => a.id !== appId);
  await r.set(`applications:${userId}`, JSON.stringify(filtered));
}

// Job caching
export async function cacheJobs(cacheKey, jobs, ttl = 300) {
  const r = getRedis();
  await r.set(`jobs:${cacheKey}`, JSON.stringify(jobs), { ex: ttl });
}

export async function getCachedJobs(cacheKey) {
  const r = getRedis();
  const data = await r.get(`jobs:${cacheKey}`);
  return data ? (typeof data === "string" ? JSON.parse(data) : data) : null;
}

// Match score caching
export async function cacheMatchScore(
  userId,
  jobId,
  score,
  explanation,
  matchedSkills = [],
) {
  const r = getRedis();
  await r.hset(
    `matchscores:${userId}`,
    jobId,
    JSON.stringify({ score, explanation, matchedSkills }),
  );
}

export async function getMatchScore(userId, jobId) {
  const r = getRedis();
  const data = await r.hget(`matchscores:${userId}`, jobId);
  return data ? (typeof data === "string" ? JSON.parse(data) : data) : null;
}

export async function clearMatchScores(userId) {
  const r = getRedis();
  await r.del(`matchscores:${userId}`);
}

// Clear job cache
export async function clearJobsCache(cacheKey = "*") {
  const r = getRedis();
  if (cacheKey === "*") {
    // Clear all job caches
    const keys = await r.keys("jobs:*");
    if (keys && keys.length > 0) {
      await Promise.all(keys.map((key) => r.del(key)));
    }
  } else {
    await r.del(`jobs:${cacheKey}`);
  }
}
