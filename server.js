const express = require('express');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');

// Import configuration and services
const { config, validateConfig } = require('./src/config/environment');
const logger = require('./src/utils/logger');
const whatsappService = require('./src/services/whatsapp.service');
const schedulerService = require('./src/services/scheduler.service');

// Import routes
const messageRoutes = require('./src/routes/message.routes');
const healthRoutes = require('./src/routes/health.routes');

// Import middleware
const { errorHandler, notFoundHandler } = require('./src/middleware/errorHandler');

/**
 * WhatsApp Automation Server
 * Clean, modular architecture for automated WhatsApp messaging
 */

// Validate configuration
try {
  validateConfig();
} catch (error) {
  logger.error('Configuration validation failed');
  process.exit(1);
}

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/api/messages', messageRoutes);
app.use('/api/health', healthRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Global error handlers
process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  logger.debug(error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection: ${reason}`);
});

/**
 * Initialize services and start server
 */
async function startServer() {
  try {
    // Initialize scheduler service
    await schedulerService.initialize();

    // Setup default daily scheduled message (5:40 PM IST)
    const defaultJobId = 'daily_540pm_message';
    const existingJobs = schedulerService.getAllJobs();
    const hasDefaultJob = existingJobs.some(job => job.id === defaultJobId);

    if (!hasDefaultJob && config.whatsapp.defaultRecipient) {
      schedulerService.scheduleRecurring(
        defaultJobId,
        '40 17 * * *', // Daily at 5:40 PM
        config.whatsapp.defaultRecipient,
        null // Use template message
      );
      logger.info('Default daily message scheduled for 5:40 PM IST');
    }

    // Start server
    app.listen(config.server.port, () => {
      logger.success('WhatsApp Automation Server started!');
      logger.info(`Server running on http://localhost:${config.server.port}`);
      logger.info(`Environment: ${config.server.env}`);
      logger.info(`Timezone: ${process.env.TZ}`);
      logger.info(`Current time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);

      console.log('\n📡 Available Endpoints:');
      console.log('   ├── GET  /                          → Web interface');
      console.log('   ├── POST /api/messages/send         → Send immediate message');
      console.log('   ├── POST /api/messages/schedule     → Schedule message');
      console.log('   ├── GET  /api/messages/scheduled    → List scheduled messages');
      console.log('   ├── DELETE /api/messages/scheduled/:id → Cancel scheduled message');
      console.log('   └── GET  /api/health                → Health check');
      console.log('');
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
}

// Start the server
startServer();
