# Tracks: Master Your Craft, One Track at a Time

**Tracks** is a premium, AI-powered technical learning platform designed to help learners and developers navigate complex technical domains through structured, interactive roadmaps. By combining visual learning paths with AI-driven assessments, Tracks provides a comprehensive environment for mastering skills, verifying knowledge, and sharing achievements.

![Tracks Landing Page Preview](https://img.shields.io/badge/Tracks-Mastery-blueviolet?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

## ✨ Core Features

### 🛤️ Interactive Roadmaps
Navigate through expert-crafted curricula designed to take you from beginner to expert. Each **Track** is broken down into specific **Topics** and actionable **Tasks**, providing a clear path to mastery.

### 🧠 AI-Validated Learning
Validate your understanding through a smart assessment system. Get technical **Verification Scores** for each topic, helping you identify exactly where you excel and where you need more practice.

### 📊 Comprehensive Progress Tracking
- **Streak Heatmaps:** Visualize your daily learning consistency.
- **Dynamic Stats:** Track completed tasks, finished topics, and mastered tracks in real-time.
- **Achievement Badges:** Earn recognition for your consistency and skill mastery.

### 👥 Public Profiles & Social Sharing
Showcase your expertise to the world. Each user gets a unique **Public Profile** (`/u/username`) that highlights their verified skills and learning progress. Share your journey with one click.

### 🔍 Global Search & Discovery
Effortlessly find new Tracks to follow, specific Topics to learn, or discover other learners within the community through a robust global search engine.

### 🎨 Premium User Experience
- **Responsive Design:** Optimized for all devices.
- **Dark/Light Mode:** Full native support for both themes.
- **Interactive Demo:** Experience the platform's core features directly from the landing page.

---

## 🛠️ Tech Stack

- **Frontend:** [React](https://reactjs.org/) (Vite), [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/), [Recharts](https://recharts.org/)
- **Backend:** [Node.js](https://nodejs.org/), [Express](https://expressjs.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **Authentication:** JWT (JSON Web Tokens)
- **AI Integration:** Google Generative AI (Gemini API)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or higher)
- [PostgreSQL](https://www.postgresql.org/) (Local instance or Cloud-based)

### 1. Installation

Clone the repository:
```bash
git clone https://github.com/Harshydv-me/LearnFlow.git
cd LearnFlow
```

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   Create a `.env` file in the `backend` folder:
   ```env
   PORT=3000
   DATABASE_URL=postgres://username:password@localhost:5432/tracks_db
   JWT_SECRET=your_super_secret_key
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. Run Database Migrations:
   ```bash
   npm run migrate
   npm run migrate:quiz
   npm run curriculum
   ```
5. Start the server:
   ```bash
   npm start
   ```

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Designed with ❤️ for modern learners.
