const API_BASE = 'http://localhost:5001/api';

export interface GlossaryTerm {
    term: string;
    category: string;
    definition: string;
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
}

export const fetchGlossary = async (): Promise<GlossaryTerm[]> => {
    const res = await fetch(`${API_BASE}/glossary`);
    if (!res.ok) throw new Error('Failed to fetch glossary');
    return res.json();
};

export const fetchQuiz = async (): Promise<QuizQuestion[]> => {
    const res = await fetch(`${API_BASE}/quiz`);
    if (!res.ok) throw new Error('Failed to fetch quiz');
    return res.json();
};
