const analyzeBtn = document.getElementById('analyze_btn');
const jobTextInput = document.getElementById('job_text');
const clearBtn = document.getElementById('clear_btn');
const outputPanel = document.getElementById('output_panel');

const riskLevelCard = document.getElementById('risk_level_card');
const riskLevelText = document.getElementById('risk_level_text');
const riskScoreText = document.getElementById('risk_score_text');
const riskScoreBar = document.getElementById('risk_score_bar');
const riskGlowBg = document.getElementById('risk_glow_bg');

const triggeredSignalsList = document.getElementById('triggered_signals_list');
const safeSignalsList = document.getElementById('safe_signals_list');
const highlightedTextDiv = document.getElementById('highlighted_text');

// Hardcoded for MVP matching backend logic
const scamPhrases = [
    'registration fee', 'processing fee', 'security deposit',
    'offer letter fee', 'no interview', 'direct joining',
    'immediate joining', 'urgent hiring', 'urgent requirement', 'limited seats',
    'telegram', 'whatsapp', 'telegram hr only',
    'aadhaar', 'pan', 'send aadhaar immediately',
    '40,000 per week', '50,000 per week'
];

const safePhrases = [
    'interview process', 'technical interview', 'hr round', 'company website', 'portal'
];

// Re-enable output panel cleanly
outputPanel.classList.add('hidden');
outputPanel.classList.remove('opacity-100', 'translate-y-0');

// Show clear button when typing
jobTextInput.addEventListener('input', () => {
    if (jobTextInput.value.trim().length > 0) {
        clearBtn.classList.remove('hidden');
    } else {
        clearBtn.classList.add('hidden');
    }
});

clearBtn.addEventListener('click', () => {
    jobTextInput.value = '';
    clearBtn.classList.add('hidden');
    jobTextInput.focus();
    hideResults();
});

function hideResults() {
    outputPanel.classList.remove('opacity-100', 'translate-y-0');
    outputPanel.classList.add('opacity-0', 'translate-y-4');
    setTimeout(() => {
        outputPanel.classList.add('hidden');
    }, 500); // Wait for transition
}

analyzeBtn.addEventListener('click', async () => {
    const text = jobTextInput.value.trim();
    if (!text) {
        // Add a slight shake animation to tell user to add text
        jobTextInput.classList.add('animate-pulse', 'border-rose-500/50', 'border');
        setTimeout(() => jobTextInput.classList.remove('animate-pulse', 'border-rose-500/50', 'border'), 1000);
        return;
    }

    // UI Loading state
    const btnText = document.getElementById('btn_text');
    const btnLoader = analyzeBtn.querySelector('.w-loader');
    const btnIcon = document.getElementById('btn_icon');

    btnText.textContent = "Analyzing...";
    btnLoader.classList.remove('hidden');
    btnIcon.classList.add('hidden');
    analyzeBtn.disabled = true;
    analyzeBtn.classList.add('opacity-80', 'cursor-not-allowed');

    // Hide panel while loading
    hideResults();

    try {
        const response = await fetch('http://127.0.0.1:8000/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ job_text: text })
        });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();

        // Brief artificial delay for "AI processing" feel
        setTimeout(() => {
            displayResults(data, text);
            // Reset UI
            btnText.textContent = "Analyze Another";
            btnLoader.classList.add('hidden');
            btnIcon.classList.remove('hidden');
            analyzeBtn.disabled = false;
            analyzeBtn.classList.remove('opacity-80', 'cursor-not-allowed');
        }, 800);

    } catch (error) {
        console.error("Error analyzing job:", error);
        alert("Failed to connect to backend. Ensure FastAPI server is running.");
        // Reset UI on error
        btnText.textContent = "Analyze Risk";
        btnLoader.classList.add('hidden');
        btnIcon.classList.remove('hidden');
        analyzeBtn.disabled = false;
        analyzeBtn.classList.remove('opacity-80', 'cursor-not-allowed');
    }
});

function displayResults(data, originalText) {
    // Show Output Panel with animation
    outputPanel.classList.remove('hidden');
    // Short delay to allow display block to apply before transitioning opacity
    requestAnimationFrame(() => {
        outputPanel.classList.remove('opacity-0', 'translate-y-4');
        outputPanel.classList.add('opacity-100', 'translate-y-0');
    });

    // Update Text & Score
    riskLevelText.textContent = data.risk_level;

    // Animate score from 0
    let currentScore = 0;
    const targetScore = data.risk_score;
    const duration = 1200; // slightly longer animation
    const intervalTime = 20;
    const steps = duration / intervalTime;
    const increment = targetScore / steps;

    // Reset bar width first for animation
    riskScoreBar.style.width = '0%';

    const scoreInterval = setInterval(() => {
        currentScore += increment;
        if (currentScore >= targetScore) {
            currentScore = targetScore;
            clearInterval(scoreInterval);
        }
        riskScoreText.textContent = Math.floor(currentScore);
    }, intervalTime);

    // Apply color themes based on risk
    applyTheme(data.risk_level, data.risk_score);

    // Populate signals
    populateSignals(data.triggered_signals, triggeredSignalsList, 'red');
    populateSignals(data.safe_signals, safeSignalsList, 'green');

    // Highlight text
    highlightText(originalText, data.triggered_signals, data.safe_signals);

    // Scroll to results smoothly
    setTimeout(() => {
        outputPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

function applyTheme(level, score) {
    // Reset specific theme classes but maintain structural ones
    riskLevelCard.classList.remove('risk-safe', 'risk-suspicious', 'risk-high');
    riskScoreBar.classList.remove('risk-safe-bar', 'risk-suspicious-bar', 'risk-high-bar');
    riskGlowBg.classList.remove('from-emerald-500', 'from-amber-500', 'from-rose-500');

    // Width update requires a small delay so CSS transition triggers
    setTimeout(() => {
        riskScoreBar.style.width = `${score}%`;
    }, 50);

    if (level === "Safe") {
        riskLevelCard.classList.add('risk-safe');
        riskScoreBar.classList.add('risk-safe-bar');
        riskGlowBg.classList.add('from-emerald-500');
    } else if (level === "Suspicious") {
        riskLevelCard.classList.add('risk-suspicious');
        riskScoreBar.classList.add('risk-suspicious-bar');
        riskGlowBg.classList.add('from-amber-500');
    } else {
        riskLevelCard.classList.add('risk-high');
        riskScoreBar.classList.add('risk-high-bar');
        riskGlowBg.classList.add('from-rose-500');
    }
}

function populateSignals(signals, element, color) {
    element.innerHTML = '';

    if (!signals || signals.length === 0) {
        element.innerHTML = `<li class="text-slate-500 italic text-sm py-2 px-1 border-l-2 border-slate-700/50 ml-2 pl-3">No signals detected within text</li>`;
        return;
    }

    signals.forEach(signal => {
        const li = document.createElement('li');
        li.className = `flex items-start text-sm md:text-base`;

        const iconColor = color === 'red' ? 'text-rose-400' : 'text-emerald-400';
        const iconPath = color === 'red'
            ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>'
            : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>';

        li.innerHTML = `
            <svg class="w-5 h-5 ${iconColor} mt-0.5 mr-3 flex-shrink-0 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                ${iconPath}
            </svg>
            <span class="text-slate-300 font-medium capitalize">${signal}</span>
        `;
        element.appendChild(li);
    });
}

function highlightText(text, scamSignals, safeSignals) {
    let highlighted = text;

    // Use specific phrases matched in backend logic to highlight
    // Scam phrasing match
    scamPhrases.forEach(phrase => {
        const regexStr = phrase.includes(' ') ? `(${phrase})` : `\\b(${phrase})\\b`;
        const regex = new RegExp(regexStr, 'gi');
        highlighted = highlighted.replace(regex, '<span class="highlight-scam">$1</span>');
    });

    // Email matching
    const emailRegex = /([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})/gi;
    highlighted = highlighted.replace(emailRegex, '<span class="highlight-safe">$1</span>');

    safePhrases.forEach(phrase => {
        const regexStr = phrase.includes(' ') ? `(${phrase})` : `\\b(${phrase})\\b`;
        const regex = new RegExp(regexStr, 'gi');
        highlighted = highlighted.replace(regex, '<span class="highlight-safe">$1</span>');
    });

    // Handle line breaks
    highlighted = highlighted.replace(/\n/g, '<br><br>');

    highlightedTextDiv.innerHTML = highlighted;
}
