import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { QuizProvider, useQuiz } from './context/QuizContext';
import { AuthForm } from './components/auth/AuthForm';
import { Header } from './components/layout/Header';
import { TeacherDashboard } from './components/dashboard/TeacherDashboard';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { CreateQuizPage } from './pages/CreateQuizPage';
import { QuizTaking } from './components/quiz/QuizTaking';
import { QuizResults } from './components/quiz/QuizResults';
import { Quiz, QuizAttempt } from './types';

type AppView = 'dashboard' | 'create-quiz' | 'take-quiz' | 'quiz-results' | 'preview-quiz';

interface AppState {
  view: AppView;
  selectedQuizId?: string;
  selectedAttemptId?: string;
  previewQuiz?: Quiz;
  currentAttempt?: QuizAttempt;
}

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const { getQuizById, attempts } = useQuiz();
  
  const [appState, setAppState] = useState<AppState>({
    view: 'dashboard'
  });

  const navigateTo = (view: AppView, options?: Partial<AppState>) => {
    setAppState({ view, ...options });
  };

  const handleCreateQuiz = () => {
    navigateTo('create-quiz');
  };

  const handleTakeQuiz = (quizId: string) => {
    navigateTo('take-quiz', { selectedQuizId: quizId });
  };

  const handleViewResults = (quizId: string, attemptId: string) => {
    navigateTo('quiz-results', { selectedQuizId: quizId, selectedAttemptId: attemptId });
  };

  const handlePreviewQuiz = (quiz: Quiz) => {
    navigateTo('preview-quiz', { previewQuiz: quiz });
  };

  const handleQuizComplete = (attempt: QuizAttempt) => {
    setAppState(prev => ({
      ...prev,
      view: 'quiz-results',
      currentAttempt: attempt,
      selectedQuizId: attempt.quizId
    }));
  };

  const handleBackToDashboard = () => {
    navigateTo('dashboard');
  };

  if (!user) {
    return <AuthForm />;
  }

  const selectedQuiz = appState.selectedQuizId ? getQuizById(appState.selectedQuizId) : null;
  const selectedAttempt = appState.selectedAttemptId ? 
    attempts.find(a => a.id === appState.selectedAttemptId) : appState.currentAttempt;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header onCreateQuiz={user.role === 'teacher' ? handleCreateQuiz : undefined} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {appState.view === 'dashboard' && user.role === 'teacher' && (
          <TeacherDashboard
            onCreateQuiz={handleCreateQuiz}
            onViewQuiz={handleTakeQuiz}
          />
        )}

        {appState.view === 'dashboard' && user.role === 'student' && (
          <StudentDashboard
            onTakeQuiz={handleTakeQuiz}
            onViewResults={handleViewResults}
          />
        )}

        {appState.view === 'create-quiz' && (
          <CreateQuizPage
            onBack={handleBackToDashboard}
            onPreview={handlePreviewQuiz}
          />
        )}

        {appState.view === 'take-quiz' && selectedQuiz && (
          <QuizTaking
            quiz={selectedQuiz}
            onComplete={handleQuizComplete}
          />
        )}

        {appState.view === 'preview-quiz' && appState.previewQuiz && (
          <QuizTaking
            quiz={appState.previewQuiz}
            onComplete={() => navigateTo('create-quiz')}
          />
        )}

        {appState.view === 'quiz-results' && selectedQuiz && selectedAttempt && (
          <QuizResults
            quiz={selectedQuiz}
            attempt={selectedAttempt}
            onRetakeQuiz={() => handleTakeQuiz(selectedQuiz.id)}
            onBackToDashboard={handleBackToDashboard}
          />
        )}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <QuizProvider>
        <AppContent />
      </QuizProvider>
    </AuthProvider>
  );
}

export default App;