import { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Phone, Hospital, Ambulance, Bed, Clock, CheckCircle, ArrowLeft, Navigation, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface EmergencyFlowProps {
  onBack: () => void;
}

interface Hospital {
  name: string;
  distance: string;
  time: string;
  doctors: number;
  ambulances: number;
  beds: number;
  status: 'available' | 'limited' | 'full';
}

const mockHospitals: Hospital[] = [
  {
    name: "Nabha Civil Hospital",
    distance: "2.3 km",
    time: "8 min",
    doctors: 3,
    ambulances: 2,
    beds: 5,
    status: 'available'
  },
  {
    name: "Patiala Government Hospital",
    distance: "32 km",
    time: "35 min",
    doctors: 8,
    ambulances: 4,
    beds: 12,
    status: 'available'
  },
  {
    name: "Sangrur District Hospital",
    distance: "28 km",
    time: "30 min",
    doctors: 2,
    ambulances: 1,
    beds: 2,
    status: 'limited'
  }
];

export default function EmergencyFlow({ onBack }: EmergencyFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  const steps = [
    "Emergency Alert",
    "Location Detection", 
    "Searching Hospitals",
    "Hospital Selection",
    "Confirmation & Dispatch"
  ];

  useEffect(() => {
    if (currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setProgress(prev => prev + 25);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [currentStep, steps.length]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'limited': return 'bg-yellow-100 text-yellow-800';
      case 'full': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="flex flex-col items-center text-center p-6">
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mb-4 animate-pulse">
                <AlertTriangle className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl text-red-700 mb-3">Emergency Alert Activated</h3>
              <p className="text-red-600 mb-4">
                Emergency button pressed. Initiating immediate response protocol.
              </p>
              <div className="flex items-center gap-2 text-red-600">
                <Zap className="h-4 w-4" />
                <span className="text-sm">Processing emergency request...</span>
              </div>
            </CardContent>
          </Card>
        );

      case 1:
        return (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="flex flex-col items-center text-center p-6">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-10 w-10 text-white animate-bounce" />
              </div>
              <h3 className="text-xl text-blue-700 mb-3">Location Detected</h3>
              <div className="bg-white p-4 rounded-lg border border-blue-200 mb-4 w-full">
                <div className="flex items-center gap-2 text-blue-600 mb-2 justify-center">
                  <Navigation className="h-4 w-4" />
                  <span className="text-sm">GPS: 30.2650° N, 76.1571° E</span>
                </div>
                <p className="text-gray-700">Village Bhadson, Nabha</p>
              </div>
              <p className="text-blue-600 text-sm">
                Location captured successfully. Searching nearby medical facilities...
              </p>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="flex flex-col items-center text-center p-6">
              <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mb-4">
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-xl text-orange-700 mb-3">Searching Medical Centers</h3>
              <p className="text-orange-600 mb-4 text-sm">
                Querying database for hospitals with available resources...
              </p>
              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm items-center">
                  <span>Checking doctor availability</span>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span>Verifying ambulance status</span>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span>Confirming bed capacity</span>
                  <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Hospital className="h-5 w-5" />
                Available Medical Centers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockHospitals.map((hospital, index) => (
                <Card 
                  key={index} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedHospital?.name === hospital.name ? 'ring-2 ring-green-500 bg-green-50' : 'bg-white'
                  }`}
                  onClick={() => setSelectedHospital(hospital)}
                >
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-gray-900 text-sm mb-1">{hospital.name}</h4>
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {hospital.distance}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {hospital.time}
                          </span>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(hospital.status)} text-xs`}>
                        {hospital.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <div className="text-sm text-green-600">{hospital.doctors}</div>
                        <div className="text-xs text-gray-600">Doctors</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-blue-600">{hospital.ambulances}</div>
                        <div className="text-xs text-gray-600">Ambulances</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-orange-600">{hospital.beds}</div>
                        <div className="text-xs text-gray-600">Beds</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {selectedHospital && (
                <Button 
                  onClick={() => setCurrentStep(4)}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Dispatch to {selectedHospital.name}
                </Button>
              )}
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="flex flex-col items-center text-center p-6">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl text-green-700 mb-4">Emergency Response Activated</h3>
              
              {selectedHospital && (
                <div className="w-full space-y-3">
                  <div className="bg-white p-3 rounded-lg border border-green-200">
                    <h4 className="text-gray-900 mb-1">Dispatched to:</h4>
                    <p className="text-green-600 text-sm mb-1">{selectedHospital.name}</p>
                    <p className="text-xs text-gray-600">ETA: {selectedHospital.time}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-2 rounded-lg border border-green-200 text-center">
                      <Ambulance className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Ambulance dispatched</p>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-green-200 text-center">
                      <Phone className="h-5 w-5 text-green-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Family notified</p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 rounded-lg border border-green-200">
                    <h4 className="text-sm text-gray-700 mb-2">Response Team Status:</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span>Emergency preparedness</span>
                        <Badge className="bg-green-100 text-green-800 text-xs">Ready</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Medical team alerted</span>
                        <Badge className="bg-green-100 text-green-800 text-xs">Confirmed</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Bed reserved</span>
                        <Badge className="bg-green-100 text-green-800 text-xs">Secured</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-green-50 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl text-gray-900 mb-1">🚨 Emergency Response System</h1>
            <p className="text-gray-600 text-sm">Real-time emergency assistance demonstration</p>
          </div>
          
          <div className="w-24"></div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`flex flex-col items-center ${
                  index <= currentStep ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mb-1 ${
                  index <= currentStep ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {index <= currentStep ? '✓' : index + 1}
                </div>
                <span className="text-xs text-center">{step}</span>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Current Step */}
        <div className="mb-6">
          {renderStep()}
        </div>

        {/* Demo Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="text-blue-700 mb-3">💡 How the Emergency System Works</h3>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div>
                <h4 className="text-blue-600 mb-2">Real-time Features:</h4>
                <ul className="space-y-1 text-gray-700 text-xs">
                  <li>• GPS location capture</li>
                  <li>• Hospital database query</li>
                  <li>• Resource availability check</li>
                  <li>• Automatic dispatch system</li>
                </ul>
              </div>
              <div>
                <h4 className="text-blue-600 mb-2">Communication:</h4>
                <ul className="space-y-1 text-gray-700 text-xs">
                  <li>• SMS alerts to family</li>
                  <li>• Hospital notification</li>
                  <li>• Ambulance coordination</li>
                  <li>• Real-time status updates</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}