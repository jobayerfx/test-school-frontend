'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  useGetTestStatusQuery,
  useSaveAnswerMutation,
  useSubmitTestMutation
} from '@/store/testsSlice';
// @ts-ignore - mongoose types are installed in backend
import type { Types } from 'mongoose';

interface ITestAnswer {
  questionId: Types.ObjectId;
  answer: number;
  isCorrect: boolean | null;
}
import CountdownTimer from '@/components/Tests/CountdownTimer';

export default function TestSessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { data, isLoading } = useGetTestStatusQuery(sessionId, { pollingInterval: 5000 });
  const [saveAnswer] = useSaveAnswerMutation();
  const [submitTest] = useSubmitTestMutation();
  const [answers, setAnswers] = useState<ITestAnswer[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const questions = data?.data?.questions || [];
  const totalQuestions = questions.length;
  const answeredCount = answers.length;

  // Auto-save answers
  useEffect(() => {
    const autoSave = setTimeout(() => {
      // Auto-save logic can be implemented here if needed
    }, 1000);
    return () => clearTimeout(autoSave);
  }, [answers]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your test...</p>
        </div>
      </div>
    );
  }

  const handleAnswerChange = (qId: Types.ObjectId, value: number) => {
    const updatedAnswers = answers.map(answer => 
      answer.questionId.toString() === qId.toString()
        ? { 
            ...answer, 
            answer: value,
            isCorrect: value === currentQ.questionId.correctAnswer
          } 
        : answer
    );
    
    if (!updatedAnswers.some(a => a.questionId.toString() === qId.toString())) {
      updatedAnswers.push({ 
        questionId: qId, 
        answer: value,
        isCorrect: value === currentQ.questionId.correctAnswer
      });
    }
    console.log(updatedAnswers);
    setAnswers(updatedAnswers);
    saveAnswer({ sessionId: sessionId as unknown as Types.ObjectId, answers: updatedAnswers });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // console.log(sessionId);
      
      await submitTest(sessionId).unwrap();
      router.push('/tests/history');
    } catch (error) {
      console.error('Error submitting test:', error);
      setIsSubmitting(false);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestion(index);
  };

  const nextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // console.log(data);
  

  const currentQ = questions[currentQuestion];

  // console.log('Current Question:', currentQ);
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Test Session</h1>
              <p className="text-sm text-gray-600 mt-1">
                Question {currentQuestion + 1} of {totalQuestions} • {answeredCount} answered
              </p>
            </div>
            <CountdownTimer endTime={data?.data?.endTime || 0} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions</h3>
              <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
                {questions.map((q: any, index: number) => (
                  <button
                    key={q._id}
                    onClick={() => goToQuestion(index)}
                    className={`
                      w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200
                      ${currentQuestion === index
                        ? 'bg-indigo-600 text-white shadow-md'
                        : answers.some(a => a.questionId.toString() === q._id.toString())
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <div className="mt-6 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Answered:</span>
                  <span className="font-medium text-green-600">{answeredCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Remaining:</span>
                  <span className="font-medium text-orange-600">{totalQuestions - answeredCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Question Area */}
          <div className="lg:col-span-3">
            {currentQ && (
              <div className="bg-white rounded-xl shadow-sm">
                {/* Question Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-indigo-600">
                      Question {currentQuestion + 1}
                    </span>
                    <div className="flex items-center space-x-2">
                      {answers.some(a => a.questionId.toString() === currentQ._id.toString()) && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Answered
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Question Content */}
                <div className="px-6 py-6">
                  <h2 className="text-xl font-medium text-gray-900 mb-6 leading-relaxed">
                    {currentQ.questionId.questionText}
                  </h2>

                  {/* Options */}
                  <div className="space-y-3">
                    {currentQ?.questionId?.options.map((opt: string, idx: number) => (
                      <label
                        key={idx}
                        className={`
                          flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                          ${answers.find(a => a.questionId.toString() === currentQ._id.toString())?.answer === idx
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }
                        `}
                      >
                        <input
                          type="radio"
                          name={`q-${currentQ._id}`}
                          value={idx}
                          checked={answers.find(a => a.questionId.toString() === currentQ._id.toString())?.answer === idx}
                          onChange={(e) => handleAnswerChange(currentQ._id, parseInt(e.target.value))}
                          className="sr-only"
                        />
                        <div className={`
                          w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center
                          ${answers.find(a => a.questionId.toString() === currentQ._id.toString())?.answer === idx
                            ? 'border-indigo-500 bg-indigo-500'
                            : 'border-gray-300'
                          }
                        `}>
                          {answers.find(a => a.questionId.toString() === currentQ._id.toString())?.answer === idx && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <span className="text-gray-900 font-medium">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Navigation Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                  <button
                    onClick={prevQuestion}
                    disabled={currentQuestion === 0}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>

                  <div className="flex space-x-3">
                    {currentQuestion === totalQuestions - 1 ? (
                      <button
                        onClick={() => setShowSubmitModal(true)}
                        className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                      >
                        Submit Test
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        onClick={nextQuestion}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                      >
                        Next
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Submit Test</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to submit your test? You have answered {answeredCount} out of {totalQuestions} questions.
              {answeredCount < totalQuestions && (
                <span className="block mt-2 text-orange-600 font-medium">
                  {totalQuestions - answeredCount} questions remain unanswered.
                </span>
              )}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Continue Test
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
