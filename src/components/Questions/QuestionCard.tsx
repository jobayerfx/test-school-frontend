'use client';

import React from 'react';
import { IQuestion } from '@/types/question';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

interface QuestionCardProps {
  question: IQuestion;
  onEdit: (question: IQuestion) => void;
  onDelete: (id: string) => void;
  onView: (question: IQuestion) => void;
  showActions?: boolean;
}

export default function QuestionCard({ 
  question, 
  onEdit, 
  onDelete, 
  onView, 
  showActions = true 
}: QuestionCardProps) {
  const getLevelColor = (level: string) => {
    const colors = {
      'A1': 'bg-green-100 text-green-800',
      'A2': 'bg-blue-100 text-blue-800',
      'B1': 'bg-yellow-100 text-yellow-800',
      'B2': 'bg-orange-100 text-orange-800',
      'C1': 'bg-red-100 text-red-800',
      'C2': 'bg-purple-100 text-purple-800'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(question.level)}`}>
            {question.level}
          </span>
          <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
            {question.competency}
          </span>
        </div>
        {showActions && (
          <div className="flex space-x-2">
            <button
              onClick={() => onView(question)}
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
              title="View Question"
            >
              <FaEye size={16} />
            </button>
            <button
              onClick={() => onEdit(question)}
              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
              title="Edit Question"
            >
              <FaEdit size={16} />
            </button>
            <button
              onClick={() => onDelete(question._id!)}
              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
              title="Delete Question"
            >
              <FaTrash size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Question Text */}
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Question</h3>
        <p className="text-gray-700 leading-relaxed">{question.questionText}</p>
      </div>

      {/* Options */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Options:</h4>
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <div
              key={index}
              className={`flex items-center p-2 rounded ${
                index === question.correctAnswer
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <span className="w-6 h-6 rounded-full bg-gray-300 text-gray-700 text-xs flex items-center justify-center mr-3">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="text-gray-700">{option}</span>
              {index === question.correctAnswer && (
                <span className="ml-auto text-green-600 text-sm font-medium">
                  ✓ Correct
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-4">
        <span>Created: {new Date(question.createdAt!).toLocaleDateString()}</span>
        <span>ID: {question._id?.slice(-8)}</span>
      </div>
    </div>
  );
} 