const express = require('express');
const router = express.Router();
const whatsappService = require('../services/whatsapp.service');
const schedulerService = require('../services/scheduler.service');
const { validateSendMessage, validateScheduleMessage } = require('../middleware/validation');
const { config } = require('../config/environment');
const logger = require('../utils/logger');

/**
 * POST /api/messages/send
 * Send an immediate WhatsApp message
 */
router.post('/send', validateSendMessage, async (req, res, next) => {
    try {
        const { to, message } = req.body;
        const recipient = to || config.whatsapp.defaultRecipient;

        if (!recipient) {
            return res.status(400).json({
                success: false,
                error: 'No recipient specified and no default recipient configured',
            });
        }

        let result;
        if (message) {
            result = await whatsappService.sendTextMessage(recipient, message);
        } else {
            result = await whatsappService.sendTemplateMessage(recipient);
        }

        res.json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/messages/schedule
 * Schedule a WhatsApp message (one-time or recurring)
 */
router.post('/schedule', validateScheduleMessage, async (req, res, next) => {
    try {
        const { to, scheduledTime, cronExpression, message } = req.body;

        // Generate unique ID
        const id = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        let job;
        if (scheduledTime) {
            // One-time scheduled message
            job = schedulerService.scheduleOneTime(
                id,
                new Date(scheduledTime),
                to,
                message
            );
        } else {
            // Recurring scheduled message
            job = schedulerService.scheduleRecurring(
                id,
                cronExpression,
                to,
                message
            );
        }

        res.json({
            success: true,
            job,
            message: 'Message scheduled successfully',
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/messages/scheduled
 * Get all scheduled messages
 */
router.get('/scheduled', (req, res) => {
    const jobs = schedulerService.getAllJobs();

    res.json({
        success: true,
        count: jobs.length,
        jobs,
    });
});

/**
 * DELETE /api/messages/scheduled/:id
 * Cancel a scheduled message
 */
router.delete('/scheduled/:id', (req, res) => {
    const { id } = req.params;

    const cancelled = schedulerService.cancelJob(id);

    if (!cancelled) {
        return res.status(404).json({
            success: false,
            error: 'Scheduled message not found',
        });
    }

    res.json({
        success: true,
        message: 'Scheduled message cancelled',
    });
});

module.exports = router;
