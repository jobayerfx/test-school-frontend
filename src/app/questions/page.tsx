'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store/store';
import {
  useGetQuestionsQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation
} from '@/store/apiSlice';
import { IQuestion, CreateQuestionRequest } from '@/types/question';
import QuestionForm from '@/components/Questions/QuestionForm';
import QuestionCard from '@/components/Questions/QuestionCard';
import QuestionModal from '@/components/Questions/QuestionModal';
import { FaPlus, FaSearch, FaTimes } from 'react-icons/fa';
import { LEVELS, COMPETENCIES } from '@/utils/constant';

export default function QuestionsPage() {
  const router = useRouter();
  const { isAuthenticated, accessToken } = useSelector((state: RootState) => state.auth);

  // Pagination & filters state
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 12;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterCompetency, setFilterCompetency] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'level' | 'competency'>('createdAt');

  // Form & modal state
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<IQuestion | null>(null);
  const [viewingQuestion, setViewingQuestion] = useState<IQuestion | null>(null);
  const [showModal, setShowModal] = useState(false);

  // API hooks with server-side pagination & filtering params
  const {
    data: questionsData,
    isLoading,
    error,
    refetch
  } = useGetQuestionsQuery({
    page: currentPage,
    limit: PAGE_SIZE,
    search: searchTerm,
    level: filterLevel,
    competency: filterCompetency,
    sortBy
  });

  const [createQuestion, { isLoading: isCreating }] = useCreateQuestionMutation();
  const [updateQuestion, { isLoading: isUpdating }] = useUpdateQuestionMutation();
  const [deleteQuestion, { isLoading: isDeleting }] = useDeleteQuestionMutation();

  // Authentication check redirect
  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      router.push('/login');
    }
  }, [isAuthenticated, accessToken, router]);

  if (!isAuthenticated || !accessToken) {
    return <div className="p-6">Checking authentication...</div>;
  }

  // Total pages from API metadata or fallback
  const totalPages = questionsData?.pagination.pages || 1;
  const questions = questionsData?.data || [];

  // Reset page when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterLevel, filterCompetency, sortBy]);

  // Handlers
  const handleCreateQuestion = async (data: CreateQuestionRequest) => {
    try {
      await createQuestion(data).unwrap();
      setShowForm(false);
      refetch();
    } catch (error) {
      console.error('Failed to create question:', error);
      alert('Failed to create question. Please try again.');
    }
  };

  const handleUpdateQuestion = async (data: CreateQuestionRequest) => {
    if (!editingQuestion?._id) return;

    try {
      await updateQuestion({ id: editingQuestion._id, ...data }).unwrap();
      setEditingQuestion(null);
      setShowForm(false);
      refetch();
    } catch (error) {
      console.error('Failed to update question:', error);
      alert('Failed to update question. Please try again.');
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      await deleteQuestion(id).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to delete question:', error);
      alert('Failed to delete question. Please try again.');
    }
  };

  const handleEditQuestion = (question: IQuestion) => {
    setEditingQuestion(question);
    setShowForm(true);
  };

  const handleViewQuestion = (question: IQuestion) => {
    setViewingQuestion(question);
    setShowModal(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingQuestion(null);
  };

  const handleSubmitForm = (data: CreateQuestionRequest) => {
    if (editingQuestion) {
      handleUpdateQuestion(data);
    } else {
      handleCreateQuestion(data);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterLevel('');
    setFilterCompetency('');
    setSortBy('createdAt');
  };

  // Loading and error states
  if (isLoading) {
    return (
      <div className="p-6 bg-gray-900 text-gray-200 min-h-screen">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-900 text-red-400 min-h-screen">
        <div className="rounded-lg p-6 bg-red-900 border border-red-600">
          <h2 className="text-xl font-semibold mb-4">Error Loading Questions</h2>
          <p>Failed to load questions. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Questions Management</h1>
            <p className="mt-1 text-gray-400">Create, edit, and manage test questions</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2"
            >
              <FaPlus size={16} />
              <span>Add Question</span>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="rounded-lg shadow-sm border bg-gray-800 border-gray-700 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  aria-label="Clear search"
                  type="button"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Level Filter */}
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Levels</option>
              {LEVELS.map((level) => (
                <option key={level} value={level}>
                  Level {level}
                </option>
              ))}
            </select>

            {/* Competency Filter */}
            <select
              value={filterCompetency}
              onChange={(e) => setFilterCompetency(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Competencies</option>
              {COMPETENCIES.map((comp) => (
                <option key={comp} value={comp}>
                  {comp}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="createdAt">Sort by Date</option>
              <option value="level">Sort by Level</option>
              <option value="competency">Sort by Competency</option>
            </select>

            {/* Clear Filters Button */}
            <button
              onClick={handleClearFilters}
              className="flex items-center justify-center px-4 py-2 text-gray-200 bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              type="button"
              aria-label="Clear all filters"
            >
              Clear Filters
              <FaTimes className="ml-2" />
            </button>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-gray-800 text-gray-200">
              <div className="p-6 border-b border-gray-600">
                <h2 className="text-xl font-semibold">
                  {editingQuestion ? 'Edit Question' : 'Create New Question'}
                </h2>
              </div>
              <div className="p-6">
                <QuestionForm
                  question={editingQuestion || undefined}
                  onSubmit={handleSubmitForm}
                  onCancel={handleCancelForm}
                  isLoading={isCreating || isUpdating}
                />
              </div>
            </div>
          </div>
        )}

        {/* Questions Grid */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Questions ({questionsData?.pagination?.total ?? 0})</h2>
            <div className="text-sm text-gray-400">
              Showing page {currentPage} of {totalPages}
            </div>
          </div>

          {questions.length === 0 ? (
            <div className="rounded-lg p-8 text-center bg-gray-800 text-gray-400">
              <p className="text-lg">No questions found</p>
              <p className="mt-2">
                {searchTerm || filterLevel || filterCompetency
                  ? 'Try adjusting your filters'
                  : 'Create your first question to get started'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {questions.map((question) => (
                  <QuestionCard
                    key={question._id}
                    question={question}
                    onEdit={handleEditQuestion}
                    onDelete={handleDeleteQuestion}
                    onView={handleViewQuestion}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-center mt-6 space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md border border-gray-600 text-gray-300 disabled:text-gray-700 disabled:border-gray-700 hover:bg-blue-600 hover:text-white disabled:hover:bg-transparent disabled:hover:text-current"
                >
                  Prev
                </button>
                {[...Array(totalPages)].map((_, idx) => {
                  const pageNum = idx + 1;
                  const isActive = pageNum === currentPage;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded-md border ${
                        isActive
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md border border-gray-600 text-gray-300 disabled:text-gray-700 disabled:border-gray-700 hover:bg-blue-600 hover:text-white disabled:hover:bg-transparent disabled:hover:text-current"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>

        {/* View Modal */}
        <QuestionModal
          question={viewingQuestion}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setViewingQuestion(null);
          }}
        />
      </div>
    </div>
  );
}
