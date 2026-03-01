from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import pickle
import re
import os
from rules import analyze_rules

app = FastAPI()

# Allow frontend to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'model.pkl')
try:
    with open(model_path, 'rb') as f:
        saved_data = pickle.load(f)
        model = saved_data['model']
        vectorizer = saved_data['vectorizer']
except FileNotFoundError:
    print("Warning: model.pkl not found. Please run train.py first.")
    model = None
    vectorizer = None

class JobRequest(BaseModel):
    job_text: str

def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    return text

@app.post("/analyze")
def analyze_job(request: JobRequest):
    text = request.job_text
    
    # 1. ML Prediction
    ml_probability = 0
    if model and vectorizer:
        cleaned = clean_text(text)
        X_vec = vectorizer.transform([cleaned])
        # Probability of class 1 (Scam)
        try:
            ml_probability = model.predict_proba(X_vec)[0][1]
        except Exception as e:
            print(f"Prediction error: {e}")
            pass
        
    ml_score = round(ml_probability * 50)
    
    # 2. Rule-Based Score
    rule_score, triggered_signals, safe_signals = analyze_rules(text)
    
    # Final Score logic
    final_score = ml_score + rule_score
    # Cap at 100
    final_score = min(100, max(0, int(final_score)))
    
    if final_score <= 30:
        risk_level = "Safe"
    elif final_score <= 60:
        risk_level = "Suspicious"
    else:
        risk_level = "High Risk Scam"
        
    return {
        "risk_level": risk_level,
        "risk_score": final_score,
        "confidence": round(ml_probability, 2),
        "triggered_signals": triggered_signals,
        "safe_signals": safe_signals
    }
