import React, { useState } from 'react';
import { Package, AlertTriangle, Plus, Search, Filter, Calendar, Thermometer } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

type UserRole = 'volunteer' | 'patient' | 'doctor' | null;

interface MedicineInventoryProps {
  userRole: UserRole;
}

export function MedicineInventory({ userRole }: MedicineInventoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const medicines = [
    {
      id: 1,
      name: 'Paracetamol 500mg',
      category: 'Pain Relief',
      quantity: 45,
      unit: 'tablets',
      minStock: 20,
      expiryDate: '2024-12-15',
      batchNumber: 'PAR240315',
      manufacturer: 'PharmaCorp',
      location: 'Shelf A1',
      temperature: 'Room Temperature',
      status: 'in-stock',
      lastUpdated: '2024-03-20',
      prescriptionRequired: false
    },
    {
      id: 2,
      name: 'Insulin Injection',
      category: 'Diabetes',
      quantity: 8,
      unit: 'vials',
      minStock: 5,
      expiryDate: '2024-08-20',
      batchNumber: 'INS240220',
      manufacturer: 'DiabetesCare',
      location: 'Refrigerator R1',
      temperature: 'Refrigerated (2-8°C)',
      status: 'low-stock',
      lastUpdated: '2024-03-21',
      prescriptionRequired: true
    },
    {
      id: 3,
      name: 'Cough Syrup',
      category: 'Respiratory',
      quantity: 2,
      unit: 'bottles',
      minStock: 5,
      expiryDate: '2024-06-10',
      batchNumber: 'CSY240110',
      manufacturer: 'RespiMed',
      location: 'Shelf B2',
      temperature: 'Room Temperature',
      status: 'critical',
      lastUpdated: '2024-03-19',
      prescriptionRequired: false
    },
    {
      id: 4,
      name: 'Vitamin D Tablets',
      category: 'Supplements',
      quantity: 0,
      unit: 'tablets',
      minStock: 30,
      expiryDate: '2025-01-15',
      batchNumber: 'VTD250115',
      manufacturer: 'HealthPlus',
      location: 'Shelf C1',
      temperature: 'Room Temperature',
      status: 'out-of-stock',
      lastUpdated: '2024-03-18',
      prescriptionRequired: false
    },
    {
      id: 5,
      name: 'Blood Pressure Tablets',
      category: 'Cardiovascular',
      quantity: 1,
      unit: 'packets',
      minStock: 3,
      expiryDate: '2024-04-30',
      batchNumber: 'BPT240130',
      manufacturer: 'CardioPharm',
      location: 'Shelf A2',
      temperature: 'Room Temperature',
      status: 'expiring-soon',
      lastUpdated: '2024-03-21',
      prescriptionRequired: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'default';
      case 'low-stock':
        return 'secondary';
      case 'critical':
        return 'destructive';
      case 'out-of-stock':
        return 'outline';
      case 'expiring-soon':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical':
      case 'out-of-stock':
      case 'expiring-soon':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'low-stock':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Package className="h-4 w-4 text-green-500" />;
    }
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 60;
  };

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         medicine.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || medicine.category.toLowerCase() === filterCategory.toLowerCase();
    
    const matchesStatus = filterStatus === 'all' || medicine.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stockSummary = {
    total: medicines.length,
    inStock: medicines.filter(m => m.status === 'in-stock').length,
    lowStock: medicines.filter(m => m.status === 'low-stock' || m.status === 'critical').length,
    outOfStock: medicines.filter(m => m.status === 'out-of-stock').length,
    expiringSoon: medicines.filter(m => isExpiringSoon(m.expiryDate)).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Medicine Inventory</h1>
          <p className="text-muted-foreground">
            {userRole === 'volunteer' ? 'Manage your hub\'s medicine inventory' :
             userRole === 'patient' ? 'Available medicines in nearby hubs' :
             userRole === 'doctor' ? 'Medicine availability across hubs' :
             'Track and manage medicine inventory'}
          </p>
        </div>
        <div className="flex gap-3">
          {(userRole === 'volunteer' || userRole === 'doctor') && (
            <>
              <Button variant="outline">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Low Stock Alert
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Medicine
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Stock Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{stockSummary.total}</div>
            <p className="text-sm text-muted-foreground">Total Medicines</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">{stockSummary.inStock}</div>
            <p className="text-sm text-muted-foreground">In Stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stockSummary.lowStock}</div>
            <p className="text-sm text-muted-foreground">Low Stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-red-600">{stockSummary.outOfStock}</div>
            <p className="text-sm text-muted-foreground">Out of Stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-orange-600">{stockSummary.expiringSoon}</div>
            <p className="text-sm text-muted-foreground">Expiring Soon</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search medicines by name or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="pain relief">Pain Relief</SelectItem>
                  <SelectItem value="diabetes">Diabetes</SelectItem>
                  <SelectItem value="respiratory">Respiratory</SelectItem>
                  <SelectItem value="cardiovascular">Cardiovascular</SelectItem>
                  <SelectItem value="supplements">Supplements</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                  <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medicine List */}
      <Card>
        <CardHeader>
          <CardTitle>Medicine List ({filteredMedicines.length})</CardTitle>
          <CardDescription>Current inventory status and details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredMedicines.map((medicine) => (
            <div key={medicine.id} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{medicine.name}</h4>
                    <Badge variant={getStatusColor(medicine.status)}>
                      {medicine.status.replace('-', ' ')}
                    </Badge>
                    {medicine.prescriptionRequired && (
                      <Badge variant="outline" className="text-xs">
                        Prescription Required
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    Category: {medicine.category} • Batch: {medicine.batchNumber}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                    <div>
                      <span className="font-medium">Quantity: </span>
                      <span className={medicine.quantity <= medicine.minStock ? 'text-red-600' : 'text-green-600'}>
                        {medicine.quantity} {medicine.unit}
                      </span>
                      <span className="text-muted-foreground"> (Min: {medicine.minStock})</span>
                    </div>
                    <div>
                      <span className="font-medium">Expiry: </span>
                      <span className={isExpiringSoon(medicine.expiryDate) ? 'text-orange-600' : 'text-muted-foreground'}>
                        {new Date(medicine.expiryDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Location: </span>
                      <span className="text-muted-foreground">{medicine.location}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Manufacturer: </span>
                      <span className="text-muted-foreground">{medicine.manufacturer}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Thermometer className="h-4 w-4 text-blue-500" />
                      <span className="text-muted-foreground">{medicine.temperature}</span>
                    </div>
                  </div>

                  {medicine.quantity <= medicine.minStock && (
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Stock Level</span>
                        <span>{Math.round((medicine.quantity / medicine.minStock) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(medicine.quantity / medicine.minStock) * 100} 
                        className="h-2"
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  {getStatusIcon(medicine.status)}
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t">
                {userRole === 'patient' ? (
                  <>
                    <Button size="sm" disabled={medicine.quantity === 0}>
                      Request Medicine
                    </Button>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="outline">
                      Update Stock
                    </Button>
                    <Button size="sm" variant="outline">
                      Edit Details
                    </Button>
                    {medicine.status === 'critical' || medicine.status === 'out-of-stock' ? (
                      <Button size="sm">
                        Reorder Now
                      </Button>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Add Medicine Form (for volunteers and doctors) */}
      {(userRole === 'volunteer' || userRole === 'doctor') && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Medicine</CardTitle>
            <CardDescription>Add a new medicine to the inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="medicineName">Medicine Name</Label>
                  <Input id="medicineName" placeholder="Enter medicine name" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pain-relief">Pain Relief</SelectItem>
                      <SelectItem value="diabetes">Diabetes</SelectItem>
                      <SelectItem value="respiratory">Respiratory</SelectItem>
                      <SelectItem value="cardiovascular">Cardiovascular</SelectItem>
                      <SelectItem value="supplements">Supplements</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" type="number" placeholder="0" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tablets">Tablets</SelectItem>
                      <SelectItem value="capsules">Capsules</SelectItem>
                      <SelectItem value="bottles">Bottles</SelectItem>
                      <SelectItem value="vials">Vials</SelectItem>
                      <SelectItem value="packets">Packets</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="minStock">Minimum Stock</Label>
                  <Input id="minStock" type="number" placeholder="0" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input id="expiryDate" type="date" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="batchNumber">Batch Number</Label>
                  <Input id="batchNumber" placeholder="Enter batch number" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input id="manufacturer" placeholder="Enter manufacturer name" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Storage Location</Label>
                  <Input id="location" placeholder="e.g., Shelf A1, Refrigerator R1" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature Requirements</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select temperature requirement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="room">Room Temperature</SelectItem>
                    <SelectItem value="cool">Cool & Dry Place</SelectItem>
                    <SelectItem value="refrigerated">Refrigerated (2-8°C)</SelectItem>
                    <SelectItem value="frozen">Frozen (-15°C to -25°C)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special handling instructions or notes"
                  rows={3}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  Add Medicine
                </Button>
                <Button type="button" variant="outline">
                  Save as Draft
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}