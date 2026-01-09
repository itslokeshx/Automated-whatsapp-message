# WhatsApp Business API Setup Guide

Complete guide to setting up WhatsApp Business API for this automation tool.

## Overview

You'll need:
1. Meta (Facebook) Developer Account
2. WhatsApp Business Account
3. Phone number for WhatsApp Business

**Time Required**: 15-30 minutes

## Step 1: Create Meta Developer Account

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Click **"Get Started"** (top right)
3. Log in with Facebook or create account
4. Complete verification if prompted

## Step 2: Create a New App

1. Click **"My Apps"** → **"Create App"**
2. Select **"Business"** as app type
3. Fill in details:
   - **App Name**: "WhatsApp Automation" (or your choice)
   - **Contact Email**: Your email
   - **Business Account**: Select or create one
4. Click **"Create App"**

## Step 3: Add WhatsApp Product

1. In your app dashboard, find **"WhatsApp"**
2. Click **"Set Up"**
3. You'll see the WhatsApp setup page

## Step 4: Get Your Credentials

### Phone Number ID

1. In WhatsApp setup, go to **"API Setup"** tab
2. Find **"Phone number ID"** section
3. Copy the number (e.g., `123456789012345`)
4. Save this as `PHONE_NUMBER_ID` in your `.env`

### Access Token

1. In the same **"API Setup"** tab
2. Find **"Temporary access token"** section
3. Click **"Copy"**
4. Save this as `WHATSAPP_TOKEN` in your `.env`

⚠️ **Important**: Temporary tokens expire in 24 hours. For production, generate a permanent token (see below).

## Step 5: Add Test Phone Number

1. In **"API Setup"** tab
2. Find **"To"** field
3. Click **"Manage phone number list"**
4. Add your phone number (must be registered with WhatsApp)
5. Verify with the code sent to WhatsApp

## Step 6: Send Test Message

Test your setup:

```bash
curl -X POST \
  https://graph.facebook.com/v22.0/YOUR_PHONE_NUMBER_ID/messages \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "messaging_product": "whatsapp",
    "to": "YOUR_TEST_NUMBER",
    "type": "template",
    "template": {
      "name": "hello_world",
      "language": { "code": "en_US" }
    }
  }'
```

You should receive a "Hello World" message on WhatsApp!

## Step 7: Create Permanent Access Token (Production)

Temporary tokens expire. For production:

### Option A: System User Token (Recommended)

1. Go to [Business Settings](https://business.facebook.com/settings/)
2. Click **"Users"** → **"System Users"**
3. Click **"Add"**
4. Name it (e.g., "WhatsApp Bot")
5. Select **"Admin"** role
6. Click **"Add Assets"**
7. Select your app → **"Full Control"**
8. Click **"Generate New Token"**
9. Select permissions:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`
10. Copy and save the token (it won't be shown again!)

### Option B: User Access Token

1. Use [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app
3. Add permissions:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`
4. Click **"Generate Access Token"**
5. Exchange for long-lived token using Graph API

## Step 8: Create Message Templates

Custom text messages require templates. Here's how:

1. In WhatsApp setup, go to **"Message Templates"**
2. Click **"Create Template"**
3. Fill in:
   - **Name**: `greeting_message` (lowercase, underscores only)
   - **Category**: Choose appropriate category
   - **Language**: English (or your language)
   - **Content**: Your message text
4. Submit for approval (usually takes 1-24 hours)

### Example Template

**Name**: `order_confirmation`
**Content**: 
```
Hello! Your order has been confirmed. 
Order ID: {{1}}
Thank you for your purchase!
```

Use in API:
```json
{
  "template": {
    "name": "order_confirmation",
    "language": { "code": "en_US" },
    "components": [{
      "type": "body",
      "parameters": [{
        "type": "text",
        "text": "12345"
      }]
    }]
  }
}
```

## Step 9: Verify Setup

Update your `.env`:

```env
PHONE_NUMBER_ID=123456789012345
WHATSAPP_TOKEN=EAABsbCS1234...
GRAPH_VERSION=v22.0
PORT=3000
```

Start your server:

```bash
npm start
```

Visit http://localhost:3000 and send a test message!

## Understanding Message Types

### Template Messages
- ✅ Work immediately
- ✅ No conversation window required
- ❌ Must be pre-approved
- ❌ Limited customization

**Use for**: Notifications, alerts, reminders

### Custom Text Messages
- ✅ Fully customizable
- ✅ No approval needed
- ❌ Requires 24-hour conversation window
- ❌ Window opens when user messages you

**Use for**: Customer support, replies

## Conversation Window

The 24-hour window:
- Starts when user sends you a message
- Lasts 24 hours from their last message
- Allows free-form text messages
- Resets with each user message

**Outside window**: Only template messages work

## Rate Limits

WhatsApp has rate limits:
- **Tier 1** (default): 1,000 messages/day
- **Tier 2**: 10,000 messages/day
- **Tier 3**: 100,000 messages/day

Tiers increase automatically with usage and quality.

## Costs

- **Meta Platform**: Free
- **WhatsApp Messages**:
  - First 1,000 conversations/month: Free
  - After that: ~$0.005-0.09 per conversation (varies by country)
  - Check [WhatsApp Pricing](https://developers.facebook.com/docs/whatsapp/pricing)

## Troubleshooting

### "Invalid access token"
- Token expired - generate new one
- Wrong token - double-check copy/paste

### "Phone number not registered"
- Add number to test list in Meta dashboard
- Verify with code sent to WhatsApp

### "Template not found"
- Template not approved yet
- Check template name spelling
- Use `hello_world` for testing

### "Message not delivered"
- Recipient blocked your number
- Recipient doesn't have WhatsApp
- Phone number format wrong (use E.164)

## Production Checklist

- [ ] Generate permanent access token
- [ ] Create and approve message templates
- [ ] Test all message types
- [ ] Set up webhook (for receiving messages)
- [ ] Configure business profile
- [ ] Add payment method to Meta Business
- [ ] Monitor message quality ratings

## Resources

- 📖 [WhatsApp Business API Docs](https://developers.facebook.com/docs/whatsapp)
- 🎓 [Getting Started Guide](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started)
- 💬 [Developer Community](https://developers.facebook.com/community/)
- 📊 [WhatsApp Manager](https://business.facebook.com/wa/manage/)

---

**You're all set!** Start automating WhatsApp messages 🚀
