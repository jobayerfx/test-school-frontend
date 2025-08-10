'use client';
import useSWR from 'swr';
import { LineChart } from '@/components/Charts';
import { Table } from '@/components/Table';
import { format } from 'date-fns';

interface CompetencyBreakdown {
  _id: string;
  competencyName: string;
  testsTaken: number;
  averageScore: number;
  bestScore: number;
  lastAttempt: string;
}

interface UserPerformanceReport {
  userId: string;
  overallAverage: number;
  totalTestsTaken: number;
  competencyBreakdown: CompetencyBreakdown[];
}

export default function UserPerformanceReport() {
  const { data, error, isLoading } = useSWR<UserPerformanceReport>('/api/reports/user-performance');

  if (error) return <div>Failed to load report</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">User Performance Report</h1>

      {/* Overall Stats */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Tests Taken</p>
            <p className="text-3xl font-bold">{data?.totalTestsTaken}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Overall Average Score</p>
            <p className="text-3xl font-bold">
              {(data?.overallAverage * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Progress Over Time */}
      <div className="mb-8">
        <LineChart
          title="Score Progress Over Time"
          data={data?.competencyBreakdown.map(c => ({
            date: format(new Date(c.lastAttempt), 'MMM dd'),
            value: c.bestScore * 100
          })) || []}
        />
      </div>

      {/* Competency Breakdown */}
      <Table
        columns={[
          { header: 'Competency', accessor: 'competencyName' },
          { header: 'Tests Taken', accessor: 'testsTaken' },
          { 
            header: 'Avg Score', 
            accessor: 'averageScore',
            format: value => `${(value * 100).toFixed(1)}%`
          },
          { 
            header: 'Best Score', 
            accessor: 'bestScore',
            format: value => `${(value * 100).toFixed(1)}%`
          },
          {
            header: 'Last Attempt',
            accessor: 'lastAttempt',
            format: value => format(new Date(value), 'MMM dd, yyyy')
          }
        ]}
        data={data?.competencyBreakdown || []}
      />
    </div>
  );
}
