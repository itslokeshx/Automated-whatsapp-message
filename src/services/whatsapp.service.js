const { config } = require('../config/environment');
const logger = require('../utils/logger');

/**
 * WhatsApp Service
 * Handles all WhatsApp API interactions
 */

const WA_URL = `https://graph.facebook.com/${config.whatsapp.graphVersion}/${config.whatsapp.phoneNumberId}/messages`;

class WhatsAppService {
    /**
     * Send a template message via WhatsApp
     * @param {string} to - Recipient phone number in E.164 format
     * @param {string} templateName - Name of the approved template
     * @param {string} languageCode - Language code (default: en_US)
     * @returns {Promise<Object>} API response
     */
    async sendTemplateMessage(to, templateName = 'hello_world', languageCode = 'en_US') {
        logger.info(`Sending template message to ${to}`);

        if (!to) {
            throw new Error('Recipient phone number is required');
        }

        const payload = {
            messaging_product: 'whatsapp',
            to,
            type: 'template',
            template: {
                name: templateName,
                language: { code: languageCode },
            },
        };

        try {
            logger.debug(`WhatsApp API URL: ${WA_URL}`);
            logger.debug(`Payload: ${JSON.stringify(payload, null, 2)}`);

            const startTime = Date.now();
            const response = await fetch(WA_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${config.whatsapp.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const duration = Date.now() - startTime;
            const data = await response.json();

            if (!response.ok) {
                logger.error(`WhatsApp API error (${response.status}):`, data);

                // Provide user-friendly error messages
                const errorCode = data.error?.code;
                const errorMessage = data.error?.message || response.statusText;

                let userMessage = errorMessage;
                if (errorCode === 131000) {
                    userMessage = 'Template message failed. Please verify your template is approved in Meta Business Manager.';
                } else if (errorCode === 131026) {
                    userMessage = 'Message could not be delivered. The recipient may have blocked your business number.';
                } else if (errorCode === 131047) {
                    userMessage = 'Rate limit exceeded. Please wait before sending more messages.';
                }

                throw new Error(userMessage);
            }

            logger.success(`Message sent successfully in ${duration}ms`);
            logger.debug(`Message ID: ${data.messages?.[0]?.id}`);

            return {
                success: true,
                messageId: data.messages?.[0]?.id,
                recipient: to,
                timestamp: new Date().toISOString(),
                data,
            };
        } catch (error) {
            logger.error(`Failed to send message: ${error.message}`);
            throw error;
        }
    }

    /**
     * Send a text message via WhatsApp
     * @param {string} to - Recipient phone number in E.164 format
     * @param {string} message - Message text
     * @returns {Promise<Object>} API response
     */
    async sendTextMessage(to, message) {
        logger.info(`Sending text message to ${to}`);

        if (!to || !message) {
            throw new Error('Recipient and message are required');
        }

        const payload = {
            messaging_product: 'whatsapp',
            to,
            type: 'text',
            text: { body: message },
        };

        try {
            const response = await fetch(WA_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${config.whatsapp.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                logger.error(`WhatsApp API error (${response.status}):`, data);

                // Provide user-friendly error messages
                const errorCode = data.error?.code;
                const errorMessage = data.error?.message || response.statusText;

                let userMessage = errorMessage;
                if (errorCode === 131000) {
                    userMessage = 'Cannot send custom text message. You need an active 24-hour conversation window with this recipient. Use a template message instead, or wait for the recipient to message you first.';
                } else if (errorCode === 131026) {
                    userMessage = 'Message could not be delivered. The recipient may have blocked your business number.';
                } else if (errorCode === 131047) {
                    userMessage = 'Rate limit exceeded. Please wait before sending more messages.';
                } else if (errorCode === 131051) {
                    userMessage = 'This phone number is not registered with WhatsApp Business API.';
                }

                throw new Error(userMessage);
            }

            logger.success(`Text message sent successfully`);

            return {
                success: true,
                messageId: data.messages?.[0]?.id,
                recipient: to,
                timestamp: new Date().toISOString(),
                data,
            };
        } catch (error) {
            logger.error(`Failed to send text message: ${error.message}`);
            throw error;
        }
    }
}

module.exports = new WhatsAppService();
