const logger = require('../utils/logger');

/**
 * Global Error Handler Middleware
 */
function errorHandler(err, req, res, next) {
    logger.error(`Error: ${err.message}`);
    logger.debug(`Stack: ${err.stack}`);

    // Default error response
    const statusCode = err.statusCode || 500;
    const response = {
        success: false,
        error: err.message || 'Internal server error',
        timestamp: new Date().toISOString(),
    };

    // Add stack trace in development
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
}

/**
 * 404 Not Found Handler
 */
function notFoundHandler(req, res) {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        path: req.path,
        timestamp: new Date().toISOString(),
    });
}

module.exports = {
    errorHandler,
    notFoundHandler,
};
