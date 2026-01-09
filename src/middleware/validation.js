const logger = require('../utils/logger');

/**
 * Input Validation Middleware
 */

/**
 * Validate phone number format (E.164)
 */
function validatePhoneNumber(phoneNumber) {
    // E.164 format: + followed by 1-15 digits
    const e164Regex = /^\+?[1-9]\d{1,14}$/;

    if (!phoneNumber) {
        return { valid: false, error: 'Phone number is required' };
    }

    // Remove any spaces or dashes
    const cleaned = phoneNumber.replace(/[\s-]/g, '');

    if (!e164Regex.test(cleaned)) {
        return {
            valid: false,
            error: 'Invalid phone number format. Use E.164 format (e.g., 919444539625)'
        };
    }

    return { valid: true, cleaned };
}

/**
 * Validate message sending request
 */
function validateSendMessage(req, res, next) {
    const { to, message } = req.body;

    const phoneValidation = validatePhoneNumber(to);
    if (!phoneValidation.valid) {
        return res.status(400).json({
            success: false,
            error: phoneValidation.error,
        });
    }

    // Update with cleaned phone number
    req.body.to = phoneValidation.cleaned;

    next();
}

/**
 * Validate schedule message request
 */
function validateScheduleMessage(req, res, next) {
    const { to, scheduledTime, cronExpression, message } = req.body;

    // Validate phone number
    const phoneValidation = validatePhoneNumber(to);
    if (!phoneValidation.valid) {
        return res.status(400).json({
            success: false,
            error: phoneValidation.error,
        });
    }

    req.body.to = phoneValidation.cleaned;

    // Validate scheduling type
    if (!scheduledTime && !cronExpression) {
        return res.status(400).json({
            success: false,
            error: 'Either scheduledTime or cronExpression is required',
        });
    }

    if (scheduledTime && cronExpression) {
        return res.status(400).json({
            success: false,
            error: 'Provide either scheduledTime or cronExpression, not both',
        });
    }

    // Validate scheduled time if provided
    if (scheduledTime) {
        const time = new Date(scheduledTime);
        if (isNaN(time.getTime())) {
            return res.status(400).json({
                success: false,
                error: 'Invalid scheduledTime format. Use ISO 8601 format',
            });
        }

        if (time <= new Date()) {
            return res.status(400).json({
                success: false,
                error: 'scheduledTime must be in the future',
            });
        }
    }

    next();
}

module.exports = {
    validatePhoneNumber,
    validateSendMessage,
    validateScheduleMessage,
};
