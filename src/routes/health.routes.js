const express = require('express');
const router = express.Router();
const { config } = require('../config/environment');

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: {
            nodeVersion: process.version,
            platform: process.platform,
            uptime: Math.floor(process.uptime()),
            timezone: process.env.TZ,
        },
        config: {
            hasPhoneNumberId: !!config.whatsapp.phoneNumberId,
            hasToken: !!config.whatsapp.token,
            hasDefaultRecipient: !!config.whatsapp.defaultRecipient,
            graphVersion: config.whatsapp.graphVersion,
        },
    });
});

module.exports = router;
