import React, { useState, useEffect } from 'react';
import { AlertTriangle, Phone, MapPin, Clock, Users, Heart, Zap, Shield, Siren, Navigation, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { motion } from 'motion/react';
import { Progress } from './ui/progress';

interface EmergencySOSProps {
  userRole: string | null;
  isOnline: boolean;
  emergencyMode: boolean;
  onEmergencyToggle: (active: boolean) => void;
}

export function EmergencySOS({ userRole, isOnline, emergencyMode, onEmergencyToggle }: EmergencySOSProps) {
  const [emergencyTimer, setEmergencyTimer] = useState(0);
  const [isEmergencyActive, setIsEmergencyActive] = useState(emergencyMode);
  const [selectedEmergencyType, setSelectedEmergencyType] = useState<string | null>(null);
  const [nearestResponders, setNearestResponders] = useState([
    { name: 'District Hospital', distance: '12 km', eta: '15 min', type: 'hospital', available: true },
    { name: 'Village Health Worker', distance: '2.1 km', eta: '5 min', type: 'volunteer', available: true },
    { name: 'Dr. Sarah Johnson', distance: '8.5 km', eta: '12 min', type: 'doctor', available: true },
    { name: 'Emergency Ambulance', distance: '15 km', eta: '18 min', type: 'ambulance', available: true }
  ]);

  const emergencyTypes = [
    { 
      id: 'medical', 
      label: 'Medical Emergency', 
      icon: Heart, 
      color: 'bg-red-500',
      description: 'Severe injury, chest pain, difficulty breathing'
    },
    { 
      id: 'accident', 
      label: 'Accident', 
      icon: AlertTriangle, 
      color: 'bg-orange-500',
      description: 'Road accident, fall, trauma'
    },
    { 
      id: 'cardiac', 
      label: 'Cardiac Event', 
      icon: Heart, 
      color: 'bg-red-600',
      description: 'Heart attack, chest pain, cardiac arrest'
    },
    { 
      id: 'pregnancy', 
      label: 'Pregnancy Emergency', 
      icon: Users, 
      color: 'bg-pink-500',
      description: 'Labor complications, severe bleeding'
    }
  ];

  const emergencyContacts = [
    { name: 'National Emergency', number: '108', type: 'primary', available: true },
    { name: 'Police Emergency', number: '100', type: 'police', available: true },
    { name: 'Fire Emergency', number: '101', type: 'fire', available: true },
    { name: 'District Hospital', number: '+91 98765 12345', type: 'hospital', available: true },
    { name: 'Village Health Worker', number: '+91 98765 67890', type: 'volunteer', available: true }
  ];

  const quickActionSteps = [
    { step: 1, action: 'Stay Calm', description: 'Keep yourself and others calm', completed: false },
    { step: 2, action: 'Call Help', description: 'Emergency services contacted', completed: false },
    { step: 3, action: 'First Aid', description: 'Provide immediate care if trained', completed: false },
    { step: 4, action: 'Location Shared', description: 'GPS location sent to responders', completed: false },
    { step: 5, action: 'Wait for Help', description: 'Stay with patient until help arrives', completed: false }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isEmergencyActive) {
      interval = setInterval(() => {
        setEmergencyTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isEmergencyActive]);

  const activateEmergency = (type: string) => {
    setSelectedEmergencyType(type);
    setIsEmergencyActive(true);
    onEmergencyToggle(true);
    setEmergencyTimer(0);
    
    // Simulate emergency response activation
    setTimeout(() => {
      setNearestResponders(prev => prev.map(responder => ({
        ...responder,
        available: true,
        eta: responder.type === 'volunteer' ? '3 min' : responder.eta
      })));
    }, 2000);
  };

  const deactivateEmergency = () => {
    setIsEmergencyActive(false);
    onEmergencyToggle(false);
    setSelectedEmergencyType(null);
    setEmergencyTimer(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Emergency Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-lg border-2 transition-all ${
          isEmergencyActive 
            ? 'bg-red-50 dark:bg-red-950 border-red-500 shadow-lg' 
            : 'bg-card border-border'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.div
              animate={isEmergencyActive ? { 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              } : {}}
              transition={{ repeat: isEmergencyActive ? Infinity : 0, duration: 1 }}
            >
              <Zap className={`h-12 w-12 ${isEmergencyActive ? 'text-red-600' : 'text-muted-foreground'}`} />
            </motion.div>
            <div>
              <h1 className={`text-3xl font-bold ${isEmergencyActive ? 'text-red-600' : ''}`}>
                Emergency SOS
              </h1>
              <p className="text-muted-foreground">
                {isEmergencyActive 
                  ? `Emergency active for ${formatTime(emergencyTimer)}` 
                  : 'Instant access to emergency services and help'
                }
              </p>
            </div>
          </div>
          
          {isEmergencyActive && (
            <div className="flex items-center gap-4">
              <Badge variant="destructive" className="animate-pulse">
                EMERGENCY ACTIVE
              </Badge>
              <Button variant="outline" onClick={deactivateEmergency}>
                Deactivate
              </Button>
            </div>
          )}
        </div>

        {isEmergencyActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6 p-4 bg-red-100 dark:bg-red-900 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <Siren className="h-5 w-5 text-red-600 animate-pulse" />
              <span className="font-semibold text-red-800 dark:text-red-200">
                Emergency Response Activated
              </span>
            </div>
            <p className="text-red-700 dark:text-red-300 text-sm">
              Emergency services have been notified. Help is on the way. Your location has been shared automatically.
            </p>
          </motion.div>
        )}
      </motion.div>

      {!isEmergencyActive ? (
        <>
          {/* Emergency Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Select Emergency Type
              </CardTitle>
              <CardDescription>
                Choose the type of emergency to get appropriate help faster
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emergencyTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <motion.div
                      key={type.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        className="h-auto p-6 flex flex-col items-start text-left gap-3 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                        onClick={() => activateEmergency(type.id)}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className={`p-3 rounded-full ${type.color} text-white`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{type.label}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {type.description}
                            </p>
                          </div>
                        </div>
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Emergency Button */}
          <Card className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 border-red-200 dark:border-red-800">
            <CardContent className="p-8 text-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="h-24 w-48 text-xl font-bold bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg"
                  onClick={() => activateEmergency('general')}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Zap className="h-8 w-8 mr-3" />
                  </motion.div>
                  EMERGENCY SOS
                </Button>
              </motion.div>
              <p className="text-muted-foreground mt-4">
                Tap for immediate emergency assistance
              </p>
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Emergency Status */}
          <Card className="border-red-500">
            <CardHeader>
              <CardTitle className="text-red-600">Emergency Response Status</CardTitle>
              <CardDescription>Real-time emergency response coordination</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickActionSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.5 }}
                  className="flex items-center gap-3"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    index <= Math.floor(emergencyTimer / 10) 
                      ? 'bg-green-500 text-white' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{step.action}</h4>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                  {index <= Math.floor(emergencyTimer / 10) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-green-500"
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.div>
              ))}
              
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="flex justify-between text-sm mb-1">
                  <span>Emergency Response Progress</span>
                  <span>{Math.min(Math.floor(emergencyTimer / 3), 100)}%</span>
                </div>
                <Progress value={Math.min(Math.floor(emergencyTimer / 3), 100)} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Nearest Responders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Nearest Emergency Responders
              </CardTitle>
              <CardDescription>Help is on the way to your location</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {nearestResponders.map((responder, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      responder.available ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                    }`} />
                    <div>
                      <h4 className="font-medium">{responder.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{responder.distance}</span>
                        <Clock className="h-3 w-3 ml-2" />
                        <span>ETA: {responder.eta}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Navigation className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="contacts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contacts">Emergency Contacts</TabsTrigger>
          <TabsTrigger value="first-aid">First Aid Guide</TabsTrigger>
          <TabsTrigger value="location">Location Services</TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact Numbers</CardTitle>
              <CardDescription>Quick access to emergency services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emergencyContacts.map((contact, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium group-hover:text-primary transition-colors">
                              {contact.name}
                            </h4>
                            <p className="text-lg font-semibold text-primary">{contact.number}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <div className={`w-2 h-2 rounded-full ${
                                contact.available ? 'bg-green-500' : 'bg-red-500'
                              }`} />
                              <span className="text-xs text-muted-foreground">
                                {contact.available ? 'Available' : 'Unavailable'}
                              </span>
                            </div>
                          </div>
                          <Button size="lg" className="group-hover:scale-105 transition-transform">
                            <Phone className="h-5 w-5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="first-aid" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Emergency First Aid Guide</CardTitle>
              <CardDescription>Basic first aid steps for common emergencies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950">
                <Heart className="h-4 w-4" />
                <AlertDescription>
                  <strong>Cardiac Emergency:</strong> Call 108 immediately. If trained, start CPR. Push hard and fast on the center of the chest at least 2 inches deep.
                </AlertDescription>
              </Alert>
              
              <Alert className="border-orange-500 bg-orange-50 dark:bg-orange-950">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Severe Bleeding:</strong> Apply direct pressure to the wound with a clean cloth. Elevate the injured area above the heart if possible.
                </AlertDescription>
              </Alert>
              
              <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Unconscious Person:</strong> Check for breathing. If not breathing, start rescue breathing. Place them in recovery position if breathing.
                </AlertDescription>
              </Alert>
              
              <Button className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                Get AI First Aid Guidance
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Location Services</CardTitle>
              <CardDescription>Your location information for emergency responders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-800 dark:text-green-200">
                    Location Services Active
                  </span>
                </div>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  Your precise location is being shared with emergency responders automatically.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-1">GPS Coordinates</h4>
                  <p className="text-sm text-muted-foreground">11.4102° N, 76.8725° E</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-1">Address</h4>
                  <p className="text-sm text-muted-foreground">Kotagiri Village, The Nilgiris, Tamil Nadu</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-1">Nearest Landmark</h4>
                  <p className="text-sm text-muted-foreground">Village Community Center (200m)</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-1">Accuracy</h4>
                  <p className="text-sm text-muted-foreground">±5 meters</p>
                </div>
              </div>
              
              <Button variant="outline" className="w-full">
                <Navigation className="h-4 w-4 mr-2" />
                Share Location via SMS
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}