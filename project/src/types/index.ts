export interface User {
  id: string;
  email: string;
  name: string;
  role: 'teacher' | 'student';
  avatar?: string;
}

export interface Question {
  id: string;
  type: 'mcq' | 'true-false' | 'short-answer';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  points: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdBy: string;
  createdAt: Date;
  timeLimit?: number;
  subject?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isPublished: boolean;
  totalPoints: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  answers: Record<string, any>;
  score: number;
  totalPoints: number;
  completedAt: Date;
  timeSpent: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: 'teacher' | 'student') => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface QuizContextType {
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
  attempts: QuizAttempt[];
  createQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt'>) => void;
  updateQuiz: (id: string, updates: Partial<Quiz>) => void;
  deleteQuiz: (id: string) => void;
  submitAttempt: (attempt: Omit<QuizAttempt, 'id' | 'completedAt'>) => void;
  getQuizById: (id: string) => Quiz | undefined;
  getUserAttempts: (userId: string) => QuizAttempt[];
}