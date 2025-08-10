'use client';

import React from 'react';
import { DashboardTrends } from '@/types/dashboard';

interface TrendsChartProps {
  data: DashboardTrends['data'];
}

export default function TrendsChart({ data }: TrendsChartProps) {
  if (!data || data.length === 0) return null;

  // Calculate summary statistics
  const totalTests = data.reduce((sum, day) => sum + day.testsTaken, 0);
  const totalCompletedTests = data.reduce((sum, day) => sum + day.completedTests, 0);
  const averageScore = data.reduce((sum, day) => sum + day.averageScore, 0) / data.length;
  const completionRate = totalTests > 0 ? (totalCompletedTests / totalTests) * 100 : 0;

  // Get last 7 days for recent activity
  const last7Days = data.slice(-7);
  
  // Get last 30 days for monthly comparison
  const last30Days = data.slice(-30);
  const currentMonth = last30Days.slice(-15); // Last 15 days
  const previousMonth = last30Days.slice(0, 15); // First 15 days

  const currentMonthStats = {
    testsTaken: currentMonth.reduce((sum, day) => sum + day.testsTaken, 0),
    averageScore: currentMonth.reduce((sum, day) => sum + day.averageScore, 0) / currentMonth.length,
    completedTests: currentMonth.reduce((sum, day) => sum + day.completedTests, 0)
  };

  const previousMonthStats = {
    testsTaken: previousMonth.reduce((sum, day) => sum + day.testsTaken, 0),
    averageScore: previousMonth.reduce((sum, day) => sum + day.averageScore, 0) / previousMonth.length,
    completedTests: previousMonth.reduce((sum, day) => sum + day.completedTests, 0)
  };

  // Find max value for chart scaling
  const maxTests = Math.max(...last7Days.map(day => day.testsTaken), 1);

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Activity Trends (Last 30 Days)</h2>
      
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-1">Total Tests</h4>
          <p className="text-2xl font-bold text-blue-600">{totalTests}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-800 mb-1">Completed Tests</h4>
          <p className="text-2xl font-bold text-green-600">{totalCompletedTests}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-1">Avg Score</h4>
          <p className="text-2xl font-bold text-yellow-600">{averageScore.toFixed(1)}%</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-medium text-purple-800 mb-1">Completion Rate</h4>
          <p className="text-2xl font-bold text-purple-600">{completionRate.toFixed(1)}%</p>
        </div>
      </div>
      
      {/* Monthly Comparison */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3 text-gray-700">Monthly Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-500 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Current Period (Last 15 Days)</h4>
            <div className="space-y-1">
              <p className="text-sm">Tests Taken: <span className="font-semibold">{currentMonthStats.testsTaken}</span></p>
              <p className="text-sm">Average Score: <span className="font-semibold">{currentMonthStats.averageScore.toFixed(1)}%</span></p>
              <p className="text-sm">Completed Tests: <span className="font-semibold">{currentMonthStats.completedTests}</span></p>
            </div>
          </div>
          <div className="bg-gray-500 p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Previous Period (15 Days Before)</h4>
            <div className="space-y-1">
              <p className="text-sm">Tests Taken: <span className="font-semibold">{previousMonthStats.testsTaken}</span></p>
              <p className="text-sm">Average Score: <span className="font-semibold">{previousMonthStats.averageScore.toFixed(1)}%</span></p>
              <p className="text-sm">Completed Tests: <span className="font-semibold">{previousMonthStats.completedTests}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Activity Chart */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3 text-gray-700">Daily Activity (Last 7 Days)</h3>
        <div className="space-y-3">
          {last7Days.map((day, index) => (
            <div key={day.date} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">{new Date(day.date).toLocaleDateString()}</span>
                <div className="text-right text-sm">
                  <span className="font-semibold">{day.testsTaken}</span> tests • 
                  <span className="ml-1">{day.completedTests}</span> completed • 
                  <span className="ml-1">{day.averageScore.toFixed(1)}%</span> avg
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(day.testsTaken / maxTests) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Activity Table */}
      <div>
        <h3 className="font-semibold mb-3 text-gray-300">Detailed Daily Activity</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Date</th>
                <th className="text-right py-2">Tests Taken</th>
                <th className="text-right py-2">Completed</th>
                <th className="text-right py-2">Avg Score</th>
              </tr>
            </thead>
            <tbody>
              {last7Days.map((day, index) => (
                <tr key={day.date} className="border-b hover:bg-gray-500">
                  <td className="py-2">{new Date(day.date).toLocaleDateString()}</td>
                  <td className="text-right py-2 font-medium">{day.testsTaken}</td>
                  <td className="text-right py-2">{day.completedTests}</td>
                  <td className="text-right py-2">{day.averageScore.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 