import React, { useState } from 'react';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { PDFUpload } from '../components/pdf/PDFUpload';
import { QuestionEditor } from '../components/quiz/QuestionEditor';
import { useAuth } from '../context/AuthContext';
import { useQuiz } from '../context/QuizContext';
import { Question, Quiz } from '../types';

interface CreateQuizPageProps {
  onBack: () => void;
  onPreview: (quiz: Quiz) => void;
}

export const CreateQuizPage: React.FC<CreateQuizPageProps> = ({ onBack, onPreview }) => {
  const { user } = useAuth();
  const { createQuiz } = useQuiz();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    subject: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    timeLimit: 30,
    isPublished: false
  });
  const [currentStep, setCurrentStep] = useState<'upload' | 'edit' | 'settings'>('upload');
  const [isSaving, setIsSaving] = useState(false);

  const handleQuestionsExtracted = (extractedQuestions: Question[]) => {
    setQuestions(extractedQuestions);
    setCurrentStep('edit');
  };

  const handleSaveQuiz = async () => {
    if (!user || questions.length === 0) return;

    setIsSaving(true);
    try {
      const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
      
      const quiz: Omit<Quiz, 'id' | 'createdAt'> = {
        ...quizData,
        questions,
        createdBy: user.id,
        totalPoints
      };

      createQuiz(quiz);
      onBack();
    } catch (error) {
      console.error('Error saving quiz:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    if (questions.length === 0) return;

    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    
    const quiz: Quiz = {
      ...quizData,
      id: 'preview',
      questions,
      createdBy: user?.id || '',
      createdAt: new Date(),
      totalPoints
    };

    onPreview(quiz);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'upload':
        return questions.length > 0;
      case 'edit':
        return questions.length > 0 && questions.every(q => 
          q.question.trim() !== '' && 
          (q.type !== 'mcq' || (q.options && q.options.every(opt => opt.trim() !== '')))
        );
      case 'settings':
        return quizData.title.trim() !== '' && quizData.description.trim() !== '';
      default:
        return false;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button onClick={onBack} variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Quiz</h1>
            <p className="text-gray-600">Upload a PDF to auto-generate questions or create them manually</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {questions.length > 0 && (
            <Button onClick={handlePreview} variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          )}
          <Button
            onClick={handleSaveQuiz}
            loading={isSaving}
            disabled={!canProceed() || currentStep !== 'settings'}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Quiz
          </Button>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            {[
              { key: 'upload', label: 'Upload PDF', description: 'Extract questions' },
              { key: 'edit', label: 'Edit Questions', description: 'Review generated questions' },
              { key: 'settings', label: 'Quiz Settings', description: 'Configure details' }
            ].map((step, index) => (
              <div key={step.key} className="flex items-center">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === step.key
                      ? 'bg-blue-600 text-white'
                      : index < ['upload', 'edit', 'settings'].indexOf(currentStep)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{step.label}</p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
                {index < 2 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    index < ['upload', 'edit', 'settings'].indexOf(currentStep)
                      ? 'bg-green-600'
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {currentStep === 'upload' && (
        <div className="space-y-6">
          <PDFUpload onQuestionsExtracted={handleQuestionsExtracted} />
          
          {questions.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  Or skip PDF upload and create questions manually
                </p>
                <Button
                  onClick={() => setCurrentStep('edit')}
                  variant="outline"
                >
                  Create Questions Manually
                </Button>
              </CardContent>
            </Card>
          )}

          {questions.length > 0 && (
            <Card>
              <CardContent className="py-4">
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">
                    {questions.length} questions generated from your PDF content!
                  </p>
                  <Button onClick={() => setCurrentStep('edit')}>
                    Review Generated Questions
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {currentStep === 'edit' && (
        <div className="space-y-6">
          <QuestionEditor
            questions={questions}
            onQuestionsChange={setQuestions}
          />
          
          {questions.length > 0 && (
            <Card>
              <CardContent className="py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">
                      {questions.length} questions ready
                    </p>
                    <p className="text-sm text-gray-600">
                      Total points: {questions.reduce((sum, q) => sum + q.points, 0)}
                    </p>
                  </div>
                  <Button onClick={() => setCurrentStep('settings')}>
                    Continue to Quiz Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {currentStep === 'settings' && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Quiz Settings</h3>
            <p className="text-sm text-gray-600">Configure your quiz details and preferences</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Input
                  label="Quiz Title"
                  value={quizData.title}
                  onChange={(e) => setQuizData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter quiz title"
                  required
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={quizData.description}
                    onChange={(e) => setQuizData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter quiz description"
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                <Input
                  label="Subject (Optional)"
                  value={quizData.subject}
                  onChange={(e) => setQuizData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="e.g., Mathematics, Science, History"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={quizData.difficulty}
                    onChange={(e) => setQuizData(prev => ({ ...prev, difficulty: e.target.value as 'easy' | 'medium' | 'hard' }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time Limit (minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={quizData.timeLimit}
                    onChange={(e) => setQuizData(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 30 }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave blank for no time limit
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="publish"
                    checked={quizData.isPublished}
                    onChange={(e) => setQuizData(prev => ({ ...prev, isPublished: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="publish" className="text-sm font-medium text-gray-700">
                    Publish quiz immediately
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Quiz Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 font-medium">Questions:</span>
                  <span className="ml-2 text-blue-900">{questions.length}</span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Total Points:</span>
                  <span className="ml-2 text-blue-900">{questions.reduce((sum, q) => sum + q.points, 0)}</span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Time Limit:</span>
                  <span className="ml-2 text-blue-900">{quizData.timeLimit} min</span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Status:</span>
                  <span className="ml-2 text-blue-900">{quizData.isPublished ? 'Published' : 'Draft'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};