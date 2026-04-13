import { create } from 'zustand';
import { QUESTIONS, type Question } from '../data/questions';

export interface AnswerRecord {
  questionId: string;
  correct: boolean;
}

interface QuizState {
  questions: Question[];
  currentIndex: number;
  streak: number;
  answers: AnswerRecord[];
  favoriteIds: Set<string>;
  wrongIds: Set<string>;

  submitAnswer: (questionId: string, correct: boolean) => void;
  nextQuestion: () => void;
  toggleFavorite: (questionId: string) => void;
  resetSession: (questions?: Question[]) => void;
  startReview: (mode: 'wrong' | 'favorite') => void;

  get currentQuestion(): Question | null;
  get progress(): number;
  get totalCorrect(): number;
  get totalWrong(): number;
  get isDone(): boolean;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  questions: QUESTIONS,
  currentIndex: 0,
  streak: 0,
  answers: [],
  favoriteIds: new Set(),
  wrongIds: new Set(),

  submitAnswer: (questionId, correct) =>
    set((s) => {
      const newWrongIds = new Set(s.wrongIds);
      if (!correct) newWrongIds.add(questionId);
      return {
        answers: [...s.answers, { questionId, correct }],
        streak: correct ? s.streak + 1 : 0,
        wrongIds: newWrongIds,
      };
    }),

  nextQuestion: () =>
    set((s) => ({ currentIndex: s.currentIndex + 1 })),

  toggleFavorite: (questionId) =>
    set((s) => {
      const next = new Set(s.favoriteIds);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return { favoriteIds: next };
    }),

  resetSession: (questions) =>
    set({
      questions: questions ?? QUESTIONS,
      currentIndex: 0,
      streak: 0,
      answers: [],
    }),

  startReview: (mode) => {
    const s = get();
    const ids = mode === 'wrong' ? s.wrongIds : s.favoriteIds;
    const subset = QUESTIONS.filter((q) => ids.has(q.id));
    if (subset.length === 0) return;
    set({ questions: subset, currentIndex: 0, streak: 0, answers: [] });
  },

  get currentQuestion() {
    const s = get();
    return s.questions[s.currentIndex] ?? null;
  },
  get progress() {
    const s = get();
    return s.questions.length > 0
      ? Math.round((s.currentIndex / s.questions.length) * 100)
      : 0;
  },
  get totalCorrect() {
    return get().answers.filter((a) => a.correct).length;
  },
  get totalWrong() {
    return get().answers.filter((a) => !a.correct).length;
  },
  get isDone() {
    const s = get();
    return s.currentIndex >= s.questions.length;
  },
}));
