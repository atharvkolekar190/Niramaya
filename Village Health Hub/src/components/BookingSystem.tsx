import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, Phone, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

type UserRole = 'volunteer' | 'patient' | 'doctor' | null;

interface BookingSystemProps {
  userRole: UserRole;
}

export function BookingSystem({ userRole }: BookingSystemProps) {
  const [selectedTab, setSelectedTab] = useState('upcoming');

  const upcomingBookings = [
    {
      id: 1,
      type: 'consultation',
      title: 'General Health Check-up',
      patient: userRole === 'doctor' ? 'Maria Santos' : undefined,
      doctor: userRole !== 'doctor' ? 'Dr. Sarah Johnson' : undefined,
      hub: 'Rajesh Kumar\'s Hub',
      location: 'Kotagiri Village',
      date: '2024-03-22',
      time: '14:00',
      duration: '30 mins',
      status: 'confirmed',
      phone: '+91 98765 43210',
      notes: 'Regular check-up and blood pressure monitoring'
    },
    {
      id: 2,
      type: 'pickup',
      title: 'Medicine Collection',
      patient: userRole === 'doctor' ? 'John Kumar' : undefined,
      hub: 'Priya Sharma\'s Hub',
      location: 'Hillview Colony',
      date: '2024-03-23',
      time: '10:00',
      duration: '15 mins',
      status: 'pending',
      phone: '+91 98765 43211',
      medicines: ['Paracetamol 500mg', 'Vitamin D tablets'],
      notes: 'Prescription medicines ready for pickup'
    },
    {
      id: 3,
      type: 'consultation',
      title: 'Follow-up Visit',
      patient: userRole === 'doctor' ? 'Mrs. Sharma' : undefined,
      doctor: userRole !== 'doctor' ? 'Dr. Michael Chen' : undefined,
      hub: 'Community Center Hub',
      location: 'Main Road',
      date: '2024-03-25',
      time: '09:00',
      duration: '45 mins',
      status: 'confirmed',
      phone: '+91 98765 43212',
      notes: 'Diabetes management follow-up'
    }
  ];

  const pastBookings = [
    {
      id: 4,
      type: 'consultation',
      title: 'Health Consultation',
      patient: userRole === 'doctor' ? 'Ramesh Patel' : undefined,
      doctor: userRole !== 'doctor' ? 'Dr. Sarah Johnson' : undefined,
      hub: 'Rajesh Kumar\'s Hub',
      location: 'Kotagiri Village',
      date: '2024-03-18',
      time: '15:00',
      status: 'completed',
      rating: 5,
      feedback: 'Excellent consultation, very helpful advice'
    },
    {
      id: 5,
      type: 'pickup',
      title: 'Medicine Collection',
      hub: 'Priya Sharma\'s Hub',
      location: 'Hillview Colony',
      date: '2024-03-15',
      time: '11:30',
      status: 'completed',
      medicines: ['Cough syrup', 'Throat lozenges']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'completed':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Booking Management</h1>
          <p className="text-muted-foreground">
            {userRole === 'volunteer' ? 'Manage space bookings and schedule availability' :
             userRole === 'patient' ? 'Your appointments and medicine pickups' :
             userRole === 'doctor' ? 'Your scheduled visits and consultations' :
             'Manage your bookings and appointments'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar View
          </Button>
          <Button>
            <Clock className="h-4 w-4 mr-2" />
            New Booking
          </Button>
        </div>
      </div>

      {/* Booking Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="new">New Booking</TabsTrigger>
        </TabsList>

        {/* Upcoming Bookings */}
        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled consultations and medicine pickups</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingBookings.map((booking) => (
                <div key={booking.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{booking.title}</h4>
                        <Badge variant={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                        {booking.type === 'consultation' ? (
                          <Badge variant="outline">Consultation</Badge>
                        ) : (
                          <Badge variant="outline">Pickup</Badge>
                        )}
                      </div>
                      
                      {(booking.patient && userRole === 'doctor') && (
                        <p className="text-sm text-muted-foreground mb-1">
                          Patient: {booking.patient}
                        </p>
                      )}
                      
                      {(booking.doctor && userRole !== 'doctor') && (
                        <p className="text-sm text-muted-foreground mb-1">
                          Doctor: {booking.doctor}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{booking.hub}, {booking.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(booking.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{booking.time} ({booking.duration})</span>
                        </div>
                      </div>

                      {booking.medicines && (
                        <div className="mb-2">
                          <p className="text-sm font-medium">Medicines to collect:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {booking.medicines.map((medicine, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {medicine}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {booking.notes && (
                        <p className="text-sm text-muted-foreground">
                          Notes: {booking.notes}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusIcon(booking.status)}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t">
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                    <Button size="sm" variant="outline">
                      Reschedule
                    </Button>
                    <Button size="sm" variant="outline">
                      Cancel
                    </Button>
                    {booking.status === 'confirmed' && (
                      <Button size="sm">
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Past Bookings */}
        <TabsContent value="past" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Past Appointments</CardTitle>
              <CardDescription>Your completed and cancelled appointments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pastBookings.map((booking) => (
                <div key={booking.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{booking.title}</h4>
                        <Badge variant={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                      
                      {(booking.patient && userRole === 'doctor') && (
                        <p className="text-sm text-muted-foreground mb-1">
                          Patient: {booking.patient}
                        </p>
                      )}
                      
                      {(booking.doctor && userRole !== 'doctor') && (
                        <p className="text-sm text-muted-foreground mb-1">
                          Doctor: {booking.doctor}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{booking.hub}, {booking.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(booking.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{booking.time}</span>
                        </div>
                      </div>

                      {booking.medicines && (
                        <div className="mb-2">
                          <p className="text-sm font-medium">Medicines collected:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {booking.medicines.map((medicine, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {medicine}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {booking.rating && (
                        <div className="flex items-center gap-2 text-sm">
                          <span>Rating:</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-lg ${i < booking.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {booking.feedback && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Feedback: {booking.feedback}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t">
                    <Button size="sm" variant="outline">
                      Book Again
                    </Button>
                    {!booking.rating && userRole === 'patient' && (
                      <Button size="sm" variant="outline">
                        Leave Review
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* New Booking */}
        <TabsContent value="new" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Schedule New Appointment</CardTitle>
              <CardDescription>Book a consultation or medicine pickup</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Appointment Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultation">Doctor Consultation</SelectItem>
                        <SelectItem value="pickup">Medicine Pickup</SelectItem>
                        <SelectItem value="emergency">Emergency Visit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hub">Health Hub</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select hub" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rajesh">Rajesh Kumar's Hub - Kotagiri</SelectItem>
                        <SelectItem value="priya">Priya Sharma's Hub - Hillview</SelectItem>
                        <SelectItem value="community">Community Center - Main Road</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Preferred Date</Label>
                    <Input type="date" id="date" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time">Preferred Time</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                        <SelectItem value="11:00">11:00 AM</SelectItem>
                        <SelectItem value="14:00">2:00 PM</SelectItem>
                        <SelectItem value="15:00">3:00 PM</SelectItem>
                        <SelectItem value="16:00">4:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Visit</Label>
                  <Textarea
                    id="reason"
                    placeholder="Describe your symptoms or reason for the appointment"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Number</Label>
                  <Input
                    id="contact"
                    placeholder="Enter your phone number"
                    type="tel"
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1">
                    Book Appointment
                  </Button>
                  <Button type="button" variant="outline">
                    Save as Draft
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}