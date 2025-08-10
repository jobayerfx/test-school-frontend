'use client';

import React from 'react';
import { IQuestion } from '@/types/question';
import { FaTimes } from 'react-icons/fa';

interface QuestionModalProps {
  question: IQuestion | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuestionModal({ question, isOpen, onClose }: QuestionModalProps) {
  if (!isOpen || !question) return null;

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Question Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Metadata */}
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(question.level)}`}>
              Level {question.level}
            </span>
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
              {question.competency}
            </span>
            <span className="text-sm text-gray-500">
              ID: {question._id}
            </span>
          </div>

          {/* Question Text */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Question</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed">{question.questionText}</p>
            </div>
          </div>

          {/* Options */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Options</h3>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center p-4 rounded-lg border-2 ${
                    index === question.correctAnswer
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <span className="w-8 h-8 rounded-full bg-gray-300 text-gray-700 text-sm font-medium flex items-center justify-center mr-4">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-gray-700 flex-1">{option}</span>
                  {index === question.correctAnswer && (
                    <span className="text-green-600 font-medium text-sm">
                      ✓ Correct Answer
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Created By</h4>
              <p className="text-gray-900">{question.createdBy}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Created At</h4>
              <p className="text-gray-900">
                {new Date(question.createdAt!).toLocaleString()}
              </p>
            </div>
            {question.updatedAt && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Last Updated</h4>
                <p className="text-gray-900">
                  {new Date(question.updatedAt).toLocaleString()}
                </p>
              </div>
            )}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Total Options</h4>
              <p className="text-gray-900">{question.options.length}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 