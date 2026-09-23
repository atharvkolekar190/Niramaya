import React, { useState } from 'react';
import { MapPin, Navigation, Phone, Star, Package, Clock, Filter, Search, Locate } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type UserRole = 'volunteer' | 'patient' | 'doctor' | null;

interface MapViewProps {
  userRole: UserRole;
}

export function MapView({ userRole }: MapViewProps) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const healthHubs = [
    {
      id: 1,
      name: 'Rajesh Kumar\'s Hub',
      host: 'Rajesh Kumar',
      location: 'Kotagiri Village',
      coordinates: { lat: 11.4102, lng: 76.8725 },
      distance: '0.8 km',
      rating: 4.8,
      reviews: 24,
      medicines: 24,
      capacity: 30,
      nextVisit: 'Today 2:00 PM',
      doctor: 'Dr. Sarah Johnson',
      available: true,
      facilities: ['Refrigerator', 'First aid', 'Separate room'],
      phone: '+91 98765 43210',
      emergencyContact: true
    },
    {
      id: 2,
      name: 'Priya Sharma\'s Hub',
      host: 'Priya Sharma',
      location: 'Hillview Colony',
      coordinates: { lat: 11.4156, lng: 76.8789 },
      distance: '1.2 km',
      rating: 4.6,
      reviews: 18,
      medicines: 18,
      capacity: 25,
      nextVisit: 'Tomorrow 10:00 AM',
      doctor: 'Dr. Michael Chen',
      available: true,
      facilities: ['Storage shelves', 'Internet connection'],
      phone: '+91 98765 43211',
      emergencyContact: false
    },
    {
      id: 3,
      name: 'Community Center Hub',
      host: 'Village Committee',
      location: 'Main Road',
      coordinates: { lat: 11.4089, lng: 76.8701 },
      distance: '2.1 km',
      rating: 4.9,
      reviews: 45,
      medicines: 45,
      capacity: 60,
      nextVisit: 'Friday 9:00 AM',
      doctor: 'Dr. Priya Patel',
      available: false,
      facilities: ['Refrigerator', 'Generator backup', 'Basic furniture'],
      phone: '+91 98765 43212',
      emergencyContact: true
    },
    {
      id: 4,
      name: 'Anita Devi\'s Hub',
      host: 'Anita Devi',
      location: 'Riverside Colony',
      coordinates: { lat: 11.4034, lng: 76.8656 },
      distance: '2.8 km',
      rating: 4.7,
      reviews: 12,
      medicines: 15,
      capacity: 20,
      nextVisit: 'Monday 11:00 AM',
      doctor: 'Dr. Sarah Johnson',
      available: true,
      facilities: ['First aid', 'Storage shelves'],
      phone: '+91 98765 43213',
      emergencyContact: false
    }
  ];

  const filteredHubs = healthHubs.filter(hub => {
    const matchesSearch = hub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hub.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hub.host.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' ||
                         (selectedFilter === 'available' && hub.available) ||
                         (selectedFilter === 'emergency' && hub.emergencyContact) ||
                         (selectedFilter === 'nearby' && parseFloat(hub.distance) <= 1.5);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Health Hub Map</h1>
          <p className="text-muted-foreground">
            Find health hubs, medicines, and healthcare services near you
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Locate className="h-4 w-4 mr-2" />
            Current Location
          </Button>
          <Button>
            <Navigation className="h-4 w-4 mr-2" />
            Navigate
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search hubs, locations, or hosts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Hubs</SelectItem>
                  <SelectItem value="available">Available Now</SelectItem>
                  <SelectItem value="nearby">Nearby (1.5km)</SelectItem>
                  <SelectItem value="emergency">Emergency Ready</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Placeholder */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Interactive Map</CardTitle>
            <CardDescription>Click on markers to view hub details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[600px] bg-slate-100 dark:bg-slate-800 rounded-lg relative overflow-hidden">
              {/* Mock Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900">
                <div className="absolute inset-0 opacity-20">
                  <svg width="100%" height="100%" className="text-muted-foreground">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>
              </div>

              {/* Mock Map Markers */}
              {filteredHubs.map((hub, index) => (
                <div
                  key={hub.id}
                  className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${20 + (index * 20)}%`,
                    top: `${30 + (index * 15)}%`
                  }}
                >
                  <div className={`relative group`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                      hub.available ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      <MapPin className="h-4 w-4 text-white" />
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <div className="bg-card border rounded-lg shadow-lg p-3 min-w-[200px]">
                        <h4 className="font-medium">{hub.name}</h4>
                        <p className="text-sm text-muted-foreground">{hub.location}</p>
                        <p className="text-sm">{hub.distance} away</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-sm">{hub.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Current Location Marker */}
              <div 
                className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: '50%', top: '50%' }}
              >
                <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-blue-600 font-medium">
                  You are here
                </div>
              </div>

              {/* Map Controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button size="sm" variant="outline" className="w-10 h-10 p-0">
                  +
                </Button>
                <Button size="sm" variant="outline" className="w-10 h-10 p-0">
                  -
                </Button>
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-card border rounded-lg p-3">
                <h4 className="font-medium text-sm mb-2">Legend</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Available Hub</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Busy Hub</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <span>Your Location</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hub List */}
        <Card>
          <CardHeader>
            <CardTitle>Nearby Hubs ({filteredHubs.length})</CardTitle>
            <CardDescription>Health hubs in your area</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
            {filteredHubs.map((hub) => (
              <div key={hub.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{hub.name}</h4>
                  <Badge variant={hub.available ? 'default' : 'secondary'}>
                    {hub.available ? 'Available' : 'Busy'}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">
                  Host: {hub.host}
                </p>
                
                <div className="flex items-center gap-4 text-sm mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{hub.location}</span>
                  </div>
                  <span className="text-muted-foreground">{hub.distance}</span>
                </div>

                <div className="flex items-center gap-4 text-sm mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span>{hub.rating} ({hub.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Package className="h-4 w-4 text-blue-500" />
                    <span>{hub.medicines}/{hub.capacity}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-sm mb-3">
                  <Clock className="h-4 w-4 text-green-500" />
                  <span>Next visit: {hub.nextVisit}</span>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-muted-foreground mb-1">Facilities:</p>
                  <div className="flex flex-wrap gap-1">
                    {hub.facilities.slice(0, 2).map((facility, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {facility}
                      </Badge>
                    ))}
                    {hub.facilities.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{hub.facilities.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" disabled={!hub.available}>
                    {userRole === 'patient' ? 'Book Visit' : 
                     userRole === 'doctor' ? 'Schedule' : 
                     'Contact Hub'}
                  </Button>
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Navigation className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Emergency Section */}
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Emergency Services</CardTitle>
          <CardDescription>Quick access to emergency healthcare</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="destructive" className="h-16 flex-col gap-1">
              <Phone className="h-5 w-5" />
              Emergency Call (108)
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-1">
              <MapPin className="h-5 w-5" />
              Nearest Hospital (12 km)
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-1">
              <Clock className="h-5 w-5" />
              Emergency Hub Available
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}