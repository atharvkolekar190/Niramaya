import React, { useState, useEffect } from 'react';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Users, Calendar, Clock, Camera, Monitor, Wifi, WifiOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { motion } from 'motion/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface TelemedicineHubProps {
  userRole: string | null;
  isOnline: boolean;
  emergencyMode: boolean;
}

export function TelemedicineHub({ userRole, isOnline, emergencyMode }: TelemedicineHubProps) {
  const [isInCall, setIsInCall] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [connectionQuality, setConnectionQuality] = useState('excellent');
  const [callDuration, setCallDuration] = useState(0);

  const availableDoctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'General Practice',
      experience: '8 years',
      rating: 4.9,
      reviews: 234,
      availability: 'Available Now',
      status: 'online',
      languages: ['English', 'Hindi', 'Tamil'],
      consultationFee: 'Free',
      image: '/api/placeholder/80/80'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Cardiology',
      experience: '12 years',
      rating: 4.8,
      reviews: 189,
      availability: 'Available in 15 min',
      status: 'busy',
      languages: ['English', 'Hindi'],
      consultationFee: 'Free',
      image: '/api/placeholder/80/80'
    },
    {
      id: 3,
      name: 'Dr. Priya Patel',
      specialty: 'Pediatrics',
      experience: '6 years',
      rating: 4.9,
      reviews: 156,
      availability: 'Available Now',
      status: 'online',
      languages: ['English', 'Hindi', 'Gujarati'],
      consultationFee: 'Free',
      image: '/api/placeholder/80/80'
    }
  ];

  const upcomingAppointments = [
    {
      id: 1,
      doctor: 'Dr. Sarah Johnson',
      time: 'Today, 2:00 PM',
      duration: '30 min',
      type: 'Follow-up',
      status: 'confirmed'
    },
    {
      id: 2,
      doctor: 'Dr. Michael Chen',
      time: 'Tomorrow, 10:00 AM',
      duration: '45 min',
      type: 'Consultation',
      status: 'pending'
    }
  ];

  const consultationHistory = [
    {
      id: 1,
      doctor: 'Dr. Sarah Johnson',
      date: 'March 20, 2024',
      duration: '25 min',
      diagnosis: 'Common cold',
      prescription: 'Rest, fluids, paracetamol',
      rating: 5
    },
    {
      id: 2,
      doctor: 'Dr. Priya Patel',
      date: 'March 15, 2024',
      duration: '30 min',
      diagnosis: 'Routine check-up',
      prescription: 'Vitamin supplements',
      rating: 5
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInCall) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isInCall]);

  const startCall = (doctorId: number) => {
    setIsInCall(true);
    setCallDuration(0);
    // Simulate connection quality changes
    setTimeout(() => setConnectionQuality('good'), 5000);
    setTimeout(() => setConnectionQuality('fair'), 15000);
    setTimeout(() => setConnectionQuality('excellent'), 25000);
  };

  const endCall = () => {
    setIsInCall(false);
    setCallDuration(0);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-yellow-500';
      case 'fair': return 'text-orange-500';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (isInCall) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-6xl mx-auto"
        >
          {/* Call Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback>DR</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">Dr. Sarah Johnson</h2>
                <div className="flex items-center gap-4 text-sm text-gray-300">
                  <span>Duration: {formatDuration(callDuration)}</span>
                  <div className="flex items-center gap-1">
                    {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                    <span className={getQualityColor(connectionQuality)}>
                      {connectionQuality}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <Badge variant={emergencyMode ? 'destructive' : 'default'}>
              {emergencyMode ? 'Emergency Call' : 'Consultation'}
            </Badge>
          </div>

          {/* Video Area */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            {/* Main Video */}
            <div className="lg:col-span-3">
              <Card className="bg-gray-800 border-gray-700 h-96">
                <CardContent className="p-0 h-full relative">
                  <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg flex items-center justify-center">
                    {isVideoEnabled ? (
                      <div className="text-center">
                        <Camera className="h-16 w-16 text-white/50 mx-auto mb-4" />
                        <p className="text-white/70">Dr. Sarah Johnson</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <VideoOff className="h-16 w-16 text-white/50 mx-auto mb-4" />
                        <p className="text-white/70">Video Disabled</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Self Video (Picture-in-Picture) */}
                  <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-700 rounded-lg flex items-center justify-center">
                    {isVideoEnabled ? (
                      <div className="text-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-1"></div>
                        <span className="text-xs text-white/70">You</span>
                      </div>
                    ) : (
                      <VideoOff className="h-6 w-6 text-white/50" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Call Controls & Info */}
            <div className="space-y-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Call Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-center gap-4">
                    <Button
                      size="lg"
                      variant={isVideoEnabled ? 'default' : 'destructive'}
                      className="rounded-full w-12 h-12 p-0"
                      onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                    >
                      {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                    </Button>
                    
                    <Button
                      size="lg"
                      variant={isAudioEnabled ? 'default' : 'destructive'}
                      className="rounded-full w-12 h-12 p-0"
                      onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                    >
                      {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                    </Button>
                  </div>
                  
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={endCall}
                  >
                    <PhoneOff className="h-4 w-4 mr-2" />
                    End Call
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Quick Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Add consultation notes..."
                    className="bg-gray-700 border-gray-600 text-white resize-none"
                    rows={4}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Chat Area */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 overflow-y-auto mb-4 space-y-2">
                <div className="flex items-start gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">DR</AvatarFallback>
                  </Avatar>
                  <div className="bg-blue-600 p-2 rounded-lg max-w-xs">
                    <p className="text-sm text-white">Hello! How are you feeling today?</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 justify-end">
                  <div className="bg-gray-600 p-2 rounded-lg max-w-xs">
                    <p className="text-sm text-white">I'm experiencing some chest discomfort.</p>
                  </div>
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">ME</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Button>Send</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Video className="h-8 w-8 text-blue-500" />
            </motion.div>
            Telemedicine Hub
          </h1>
          <p className="text-muted-foreground">
            Connect with healthcare professionals through secure video consultations
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={isOnline ? 'default' : 'secondary'} className="flex items-center gap-1">
            {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {isOnline ? 'Online' : 'Offline'}
          </Badge>
          <Button>
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Consultation
          </Button>
        </div>
      </motion.div>

      <Tabs defaultValue="doctors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="doctors">Available Doctors</TabsTrigger>
          <TabsTrigger value="appointments">My Appointments</TabsTrigger>
          <TabsTrigger value="history">Consultation History</TabsTrigger>
          <TabsTrigger value="settings">Video Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="doctors" className="space-y-6">
          {emergencyMode && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-2">
                <Phone className="h-5 w-5 text-red-600" />
                <span className="font-semibold text-red-800 dark:text-red-200">Emergency Consultation Mode</span>
              </div>
              <p className="text-red-700 dark:text-red-300 text-sm">
                Emergency mode is active. Doctors will prioritize your consultation.
              </p>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {availableDoctors.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="hover:shadow-lg transition-all cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={doctor.image} />
                        <AvatarFallback>
                          {doctor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">{doctor.name}</h3>
                          <Badge variant={doctor.status === 'online' ? 'default' : 'secondary'}>
                            {doctor.availability}
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground mb-2">{doctor.specialty}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span>{doctor.experience} experience</span>
                          <div className="flex items-center gap-1">
                            <span>⭐ {doctor.rating}</span>
                            <span>({doctor.reviews} reviews)</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div>
                            <span className="text-sm font-medium">Languages: </span>
                            <span className="text-sm text-muted-foreground">
                              {doctor.languages.join(', ')}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Consultation Fee: </span>
                            <span className="text-sm text-green-600 font-medium">{doctor.consultationFee}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            className="flex-1"
                            onClick={() => startCall(doctor.id)}
                            disabled={doctor.status !== 'online'}
                          >
                            <Video className="h-4 w-4 mr-2" />
                            {doctor.status === 'online' ? 'Start Video Call' : 'Unavailable'}
                          </Button>
                          <Button variant="outline">
                            <Calendar className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Video Consultations</CardTitle>
              <CardDescription>Your scheduled telemedicine appointments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>
                        {appointment.doctor.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{appointment.doctor}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{appointment.time}</span>
                        </div>
                        <span>{appointment.duration}</span>
                        <Badge variant="outline">{appointment.type}</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Reschedule</Button>
                    <Button size="sm">
                      <Video className="h-4 w-4 mr-1" />
                      Join Call
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Book Consultation</CardTitle>
              <CardDescription>Schedule a new telemedicine appointment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Doctor</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDoctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id.toString()}>
                          {doctor.name} - {doctor.specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Preferred Time</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (1 PM - 5 PM)</SelectItem>
                      <SelectItem value="evening">Evening (6 PM - 9 PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Reason for Consultation</label>
                <Textarea
                  placeholder="Briefly describe your symptoms or reason for consultation"
                  rows={3}
                />
              </div>
              
              <Button className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Video Consultation
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Consultation History</CardTitle>
              <CardDescription>Your previous telemedicine sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {consultationHistory.map((consultation) => (
                <div key={consultation.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>
                          {consultation.doctor.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{consultation.doctor}</h4>
                        <p className="text-sm text-muted-foreground">{consultation.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < consultation.rating ? 'text-yellow-500' : 'text-gray-300'}>
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Duration: </span>
                      <span className="text-muted-foreground">{consultation.duration}</span>
                    </div>
                    <div>
                      <span className="font-medium">Diagnosis: </span>
                      <span className="text-muted-foreground">{consultation.diagnosis}</span>
                    </div>
                    <div>
                      <span className="font-medium">Prescription: </span>
                      <span className="text-muted-foreground">{consultation.prescription}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline">
                      Download Report
                    </Button>
                    <Button size="sm" variant="outline">
                      Book Follow-up
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Video & Audio Settings</CardTitle>
                <CardDescription>Configure your devices for optimal consultation experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Camera</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select camera" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default Camera</SelectItem>
                        <SelectItem value="external">External USB Camera</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Microphone</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select microphone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default Microphone</SelectItem>
                        <SelectItem value="headset">Bluetooth Headset</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Speaker</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select speaker" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default Speaker</SelectItem>
                        <SelectItem value="headphones">Headphones</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button className="w-full">
                  <Monitor className="h-4 w-4 mr-2" />
                  Test Audio & Video
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Connection Quality</CardTitle>
                <CardDescription>Current network status and recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Internet Speed</span>
                    <Badge variant="default">Fast (25 Mbps)</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Video Quality</span>
                    <Badge variant="default">HD Ready</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Latency</span>
                    <Badge variant="default">Low (45ms)</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Device Performance</span>
                    <Badge variant="default">Excellent</Badge>
                  </div>
                </div>
                
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                    ✅ Ready for Video Consultation
                  </h4>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Your device and connection are optimized for high-quality video calls.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}