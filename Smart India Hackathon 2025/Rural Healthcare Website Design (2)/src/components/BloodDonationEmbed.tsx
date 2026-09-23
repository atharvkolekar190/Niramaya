import React from 'react';

interface Props {
  onBack: () => void;
}

export default function BloodDonationEmbed({ onBack }: Props) {
  const srcUrl = 'http://localhost:5178';
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-white sticky top-0 z-10">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50"
        >
          ← Back
        </button>
        <div className="text-sm text-gray-500">Blood Donation</div>
      </div>
      <div className="flex-1">
        <iframe
          title="Blood Donation App"
          src={srcUrl}
          className="w-full h-[calc(100vh-56px)] border-0"
          allow="clipboard-read; clipboard-write;"
        />
      </div>
    </div>
  );
}


