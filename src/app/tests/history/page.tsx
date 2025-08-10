'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGetTestHistoryQuery } from '@/store/testsSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function TestHistoryPage() {
  const { data, isLoading, error } = useGetTestHistoryQuery(undefined);
  const router = useRouter();
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

  if (isLoading) return <p>Loading...</p>;

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Test History</h1>
        <p className="text-red-600">Error loading test history. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Test History</h1>
      <table className="border w-full">
        <thead>
          <tr className="bg-gray-600">
            <th className="p-2">Date</th>
            <th className="p-2">Score</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.data && data.data?.map((t: any, idx: number) => (
            <tr key={idx} className="border-t">
              <td className="p-2">{new Date(t.date).toLocaleString()}</td>
              <td className="p-2">{t.score}</td>
              <td className="p-2">{t.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
