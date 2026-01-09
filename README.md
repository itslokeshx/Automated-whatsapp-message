# 📱 WhatsApp Automation

> **Automate WhatsApp messages with scheduling and templates**  
> A clean, production-ready tool anyone can deploy to Render for their business.

![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

- 📤 **Send Messages** - Instant WhatsApp messages via Business API
- ⏰ **Schedule Messages** - One-time or recurring (cron-based)
- 📋 **Manage Schedules** - View and cancel scheduled messages
- 🎯 **Template Support** - Use approved WhatsApp message templates
- 🔒 **Production Ready** - Error handling, validation, logging
- 📱 **Responsive UI** - Clean, minimal interface that works everywhere

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/Automated-whatsapp-message.git
cd Automated-whatsapp-message
npm install
```

### 2. Get WhatsApp Business API Credentials

You need a WhatsApp Business API account. Here's how:

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create an app and select "Business" type
3. Add "WhatsApp" product to your app
4. Get your credentials:
   - **Phone Number ID**: Found in WhatsApp > API Setup
   - **Access Token**: Generate in WhatsApp > API Setup
   - **Graph API Version**: Use `v22.0` (or latest)

📖 **Detailed Guide**: See [WHATSAPP_SETUP.md](./WHATSAPP_SETUP.md) for step-by-step instructions

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
PHONE_NUMBER_ID=your_phone_number_id_here
WHATSAPP_TOKEN=your_access_token_here
GRAPH_VERSION=v22.0
PORT=3000
```

### 4. Run Locally

```bash
npm start
```

Open http://localhost:3000 in your browser.

## 🌐 Deploy to Render

### One-Click Deploy

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

### Manual Deployment

1. **Create a new Web Service** on [Render](https://render.com)
2. **Connect your GitHub repository**
3. **Configure**:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. **Add Environment Variables**:
   ```
   PHONE_NUMBER_ID=your_value
   WHATSAPP_TOKEN=your_value
   GRAPH_VERSION=v22.0
   PORT=3000
   ```
5. **Deploy!**

📖 **Detailed Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete instructions

## 📡 API Reference

### Send Message

```http
POST /api/messages/send
Content-Type: application/json

{
  "to": "919444539625",
  "message": "Hello!" // Optional - leave empty for template
}
```

### Schedule Message (One-time)

```http
POST /api/messages/schedule
Content-Type: application/json

{
  "to": "919444539625",
  "message": "Reminder",
  "scheduledTime": "2026-01-10T17:00:00.000Z"
}
```

### Schedule Message (Recurring)

```http
POST /api/messages/schedule
Content-Type: application/json

{
  "to": "919444539625",
  "cronExpression": "0 17 * * *" // Daily at 5 PM
}
```

### List Scheduled Messages

```http
GET /api/messages/scheduled
```

### Cancel Scheduled Message

```http
DELETE /api/messages/scheduled/:id
```

### Health Check

```http
GET /api/health
```

## ⚙️ Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PHONE_NUMBER_ID` | WhatsApp Business phone number ID | ✅ | - |
| `WHATSAPP_TOKEN` | WhatsApp Business API access token | ✅ | - |
| `GRAPH_VERSION` | Facebook Graph API version | ❌ | `v22.0` |
| `PORT` | Server port | ❌ | `3000` |
| `RECIPIENT` | Default recipient (optional) | ❌ | - |

## 📝 Cron Expression Examples

```
0 17 * * *      # Daily at 5:00 PM
0 9 * * 1-5     # Weekdays at 9:00 AM
*/30 * * * *    # Every 30 minutes
0 0 * * 0       # Every Sunday at midnight
0 12 1 * *      # First day of month at noon
```

## ⚠️ Important Notes

### WhatsApp Message Limitations

- **Template Messages**: Work immediately (must be pre-approved in Meta Business Manager)
- **Custom Text Messages**: Require an active 24-hour conversation window
  - Window opens when recipient messages you first
  - Window lasts 24 hours from their last message
  - Use templates if no active window exists

### Phone Number Format

Use E.164 format: `[country_code][number]`
- ✅ Correct: `919444539625`
- ❌ Wrong: `+91 9444539625`, `9444539625`

## 🏗️ Project Structure

```
├── src/
│   ├── config/          # Environment configuration
│   ├── services/        # WhatsApp API & scheduling logic
│   ├── routes/          # API endpoints
│   ├── middleware/      # Validation & error handling
│   └── utils/           # Logging utilities
├── public/
│   ├── css/            # Styles
│   ├── js/             # Frontend logic
│   └── index.html      # Web interface
├── data/               # Persisted scheduled jobs
└── server.js           # Application entry point
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run in development mode
npm start

# The server will restart automatically on file changes
```

## 🔒 Security

- ✅ Environment variables (never commit `.env`)
- ✅ Input validation on all endpoints
- ✅ Phone number format validation
- ✅ Error handling with sanitized responses
- ✅ CORS enabled for API access

## 🐛 Troubleshooting

### "Template message failed"
- Verify your template is approved in Meta Business Manager
- Check template name matches exactly

### "Cannot send custom text message"
- You need an active 24-hour conversation window
- Use a template message instead
- Or wait for recipient to message you first

### "Rate limit exceeded"
- WhatsApp has rate limits
- Wait a few minutes before sending more messages

### Server won't start
- Check all environment variables are set
- Verify Node.js version >= 18.0.0
- Check port 3000 is not in use

## 📄 License

MIT License - Free for personal and commercial use

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a PR.

## 📧 Support

- 📖 [Documentation](./docs/)
- 🐛 [Report Issues](https://github.com/yourusername/Automated-whatsapp-message/issues)
- 💬 [Discussions](https://github.com/yourusername/Automated-whatsapp-message/discussions)

---

**Made for automated WhatsApp messaging** 🚀