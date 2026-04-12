/**
 * FinWise — Financial Literacy Assistant
 * Interactive Application Logic
 *
 * @fileoverview Main application module for the FinWise financial literacy tool.
 * Handles interactive calculators, learning modules, glossary, budget planner,
 * and knowledge quiz functionality.
 *
 * @version 1.0.0
 * @license MIT
 */

'use strict';

// ==========================================
// CONSTANTS & CONFIGURATION
// ==========================================

/** @const {number} Maximum allowed input value for currency fields */
const MAX_CURRENCY_INPUT = 100_000_000;

/** @const {number} Maximum years for projections */
const MAX_YEARS = 50;

/** @const {number} Maximum interest rate percentage */
const MAX_RATE = 30;

/** @const {number} Debounce delay in milliseconds */
const DEBOUNCE_DELAY = 300;

/** @const {number} Savings jar goal amount */
const SAVINGS_JAR_GOAL = 2000;

/** @const {number} Savings jar increment amount */
const SAVINGS_JAR_INCREMENT = 100;

// ==========================================
// DATA
// ==========================================

/**
 * Glossary of financial terms with categories and definitions.
 * @type {Array<{term: string, category: string, definition: string}>}
 */
const glossaryData = Object.freeze([
    { term: "Compound Interest", category: "investing", definition: "Interest calculated on both the initial principal and the accumulated interest from previous periods. It's how your money grows exponentially over time." },
    { term: "APY (Annual Percentage Yield)", category: "saving", definition: "The real rate of return on a savings deposit, accounting for the effect of compounding interest. Higher APY means more earnings." },
    { term: "Emergency Fund", category: "saving", definition: "Money set aside for unexpected expenses — like medical bills, car repairs, or job loss. Ideally 3-6 months of living expenses." },
    { term: "Budget", category: "budgeting", definition: "A plan for how you'll allocate your income. It helps you track money coming in and going out so you can meet financial goals." },
    { term: "50/30/20 Rule", category: "budgeting", definition: "A simple budgeting framework: 50% of income for needs, 30% for wants, and 20% for savings and debt repayment." },
    { term: "Index Fund", category: "investing", definition: "A type of mutual fund that tracks a market index (like the S&P 500). Offers broad diversification at low cost — great for beginners." },
    { term: "ETF (Exchange-Traded Fund)", category: "investing", definition: "Similar to an index fund but trades like a stock on an exchange. Can be bought and sold throughout the trading day." },
    { term: "Diversification", category: "investing", definition: "Spreading your investments across different assets to reduce risk. 'Don't put all your eggs in one basket.'" },
    { term: "Inflation", category: "general", definition: "The gradual increase in prices over time, which reduces the purchasing power of money. Average historical rate is around 2-3% per year." },
    { term: "Net Worth", category: "general", definition: "Everything you own (assets) minus everything you owe (debts). A key measure of financial health." },
    { term: "Debt-to-Income Ratio", category: "budgeting", definition: "Your total monthly debt payments divided by your gross monthly income. Lenders use this to assess your ability to manage payments." },
    { term: "401(k)", category: "investing", definition: "An employer-sponsored retirement savings plan. Contributions are often tax-deferred and some employers match contributions — essentially free money." },
    { term: "Roth IRA", category: "investing", definition: "A retirement account where you contribute after-tax money, but withdrawals in retirement are tax-free. Great for younger investors." },
    { term: "Dollar-Cost Averaging", category: "investing", definition: "Investing a fixed amount regularly regardless of market conditions. This reduces the impact of volatility over time." },
    { term: "Liquidity", category: "general", definition: "How easily an asset can be converted to cash. Savings accounts are highly liquid; real estate is not." },
    { term: "Capital Gains", category: "investing", definition: "The profit from selling an investment for more than you paid. Can be short-term (taxed higher) or long-term (taxed lower)." },
    { term: "Credit Score", category: "general", definition: "A number (300-850) that represents your creditworthiness. Higher scores get better loan terms and interest rates." },
    { term: "Opportunity Cost", category: "general", definition: "The potential benefit you miss when choosing one option over another. Every financial decision has an opportunity cost." },
    { term: "Sinking Fund", category: "saving", definition: "Money set aside over time for a specific planned expense, like a vacation or new laptop. Prevents debt for expected costs." },
    { term: "High-Yield Savings Account", category: "saving", definition: "A savings account offering significantly higher interest rates than traditional savings, often 10-20x more. Usually found at online banks." },
    { term: "Fixed Expenses", category: "budgeting", definition: "Expenses that stay the same each month, like rent, car payments, or subscriptions. Easy to plan around." },
    { term: "Variable Expenses", category: "budgeting", definition: "Expenses that change month to month, like groceries, gas, or entertainment. Harder to predict but most flexible to cut." },
    { term: "Asset Allocation", category: "investing", definition: "How your investment portfolio is divided among different asset classes (stocks, bonds, cash). Should match your risk tolerance and goals." },
    { term: "Bear Market", category: "investing", definition: "A market decline of 20% or more from recent highs. Can be unsettling but is a normal part of market cycles." },
    { term: "Bull Market", category: "investing", definition: "A period of rising stock prices, generally by 20% or more. Bull markets tend to last longer than bear markets." },
    { term: "Rule of 72", category: "investing", definition: "A quick way to estimate how long it takes to double your money: divide 72 by the annual return rate. At 8%, money doubles in ~9 years." },
    { term: "Zero-Based Budget", category: "budgeting", definition: "A method where every dollar of income is assigned a purpose (expenses, savings, investing), so income minus outgoing equals zero." },
    { term: "Passive Income", category: "general", definition: "Income earned with minimal active effort, like dividends from investments, rental income, or royalties." },
    { term: "P/E Ratio", category: "investing", definition: "Price-to-Earnings ratio — a stock's current price divided by earnings per share. Helps assess if a stock is over- or under-valued." },
    { term: "Amortization", category: "general", definition: "The process of paying off a loan through regular payments over time. Early payments go more toward interest; later ones toward principal." },
]);

/**
 * Quiz questions with options, correct answer index, and explanations.
 * @type {Array<{question: string, options: string[], correct: number, explanation: string}>}
 */
const quizQuestions = Object.freeze([
    {
        question: "What is the recommended size for an emergency fund?",
        options: ["1 month of expenses", "3-6 months of living expenses", "1 year of salary", "Whatever you can save"],
        correct: 1,
        explanation: "Financial experts recommend saving 3-6 months of living expenses as an emergency fund. This provides enough cushion for most unexpected situations."
    },
    {
        question: "What does compound interest mean?",
        options: [
            "Interest paid only on the original deposit",
            "Interest that decreases over time",
            "Interest earned on both the principal and previously earned interest",
            "A type of loan interest"
        ],
        correct: 2,
        explanation: "Compound interest is interest calculated on both the initial principal and the accumulated interest — your earnings generate their own earnings."
    },
    {
        question: "In the 50/30/20 budget rule, what does the '20' represent?",
        options: ["Needs", "Wants", "Savings & debt repayment", "Taxes"],
        correct: 2,
        explanation: "The 50/30/20 rule suggests allocating 20% of your income to savings and debt repayment, 50% to needs, and 30% to wants."
    },
    {
        question: "Which investment type generally has the LOWEST risk?",
        options: ["Individual stocks", "Cryptocurrency", "Government bonds", "Options trading"],
        correct: 2,
        explanation: "Government bonds are backed by the government and are among the safest investments, though they offer lower returns compared to stocks."
    },
    {
        question: "What is dollar-cost averaging?",
        options: [
            "Buying stocks only when prices drop",
            "Investing a fixed amount at regular intervals regardless of price",
            "Selling investments at the highest price",
            "Converting foreign currencies"
        ],
        correct: 1,
        explanation: "Dollar-cost averaging means investing the same amount regularly. When prices are low, you buy more shares; when high, fewer — reducing the impact of volatility."
    },
    {
        question: "What is the Rule of 72 used for?",
        options: [
            "Calculating your tax rate",
            "Estimating how long it takes to double your money",
            "Determining your credit score",
            "Setting your budget percentage"
        ],
        correct: 1,
        explanation: "The Rule of 72: divide 72 by your annual return rate to estimate how many years it takes to double your investment. At 8%, it takes about 9 years."
    },
    {
        question: "What is an index fund?",
        options: [
            "A fund tracking a specific market index like the S&P 500",
            "A high-risk individual stock",
            "A type of savings account",
            "A government-issued bond"
        ],
        correct: 0,
        explanation: "An index fund tracks a market index, providing broad diversification at a low cost. It's one of the best options for beginner investors."
    },
    {
        question: "Why is inflation a concern for savers?",
        options: [
            "It increases the value of savings",
            "It erodes the purchasing power of money over time",
            "It has no effect on savings",
            "It only affects large accounts"
        ],
        correct: 1,
        explanation: "Inflation means prices rise over time. If your savings earn less interest than the inflation rate, your money actually loses purchasing power."
    },
    {
        question: "What does 'Pay Yourself First' mean?",
        options: [
            "Spend your money on yourself before paying bills",
            "Set aside savings before spending on anything else",
            "Pay off all debts first",
            "Keep all your money in cash"
        ],
        correct: 1,
        explanation: "'Pay Yourself First' means automatically saving/investing a portion of your income as soon as you receive it, before spending on other things."
    },
    {
        question: "What is a good credit score range?",
        options: ["100-300", "300-500", "500-650", "670-850"],
        correct: 3,
        explanation: "Credit scores range from 300-850. A score of 670+ is generally considered good. A higher score gets you better interest rates and loan terms."
    },
]);

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Sanitizes a numeric input value, clamping it within min/max bounds.
 * Prevents NaN and negative values where not allowed.
 * @param {number} value - The raw input value
 * @param {number} [min=0] - Minimum allowed value
 * @param {number} [max=MAX_CURRENCY_INPUT] - Maximum allowed value
 * @returns {number} Sanitized numeric value
 */
function sanitizeNumber(value, min = 0, max = MAX_CURRENCY_INPUT) {
    const num = parseFloat(value);
    if (Number.isNaN(num) || !Number.isFinite(num)) return min;
    return Math.max(min, Math.min(max, num));
}

/**
 * Formats a number as USD currency string.
 * @param {number} num - The number to format
 * @returns {string} Formatted currency string (e.g., "$1,234")
 */
function formatCurrency(num) {
    return '$' + num.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

/**
 * Escapes HTML special characters to prevent XSS in dynamic content.
 * @param {string} str - String to escape
 * @returns {string} HTML-safe string
 */
function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

/**
 * Creates a debounced version of a function that delays invocation.
 * @param {Function} func - Function to debounce
 * @param {number} [delay=DEBOUNCE_DELAY] - Delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, delay = DEBOUNCE_DELAY) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Safely retrieves a DOM element by ID, logging a warning if not found.
 * @param {string} id - Element ID
 * @returns {HTMLElement|null} The DOM element or null
 */
function getElement(id) {
    const el = document.getElementById(id);
    if (!el) {
        console.warn(`[FinWise] Element with ID "${id}" not found.`);
    }
    return el;
}

// ==========================================
// APP STATE
// ==========================================

/**
 * Application state object tracking mutable UI state.
 * @type {{savingsJar: number, quizCurrent: number, quizScore: number, quizAnswered: boolean}}
 */
const state = {
    savingsJar: 0,
    quizCurrent: 0,
    quizScore: 0,
    quizAnswered: false,
};

// ==========================================
// INITIALIZATION
// ==========================================

/**
 * Initializes all application modules on DOM ready.
 * Each module is wrapped in a try-catch to prevent cascading failures.
 */
document.addEventListener('DOMContentLoaded', () => {
    const modules = [
        ['Navbar', initNavbar],
        ['Hero Counters', initHeroCounters],
        ['Tabs', initTabs],
        ['Savings Jar', initSavingsJar],
        ['Growth Chart', initGrowthChart],
        ['Budget Donut', initBudgetDonut],
        ['Calculators', initCalculators],
        ['Budget Planner', initBudgetPlanner],
        ['Glossary', initGlossary],
        ['Quiz', initQuiz],
        ['Scroll Reveal', initScrollReveal],
    ];

    modules.forEach(([name, initFn]) => {
        try {
            initFn();
        } catch (error) {
            console.error(`[FinWise] Failed to initialize module: ${name}`, error);
        }
    });
});

// ==========================================
// NAVBAR
// ==========================================

/** Initializes sticky navbar behavior and mobile menu toggle with accessibility. */
function initNavbar() {
    const navbar = getElement('navbar');
    const toggle = getElement('navToggle');
    const links = getElement('navLinks');
    if (!navbar || !toggle || !links) return;

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    toggle.addEventListener('click', () => {
        const isOpen = links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close mobile nav on link click
    links.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            links.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Handle Escape key to close mobile nav
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && links.classList.contains('open')) {
            links.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.focus();
        }
    });
}

// ==========================================
// HERO COUNTER ANIMATION
// ==========================================

/** Animates stat counter numbers on scroll into view using IntersectionObserver. */
function initHeroCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'), 10);
                if (!Number.isNaN(target)) {
                    animateCounter(el, target);
                }
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

/**
 * Animates a counter element from 0 to a target value.
 * @param {HTMLElement} el - Counter DOM element
 * @param {number} target - Target number to animate to
 */
function animateCounter(el, target) {
    let current = 0;
    const duration = 1500;
    const step = target / (duration / 16);

    function update() {
        current += step;
        if (current >= target) {
            el.textContent = target;
            return;
        }
        el.textContent = Math.floor(current);
        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

// ==========================================
// LEARNING MODULE TABS
// ==========================================

/** Initializes tab switching for learning module panels with ARIA support. */
function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    if (!tabs.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab, tabs));

        // Keyboard navigation between tabs (arrow keys)
        tab.addEventListener('keydown', (e) => {
            const tabArray = Array.from(tabs);
            const currentIndex = tabArray.indexOf(tab);
            let newIndex;

            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                newIndex = (currentIndex + 1) % tabArray.length;
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                newIndex = (currentIndex - 1 + tabArray.length) % tabArray.length;
            }

            if (newIndex !== undefined) {
                tabArray[newIndex].focus();
                switchTab(tabArray[newIndex], tabs);
            }
        });
    });
}

/**
 * Switches the active tab and shows the corresponding panel.
 * @param {HTMLElement} activeTab - The tab to activate
 * @param {NodeList} allTabs - All tab elements
 */
function switchTab(activeTab, allTabs) {
    const target = activeTab.getAttribute('data-tab');

    allTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
        t.setAttribute('tabindex', '-1');
    });

    activeTab.classList.add('active');
    activeTab.setAttribute('aria-selected', 'true');
    activeTab.setAttribute('tabindex', '0');

    document.querySelectorAll('.module-panel').forEach(p => p.classList.remove('active'));
    const panel = getElement(`panel-${target}`);
    if (panel) panel.classList.add('active');

    // Initialize charts for newly visible panels
    if (target === 'investing') initGrowthChart();
    if (target === 'budgeting') initBudgetDonut();
}

// ==========================================
// SAVINGS JAR INTERACTIVE
// ==========================================

/** Initializes the interactive savings jar with click and keyboard support. */
function initSavingsJar() {
    const btn = getElement('addSavingsBtn');
    const fill = getElement('jarFill');
    const amount = getElement('jarAmount');
    if (!btn || !fill || !amount) return;

    btn.addEventListener('click', () => {
        if (state.savingsJar >= SAVINGS_JAR_GOAL) return;

        state.savingsJar += SAVINGS_JAR_INCREMENT;
        const pct = Math.min((state.savingsJar / SAVINGS_JAR_GOAL) * 100, 100);
        fill.style.height = pct + '%';
        amount.textContent = formatCurrency(state.savingsJar);

        // Visual feedback animation
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => { btn.style.transform = 'scale(1)'; }, 150);

        if (state.savingsJar >= SAVINGS_JAR_GOAL) {
            btn.textContent = '🎉 Goal Reached!';
            btn.disabled = true;
            btn.style.background = 'var(--accent-primary)';
        }
    });
}

// ==========================================
// GROWTH CHART (Canvas)
// ==========================================

/** Renders the investment growth comparison chart on canvas. */
function initGrowthChart() {
    const canvas = getElement('growthCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = 300 * dpr;
    ctx.scale(dpr, dpr);

    const w = canvas.offsetWidth;
    const h = 300;
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;
    const years = 30;
    const initial = 10000;

    /**
     * Calculates compound growth data points.
     * @param {number} rate - Annual growth rate as percentage
     * @returns {number[]} Array of values for each year
     */
    function calcGrowth(rate) {
        const data = [];
        for (let i = 0; i <= years; i++) {
            data.push(initial * Math.pow(1 + rate / 100, i));
        }
        return data;
    }

    const savings = calcGrowth(2);
    const bonds = calcGrowth(5);
    const stocks = calcGrowth(10);

    const maxVal = stocks[stocks.length - 1];
    const yScale = chartH / maxVal;
    const xScale = chartW / years;

    ctx.clearRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding.top + (chartH / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(w - padding.right, y);
        ctx.stroke();

        // Y axis labels
        const val = maxVal - (maxVal / 5) * i;
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.font = '11px Inter';
        ctx.textAlign = 'right';
        ctx.fillText('$' + Math.round(val / 1000) + 'k', padding.left - 8, y + 4);
    }

    // X axis labels
    ctx.textAlign = 'center';
    for (let i = 0; i <= years; i += 5) {
        const x = padding.left + i * xScale;
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillText(i + 'y', x, h - 10);
    }

    /**
     * Draws a line on the chart with a glow effect.
     * @param {number[]} data - Y-values for each point
     * @param {string} color - Line color
     * @param {number} lineWidth - Line width in pixels
     */
    function drawLine(data, color, lineWidth) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineJoin = 'round';

        data.forEach((val, i) => {
            const x = padding.left + i * xScale;
            const y = padding.top + chartH - val * yScale;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Glow effect
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    drawLine(savings, '#4ECDC4', 2);
    drawLine(bonds, '#FFD166', 2);
    drawLine(stocks, '#00D9A6', 2.5);

    // End-point dots
    [
        { data: savings, color: '#4ECDC4' },
        { data: bonds, color: '#FFD166' },
        { data: stocks, color: '#00D9A6' },
    ].forEach(ep => {
        const x = padding.left + years * xScale;
        const y = padding.top + chartH - ep.data[years] * yScale;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = ep.color;
        ctx.fill();
    });
}

// ==========================================
// BUDGET DONUT CHART (Canvas)
// ==========================================

/** Renders the 50/30/20 budget donut chart. */
function initBudgetDonut() {
    const canvas = getElement('budgetDonutCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 300;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const radius = 110;
    const thickness = 35;

    const segments = [
        { pct: 0.5, color: '#6C63FF', label: '50%' },
        { pct: 0.3, color: '#FF6B9D', label: '30%' },
        { pct: 0.2, color: '#00D9A6', label: '20%' },
    ];

    ctx.clearRect(0, 0, size, size);

    let startAngle = -Math.PI / 2;
    segments.forEach(seg => {
        const endAngle = startAngle + seg.pct * Math.PI * 2;

        ctx.beginPath();
        ctx.arc(cx, cy, radius, startAngle, endAngle);
        ctx.arc(cx, cy, radius - thickness, endAngle, startAngle, true);
        ctx.closePath();
        ctx.fillStyle = seg.color;
        ctx.fill();

        // Label on segment
        const midAngle = startAngle + (seg.pct * Math.PI * 2) / 2;
        const labelR = radius - thickness / 2;
        const lx = cx + Math.cos(midAngle) * labelR;
        const ly = cy + Math.sin(midAngle) * labelR;

        ctx.fillStyle = 'white';
        ctx.font = 'bold 13px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(seg.label, lx, ly);

        startAngle = endAngle;
    });

    // Center text
    ctx.fillStyle = '#f0f0f5';
    ctx.font = 'bold 20px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Budget', cx, cy - 8);
    ctx.font = '13px Inter';
    ctx.fillStyle = '#a0a0b8';
    ctx.fillText('Allocation', cx, cy + 14);
}

// ==========================================
// CALCULATORS
// ==========================================

/** Initializes calculator button event listeners. */
function initCalculators() {
    const ciBtn = getElement('ciCalculateBtn');
    const sgBtn = getElement('sgCalculateBtn');
    const infBtn = getElement('infCalculateBtn');

    if (ciBtn) ciBtn.addEventListener('click', calcCompoundInterest);
    if (sgBtn) sgBtn.addEventListener('click', calcSavingsGoal);
    if (infBtn) infBtn.addEventListener('click', calcInflation);
}

/**
 * Calculates and displays compound interest results with a chart.
 * Uses sanitized inputs and renders a mini growth chart.
 */
function calcCompoundInterest() {
    const principal = sanitizeNumber(getElement('ciPrincipal')?.value, 0, MAX_CURRENCY_INPUT);
    const monthly = sanitizeNumber(getElement('ciMonthly')?.value, 0, MAX_CURRENCY_INPUT);
    const rate = sanitizeNumber(getElement('ciRate')?.value, 0, MAX_RATE) / 100;
    const years = sanitizeNumber(getElement('ciYears')?.value, 1, MAX_YEARS);

    const monthlyRate = rate / 12;
    const months = Math.round(years) * 12;

    let balance = principal;
    const chartData = [balance];

    for (let m = 1; m <= months; m++) {
        balance = balance * (1 + monthlyRate) + monthly;
        if (m % 12 === 0) chartData.push(balance);
    }

    const totalInvested = principal + monthly * months;
    const interest = balance - totalInvested;

    const totalEl = getElement('ciTotalInvested');
    const interestEl = getElement('ciInterestEarned');
    const finalEl = getElement('ciFinalAmount');
    const resultEl = getElement('ciResult');

    if (totalEl) totalEl.textContent = formatCurrency(totalInvested);
    if (interestEl) interestEl.textContent = formatCurrency(interest);
    if (finalEl) finalEl.textContent = formatCurrency(balance);
    if (resultEl) resultEl.classList.add('visible');

    drawMiniChart('ciChartCanvas', chartData);
}

/**
 * Draws a mini area chart on a canvas element.
 * @param {string} canvasId - The canvas element ID
 * @param {number[]} data - Data points to plot
 */
function drawMiniChart(canvasId, data) {
    const canvas = getElement(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = 200 * dpr;
    ctx.scale(dpr, dpr);

    const w = canvas.offsetWidth;
    const h = 200;
    const pad = { top: 10, right: 10, bottom: 30, left: 50 };
    const chartW = w - pad.left - pad.right;
    const chartH = h - pad.top - pad.bottom;

    const maxVal = Math.max(...data);
    if (maxVal === 0) return; // Avoid division by zero

    const yScale = chartH / maxVal;
    const xScale = chartW / Math.max(data.length - 1, 1);

    ctx.clearRect(0, 0, w, h);

    // Fill gradient
    const gradient = ctx.createLinearGradient(0, pad.top, 0, h - pad.bottom);
    gradient.addColorStop(0, 'rgba(108, 99, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(108, 99, 255, 0)');

    ctx.beginPath();
    data.forEach((val, i) => {
        const x = pad.left + i * xScale;
        const y = pad.top + chartH - val * yScale;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.lineTo(pad.left + (data.length - 1) * xScale, h - pad.bottom);
    ctx.lineTo(pad.left, h - pad.bottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    data.forEach((val, i) => {
        const x = pad.left + i * xScale;
        const y = pad.top + chartH - val * yScale;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#6C63FF';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Y axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '10px Inter';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
        const val = (maxVal / 4) * i;
        const y = pad.top + chartH - val * yScale;
        ctx.fillText('$' + Math.round(val / 1000) + 'k', pad.left - 6, y + 3);
    }

    // X axis labels
    ctx.textAlign = 'center';
    const step = Math.max(1, Math.floor(data.length / 5));
    for (let i = 0; i < data.length; i += step) {
        const x = pad.left + i * xScale;
        ctx.fillText('Yr ' + i, x, h - 8);
    }
    const lastX = pad.left + (data.length - 1) * xScale;
    ctx.fillText('Yr ' + (data.length - 1), lastX, h - 8);

    // End dot
    const lastVal = data[data.length - 1];
    const endX = pad.left + (data.length - 1) * xScale;
    const endY = pad.top + chartH - lastVal * yScale;
    ctx.beginPath();
    ctx.arc(endX, endY, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#6C63FF';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(endX, endY, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
}

/** Calculates and displays savings goal timeline results. */
function calcSavingsGoal() {
    const goal = sanitizeNumber(getElement('sgGoal')?.value, 0, MAX_CURRENCY_INPUT);
    const current = sanitizeNumber(getElement('sgCurrent')?.value, 0, MAX_CURRENCY_INPUT);
    const monthly = sanitizeNumber(getElement('sgMonthly')?.value, 0, MAX_CURRENCY_INPUT);
    const rate = sanitizeNumber(getElement('sgRate')?.value, 0, MAX_RATE) / 100;

    const resultEl = getElement('sgResult');
    const timeEl = getElement('sgTime');

    if (monthly === 0 && current >= goal) {
        if (timeEl) timeEl.textContent = 'Already there!';
        if (resultEl) resultEl.classList.add('visible');
        return;
    }

    if (monthly === 0) {
        if (timeEl) timeEl.textContent = 'Need monthly savings!';
        if (resultEl) resultEl.classList.add('visible');
        return;
    }

    const monthlyRate = rate / 12;
    let balance = current;
    let months = 0;
    const maxMonths = MAX_YEARS * 12;

    while (balance < goal && months < maxMonths) {
        balance = balance * (1 + monthlyRate) + monthly;
        months++;
    }

    const years = Math.floor(months / 12);
    const remainMonths = months % 12;
    const totalContributed = current + monthly * months;
    const interest = balance - totalContributed;

    let timeStr = '';
    if (years > 0) timeStr += years + ' year' + (years > 1 ? 's' : '');
    if (remainMonths > 0) timeStr += (years > 0 ? ', ' : '') + remainMonths + ' month' + (remainMonths > 1 ? 's' : '');

    if (timeEl) timeEl.textContent = months >= maxMonths ? '50+ years' : timeStr;

    const contribEl = getElement('sgContributed');
    const interestEl = getElement('sgInterest');
    if (contribEl) contribEl.textContent = formatCurrency(totalContributed);
    if (interestEl) interestEl.textContent = formatCurrency(Math.max(0, interest));

    // Update progress bar with ARIA
    const pct = Math.min((current / goal) * 100, 100);
    const fillEl = getElement('sgProgressFill');
    const progressContainer = fillEl?.parentElement;
    if (fillEl) fillEl.style.width = pct + '%';
    if (progressContainer) progressContainer.setAttribute('aria-valuenow', String(Math.round(pct)));

    const startLabel = getElement('sgProgressStart');
    const endLabel = getElement('sgProgressEnd');
    if (startLabel) startLabel.textContent = formatCurrency(current);
    if (endLabel) endLabel.textContent = formatCurrency(goal);

    if (resultEl) resultEl.classList.add('visible');
}

/** Calculates and displays inflation impact on purchasing power. */
function calcInflation() {
    const amount = sanitizeNumber(getElement('infAmount')?.value, 0, MAX_CURRENCY_INPUT);
    const rate = sanitizeNumber(getElement('infRate')?.value, 0, MAX_RATE) / 100;
    const years = sanitizeNumber(getElement('infYears')?.value, 1, MAX_YEARS);

    const futureValue = amount / Math.pow(1 + rate, years);
    const lost = amount - futureValue;

    const currentEl = getElement('infCurrentVal');
    const futureEl = getElement('infFutureVal');
    const lostEl = getElement('infLost');
    const labelEl = getElement('infFutureLabel');

    if (currentEl) currentEl.textContent = formatCurrency(amount);
    if (futureEl) futureEl.textContent = formatCurrency(futureValue);
    if (lostEl) lostEl.textContent = '-' + formatCurrency(lost);
    if (labelEl) labelEl.textContent = `In ${Math.round(years)} years`;

    const pct = amount > 0 ? (futureValue / amount) * 100 : 0;
    const barNow = getElement('infBarNow');
    const barFuture = getElement('infBarFuture');
    if (barNow) barNow.textContent = formatCurrency(amount);
    if (barFuture) {
        barFuture.style.width = pct + '%';
        barFuture.textContent = formatCurrency(futureValue);
    }

    const resultEl = getElement('infResult');
    if (resultEl) resultEl.classList.add('visible');
}

// ==========================================
// BUDGET PLANNER
// ==========================================

/** Initializes the budget planner with the analyze button. */
function initBudgetPlanner() {
    const btn = getElement('analyzeBudgetBtn');
    if (btn) btn.addEventListener('click', analyzeBudget);
    analyzeBudget(); // Auto-analyze on load
}

/** Analyzes the user's budget input and generates a breakdown with advice. */
function analyzeBudget() {
    const income = sanitizeNumber(getElement('budgetIncome')?.value, 0, MAX_CURRENCY_INPUT);
    const expenses = document.querySelectorAll('.expense-amount');

    let totalNeeds = 0;
    let totalWants = 0;
    let totalExpenses = 0;

    expenses.forEach(exp => {
        const val = sanitizeNumber(exp.value, 0, MAX_CURRENCY_INPUT);
        const cat = exp.getAttribute('data-category');
        totalExpenses += val;
        if (cat === 'needs') totalNeeds += val;
        if (cat === 'wants') totalWants += val;
    });

    const remaining = income - totalExpenses;
    const needsPct = income > 0 ? (totalNeeds / income * 100).toFixed(0) : 0;
    const wantsPct = income > 0 ? (totalWants / income * 100).toFixed(0) : 0;
    const savingsPct = income > 0 ? (remaining / income * 100).toFixed(0) : 0;

    const incomeEl = getElement('budgetSummaryIncome');
    const expensesEl = getElement('budgetSummaryExpenses');
    const remainingEl = getElement('budgetSummaryRemaining');

    if (incomeEl) incomeEl.textContent = formatCurrency(income);
    if (expensesEl) expensesEl.textContent = formatCurrency(totalExpenses);
    if (remainingEl) {
        remainingEl.textContent = formatCurrency(remaining);
        remainingEl.style.color = remaining >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';
    }

    // Analysis items
    const analysisItems = getElement('analysisItems');
    if (analysisItems) {
        /**
         * Determines the rating class based on percentage vs threshold.
         * @param {number} pct - Actual percentage
         * @param {number} goodMax - Max for 'good' rating
         * @param {number} warnMax - Max for 'warning' rating
         * @returns {string} CSS class name
         */
        function getRating(pct, goodMax, warnMax) {
            return pct <= goodMax ? 'good' : pct <= warnMax ? 'warning' : 'bad';
        }

        analysisItems.innerHTML = `
            <div class="analysis-item">
                <div class="analysis-label">
                    <span class="analysis-dot" style="background: #6C63FF"></span>
                    Needs
                </div>
                <div class="analysis-values">
                    <span class="analysis-amount">${formatCurrency(totalNeeds)}</span>
                    <span class="analysis-pct ${getRating(needsPct, 50, 60)}">${escapeHtml(String(needsPct))}%</span>
                </div>
            </div>
            <div class="analysis-item">
                <div class="analysis-label">
                    <span class="analysis-dot" style="background: #FF6B9D"></span>
                    Wants
                </div>
                <div class="analysis-values">
                    <span class="analysis-amount">${formatCurrency(totalWants)}</span>
                    <span class="analysis-pct ${getRating(wantsPct, 30, 40)}">${escapeHtml(String(wantsPct))}%</span>
                </div>
            </div>
            <div class="analysis-item">
                <div class="analysis-label">
                    <span class="analysis-dot" style="background: #00D9A6"></span>
                    Available for Savings
                </div>
                <div class="analysis-values">
                    <span class="analysis-amount">${formatCurrency(Math.max(0, remaining))}</span>
                    <span class="analysis-pct ${savingsPct >= 20 ? 'good' : savingsPct >= 10 ? 'warning' : 'bad'}">${escapeHtml(String(Math.max(0, savingsPct)))}%</span>
                </div>
            </div>
        `;
    }

    drawBudgetPie(totalNeeds, totalWants, Math.max(0, remaining), income);
    generateBudgetAdvice(needsPct, wantsPct, savingsPct, remaining);
}

/**
 * Draws the budget breakdown donut/pie chart.
 * @param {number} needs - Needs amount
 * @param {number} wants - Wants amount
 * @param {number} savings - Savings/remaining amount
 * @param {number} total - Total income
 */
function drawBudgetPie(needs, wants, savings, total) {
    const canvas = getElement('budgetPieCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 250;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const radius = 95;
    const thickness = 30;

    const segments = [];
    if (total > 0) {
        if (needs > 0) segments.push({ pct: needs / total, color: '#6C63FF' });
        if (wants > 0) segments.push({ pct: wants / total, color: '#FF6B9D' });
        if (savings > 0) segments.push({ pct: savings / total, color: '#00D9A6' });
    }

    ctx.clearRect(0, 0, size, size);

    if (segments.length === 0) {
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.arc(cx, cy, radius - thickness, Math.PI * 2, 0, true);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.fill();
        return;
    }

    let startAngle = -Math.PI / 2;
    segments.forEach(seg => {
        const endAngle = startAngle + seg.pct * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, startAngle, endAngle);
        ctx.arc(cx, cy, radius - thickness, endAngle, startAngle, true);
        ctx.closePath();
        ctx.fillStyle = seg.color;
        ctx.fill();
        startAngle = endAngle;
    });

    // Center text
    ctx.fillStyle = '#f0f0f5';
    ctx.font = 'bold 18px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(formatCurrency(total), cx, cy - 6);
    ctx.font = '12px Inter';
    ctx.fillStyle = '#a0a0b8';
    ctx.fillText('Total Income', cx, cy + 14);
}

/**
 * Generates personalized budget advice based on spending percentages.
 * @param {number} needsPct - Needs as percentage of income
 * @param {number} wantsPct - Wants as percentage of income
 * @param {number} savingsPct - Savings as percentage of income
 * @param {number} remaining - Remaining amount after expenses
 */
function generateBudgetAdvice(needsPct, wantsPct, savingsPct, remaining) {
    const advice = [];

    if (remaining < 0) {
        advice.push("⚠️ You're spending more than you earn. Consider cutting non-essential expenses immediately.");
    }

    if (needsPct > 50) {
        advice.push("Your needs exceed 50% of income. Look for ways to reduce fixed costs — consider a roommate, refinancing, or switching providers.");
    } else {
        advice.push("✅ Great! Your essential expenses are within the recommended 50% range.");
    }

    if (wantsPct > 30) {
        advice.push("Discretionary spending is above 30%. Try tracking wants for a month and identify areas to trim.");
    } else {
        advice.push("✅ Your wants spending is well-managed at " + wantsPct + "%.");
    }

    if (savingsPct >= 20) {
        advice.push("✅ Excellent! You're saving " + savingsPct + "% — above the recommended 20%. You're building wealth!");
    } else if (savingsPct >= 10) {
        advice.push("You're saving " + savingsPct + "%. Try to increase to 20% by finding small cuts in discretionary spending.");
    } else if (savingsPct > 0) {
        advice.push("Currently saving only " + savingsPct + "%. Even increasing by 2-3% per month makes a big difference over time.");
    }

    const adviceEl = getElement('budgetAdvice');
    if (adviceEl) {
        adviceEl.innerHTML = `
            <div class="advice-title">💡 Personalized Advice</div>
            <ul class="advice-list">
                ${advice.map(a => `<li>${escapeHtml(a)}</li>`).join('')}
            </ul>
        `;
    }
}

// ==========================================
// GLOSSARY
// ==========================================

/** Initializes the glossary with search (debounced) and category filter support. */
function initGlossary() {
    renderGlossary(glossaryData);

    const searchInput = getElement('glossarySearch');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterGlossary, DEBOUNCE_DELAY));
    }

    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            filterTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            filterGlossary();
        });
    });
}

/** Filters glossary terms based on search input and active category filter. */
function filterGlossary() {
    const searchInput = getElement('glossarySearch');
    const activeFilter = document.querySelector('.filter-tag.active');
    if (!searchInput || !activeFilter) return;

    const search = searchInput.value.toLowerCase().trim();
    const filter = activeFilter.getAttribute('data-filter');

    const filtered = glossaryData.filter(item => {
        const matchesSearch = item.term.toLowerCase().includes(search) ||
                              item.definition.toLowerCase().includes(search);
        const matchesFilter = filter === 'all' || item.category === filter;
        return matchesSearch && matchesFilter;
    });

    renderGlossary(filtered);

    const emptyEl = getElement('glossaryEmpty');
    const gridEl = getElement('glossaryGrid');
    if (emptyEl) emptyEl.style.display = filtered.length === 0 ? 'block' : 'none';
    if (gridEl) gridEl.style.display = filtered.length === 0 ? 'none' : 'grid';
}

/**
 * Renders glossary cards from an array of term data.
 * Uses escapeHtml for XSS prevention on user-searchable content.
 * @param {Array<{term: string, category: string, definition: string}>} data - Terms to render
 */
function renderGlossary(data) {
    const grid = getElement('glossaryGrid');
    if (!grid) return;

    grid.innerHTML = data.map(item => `
        <article class="glossary-card" role="listitem">
            <div class="glossary-term">
                ${escapeHtml(item.term)}
                <span class="glossary-category-tag ${escapeHtml(item.category)}">${escapeHtml(item.category)}</span>
            </div>
            <p class="glossary-def">${escapeHtml(item.definition)}</p>
        </article>
    `).join('');
}

// ==========================================
// QUIZ
// ==========================================

/** Initializes the quiz module, resetting state and loading the first question. */
function initQuiz() {
    state.quizCurrent = 0;
    state.quizScore = 0;
    state.quizAnswered = false;
    loadQuestion();

    const nextBtn = getElement('quizNextBtn');
    const restartBtn = getElement('quizRestartBtn');
    if (nextBtn) nextBtn.addEventListener('click', nextQuestion);
    if (restartBtn) restartBtn.addEventListener('click', restartQuiz);
}

/** Loads the current question into the quiz UI with ARIA-compliant options. */
function loadQuestion() {
    const q = quizQuestions[state.quizCurrent];
    if (!q) return;

    const total = quizQuestions.length;
    const progressText = getElement('quizProgressText');
    const progressFill = getElement('quizProgressFill');
    const questionEl = getElement('quizQuestion');
    const optionsEl = getElement('quizOptions');
    const feedbackEl = getElement('quizFeedback');
    const nextBtn = getElement('quizNextBtn');
    const progressBar = progressFill?.parentElement;

    const progressPct = ((state.quizCurrent + 1) / total * 100);

    if (progressText) progressText.textContent = `Question ${state.quizCurrent + 1} of ${total}`;
    if (progressFill) progressFill.style.width = progressPct + '%';
    if (progressBar) progressBar.setAttribute('aria-valuenow', String(Math.round(progressPct)));
    if (questionEl) questionEl.textContent = q.question;

    if (optionsEl) {
        const letters = ['A', 'B', 'C', 'D'];
        optionsEl.innerHTML = q.options.map((opt, i) => `
            <div class="quiz-option" data-index="${i}" role="radio" aria-checked="false" tabindex="0" aria-label="Option ${letters[i]}: ${escapeHtml(opt)}">
                <span class="quiz-option-letter" aria-hidden="true">${letters[i]}</span>
                <span>${escapeHtml(opt)}</span>
            </div>
        `).join('');

        // Attach click and keyboard event listeners
        optionsEl.querySelectorAll('.quiz-option').forEach(optEl => {
            optEl.addEventListener('click', () => {
                selectAnswer(parseInt(optEl.getAttribute('data-index'), 10));
            });
            optEl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectAnswer(parseInt(optEl.getAttribute('data-index'), 10));
                }
            });
        });
    }

    if (feedbackEl) {
        feedbackEl.className = 'quiz-feedback';
        feedbackEl.style.display = 'none';
        feedbackEl.textContent = '';
    }
    if (nextBtn) nextBtn.style.display = 'none';
    state.quizAnswered = false;
}

/**
 * Handles answer selection, marks correct/wrong, and shows feedback.
 * @param {number} index - Index of the selected answer (0-3)
 */
function selectAnswer(index) {
    if (state.quizAnswered) return;
    if (index < 0 || index >= 4) return; // Bounds check

    state.quizAnswered = true;

    const q = quizQuestions[state.quizCurrent];
    const options = document.querySelectorAll('.quiz-option');
    const feedback = getElement('quizFeedback');

    options.forEach((opt, i) => {
        opt.classList.add('disabled');
        opt.setAttribute('aria-disabled', 'true');
        if (i === q.correct) {
            opt.classList.add('correct');
            opt.setAttribute('aria-checked', i === index ? 'true' : 'false');
        }
        if (i === index && i !== q.correct) {
            opt.classList.add('wrong');
            opt.setAttribute('aria-checked', 'true');
        }
    });

    if (index === q.correct) {
        state.quizScore++;
        if (feedback) {
            feedback.className = 'quiz-feedback visible correct';
            feedback.textContent = '✅ Correct! ' + q.explanation;
            feedback.style.display = 'block';
        }
    } else {
        if (feedback) {
            feedback.className = 'quiz-feedback visible wrong';
            feedback.textContent = '❌ Not quite. ' + q.explanation;
            feedback.style.display = 'block';
        }
    }

    const nextBtn = getElement('quizNextBtn');
    if (nextBtn) {
        nextBtn.style.display = 'flex';
        nextBtn.textContent = state.quizCurrent === quizQuestions.length - 1
            ? 'See Results →'
            : 'Next Question →';
    }
}

/** Advances to the next quiz question or shows results. */
function nextQuestion() {
    state.quizCurrent++;

    if (state.quizCurrent >= quizQuestions.length) {
        showScore();
        return;
    }

    loadQuestion();
}

/** Displays the final quiz score and a contextual message. */
function showScore() {
    const quizCard = getElement('quizCard');
    const progressDiv = document.querySelector('.quiz-progress');
    const scorePanel = getElement('quizScore');

    if (quizCard) quizCard.style.display = 'none';
    if (progressDiv) progressDiv.style.display = 'none';
    if (scorePanel) scorePanel.style.display = 'block';

    const scoreNumber = getElement('scoreNumber');
    if (scoreNumber) scoreNumber.textContent = state.quizScore;

    const pct = state.quizScore / quizQuestions.length;
    let msg, desc;

    if (pct >= 0.9) {
        msg = '🏆 Outstanding!';
        desc = "You have an excellent understanding of financial concepts. You're well-equipped to make smart money decisions!";
    } else if (pct >= 0.7) {
        msg = '🌟 Great Job!';
        desc = 'You have a solid grasp of finance basics. Review the topics above to strengthen your knowledge further.';
    } else if (pct >= 0.5) {
        msg = '📚 Good Start!';
        desc = "You know some basics but there's more to learn. Read through the learning modules to boost your score.";
    } else {
        msg = '🌱 Keep Learning!';
        desc = "Financial literacy is a journey. Revisit the learning sections above and try again — you'll improve quickly!";
    }

    const msgEl = getElement('scoreMessage');
    const descEl = getElement('scoreDesc');
    if (msgEl) msgEl.textContent = msg;
    if (descEl) descEl.textContent = desc;
}

/** Resets the quiz to the beginning. */
function restartQuiz() {
    state.quizCurrent = 0;
    state.quizScore = 0;

    const quizCard = getElement('quizCard');
    const progressDiv = document.querySelector('.quiz-progress');
    const scorePanel = getElement('quizScore');
    const nextBtn = getElement('quizNextBtn');

    if (quizCard) quizCard.style.display = 'block';
    if (progressDiv) progressDiv.style.display = 'block';
    if (scorePanel) scorePanel.style.display = 'none';
    if (nextBtn) nextBtn.textContent = 'Next Question →';

    loadQuestion();
}

// ==========================================
// SCROLL REVEAL
// ==========================================

/** Initializes scroll-triggered reveal animations using IntersectionObserver. */
function initScrollReveal() {
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const elements = document.querySelectorAll(
        '.section-header, .calc-card, .glossary-card, .key-point, .module-visual, .budget-planner, .quiz-container'
    );

    elements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
    });

    elements.forEach(el => observer.observe(el));
}
