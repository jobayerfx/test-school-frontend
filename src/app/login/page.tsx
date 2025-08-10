"use client";

import React, { useState } from 'react';
import { useLoginMutation } from '@/store/apiSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/authSlice';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData = await login({ email, password }).unwrap();
      dispatch(setCredentials({
        user: userData.data.user,
        accessToken: userData.data.tokens.accessToken,
        refreshToken: userData.data.tokens.refreshToken,
        isAuthenticated: true,
      }));
      // redirect to dashboard after successful login
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-6">
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-200">
          Welcome Back!
        </h1>
        <p className="mb-6 text-center text-sm text-gray-400">
          Login with your credentials.
        </p>
        
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded border-gray-600 bg-gray-700 text-white p-2 shadow-sm focus:border-indigo-400 focus:ring-indigo-400"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded border-gray-600 bg-gray-700 text-white p-2 shadow-sm focus:border-indigo-400 focus:ring-indigo-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded bg-indigo-500 py-2 px-4 text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          {error && (
            <p className="mt-2 text-center text-sm text-red-500">
              {typeof error === 'object' && error !== null
                ? // Try to show a useful error message
                  // If error is a FetchBaseQueryError with data.message, show that
                  // Otherwise, if error is a SerializedError with message, show that
                  // Otherwise, fallback to stringifying
                  'data' in error && typeof (error as any).data === 'object' && (error as any).data && 'message' in (error as any).data
                    ? (error as any).data.message
                    : 'message' in error
                      ? (error as any).message
                      : JSON.stringify(error)
                : 'An unknown error occurred.'}
            </p>
          )}
          <div className="mt-4 text-center">
            <a href="/forgot-password" className="text-sm text-indigo-400 hover:text-indigo-300 hover:underline">
              Forgot Password?
            </a>
          </div>
          <div className="mt-2 text-center">
            <a href="/register" className="text-sm text-indigo-400 hover:text-indigo-300 hover:underline">
              Create New Account
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
