import React from 'react';
import { MapPin, Calendar, Package, Clock, Heart, Users, Phone, AlertCircle, Sparkles, TrendingUp, Zap, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { NotificationCenter } from './NotificationCenter';

interface PatientDashboardProps {
  userRole: string | null;
  isOnline: boolean;
  emergencyMode: boolean;
}

export function PatientDashboard({ userRole, isOnline, emergencyMode }: PatientDashboardProps) {
  const nearbyHubs = [
    {
      name: 'Rajesh Kumar\'s Hub',
      location: 'Kotagiri Village',
      distance: '0.8 km',
      rating: 4.8,
      medicines: 24,
      nextVisit: 'Today 2:00 PM',
      available: true
    },
    {
      name: 'Priya Sharma\'s Hub',
      location: 'Hillview Colony',
      distance: '1.2 km',
      rating: 4.6,
      medicines: 18,
      nextVisit: 'Tomorrow 10:00 AM',
      available: true
    },
    {
      name: 'Community Center Hub',
      location: 'Main Road',
      distance: '2.1 km',
      rating: 4.9,
      medicines: 45,
      nextVisit: 'Friday 9:00 AM',
      available: false
    }
  ];

  const upcomingAppointments = [
    {
      doctor: 'Dr. Sarah Johnson',
      specialization: 'General Practice',
      location: 'Rajesh Kumar\'s Hub',
      time: 'Today, 2:00 PM',
      status: 'confirmed',
      type: 'consultation'
    },
    {
      doctor: 'Medicine Pickup',
      specialization: 'Prescription Refill',
      location: 'Priya Sharma\'s Hub',
      time: 'Tomorrow, 10:00 AM',
      status: 'pending',
      type: 'pickup'
    }
  ];

  const recentActivities = [
    {
      type: 'consultation',
      title: 'Consultation completed',
      description: 'General check-up with Dr. Sarah',
      time: '2 days ago',
      icon: Users
    },
    {
      type: 'medicine',
      title: 'Medicine collected',
      description: 'Paracetamol and vitamins from local hub',
      time: '5 days ago',
      icon: Package
    },
    {
      type: 'appointment',
      title: 'Appointment scheduled',
      description: 'Follow-up with Dr. Sarah',
      time: '1 week ago',
      icon: Calendar
    }
  ];

  const quickServices = [
    {
      title: 'Find Medicine',
      description: 'Search for medicines in nearby hubs',
      icon: Package,
      color: 'blue'
    },
    {
      title: 'Book Consultation',
      description: 'Schedule a doctor visit',
      icon: Users,
      color: 'green'
    },
    {
      title: 'Emergency Help',
      description: 'Get immediate assistance',
      icon: AlertCircle,
      color: 'red'
    },
    {
      title: 'View Health Records',
      description: 'Access your medical history',
      icon: Heart,
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-lg transition-all ${emergencyMode ? 'bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800' : 'bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950'}`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              Good morning, Maria!
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <Sparkles className="h-6 w-6 text-yellow-500" />
              </motion.div>
            </h1>
            <p className="text-muted-foreground mt-2">
              3 health hubs are available near you • Your next appointment is today at 2:00 PM
            </p>
            <div className="flex items-center gap-4 mt-3">
              <Badge variant="outline" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Health Score: 89%
              </Badge>
              <Badge variant={isOnline ? 'default' : 'secondary'} className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                {isOnline ? 'Connected' : 'Offline Mode'}
              </Badge>
            </div>
          </div>
          <div className="flex gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" className="bg-white/80 hover:bg-white">
                <Phone className="h-4 w-4 mr-2" />
                Emergency Call
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="shadow-lg">
                <MapPin className="h-4 w-4 mr-2" />
                Find Nearest Hub
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Quick Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickServices.map((service, index) => {
          const Icon = service.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card className="cursor-pointer hover:shadow-lg transition-all group relative overflow-hidden">
                <CardContent className="p-6 text-center">
                  <motion.div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform ${
                      service.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900' :
                      service.color === 'green' ? 'bg-green-100 dark:bg-green-900' :
                      service.color === 'red' ? 'bg-red-100 dark:bg-red-900' :
                      'bg-purple-100 dark:bg-purple-900'
                    }`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon className={`h-6 w-6 ${
                      service.color === 'blue' ? 'text-blue-600' :
                      service.color === 'green' ? 'text-green-600' :
                      service.color === 'red' ? 'text-red-600' :
                      'text-purple-600'
                    }`} />
                  </motion.div>
                  <h3 className="font-medium mb-1">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                  
                  {/* Sparkle effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nearby Hubs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-500" />
                Nearby Health Hubs
              </CardTitle>
              <CardDescription>Health hubs available in your area</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {nearbyHubs.map((hub, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium group-hover:text-primary transition-colors">{hub.name}</h4>
                      <motion.div
                        animate={hub.available ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <Badge variant={hub.available ? 'default' : 'secondary'}>
                          {hub.available ? 'Available' : 'Busy'}
                        </Badge>
                      </motion.div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{hub.location} • {hub.distance}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span>{hub.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4 text-blue-500" />
                        <span>{hub.medicines} medicines</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Next visit: {hub.nextVisit}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button size="sm" disabled={!hub.available} className="min-w-[80px]">
                        Book Visit
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button size="sm" variant="outline" className="min-w-[80px]">
                        Call Hub
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Appointments & Notifications */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Upcoming Appointments
                </CardTitle>
                <CardDescription>Your scheduled visits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingAppointments.map((appointment, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="p-3 border rounded-lg hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{appointment.doctor}</h4>
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                      >
                        <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'} className="text-xs">
                          {appointment.status}
                        </Badge>
                      </motion.div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{appointment.specialization}</p>
                    <p className="text-sm text-muted-foreground mb-1">{appointment.location}</p>
                    <p className="text-sm font-medium">{appointment.time}</p>
                    <div className="flex gap-2 mt-3">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button size="sm" variant="outline" className="text-xs">
                          Reschedule
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button size="sm" variant="outline" className="text-xs">
                          Cancel
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" className="w-full hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule New Appointment
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <NotificationCenter userRole={userRole} isOnline={isOnline} emergencyMode={emergencyMode} />
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Your healthcare journey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{activity.title}</h4>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Health Tips & Information */}
        <Card>
          <CardHeader>
            <CardTitle>Health Tips</CardTitle>
            <CardDescription>Daily wellness recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-48 mb-4">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758691463198-dc663b8a64e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBjb25zdWx0YXRpb24lMjBtZWRpY2FsfGVufDF8fHx8MTc1ODgwNDMzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Doctor consultation"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">Stay Hydrated</h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Drink at least 8 glasses of water daily for better health.
                </p>
              </div>
              
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">Regular Exercise</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  30 minutes of walking daily can improve your overall health.
                </p>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-4">
              View More Tips
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Information */}
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Emergency Information</CardTitle>
          <CardDescription>Important contacts and procedures</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg text-center">
              <Phone className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <h4 className="font-medium mb-1">Emergency Hotline</h4>
              <p className="text-lg font-semibold text-red-600">108</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
              <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium mb-1">Nearest Hospital</h4>
              <p className="text-sm text-muted-foreground">District Hospital<br />12 km away</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg text-center">
              <Heart className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium mb-1">Community Health</h4>
              <p className="text-sm text-muted-foreground">Village Health Worker<br />+91 98765 43210</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}