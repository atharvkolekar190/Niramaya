import { useState } from 'react';
import { ArrowLeft, Video, Globe, MessageSquare, Phone, Calendar, Heart, X, Minimize2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
//

interface TelemedicineAppProps {
  onBack: () => void;
}

export default function TelemedicineApp({ onBack }: TelemedicineAppProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [videoCallUrl, setVideoCallUrl] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  const handleStartConsultation = () => {
    // Embed TeleHealth app directly in the main website
    const teleHealthUrl = `http://localhost:5175/?name=Patient&language=${selectedLanguage}&provider=dr-kaur`;
    setVideoCallUrl(teleHealthUrl);
    setShowVideoCall(true);
    setIsMinimized(false);
  };

  const handleEmergencyConsultation = () => {
    // Embed TeleHealth app for emergency consultation
    const teleHealthUrl = `http://localhost:5175/?name=Emergency Patient&language=${selectedLanguage}&provider=dr-kumar&emergency=true`;
    setVideoCallUrl(teleHealthUrl);
    setShowVideoCall(true);
    setIsMinimized(false);
  };

  const handleCloseVideoCall = () => {
    setShowVideoCall(false);
    setVideoCallUrl('');
    setIsMinimized(false);
  };

  const handleMinimizeVideoCall = () => {
    setIsMinimized(!isMinimized);
  };

  const languages = [
    { code: 'english', name: 'English', native: 'English', flag: '🇺🇸' },
    { code: 'hindi', name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
    { code: 'punjabi', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2 hover:bg-green-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Homepage
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Video className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-gray-900">Multilingual Telemedicine Consultation</h1>
            </div>
            
            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLanguageModal(true)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Globe className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">
                  {languages.find(lang => lang.code === selectedLanguage)?.native}
                </span>
              </button>
            </div>
            <div className="w-32"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-gray-900 mb-4">
            Connect with Healthcare Providers 
            <span className="text-green-600"> Anywhere, Anytime</span>
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Breaking language barriers in healthcare with our multilingual telemedicine platform. 
            Consultations available in Punjabi, Hindi, and English.
          </p>
        </div>

        {/* Language Support */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center border-green-200 bg-green-50/50">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">ਪੰਜਾਬੀ (Punjabi)</h3>
              <small className="text-gray-600">Native language support for comfortable consultations</small>
            </CardContent>
          </Card>

          <Card className="text-center border-blue-200 bg-blue-50/50">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">हिंदी (Hindi)</h3>
              <small className="text-gray-600">Wide accessibility with Hindi language support</small>
            </CardContent>
          </Card>

          <Card className="text-center border-purple-200 bg-purple-50/50">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">English</h3>
              <small className="text-gray-600">International standard for global accessibility</small>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-green-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Video className="h-5 w-5 text-green-600" />
                </div>
                HD Video Consultations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Crystal clear video calls with healthcare professionals. No appointments needed - 
                connect instantly with available doctors.
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Real-time</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">HD Quality</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                Smart Translation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Automatic language detection and real-time translation support. 
                Communicate effectively regardless of language barriers.
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">AI-Powered</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">3 Languages</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Phone className="h-5 w-5 text-purple-600" />
                </div>
                24/7 Availability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Round-the-clock medical support with emergency consultation options. 
                Healthcare when you need it most.
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Emergency</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">24/7</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-orange-600" />
                </div>
                Easy Scheduling
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Simple appointment booking with flexible timing. Schedule consultations 
                that fit your routine and availability.
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">Flexible</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Instant</span>
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Stats Section */}
        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl mb-2">247</div>
                <p className="text-green-100">Consultations Completed</p>
              </div>
              <div>
                <div className="text-3xl mb-2">12</div>
                <p className="text-green-100">Healthcare Providers</p>
              </div>
              <div>
                <div className="text-3xl mb-2">8</div>
                <p className="text-green-100">Villages Connected</p>
              </div>
              <div>
                <div className="text-3xl mb-2">94%</div>
                <p className="text-green-100">Patient Satisfaction</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <h2 className="text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-6">Start a video consultation with healthcare providers today</p>
          <div className="flex justify-center gap-4">
            <Button 
              className="bg-green-600 hover:bg-green-700 px-8 py-3"
              onClick={() => handleStartConsultation()}
            >
              <Video className="h-5 w-5 mr-2" />
              Start Video Consultation
            </Button>
            <Button 
              variant="outline" 
              className="border-red-600 text-red-600 hover:bg-red-50 px-8 py-3"
              onClick={() => handleEmergencyConsultation()}
            >
              <Heart className="h-5 w-5 mr-2" />
              Emergency Consultation
            </Button>
          </div>
        </div>
      </div>

      {/* Language Selection Modal */}
      {showLanguageModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowLanguageModal(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Select Language</h3>
            <div className="space-y-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setSelectedLanguage(lang.code);
                    setShowLanguageModal(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedLanguage === lang.code
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{lang.flag}</span>
                    <div>
                      <div className="font-medium">{lang.native}</div>
                      <div className="text-sm text-gray-600">{lang.name}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Integrated Video Call Interface */}
      {showVideoCall && (
        <div className={`fixed inset-0 bg-black/80 z-50 flex items-center justify-center ${isMinimized ? 'hidden' : ''}`}>
          <div className="bg-white rounded-lg shadow-2xl w-full h-full max-w-7xl max-h-[90vh] m-4 flex flex-col">
            {/* Video Call Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Video className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Video Consultation</h3>
                <div className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  Connected to {selectedLanguage === 'english' ? 'Dr. Kaur' : selectedLanguage === 'hindi' ? 'डॉ. कौर' : 'ਡਾ. ਕੌਰ'}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMinimizeVideoCall}
                  className="hover:bg-gray-100"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCloseVideoCall}
                  className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Video Call Content */}
            <div className="flex-1 relative">
              <iframe
                src={videoCallUrl}
                className="w-full h-full border-0 rounded-b-lg"
                title="Video Consultation"
                allow="camera; microphone; display-capture; fullscreen"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Minimized Video Call Bar */}
      {showVideoCall && isMinimized && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-3">
            <Video className="h-4 w-4" />
            <span className="text-sm font-medium">Video Call Active</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMinimizeVideoCall}
              className="text-white hover:bg-green-700 p-1 h-auto"
            >
              Expand
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCloseVideoCall}
              className="text-white hover:bg-red-600 p-1 h-auto"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}