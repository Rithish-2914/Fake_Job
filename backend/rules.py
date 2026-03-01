import re

def analyze_rules(text):
    text_lower = text.lower()
    
    rule_score = 0
    triggered_signals = []
    safe_signals = []
    
    # Negative/Scam patterns
    rules = [
        (r'registration fee|processing fee|security deposit', 30, 'registration fee'),
        (r'offer letter fee', 25, 'offer letter fee'),
        (r'\b(?:40,000|50,000)\b.*(?:per week|weekly)', 20, 'unrealistic salary'),
        (r'no interview|direct joining', 20, 'no interview'),
        (r'immediate joining|urgent hiring|urgent requirement|limited seats', 15, 'urgency words'),
        (r'telegram|whatsapp|telegram hr only', 15, 'telegram/whatsapp contact only'),
        (r'aadhaar|pan|send aadhaar immediately', 15, 'asking for Aadhaar/PAN upfront')
    ]
    
    # Simple grammar/phrasing check
    grammar_patterns = [r'\b(ur|plz|u)\b', r'\b(?:kindly revert|do the needful|cent percent)\b']
    for p in grammar_patterns:
        if re.search(p, text_lower):
            rule_score += 10
            triggered_signals.append('poor grammar pattern')
            break
            
    for pattern, weight, explanation in rules:
        if re.search(pattern, text_lower):
            rule_score += weight
            if explanation not in triggered_signals:
                triggered_signals.append(explanation)
                
    # Positive/Safe patterns
    safe_rules = [
        (r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', 'official domain email'),
        (r'interview process|technical interview|hr round', 'clear interview process described'),
        (r'company website|portal', 'company website link')
    ]
    
    for pattern, explanation in safe_rules:
        if re.search(pattern, text_lower):
            # Safe signals reduce risk
            rule_score = max(0, rule_score - 10)
            if explanation not in safe_signals:
                safe_signals.append(explanation)
                
    return rule_score, triggered_signals, safe_signals
