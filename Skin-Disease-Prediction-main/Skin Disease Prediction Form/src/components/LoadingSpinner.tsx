import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  isVisible: boolean;
  message?: string;
}

export function LoadingSpinner({ isVisible, message = 'Analyzing image...' }: LoadingSpinnerProps) {
  if (!isVisible) return null;

  return (
    <div className="loader flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
      <div className="relative">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-400 mb-4" />
        <div className="absolute inset-0 h-10 w-10 rounded-full border-2 border-blue-100 dark:border-blue-900"></div>
      </div>
      <h3 className="text-slate-800 dark:text-slate-100 font-medium mb-2">Processing</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300 text-center">{message}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Neural network inference in progress</p>
    </div>
  );
}