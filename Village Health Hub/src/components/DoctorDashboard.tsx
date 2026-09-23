import React from 'react';
import { Calendar, Users, MapPin, TrendingUp, Clock, Package, Phone, Video } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

export function DoctorDashboard() {
  const stats = [
    {
      title: 'Patients Treated',
      value: '156',
      change: '+24 this month',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Hub Visits',
      value: '12',
      change: '8 scheduled',
      icon: MapPin,
      color: 'text-green-600'
    },
    {
      title: 'Consultations',
      value: '89',
      change: '12 pending',
      icon: Calendar,
      color: 'text-purple-600'
    },
    {
      title: 'Success Rate',
      value: '94%',
      change: 'Patient satisfaction',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  const todaySchedule = [
    {
      time: '9:00 AM',
      location: 'Rajesh Kumar\'s Hub, Kotagiri',
      patients: 5,
      type: 'General Consultation',
      status: 'confirmed',
      distance: '8 km'
    },
    {
      time: '2:00 PM',
      location: 'Priya Sharma\'s Hub, Hillview',
      patients: 3,
      type: 'Follow-up Visit',
      status: 'confirmed',
      distance: '12 km'
    },
    {
      time: '5:00 PM',
      location: 'Telemedicine Session',
      patients: 2,
      type: 'Video Consultation',
      status: 'pending',
      distance: 'Online'
    }
  ];

  const pendingRequests = [
    {
      patient: 'Maria Santos',
      location: 'Kotagiri Village',
      condition: 'Fever and cough',
      urgency: 'moderate',
      requestedTime: '2 hours ago',
      preferredTime: 'Today evening'
    },
    {
      patient: 'John Kumar',
      location: 'Hillview Colony',
      condition: 'Diabetes check-up',
      urgency: 'low',
      requestedTime: '5 hours ago',
      preferredTime: 'Tomorrow morning'
    },
    {
      patient: 'Elderly Mrs. Sharma',
      location: 'Main Road Hub',
      condition: 'Blood pressure monitoring',
      urgency: 'high',
      requestedTime: '30 minutes ago',
      preferredTime: 'As soon as possible'
    }
  ];

  const hubPerformance = [
    {
      name: 'Rajesh Kumar\'s Hub',
      location: 'Kotagiri Village',
      patients: 45,
      satisfaction: 4.8,
      medicines: 24,
      utilization: 85
    },
    {
      name: 'Priya Sharma\'s Hub',
      location: 'Hillview Colony',
      patients: 32,
      satisfaction: 4.6,
      medicines: 18,
      utilization: 72
    },
    {
      name: 'Community Center',
      location: 'Main Road',
      patients: 67,
      satisfaction: 4.9,
      medicines: 45,
      utilization: 94
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Good morning, Dr. Sarah!</h1>
          <p className="text-muted-foreground">
            You have 3 hub visits scheduled today • 8 patients waiting for consultation
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Video className="h-4 w-4 mr-2" />
            Start Video Call
          </Button>
          <Button>
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Visit
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Friday, March 22, 2024 - Your hub visits and consultations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {todaySchedule.map((appointment, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{appointment.time}</span>
                    <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                      {appointment.status}
                    </Badge>
                  </div>
                  <h4 className="font-medium mb-1">{appointment.type}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{appointment.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{appointment.patients} patients</span>
                    </div>
                    <span>{appointment.distance}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button size="sm">
                    Navigate
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
            <CardDescription>Patients waiting for consultation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingRequests.map((request, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{request.patient}</h4>
                  <Badge 
                    variant={
                      request.urgency === 'high' ? 'destructive' : 
                      request.urgency === 'moderate' ? 'default' : 
                      'secondary'
                    }
                    className="text-xs"
                  >
                    {request.urgency}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{request.condition}</p>
                <p className="text-sm text-muted-foreground mb-1">{request.location}</p>
                <p className="text-xs text-muted-foreground">Requested: {request.requestedTime}</p>
                <p className="text-xs text-muted-foreground mb-3">Preferred: {request.preferredTime}</p>
                <div className="flex gap-2">
                  <Button size="sm" className="text-xs">
                    Accept
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    Reschedule
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hub Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Hub Performance</CardTitle>
            <CardDescription>Performance metrics for health hubs you visit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {hubPerformance.map((hub, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">{hub.name}</h4>
                    <p className="text-sm text-muted-foreground">{hub.location}</p>
                  </div>
                  <Badge variant="outline">{hub.satisfaction} ★</Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-blue-600">{hub.patients}</div>
                    <div className="text-muted-foreground">Patients</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-green-600">{hub.medicines}</div>
                    <div className="text-muted-foreground">Medicines</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-purple-600">{hub.utilization}%</div>
                    <div className="text-muted-foreground">Utilization</div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Hub Efficiency</span>
                    <span>{hub.utilization}%</span>
                  </div>
                  <Progress value={hub.utilization} className="h-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Patient Management */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Management</CardTitle>
            <CardDescription>Recent consultations and follow-ups</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">12</div>
                <div className="text-sm text-muted-foreground">Today's Patients</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-2xl font-bold text-green-600">8</div>
                <div className="text-sm text-muted-foreground">Follow-ups Due</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm">Most Common Conditions</h4>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Fever & Cold</span>
                    <span className="text-muted-foreground">35%</span>
                  </div>
                  <Progress value={35} className="h-1" />
                  
                  <div className="flex justify-between text-sm">
                    <span>Diabetes Care</span>
                    <span className="text-muted-foreground">25%</span>
                  </div>
                  <Progress value={25} className="h-1" />
                  
                  <div className="flex justify-between text-sm">
                    <span>Hypertension</span>
                    <span className="text-muted-foreground">20%</span>
                  </div>
                  <Progress value={20} className="h-1" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Button variant="outline" className="justify-start">
                <Users className="h-4 w-4 mr-2" />
                View All Patients
              </Button>
              <Button variant="outline" className="justify-start">
                <Package className="h-4 w-4 mr-2" />
                Prescribe Medicines
              </Button>
              <Button variant="outline" className="justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Follow-up
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks for healthcare providers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Video className="h-5 w-5" />
              Start Video Call
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Calendar className="h-5 w-5" />
              Block Time Slot
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Package className="h-5 w-5" />
              Update Inventory
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Users className="h-5 w-5" />
              Patient Records
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <MapPin className="h-5 w-5" />
              Hub Locations
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}