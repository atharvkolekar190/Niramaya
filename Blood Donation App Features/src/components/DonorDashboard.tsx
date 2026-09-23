import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { BloodDropIcon } from './BloodDropIcon';
import { Calendar, Clock, MapPin, Users, Heart, AlertTriangle } from 'lucide-react';

export function DonorDashboard() {
  const [isAvailable, setIsAvailable] = useState(true);

  const upcomingAppointments = [
    {
      id: 1,
      date: '2025-01-15',
      time: '10:00 AM',
      location: 'City Blood Center',
      type: 'Regular Donation'
    },
    {
      id: 2,
      date: '2025-01-20',
      time: '2:00 PM',
      location: 'Hospital Emergency',
      type: 'Emergency Request'
    }
  ];

  const urgentRequests = [
    {
      id: 1,
      bloodType: 'O-',
      patient: 'Emergency Case #1247',
      hospital: 'St. Mary\'s Hospital',
      distance: '2.3 km',
      urgency: 'Critical',
      timePosted: '15 min ago'
    },
    {
      id: 2,
      bloodType: 'A+',
      patient: 'Sarah Johnson',
      hospital: 'General Hospital',
      distance: '5.7 km',
      urgency: 'Urgent',
      timePosted: '1 hour ago'
    }
  ];

  const donationHistory = [
    { date: '2024-12-15', location: 'City Blood Center', amount: '450ml' },
    { date: '2024-10-10', location: 'Mobile Unit', amount: '450ml' },
    { date: '2024-08-05', location: 'Hospital Drive', amount: '450ml' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BloodDropIcon className="text-primary" size={20} />
              <div>
                <p className="text-sm text-muted-foreground">Total Donations</p>
                <p className="text-2xl font-bold">18</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Lives Saved</p>
                <p className="text-2xl font-bold">54</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Next Eligible</p>
                <p className="text-2xl font-bold">42</p>
                <p className="text-xs text-muted-foreground">days</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-sm font-medium">{isAvailable ? 'Yes' : 'No'}</p>
              </div>
              <Switch 
                checked={isAvailable} 
                onCheckedChange={setIsAvailable}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgent Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <span>Urgent Requests Near You</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {urgentRequests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BloodDropIcon className="text-primary" size={16} />
                    <Badge variant="outline" className="text-primary">
                      {request.bloodType}
                    </Badge>
                    <Badge 
                      className={
                        request.urgency === 'Critical' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-orange-100 text-orange-800'
                      }
                    >
                      {request.urgency}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">{request.timePosted}</span>
                </div>
                <div>
                  <p className="font-medium">{request.patient}</p>
                  <p className="text-sm text-muted-foreground flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{request.hospital} • {request.distance}</span>
                  </p>
                </div>
                <Button size="sm" className="w-full">
                  Respond to Request
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Upcoming Appointments</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge 
                    className={
                      appointment.type === 'Emergency Request' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }
                  >
                    {appointment.type}
                  </Badge>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{appointment.time}</span>
                  </div>
                </div>
                <p className="font-medium">{appointment.date}</p>
                <p className="text-sm text-muted-foreground flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{appointment.location}</span>
                </p>
                <div className="flex space-x-2 mt-3">
                  <Button size="sm" variant="outline">
                    Reschedule
                  </Button>
                  <Button size="sm" variant="destructive">
                    Cancel
                  </Button>
                </div>
              </div>
            ))}
            <Button className="w-full" variant="outline">
              Schedule New Appointment
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Donation History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BloodDropIcon className="text-primary" size={20} />
            <span>Recent Donation History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {donationHistory.map((donation, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div className="flex items-center space-x-3">
                  <BloodDropIcon className="text-primary" size={16} />
                  <div>
                    <p className="font-medium">{donation.date}</p>
                    <p className="text-sm text-muted-foreground">{donation.location}</p>
                  </div>
                </div>
                <Badge variant="outline">{donation.amount}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}