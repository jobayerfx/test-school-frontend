'use client';

import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="text-gray-600 font-medium">Loading dashboard data...</p>
      </div>
    </div>
  );
} 