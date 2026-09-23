import { Suspense } from 'react';
import DataSection from './DataSection';
import { Button } from './ui/button';

type InsightsProps = {
  onBack?: () => void;
};

export default function Insights({ onBack }: InsightsProps) {
  return (
    <div className="min-h-screen bg-white relative">
      {onBack ? (
        <div className="fixed top-4 right-4 z-50">
          <Button onClick={onBack} className="bg-gray-900 text-white hover:bg-gray-800">Back</Button>
        </div>
      ) : null}

      <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
        <DataSection />
      </Suspense>
    </div>
  );
}


