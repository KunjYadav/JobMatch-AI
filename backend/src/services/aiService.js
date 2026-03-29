import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

let genAI = null;
let model = null;
let openai = null;
let aiProvider = null; // 'gemini', 'openai', or null

// Initialize AI providers (Gemini primary, OpenAI backup)
export function initAI() {
  if (process.env.GEMINI_API_KEY) {
    try {
      genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
      aiProvider = "gemini";
      console.log("Google Gemini AI initialized (gemini-1.5-flash-latest)");

      if (process.env.OPENAI_API_KEY) {
        openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        console.log("OpenAI initialized as backup (gpt-3.5-turbo)");
      }
      return true;
    } catch (error) {
      console.error("Gemini initialization failed:", error.message);
    }
  }

  if (process.env.OPENAI_API_KEY) {
    try {
      openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      aiProvider = "openai";
      console.log("OpenAI initialized as primary (gpt-3.5-turbo)");
      return true;
    } catch (error) {
      console.error("OpenAI initialization failed:", error.message);
    }
  }

  console.log("No AI providers configured, using rule-based fallback");
  return false;
}

const SKILL_CATEGORIES = {
  frontend: [
    "react",
    "vue",
    "angular",
    "javascript",
    "typescript",
    "html",
    "css",
    "sass",
    "tailwind",
    "next.js",
    "redux",
    "webpack",
  ],
  backend: [
    "node.js",
    "python",
    "java",
    "go",
    "rust",
    "ruby",
    "php",
    "c#",
    "django",
    "flask",
    "spring",
    "express",
    "fastify",
  ],
  database: [
    "postgresql",
    "mysql",
    "mongodb",
    "redis",
    "elasticsearch",
    "sql",
    "nosql",
    "dynamodb",
    "firebase",
  ],
  devops: [
    "aws",
    "azure",
    "gcp",
    "docker",
    "kubernetes",
    "terraform",
    "ci/cd",
    "jenkins",
    "github actions",
  ],
  mobile: ["react native", "flutter", "swift", "kotlin", "ios", "android"],
  data: [
    "machine learning",
    "tensorflow",
    "pytorch",
    "pandas",
    "numpy",
    "spark",
    "data science",
    "nlp",
  ],
  design: [
    "figma",
    "sketch",
    "ui/ux",
    "adobe xd",
    "prototyping",
    "user research",
  ],
};

// Extract skills from text with null safety
export function extractSkills(text) {
  if (!text) return [];
  const normalizedText = text.toLowerCase();
  const foundSkills = new Set();

  for (const category of Object.values(SKILL_CATEGORIES)) {
    for (const skill of category) {
      if (normalizedText.includes(skill)) {
        foundSkills.add(skill);
      }
    }
  }
  return Array.from(foundSkills);
}

function calculateSkillOverlap(resumeSkills, jobSkills) {
  if (!jobSkills || jobSkills.length === 0) return 50;

  const resumeSet = new Set(resumeSkills.map((s) => s.toLowerCase()));
  const matchCount = jobSkills.filter((s) =>
    resumeSet.has(s.toLowerCase()),
  ).length;

  return Math.round((matchCount / jobSkills.length) * 100);
}

function detectExperienceLevel(text) {
  if (!text) return "any";
  const lowerText = text.toLowerCase();

  if (
    lowerText.includes("senior") ||
    lowerText.includes("lead") ||
    lowerText.includes("principal") ||
    lowerText.includes("10+ years") ||
    lowerText.includes("8+ years")
  ) {
    return "senior";
  }
  if (
    lowerText.includes("junior") ||
    lowerText.includes("entry") ||
    lowerText.includes("intern") ||
    lowerText.includes("0-2 years") ||
    lowerText.includes("1-2 years")
  ) {
    return "junior";
  }
  if (
    lowerText.includes("mid") ||
    lowerText.includes("3-5 years") ||
    lowerText.includes("2-4 years")
  ) {
    return "mid";
  }
  return "any";
}

function calculateExperienceMatch(resumeText, jobDescription) {
  const resumeLevel = detectExperienceLevel(resumeText || "");
  const jobLevel = detectExperienceLevel(jobDescription || "");

  if (resumeLevel === jobLevel || jobLevel === "any" || resumeLevel === "any") {
    return 100;
  }
  if (
    (resumeLevel === "mid" && jobLevel === "senior") ||
    (resumeLevel === "senior" && jobLevel === "mid")
  )
    return 70;
  if (
    (resumeLevel === "junior" && jobLevel === "mid") ||
    (resumeLevel === "mid" && jobLevel === "junior")
  )
    return 60;
  return 30;
}

function calculateTitleRelevance(resumeText, jobTitle) {
  if (!resumeText || !jobTitle) return 50;

  const lowerResume = resumeText.toLowerCase();
  const lowerTitle = jobTitle.toLowerCase();

  const titleWords = lowerTitle.split(/\s+/).filter((w) => w.length > 2);
  const matchedWords = titleWords.filter((word) => lowerResume.includes(word));

  if (titleWords.length === 0) return 50;
  return Math.round((matchedWords.length / titleWords.length) * 100);
}

// Fallback scoring without AI
function fallbackScoring(resumeText, job) {
  const resumeSkills = extractSkills(resumeText || "");
  const jobSkills = job.skills || extractSkills(job.description || "");

  const skillScore = calculateSkillOverlap(resumeSkills, jobSkills);
  const experienceScore = calculateExperienceMatch(resumeText, job.description);
  const titleScore = calculateTitleRelevance(resumeText, job.title);

  const score = Math.round(
    skillScore * 0.45 + experienceScore * 0.3 + titleScore * 0.25,
  );

  const matchedSkills = jobSkills.filter((s) =>
    resumeSkills.some((rs) => rs.toLowerCase() === s.toLowerCase()),
  );

  const explanation = [];
  if (matchedSkills.length > 0) {
    const skillsText = matchedSkills.slice(0, 5).join(", ");
    if (matchedSkills.length > 5) {
      explanation.push(
        `Strong match on ${matchedSkills.length} skills including ${skillsText}, and more`,
      );
    } else if (matchedSkills.length > 2) {
      explanation.push(`Good skill alignment: ${skillsText}`);
    } else {
      explanation.push(`Matches key skills: ${skillsText}`);
    }
  } else if (jobSkills.length > 0) {
    explanation.push(
      `Limited skill overlap - consider learning ${jobSkills.slice(0, 2).join(", ")}`,
    );
  }

  if (experienceScore >= 80)
    explanation.push("Your experience level is an excellent fit");
  else if (experienceScore >= 60)
    explanation.push("Experience aligns with requirements");

  if (titleScore >= 70)
    explanation.push("Job title closely matches your background");

  if (score >= 80) explanation.unshift("🎯 Excellent match!");
  else if (score >= 60) explanation.unshift("✓ Good match");

  return {
    score: Math.max(0, Math.min(100, score)),
    explanation:
      explanation.length > 0
        ? explanation.join(". ")
        : "This role could be a fit based on your profile",
    matchedSkills: matchedSkills,
    resumeSkills: resumeSkills.slice(0, 10),
  };
}

// Score single job with flexible argument mapping
export async function scoreJobMatch(userId, resumeText, job) {
  // Handle overload if only 2 arguments are provided: (resumeText, job)
  if (typeof resumeText === "object") {
    job = resumeText;
    resumeText = userId;
    userId = "default";
  }

  if (aiProvider === "gemini" && model) {
    try {
      return await geminiScoring(resumeText, job);
    } catch (error) {
      if (openai) {
        try {
          return await openaiScoring(resumeText, job);
        } catch (openaiError) {
          return fallbackScoring(resumeText, job);
        }
      }
      return fallbackScoring(resumeText, job);
    }
  }

  if (aiProvider === "openai" && openai) {
    try {
      return await openaiScoring(resumeText, job);
    } catch (error) {
      return fallbackScoring(resumeText, job);
    }
  }

  return fallbackScoring(resumeText, job);
}

// Score multiple jobs with flexible argument mapping to prevent backend crashes
export async function scoreJobsInBatch(userId, resumeText, jobs) {
  // Handle overload if only 2 arguments are provided: (resumeText, jobs)
  if (Array.isArray(resumeText)) {
    jobs = resumeText;
    resumeText = userId;
    userId = "default";
  }

  // Safety check to ensure jobs is iterable
  if (!Array.isArray(jobs)) return [];

  const results = await Promise.all(
    jobs.map(async (job) => {
      const matchData = await scoreJobMatch(userId, resumeText, job);
      return {
        ...job,
        matchScore: matchData.score,
        matchExplanation: matchData.explanation,
        matchedSkills: matchData.matchedSkills,
      };
    }),
  );

  return results;
}

// Gemini AI-powered job scoring
async function geminiScoring(resumeText, job) {
  const prompt = `You are a job matching expert. Score how well this resume matches the job posting on a scale of 0-100.

Resume:
${(resumeText || "").substring(0, 2000)}

Job:
Title: ${job.title}
Company: ${job.company}
Location: ${job.location}
Description: ${(job.description || "").substring(0, 1000)}
Required Skills: ${(job.skills || []).join(", ")}

Return ONLY a JSON object with this exact format (no markdown, no code blocks):
{
  "score": <number 0-100>,
  "explanation": "<brief 1-sentence reason>",
  "matchedSkills": ["skill1", "skill2"]
}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      score: Math.max(0, Math.min(100, parsed.score || 0)),
      explanation: parsed.explanation || "AI-based matching",
      matchedSkills: parsed.matchedSkills || [],
      resumeSkills: extractSkills(resumeText).slice(0, 10),
    };
  }

  return fallbackScoring(resumeText, job);
}

// OpenAI-powered job scoring
async function openaiScoring(resumeText, job) {
  const prompt = `You are a job matching expert. Score how well this resume matches the job posting on a scale of 0-100.

Resume:
${(resumeText || "").substring(0, 2000)}

Job:
Title: ${job.title}
Company: ${job.company}
Location: ${job.location}
Description: ${(job.description || "").substring(0, 1000)}
Required Skills: ${(job.skills || []).join(", ")}

Return ONLY a JSON object with this exact format (no markdown, no code blocks):
{
  "score": <number 0-100>,
  "explanation": "<brief 1-sentence reason>",
  "matchedSkills": ["skill1", "skill2"]
}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    max_tokens: 200,
  });

  const text = completion.choices[0].message.content;

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      score: Math.max(0, Math.min(100, parsed.score || 0)),
      explanation: parsed.explanation || "AI-based matching",
      matchedSkills: parsed.matchedSkills || [],
      resumeSkills: extractSkills(resumeText).slice(0, 10),
    };
  }

  return fallbackScoring(resumeText, job);
}

// Process chat messages
export async function processChat(message, jobs, resumeText) {
  if (aiProvider === "gemini" && model) {
    try {
      return await geminiChat(message, jobs, resumeText);
    } catch (error) {
      if (openai) {
        try {
          return await openaiChat(message, jobs, resumeText);
        } catch (openaiError) {
          return fallbackChat(message, jobs, resumeText);
        }
      }
      return fallbackChat(message, jobs, resumeText);
    }
  }

  if (aiProvider === "openai" && openai) {
    try {
      return await openaiChat(message, jobs, resumeText);
    } catch (error) {
      return fallbackChat(message, jobs, resumeText);
    }
  }

  return fallbackChat(message, jobs, resumeText);
}

// Gemini AI-powered chat
async function geminiChat(message, jobs, resumeText) {
  const jobsList = jobs
    .slice(0, 10)
    .map(
      (j) =>
        `- ${j.title} at ${j.company} (${j.location}${j.workMode === "Remote" ? ", Remote" : ""})`,
    )
    .join("\n");

  const prompt = `You are Kunj, a friendly and helpful AI job search assistant.

App Knowledge / FAQ:
- "Where can I see my applications?": Tell them they can view all tracked applications in the "Applications" tab on the left navigation bar.
- "How do I upload my resume?": Tell them to click the "Upload Resume" or "Update Resume" button located at the bottom of the navigation sidebar. We accept PDF and TXT files.
- "How does job matching work?": Explain that the AI analyzes their uploaded resume and compares it against job requirements. It calculates a score based on skill overlap (45%), experience level alignment (30%), and job title relevance (25%).

User's question: "${message}"

${jobs.length > 0 ? `Available jobs (showing ${Math.min(10, jobs.length)} of ${jobs.length}):\n${jobsList}` : "No jobs currently loaded."}

${resumeText ? "The user has uploaded their resume for AI matching." : "The user has not uploaded a resume yet."}

Be conversational and helpful!`;

  const result = await model.generateContent(prompt);
  const response = await result.response;

  return {
    type: "help",
    message: response.text(),
    jobs: [],
  };
}

// OpenAI-powered chat
async function openaiChat(message, jobs, resumeText) {
  const jobsList = jobs
    .slice(0, 10)
    .map(
      (j) =>
        `- ${j.title} at ${j.company} (${j.location}${j.workMode === "Remote" ? ", Remote" : ""})`,
    )
    .join("\n");

  const prompt = `You are Kunj, a friendly AI job search assistant. The user said: "${message}"

Available jobs:
${jobsList}

User's resume summary: ${resumeText ? resumeText.substring(0, 500) : "Not provided"}

App Knowledge / FAQ:
- "Where can I see my applications?": Tell them they can view all tracked applications in the "Applications" tab on the left navigation bar.
- "How do I upload my resume?": Tell them to click the "Upload Resume" or "Update Resume" button located at the bottom of the navigation sidebar. We accept PDF and TXT files.
- "How does job matching work?": Explain that the AI analyzes their uploaded resume and compares it against job requirements. It calculates a score based on skill overlap (45%), experience level alignment (30%), and job title relevance (25%).

Be conversational and helpful!`;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 300,
  });

  return {
    type: "help",
    message: completion.choices[0].message.content,
    jobs: [],
  };
}

// Fallback chat without AI
async function fallbackChat(message, jobs, resumeText) {
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes("your name") ||
    lowerMessage.includes("who are you") ||
    lowerMessage.includes("what are you")
  ) {
    return {
      type: "help",
      message:
        "Hi! I'm Kunj 👋, your friendly AI job search assistant. I'm here to help you find the perfect job!",
      jobs: [],
    };
  }

  if (lowerMessage.match(/^(hi|hello|hey|hola|namaste)/)) {
    return {
      type: "help",
      message:
        "Hey there! 😊 I'm Kunj, your job search buddy. How can I help you find your dream job today?",
      jobs: [],
    };
  }

  const productQuestions = [
    {
      patterns: ["where", "see", "applications", "applied", "track"],
      answer:
        "You can see all your tracked applications in the \"Applications\" tab on the left navigation bar. There you'll find a timeline and current status for each job you've applied to.",
    },
    {
      patterns: ["upload", "resume", "cv", "add my resume"],
      answer:
        'To upload or update your resume, simply click the "Upload Resume" or "Update Resume" button located at the bottom of the navigation sidebar. We accept PDF and TXT files.',
    },
    {
      patterns: [
        "matching work",
        "match score",
        "how does matching",
        "how does job matching",
      ],
      answer:
        "Our AI matching algorithm analyzes your uploaded resume and compares it against job requirements. It calculates a score based on skill overlap (45%), experience level alignment (30%), and job title relevance (25%). Higher scores mean better matches!",
    },
  ];

  for (const pq of productQuestions) {
    if (pq.patterns.some((p) => lowerMessage.includes(p))) {
      return { type: "help", message: pq.answer, jobs: [] };
    }
  }

  let filteredJobs = [...jobs];

  if (lowerMessage.includes("remote")) {
    filteredJobs = filteredJobs.filter((j) => j.workMode === "Remote");
  }

  for (const [category, skills] of Object.entries(SKILL_CATEGORIES)) {
    for (const skill of skills) {
      if (lowerMessage.includes(skill)) {
        filteredJobs = filteredJobs.filter((j) => {
          const jobSkills = j.skills || [];
          const hasSkillInArray = jobSkills.some((s) =>
            s.toLowerCase().includes(skill),
          );
          const hasSkillInDesc =
            j.description?.toLowerCase().includes(skill) || false;
          const hasSkillInTitle =
            j.title?.toLowerCase().includes(skill) || false;
          return hasSkillInArray || hasSkillInDesc || hasSkillInTitle;
        });
        break;
      }
    }
  }

  if (lowerMessage.includes("senior")) {
    filteredJobs = filteredJobs.filter((j) =>
      j.title.toLowerCase().includes("senior"),
    );
  }
  if (lowerMessage.includes("junior") || lowerMessage.includes("entry")) {
    filteredJobs = filteredJobs.filter(
      (j) =>
        j.title.toLowerCase().includes("junior") ||
        j.title.toLowerCase().includes("intern"),
    );
  }

  if (lowerMessage.includes("this week") || lowerMessage.includes("recent")) {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    filteredJobs = filteredJobs.filter((j) => new Date(j.postedDate) > weekAgo);
  }

  if (
    lowerMessage.includes("best match") ||
    lowerMessage.includes("highest score") ||
    lowerMessage.includes("top match") ||
    lowerMessage.includes("highest match scores")
  ) {
    if (resumeText) {
      filteredJobs = await scoreJobsInBatch(
        "default",
        resumeText,
        filteredJobs,
      );
      filteredJobs = filteredJobs
        .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
        .slice(0, 5);
    }
  }

  let responseMessage;
  if (filteredJobs.length === 0) {
    responseMessage =
      "I couldn't find any jobs matching your criteria. Try broadening your search or asking about different skills.";
  } else if (filteredJobs.length === jobs.length) {
    responseMessage = "Here are some job recommendations based on your query:";
    filteredJobs = filteredJobs.slice(0, 6);
  } else {
    responseMessage = `I found ${filteredJobs.length} job${filteredJobs.length === 1 ? "" : "s"} matching your criteria:`;
    filteredJobs = filteredJobs.slice(0, 6);
  }

  return {
    type: "jobs",
    message: responseMessage,
    jobs: filteredJobs,
  };
}

initAI();
