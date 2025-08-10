'use client';

import React, { useState, useEffect } from 'react';
import { IQuestion, CreateQuestionRequest } from '@/types/question';
import {LEVELS, COMPETENCIES} from '@/utils/constant'

interface QuestionFormProps {
  question?: IQuestion;
  onSubmit: (data: CreateQuestionRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}


export default function QuestionForm({ question, onSubmit, onCancel, isLoading = false }: QuestionFormProps) {
  const [formData, setFormData] = useState<CreateQuestionRequest>({
    competency: '',
    level: 'A1',
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (question) {
      setFormData({
        competency: question.competency,
        level: question.level,
        questionText: question.questionText,
        options: [...question.options],
        correctAnswer: question.correctAnswer
      });
    }
  }, [question]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.competency.trim()) {
      newErrors.competency = 'Competency is required';
    }

    if (!formData.questionText.trim()) {
      newErrors.questionText = 'Question text is required';
    }

    if (formData.options.filter(opt => opt.trim()).length < 2) {
      newErrors.options = 'At least two options are required';
    }

    if (formData.correctAnswer < 0 || formData.correctAnswer >= formData.options.length) {
      newErrors.correctAnswer = 'Please select a valid correct answer';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    if (formData.options.length < 6) {
      setFormData({ ...formData, options: [...formData.options, ''] });
    }
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData({ 
        ...formData, 
        options: newOptions,
        correctAnswer: formData.correctAnswer >= newOptions.length ? 0 : formData.correctAnswer
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Competency */}
      <div>
        <label className="block text-sm font-medium text-gray-50 mb-2">
          Competency *
        </label>
        <select
          value={formData.competency}
          onChange={(e) => setFormData({ ...formData, competency: e.target.value })}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.competency ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select a competency</option>
          {COMPETENCIES.map((comp) => (
            <option key={comp} value={comp}>
              {comp}
            </option>
          ))}
        </select>
        {errors.competency && (
          <p className="mt-1 text-sm text-red-600">{errors.competency}</p>
        )}
      </div>

      {/* Level */}
      <div>
        <label className="block text-sm font-medium text-gray-50 mb-2">
          Level *
        </label>
        <select
          value={formData.level}
          onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      {/* Question Text */}
      <div>
        <label className="block text-sm font-medium text-gray-50 mb-2">
          Question Text *
        </label>
        <textarea
          value={formData.questionText}
          onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.questionText ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter the question text..."
        />
        {errors.questionText && (
          <p className="mt-1 text-sm text-red-600">{errors.questionText}</p>
        )}
      </div>

      {/* Options */}
      <div>
        <label className="block text-sm font-medium text-gray-50 mb-2">
          Options *
        </label>
        <div className="space-y-2">
          {formData.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="radio"
                name="correctAnswer"
                checked={formData.correctAnswer === index}
                onChange={() => setFormData({ ...formData, correctAnswer: index })}
                className="text-blue-600 focus:ring-blue-500"
              />
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="px-2 py-1 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        {errors.options && (
          <p className="mt-1 text-sm text-red-600">{errors.options}</p>
        )}
        {errors.correctAnswer && (
          <p className="mt-1 text-sm text-red-600">{errors.correctAnswer}</p>
        )}
        {formData.options.length < 6 && (
          <button
            type="button"
            onClick={addOption}
            className="mt-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
          >
            + Add Option
          </button>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : question ? 'Update Question' : 'Create Question'}
        </button>
      </div>
    </form>
  );
} 