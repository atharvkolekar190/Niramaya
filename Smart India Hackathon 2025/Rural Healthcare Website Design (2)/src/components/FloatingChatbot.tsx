import React, { useState } from 'react';
import { MessageCircle, X, Stethoscope, Brain, Activity } from 'lucide-react';

interface FloatingChatbotProps {
  onSkinDiseaseClick: () => void;
}

export default function FloatingChatbot({ onSkinDiseaseClick }: FloatingChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSkinDiseaseClick = () => {
    console.log('FloatingChatbot: Skin disease button clicked');
    onSkinDiseaseClick();
    setIsOpen(false);
  };

  const handleMainButtonClick = () => {
    console.log('FloatingChatbot: Main button clicked, isOpen:', isOpen);
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Chatbot Button */}
      <div className="fixed bottom-6 right-6 z-[9999]" style={{ pointerEvents: 'auto' }}>
        <div className="relative">
          {/* Chatbot Options Panel */}
          {isOpen && (
            <div className="absolute bottom-16 right-0 mb-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 text-white">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">AI Health Assistant</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-sm text-white/90 mt-1">How can I help you today?</p>
              </div>
              
              <div className="p-4 space-y-3">
                <button
                  onClick={handleSkinDiseaseClick}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 hover:from-green-100 hover:to-blue-100 border border-green-200 transition-all duration-200 group"
                >
                  <div className="p-2 bg-green-100 group-hover:bg-green-200 rounded-lg transition-colors">
                    <Stethoscope className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900">Skin Disease Detection</h4>
                    <p className="text-sm text-gray-600">AI-powered dermatological analysis</p>
                  </div>
                  <Brain className="h-4 w-4 text-gray-400 ml-auto" />
                </button>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>AI Assistant Online</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Chatbot Button */}
          <button
            onClick={handleMainButtonClick}
            className="w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group cursor-pointer relative z-10"
            style={{ 
              pointerEvents: 'auto',
              position: 'relative',
              zIndex: 10
            }}
            type="button"
          >
            <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
          </button>

          {/* Pulse Animation */}
          <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20 pointer-events-none" style={{ zIndex: 1 }}></div>
        </div>
      </div>
    </>
  );
}
