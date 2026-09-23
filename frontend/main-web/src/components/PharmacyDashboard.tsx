import { useState, useEffect } from 'react';
import { ArrowLeft, Pill, Plus, RefreshCw, AlertCircle, CheckCircle, Package, TrendingUp, Phone, MapPin, Building2, X, LogIn, LogOut, Eye, EyeOff, User, Lock, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { medicineService, type PharmacyData, type PharmacyInventory, type StockUpdate } from '../services/medicineService';
import LanguageSelector from './LanguageSelector';

interface PharmacyDashboardProps {
  onBack: () => void;
}

interface Pharmacist {
  id: number;
  name: string;
  email: string;
  pharmacy_id: number;
  phone: string;
  pharmacy_name: string;
  pharmacy_location: string;
}

export default function PharmacyDashboard({ onBack }: PharmacyDashboardProps) {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pharmacist, setPharmacist] = useState<Pharmacist | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    pharmacy_id: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Pharmacy management state
  const [pharmacies, setPharmacies] = useState<PharmacyData[]>([]);
  const [inventory, setInventory] = useState<PharmacyInventory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state for adding/updating stock
  const [medicineName, setMedicineName] = useState('');
  const [quantity, setQuantity] = useState<number>(0);
  const [isAddingStock, setIsAddingStock] = useState(false);

  // Check if pharmacist is already logged in
  useEffect(() => {
    const token = localStorage.getItem('pharmacist_token');
    if (token) {
      // Verify token and get pharmacist data
      verifyToken(token);
    }
  }, []);

  // Load pharmacies for registration
  useEffect(() => {
    if (showRegister) {
      loadPharmacies();
    }
  }, [showRegister]);

  // Load inventory when pharmacist is authenticated
  useEffect(() => {
    if (isAuthenticated && pharmacist?.pharmacy_id) {
      loadInventory(pharmacist.pharmacy_id);
    }
  }, [isAuthenticated, pharmacist]);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('http://localhost:5001/api/pharmacist/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPharmacist(data.pharmacist);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('pharmacist_token');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('pharmacist_token');
    }
  };

  const loadPharmacies = async () => {
    try {
      const response = await medicineService.getAllPharmacies();
      setPharmacies(response.pharmacies);
    } catch (error) {
      console.error('Error loading pharmacies:', error);
      setAuthError('Failed to load pharmacies. Please try again.');
    }
  };

  const loadInventory = async (pharmacyId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await medicineService.getPharmacistInventory(localStorage.getItem("pharmacist_token") || "");
      setInventory(data);
    } catch (error) {
      setError('Failed to load inventory');
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      const response = await fetch('http://localhost:5001/api/pharmacist/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('pharmacist_token', data.token);
        setPharmacist(data.pharmacist);
        setIsAuthenticated(true);
        setShowLogin(false);
        setLoginData({ email: '', password: '' });
        setSuccess('Login successful!');
      } else {
        setAuthError(data.error || 'Login failed');
      }
    } catch (error) {
      setAuthError('Network error. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      const response = await fetch('http://localhost:5001/api/pharmacist/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...registerData,
          pharmacy_id: registerData.pharmacy_id ? parseInt(registerData.pharmacy_id) : null
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('pharmacist_token', data.token);
        setPharmacist(data.pharmacist);
        setIsAuthenticated(true);
        setShowRegister(false);
        setRegisterData({
          name: '',
          email: '',
          password: '',
          pharmacy_id: '',
          phone: ''
        });
        setSuccess('Registration successful!');
      } else {
        setAuthError(data.error || 'Registration failed');
      }
    } catch (error) {
      setAuthError('Network error. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('pharmacist_token');
    setPharmacist(null);
    setIsAuthenticated(false);
    setInventory(null);
    setSuccess('Logged out successfully!');
  };

  const handleUpdateStock = async () => {
    if (!pharmacist?.pharmacy_id || !medicineName.trim() || quantity < 0) {
      setError('Please fill in all fields correctly');
      return;
    }

    setIsAddingStock(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('pharmacist_token');
      const response = await fetch('http://localhost:5001/api/pharmacist/update-stock', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          medicine_name: medicineName.trim(),
          quantity: quantity
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setMedicineName('');
        setQuantity(0);
        // Reload inventory
        loadInventory(pharmacist.pharmacy_id);
      } else {
        setError(data.error || 'Failed to update stock');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsAddingStock(false);
    }
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { status: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (quantity < 10) return { status: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    if (quantity < 50) return { status: 'Medium Stock', color: 'bg-blue-100 text-blue-800' };
    return { status: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  // If not authenticated, show login/register forms
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button
              onClick={onBack}
              variant="ghost"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Main
            </Button>
            <LanguageSelector />
          </div>

          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Pill className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                Pharmacist Portal
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Manage your pharmacy's medicine inventory
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Toggle between login and register */}
              <div className="flex space-x-4">
                <Button
                  onClick={() => {
                    setShowLogin(true);
                    setShowRegister(false);
                    setAuthError(null);
                  }}
                  variant={showLogin ? "default" : "outline"}
                  className="flex-1"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
                <Button
                  onClick={() => {
                    setShowRegister(true);
                    setShowLogin(false);
                    setAuthError(null);
                  }}
                  variant={showRegister ? "default" : "outline"}
                  className="flex-1"
                >
                  <User className="h-4 w-4 mr-2" />
                  Register
                </Button>
              </div>

              {/* Error Message */}
              {authError && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-red-800">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{authError}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Login Form */}
              {showLogin && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        placeholder="Enter your password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={authLoading}
                  >
                    {authLoading ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <LogIn className="h-4 w-4 mr-2" />
                    )}
                    {authLoading ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
              )}

              {/* Register Form */}
              {showRegister && (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="register-name">Full Name</Label>
                    <Input
                      id="register-name"
                      type="text"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        placeholder="Enter your password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="register-pharmacy">Select Pharmacy</Label>
                    <Select
                      value={registerData.pharmacy_id}
                      onValueChange={(value) => setRegisterData({ ...registerData, pharmacy_id: value })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a pharmacy" />
                      </SelectTrigger>
                      <SelectContent>
                        {pharmacies.map((pharmacy) => (
                          <SelectItem key={pharmacy.id} value={pharmacy.id.toString()}>
                            {pharmacy.name} - {pharmacy.address}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="register-phone">Phone (Optional)</Label>
                    <Input
                      id="register-phone"
                      type="tel"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={authLoading}
                  >
                    {authLoading ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <User className="h-4 w-4 mr-2" />
                    )}
                    {authLoading ? 'Registering...' : 'Register'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // If authenticated, show pharmacy dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="ghost"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Main
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Pharmacy Dashboard</h1>
              <p className="text-gray-600">
                Welcome, {pharmacist?.name} • {pharmacist?.pharmacy_name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

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

        {/* Pharmacy Info */}
        <Card className="mb-8 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Building2 className="h-5 w-5" />
              Pharmacy Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-800">{pharmacist?.pharmacy_name}</h3>
                <p className="text-gray-600 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {pharmacist?.pharmacy_location}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Pharmacist</p>
                <p className="font-semibold text-gray-800">{pharmacist?.name}</p>
                <p className="text-sm text-gray-600">{pharmacist?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add/Update Stock */}
        <Card className="mb-8 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Plus className="h-5 w-5" />
              Add/Update Medicine Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="medicine-name">Medicine Name</Label>
                <Input
                  id="medicine-name"
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  placeholder="Enter medicine name"
                />
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  placeholder="Enter quantity"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleUpdateStock}
                  disabled={isAddingStock || !medicineName.trim() || quantity < 0}
                  className="w-full"
                >
                  {isAddingStock ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  {isAddingStock ? 'Updating...' : 'Update Stock'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Inventory */}
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Package className="h-5 w-5" />
              Current Inventory
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading inventory...</span>
              </div>
            ) : inventory && inventory.inventory.length > 0 ? (
              <div className="space-y-4">
                {inventory.inventory.map((item, index) => {
                  const stockStatus = getStockStatus(item.quantity);
                  return (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{item.medicine_name}</h3>
                        <p className="text-sm text-gray-600">
                          Last updated: {new Date(item.last_updated).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-800">{item.quantity}</div>
                        <Badge className={stockStatus.color}>
                          {stockStatus.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No medicines in inventory yet.</p>
                <p className="text-sm">Add some medicines using the form above.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
