import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
  endTime: string; // ISO date string
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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

  return (
    <p className="text-lg font-semibold text-red-600">
      Time Remaining: {formatTime(timeLeft)}
    </p>
  );
};

export default CountdownTimer;
