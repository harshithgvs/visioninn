# VisionIn - Transform Ideas Into Reality 🚀

VisionIn is the ultimate student startup ecosystem platform built to help founders, developers, designers, and incubators build, scale, and launch startups.

---

## 🌟 Key Features

1. **Production Authentication System**: Firebase Auth & JWT Auth, Google Login, Signup, Password Reset, Protected Routes.
2. **Ecosystem Feed**: Milestone updates, Co-Founder opportunity posts, Like/Support, Comment discussions, Bookmarking.
3. **Secured Idea Vault & IP Ledger**: SHA-256 Cryptographic IP Timestamp Generator with verifiable PDF certificates.
4. **Co-Founder & Talent Matcher**: Search & filter candidates by role, college, and skills with connection request system.
5. **Mentorship & Learning Hub**: Interactive step-by-step roadmaps for 0-to-1 MVP execution and Pitch Deck preparation.
6. **Startup Careers & Internships**: Internship & equity role hiring portal with application submittals.
7. **Funding, Incubators & Micro-Grants**: Directory of incubators (NIDHI-PRAYAS) with direct pitch deck submittal.
8. **Legal Resource Center**: Interactive NDA Generator with instant copy & print features.
9. **Admin Console**: Platform statistics, user moderation, and content management at `/admin`.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 18, Vite, React Router 6, Tailwind CSS, Framer Motion, Lucide Icons, Axios.
- **Backend**: Node.js, Express.js REST API with CORS.
- **Database**: MongoDB Atlas (Mongoose) with automatic local reactive memory fallback.
- **Authentication**: Firebase Authentication + Express API JWT Session persistence.
- **Storage**: Cloudinary ready.

---

## 💻 Local Quickstart Guide

### 1. Backend Server Setup
```bash
cd server
npm install
npm run dev
# Server will start on http://localhost:5000
```

### 2. Frontend Client Setup
```bash
cd client
npm install
npm run dev
# Client app will start on http://localhost:3000
```

---

## 🚀 Deployment Guide

### Deploying Frontend to Vercel
1. Import the `/client` directory into Vercel.
2. Select **Vite** framework preset.
3. Set environment variables from `client/.env.example`.
4. Deploy! `vercel.json` will automatically route client routes and proxy API requests.

### Deploying Backend to Render
1. Create a **New Web Service** on Render pointing to `/server`.
2. Set Build Command to `npm install` and Start Command to `npm start`.
3. Add `MONGODB_URI` environment variable from MongoDB Atlas.
4. Deploy!

---

## 📄 License
© 2026 VisionIn Ecosystem. All rights reserved.
