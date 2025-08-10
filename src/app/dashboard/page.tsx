
'use client';

import Layout from '@/components/Dashboard/Layout';
import InfoCard from '@/components/Dashboard/InfoCard';
import TrendsChart from '@/components/Dashboard/TrendsChart';
import LoadingSpinner from '@/components/Dashboard/LoadingSpinner';
import { 
  useGetDashboardStatsQuery, 
  useGetDashboardTrendsQuery,
  useGetDashboardCompetenciesQuery,
  useGetDashboardDemographicsQuery,
  useGetDashboardPerformanceQuery,
  useGetTopPerformersQuery
} from '@/store/apiSlice';
import { 
  FaUsers, 
  FaChartLine, 
  FaClipboardCheck, 
  FaTasks,
  FaTrophy,
  FaUserGraduate,
  FaClock,
  FaPercentage
} from 'react-icons/fa';

export default function DashboardPage() {
  const { data: statsData, isLoading: statsLoading, error: statsError } = useGetDashboardStatsQuery();
  const { data: trendsData, isLoading: trendsLoading, error: trendsError } = useGetDashboardTrendsQuery();
  const { data: competenciesData, isLoading: competenciesLoading, error: competenciesError } = useGetDashboardCompetenciesQuery();
  const { data: demographicsData, isLoading: demographicsLoading, error: demographicsError } = useGetDashboardDemographicsQuery();
  const { data: performanceData, isLoading: performanceLoading, error: performanceError } = useGetDashboardPerformanceQuery();
  const { data: topPerformersData, isLoading: topPerformersLoading, error: topPerformersError } = useGetTopPerformersQuery();

  const isLoading = statsLoading || trendsLoading || competenciesLoading || 
                   demographicsLoading || performanceLoading || topPerformersLoading;
  
  const hasErrors = statsError || trendsError || competenciesError || 
                   demographicsError || performanceError || topPerformersError;

// console.log({
//   statsData, trendsLoading, competenciesLoading, 
//                    demographicsLoading, performanceLoading, topPerformersLoading
// });
                   


  if (isLoading) {
    return <LoadingSpinner /> ;
  }

  if (hasErrors) {
    return (
      <>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-yellow-800 mb-4">Dashboard API Not Available</h2>
          <p className="text-yellow-50 mb-4">
            The dashboard is trying to connect to the API server at <code className="bg-yellow-100 px-2 py-1 rounded">http://localhost:3001</code>
          </p>
          <div className="space-y-2 text-sm">
            <p className="text-gray-600">To see the dashboard data:</p>
            <ul className="list-disc list-inside text-gray-600 ml-4">
              <li>Make sure your API server is running on port 3001</li>
              <li>Check that the API endpoints are implemented</li>
              <li>Verify the API base URL in your environment</li>
            </ul>
          </div>
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <p className="text-sm font-medium text-gray-50 mb-2">Expected API Endpoints:</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• GET /report/dashboard/stats</li>
              <li>• GET /report/dashboard/trends</li>
              <li>• GET /report/dashboard/competencies</li>
              <li>• GET /report/dashboard/demographics</li>
              <li>• GET /report/dashboard/performance</li>
              <li>• GET /report/dashboard/top-performers</li>
            </ul>
          </div>
        </div>
      </>
    );
  }

  const stats = statsData?.data;
  const trends = trendsData?.data;
  const competencies = competenciesData?.data;
  const demographics = demographicsData?.data;
  const performance = performanceData?.data;
  const topPerformers = topPerformersData?.data;

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <InfoCard 
          title="Total Users" 
          value={stats?.totalUsers?.toLocaleString() || '0'} 
          icon={<FaUsers />} 
          color="bg-blue-500" 
        />
        <InfoCard 
          title="Total Tests" 
          value={stats?.totalTests?.toLocaleString() || '0'} 
          icon={<FaClipboardCheck />} 
          color="bg-green-500" 
        />
        <InfoCard 
          title="Average Score" 
          value={`${stats?.averageScore?.toFixed(1) || '0'}%`} 
          icon={<FaPercentage />} 
          color="bg-yellow-500" 
        />
        <InfoCard 
          title="Completion Rate" 
          value={`${stats?.completionRate?.toFixed(1) || '0'}%`} 
          icon={<FaChartLine />} 
          color="bg-purple-500" 
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <InfoCard 
          title="Active Users" 
          value={stats?.activeUsers?.toLocaleString() || '0'} 
          icon={<FaUserGraduate />} 
          color="bg-indigo-500" 
        />
        <InfoCard 
          title="Total Sessions" 
          value={stats?.totalSessions?.toLocaleString() || '0'} 
          icon={<FaTasks />} 
          color="bg-pink-500" 
        />
        <InfoCard 
          title="Avg Session Duration" 
          value={`${stats?.averageSessionDuration?.toFixed(0) || '0'} min`} 
          icon={<FaClock />} 
          color="bg-orange-500" 
        />
      </div>

      {/* Trends Chart */}
      {trends && <TrendsChart data={trends} />}

      {/* Top Performers */}
      <div className="bg-gray-800 p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaTrophy className="mr-2 text-yellow-500" />
          Top Performers
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Users */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-50">Top Users</h3>
            <div className="space-y-2">
              {topPerformers?.topUsers?.slice(0, 5).map((user, index) => (
                <div key={user.userId} className="flex justify-between items-center p-2 bg-gray-500 rounded">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{user.averageScore.toFixed(1)}%</p>
                    <p className="text-sm text-gray-600">#{user.rank}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Classes */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-50">Top Classes</h3>
            <div className="space-y-2">
              {topPerformers?.topClasses?.slice(0, 5).map((cls, index) => (
                <div key={cls.classId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{cls.className}</p>
                    <p className="text-sm text-gray-50">{cls.totalStudents} students</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{cls.averageScore.toFixed(1)}%</p>
                    <p className="text-sm text-gray-600">#{cls.rank}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Schools */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-50">Top Schools</h3>
            <div className="space-y-2">
              {topPerformers?.topSchools?.slice(0, 5).map((school, index) => (
                <div key={school.schoolId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{school.schoolName}</p>
                    <p className="text-sm text-gray-600">{school.totalStudents} students</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{school.averageScore.toFixed(1)}%</p>
                    <p className="text-sm text-gray-600">#{school.rank}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Competency Performance */}
      <div className="bg-gray-800 p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Competency Performance</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Competencies */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-50">Top Competencies</h3>
            <div className="space-y-2">
              {competencies?.topCompetencies?.slice(0, 5).map((comp, index) => (
                <div key={comp.competency} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium">{comp.competency}</span>
                  <span className="font-semibold">{comp.score.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Areas for Improvement */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-50">Areas for Improvement</h3>
            <div className="space-y-2">
              {competencies?.areasForImprovement?.slice(0, 5).map((area, index) => (
                <div key={area.competency} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium">{area.competency}</span>
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">{area.averageScore.toFixed(1)}%</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      area.priority === 'high' ? 'bg-red-100 text-red-800' :
                      area.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {area.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Demographics */}
      <div className="bg-gray-800 p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">User Demographics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Age Groups */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-50">Age Groups</h3>
            <div className="space-y-2">
              {demographics?.ageGroups?.map((age, index) => (
                <div key={age.ageGroup} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium">{age.ageGroup}</span>
                  <div className="text-right">
                    <p className="font-semibold">{age.count}</p>
                    <p className="text-sm text-gray-600">{age.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gender Distribution */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-50">Gender Distribution</h3>
            <div className="space-y-2">
              {demographics?.genderDistribution?.map((gender, index) => (
                <div key={gender.gender} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium">{gender.gender}</span>
                  <div className="text-right">
                    <p className="font-semibold">{gender.count}</p>
                    <p className="text-sm text-gray-600">{gender.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Levels */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-50">Activity Levels</h3>
            <div className="space-y-2">
              {demographics?.activityLevels?.map((level, index) => (
                <div key={level.level} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">{level.level}</span>
                    <p className="text-sm text-gray-600">{level.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{level.count}</p>
                    <p className="text-sm text-gray-600">{level.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-gray-800 p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Score Distribution */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-50">Score Distribution</h3>
            <div className="space-y-2">
              {performance?.scoreDistribution?.map((score, index) => (
                <div key={score.range} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium">{score.range}</span>
                  <div className="text-right">
                    <p className="font-semibold">{score.count}</p>
                    <p className="text-sm text-gray-600">{score.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Accuracy Metrics */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-50">Accuracy by Question Type</h3>
            <div className="space-y-2">
              {performance?.accuracyMetrics?.accuracyByQuestionType?.map((type, index) => (
                <div key={type.type} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium">{type.type}</span>
                  <div className="text-right">
                    <p className="font-semibold">{type.accuracy.toFixed(1)}%</p>
                    <p className="text-sm text-gray-600">{type.totalQuestions} questions</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
