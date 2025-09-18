import { useState, useEffect } from 'react';
import type { Stream } from '@/lib/types';

export const useStream = (stream: Stream) => {
  const [streamedAmount, setStreamedAmount] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateStream = () => {
      const now = Math.floor(Date.now() / 1000);
      const { startTime, endTime, totalAmount, status } = stream;
      
      const totalDuration = endTime - startTime;
      if (totalDuration <= 0) {
        if (now >= endTime) {
            setStreamedAmount(totalAmount);
            setProgress(100);
        } else {
            setStreamedAmount(0);
            setProgress(0);
        }
        return;
      }
      
      if (status === 'completed') {
        setStreamedAmount(totalAmount);
        setProgress(100);
        return;
      }

      if (status === 'cancelled') {
        // Here you might need to know when it was cancelled to show the correct amount.
        // For this mock, we'll just stop the stream where it is.
        // The amount would be set once upon cancellation and not change.
        return;
      }
      
      const elapsedTime = now - startTime;

      if (elapsedTime <= 0) {
        setStreamedAmount(0);
        setProgress(0);
        return;
      }
      
      if (now >= endTime) {
        setStreamedAmount(totalAmount);
        setProgress(100);
        return;
      }
      
      const currentStreamed = (elapsedTime / totalDuration) * totalAmount;
      const currentProgress = (elapsedTime / totalDuration) * 100;

      setStreamedAmount(currentStreamed);
      setProgress(currentProgress);
    };

    calculateStream();
    
    // Only set up interval for active streams that are not finished
    if (stream.status === 'active' && Date.now() / 1000 < stream.endTime) {
      const interval = setInterval(calculateStream, 1000);
      return () => clearInterval(interval);
    }
  }, [stream]);

  const flowRate = stream.totalAmount / (stream.endTime - stream.startTime);

  return { streamedAmount, progress, flowRate };
};
