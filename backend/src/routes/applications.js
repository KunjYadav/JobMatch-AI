import { v4 as uuidv4 } from 'uuid';
import {
    saveApplication,
    getApplications,
    updateApplication,
    deleteApplication
} from '../services/redisService.js';

export default async function applicationRoutes(fastify) {
    // Create new application
    fastify.post('/', async (request, reply) => {
        try {
            const { jobId, jobTitle, company, applyUrl, appliedAt, status = 'applied' } = request.body;
            const userId = request.query.userId || 'default';

            if (!jobId || !jobTitle || !company) {
                return reply.status(400).send({
                    error: 'Missing required fields: jobId, jobTitle, company'
                });
            }

            // Check if already applied
            const existing = await getApplications(userId);
            if (existing.some(app => app.jobId === jobId)) {
                return reply.status(409).send({
                    error: 'Already applied to this job',
                    existing: existing.find(app => app.jobId === jobId)
                });
            }

            const application = {
                id: uuidv4(),
                jobId,
                jobTitle,
                company,
                applyUrl,
                status,
                appliedAt: appliedAt || new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                timeline: [
                    {
                        status: 'applied',
                        date: appliedAt || new Date().toISOString(),
                        note: 'Application submitted'
                    }
                ]
            };

            await saveApplication(userId, application);

            return {
                success: true,
                application
            };
        } catch (error) {
            fastify.log.error(error);
            reply.status(500).send({ error: 'Failed to create application' });
        }
    });

    // Get all applications
    fastify.get('/', async (request, reply) => {
        try {
            const { status, sortBy = 'date', order = 'desc' } = request.query;
            const userId = request.query.userId || 'default';

            let applications = await getApplications(userId);

            // Filter by status
            if (status && status !== 'all') {
                applications = applications.filter(app => app.status === status);
            }

            // Sort
            applications.sort((a, b) => {
                let comparison = 0;
                if (sortBy === 'date') {
                    comparison = new Date(b.appliedAt) - new Date(a.appliedAt);
                } else if (sortBy === 'company') {
                    comparison = a.company.localeCompare(b.company);
                } else if (sortBy === 'status') {
                    comparison = a.status.localeCompare(b.status);
                }
                return order === 'desc' ? comparison : -comparison;
            });

            // Calculate stats
            const stats = {
                total: applications.length,
                applied: applications.filter(a => a.status === 'applied').length,
                interview: applications.filter(a => a.status === 'interview').length,
                offer: applications.filter(a => a.status === 'offer').length,
                rejected: applications.filter(a => a.status === 'rejected').length
            };

            return { applications, stats };
        } catch (error) {
            fastify.log.error(error);
            reply.status(500).send({ error: 'Failed to get applications' });
        }
    });

    // Update application status
    fastify.patch('/:id', async (request, reply) => {
        try {
            const { id } = request.params;
            const { status, note } = request.body;
            const userId = request.query.userId || 'default';

            const validStatuses = ['applied', 'interview', 'offer', 'rejected'];
            if (status && !validStatuses.includes(status)) {
                return reply.status(400).send({
                    error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
                });
            }

            const applications = await getApplications(userId);
            const app = applications.find(a => a.id === id);

            if (!app) {
                return reply.status(404).send({ error: 'Application not found' });
            }

            // Add to timeline
            const timelineEntry = {
                status: status || app.status,
                date: new Date().toISOString(),
                note: note || `Status changed to ${status}`
            };

            const updates = {
                status: status || app.status,
                updatedAt: new Date().toISOString(),
                timeline: [...(app.timeline || []), timelineEntry]
            };

            const updated = await updateApplication(userId, id, updates);

            return {
                success: true,
                application: updated
            };
        } catch (error) {
            fastify.log.error(error);
            reply.status(500).send({ error: 'Failed to update application' });
        }
    });

    // Delete application
    fastify.delete('/:id', async (request, reply) => {
        try {
            const { id } = request.params;
            const userId = request.query.userId || 'default';

            await deleteApplication(userId, id);

            return { success: true, message: 'Application deleted' };
        } catch (error) {
            fastify.log.error(error);
            reply.status(500).send({ error: 'Failed to delete application' });
        }
    });

    // Check if already applied to a job
    fastify.get('/check/:jobId', async (request, reply) => {
        try {
            const { jobId } = request.params;
            const userId = request.query.userId || 'default';

            const applications = await getApplications(userId);
            const existing = applications.find(app => app.jobId === jobId);

            return {
                applied: !!existing,
                application: existing || null
            };
        } catch (error) {
            fastify.log.error(error);
            reply.status(500).send({ error: 'Failed to check application' });
        }
    });
}
