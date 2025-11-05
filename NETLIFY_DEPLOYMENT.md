# 🚀 Netlify Deployment Guide for WEBWAIFUV2

This guide explains how to deploy your VRM waifu chatbot with Fish Audio support to Netlify.

---

## 📋 Prerequisites

1. **GitHub Account**: Your code should be on GitHub
2. **Netlify Account**: Sign up at [netlify.com](https://netlify.com) (free tier is fine)
3. **Fish Audio API Key**: Each user needs their own from [fish.audio/app/api-keys](https://fish.audio/app/api-keys)

---

## 🌐 Deployment Steps

### **Method 1: Deploy from GitHub (Recommended)**

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Add Netlify serverless functions for Fish Audio"
   git push origin main
   ```

2. **Connect to Netlify:**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click **"Add new site"** → **"Import an existing project"**
   - Select **GitHub** and authorize Netlify
   - Choose your `WEBWAIFUV2` repository

3. **Configure build settings:**
   - **Build command:** Leave blank (no build needed)
   - **Publish directory:** `.` (root directory)
   - **Functions directory:** `netlify/functions` (auto-detected from `netlify.toml`)

4. **Deploy:**
   - Click **"Deploy site"**
   - Wait 1-2 minutes for deployment
   - Your site will be live at `https://your-site-name.netlify.app`

---

### **Method 2: Netlify CLI (For Testing)**

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Test locally:**
   ```bash
   netlify dev
   ```
   - This runs your site at `http://localhost:8888`
   - Serverless functions work at `http://localhost:8888/.netlify/functions/`

4. **Deploy manually:**
   ```bash
   netlify deploy --prod
   ```

---

## 🔧 How It Works

### **Serverless Functions:**

1. **`/.netlify/functions/fish-models`**
   - Fetches user's Fish Audio voice models
   - Takes API key from `x-fish-api-key` header
   - Returns list of custom cloned voices

2. **`/.netlify/functions/fish-tts`**
   - Converts text to speech using Fish Audio
   - Takes API key from `x-fish-api-key` header
   - Returns MP3 audio blob

### **CORS Handling:**

The functions include `Access-Control-Allow-Origin: *` headers, so your frontend can call them from anywhere.

### **User API Keys:**

Each user enters their own Fish Audio API key in the UI. The key is:
- ✅ Stored in browser `localStorage`
- ✅ Sent to Netlify functions via headers
- ✅ Never exposed in your deployed code
- ✅ Each user pays for their own usage

---

## 🧪 Testing After Deployment

1. **Open your deployed site:** `https://your-site-name.netlify.app`

2. **Models will load from jsdelivr CDN:**
   - **First visit:** ~30 seconds to download models (273MB total)
   - **Subsequent visits:** Instant (cached in browser)
   - Models: Whisper (80MB), MiniLM (23MB), DistilBERT (250MB)

3. **Enter your Fish Audio API key (optional):**
   - Go to Settings → Text-to-Speech
   - Select "Fish Audio" as TTS Provider
   - Paste your API key
   - Your custom voices should load automatically

4. **Test features:**
   - Chat with AI (semantic memory works!)
   - Click "🐟 Test Voice" for Fish Audio
   - Voice input works with Whisper STT

---

## 🐛 Troubleshooting

### **Models not loading / "DOCTYPE not valid JSON" error:**

**This has been FIXED!** ✅

- **Solution:** App now uses **jsdelivr CDN** instead of Hugging Face
- **Config:** See lines 16-24 in `js/app.js`
- **First load:** Takes 30 seconds (models download once)
- **After that:** Instant (cached in browser's IndexedDB)

### **Fish Audio "Failed to fetch" errors:**

1. Check Netlify function logs:
   - Go to Netlify dashboard → **Functions** tab
   - Click on function name to see logs

2. Verify API key is correct:
   - Test at [fish.audio](https://fish.audio/app/text-to-speech)

3. Check browser console (F12) for detailed errors

### **Functions not found (404):**

- Make sure `netlify.toml` is in your repo root
- Verify `netlify/functions/` folder exists
- Redeploy the site

### **Slow TTS generation:**

- Netlify free tier has 10-second function timeout
- Long text might timeout → split into shorter chunks
- Fish Audio `latency: "balanced"` helps

---

## 💰 Cost Breakdown

| Service | Cost |
|---------|------|
| **Netlify Hosting** | Free (generous limits) |
| **Netlify Functions** | Free tier: 125k requests/month |
| **Edge TTS** | Free (unlimited) |
| **Fish Audio** | User pays (based on their plan) |

**You don't pay for users' Fish Audio usage—they use their own API keys!**

---

## 🔐 Security Notes

- ✅ API keys never exposed in frontend code
- ✅ Keys sent via headers (not URL params)
- ✅ Each user's key is isolated
- ⚠️ Don't commit your personal API key to GitHub

---

## 📚 Additional Resources

- [Netlify Functions Docs](https://docs.netlify.com/functions/overview/)
- [Fish Audio API Docs](https://docs.fish.audio)
- [Netlify CLI Docs](https://docs.netlify.com/cli/get-started/)

---

## 🎉 You're Done!

Your VRM waifu chatbot is now live with:
- ✅ Free Edge TTS (Microsoft)
- ✅ Fish Audio voice cloning (user's own API key)
- ✅ Serverless backend (no server management)
- ✅ Global CDN (fast worldwide)

Share your deployed URL and let users add their own Fish Audio voices! 🚀

