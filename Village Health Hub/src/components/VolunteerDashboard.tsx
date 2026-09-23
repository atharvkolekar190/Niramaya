import React from 'react';
import { Package, Calendar, Users, Star, TrendingUp, Clock, MapPin, Bell, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function VolunteerDashboard() {
  const stats = [
    {
      title: 'Medicines Stored',
      value: '24',
      change: '+3 this week',
      icon: Package,
      color: 'text-blue-600'
    },
    {
      title: 'Consultations Hosted',
      value: '8',
      change: '+2 this month',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Community Rating',
      value: '4.8',
      change: '12 reviews',
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      title: 'Space Utilization',
      value: '85%',
      change: 'High demand',
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ];

  const recentActivities = [
    {
      type: 'medicine',
      title: 'New medicines delivered',
      description: 'Paracetamol, Bandages added to inventory',
      time: '2 hours ago',
      icon: Package
    },
    {
      type: 'consultation',
      title: 'Dr. Sarah scheduled visit',
      description: 'General consultation on Friday 2 PM',
      time: '4 hours ago',
      icon: Calendar
    },
    {
      type: 'review',
      title: 'New review received',
      description: '5 stars from Maria - "Very helpful service"',
      time: '1 day ago',
      icon: Star
    },
    {
      type: 'booking',
      title: 'Space booking request',
      description: 'Emergency consultation needed for child',
      time: '2 days ago',
      icon: Users
    }
  ];

  const upcomingSchedule = [
    {
      time: '10:00 AM',
      event: 'Medicine Delivery',
      description: 'Monthly supply from district hospital',
      status: 'confirmed'
    },
    {
      time: '2:00 PM',
      event: 'Dr. Sarah Visit',
      description: 'General consultation and check-ups',
      status: 'confirmed'
    },
    {
      time: '4:00 PM',
      event: 'Community Health Talk',
      description: 'Hygiene and nutrition awareness',
      status: 'pending'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, Rajesh!</h1>
          <p className="text-muted-foreground">
            Your health hub in Kotagiri Village has helped 47 community members this month.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Medicines
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
        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest updates from your health hub</CardDescription>
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

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Friday, March 22, 2024</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSchedule.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="text-sm font-medium text-muted-foreground min-w-[60px]">
                  {item.time}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium">{item.event}</h4>
                    <Badge variant={item.status === 'confirmed' ? 'default' : 'secondary'} className="text-xs">
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Medicine Storage Status */}
        <Card>
          <CardHeader>
            <CardTitle>Medicine Storage Status</CardTitle>
            <CardDescription>Current inventory and capacity usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Storage Capacity</span>
                <span>17/20 medicines</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-2xl font-bold text-green-600">14</div>
                <div className="text-sm text-muted-foreground">In Stock</div>
              </div>
              <div className="text-center p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                <div className="text-2xl font-bold text-red-600">3</div>
                <div className="text-sm text-muted-foreground">Low Stock</div>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              View Full Inventory
            </Button>
          </CardContent>
        </Card>

        {/* Community Impact */}
        <Card>
          <CardHeader>
            <CardTitle>Community Impact</CardTitle>
            <CardDescription>Your contribution to village health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-48 mb-4">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1652234545887-314e7c56b836?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2luZSUyMHN0b3JhZ2UlMjBwaGFybWFjeXxlbnwxfHx8fDE3NTg4MDQzMzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Medicine storage"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Families Helped</span>
                <span className="font-semibold">23 families</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Emergency Cases</span>
                <span className="font-semibold">5 resolved</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Travel Time Saved</span>
                <span className="font-semibold">120+ hours</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Your hub has reduced average hospital travel time by 65% for your community!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks for managing your health hub</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Package className="h-5 w-5" />
              Update Inventory
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Calendar className="h-5 w-5" />
              Schedule Availability
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Users className="h-5 w-5" />
              Contact Patients
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <MapPin className="h-5 w-5" />
              Emergency Alert
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}