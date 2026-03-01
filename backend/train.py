import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import pickle
import re
import os

# Create a small synthetic dataset based on user requirements
data = {
    "text": [
        "Software Engineering Internship. Please send your resume to hr@company.com. Formal interview process will follow.",
        "We are looking for a frontend developer. You will have a technical interview and an HR round. Apply on our portal.",
        "Data Analyst role available. Visit our company website to apply. Salary is competitive.",
        "Urgent requirement! Pay 1999 registration fee for immediate joining. No interview direct joining.",
        "Earn 50,000 per week without experience. Work from home. Send Aadhaar immediately to our Telegram HR only.",
        "Offer letter fee of 500 required. Limited seats available. Contact on WhatsApp.",
        "Java Developer needed. Require 3 years of experience. Standard background check applies.",
        "You are selected! Simply pay the security deposit to get your laptop. 100% genuine job.",
        "Graphic designer wanted. Please share portfolio to the email provided.",
        "Urgent! No interview required. Salary 40,000 per week. Contact HR on Telegram to pay processing fee."
    ],
    "label": [0, 0, 0, 1, 1, 1, 0, 1, 0, 1] # 0 = Safe, 1 = Scam
}

def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    return text

def train_model():
    df = pd.DataFrame(data)
    df['clean_text'] = df['text'].apply(clean_text)

    # Train Logistic Regression using TF-IDF (unigrams + bigrams)
    vectorizer = TfidfVectorizer(ngram_range=(1, 2))
    X = vectorizer.fit_transform(df['clean_text'])
    y = df['label']

    model = LogisticRegression()
    model.fit(X, y)

    # Save model and vectorizer
    model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'model.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump({'model': model, 'vectorizer': vectorizer}, f)
    
    print(f"Model trained and saved as {model_path}")

if __name__ == "__main__":
    train_model()
