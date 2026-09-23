import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { X, MessageCircle, ExternalLink } from 'lucide-react';

interface CommunityChatProps {
  onClose?: () => void;
}

const CommunityChat: React.FC<CommunityChatProps> = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatUrl, setChatUrl] = useState<string | null>(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    const token = authService.getToken();

    if (!user || !token) {
      setError('Please login to access community chat');
      setIsLoading(false);
      return;
    }

    const encodedUser = encodeURIComponent(JSON.stringify({
      id: user.id,
      username: user.name,
      email: user.email,
      role: user.role
    }));

    const baseUrl = 'http://localhost:5050';
    setChatUrl(`${baseUrl}/community?token=${encodeURIComponent(token)}&user=${encodedUser}&theme=emerald&layout=cozy`);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-white">
        <div className="flex items-center gap-3 text-emerald-700">
          <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <span className="font-medium">Loading Community...</span>
        </div>
      </div>
    );
  }

  if (error || !chatUrl) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-red-50 via-rose-50 to-white">
        <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-6 border border-red-100 text-center">
          <p className="text-red-600 mb-4">{error || 'Unable to open the Community. Please try again later.'}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-br from-green-50 via-emerald-50 to-white">
      {/* Header */}
      <div className="px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between border-b border-emerald-100/70 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-sm">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Community Chat & Support</h2>
            <p className="text-xs text-gray-500 hidden sm:block">Real-time help, announcements, and peer support</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={chatUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors"
          >
            <ExternalLink className="h-4 w-4" /> Open in new tab
          </a>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close community chat"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-3 sm:px-6 py-4 sm:py-6">
        <div className="h-full w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.12)] border border-emerald-100 overflow-hidden">
          <iframe
            src={chatUrl}
            title="Community Chat"
            className="w-full h-[calc(100vh-8rem)] sm:h-[calc(100vh-10.5rem)] border-0"
            allow="camera; microphone"
          />
        </div>
      </div>
    </div>
  );
};

export default CommunityChat;
