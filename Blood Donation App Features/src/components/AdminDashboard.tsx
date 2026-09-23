import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { BloodDropIcon } from './BloodDropIcon';
import { Users, AlertTriangle, CheckCircle, XCircle, TrendingUp, Calendar } from 'lucide-react';

export function AdminDashboard() {
  const systemStats = {
    totalDonors: 1247,
    totalPatients: 892,
    activeRequests: 23,
    completedDonations: 156,
    pendingApprovals: 8,
    criticalRequests: 3
  };

  const pendingDonors = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john@email.com',
      bloodType: 'O-',
      age: 28,
      phone: '+1234567890',
      registeredAt: '2025-01-10',
      status: 'Pending'
    },
    {
      id: 2,
      name: 'Maria Garcia',
      email: 'maria@email.com',
      bloodType: 'A+',
      age: 34,
      phone: '+1234567891',
      registeredAt: '2025-01-09',
      status: 'Pending'
    }
  ];

  const recentRequests = [
    {
      id: 1,
      patient: 'Emergency Case #1247',
      bloodType: 'O-',
      quantity: '2 units',
      urgency: 'Critical',
      hospital: 'St. Mary\'s Hospital',
      status: 'Active',
      responses: 12,
      timePosted: '2 hours ago'
    },
    {
      id: 2,
      patient: 'Sarah Johnson',
      bloodType: 'A+',
      quantity: '1 unit',
      urgency: 'Urgent',
      hospital: 'General Hospital',
      status: 'Fulfilled',
      responses: 5,
      timePosted: '6 hours ago'
    },
    {
      id: 3,
      patient: 'Michael Brown',
      bloodType: 'B-',
      quantity: '3 units',
      urgency: 'Moderate',
      hospital: 'City Medical Center',
      status: 'Active',
      responses: 2,
      timePosted: '1 day ago'
    }
  ];

  const inventoryData = [
    { bloodType: 'O+', current: 45, minimum: 20, status: 'Good' },
    { bloodType: 'O-', current: 8, minimum: 15, status: 'Low' },
    { bloodType: 'A+', current: 32, minimum: 20, status: 'Good' },
    { bloodType: 'A-', current: 12, minimum: 15, status: 'Low' },
    { bloodType: 'B+', current: 28, minimum: 15, status: 'Good' },
    { bloodType: 'B-', current: 6, minimum: 10, status: 'Critical' },
    { bloodType: 'AB+', current: 15, minimum: 10, status: 'Good' },
    { bloodType: 'AB-', current: 3, minimum: 8, status: 'Critical' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Good':
        return 'bg-green-100 text-green-800';
      case 'Low':
        return 'bg-orange-100 text-orange-800';
      case 'Critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Donors</p>
                <p className="text-xl font-bold">{systemStats.totalDonors}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Patients</p>
                <p className="text-xl font-bold">{systemStats.totalPatients}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active Requests</p>
                <p className="text-xl font-bold">{systemStats.activeRequests}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-xl font-bold">{systemStats.completedDonations}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl font-bold">{systemStats.pendingApprovals}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-xl font-bold">{systemStats.criticalRequests}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blood Inventory */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BloodDropIcon className="text-primary" size={20} />
              <span>Blood Inventory Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inventoryData.map((item) => (
                <div key={item.bloodType} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <BloodDropIcon className="text-primary" size={16} />
                    <div>
                      <p className="font-medium">{item.bloodType}</p>
                      <p className="text-sm text-muted-foreground">
                        Min: {item.minimum} units
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{item.current}</p>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Donor Approvals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Pending Donor Approvals</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingDonors.map((donor) => (
                <div key={donor.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium">{donor.name}</p>
                      <p className="text-sm text-muted-foreground">{donor.email}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-primary mb-1">
                        {donor.bloodType}
                      </Badge>
                      <p className="text-sm text-muted-foreground">Age: {donor.age}</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">
                    <p>Phone: {donor.phone}</p>
                    <p>Registered: {donor.registeredAt}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Review
                    </Button>
                    <Button size="sm" variant="destructive">
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Blood Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <span>Recent Blood Requests</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Blood Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Urgency</TableHead>
                <TableHead>Hospital</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Responses</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.patient}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <BloodDropIcon className="text-primary" size={12} />
                      <span>{request.bloodType}</span>
                    </div>
                  </TableCell>
                  <TableCell>{request.quantity}</TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        request.urgency === 'Critical' 
                          ? 'bg-red-100 text-red-800' 
                          : request.urgency === 'Urgent'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-blue-100 text-blue-800'
                      }
                    >
                      {request.urgency}
                    </Badge>
                  </TableCell>
                  <TableCell>{request.hospital}</TableCell>
                  <TableCell>
                    <Badge variant={request.status === 'Active' ? 'default' : 'secondary'}>
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{request.responses}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {request.timePosted}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        Manage
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}