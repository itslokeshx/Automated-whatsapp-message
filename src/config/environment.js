require('dotenv').config();

/**
 * Environment Configuration
 * Loads and validates all environment variables
 */

const config = {
  // WhatsApp API Configuration
  whatsapp: {
    phoneNumberId: process.env.PHONE_NUMBER_ID,
    token: process.env.WHATSAPP_TOKEN,
    graphVersion: process.env.GRAPH_VERSION || 'v22.0',
    defaultRecipient: process.env.RECIPIENT,
  },

  // Server Configuration
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    env: process.env.NODE_ENV || 'development',
  },

  // Timezone Configuration
  timezone: 'Asia/Kolkata',
};

/**
 * Validate required environment variables
 */
function validateConfig() {
  const errors = [];

  if (!config.whatsapp.phoneNumberId) {
    errors.push('PHONE_NUMBER_ID is required');
  }

  if (!config.whatsapp.token) {
    errors.push('WHATSAPP_TOKEN is required');
  }

  if (errors.length > 0) {
    console.error('❌ Configuration Error:');
    errors.forEach(error => console.error(`   - ${error}`));
    throw new Error('Missing required environment variables');
  }

  console.log('✅ Configuration validated successfully');
}

// Set timezone
process.env.TZ = config.timezone;

module.exports = { config, validateConfig };
