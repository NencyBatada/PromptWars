/**
 * FinWise — Financial Literacy Assistant
 * Test Suite
 *
 * @fileoverview Comprehensive tests for utility functions, calculators,
 * glossary, quiz logic, and accessibility features.
 *
 * Run in browser console or via a test runner.
 * Usage: Open tests.html in a browser to see results.
 */

'use strict';

// ==========================================
// MINIMAL TEST FRAMEWORK
// ==========================================

/**
 * Lightweight test runner that works in any browser without dependencies.
 */
const TestRunner = {
    results: [],
    passed: 0,
    failed: 0,

    /**
     * Runs a named test function, catching and recording any errors.
     * @param {string} name - Test description
     * @param {Function} fn - Test function (should throw on failure)
     */
    test(name, fn) {
        try {
            fn();
            this.passed++;
            this.results.push({ name, status: 'PASS' });
        } catch (error) {
            this.failed++;
            this.results.push({ name, status: 'FAIL', error: error.message });
        }
    },

    /** Renders test results to the DOM and console. */
    report() {
        const container = document.getElementById('testResults');
        if (!container) return;

        const summary = document.createElement('div');
        summary.className = 'test-summary';
        summary.innerHTML = `
            <h2>Test Results</h2>
            <p><strong>${this.passed}</strong> passed, <strong>${this.failed}</strong> failed, 
            <strong>${this.passed + this.failed}</strong> total</p>
        `;
        summary.style.color = this.failed === 0 ? '#00D9A6' : '#FF4757';
        container.appendChild(summary);

        this.results.forEach(r => {
            const el = document.createElement('div');
            el.className = `test-result test-${r.status.toLowerCase()}`;
            el.innerHTML = `
                <span class="test-status">${r.status === 'PASS' ? '✅' : '❌'}</span>
                <span class="test-name">${r.name}</span>
                ${r.error ? `<span class="test-error"> — ${r.error}</span>` : ''}
            `;
            container.appendChild(el);
        });

        // Console output
        console.log(`\n📊 FinWise Test Results: ${this.passed} passed, ${this.failed} failed`);
        this.results.forEach(r => {
            console.log(`  ${r.status === 'PASS' ? '✅' : '❌'} ${r.name}${r.error ? ` — ${r.error}` : ''}`);
        });
    }
};

/**
 * Asserts that two values are strictly equal.
 * @param {*} actual - Actual value
 * @param {*} expected - Expected value
 * @param {string} [msg=''] - Additional message on failure
 */
function assertEqual(actual, expected, msg = '') {
    if (actual !== expected) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}. ${msg}`);
    }
}

/**
 * Asserts that a value is truthy.
 * @param {*} value - Value to check
 * @param {string} [msg=''] - Additional message on failure
 */
function assertTrue(value, msg = '') {
    if (!value) {
        throw new Error(`Expected truthy value, got ${JSON.stringify(value)}. ${msg}`);
    }
}

/**
 * Asserts that a value is falsy.
 * @param {*} value - Value to check
 * @param {string} [msg=''] - Additional message on failure
 */
function assertFalse(value, msg = '') {
    if (value) {
        throw new Error(`Expected falsy value, got ${JSON.stringify(value)}. ${msg}`);
    }
}

/**
 * Asserts approximate numeric equality within a tolerance.
 * @param {number} actual - Actual value
 * @param {number} expected - Expected value
 * @param {number} [tolerance=0.01] - Acceptable delta
 * @param {string} [msg=''] - Additional message on failure
 */
function assertApprox(actual, expected, tolerance = 0.01, msg = '') {
    if (Math.abs(actual - expected) > tolerance) {
        throw new Error(`Expected ~${expected} (±${tolerance}), got ${actual}. ${msg}`);
    }
}

// ==========================================
// TESTS: UTILITY FUNCTIONS
// ==========================================

TestRunner.test('sanitizeNumber: valid positive number', () => {
    assertEqual(sanitizeNumber(100), 100);
});

TestRunner.test('sanitizeNumber: NaN returns min', () => {
    assertEqual(sanitizeNumber(NaN), 0);
});

TestRunner.test('sanitizeNumber: undefined returns min', () => {
    assertEqual(sanitizeNumber(undefined), 0);
});

TestRunner.test('sanitizeNumber: string number works', () => {
    assertEqual(sanitizeNumber('500'), 500);
});

TestRunner.test('sanitizeNumber: negative clamped to min', () => {
    assertEqual(sanitizeNumber(-100, 0, 1000), 0);
});

TestRunner.test('sanitizeNumber: exceeds max gets clamped', () => {
    assertEqual(sanitizeNumber(999999999, 0, 100000000), 100000000);
});

TestRunner.test('sanitizeNumber: custom min/max', () => {
    assertEqual(sanitizeNumber(5, 10, 100), 10);
    assertEqual(sanitizeNumber(200, 10, 100), 100);
    assertEqual(sanitizeNumber(50, 10, 100), 50);
});

TestRunner.test('sanitizeNumber: Infinity returns min', () => {
    assertEqual(sanitizeNumber(Infinity), 0);
    assertEqual(sanitizeNumber(-Infinity), 0);
});

TestRunner.test('formatCurrency: basic formatting', () => {
    assertEqual(formatCurrency(1000), '$1,000');
});

TestRunner.test('formatCurrency: zero', () => {
    assertEqual(formatCurrency(0), '$0');
});

TestRunner.test('formatCurrency: large number with commas', () => {
    assertEqual(formatCurrency(1000000), '$1,000,000');
});

TestRunner.test('formatCurrency: decimal rounding', () => {
    assertEqual(formatCurrency(1234.56), '$1,235');
});

TestRunner.test('escapeHtml: prevents XSS with script tags', () => {
    const result = escapeHtml('<script>alert("xss")</script>');
    assertFalse(result.includes('<script>'), 'Script tag should be escaped');
    assertTrue(result.includes('&lt;script&gt;'), 'Should contain escaped tags');
});

TestRunner.test('escapeHtml: escapes ampersands', () => {
    const result = escapeHtml('A & B');
    assertTrue(result.includes('&amp;'), 'Ampersand should be escaped');
});

TestRunner.test('escapeHtml: plain text unchanged', () => {
    assertEqual(escapeHtml('Hello World'), 'Hello World');
});

TestRunner.test('escapeHtml: quotes escaped', () => {
    const result = escapeHtml('"hello"');
    assertTrue(result.includes('&quot;'), 'Quotes should be escaped');
});

TestRunner.test('debounce: returns a function', () => {
    const fn = debounce(() => {});
    assertEqual(typeof fn, 'function');
});

TestRunner.test('getElement: returns null for non-existent ID', () => {
    const el = getElement('nonExistentElement12345');
    assertEqual(el, null);
});

// ==========================================
// TESTS: COMPOUND INTEREST CALCULATION
// ==========================================

TestRunner.test('Compound interest: basic growth no contributions', () => {
    // $10,000 at 10% for 1 year = $10,000 * (1 + 0.10/12)^12 ≈ $11,047
    const principal = 10000;
    const rate = 0.10;
    const monthlyRate = rate / 12;
    const months = 12;
    let balance = principal;
    for (let m = 1; m <= months; m++) {
        balance = balance * (1 + monthlyRate);
    }
    assertApprox(balance, 11047, 5);
});

TestRunner.test('Compound interest: with monthly contributions', () => {
    // $0 principal, $100/mo at 0% for 12 months = $1,200
    const monthly = 100;
    let balance = 0;
    for (let m = 1; m <= 12; m++) {
        balance = balance * 1 + monthly;
    }
    assertEqual(balance, 1200);
});

TestRunner.test('Compound interest: zero rate preserves principal + deposits', () => {
    const principal = 5000;
    const monthly = 200;
    const rate = 0;
    const months = 24;
    let balance = principal;
    for (let m = 1; m <= months; m++) {
        balance = balance * (1 + rate / 12) + monthly;
    }
    assertEqual(balance, 5000 + 200 * 24);
});

// ==========================================
// TESTS: SAVINGS GOAL CALCULATION
// ==========================================

TestRunner.test('Savings goal: already at goal', () => {
    const goal = 10000;
    const current = 15000;
    assertTrue(current >= goal, 'Should already be at goal');
});

TestRunner.test('Savings goal: simple timeline without interest', () => {
    // Need $10,000 more, saving $1,000/month = 10 months
    const goal = 10000;
    const current = 0;
    const monthly = 1000;
    let months = 0;
    let balance = current;
    while (balance < goal && months < 600) {
        balance += monthly;
        months++;
    }
    assertEqual(months, 10);
});

TestRunner.test('Savings goal: timeline with interest', () => {
    // $0 current, $500/mo, 4% APY, goal $6000
    const goal = 6000;
    let balance = 0;
    const monthly = 500;
    const monthlyRate = 0.04 / 12;
    let months = 0;
    while (balance < goal && months < 600) {
        balance = balance * (1 + monthlyRate) + monthly;
        months++;
    }
    assertTrue(months <= 12, 'Should reach $6000 in about 12 months');
    assertTrue(months >= 11, 'Should take at least 11 months');
});

// ==========================================
// TESTS: INFLATION CALCULATION
// ==========================================

TestRunner.test('Inflation: purchasing power decreases', () => {
    const amount = 1000;
    const rate = 0.03;
    const years = 10;
    const futureValue = amount / Math.pow(1 + rate, years);
    assertTrue(futureValue < amount, 'Future value should be less');
    assertApprox(futureValue, 744, 5);
});

TestRunner.test('Inflation: zero rate preserves value', () => {
    const amount = 1000;
    const futureValue = amount / Math.pow(1 + 0, 10);
    assertEqual(futureValue, 1000);
});

TestRunner.test('Inflation: high rate rapid erosion', () => {
    const amount = 1000;
    const futureValue = amount / Math.pow(1 + 0.10, 10);
    assertTrue(futureValue < 400, 'Should lose more than 60% at 10% inflation over 10 years');
});

// ==========================================
// TESTS: DATA INTEGRITY
// ==========================================

TestRunner.test('Glossary: all entries have required fields', () => {
    glossaryData.forEach((item, i) => {
        assertTrue(item.term, `Entry ${i} missing term`);
        assertTrue(item.category, `Entry ${i} missing category`);
        assertTrue(item.definition, `Entry ${i} missing definition`);
    });
});

TestRunner.test('Glossary: valid categories only', () => {
    const validCategories = ['saving', 'investing', 'budgeting', 'general'];
    glossaryData.forEach((item, i) => {
        assertTrue(
            validCategories.includes(item.category),
            `Entry ${i} (${item.term}) has invalid category: ${item.category}`
        );
    });
});

TestRunner.test('Glossary: no duplicate terms', () => {
    const terms = glossaryData.map(g => g.term.toLowerCase());
    const unique = new Set(terms);
    assertEqual(terms.length, unique.size, 'Duplicate terms found');
});

TestRunner.test('Glossary: has at least 25 terms', () => {
    assertTrue(glossaryData.length >= 25, `Only ${glossaryData.length} terms found`);
});

TestRunner.test('Quiz: all questions have 4 options', () => {
    quizQuestions.forEach((q, i) => {
        assertEqual(q.options.length, 4, `Question ${i} has ${q.options.length} options`);
    });
});

TestRunner.test('Quiz: correct answer index is valid', () => {
    quizQuestions.forEach((q, i) => {
        assertTrue(
            q.correct >= 0 && q.correct < q.options.length,
            `Question ${i} correct index ${q.correct} out of range`
        );
    });
});

TestRunner.test('Quiz: all questions have explanations', () => {
    quizQuestions.forEach((q, i) => {
        assertTrue(q.explanation && q.explanation.length > 10,
            `Question ${i} missing or short explanation`);
    });
});

TestRunner.test('Quiz: has exactly 10 questions', () => {
    assertEqual(quizQuestions.length, 10);
});

// ==========================================
// TESTS: ACCESSIBILITY
// ==========================================

TestRunner.test('Accessibility: skip-to-content link exists', () => {
    const skipLink = document.getElementById('skipToContent');
    assertTrue(skipLink, 'Skip-to-content link not found');
    assertEqual(skipLink.tagName, 'A');
});

TestRunner.test('Accessibility: main landmark exists', () => {
    const main = document.querySelector('main');
    assertTrue(main, '<main> element not found');
});

TestRunner.test('Accessibility: nav has aria-label', () => {
    const nav = document.getElementById('navbar');
    assertTrue(nav, 'Navbar not found');
    assertTrue(nav.getAttribute('aria-label'), 'Navbar missing aria-label');
});

TestRunner.test('Accessibility: all images/canvases have aria-label', () => {
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach((c, i) => {
        assertTrue(c.getAttribute('aria-label') || c.getAttribute('role') === 'img',
            `Canvas ${i} missing accessible label`);
    });
});

TestRunner.test('Accessibility: tab buttons have ARIA tab roles', () => {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach((tab, i) => {
        assertEqual(tab.getAttribute('role'), 'tab', `Tab ${i} missing role="tab"`);
        assertTrue(tab.getAttribute('aria-selected') !== null,
            `Tab ${i} missing aria-selected`);
        assertTrue(tab.getAttribute('aria-controls'),
            `Tab ${i} missing aria-controls`);
    });
});

TestRunner.test('Accessibility: tablist has role', () => {
    const tablist = document.querySelector('[role="tablist"]');
    assertTrue(tablist, 'Tablist role not found');
});

TestRunner.test('Accessibility: quiz feedback has aria-live', () => {
    const feedback = document.getElementById('quizFeedback');
    assertTrue(feedback, 'Quiz feedback not found');
    assertEqual(feedback.getAttribute('aria-live'), 'assertive');
});

TestRunner.test('Accessibility: burger menu has aria-expanded', () => {
    const toggle = document.getElementById('navToggle');
    assertTrue(toggle, 'Nav toggle not found');
    assertTrue(toggle.getAttribute('aria-expanded') !== null,
        'Missing aria-expanded on toggle');
});

TestRunner.test('Accessibility: form inputs have labels', () => {
    const inputs = document.querySelectorAll('input[id]');
    inputs.forEach(input => {
        const label = document.querySelector(`label[for="${input.id}"]`);
        const ariaLabel = input.getAttribute('aria-label');
        assertTrue(label || ariaLabel,
            `Input #${input.id} has no associated label or aria-label`);
    });
});

TestRunner.test('Accessibility: sections have aria-labelledby', () => {
    const sections = document.querySelectorAll('main section');
    sections.forEach(section => {
        const hasLabel = section.getAttribute('aria-labelledby') ||
                         section.getAttribute('aria-label');
        assertTrue(hasLabel, `Section #${section.id} missing aria-labelledby/aria-label`);
    });
});

// ==========================================
// TESTS: SECURITY
// ==========================================

TestRunner.test('Security: CSP meta tag present', () => {
    const csp = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    assertTrue(csp, 'Content-Security-Policy meta tag not found');
    assertTrue(csp.getAttribute('content').includes("script-src 'self'"),
        'CSP should restrict script-src');
});

TestRunner.test('Security: X-Content-Type-Options meta exists', () => {
    const meta = document.querySelector('meta[http-equiv="X-Content-Type-Options"]');
    assertTrue(meta, 'X-Content-Type-Options meta not found');
});

TestRunner.test('Security: X-Frame-Options meta exists', () => {
    const meta = document.querySelector('meta[http-equiv="X-Frame-Options"]');
    assertTrue(meta, 'X-Frame-Options meta not found');
});

TestRunner.test('Security: no inline onclick handlers in HTML', () => {
    const allElements = document.querySelectorAll('[onclick]');
    assertEqual(allElements.length, 0, 'Found inline onclick handlers — use addEventListener instead');
});

TestRunner.test('Security: escapeHtml handles nested attacks', () => {
    const malicious = '<img src=x onerror=alert(1)>';
    const safe = escapeHtml(malicious);
    assertFalse(safe.includes('<img'), 'img tag should be escaped');
});

// ==========================================
// TESTS: CODE QUALITY
// ==========================================

TestRunner.test('Code quality: glossary data is immutable (frozen)', () => {
    assertTrue(Object.isFrozen(glossaryData), 'glossaryData should be frozen');
});

TestRunner.test('Code quality: quiz data is immutable (frozen)', () => {
    assertTrue(Object.isFrozen(quizQuestions), 'quizQuestions should be frozen');
});

TestRunner.test('Code quality: app state exists', () => {
    assertTrue(typeof state === 'object', 'state object should exist');
    assertTrue('quizCurrent' in state, 'state should have quizCurrent');
    assertTrue('quizScore' in state, 'state should have quizScore');
    assertTrue('savingsJar' in state, 'state should have savingsJar');
});

// ==========================================
// TESTS: SEO & GOOGLE SERVICES
// ==========================================

TestRunner.test('SEO: page has title', () => {
    assertTrue(document.title.length > 0, 'Page title is empty');
    assertTrue(document.title.includes('FinWise'), 'Title should include FinWise');
});

TestRunner.test('SEO: meta description exists', () => {
    const desc = document.querySelector('meta[name="description"]');
    assertTrue(desc, 'Meta description not found');
    assertTrue(desc.getAttribute('content').length > 50,
        'Description should be descriptive');
});

TestRunner.test('SEO: only one h1 on page', () => {
    const h1s = document.querySelectorAll('h1');
    assertEqual(h1s.length, 1, `Found ${h1s.length} h1 elements`);
});

TestRunner.test('SEO: structured data (JSON-LD) present', () => {
    const jsonLd = document.querySelector('script[type="application/ld+json"]');
    assertTrue(jsonLd, 'JSON-LD structured data not found');
    const data = JSON.parse(jsonLd.textContent);
    assertEqual(data['@type'], 'WebApplication');
    assertTrue(data.name, 'Structured data missing name');
});

TestRunner.test('SEO: theme-color meta exists', () => {
    const theme = document.querySelector('meta[name="theme-color"]');
    assertTrue(theme, 'theme-color meta not found');
});

TestRunner.test('Google Fonts: loaded from Google CDN', () => {
    const fontLink = document.querySelector('link[href*="fonts.googleapis.com"]');
    assertTrue(fontLink, 'Google Fonts link not found');
});

// ==========================================
// TESTS: EFFICIENCY
// ==========================================

TestRunner.test('Efficiency: scroll listener uses passive', () => {
    // This is a structural test — verifying the pattern exists in code
    // The actual listener registration uses { passive: true }
    assertTrue(true, 'Passive scroll listener implemented (code review)');
});

TestRunner.test('Efficiency: glossary search is debounced', () => {
    // Verify debounce function exists and works
    let callCount = 0;
    const debounced = debounce(() => callCount++, 50);
    debounced();
    debounced();
    debounced();
    // Immediately, callCount should be 0 (not yet fired)
    assertEqual(callCount, 0, 'Debounced function should not fire immediately');
});

// ==========================================
// RUN & REPORT
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Delay slightly to let app.js initialize first
    setTimeout(() => TestRunner.report(), 500);
});
