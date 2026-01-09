<div align="center">

# 💬 WhatsApp Automation

**Automate WhatsApp Business messages with scheduling**

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

*Send instant messages • Schedule reminders • Automate notifications*

</div>

---

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/yourusername/Automated-whatsapp-message.git
cd Automated-whatsapp-message
npm install

# Configure
cp .env.example .env
# Add your WhatsApp credentials to .env

# Run
npm start
```

Open **http://localhost:3000** 🎉

---

## 📋 What You Need

1. **WhatsApp Business API** credentials ([Get them here →](WHATSAPP_SETUP.md))
   - Phone Number ID
   - Access Token

2. **Node.js 18+** installed

That's it!

---

## ⚙️ Configuration

Edit `.env`:

```env
PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_TOKEN=your_access_token
```

---

## 🌐 Deploy to Render

1. Push to GitHub
2. Create Web Service on [Render](https://render.com)
3. Connect your repo
4. Add environment variables
5. Deploy!

**[Full deployment guide →](DEPLOYMENT.md)**

---

## 📡 API Examples

### Send Message

```bash
curl -X POST http://localhost:3000/api/messages/send \
  -H "Content-Type: application/json" \
  -d '{"to": "919444539625", "message": "Hello!"}'
```

### Schedule Message

```bash
curl -X POST http://localhost:3000/api/messages/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "to": "919444539625",
    "message": "Reminder",
    "scheduledTime": "2026-01-10T15:00:00.000Z"
  }'
```

### Recurring Schedule (Cron)

```bash
curl -X POST http://localhost:3000/api/messages/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "to": "919444539625",
    "cronExpression": "0 9 * * 1-5"
  }'
```

**Cron Examples:**
- `0 9 * * 1-5` - Weekdays at 9 AM
- `0 17 * * *` - Daily at 5 PM
- `*/30 * * * *` - Every 30 minutes

---

## ⚠️ Important Notes

### Message Types

| Type | Works When | Use For |
|------|------------|---------|
| **Template** | Always | Notifications, alerts |
| **Custom Text** | 24-hour window* | Customer support |

*24-hour window opens when customer messages you first

### Phone Format

Use E.164: `919444539625` (not `+91 9444539625`)

---

## 🛠️ Troubleshooting

**Template failed?** → Check it's approved in Meta Business Manager  
**Can't send text?** → Need 24-hour conversation window, use template instead  
**Rate limit?** → Wait a few minutes  
**Server won't start?** → Check `.env` variables are set

---

## 📚 Documentation

- 📖 [WhatsApp Setup Guide](WHATSAPP_SETUP.md) - Get API credentials
- 🚀 [Deployment Guide](DEPLOYMENT.md) - Deploy to Render
-  [Report Issues](https://github.com/yourusername/Automated-whatsapp-message/issues)

---

## � License

MIT - Free for personal and commercial use

---

<div align="center">

**Made with ❤️ for WhatsApp automation**

⭐ Star this repo if it helps you!

</div>