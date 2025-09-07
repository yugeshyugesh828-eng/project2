import React, { useState, useCallback } from 'react';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { parsePDFQuestions } from '../../utils/pdfParser';
import { Question } from '../../types';

interface PDFUploadProps {
  onQuestionsExtracted: (questions: Question[]) => void;
}

export const PDFUpload: React.FC<PDFUploadProps> = ({ onQuestionsExtracted }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedQuestions, setExtractedQuestions] = useState<Question[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      setUploadedFile(pdfFile);
      processFile(pdfFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      processFile(file);
    }
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    try {
      const questions = await parsePDFQuestions(file);
      setExtractedQuestions(questions);
      onQuestionsExtracted(questions);
    } catch (error) {
      console.error('Error processing PDF:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setExtractedQuestions([]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Upload Question Paper</h3>
          <p className="text-sm text-gray-600">
            Upload any PDF document and we'll analyze the content to generate relevant MCQ questions
          </p>
        </CardHeader>
        <CardContent>
          {!uploadedFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
                isDragging
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Drop your PDF here, or click to browse
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Supports PDF files up to 10MB
              </p>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="pdf-upload"
              />
              <label htmlFor="pdf-upload">
                <Button as="span" className="cursor-pointer">
                  Choose File
                </Button>
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                    <p className="text-sm text-gray-600">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {isProcessing ? (
                    <div className="flex items-center space-x-2 text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm">Processing...</span>
                    </div>
                  ) : extractedQuestions.length > 0 ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">{extractedQuestions.length} questions extracted</span>
                    </div>
                  ) : null}
                  <Button
                    onClick={removeFile}
                    variant="ghost"
                    size="sm"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {extractedQuestions.length > 0 && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">
                    Successfully analyzed PDF and generated {extractedQuestions.length} relevant questions!
                  </h4>
                  <p className="text-sm text-green-700">
                    Questions have been generated based on the PDF content. You can review and edit them before creating your quiz.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Content Analysis Info */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">How PDF Analysis Works</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Content Analysis</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Extracts text from your PDF document</li>
                <li>• Identifies key topics and concepts</li>
                <li>• Analyzes content structure and relationships</li>
                <li>• Determines appropriate question difficulty</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Question Generation</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Creates multiple choice questions (MCQs)</li>
                <li>• Generates true/false questions</li>
                <li>• Includes short answer questions</li>
                <li>• Provides explanations for each answer</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> For best results, upload PDFs with clear, structured content such as textbooks, 
              lecture notes, or educational materials. The system works best with text-based PDFs rather than image-only documents.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};