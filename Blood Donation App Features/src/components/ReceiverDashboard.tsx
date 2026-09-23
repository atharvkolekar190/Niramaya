import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BloodDropIcon } from './BloodDropIcon';
import { MapPin, Clock, Users, AlertTriangle, Plus, Search } from 'lucide-react';

export function ReceiverDashboard() {
  const [showRequestForm, setShowRequestForm] = useState(false);

  const activeRequests = [
    {
      id: 1,
      bloodType: 'O-',
      quantity: '2 units',
      urgency: 'Critical',
      hospital: 'St. Mary\'s Hospital',
      postedAt: '2 hours ago',
      respondents: 12,
      status: 'Active'
    },
    {
      id: 2,
      bloodType: 'A+',
      quantity: '1 unit',
      urgency: 'Moderate',
      hospital: 'General Hospital',
      postedAt: '1 day ago',
      respondents: 3,
      status: 'Pending'
    }
  ];

  const nearbyDonors = [
    {
      id: 1,
      name: 'John Smith',
      bloodType: 'O-',
      distance: '1.2 km',
      rating: 4.9,
      lastDonation: '2 months ago',
      available: true
    },
    {
      id: 2,
      name: 'Maria Garcia',
      bloodType: 'O-',
      distance: '2.5 km',
      rating: 4.8,
      lastDonation: '3 months ago',
      available: true
    },
    {
      id: 3,
      name: 'David Wilson',
      bloodType: 'O+',
      distance: '3.1 km',
      rating: 4.7,
      lastDonation: '1 month ago',
      available: false
    }
  ];

  const bloodBanks = [
    {
      name: 'Central Blood Bank',
      distance: '0.8 km',
      oPos: 15,
      oNeg: 3,
      aPos: 8,
      aNeg: 2,
      bPos: 5,
      bNeg: 1,
      abPos: 3,
      abNeg: 0
    },
    {
      name: 'City Hospital Blood Center',
      distance: '2.1 km',
      oPos: 22,
      oNeg: 7,
      aPos: 12,
      aNeg: 4,
      bPos: 9,
      bNeg: 3,
      abPos: 5,
      abNeg: 1
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Active Requests</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Responses</p>
                <p className="text-2xl font-bold">15</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Nearby Donors</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BloodDropIcon className="text-primary" size={20} />
              <div>
                <p className="text-sm text-muted-foreground">Blood Banks</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Request Form or Active Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Plus className="h-5 w-5 text-primary" />
                <span>Blood Request</span>
              </span>
              <Button
                size="sm"
                onClick={() => setShowRequestForm(!showRequestForm)}
              >
                {showRequestForm ? 'View Requests' : 'New Request'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showRequestForm ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Blood Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Quantity</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Units needed" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 unit</SelectItem>
                        <SelectItem value="2">2 units</SelectItem>
                        <SelectItem value="3">3 units</SelectItem>
                        <SelectItem value="4">4+ units</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Urgency Level</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical (within hours)</SelectItem>
                      <SelectItem value="urgent">Urgent (within 24 hours)</SelectItem>
                      <SelectItem value="moderate">Moderate (within 3 days)</SelectItem>
                      <SelectItem value="routine">Routine (within a week)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Hospital/Location</label>
                  <Input placeholder="Enter hospital name or address" />
                </div>
                <div>
                  <label className="text-sm font-medium">Additional Notes</label>
                  <Textarea placeholder="Provide any additional information..." rows={3} />
                </div>
                <Button className="w-full">Submit Request</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {activeRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
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
                      <Badge variant={request.status === 'Active' ? 'default' : 'secondary'}>
                        {request.status}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">{request.quantity} • {request.hospital}</p>
                      <p className="text-sm text-muted-foreground">
                        {request.respondents} responses • {request.postedAt}
                      </p>
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <Button size="sm" variant="outline">View Details</Button>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-primary" />
              <span>Nearby Donors</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {nearbyDonors.map((donor) => (
              <div key={donor.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">{donor.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium">{donor.name}</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-primary">
                          {donor.bloodType}
                        </Badge>
                        <Badge variant={donor.available ? 'default' : 'secondary'}>
                          {donor.available ? 'Available' : 'Unavailable'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-muted-foreground">{donor.distance}</p>
                    <p className="text-yellow-600">★ {donor.rating}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Last donation: {donor.lastDonation}
                </p>
                <div className="flex space-x-2">
                  <Button size="sm" disabled={!donor.available}>
                    Contact
                  </Button>
                  <Button size="sm" variant="outline">
                    View Profile
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Blood Bank Inventory */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BloodDropIcon className="text-primary" size={20} />
            <span>Nearby Blood Banks</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bloodBanks.map((bank, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium">{bank.name}</h4>
                    <p className="text-sm text-muted-foreground flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{bank.distance} away</span>
                    </p>
                  </div>
                  <Button size="sm">Contact</Button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { type: 'O+', count: bank.oPos },
                    { type: 'O-', count: bank.oNeg },
                    { type: 'A+', count: bank.aPos },
                    { type: 'A-', count: bank.aNeg },
                    { type: 'B+', count: bank.bPos },
                    { type: 'B-', count: bank.bNeg },
                    { type: 'AB+', count: bank.abPos },
                    { type: 'AB-', count: bank.abNeg }
                  ].map((blood) => (
                    <div key={blood.type} className="text-center p-2 rounded bg-gray-50">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <BloodDropIcon className="text-primary" size={12} />
                        <span className="text-sm font-medium">{blood.type}</span>
                      </div>
                      <p className={`text-sm ${blood.count > 5 ? 'text-green-600' : blood.count > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                        {blood.count} units
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}