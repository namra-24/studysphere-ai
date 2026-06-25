# 🧠 StudySphere AI

> Your AI-powered academic companion — upload PDFs, chat with them, generate flashcards, quizzes, summaries, and more.

![StudySphere AI](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![Powered by Claude](https://img.shields.io/badge/Powered%20by-Claude%20AI-orange?style=flat-square)
![Deploy on Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)

---

## ✨ Features

- 💬 **PDF Chat** — Upload any PDF and ask questions about it
- 🃏 **Flashcard Generator** — AI creates flashcards from your notes
- 🎯 **Quiz Generator** — MCQ quizzes with instant feedback
- 📝 **Summary Generator** — Quick, detailed, bullet, or exam summaries
- 🌙 **Dark Mode** — Beautiful pastel glassmorphism design
- 📱 **Fully Responsive** — Works on phone, tablet, and desktop

---

## 🚀 Getting Started (Step by Step)

### Step 1: Get Your API Key

1. Go to **https://console.anthropic.com**
2. Sign up for a free account
3. Click **API Keys** in the left sidebar
4. Click **Create Key** and copy the key (looks like `sk-ant-api03-...`)

---

### Step 2: Set Up the Project

**Option A: Download and Run Locally**

1. Make sure you have **Node.js** installed: https://nodejs.org (download LTS version)

2. Open your terminal (Command Prompt on Windows, Terminal on Mac)

3. Go to the project folder:
   ```bash
   cd studysphere-ai
   ```

4. Install all packages:
   ```bash
   npm install
   ```

5. Create your environment file:
   ```bash
   # On Mac/Linux:
   cp .env.example .env.local

   # On Windows:
   copy .env.example .env.local
   ```

6. Open `.env.local` in any text editor (Notepad, VS Code, etc.) and replace `YOUR_KEY_HERE` with your actual API key:
   ```
   ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
   ```

7. Start the development server:
   ```bash
   npm run dev
   ```

8. Open your browser and go to: **http://localhost:3000**

🎉 That's it! The app is running!

---

### Step 3: Deploy to Vercel (Put it on the Internet!)

1. **Create a GitHub account** at https://github.com if you don't have one

2. **Create a new repository** on GitHub:
   - Click the `+` button → New repository
   - Name it `studysphere-ai`
   - Keep it Public or Private
   - Click **Create repository**

3. **Upload your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - StudySphere AI"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/studysphere-ai.git
   git push -u origin main
   ```
   *(Replace YOUR-USERNAME with your actual GitHub username)*

4. **Deploy on Vercel**:
   - Go to **https://vercel.com** and sign up (use your GitHub account)
   - Click **New Project**
   - Click **Import** next to your `studysphere-ai` repository
   - Click **Deploy** — Vercel will automatically detect it's a Next.js app

5. **Add your API key to Vercel**:
   - After deploying, go to your project in Vercel
   - Click **Settings** → **Environment Variables**
   - Click **Add New**
   - Name: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-api03-your-actual-key`
   - Click **Save**
   - Go to **Deployments** → click the three dots → **Redeploy**

6. **Your site is live!** Vercel gives you a URL like `studysphere-ai.vercel.app`

---

## 📁 Project Structure

```
studysphere-ai/
├── src/
│   └── app/
│       ├── landing/          # Landing page
│       ├── dashboard/        # Main app
│       │   ├── page.tsx      # Dashboard home
│       │   ├── chat/         # PDF Chat feature
│       │   ├── flashcards/   # Flashcard Generator
│       │   ├── quiz/         # Quiz Generator
│       │   ├── summary/      # Summary Generator
│       │   └── analytics/    # Analytics
│       └── api/              # Backend AI routes
│           ├── chat/
│           ├── flashcards/
│           ├── quiz/
│           └── summary/
├── .env.example              # Copy this to .env.local
├── package.json
└── README.md
```

---

## 🛠️ Tech Stack

| Technology | What it does |
|-----------|-------------|
| **Next.js 15** | The main framework |
| **TypeScript** | Makes code safer |
| **Tailwind CSS** | Styling and design |
| **Claude AI** (Anthropic) | Powers all AI features |
| **PDF.js** | Reads PDF files |
| **Vercel** | Hosts the website |

---

## ❓ Troubleshooting

**"API key not set" error**
→ Make sure `.env.local` exists and has your key. Restart the dev server.

**PDF won't upload**
→ Make sure it's a PDF (not Word, image, etc.). Max size 20MB.

**Blank page or error on Vercel**
→ Check that you added `ANTHROPIC_API_KEY` in Vercel Environment Variables and redeployed.

**"npm not found" on Windows**
→ Install Node.js from https://nodejs.org and restart your terminal.

---

## 📧 Need Help?

If you run into any issues, the error messages in the app will guide you. Most common fix: add your API key!

---

*Built with ❤️ using Next.js and Claude AI*
