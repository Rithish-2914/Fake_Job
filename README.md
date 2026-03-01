🛡️ Fake Job Posting Risk Analyzer
AI-Powered Scam Detection for Job Listings

Day 3/30 — Real World Projects Challenge

A hybrid Machine Learning + Rule-Based web application built to detect potentially fraudulent job postings, especially those targeting candidates in the Indian job market.

This system analyzes job descriptions and generates an explainable risk score to help users avoid scams.

🚨 Problem

Online job fraud is increasing rapidly.

Scam postings often:

Ask for registration or processing fees

Promise unrealistic salaries

Skip formal interviews

Redirect users to Telegram-only communication

Use vague company information

Many candidates fall for these scams because the language appears professional.

💡 Solution

The Fake Job Posting Risk Analyzer evaluates job descriptions using a hybrid detection system and classifies them into:

✅ Safe

⚠️ Suspicious

🚩 High Risk

The system also provides transparent reasoning behind the classification.

🧠 How It Works
1️⃣ Machine Learning Layer

TF-IDF vectorization

Logistic Regression classifier

Context-aware language analysis

Trained on curated + synthetic scam datasets

2️⃣ Rule-Based Risk Engine

Weighted scoring system

Detects scam indicators such as:

Upfront payment requests

Telegram-only HR contact

Unrealistic salary claims

No interview guarantees

Balances risk with safe signals

The combination improves reliability compared to simple keyword matching.

✨ Core Features

🔍 Risk score (0–100)

📊 Risk level classification (Safe / Suspicious / High Risk)

🧾 Explainable triggered signals

🎨 Modern dark-mode UI

🖍 Text highlighting for suspicious and safe phrases

⚡ Lightweight architecture (no heavy frameworks)

🛠 Tech Stack

Backend

Python

FastAPI

Scikit-learn

Pandas

Uvicorn

Frontend

HTML5

Vanilla JavaScript

Tailwind CSS (CDN)

Custom CSS animations

📁 Project Structure
Fake-Job-Posting-Risk-Analyzer/
│
├── backend/
│   ├── main.py        # FastAPI application server
│   ├── rules.py       # Rule-based scoring logic
│   ├── train.py       # Model training pipeline
│   └── model.pkl      # Trained ML model
│
├── frontend/
│   ├── index.html     # UI structure
│   ├── script.js      # API integration logic
│   └── styles.css     # Custom styling & animations
│
└── README.md
🚀 Running the Project Locally
📌 Prerequisites

Ensure Python is installed.

Install required dependencies:

pip install fastapi scikit-learn pandas uvicorn
▶ Start the Backend
cd backend
python -m uvicorn main:app --reload --port 8000

API will run at:

http://localhost:8000
🌐 Run the Frontend

Simply open the frontend file in your browser:

start frontend/index.html

(No frontend build tools required.)

🧪 Retraining the Model

To retrain using the dataset inside train.py:

cd backend
python train.py

This will regenerate model.pkl based on the synthetic dataset defined in the script.

🎯 Project Philosophy

This system focuses on:

Explainability over black-box predictions

Practical fraud detection

Lightweight and understandable architecture

Real-world problem solving

Built as part of the 30 Days 30 Projects Challenge, where each project addresses a real-life issue using structured thinking and accessible technology.

👨‍💻 Author

Developed by Bajjuri Rithish
GitHub: https://github.com/Rithish-2914