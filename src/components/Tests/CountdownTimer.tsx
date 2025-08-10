import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
  endTime: string; // ISO date string
}

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({ endTime }) => {
  const getSecondsLeft = () => {
    const endTimestamp = Date.parse(endTime);
    return Math.max(0, Math.floor((endTimestamp - Date.now()) / 1000));
  };

  const [timeLeft, setTimeLeft] = useState<number>(getSecondsLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      const secondsLeft = getSecondsLeft();
      setTimeLeft(secondsLeft);

      if (secondsLeft <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  // Determine color based on time remaining
  const getTimerColor = () => {
    if (timeLeft <= 300) return 'text-red-600 bg-red-50 border-red-200'; // 5 minutes or less
    if (timeLeft <= 900) return 'text-orange-600 bg-orange-50 border-orange-200'; // 15 minutes or less
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getProgressPercentage = () => {
    // Assuming a typical test duration, you might want to pass this as a prop
    const totalTime = 3600; // 1 hour default
    return Math.max(0, Math.min(100, (timeLeft / totalTime) * 100));
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Timer Display */}
      <div className={`inline-flex items-center px-4 py-2 rounded-lg border-2 ${getTimerColor()} transition-colors duration-300`}>
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="text-right">
          <div className="text-xs font-medium opacity-75">Time Remaining</div>
          <div className="text-lg font-bold font-mono">
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Progress Bar (optional - shows time progression) */}
      <div className="hidden sm:block w-24">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-linear ${
              timeLeft <= 300 ? 'bg-red-500' : 
              timeLeft <= 900 ? 'bg-orange-500' : 'bg-green-500'
            }`}
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1 text-center">Progress</div>
      </div>

      {/* Warning indicator for low time */}
      {timeLeft <= 300 && timeLeft > 0 && (
        <div className="animate-pulse">
          <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      {/* Time's up indicator */}
      {timeLeft === 0 && (
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          Time's Up!
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;
