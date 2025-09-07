import React from 'react';
import { Plus, BookOpen, Users, BarChart3, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useQuiz } from '../../context/QuizContext';

interface TeacherDashboardProps {
  onCreateQuiz: () => void;
  onViewQuiz: (quizId: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onCreateQuiz,
  onViewQuiz
}) => {
  const { user } = useAuth();
  const { quizzes, attempts, deleteQuiz } = useQuiz();

  const myQuizzes = quizzes.filter(quiz => quiz.createdBy === user?.id);
  const totalAttempts = attempts.filter(attempt => 
    myQuizzes.some(quiz => quiz.id === attempt.quizId)
  ).length;

  const getQuizStats = (quizId: string) => {
    const quizAttempts = attempts.filter(attempt => attempt.quizId === quizId);
    const avgScore = quizAttempts.length > 0 
      ? Math.round(quizAttempts.reduce((sum, attempt) => {
          const percentage = attempt.totalPoints > 0 ? (attempt.score / attempt.totalPoints * 100) : 0;
          return sum + percentage;
        }, 0) / quizAttempts.length)
      : 0;
    
    return {
      attempts: quizAttempts.length,
      avgScore
    };
  };

  const handleDeleteQuiz = (quizId: string) => {
    if (window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      deleteQuiz(quizId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h2>
        <p className="text-blue-100 mb-4">
          Ready to create engaging quizzes for your students?
        </p>
        <Button
          onClick={onCreateQuiz}
          className="bg-white text-blue-600 hover:bg-gray-100"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Quiz
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="text-center py-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-3">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{myQuizzes.length}</div>
            <p className="text-gray-600">Quizzes Created</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center py-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-3">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{totalAttempts}</div>
            <p className="text-gray-600">Total Attempts</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center py-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-3">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {myQuizzes.filter(quiz => quiz.isPublished).length}
            </div>
            <p className="text-gray-600">Published Quizzes</p>
          </CardContent>
        </Card>
      </div>

      {/* My Quizzes */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">My Quizzes</h3>
              <p className="text-sm text-gray-600">Manage your created quizzes</p>
            </div>
            <Button onClick={onCreateQuiz} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Quiz
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {myQuizzes.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No quizzes yet</h4>
              <p className="text-gray-600 mb-4">
                Create your first quiz by uploading a PDF or adding questions manually.
              </p>
              <Button onClick={onCreateQuiz}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Quiz
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {myQuizzes.map((quiz) => {
                const stats = getQuizStats(quiz.id);
                return (
                  <div
                    key={quiz.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{quiz.title}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          quiz.isPublished
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {quiz.isPublished ? 'Published' : 'Draft'}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                          {quiz.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{quiz.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{quiz.questions.length} questions</span>
                        <span>{quiz.totalPoints} points</span>
                        <span>{stats.attempts} attempts</span>
                        {stats.attempts > 0 && <span>{stats.avgScore}% avg score</span>}
                        <span>Created {new Date(quiz.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => onViewQuiz(quiz.id)}
                        size="sm"
                        variant="ghost"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteQuiz(quiz.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};