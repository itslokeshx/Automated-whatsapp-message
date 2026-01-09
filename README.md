<div align="center">

# 💬 WhatsApp Automation

### *Automate your WhatsApp Business messages like a pro* 🚀

[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?style=flat-square&logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![Deploy](https://img.shields.io/badge/deploy-Render-blueviolet?style=flat-square&logo=render)](https://render.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

**Send instant messages • Schedule reminders • Automate notifications**

[Quick Start](#-quick-start) • [Features](#-features) • [Deploy](#-deploy-to-render) • [Docs](#-documentation)

---

</div>

## 🎯 What is this?

A **clean, production-ready** WhatsApp automation tool that lets you:
- 📤 Send instant WhatsApp messages
- ⏰ Schedule messages for later (one-time or recurring)
- 🤖 Automate business notifications
- 📊 Manage everything from a beautiful web interface

**Perfect for:** Customer notifications, appointment reminders, marketing campaigns, team alerts

> 💡 **Clone it. Deploy it. Use it for your business.** Everything is documented and ready to go!

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🚀 **Instant Messaging**
Send WhatsApp messages immediately via the Business API

### ⏰ **Smart Scheduling**
Schedule messages for specific times or set up recurring notifications

### 📋 **Message Management**
View, manage, and cancel scheduled messages from the dashboard

</td>
<td width="50%">

### 🎨 **Beautiful UI**
Clean, minimal interface that works on any device

### 🔒 **Production Ready**
Built with proper error handling, validation, and security

### 📱 **Template Support**
Use approved WhatsApp templates for instant delivery

</td>
</tr>
</table>

---

## 🚀 Quick Start

### **1️⃣ Clone & Install**

```bash
git clone https://github.com/yourusername/Automated-whatsapp-message.git
cd Automated-whatsapp-message
npm install
```

### **2️⃣ Get WhatsApp Credentials**

You need WhatsApp Business API access. Don't have it? No worries!

👉 **[Follow our detailed setup guide →](WHATSAPP_SETUP.md)**

Quick version:
1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create a Business app
3. Add WhatsApp product
4. Copy your **Phone Number ID** and **Access Token**

### **3️⃣ Configure**

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_TOKEN=your_access_token
```

### **4️⃣ Run!**

```bash
npm start
```

🎉 **Open http://localhost:3000** and start sending messages!

---

## 🌐 Deploy to Render

### **One-Click Deploy** 🚀

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

### **Manual Deploy** (5 minutes)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push
   ```

2. **Create Web Service on Render**
   - Connect your GitHub repo
   - Build: `npm install`
   - Start: `npm start`

3. **Add Environment Variables**
   ```
   PHONE_NUMBER_ID=your_value
   WHATSAPP_TOKEN=your_value
   ```

4. **Deploy!** 🎊

👉 **[Detailed deployment guide →](DEPLOYMENT.md)**

---

## 📡 API Reference

### **Send Instant Message**

```http
POST /api/messages/send
Content-Type: application/json

{
  "to": "919444539625",
  "message": "Hello from WhatsApp Bot!"
}
```

### **Schedule One-Time Message**

```http
POST /api/messages/schedule
Content-Type: application/json

{
  "to": "919444539625",
  "message": "Reminder: Meeting at 3 PM",
  "scheduledTime": "2026-01-10T15:00:00.000Z"
}
```

### **Schedule Recurring Message**

```http
POST /api/messages/schedule
Content-Type: application/json

{
  "to": "919444539625",
  "message": "Daily standup reminder",
  "cronExpression": "0 9 * * 1-5"
}
```

<details>
<summary>📋 <strong>View all endpoints</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/messages/send` | Send instant message |
| `POST` | `/api/messages/schedule` | Schedule message |
| `GET` | `/api/messages/scheduled` | List scheduled messages |
| `DELETE` | `/api/messages/scheduled/:id` | Cancel scheduled message |
| `GET` | `/api/health` | Health check |

</details>

---

## ⚙️ Configuration

### **Environment Variables**

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PHONE_NUMBER_ID` | ✅ Yes | WhatsApp Business phone number ID | `123456789012345` |
| `WHATSAPP_TOKEN` | ✅ Yes | WhatsApp Business API access token | `EAABsbCS...` |
| `GRAPH_VERSION` | ❌ No | Facebook Graph API version | `v22.0` |
| `PORT` | ❌ No | Server port | `3000` |

### **Cron Expressions** ⏰

Schedule recurring messages with cron syntax:

```bash
0 9 * * 1-5      # Weekdays at 9 AM
0 17 * * *       # Daily at 5 PM
*/30 * * * *     # Every 30 minutes
0 0 * * 0        # Every Sunday at midnight
0 12 1 * *       # First day of month at noon
```

🔗 **[Cron expression generator](https://crontab.guru/)**

---

## ⚠️ Important to Know

### **WhatsApp Message Types**

<table>
<tr>
<td width="50%">

#### ✅ **Template Messages**
- Work immediately
- Must be pre-approved in Meta Business Manager
- Limited customization
- **Use for:** Notifications, alerts, reminders

</td>
<td width="50%">

#### 💬 **Custom Text Messages**
- Fully customizable
- Requires 24-hour conversation window*
- No approval needed
- **Use for:** Customer support, replies

</td>
</tr>
</table>

> **📌 24-Hour Window:** Opens when a customer messages you first. Lasts 24 hours from their last message.

### **Phone Number Format**

Always use **E.164 format**: `[country_code][number]`

✅ **Correct:** `919444539625`  
❌ **Wrong:** `+91 9444539625`, `9444539625`

---

## 🏗️ Project Structure

```
📦 Automated-whatsapp-message
├── 📂 src/
│   ├── 📂 config/          # Environment configuration
│   ├── 📂 services/        # WhatsApp API & scheduling
│   ├── 📂 routes/          # API endpoints
│   ├── 📂 middleware/      # Validation & error handling
│   └── 📂 utils/           # Logging utilities
├── 📂 public/
│   ├── 📂 css/            # Styles
│   ├── 📂 js/             # Frontend logic
│   └── 📄 index.html      # Web interface
├── 📂 data/               # Scheduled jobs storage
├── 📄 server.js           # Application entry
├── 📄 .env.example        # Environment template
└── 📄 package.json        # Dependencies
```

---

## 🐛 Troubleshooting

<details>
<summary><strong>❌ "Template message failed"</strong></summary>

**Solution:**
- Verify template is approved in Meta Business Manager
- Check template name matches exactly (case-sensitive)
- Ensure template language code is correct

</details>

<details>
<summary><strong>❌ "Cannot send custom text message"</strong></summary>

**Solution:**
- You need an active 24-hour conversation window
- Use a template message instead
- Or wait for the recipient to message you first

</details>

<details>
<summary><strong>❌ "Rate limit exceeded"</strong></summary>

**Solution:**
- WhatsApp has rate limits based on your tier
- Wait a few minutes before sending more messages
- Check your messaging tier in Meta Business Manager

</details>

<details>
<summary><strong>❌ Server won't start</strong></summary>

**Solution:**
- Check all environment variables are set in `.env`
- Verify Node.js version >= 18.0.0: `node --version`
- Check if port 3000 is already in use

</details>

---

## 📚 Documentation

| Guide | Description |
|-------|-------------|
| 📖 [WhatsApp Setup](WHATSAPP_SETUP.md) | Complete guide to get WhatsApp Business API credentials |
| 🚀 [Deployment Guide](DEPLOYMENT.md) | Step-by-step Render deployment instructions |
| 🔧 [API Reference](#-api-reference) | All API endpoints and examples |

---

## 🤝 Contributing

We love contributions! 💙

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

**MIT License** - Free for personal and commercial use

---

## 💬 Support & Community

- 🐛 [Report Issues](https://github.com/yourusername/Automated-whatsapp-message/issues)
- 💡 [Feature Requests](https://github.com/yourusername/Automated-whatsapp-message/discussions)
- 📧 [Email Support](mailto:your-email@example.com)

---

<div align="center">

### **Ready to automate your WhatsApp?** 🚀

**[Get Started](#-quick-start)** • **[Deploy Now](#-deploy-to-render)** • **[Read Docs](#-documentation)**

---

**Made with ❤️ for automated WhatsApp messaging**

⭐ **Star this repo if you find it useful!**

</div>