import React from 'react';
import { Trophy, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Quiz, QuizAttempt } from '../../types';

interface QuizResultsProps {
  quiz: Quiz;
  attempt: QuizAttempt;
  onRetakeQuiz?: () => void;
  onBackToDashboard: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  quiz,
  attempt,
  onRetakeQuiz,
  onBackToDashboard
}) => {
  const percentage = Math.round((attempt.score / attempt.totalPoints) * 100);
  const timeSpentFormatted = `${Math.floor(attempt.timeSpent / 60)}:${(attempt.timeSpent % 60).toString().padStart(2, '0')}`;

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeBg = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-100';
    if (percentage >= 80) return 'bg-blue-100';
    if (percentage >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return 'Excellent work! Outstanding performance!';
    if (percentage >= 80) return 'Great job! You did very well!';
    if (percentage >= 70) return 'Good work! Room for improvement.';
    if (percentage >= 60) return 'Fair performance. Consider reviewing the material.';
    return 'Needs improvement. Please review and try again.';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Results Header */}
      <Card>
        <CardContent className="text-center py-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${getGradeBg(percentage)}`}>
            <Trophy className={`w-10 h-10 ${getGradeColor(percentage)}`} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
          <p className="text-gray-600 mb-4">{quiz.title}</p>
          <div className={`inline-flex items-center px-6 py-3 rounded-full text-2xl font-bold ${getGradeBg(percentage)} ${getGradeColor(percentage)}`}>
            {percentage}%
          </div>
          <p className="text-gray-600 mt-2">{getPerformanceMessage(percentage)}</p>
        </CardContent>
      </Card>

      {/* Score Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {attempt.score}/{attempt.totalPoints}
            </div>
            <p className="text-gray-600">Points Earned</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center py-6">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-6 h-6 text-purple-600 mr-2" />
              <span className="text-3xl font-bold text-purple-600">{timeSpentFormatted}</span>
            </div>
            <p className="text-gray-600">Time Spent</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {Object.keys(attempt.answers).length}/{quiz.questions.length}
            </div>
            <p className="text-gray-600">Questions Answered</p>
          </CardContent>
        </Card>
      </div>

      {/* Question Review */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Question Review</h3>
          <p className="text-sm text-gray-600">Review your answers and see the correct solutions</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {quiz.questions.map((question, index) => {
              const userAnswer = attempt.answers[question.id];
              const isCorrect = question.type === 'short-answer' ? 
                null : userAnswer === question.correctAnswer;

              return (
                <div key={question.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Question {index + 1}
                      </span>
                      <span className="text-xs text-gray-500">
                        {question.points} point{question.points !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isCorrect === true && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          <span className="text-xs font-medium">Correct</span>
                        </div>
                      )}
                      {isCorrect === false && (
                        <div className="flex items-center text-red-600">
                          <XCircle className="w-4 h-4 mr-1" />
                          <span className="text-xs font-medium">Incorrect</span>
                        </div>
                      )}
                      {isCorrect === null && (
                        <div className="flex items-center text-yellow-600">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          <span className="text-xs font-medium">Manual Review</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <h4 className="font-medium text-gray-900 mb-4">{question.question}</h4>

                  {question.type === 'mcq' && question.options && (
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`flex items-center space-x-3 p-3 rounded-lg ${
                            optionIndex === question.correctAnswer
                              ? 'bg-green-50 border border-green-200'
                              : optionIndex === userAnswer && userAnswer !== question.correctAnswer
                              ? 'bg-red-50 border border-red-200'
                              : 'bg-gray-50'
                          }`}
                        >
                          <span className="text-sm font-medium text-gray-600">
                            {String.fromCharCode(65 + optionIndex)}.
                          </span>
                          <span className="text-sm text-gray-900 flex-1">{option}</span>
                          {optionIndex === question.correctAnswer && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                          {optionIndex === userAnswer && userAnswer !== question.correctAnswer && (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {question.type === 'true-false' && (
                    <div className="flex space-x-4">
                      {['True', 'False'].map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                            optionIndex === question.correctAnswer
                              ? 'bg-green-50 border border-green-200 text-green-800'
                              : optionIndex === userAnswer && userAnswer !== question.correctAnswer
                              ? 'bg-red-50 border border-red-200 text-red-800'
                              : 'bg-gray-50 text-gray-600'
                          }`}
                        >
                          <span>{option}</span>
                          {optionIndex === question.correctAnswer && (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          {optionIndex === userAnswer && userAnswer !== question.correctAnswer && (
                            <XCircle className="w-4 h-4" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {question.type === 'short-answer' && (
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <span className="font-medium">Your Answer:</span> {userAnswer || 'No answer provided'}
                        </p>
                      </div>
                      {question.correctAnswer && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-800">
                            <span className="font-medium">Sample Answer:</span> {question.correctAnswer}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {question.explanation && (
                    <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Explanation:</span> {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={onBackToDashboard} variant="outline">
              Back to Dashboard
            </Button>
            {onRetakeQuiz && (
              <Button onClick={onRetakeQuiz}>
                Retake Quiz
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};