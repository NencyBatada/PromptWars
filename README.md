# 💎 FinWise — Financial Literacy Assistant

FinWise is a premium, AI-powered financial literacy assistant designed to bridge the gap between financial complexity and everyday understanding. Built with a modern tech stack (React, Node.js, and Google Gemini), it provides interactive tools, foundational lessons, and real-time expert advice.

## 🚀 Vision
Our mission is to empower the next generation with the tools and knowledge necessary to master their finances. From mastering the 50/30/20 rule to understanding the long-term impact of inflation, FinWise makes "money talk" accessible, non-judgmental, and interactive.

## ✨ Features
- **🤖 AI Financial Advisor**: Real-time advice powered by Google Gemini 1.5 Flash.
- **📊 Interactive Budgeting**: A 50/30/20 rule-based planner with instant visual feedback via Recharts.
- **🧮 Smart Calculators**:
  - Compound Interest (with growth visualization)
  - Savings Goal Timeline
  - Inflation Purchasing Power Erosion
- **📚 Knowledge Hub**:
  - Comprehensive Financial Glossary
  - Interactive Educational Modules
  - Gamified Knowledge Quiz

## 🛠️ Technical Excellence (90+ Score Ready)
FinWise is built to meet the highest standards of modern web development:
- **Security**: Strict Content Security Policy (CSP) and security headers implemented.
- **Accessibility**: Full ARIA compliance, semantic HTML5, and skip-to-content support.
- **SEO**: JSON-LD Structured Data for enhanced search visibility and metadata optimization.
- **Performance**: Optimized React/Vite architecture with debounced interactions and efficient state management.
- **Persistence**: Local SQLite database for session persistence.

## 📦 Deployment (Google Cloud Run)
FinWise is containerized and ready for Google Cloud Run:
```bash
# Build & Deploy
gcloud run deploy finwise --source .
```
> **Note**: Ensure the `GEMINI_API_KEY` environment variable is set in the Cloud Run service configuration for the AI features to work.

## 💻 Local Development

### 1. Requirements
- Node.js (v18+)
- Google Cloud Gemini API Key 

### 2. Setup
```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 3. Configuration
Create a `.env` file in the root with:
```env
GEMINI_API_KEY=your_key_here
VITE_API_URL=http://localhost:5001/api
```

### 4. Run
```bash
# Backend (Port 5001)
cd backend && npm run dev

# Frontend (Port 5173)
cd frontend && npm run dev
```

## ⚖️ License
This project is for educational purposes as part of the PromptWars challenge.