# 🌿 AI Crop Disease Detection System

An AI-powered web application for instant crop leaf disease identification, diagnosis, severity grading, and treatment recommendations with bilingual support (**English** and **Hindi**).

---

## 🚀 Features

- **Multimodal AI Leaf Diagnosis**: Integrates Google Gemini AI (`gemini-3.6-flash`) to analyze crop leaf photos with high accuracy.
- **Multilingual Support**: Real-time switching between **English** and **Hindi** (हिन्दी) for diagnosis, remedies, symptoms, and UI text.
- **Detailed Actionable Remedies**: Provides organic/biological treatments, chemical fungicides/pesticides, and step-by-step preventive advice.
- **Severity Grading**: Categorizes disease severity into **Low**, **Medium**, **High**, or **Healthy**.
- **Interactive Dashboard**: Track scan history, search and filter past records, and view interactive disease analytics and charts via Recharts.
- **Drag-and-Drop & Camera Upload**: Supports direct photo upload, camera capture, and 1-click sample leaf testing.
- **Dual Backend Architecture**: Includes both Node.js Express server and Python FastAPI backend with MongoDB support.

---

## 📁 Project Structure

```text
├── server.ts                    # Express + Vite Full-Stack Entry Point
├── backend/                     # Python FastAPI Backend Services
│   ├── main.py                  # FastAPI Application Routes & Middleware
│   ├── database.py              # MongoDB Motor Async Connection Manager
│   ├── models.py                # Pydantic Schemas & Data Models
│   ├── gemini_service.py        # Google GenAI Python Service Integration
│   ├── requirements.txt         # Python Package Dependencies
│   ├── Dockerfile               # Container Spec for Render / Cloud Run
│   └── .env.example             # Python Backend Environment Variables
├── src/                         # Frontend React Source Code
│   ├── App.tsx                  # Root Layout & Main View Controller
│   ├── main.tsx                 # React DOM Root Entry
│   ├── index.css                # Tailwind CSS v4 Configuration
│   ├── types.ts                 # Shared TypeScript Definitions
│   ├── translations.ts          # English & Hindi Language Dictionary
│   ├── data/
│   │   └── sampleCrops.ts       # Preset Test Crops & SVG Leaf Images
│   └── components/
│       ├── Header.tsx           # Navbar & Language Selector
│       ├── Hero.tsx             # Home Banner & Supported Crops List
│       ├── ImageUploader.tsx    # File Drag-and-Drop, Camera & Samples
│       ├── AnalysisDisplay.tsx  # Detailed AI Diagnosis Card & Report
│       ├── Dashboard.tsx        # History List, Search & Charts
│       ├── Guide.tsx            # Photo Taking Tips & Architecture
│       └── Footer.tsx           # Credits & Disclaimer Footer
├── metadata.json                # AI Studio Metadata
├── package.json                 # Node.js Dependencies & Build Scripts
├── vite.config.ts               # Vite Configuration
└── README.md                    # Setup and Deployment Documentation
```

---

## 🔑 Environment Variables Setup

Create a `.env` file in the root directory (and inside `/backend/.env` if running FastAPI):

```env
# Gemini API Key (Required for AI Diagnosis)
GEMINI_API_KEY="your_google_gemini_api_key_here"

# MongoDB URI (Optional for cloud database persistence)
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/crop_disease_db?retryWrites=true&w=majority"
DB_NAME="crop_disease_db"
```

---

## 🛠️ Local Development

### 1. Running Node.js + Express Full-Stack App (Default)

```bash
# Install Node dependencies
npm install

# Start Express & Vite server on Port 3000
npm run dev
```

Open `http://localhost:3000` in your browser.

### 2. Running Python FastAPI Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python requirements
pip install -r requirements.txt

# Start FastAPI server on Port 8000
uvicorn backend.main:app --reload --port 8000
```

FastAPI Interactive Swagger Docs will be available at `http://localhost:8000/docs`.

---

## ☁️ Deployment Instructions

### 1. Deploying Frontend on Vercel

1. Push code repository to GitHub.
2. Log into [Vercel](https://vercel.com) and click **Add New Project**.
3. Select your repository.
4. Set Build Command: `npm run build` and Output Directory: `dist`.
5. Add Environment Variable:
   - `GEMINI_API_KEY`: Your Gemini API key.
6. Click **Deploy**.

### 2. Deploying Backend on Render (FastAPI + Docker)

1. Log into [Render](https://render.com) and click **New > Web Service**.
2. Connect your GitHub repository and select the repository.
3. Choose **Docker** as the Runtime.
4. Set Docker Context Path to root and Dockerfile Path to `backend/Dockerfile`.
5. Add Environment Variables in Render Dashboard:
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
   - `MONGODB_URI`: Your MongoDB connection string.
6. Click **Create Web Service**.

---

## 🍃 MongoDB Configuration

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Go to **Database Access** and create a database user with read/write permissions.
3. Go to **Network Access** and add IP `0.0.0.0/0` (allow access from anywhere for serverless deployment).
4. Copy the connection string into your `MONGODB_URI` environment variable.

---

## 📄 License
Apache 2.0 License. Built with Google Gemini AI.
