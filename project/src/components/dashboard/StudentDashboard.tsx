import React from 'react';
import { BookOpen, Clock, Trophy, TrendingUp, Play, Eye } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useQuiz } from '../../context/QuizContext';

interface StudentDashboardProps {
  onTakeQuiz: (quizId: string) => void;
  onViewResults: (quizId: string, attemptId: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onTakeQuiz,
  onViewResults
}) => {
  const { user } = useAuth();
  const { quizzes, getUserAttempts } = useQuiz();

  const publishedQuizzes = quizzes.filter(quiz => quiz.isPublished);
  const myAttempts = getUserAttempts(user?.id || '');
  
  const completedQuizzes = myAttempts.length;
  const averageScore = myAttempts.length > 0 
    ? Math.round(myAttempts.reduce((sum, attempt) => {
        const percentage = attempt.totalPoints > 0 ? (attempt.score / attempt.totalPoints * 100) : 0;
        return sum + percentage;
      }, 0) / myAttempts.length)
    : 0;
  
  const totalTimeSpent = myAttempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0);
  const timeSpentFormatted = `${Math.floor(totalTimeSpent / 3600)}h ${Math.floor((totalTimeSpent % 3600) / 60)}m`;

  const getQuizStatus = (quizId: string) => {
    const attempts = myAttempts.filter(attempt => attempt.quizId === quizId);
    if (attempts.length === 0) return 'not-attempted';
    return 'completed';
  };

  const getBestScore = (quizId: string) => {
    const attempts = myAttempts.filter(attempt => attempt.quizId === quizId);
    if (attempts.length === 0) return null;
    const bestAttempt = attempts.reduce((best, current) => 
      (current.score / current.totalPoints) > (best.score / best.totalPoints) ? current : best
    );
    return Math.round((bestAttempt.score / bestAttempt.totalPoints) * 100);
  };

  const getLatestAttempt = (quizId: string) => {
    const attempts = myAttempts.filter(attempt => attempt.quizId === quizId);
    if (attempts.length === 0) return null;
    return attempts.reduce((latest, current) => {
      const currentDate = new Date(current.completedAt);
      const latestDate = new Date(latest.completedAt);
      return currentDate > latestDate ? current : latest;
    });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h2>
        <p className="text-green-100 mb-4">
          Ready to test your knowledge with some quizzes?
        </p>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4" />
            <span>{completedQuizzes} quizzes completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>{averageScore}% average score</span>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="text-center py-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-3">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{publishedQuizzes.length}</div>
            <p className="text-gray-600">Available Quizzes</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center py-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-3">
              <Trophy className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{completedQuizzes}</div>
            <p className="text-gray-600">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center py-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-3">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{averageScore}%</div>
            <p className="text-gray-600">Average Score</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center py-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-3">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{timeSpentFormatted}</div>
            <p className="text-gray-600">Time Spent</p>
          </CardContent>
        </Card>
      </div>

      {/* Available Quizzes */}
      <Card>
        <CardHeader>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Available Quizzes</h3>
            <p className="text-sm text-gray-600">Take quizzes and test your knowledge</p>
          </div>
        </CardHeader>
        <CardContent>
          {publishedQuizzes.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No quizzes available</h4>
              <p className="text-gray-600">
                Check back later for new quizzes from your teachers.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {publishedQuizzes.map((quiz) => {
                const status = getQuizStatus(quiz.id);
                const bestScore = getBestScore(quiz.id);
                const latestAttempt = getLatestAttempt(quiz.id);

                return (
                  <div
                    key={quiz.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{quiz.title}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {status === 'completed' ? 'Completed' : 'Available'}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                          {quiz.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{quiz.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{quiz.questions.length} questions</span>
                        <span>{quiz.totalPoints} points</span>
                        {quiz.timeLimit && <span>{quiz.timeLimit} min limit</span>}
                        {bestScore !== null && <span>Best: {bestScore}%</span>}
                        {quiz.subject && <span>{quiz.subject}</span>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {status === 'completed' ? (
                        <>
                          <Button
                            onClick={() => onTakeQuiz(quiz.id)}
                            size="sm"
                            variant="outline"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Retake
                          </Button>
                          <Button
                            onClick={() => latestAttempt && onViewResults(quiz.id, latestAttempt.id)}
                            size="sm"
                            variant="ghost"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Results
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => onTakeQuiz(quiz.id)}
                          size="sm"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start Quiz
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {myAttempts.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <p className="text-sm text-gray-600">Your latest quiz attempts</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myAttempts
                .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
                .slice(0, 5)
                .map((attempt) => {
                  const quiz = quizzes.find(q => q.id === attempt.quizId);
                  const percentage = attempt.totalPoints > 0 
                    ? Math.round((attempt.score / attempt.totalPoints) * 100)
                    : 0;
                  
                  return (
                    <div key={attempt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{quiz?.title}</h5>
                        <p className="text-sm text-gray-600">
                          Completed {new Date(attempt.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          percentage >= 80 ? 'text-green-600' : 
                          percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {percentage}%
                        </div>
                        <p className="text-xs text-gray-500">
                          {attempt.score}/{attempt.totalPoints} points
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};