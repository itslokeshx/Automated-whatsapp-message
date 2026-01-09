const cron = require('node-cron');
const fs = require('fs').promises;
const path = require('path');
const whatsappService = require('./whatsapp.service');
const logger = require('../utils/logger');

/**
 * Scheduler Service
 * Handles scheduling of WhatsApp messages (one-time and recurring)
 */

class SchedulerService {
    constructor() {
        this.scheduledJobs = new Map();
        this.jobsFilePath = path.join(__dirname, '../../data/scheduled-jobs.json');
        this.initialized = false;
    }

    /**
     * Initialize the scheduler and restore persisted jobs
     */
    async initialize() {
        if (this.initialized) return;

        try {
            // Create data directory if it doesn't exist
            const dataDir = path.dirname(this.jobsFilePath);
            await fs.mkdir(dataDir, { recursive: true });

            // Load persisted jobs
            await this.loadPersistedJobs();

            this.initialized = true;
            logger.success('Scheduler service initialized');
        } catch (error) {
            logger.error(`Failed to initialize scheduler: ${error.message}`);
        }
    }

    /**
     * Schedule a one-time message
     * @param {string} id - Unique job ID
     * @param {Date} scheduledTime - When to send the message
     * @param {string} recipient - Phone number
     * @param {string} message - Message content (optional, uses template if not provided)
     * @returns {Object} Job details
     */
    scheduleOneTime(id, scheduledTime, recipient, message = null) {
        const now = new Date();
        if (scheduledTime <= now) {
            throw new Error('Scheduled time must be in the future');
        }

        // Calculate delay in milliseconds
        const delay = scheduledTime.getTime() - now.getTime();

        // Create timeout
        const timeout = setTimeout(async () => {
            try {
                logger.info(`Executing scheduled message: ${id}`);

                if (message) {
                    await whatsappService.sendTextMessage(recipient, message);
                } else {
                    await whatsappService.sendTemplateMessage(recipient);
                }

                logger.success(`Scheduled message sent: ${id}`);
                this.removeJob(id);
            } catch (error) {
                logger.error(`Failed to send scheduled message ${id}: ${error.message}`);
            }
        }, delay);

        const job = {
            id,
            type: 'one-time',
            scheduledTime: scheduledTime.toISOString(),
            recipient,
            message,
            createdAt: new Date().toISOString(),
            timeout,
        };

        this.scheduledJobs.set(id, job);
        this.persistJobs();

        logger.success(`One-time message scheduled: ${id} for ${scheduledTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);

        return this.getJobInfo(id);
    }

    /**
     * Schedule a recurring message using cron expression
     * @param {string} id - Unique job ID
     * @param {string} cronExpression - Cron expression (e.g., '0 17 * * *' for daily 5pm)
     * @param {string} recipient - Phone number
     * @param {string} message - Message content (optional)
     * @returns {Object} Job details
     */
    scheduleRecurring(id, cronExpression, recipient, message = null) {
        if (!cron.validate(cronExpression)) {
            throw new Error('Invalid cron expression');
        }

        const cronJob = cron.schedule(cronExpression, async () => {
            try {
                logger.info(`Executing recurring message: ${id}`);

                if (message) {
                    await whatsappService.sendTextMessage(recipient, message);
                } else {
                    await whatsappService.sendTemplateMessage(recipient);
                }

                logger.success(`Recurring message sent: ${id}`);
            } catch (error) {
                logger.error(`Failed to send recurring message ${id}: ${error.message}`);
            }
        });

        const job = {
            id,
            type: 'recurring',
            cronExpression,
            recipient,
            message,
            createdAt: new Date().toISOString(),
            cronJob,
        };

        this.scheduledJobs.set(id, job);
        this.persistJobs();

        logger.success(`Recurring message scheduled: ${id} with cron '${cronExpression}'`);

        return this.getJobInfo(id);
    }

    /**
     * Cancel a scheduled job
     * @param {string} id - Job ID
     * @returns {boolean} Success status
     */
    cancelJob(id) {
        const job = this.scheduledJobs.get(id);

        if (!job) {
            return false;
        }

        if (job.type === 'one-time' && job.timeout) {
            clearTimeout(job.timeout);
        } else if (job.type === 'recurring' && job.cronJob) {
            job.cronJob.stop();
        }

        this.scheduledJobs.delete(id);
        this.persistJobs();

        logger.info(`Job cancelled: ${id}`);
        return true;
    }

    /**
     * Remove a completed job
     * @param {string} id - Job ID
     */
    removeJob(id) {
        this.scheduledJobs.delete(id);
        this.persistJobs();
    }

    /**
     * Get all scheduled jobs
     * @returns {Array} List of job info
     */
    getAllJobs() {
        return Array.from(this.scheduledJobs.keys()).map(id => this.getJobInfo(id));
    }

    /**
     * Get job information (without internal objects)
     * @param {string} id - Job ID
     * @returns {Object|null} Job info
     */
    getJobInfo(id) {
        const job = this.scheduledJobs.get(id);

        if (!job) {
            return null;
        }

        return {
            id: job.id,
            type: job.type,
            scheduledTime: job.scheduledTime,
            cronExpression: job.cronExpression,
            recipient: job.recipient,
            message: job.message,
            createdAt: job.createdAt,
        };
    }

    /**
     * Persist jobs to file
     */
    async persistJobs() {
        try {
            const jobsData = Array.from(this.scheduledJobs.values()).map(job => ({
                id: job.id,
                type: job.type,
                scheduledTime: job.scheduledTime,
                cronExpression: job.cronExpression,
                recipient: job.recipient,
                message: job.message,
                createdAt: job.createdAt,
            }));

            await fs.writeFile(this.jobsFilePath, JSON.stringify(jobsData, null, 2));
            logger.debug('Jobs persisted to file');
        } catch (error) {
            logger.error(`Failed to persist jobs: ${error.message}`);
        }
    }

    /**
     * Load persisted jobs from file
     */
    async loadPersistedJobs() {
        try {
            const data = await fs.readFile(this.jobsFilePath, 'utf-8');
            const jobs = JSON.parse(data);

            for (const job of jobs) {
                if (job.type === 'one-time') {
                    const scheduledTime = new Date(job.scheduledTime);

                    // Only restore if still in the future
                    if (scheduledTime > new Date()) {
                        this.scheduleOneTime(job.id, scheduledTime, job.recipient, job.message);
                        logger.info(`Restored one-time job: ${job.id}`);
                    }
                } else if (job.type === 'recurring') {
                    this.scheduleRecurring(job.id, job.cronExpression, job.recipient, job.message);
                    logger.info(`Restored recurring job: ${job.id}`);
                }
            }

            logger.success(`Loaded ${jobs.length} persisted jobs`);
        } catch (error) {
            if (error.code === 'ENOENT') {
                logger.debug('No persisted jobs file found');
            } else {
                logger.error(`Failed to load persisted jobs: ${error.message}`);
            }
        }
    }
}

module.exports = new SchedulerService();
