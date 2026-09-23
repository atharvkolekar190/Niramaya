import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, Clock, Users, Pill, Phone, Wifi, WifiOff } from 'lucide-react';

interface HealthcareStatsProps {
  language: 'en' | 'hi' | 'pa';
  isOnline: boolean;
  nearbyCount: number;
  availableDoctors: number;
  emergencyServices: number;
}

const translations = {
  en: {
    nearbyServices: "Nearby Services",
    healthcenters: "Health Centers",
    availableDoctors: "Available Doctors", 
    emergencyServices: "Emergency Services",
    status: "Status",
    online: "Online",
    offline: "Offline - Limited Features",
    lastUpdated: "Last updated: 2 minutes ago",
    quickActions: "Quick Actions",
    findNearby: "Find Nearby",
    emergency: "Emergency Call",
    telemedicine: "Telemedicine"
  },
  hi: {
    nearbyServices: "नज़दीकी सेवाएं",
    healthcenters: "स्वास्थ्य केंद्र",
    availableDoctors: "उपलब्ध डॉक्टर",
    emergencyServices: "आपातकालीन सेवाएं", 
    status: "स्थिति",
    online: "ऑनलाइन",
    offline: "ऑफलाइन - सीमित सुविधाएं",
    lastUpdated: "अंतिम अपडेट: 2 मिनट पहले",
    quickActions: "त्वरित कार्य",
    findNearby: "नज़दीकी खोजें",
    emergency: "आपातकालीन कॉल",
    telemedicine: "दूरचिकित्सा"
  },
  pa: {
    nearbyServices: "ਨੇੜਲੀਆਂ ਸੇਵਾਵਾਂ",
    healthcenters: "ਸਿਹਤ ਕੇਂਦਰ",
    availableDoctors: "ਉਪਲਬਧ ਡਾਕਟਰ",
    emergencyServices: "ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ",
    status: "ਸਥਿਤੀ", 
    online: "ਔਨਲਾਇਨ",
    offline: "ਔਫਲਾਇਨ - ਸੀਮਤ ਸੁਵਿਧਾਵਾਂ",
    lastUpdated: "ਆਖਰੀ ਅਪਡੇਟ: 2 ਮਿੰਟ ਪਹਿਲਾਂ",
    quickActions: "ਤੁਰੰਤ ਕਾਰਵਾਈਆਂ",
    findNearby: "ਨੇੜਲੇ ਲੱਭੋ",
    emergency: "ਐਮਰਜੈਂਸੀ ਕਾਲ",
    telemedicine: "ਦੂਰ-ਚਿਕਿਤਸਾ"
  }
};

export function HealthcareStats({ 
  language, 
  isOnline, 
  nearbyCount, 
  availableDoctors, 
  emergencyServices 
}: HealthcareStatsProps) {
  const t = translations[language];

  return (
    <div className="space-y-3">
      {/* Connection Status - Improved Alignment */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="w-4 h-4 text-green-500" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-500" />
          )}
          <span className="text-sm font-medium text-gray-700">{t.status}</span>
        </div>
        <Badge variant={isOnline ? "default" : "destructive"} className="text-xs px-2 py-1">
          {isOnline ? t.online : t.offline}
        </Badge>
      </div>

      {/* Healthcare Statistics - Highlighted */}
      <Card className="p-3 border-l-4 border-l-green-500 bg-green-50/30">
        <h3 className="font-semibold mb-3 flex items-center gap-2 text-green-800">
          <MapPin className="w-4 h-4 text-green-600" />
          {t.nearbyServices}
        </h3>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center py-2">
            <div className="text-xl font-bold text-blue-600 mb-1">{nearbyCount}</div>
            <div className="text-xs text-gray-600 leading-tight">{t.healthcenters}</div>
          </div>
          <div className="text-center py-2">
            <div className="text-xl font-bold text-green-600 mb-1">{availableDoctors}</div>
            <div className="text-xs text-gray-600 leading-tight">{t.availableDoctors}</div>
          </div>
          <div className="text-center py-2">
            <div className="text-xl font-bold text-red-600 mb-1">{emergencyServices}</div>
            <div className="text-xs text-gray-600 leading-tight">{t.emergencyServices}</div>
          </div>
        </div>
      </Card>

      {/* Quick Actions - Compact */}
      <Card className="p-3 border-l-4 border-l-purple-500 bg-purple-50/30">
        <h3 className="font-semibold mb-3 flex items-center gap-2 text-purple-800">
          <Clock className="w-4 h-4 text-purple-600" />
          {t.quickActions}
        </h3>
        
        <div className="grid grid-cols-1 gap-3">
          <button 
            className="p-3 text-left bg-red-100 hover:bg-red-200 rounded-lg transition-colors flex items-center gap-2 h-16"
            onClick={() => window.open('tel:108', '_self')}
          >
            <Phone className="w-4 h-4 text-red-600 flex-shrink-0" />
            <div className="min-w-0">
              <div className="font-medium text-xs">{t.emergency}</div>
              <div className="text-xs text-gray-600">108</div>
            </div>
          </button>
        </div>
      </Card>

    </div>
  );
}
