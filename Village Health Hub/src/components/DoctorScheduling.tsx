import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Video, Phone, Plus, Edit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';

type UserRole = 'volunteer' | 'patient' | 'doctor' | null;

interface DoctorSchedulingProps {
  userRole: UserRole;
}

export function DoctorScheduling({ userRole }: DoctorSchedulingProps) {
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [selectedView, setSelectedView] = useState('week');

  const weeklySchedule = [
    {
      day: 'Monday',
      date: '2024-03-22',
      slots: [
        {
          time: '09:00-12:00',
          hub: 'Rajesh Kumar\'s Hub',
          location: 'Kotagiri Village',
          type: 'consultation',
          patients: 6,
          status: 'confirmed',
          notes: 'General check-ups'
        },
        {
          time: '14:00-16:00',
          hub: 'Community Center',
          location: 'Main Road',
          type: 'consultation',
          patients: 4,
          status: 'confirmed',
          notes: 'Follow-up visits'
        }
      ]
    },
    {
      day: 'Tuesday',
      date: '2024-03-23',
      slots: [
        {
          time: '10:00-12:00',
          hub: 'Priya Sharma\'s Hub',
          location: 'Hillview Colony',
          type: 'consultation',
          patients: 3,
          status: 'confirmed',
          notes: 'Diabetes care'
        },
        {
          time: '15:00-17:00',
          hub: 'Telemedicine',
          location: 'Online',
          type: 'video',
          patients: 5,
          status: 'pending',
          notes: 'Remote consultations'
        }
      ]
    },
    {
      day: 'Wednesday',
      date: '2024-03-24',
      slots: [
        {
          time: '09:00-11:00',
          hub: 'Available',
          location: 'Open Slot',
          type: 'available',
          patients: 0,
          status: 'available',
          notes: 'Available for bookings'
        }
      ]
    },
    {
      day: 'Thursday',
      date: '2024-03-25',
      slots: [
        {
          time: '08:00-10:00',
          hub: 'Rajesh Kumar\'s Hub',
          location: 'Kotagiri Village',
          type: 'consultation',
          patients: 4,
          status: 'confirmed',
          notes: 'Emergency slot'
        },
        {
          time: '11:00-13:00',
          hub: 'Community Center',
          location: 'Main Road',
          type: 'consultation',
          patients: 7,
          status: 'confirmed',
          notes: 'Health screening'
        }
      ]
    },
    {
      day: 'Friday',
      date: '2024-03-26',
      slots: [
        {
          time: '14:00-18:00',
          hub: 'Multiple Hubs',
          location: 'Village Tour',
          type: 'mobile',
          patients: 12,
          status: 'confirmed',
          notes: 'Mobile clinic rounds'
        }
      ]
    },
    {
      day: 'Saturday',
      date: '2024-03-27',
      slots: [
        {
          time: '10:00-14:00',
          hub: 'Community Center',
          location: 'Main Road',
          type: 'workshop',
          patients: 25,
          status: 'confirmed',
          notes: 'Health awareness workshop'
        }
      ]
    },
    {
      day: 'Sunday',
      date: '2024-03-28',
      slots: [
        {
          time: 'Emergency Only',
          hub: 'On Call',
          location: 'Remote',
          type: 'emergency',
          patients: 0,
          status: 'on-call',
          notes: 'Emergency availability'
        }
      ]
    }
  ];

  const upcomingAppointments = [
    {
      id: 1,
      patient: 'Maria Santos',
      age: 34,
      condition: 'Hypertension follow-up',
      time: 'Today, 2:00 PM',
      duration: '30 mins',
      hub: 'Rajesh Kumar\'s Hub',
      type: 'follow-up',
      urgent: false
    },
    {
      id: 2,
      patient: 'John Kumar',
      age: 67,
      condition: 'Diabetes management',
      time: 'Today, 3:00 PM',
      duration: '45 mins',
      hub: 'Rajesh Kumar\'s Hub',
      type: 'consultation',
      urgent: false
    },
    {
      id: 3,
      patient: 'Mrs. Sharma',
      age: 72,
      condition: 'Chest pain',
      time: 'Tomorrow, 9:00 AM',
      duration: '30 mins',
      hub: 'Community Center',
      type: 'urgent',
      urgent: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'available':
        return 'outline';
      case 'on-call':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'consultation':
        return <Users className="h-4 w-4" />;
      case 'mobile':
        return <MapPin className="h-4 w-4" />;
      case 'emergency':
        return <Phone className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            {userRole === 'doctor' ? 'My Schedule' : 'Doctor Scheduling'}
          </h1>
          <p className="text-muted-foreground">
            {userRole === 'doctor' ? 'Manage your visits and consultations across health hubs' :
             userRole === 'volunteer' ? 'Doctor visit schedules for your hub' :
             userRole === 'patient' ? 'Available doctor consultation times' :
             'Schedule and manage doctor visits'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar View
          </Button>
          {userRole === 'doctor' && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Block Time
            </Button>
          )}
        </div>
      </div>

      {/* Schedule Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">18</div>
            <p className="text-sm text-muted-foreground">This Week's Appointments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">5</div>
            <p className="text-sm text-muted-foreground">Hub Visits</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">8</div>
            <p className="text-sm text-muted-foreground">Video Consultations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-orange-600">32</div>
            <p className="text-sm text-muted-foreground">Total Hours</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="week">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="week">Weekly View</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="availability">Set Availability</TabsTrigger>
        </TabsList>

        {/* Weekly Schedule */}
        <TabsContent value="week" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Weekly Schedule</CardTitle>
                  <CardDescription>March 22 - March 28, 2024</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Previous Week</Button>
                  <Button variant="outline" size="sm">Next Week</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
                {weeklySchedule.map((day, index) => (
                  <div key={index} className="space-y-2">
                    <div className="text-center p-2 bg-muted rounded-lg">
                      <h4 className="font-medium">{day.day}</h4>
                      <p className="text-sm text-muted-foreground">{new Date(day.date).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="space-y-2">
                      {day.slots.map((slot, slotIndex) => (
                        <div key={slotIndex} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1">
                              {getTypeIcon(slot.type)}
                              <span className="text-sm font-medium">{slot.time}</span>
                            </div>
                            <Badge variant={getStatusColor(slot.status)} className="text-xs">
                              {slot.status}
                            </Badge>
                          </div>
                          
                          <p className="text-sm font-medium mb-1">{slot.hub}</p>
                          <p className="text-xs text-muted-foreground mb-1">{slot.location}</p>
                          
                          {slot.patients > 0 && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                              <Users className="h-3 w-3" />
                              <span>{slot.patients} patients</span>
                            </div>
                          )}
                          
                          <p className="text-xs text-muted-foreground">{slot.notes}</p>
                          
                          {userRole === 'doctor' && slot.status !== 'available' && (
                            <div className="flex gap-1 mt-2">
                              <Button size="sm" variant="outline" className="text-xs h-6">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline" className="text-xs h-6">
                                Cancel
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appointments List */}
        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Individual patient consultations scheduled</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{appointment.patient}</h4>
                        <span className="text-sm text-muted-foreground">Age {appointment.age}</span>
                        {appointment.urgent && (
                          <Badge variant="destructive" className="text-xs">Urgent</Badge>
                        )}
                        <Badge variant="outline" className="text-xs">{appointment.type}</Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">{appointment.condition}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{appointment.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{appointment.hub}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t">
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4 mr-1" />
                      Call Patient
                    </Button>
                    <Button size="sm" variant="outline">
                      View Records
                    </Button>
                    <Button size="sm" variant="outline">
                      Reschedule
                    </Button>
                    <Button size="sm">
                      Start Consultation
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Set Availability */}
        <TabsContent value="availability" className="space-y-4">
          {userRole === 'doctor' ? (
            <Card>
              <CardHeader>
                <CardTitle>Set Your Availability</CardTitle>
                <CardDescription>Configure your working hours and hub preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Weekly Schedule</h4>
                    
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <div key={day} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Checkbox id={day} />
                          <Label htmlFor={day} className="min-w-[80px]">{day}</Label>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`${day}-start`} className="text-sm">From:</Label>
                          <Input
                            id={`${day}-start`}
                            type="time"
                            className="w-32"
                            defaultValue="09:00"
                          />
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`${day}-end`} className="text-sm">To:</Label>
                          <Input
                            id={`${day}-end`}
                            type="time"
                            className="w-32"
                            defaultValue="17:00"
                          />
                        </div>
                        
                        <Select>
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Select hub" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rajesh">Rajesh Kumar's Hub</SelectItem>
                            <SelectItem value="priya">Priya Sharma's Hub</SelectItem>
                            <SelectItem value="community">Community Center</SelectItem>
                            <SelectItem value="mobile">Mobile Clinic</SelectItem>
                            <SelectItem value="telemedicine">Telemedicine</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Hub Preferences</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="preferred-hubs">Preferred Hubs</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select preferred hubs" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Available Hubs</SelectItem>
                            <SelectItem value="nearby">Nearby Hubs Only</SelectItem>
                            <SelectItem value="custom">Custom Selection</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="max-distance">Maximum Travel Distance</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select distance" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">Within 5 km</SelectItem>
                            <SelectItem value="10">Within 10 km</SelectItem>
                            <SelectItem value="15">Within 15 km</SelectItem>
                            <SelectItem value="any">Any Distance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="special-notes">Special Instructions</Label>
                    <Textarea
                      id="special-notes"
                      placeholder="Any special requirements or notes about your availability"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" className="flex-1">
                      Save Availability
                    </Button>
                    <Button type="button" variant="outline">
                      Block Time Slot
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Doctor Availability</CardTitle>
                <CardDescription>View when doctors are available for consultations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Dr. Sarah Johnson</h4>
                      <p className="text-sm text-muted-foreground mb-3">General Practice</p>
                      <div className="space-y-1 text-sm">
                        <div>Mon-Wed: 9:00 AM - 5:00 PM</div>
                        <div>Thu-Fri: 10:00 AM - 4:00 PM</div>
                        <div>Weekend: Emergency only</div>
                      </div>
                      <Button size="sm" className="w-full mt-3">
                        Book Appointment
                      </Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Dr. Michael Chen</h4>
                      <p className="text-sm text-muted-foreground mb-3">Cardiology</p>
                      <div className="space-y-1 text-sm">
                        <div>Tue-Thu: 11:00 AM - 3:00 PM</div>
                        <div>Fri: 2:00 PM - 6:00 PM</div>
                        <div>Telemedicine available</div>
                      </div>
                      <Button size="sm" className="w-full mt-3">
                        Book Appointment
                      </Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Dr. Priya Patel</h4>
                      <p className="text-sm text-muted-foreground mb-3">Pediatrics</p>
                      <div className="space-y-1 text-sm">
                        <div>Mon-Fri: 10:00 AM - 2:00 PM</div>
                        <div>Sat: 9:00 AM - 12:00 PM</div>
                        <div>Children & infants</div>
                      </div>
                      <Button size="sm" className="w-full mt-3">
                        Book Appointment
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}