import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BloodDropIcon } from './BloodDropIcon';
import { MapPin, Navigation, Filter, Users } from 'lucide-react';

export function MapView() {
  const [selectedBloodType, setSelectedBloodType] = useState<string>('all');
  const [showType, setShowType] = useState<string>('both');

  const donors = [
    { id: 1, name: 'John Smith', bloodType: 'O-', lat: 40.7128, lng: -74.0060, distance: '1.2 km', available: true },
    { id: 2, name: 'Maria Garcia', bloodType: 'A+', lat: 40.7589, lng: -73.9851, distance: '2.5 km', available: true },
    { id: 3, name: 'David Wilson', bloodType: 'B+', lat: 40.7505, lng: -73.9934, distance: '1.8 km', available: false },
    { id: 4, name: 'Sarah Johnson', bloodType: 'O+', lat: 40.7282, lng: -74.0776, distance: '3.1 km', available: true },
  ];

  const bloodBanks = [
    { id: 1, name: 'Central Blood Bank', lat: 40.7580, lng: -73.9855, distance: '0.8 km', inventory: { 'O+': 15, 'O-': 3, 'A+': 8 } },
    { id: 2, name: 'City Hospital Blood Center', lat: 40.7505, lng: -73.9934, distance: '2.1 km', inventory: { 'O+': 22, 'O-': 7, 'A+': 12 } },
    { id: 3, name: 'Emergency Blood Hub', lat: 40.7282, lng: -74.0776, distance: '3.5 km', inventory: { 'O+': 18, 'O-': 5, 'A+': 10 } },
  ];

  const filteredDonors = selectedBloodType === 'all' 
    ? donors 
    : donors.filter(donor => donor.bloodType === selectedBloodType);

  return (
    <div className="p-6 space-y-6">
      {/* Map Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span>Find Donors & Blood Banks</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedBloodType} onValueChange={setSelectedBloodType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Select value={showType} onValueChange={setShowType}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="both">Donors & Banks</SelectItem>
                <SelectItem value="donors">Donors Only</SelectItem>
                <SelectItem value="banks">Banks Only</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm">
              <Navigation className="h-4 w-4 mr-1" />
              My Location
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <Card className="lg:col-span-2">
          <CardContent className="p-0">
            <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
              {/* Mock Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
                <div className="absolute inset-0 opacity-20">
                  <svg width="100%" height="100%">
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>
              </div>

              {/* Mock Locations */}
              {(showType === 'both' || showType === 'donors') && filteredDonors.map((donor, index) => (
                <div
                  key={donor.id}
                  className="absolute"
                  style={{
                    left: `${20 + index * 15}%`,
                    top: `${30 + index * 10}%`
                  }}
                >
                  <div className={`w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                    donor.available ? 'bg-green-500' : 'bg-gray-400'
                  }`}>
                    <Users className="h-3 w-3 text-white" />
                  </div>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs shadow-lg whitespace-nowrap">
                    <BloodDropIcon className="inline text-primary mr-1" size={10} />
                    {donor.bloodType}
                  </div>
                </div>
              ))}

              {(showType === 'both' || showType === 'banks') && bloodBanks.map((bank, index) => (
                <div
                  key={bank.id}
                  className="absolute"
                  style={{
                    left: `${60 + index * 15}%`,
                    top: `${20 + index * 15}%`
                  }}
                >
                  <div className="w-8 h-8 bg-primary rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                    <BloodDropIcon className="text-white" size={16} />
                  </div>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs shadow-lg whitespace-nowrap">
                    Blood Bank
                  </div>
                </div>
              ))}

              {/* Your Location */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-blue-600">
                  You
                </div>
              </div>

              <div className="absolute bottom-4 left-4 text-xs text-muted-foreground">
                Interactive map showing nearby donors and blood banks
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Nearby Locations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(showType === 'both' || showType === 'donors') && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  Available Donors
                </h4>
                <div className="space-y-2">
                  {filteredDonors.filter(d => d.available).map((donor) => (
                    <div key={donor.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm">{donor.name}</p>
                        <Badge variant="outline" className="text-primary">
                          {donor.bloodType}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {donor.distance}
                        </p>
                        <Button size="sm" className="text-xs px-2 py-1">
                          Contact
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(showType === 'both' || showType === 'banks') && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center">
                  <BloodDropIcon className="text-primary" size={16} />
                  <span className="ml-1">Blood Banks</span>
                </h4>
                <div className="space-y-2">
                  {bloodBanks.map((bank) => (
                    <div key={bank.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-sm">{bank.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {bank.distance}
                        </p>
                      </div>
                      <div className="flex space-x-1 mb-2">
                        {Object.entries(bank.inventory).map(([type, count]) => (
                          <div key={type} className="text-center bg-gray-50 rounded px-1 py-1">
                            <div className="text-xs flex items-center justify-center">
                              <BloodDropIcon className="text-primary" size={8} />
                              <span className="ml-1">{type}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{count}</p>
                          </div>
                        ))}
                      </div>
                      <Button size="sm" className="w-full text-xs">
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}