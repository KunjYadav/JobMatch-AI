import { saveResume, getResume, deleteResume, clearMatchScores } from '../services/redisService.js';

export default async function resumeRoutes(fastify) {
    // Upload resume
    fastify.post('/upload', async (request, reply) => {
        try {
            const data = await request.file();

            if (!data) {
                return reply.status(400).send({ error: 'No file uploaded' });
            }

            const { filename, mimetype } = data;
            const userId = request.query.userId || 'default';

            // Validate file type
            const allowedTypes = ['application/pdf', 'text/plain'];
            if (!allowedTypes.includes(mimetype)) {
                return reply.status(400).send({
                    error: 'Invalid file type. Please upload PDF or TXT file.'
                });
            }

            // Read file content
            const chunks = [];
            for await (const chunk of data.file) {
                chunks.push(chunk);
            }
            const buffer = Buffer.concat(chunks);

            let text = '';

            if (mimetype === 'text/plain') {
                text = buffer.toString('utf-8');
            } else if (mimetype === 'application/pdf') {
                // For PDF, we'll try pdf-parse or use mock extraction
                try {
                    // Dynamic import for pdf-parse
                    const pdfParse = (await import('pdf-parse')).default;
                    const pdfData = await pdfParse(buffer);
                    text = pdfData.text;
                } catch (pdfError) {
                    console.error('PDF parsing error:', pdfError);
                    // Fallback: inform user to use TXT
                    return reply.status(400).send({
                        error: 'PDF parsing failed. Please try uploading a TXT file instead.'
                    });
                }
            }

            if (!text || text.trim().length < 50) {
                return reply.status(400).send({
                    error: 'Could not extract enough text from the file. Please ensure your resume has sufficient content.'
                });
            }

            // Save resume
            const resumeData = {
                filename,
                mimetype,
                text,
                uploadedAt: new Date().toISOString()
            };

            await saveResume(userId, resumeData);

            // Clear cached match scores since resume changed
            await clearMatchScores(userId);

            return {
                success: true,
                message: 'Resume uploaded successfully',
                filename,
                textLength: text.length
            };
        } catch (error) {
            fastify.log.error(error);
            reply.status(500).send({ error: 'Failed to upload resume' });
        }
    });

    // Get current resume
    fastify.get('/', async (request, reply) => {
        try {
            const userId = request.query.userId || 'default';
            fastify.log.info(`Checking resume for user: ${userId}`);

            const resume = await getResume(userId);

            // Strict validation: resume must exist AND have text content
            if (!resume || !resume.text) {
                fastify.log.info(`No resume found for user: ${userId}`);
                return { hasResume: false };
            }

            fastify.log.info(`Resume exists for user: ${userId}, uploaded: ${resume.uploadedAt}`);
            return {
                hasResume: true,
                filename: resume.filename,
                uploadedAt: resume.uploadedAt,
                textPreview: resume.text.substring(0, 200) + '...'
            };
        } catch (error) {
            fastify.log.error('Error checking resume:', error);
            // On error, default to safe state (no resume) instead of 500 error
            return { hasResume: false };
        }
    });

    // Delete resume
    fastify.delete('/', async (request, reply) => {
        try {
            const userId = request.query.userId || 'default';
            await deleteResume(userId);
            await clearMatchScores(userId);

            return { success: true, message: 'Resume deleted' };
        } catch (error) {
            fastify.log.error(error);
            reply.status(500).send({ error: 'Failed to delete resume' });
        }
    });

    // Save resume text directly (for demo/testing)
    fastify.post('/text', async (request, reply) => {
        try {
            const { text } = request.body;
            const userId = request.query.userId || 'default';

            if (!text || text.trim().length < 50) {
                return reply.status(400).send({
                    error: 'Resume text must be at least 50 characters'
                });
            }

            const resumeData = {
                filename: 'resume.txt',
                mimetype: 'text/plain',
                text,
                uploadedAt: new Date().toISOString()
            };

            await saveResume(userId, resumeData);
            await clearMatchScores(userId);

            return {
                success: true,
                message: 'Resume saved successfully'
            };
        } catch (error) {
            fastify.log.error(error);
            reply.status(500).send({ error: 'Failed to save resume' });
        }
    });
}
