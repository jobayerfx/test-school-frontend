'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStartTestMutation } from '@/store/testsSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Layout from '@/components/Dashboard/Layout';

export default function StartTestPage() {
  const [startTest, { isLoading }] = useStartTestMutation();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const { isAuthenticated, accessToken } = useSelector((state: RootState) => state.auth);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      router.push('/login');
    }
  }, [isAuthenticated, accessToken, router]);

  // Show loading while checking authentication
  if (!isAuthenticated || !accessToken) {
    return <div className="p-6">Checking authentication...</div>;
  }

  const handleStart = async () => {
    try {
      const res = await startTest({ step }).unwrap();
      const data = res.data;
      router.push(`/tests/${data.sessionId}`);
    } catch (err: any) {
      console.error('Test start error:', err);
      if (err?.status === 401) {
        alert('Authentication failed. Please log in again.');
        router.push('/login');
      } else {
        alert('Failed to start test. Please try again.');
      }
    }
  };

  return (
    <>
        <div className="p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Start Test</h1>
        <label className="block mb-2">Step:</label>
        <input
            type="number"
            value={step}
            onChange={(e) => setStep(Number(e.target.value))}
            className="border p-2 w-full rounded"
            />
        <button
            onClick={handleStart}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
            >
            {isLoading ? 'Starting...' : 'Start Test'}
        </button>
        </div>
    </>
  );
}
