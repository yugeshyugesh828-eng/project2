import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Quiz, QuizAttempt, QuizContextType } from '../types';

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

interface QuizProviderProps {
  children: ReactNode;
}

export const QuizProvider: React.FC<QuizProviderProps> = ({ children }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);

  useEffect(() => {
    // Load stored data
    const storedQuizzes = localStorage.getItem('quizify_quizzes');
    const storedAttempts = localStorage.getItem('quizify_attempts');
    
    if (storedQuizzes) {
      try {
        const parsedQuizzes = JSON.parse(storedQuizzes);
        // Convert date strings back to Date objects
        const quizzesWithDates = parsedQuizzes.map((quiz: any) => ({
          ...quiz,
          createdAt: new Date(quiz.createdAt)
        }));
        setQuizzes(quizzesWithDates);
      } catch (error) {
        console.error('Error parsing stored quizzes:', error);
        localStorage.removeItem('quizify_quizzes');
      }
    }
    if (storedAttempts) {
      try {
        const parsedAttempts = JSON.parse(storedAttempts);
        // Convert date strings back to Date objects
        const attemptsWithDates = parsedAttempts.map((attempt: any) => ({
          ...attempt,
          completedAt: new Date(attempt.completedAt)
        }));
        setAttempts(attemptsWithDates);
      } catch (error) {
        console.error('Error parsing stored attempts:', error);
        localStorage.removeItem('quizify_attempts');
      }
    }
  }, []);

  const createQuiz = (quiz: Omit<Quiz, 'id' | 'createdAt'>) => {
    const newQuiz: Quiz = {
      ...quiz,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date()
    };
    
    const updatedQuizzes = [...quizzes, newQuiz];
    setQuizzes(updatedQuizzes);
    localStorage.setItem('quizify_quizzes', JSON.stringify(updatedQuizzes));
  };

  const updateQuiz = (id: string, updates: Partial<Quiz>) => {
    const updatedQuizzes = quizzes.map(quiz => 
      quiz.id === id ? { ...quiz, ...updates } : quiz
    );
    setQuizzes(updatedQuizzes);
    localStorage.setItem('quizify_quizzes', JSON.stringify(updatedQuizzes));
  };

  const deleteQuiz = (id: string) => {
    const updatedQuizzes = quizzes.filter(quiz => quiz.id !== id);
    setQuizzes(updatedQuizzes);
    localStorage.setItem('quizify_quizzes', JSON.stringify(updatedQuizzes));
  };

  const submitAttempt = (attempt: Omit<QuizAttempt, 'id' | 'completedAt'>) => {
    const newAttempt: QuizAttempt = {
      ...attempt,
      id: Math.random().toString(36).substr(2, 9),
      completedAt: new Date()
    };
    
    const updatedAttempts = [...attempts, newAttempt];
    setAttempts(updatedAttempts);
    localStorage.setItem('quizify_attempts', JSON.stringify(updatedAttempts));
  };

  const getQuizById = (id: string) => {
    return quizzes.find(quiz => quiz.id === id);
  };

  const getUserAttempts = (userId: string) => {
    return attempts.filter(attempt => attempt.studentId === userId);
  };

  const value: QuizContextType = {
    quizzes,
    currentQuiz,
    attempts,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    submitAttempt,
    getQuizById,
    getUserAttempts
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};