# Deploying to Render

This guide walks you through deploying your WhatsApp Automation tool to Render.

## Prerequisites

- GitHub account
- Render account (free tier works)
- WhatsApp Business API credentials

## Step-by-Step Deployment

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/Automated-whatsapp-message.git
git push -u origin main
```

### 2. Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the `Automated-whatsapp-message` repository

### 3. Configure Service

**Basic Settings:**
- **Name**: `whatsapp-automation` (or your choice)
- **Region**: Choose closest to you
- **Branch**: `main`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Instance Type:**
- Select **Free** (or paid for production)

### 4. Add Environment Variables

Click **"Advanced"** and add these environment variables:

| Key | Value | Notes |
|-----|-------|-------|
| `PHONE_NUMBER_ID` | Your phone number ID | From Meta Developer Console |
| `WHATSAPP_TOKEN` | Your access token | From Meta Developer Console |
| `GRAPH_VERSION` | `v22.0` | Or latest version |
| `PORT` | `3000` | Render will override this |
| `NODE_ENV` | `production` | Optional |

### 5. Deploy

1. Click **"Create Web Service"**
2. Render will automatically build and deploy
3. Wait for deployment to complete (2-3 minutes)
4. Your app will be live at: `https://your-app-name.onrender.com`

## Post-Deployment

### Test Your Deployment

1. Visit your Render URL
2. Click "Check Health" to verify server status
3. Try sending a test message

### View Logs

1. Go to your service in Render Dashboard
2. Click **"Logs"** tab
3. Monitor real-time logs

### Update Deployment

Render auto-deploys on every push to `main`:

```bash
git add .
git commit -m "Update message"
git push
```

## Environment Variables Reference

### Required

```env
PHONE_NUMBER_ID=123456789012345
WHATSAPP_TOKEN=EAABsbCS...
```

### Optional

```env
GRAPH_VERSION=v22.0
PORT=3000
RECIPIENT=919444539625
NODE_ENV=production
```

## Troubleshooting

### Build Failed

**Error**: `npm install` fails
- Check `package.json` is valid
- Verify Node.js version in `package.json`

**Solution**:
```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### Service Won't Start

**Error**: Server crashes on startup
- Check environment variables are set
- View logs for specific error

**Solution**: Verify all required env vars in Render dashboard

### WhatsApp API Errors

**Error**: Template message fails
- Verify template is approved in Meta Business Manager
- Check access token is valid

**Solution**: Regenerate access token if expired

### Scheduled Jobs Not Persisting

**Error**: Jobs lost on restart
- Free tier restarts after inactivity
- `data/scheduled-jobs.json` is ephemeral

**Solution**: 
- Upgrade to paid tier for persistent disk
- Or use external database (MongoDB, PostgreSQL)

## Custom Domain (Optional)

1. Go to your service → **"Settings"**
2. Scroll to **"Custom Domains"**
3. Click **"Add Custom Domain"**
4. Follow DNS configuration instructions

## Monitoring

### Health Checks

Render automatically monitors: `https://your-app.onrender.com/api/health`

### Alerts

1. Go to service → **"Settings"**
2. Configure **"Notifications"**
3. Add email for deployment alerts

## Scaling

### Free Tier Limitations

- Spins down after 15 minutes of inactivity
- 750 hours/month free
- Shared CPU/memory

### Upgrade for Production

- **Starter**: $7/month - Always on, faster
- **Standard**: $25/month - More resources
- **Pro**: Custom pricing

## Security Best Practices

1. **Never commit `.env`** - Already in `.gitignore`
2. **Rotate tokens regularly** - Update in Render dashboard
3. **Use HTTPS only** - Render provides free SSL
4. **Monitor logs** - Check for suspicious activity

## Backup & Recovery

### Backup Scheduled Jobs

Download `data/scheduled-jobs.json` periodically:

```bash
# SSH into Render (paid tier only)
render ssh

# Or use API to export jobs
curl https://your-app.onrender.com/api/messages/scheduled > backup.json
```

### Restore

Re-create jobs via API or UI after deployment.

## Cost Estimate

### Free Tier
- **Cost**: $0/month
- **Limitations**: Spins down, slower

### Production Setup
- **Web Service**: $7-25/month
- **Persistent Disk** (optional): $1/GB/month
- **Total**: ~$10-30/month

## Support

- 📖 [Render Docs](https://render.com/docs)
- 💬 [Render Community](https://community.render.com/)
- 🐛 [Report Issues](https://github.com/yourusername/Automated-whatsapp-message/issues)

---

**Your WhatsApp automation is now live!** 🚀
