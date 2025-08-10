'use client';
import useSWR from 'swr';
import { BarChart } from '@/components/Charts';
import { Table } from '@/components/Table';

interface CompetencyReport {
  _id: string;
  competencyName: string;
  totalTests: number;
  averageScore: number;
  passRate: number;
}

export default function PerCompetencyReport() {
  const { data, error, isLoading } = useSWR<CompetencyReport[]>('/api/reports/per-competency');

  if (error) return <div>Failed to load report</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Competency Performance Report</h1>
      
      <div className="mb-8">
        <BarChart
          title="Average Scores by Competency"
          data={data?.map(item => ({
            category: item.competencyName,
            value: item.averageScore * 100
          })) || []}
        />
      </div>

      <Table
        columns={[
          { header: 'Competency', accessor: 'competencyName' },
          { header: 'Total Tests', accessor: 'totalTests' },
          { 
            header: 'Average Score', 
            accessor: 'averageScore',
            format: value => `${(value * 100).toFixed(1)}%`
          },
          {
            header: 'Pass Rate',
            accessor: 'passRate',
            format: value => `${(value * 100).toFixed(1)}%`
          }
        ]}
        data={data || []}
      />
    </div>
  );
}
