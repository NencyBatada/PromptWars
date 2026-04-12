/**
 * API Service Layer for FinWise
 * Centralized API communication with proper error handling and environment-aware URLs.
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';

/** Custom error class for API errors */
export class ApiError extends Error {
    constructor(message: string, public statusCode: number) {
        super(message);
        this.name = 'ApiError';
    }
}

/** Generic fetch wrapper with error handling */
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    try {
        const res = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });
        if (!res.ok) {
            const errorBody = await res.json().catch(() => ({ error: res.statusText }));
            throw new ApiError(errorBody.error || `Request failed: ${res.statusText}`, res.status);
        }
        return res.json();
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError('Network error. Please check your connection.', 0);
    }
}

// --- Type Definitions ---

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

export interface AdvisorResponse {
    response: string;
}

export interface HistoryEntry {
    id: number;
    user_message: string;
    ai_response: string;
    timestamp: string;
}

// --- API Functions ---

export const fetchGlossary = (): Promise<GlossaryTerm[]> => apiFetch('/glossary');

export const fetchQuiz = (): Promise<QuizQuestion[]> => apiFetch('/quiz');

export const fetchAdvisorResponse = (message: string, topic?: string): Promise<AdvisorResponse> =>
    apiFetch('/advisor', {
        method: 'POST',
        body: JSON.stringify({ message, context: { topic: topic || 'general' } }),
    });

export const fetchHistory = (): Promise<HistoryEntry[]> => apiFetch('/history');
