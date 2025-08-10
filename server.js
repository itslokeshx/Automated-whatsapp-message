const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Environment variables with validation
const {
  PHONE_NUMBER_ID,
  WHATSAPP_TOKEN,
  RECIPIENT,
  GRAPH_VERSION = 'v22.0',
  PORT = 3000,
} = process.env;

// Startup validation
console.log('🚀 Starting WhatsApp Message Server...');
console.log('📋 Configuration Check:');
console.log(`   ├── Phone Number ID: ${PHONE_NUMBER_ID ? '✅ Set' : '❌ Missing'}`);
console.log(`   ├── WhatsApp Token: ${WHATSAPP_TOKEN ? `✅ Set (${WHATSAPP_TOKEN.substring(0, 10)}...)` : '❌ Missing'}`);
console.log(`   ├── Default Recipient: ${RECIPIENT ? '✅ Set' : '❌ Missing'}`);
console.log(`   ├── Graph Version: ${GRAPH_VERSION}`);
console.log(`   └── Port: ${PORT}`);

if (!PHONE_NUMBER_ID || !WHATSAPP_TOKEN) {
  console.error('❌ CRITICAL ERROR: Missing required environment variables!');
  console.error('   Please check your .env file contains:');
  console.error('   - PHONE_NUMBER_ID=your_phone_number_id');
  console.error('   - WHATSAPP_TOKEN=your_access_token');
  process.exit(1);
}

const WA_URL = `https://graph.facebook.com/${GRAPH_VERSION}/${PHONE_NUMBER_ID}/messages`;

// Enhanced send function with full debugging
async function sendHelloWorld(toNumber = RECIPIENT) {
  const timestamp = new Date().toISOString();
  console.log(`\n📤 [${timestamp}] Initiating WhatsApp message send...`);
  
  // Validation
  if (!PHONE_NUMBER_ID) {
    console.error('❌ Missing PHONE_NUMBER_ID in environment variables');
    throw new Error('Missing PHONE_NUMBER_ID in .env');
  }
  if (!WHATSAPP_TOKEN) {
    console.error('❌ Missing WHATSAPP_TOKEN in environment variables');
    throw new Error('Missing WHATSAPP_TOKEN in .env');
  }
  if (!toNumber) {
    console.error('❌ Missing recipient number');
    throw new Error('Missing recipient number');
  }

  const payload = {
    messaging_product: 'whatsapp',
    to: toNumber,
    type: 'template',
    template: {
      name: 'hello_world',
      language: { code: 'en_US' }
    }
  };

  console.log('📋 Request Details:');
  console.log(`   ├── URL: ${WA_URL}`);
  console.log(`   ├── Method: POST`);
  console.log(`   ├── To: ${toNumber}`);
  console.log(`   ├── Template: hello_world`);
  console.log(`   ├── Language: en_US`);
  console.log(`   ├── Token (first 15 chars): ${WHATSAPP_TOKEN.substring(0, 15)}...`);
  console.log(`   └── Payload: ${JSON.stringify(payload, null, 2)}`);

  try {
    console.log('🌐 Making fetch request to WhatsApp API...');
    
    const startTime = Date.now();
    const res = await fetch(WA_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`📡 Response received in ${duration}ms`);
    console.log(`   ├── Status: ${res.status} ${res.statusText}`);
    console.log(`   ├── Headers: ${JSON.stringify(Object.fromEntries(res.headers.entries()), null, 2)}`);

    let data;
    try {
      data = await res.json();
      console.log(`   └── Response Body: ${JSON.stringify(data, null, 2)}`);
    } catch (jsonError) {
      console.error('❌ Failed to parse JSON response:', jsonError.message);
      const textResponse = await res.text();
      console.error('📄 Raw response text:', textResponse);
      throw new Error(`Invalid JSON response: ${jsonError.message}`);
    }
    
    if (!res.ok) {
      console.error('❌ WhatsApp API returned error status');
      console.error('📋 Error Analysis:');
      
      if (res.status === 401) {
        console.error('   ├── Status 401: Authentication failed');
        console.error('   ├── Possible causes:');
        console.error('   │   ├── Invalid access token');
        console.error('   │   ├── Expired token');
        console.error('   │   └── Insufficient permissions');
        console.error('   └── Solution: Generate new access token in Meta Developer Console');
      } else if (res.status === 400) {
        console.error('   ├── Status 400: Bad request');
        console.error('   ├── Possible causes:');
        console.error('   │   ├── Invalid phone number format');
        console.error('   │   ├── Template not approved');
        console.error('   │   └── Invalid payload structure');
      } else if (res.status === 403) {
        console.error('   ├── Status 403: Forbidden');
        console.error('   ├── Possible causes:');
        console.error('   │   ├── Phone number not verified');
        console.error('   │   ├── Recipient not in allowed list');
        console.error('   │   └── Rate limiting');
      }
      
      throw new Error(`WhatsApp API error: ${res.status} ${res.statusText} - ${JSON.stringify(data)}`);
    }
    
    console.log('✅ Message sent successfully!');
    console.log(`📊 Success Details:`);
    console.log(`   ├── Message ID: ${data.messages?.[0]?.id || 'N/A'}`);
    console.log(`   ├── Recipient: ${toNumber}`);
    console.log(`   └── Response: ${JSON.stringify(data, null, 2)}`);
    
    return data;
    
  } catch (fetchError) {
    console.error('🚫 Fetch operation failed');
    console.error('📋 Error Analysis:');
    console.error(`   ├── Error Type: ${fetchError.constructor.name}`);
    console.error(`   ├── Error Message: ${fetchError.message}`);
    console.error(`   ├── Error Code: ${fetchError.code || 'N/A'}`);
    
    if (fetchError.message.includes('ENOTFOUND')) {
      console.error('   ├── DNS Resolution failed');
      console.error('   └── Check internet connection and DNS settings');
    } else if (fetchError.message.includes('ECONNREFUSED')) {
      console.error('   ├── Connection refused');
      console.error('   └── Check firewall settings and network access');
    } else if (fetchError.message.includes('timeout')) {
      console.error('   ├── Request timeout');
      console.error('   └── Network is slow or endpoint is unresponsive');
    }
    
    console.error(`   └── Full Error Stack: ${fetchError.stack}`);
    throw new Error(`Network error: ${fetchError.message}`);
  }
}

// Root route with debugging
app.get('/', (req, res) => {
  console.log(`📱 [${new Date().toISOString()}] Root route accessed from ${req.ip}`);
  const indexPath = path.join(__dirname, 'public', 'index.html');
  console.log(`📂 Serving index.html from: ${indexPath}`);
  res.sendFile(indexPath);
});

// API endpoint with comprehensive debugging
app.post('/api/send', async (req, res) => {
  const timestamp = new Date().toISOString();
  console.log(`\n🔥 [${timestamp}] API /send endpoint called`);
  console.log(`📋 Request Info:`);
  console.log(`   ├── IP: ${req.ip}`);
  console.log(`   ├── User-Agent: ${req.get('User-Agent')}`);
  console.log(`   ├── Content-Type: ${req.get('Content-Type')}`);
  console.log(`   └── Body: ${JSON.stringify(req.body, null, 2)}`);

  try {
    const { to } = req.body || {};
    const targetNumber = to || RECIPIENT;
    
    console.log(`📞 Target recipient: ${targetNumber}`);
    
    if (!targetNumber) {
      console.error('❌ No recipient specified and no default RECIPIENT in .env');
      return res.status(400).json({ 
        ok: false, 
        error: 'No recipient specified. Provide "to" in request body or set RECIPIENT in .env' 
      });
    }

    const result = await sendHelloWorld(targetNumber);
    
    console.log('✅ API call successful, sending response');
    res.json({ 
      ok: true, 
      result, 
      message: 'Message sent successfully!',
      timestamp,
      recipient: targetNumber
    });
    
  } catch (error) {
    console.error('❌ API call failed');
    console.error(`   ├── Error: ${error.message}`);
    console.error(`   └── Stack: ${error.stack}`);
    
    res.status(500).json({ 
      ok: false, 
      error: error.message,
      timestamp,
      details: 'Check server logs for full error details'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log(`🏥 [${new Date().toISOString()}] Health check requested`);
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage()
    },
    config: {
      hasPhoneNumberId: !!PHONE_NUMBER_ID,
      hasToken: !!WHATSAPP_TOKEN,
      hasRecipient: !!RECIPIENT,
      graphVersion: GRAPH_VERSION
    }
  });
});

// 🕐 AUTOMATED MESSAGE SCHEDULING - DAILY AT 5:00 PM
cron.schedule('0 17 * * *', async () => {
  const timestamp = new Date().toISOString();
  console.log(`\n⏰ [${timestamp}] CRON TRIGGER: Daily 5:00 PM automated message`);
  console.log('🔥 Sending scheduled WhatsApp message...');
  
  try {
    const result = await sendHelloWorld();
    console.log('✅ CRON SUCCESS: Daily 5 PM message sent successfully!');
    console.log(`📊 Message Details: ${JSON.stringify(result, null, 2)}`);
    console.log(`📱 Sent to: ${RECIPIENT}`);
    console.log(`⏰ Time: ${new Date().toLocaleString()}`);
  } catch (error) {
    console.error(`❌ CRON FAILED: Daily 5 PM message failed`);
    console.error(`📋 Error: ${error.message}`);
    console.error(`🕐 Failed at: ${new Date().toLocaleString()}`);
  }
});

// Optional: Test cron job that runs every minute (uncomment for testing)
// cron.schedule('* * * * *', async () => {
//   const timestamp = new Date().toISOString();
//   console.log(`\n🧪 [${timestamp}] TEST CRON: Every minute trigger`);
//   try {
//     const result = await sendHelloWorld();
//     console.log('✅ TEST CRON SUCCESS: Message sent');
//   } catch (error) {
//     console.error(`❌ TEST CRON FAILED: ${error.message}`);
//   }
// });

// Global error handlers
process.on('uncaughtException', (error) => {
  console.error('🚨 UNCAUGHT EXCEPTION:', error);
  console.error('Stack:', error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 UNHANDLED REJECTION at:', promise);
  console.error('Reason:', reason);
});

// Start server with debugging
app.listen(PORT, () => {
  console.log('\n🎉 Server started successfully!');
  console.log('📋 Server Info:');
  console.log(`   ├── URL: http://localhost:${PORT}`);
  console.log(`   ├── Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   ├── Node Version: ${process.version}`);
  console.log(`   ├── Platform: ${process.platform}`);
  console.log(`   └── Process ID: ${process.pid}`);
  console.log('\n📡 Available Endpoints:');
  console.log(`   ├── GET  /           → Web interface`);
  console.log(`   ├── POST /api/send   → Send WhatsApp message`);
  console.log(`   └── GET  /api/health → Health check`);
  console.log('\n⏰ Automated Scheduling:');
  console.log(`   ├── Daily at 5:00 PM: ✅ ACTIVE`);
  console.log(`   ├── Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`);
  console.log(`   ├── Current Time: ${new Date().toLocaleString()}`);
  console.log(`   └── Next 5 PM: ${getNext5PM()}`);
  console.log('\n🔥 Ready to send WhatsApp messages!');
  console.log('💡 Visit http://localhost:3000 to use the web interface');
});

// Helper function to show next 5 PM
function getNext5PM() {
  const now = new Date();
  const next5PM = new Date();
  next5PM.setHours(17, 0, 0, 0);
  
  if (now.getHours() >= 17) {
    next5PM.setDate(next5PM.getDate() + 1);
  }
  
  return next5PM.toLocaleString();
}
