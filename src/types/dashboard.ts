// Dashboard API Response Types

export interface DashboardComplete {
  success: boolean;
  data: {
    stats: DashboardStats;
    trends: DashboardTrends;
    competencies: DashboardCompetencies;
    demographics: DashboardDemographics;
    performance: DashboardPerformance;
    topPerformers: TopPerformers;
  };
}

export interface DashboardStats {
  success: boolean;
  data: {
    totalUsers: number;
    totalTests: number;
    totalQuestions: number;
    averageScore: number;
    completionRate: number;
    activeUsers: number;
    totalSessions: number;
    averageSessionDuration: number;
  };
}

export interface DashboardTrends {
  success: boolean;
  data: Array<{
    date: string;
    testsTaken: number;
    averageScore: number;
    completedTests: number;
  }>;
  timestamp: string;
}

export interface DashboardCompetencies {
  success: boolean;
  data: {
    competencyScores: Array<{
      competency: string;
      averageScore: number;
      totalTests: number;
      improvement: number;
    }>;
    competencyBreakdown: Array<{
      competency: string;
      excellent: number;
      good: number;
      average: number;
      needsImprovement: number;
    }>;
    topCompetencies: Array<{
      competency: string;
      score: number;
      testsTaken: number;
    }>;
    areasForImprovement: Array<{
      competency: string;
      averageScore: number;
      priority: 'high' | 'medium' | 'low';
    }>;
  };
}

export interface DashboardDemographics {
  success: boolean;
  data: {
    ageGroups: Array<{
      ageGroup: string;
      count: number;
      percentage: number;
      averageScore: number;
    }>;
    genderDistribution: Array<{
      gender: string;
      count: number;
      percentage: number;
      averageScore: number;
    }>;
    locationData: Array<{
      location: string;
      count: number;
      percentage: number;
      averageScore: number;
    }>;
    activityLevels: Array<{
      level: string;
      count: number;
      percentage: number;
      description: string;
    }>;
  };
}

export interface DashboardPerformance {
  success: boolean;
  data: {
    scoreDistribution: Array<{
      range: string;
      count: number;
      percentage: number;
    }>;
    timeAnalysis: {
      averageTimePerQuestion: number;
      averageTimePerTest: number;
      timeDistribution: Array<{
        range: string;
        count: number;
        percentage: number;
      }>;
    };
    accuracyMetrics: {
      overallAccuracy: number;
      accuracyByQuestionType: Array<{
        type: string;
        accuracy: number;
        totalQuestions: number;
      }>;
    };
    improvementTracking: Array<{
      period: string;
      averageScore: number;
      improvement: number;
    }>;
  };
}

export interface TopPerformers {
  success: boolean;
  data: {
    topUsers: Array<{
      userId: string;
      name: string;
      email: string;
      totalTests: number;
      averageScore: number;
      highestScore: number;
      totalTime: number;
      rank: number;
    }>;
    topClasses: Array<{
      classId: string;
      className: string;
      averageScore: number;
      totalStudents: number;
      totalTests: number;
      rank: number;
    }>;
    topSchools: Array<{
      schoolId: string;
      schoolName: string;
      averageScore: number;
      totalStudents: number;
      totalTests: number;
      rank: number;
    }>;
  };
} 