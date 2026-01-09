# 📱 WhatsApp Automation Bot

A powerful, automated WhatsApp message scheduler with a premium dark-themed web interface. Schedule one-time or recurring messages with ease using the WhatsApp Business API.

![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

- **📤 Instant Messaging**: Send WhatsApp messages immediately
- **⏰ Smart Scheduling**: Schedule messages for specific times or recurring intervals
- **🎨 Premium UI**: Beautiful dark-themed interface with glassmorphism effects
- **🔄 Recurring Messages**: Set up daily, weekly, or custom cron-based schedules
- **💾 Persistent Storage**: Scheduled messages survive server restarts
- **📊 Real-time Status**: Monitor server health and scheduled messages
- **🎯 Template Support**: Use approved WhatsApp templates or custom messages
- **🌐 RESTful API**: Clean API endpoints for all operations

## 🏗️ Architecture

```
Automated-whatsapp-message/
├── src/
│   ├── config/
│   │   └── environment.js      # Environment configuration
│   ├── services/
│   │   ├── whatsapp.service.js # WhatsApp API integration
│   │   └── scheduler.service.js # Message scheduling logic
│   ├── routes/
│   │   ├── message.routes.js   # Message endpoints
│   │   └── health.routes.js    # Health check endpoints
│   ├── middleware/
│   │   ├── validation.js       # Input validation
│   │   └── errorHandler.js     # Error handling
│   └── utils/
│       └── logger.js           # Logging utility
├── public/
│   ├── css/
│   │   ├── design-system.css   # Design tokens & utilities
│   │   └── components.css      # UI components
│   ├── js/
│   │   ├── app.js             # Main application logic
│   │   └── scheduler.js       # Scheduling UI logic
│   └── index.html             # Main interface
├── data/
│   └── scheduled-jobs.json    # Persisted scheduled messages
├── server.js                  # Application entry point
├── .env                       # Environment variables (not in git)
├── .env.example              # Environment template
└── package.json              # Dependencies

```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- WhatsApp Business API account
- Meta Developer account with approved WhatsApp Business app

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Automated-whatsapp-message.git
   cd Automated-whatsapp-message
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your credentials:
   ```env
   PHONE_NUMBER_ID=your_phone_number_id
   WHATSAPP_TOKEN=your_access_token
   RECIPIENT=919444539625
   GRAPH_VERSION=v22.0
   PORT=3000
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📡 API Endpoints

### Send Immediate Message
```http
POST /api/messages/send
Content-Type: application/json

{
  "to": "919444539625",
  "message": "Hello from WhatsApp Bot!" // Optional
}
```

### Schedule Message (One-time)
```http
POST /api/messages/schedule
Content-Type: application/json

{
  "to": "919444539625",
  "message": "Scheduled message",
  "scheduledTime": "2026-01-10T17:00:00.000Z"
}
```

### Schedule Message (Recurring)
```http
POST /api/messages/schedule
Content-Type: application/json

{
  "to": "919444539625",
  "message": "Daily reminder",
  "cronExpression": "0 17 * * *"
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
| `PHONE_NUMBER_ID` | WhatsApp Business phone number ID | ✅ Yes | - |
| `WHATSAPP_TOKEN` | WhatsApp Business API access token | ✅ Yes | - |
| `RECIPIENT` | Default recipient phone number | ❌ No | - |
| `GRAPH_VERSION` | Facebook Graph API version | ❌ No | `v22.0` |
| `PORT` | Server port | ❌ No | `3000` |
| `NODE_ENV` | Environment (development/production) | ❌ No | `development` |

## 🎨 Features Showcase

### Premium Dark Theme
- Vibrant gradient accents
- Glassmorphism effects
- Smooth animations and transitions
- Responsive design for all devices

### Smart Scheduling
- **One-time**: Schedule messages for specific dates and times
- **Recurring**: Use cron expressions for repeating schedules
  - Daily at 5 PM: `0 17 * * *`
  - Every Monday at 10 AM: `0 10 * * 1`
  - Every hour: `0 * * * *`

### Message Management
- View all scheduled messages
- Cancel scheduled messages
- Real-time status updates
- Toast notifications for all actions

## 🔧 Development

The project uses a clean, modular architecture:

- **Services**: Business logic (WhatsApp API, scheduling)
- **Routes**: API endpoints
- **Middleware**: Validation and error handling
- **Utils**: Shared utilities (logging)

## 📝 Cron Expression Examples

```
0 17 * * *      # Daily at 5:00 PM
0 9 * * 1-5     # Weekdays at 9:00 AM
*/30 * * * *    # Every 30 minutes
0 0 * * 0       # Every Sunday at midnight
0 12 1 * *      # First day of month at noon
```

## 🛡️ Security

- Environment variables stored in `.env` (not committed to git)
- Input validation on all endpoints
- Phone number format validation (E.164)
- Error handling with sanitized responses

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Made with ❤️ for automated WhatsApp messaging**