import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';

import jobRoutes from './src/routes/jobs.js';
import resumeRoutes from './src/routes/resume.js';
import applicationRoutes from './src/routes/applications.js';
import chatRoutes from './src/routes/chat.js';
import { initRedis } from './src/services/redisService.js';

const fastify = Fastify({
  logger: true
});

// Register plugins
await fastify.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
});

await fastify.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Initialize Redis
await initRedis();

// Register routes
fastify.register(jobRoutes, { prefix: '/api/jobs' });
fastify.register(resumeRoutes, { prefix: '/api/resume' });
fastify.register(applicationRoutes, { prefix: '/api/applications' });
fastify.register(chatRoutes, { prefix: '/api/chat' });

// Health check
fastify.get('/api/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Error handler
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  reply.status(error.statusCode || 500).send({
    error: error.message || 'Internal Server Error'
  });
});

// Start server
const start = async () => {
  try {
    const port = process.env.PORT || 3001;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Server running on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
