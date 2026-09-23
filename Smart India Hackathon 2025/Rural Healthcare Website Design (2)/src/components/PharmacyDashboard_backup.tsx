import { useState, useEffect } from 'react';
import { ArrowLeft, Pill, Plus, RefreshCw, AlertCircle, CheckCircle, Package, TrendingUp, Phone, MapPin, Building2, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { medicineService, type PharmacyData, type PharmacyInventory, type StockUpdate } from '../services/medicineService';
import LanguageSelector from './LanguageSelector';

interface PharmacyDashboardProps {
  onBack: () => void;
}

export default function PharmacyDashboard({ onBack }: PharmacyDashboardProps) {
  const [selectedPharmacy, setSelectedPharmacy] = useState<number | null>(null);
  const [pharmacies, setPharmacies] = useState<PharmacyData[]>([]);
  const [inventory, setInventory] = useState<PharmacyInventory | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingPharmacies, setLoadingPharmacies] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [apiConnected, setApiConnected] = useState(false);

  // Form state for adding/updating stock
  const [medicineName, setMedicineName] = useState('');
  const [quantity, setQuantity] = useState<number>(0);
  const [isAddingStock, setIsAddingStock] = useState(false);

  // Form state for adding new pharmacy
  const [showAddPharmacy, setShowAddPharmacy] = useState(false);
  const [newPharmacy, setNewPharmacy] = useState({
    name: '',
    location: '',
    latitude: '',
    longitude: '',
    phone: '',
    address: ''
  });
  const [addingPharmacy, setAddingPharmacy] = useState(false);

  // Check API connection and load pharmacies on component mount
  useEffect(() => {
    loadPharmacies();
  }, []);

  // Load inventory when pharmacy is selected
  useEffect(() => {
    if (selectedPharmacy) {
      loadInventory(selectedPharmacy);
    }
  }, [selectedPharmacy]);

  const loadPharmacies = async () => {
    try {
      setLoadingPharmacies(true);
      setError(null);
      // Test API connection by fetching pharmacies
      const pharmacyData = await medicineService.getAllPharmacies();
      setApiConnected(true);
      setPharmacies(pharmacyData.pharmacies);
      if (pharmacyData.pharmacies && pharmacyData.pharmacies.length > 0 && !selectedPharmacy) {
        setSelectedPharmacy(pharmacyData.pharmacies[0].id);
      }
    } catch (error) {
      console.error('Failed to load pharmacies:', error);
      setApiConnected(false);
      setError('Failed to connect to the system. Please check your connection.');
    } finally {
      setLoadingPharmacies(false);
    }
  };

  const loadInventory = async (pharmacyId: number) => {
    setLoading(true);
    setError(null);
    try {
      const inventoryData = await medicineService.getPharmacyInventory(pharmacyId);
      setInventory(inventoryData);
    } catch (error: any) {
      setError(error.message || 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async () => {
    if (!selectedPharmacy || !medicineName.trim() || quantity < 0) {
      setError('Please fill all fields correctly');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const stockUpdate: StockUpdate = {
        pharmacy_id: selectedPharmacy,
        medicine_name: medicineName.trim(),
        quantity: quantity
      };

      await medicineService.updatePharmacyStock(stockUpdate.pharmacy_id, stockUpdate.medicine_name, stockUpdate.quantity);
      setSuccess('Stock updated successfully!');
      
      // Reload inventory
      await loadInventory(selectedPharmacy);
      // Notify other dashboards (patients) to refresh availability immediately
      try {
        window.dispatchEvent(new CustomEvent('inventory-updated', {
          detail: {
            pharmacyId: selectedPharmacy,
            medicine: stockUpdate.medicine_name,
            quantity: stockUpdate.quantity,
            updatedAt: Date.now(),
          }
        }));
      } catch (e) {
        // no-op in non-browser contexts
      }
      
      // Reset form
      setMedicineName('');
      setQuantity(0);
      setIsAddingStock(false);
    } catch (error: any) {
      setError(error.message || 'Failed to update stock');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPharmacy = async () => {
    if (!newPharmacy.name.trim() || !newPharmacy.location.trim()) {
      setError('Name and location are required');
      return;
    }

    setAddingPharmacy(true);
    setError(null);
    setSuccess(null);

    try {
      const pharmacyData = {
        name: newPharmacy.name.trim(),
        location: newPharmacy.location.trim(),
        latitude: newPharmacy.latitude ? parseFloat(newPharmacy.latitude) : null,
        longitude: newPharmacy.longitude ? parseFloat(newPharmacy.longitude) : null,
        phone: newPharmacy.phone.trim(),
        address: newPharmacy.address.trim()
      };

      const response = await fetch('http://localhost:5001/api/pharmacies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pharmacyData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Pharmacy added successfully!');
        setNewPharmacy({
          name: '',
          location: '',
          latitude: '',
          longitude: '',
          phone: '',
          address: ''
        });
        setShowAddPharmacy(false);
        // Reload pharmacies list
        await loadPharmacies();
        // Select the newly added pharmacy
        if (result.pharmacy) {
          setSelectedPharmacy(result.pharmacy.id);
        }
      } else {
        setError(result.error || 'Failed to add pharmacy');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to add pharmacy');
    } finally {
      setAddingPharmacy(false);
    }
  };

  const getStockStatus = (quantity: number) => {
    if (quantity > 20) return { status: 'High', color: 'bg-green-100 text-green-800' };
    if (quantity > 5) return { status: 'Medium', color: 'bg-yellow-100 text-yellow-800' };
    if (quantity > 0) return { status: 'Low', color: 'bg-orange-100 text-orange-800' };
    return { status: 'Out of Stock', color: 'bg-red-100 text-red-800' };
  };

  const selectedPharmacyData = pharmacies?.find(p => p.id === selectedPharmacy);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2 hover:bg-blue-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Homepage
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Pill className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl text-gray-900">Pharmacy Dashboard</h1>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* API Status */}
        <div className="mb-6">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
            apiConnected 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {apiConnected ? (
              <>
                <CheckCircle className="h-4 w-4" />
                System connected
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4" />
                Offline mode
              </>
            )}
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl text-gray-900 mb-4">
            Manage Your 
            <span className="text-blue-600"> Medicine Stock</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time inventory management for pharmacies in Nabha and surrounding villages.
            Keep your stock updated to help patients find medicines easily.
          </p>
        </div>

        {/* Pharmacy Selection */}
        <Card className="mb-8 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Package className="h-5 w-5" />
                Select Pharmacy
              </CardTitle>
              <Button
                onClick={() => setShowAddPharmacy(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Pharmacy
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loadingPharmacies ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-600">Loading pharmacies...</span>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {pharmacies?.map((pharmacy) => (
                <Card 
                  key={pharmacy.id}
                  className={`cursor-pointer transition-all ${
                    selectedPharmacy === pharmacy.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedPharmacy(pharmacy.id)}
                >
                  <CardContent className="p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{pharmacy.name}</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {pharmacy.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {pharmacy.phone}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error and Success Messages */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {success && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">{success}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Pharmacy Modal */}
        {showAddPharmacy && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md border-blue-200 bg-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Building2 className="h-5 w-5" />
                    Add New Pharmacy
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddPharmacy(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pharmacy Name *
                    </label>
                    <input
                      type="text"
                      value={newPharmacy.name}
                      onChange={(e) => setNewPharmacy({...newPharmacy, name: e.target.value})}
                      placeholder="e.g., ABC Medical Store"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      value={newPharmacy.location}
                      onChange={(e) => setNewPharmacy({...newPharmacy, location: e.target.value})}
                      placeholder="e.g., Near Civil Hospital"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Latitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={newPharmacy.latitude}
                        onChange={(e) => setNewPharmacy({...newPharmacy, latitude: e.target.value})}
                        placeholder="30.3760"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Longitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={newPharmacy.longitude}
                        onChange={(e) => setNewPharmacy({...newPharmacy, longitude: e.target.value})}
                        placeholder="76.1530"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={newPharmacy.phone}
                      onChange={(e) => setNewPharmacy({...newPharmacy, phone: e.target.value})}
                      placeholder="+91-9876543210"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      value={newPharmacy.address}
                      onChange={(e) => setNewPharmacy({...newPharmacy, address: e.target.value})}
                      placeholder="Full address of the pharmacy"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleAddPharmacy}
                      disabled={addingPharmacy || !newPharmacy.name.trim() || !newPharmacy.location.trim()}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      {addingPharmacy ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Pharmacy
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowAddPharmacy(false)}
                      disabled={addingPharmacy}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedPharmacyData && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Current Inventory */}
            <div className="lg:col-span-2">
              <Card className="border-blue-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-blue-700">
                      <Package className="h-5 w-5" />
                      Current Inventory - {selectedPharmacyData.name}
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadInventory(selectedPharmacy)}
                      disabled={loading}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
                      <p className="text-gray-600">Loading inventory...</p>
                    </div>
                  ) : inventory && inventory.inventory && inventory.inventory.length > 0 ? (
                    <div className="space-y-4">
                      {inventory.inventory.map((item, index) => {
                        const stockStatus = getStockStatus(item.quantity);
                        return (
                          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{item.medicine_name}</h4>
                              <p className="text-sm text-gray-600">
                                Last updated: {new Date(item.last_updated).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900">{item.quantity}</div>
                                <div className="text-sm text-gray-600">units</div>
                              </div>
                              <Badge className={`${stockStatus.color} px-3 py-1`}>
                                {stockStatus.status}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No inventory data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Update Stock Form */}
            <div>
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <Plus className="h-5 w-5" />
                    Update Stock
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Medicine Name
                      </label>
                      <input
                        type="text"
                        value={medicineName}
                        onChange={(e) => setMedicineName(e.target.value)}
                        placeholder="e.g., Paracetamol, Aspirin"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                        placeholder="Enter quantity"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <Button
                      onClick={handleUpdateStock}
                      disabled={loading || !medicineName.trim() || quantity < 0}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Update Stock
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="mt-6 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-700">
                    <TrendingUp className="h-5 w-5" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {inventory && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {inventory?.inventory?.length || 0}
                        </div>
                        <p className="text-sm text-gray-600">Total Medicines</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {inventory?.inventory?.filter(item => item.quantity > 0).length || 0}
                        </div>
                        <p className="text-sm text-gray-600">In Stock</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {inventory?.inventory?.filter(item => item.quantity === 0).length || 0}
                        </div>
                        <p className="text-sm text-gray-600">Out of Stock</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          <Card className="text-center border-blue-200 bg-blue-50/50">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Real-time Updates</h3>
              <p className="text-gray-600 text-sm">Stock changes reflect immediately</p>
            </CardContent>
          </Card>

          <Card className="text-center border-green-200 bg-green-50/50">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Easy Management</h3>
              <p className="text-gray-600 text-sm">Simple interface for stock updates</p>
            </CardContent>
          </Card>

          <Card className="text-center border-purple-200 bg-purple-50/50">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Analytics</h3>
              <p className="text-gray-600 text-sm">Track inventory levels and trends</p>
            </CardContent>
          </Card>

          <Card className="text-center border-orange-200 bg-orange-50/50">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Patient Help</h3>
              <p className="text-gray-600 text-sm">Help patients find medicines easily</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
