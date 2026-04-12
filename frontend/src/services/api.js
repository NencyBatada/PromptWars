const API_BASE = 'http://localhost:5001/api';

export const fetchGlossary = async () => {
    const res = await fetch(`${API_BASE}/glossary`);
    if (!res.ok) throw new Error('Failed to fetch glossary');
    return res.json();
};

export const fetchQuiz = async () => {
    const res = await fetch(`${API_BASE}/quiz`);
    if (!res.ok) throw new Error('Failed to fetch quiz');
    return res.json();
};
