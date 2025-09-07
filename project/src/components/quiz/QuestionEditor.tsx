import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Save, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Question } from '../../types';

interface QuestionEditorProps {
  questions: Question[];
  onQuestionsChange: (questions: Question[]) => void;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  questions,
  onQuestionsChange
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const addNewQuestion = () => {
    const newQuestion: Question = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'mcq',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 1
    };
    onQuestionsChange([...questions, newQuestion]);
    setEditingId(newQuestion.id);
    setEditingQuestion(newQuestion);
  };

  const startEditing = (question: Question) => {
    setEditingId(question.id);
    setEditingQuestion({ ...question });
  };

  const saveQuestion = () => {
    if (!editingQuestion) return;
    
    const updatedQuestions = questions.map(q =>
      q.id === editingQuestion.id ? editingQuestion : q
    );
    onQuestionsChange(updatedQuestions);
    setEditingId(null);
    setEditingQuestion(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingQuestion(null);
  };

  const deleteQuestion = (id: string) => {
    onQuestionsChange(questions.filter(q => q.id !== id));
  };

  const updateEditingQuestion = (updates: Partial<Question>) => {
    if (!editingQuestion) return;
    const updatedQuestion = { ...editingQuestion, ...updates };
    
    // Handle type changes that affect options and correctAnswer
    if (updates.type && updates.type !== editingQuestion.type) {
      if (updates.type === 'mcq') {
        updatedQuestion.options = ['', '', '', ''];
        updatedQuestion.correctAnswer = 0;
      } else if (updates.type === 'true-false') {
        updatedQuestion.options = ['True', 'False'];
        updatedQuestion.correctAnswer = 0;
      } else if (updates.type === 'short-answer') {
        updatedQuestion.options = undefined;
        updatedQuestion.correctAnswer = '';
      }
    }
    
    setEditingQuestion(updatedQuestion);
  };

  const updateOption = (index: number, value: string) => {
    if (!editingQuestion || !editingQuestion.options) return;
    const newOptions = [...editingQuestion.options];
    newOptions[index] = value;
    updateEditingQuestion({ options: newOptions });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Question Editor</h3>
          <p className="text-sm text-gray-600">
            Review AI-generated questions from your PDF or add new ones manually
          </p>
        </div>
        <Button onClick={addNewQuestion}>
          <Plus className="w-4 h-4 mr-2" />
          Add Question
        </Button>
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <Card key={question.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Question {index + 1}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                      {question.type.replace('-', ' ')}
                    </span>
                    <span className="text-xs text-gray-500">
                      {question.points} point{question.points !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {editingId === question.id ? (
                    <>
                      <Button onClick={saveQuestion} size="sm" variant="primary">
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button onClick={cancelEditing} size="sm" variant="ghost">
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => startEditing(question)}
                        size="sm"
                        variant="ghost"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => deleteQuestion(question.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {editingId === question.id && editingQuestion ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Question Type
                      </label>
                      <select
                        value={editingQuestion.type}
                        onChange={(e) => updateEditingQuestion({ 
                          type: e.target.value as Question['type']
                        })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="mcq">Multiple Choice</option>
                        <option value="true-false">True/False</option>
                        <option value="short-answer">Short Answer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Points
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={editingQuestion.points}
                        onChange={(e) => updateEditingQuestion({ points: parseInt(e.target.value) || 1 })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question Text
                    </label>
                    <textarea
                      value={editingQuestion.question}
                      onChange={(e) => updateEditingQuestion({ question: e.target.value })}
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter your question here..."
                    />
                  </div>

                  {editingQuestion.type === 'mcq' && editingQuestion.options && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Answer Options
                      </label>
                      <div className="space-y-2">
                        {editingQuestion.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name={`correct-${editingQuestion.id}`}
                              checked={editingQuestion.correctAnswer === optionIndex}
                              onChange={() => updateEditingQuestion({ correctAnswer: optionIndex })}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateOption(optionIndex, e.target.value)}
                              placeholder={`Option ${optionIndex + 1}`}
                              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {editingQuestion.type === 'true-false' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Correct Answer
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`tf-${editingQuestion.id}`}
                            checked={editingQuestion.correctAnswer === 0}
                            onChange={() => updateEditingQuestion({ correctAnswer: 0 })}
                            className="text-blue-600 focus:ring-blue-500 mr-2"
                          />
                          True
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`tf-${editingQuestion.id}`}
                            checked={editingQuestion.correctAnswer === 1}
                            onChange={() => updateEditingQuestion({ correctAnswer: 1 })}
                            className="text-blue-600 focus:ring-blue-500 mr-2"
                          />
                          False
                        </label>
                      </div>
                    </div>
                  )}

                  {editingQuestion.type === 'short-answer' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sample Answer (Optional)
                      </label>
                      <textarea
                        value={editingQuestion.correctAnswer as string || ''}
                        onChange={(e) => updateEditingQuestion({ correctAnswer: e.target.value })}
                        rows={2}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter a sample answer for reference..."
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-gray-900 font-medium">{question.question}</p>
                  
                  {question.type === 'mcq' && question.options && (
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`flex items-center space-x-2 p-2 rounded ${
                            question.correctAnswer === optionIndex
                              ? 'bg-green-50 border border-green-200'
                              : 'bg-gray-50'
                          }`}
                        >
                          <span className="text-sm font-medium text-gray-600">
                            {String.fromCharCode(65 + optionIndex)}.
                          </span>
                          <span className="text-sm text-gray-900">{option}</span>
                          {question.correctAnswer === optionIndex && (
                            <span className="text-xs text-green-600 font-medium ml-auto">
                              Correct
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {question.type === 'true-false' && (
                    <div className="flex space-x-4">
                      <div className={`px-3 py-1 rounded text-sm ${
                        question.correctAnswer === 0
                          ? 'bg-green-100 text-green-800 font-medium'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        True
                      </div>
                      <div className={`px-3 py-1 rounded text-sm ${
                        question.correctAnswer === 1
                          ? 'bg-green-100 text-green-800 font-medium'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        False
                      </div>
                    </div>
                  )}

                  {question.type === 'short-answer' && question.correctAnswer && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">Sample Answer:</span> {question.correctAnswer}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {questions.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Edit3 className="w-12 h-12 mx-auto" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                No questions yet
              </h4>
              <p className="text-gray-600 mb-4">
                Upload a PDF to auto-generate questions or add them manually to get started.
              </p>
              <Button onClick={addNewQuestion}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Question
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};