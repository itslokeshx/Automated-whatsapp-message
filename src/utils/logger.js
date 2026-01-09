/**
 * Logger Utility
 * Provides consistent logging across the application
 */

const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m',
};

function getTimestamp() {
    return new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
}

const logger = {
    info: (message, ...args) => {
        console.log(`${colors.cyan}ℹ [${getTimestamp()}]${colors.reset} ${message}`, ...args);
    },

    success: (message, ...args) => {
        console.log(`${colors.green}✓ [${getTimestamp()}]${colors.reset} ${message}`, ...args);
    },

    warn: (message, ...args) => {
        console.warn(`${colors.yellow}⚠ [${getTimestamp()}]${colors.reset} ${message}`, ...args);
    },

    error: (message, ...args) => {
        console.error(`${colors.red}✗ [${getTimestamp()}]${colors.reset} ${message}`, ...args);
    },

    debug: (message, ...args) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`${colors.gray}⚙ [${getTimestamp()}]${colors.reset} ${message}`, ...args);
        }
    },
};

module.exports = logger;
