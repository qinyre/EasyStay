import { useState, useEffect, useRef } from 'react';

interface UseCountdownOptions {
  minutes: number;
  onExpire?: () => void;
  autoStart?: boolean;
}

export const useCountdown = ({
  minutes,
  onExpire,
  autoStart = true,
}: UseCountdownOptions) => {
  const [timeLeft, setTimeLeft] = useState(minutes * 60);
  const [isExpired, setIsExpired] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = () => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setIsExpired(true);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const reset = (newMinutes?: number) => {
    stop();
    setIsExpired(false);
    setTimeLeft((newMinutes ?? minutes) * 60);
    if (autoStart) {
      start();
    }
  };

  useEffect(() => {
    if (autoStart) {
      start();
    }
    return () => stop();
  }, [minutes]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    timeLeft,
    formattedTime: formatTime(timeLeft),
    isExpired,
    start,
    stop,
    reset,
    percentage: ((minutes * 60 - timeLeft) / (minutes * 60)) * 100,
  };
};
