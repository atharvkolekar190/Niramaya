import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Package, 
  Plus, 
  Minus, 
  RefreshCw, 
  LogOut, 
  User,
  Store,
  MapPin,
  Phone,
  Search,
  Trash2,
  Moon,
  Sun,
  AlertTriangle,
  CheckCircle,
  X,
  ChevronDown
} from 'lucide-react';
import { medicineService } from '../services/medicineService';
import { authService } from '../services/authService';

interface InventoryItem {
  medicine_name: string;
  quantity: number;
  last_updated: string;
}

interface PharmacyInventory {
  pharmacy_id: number;
  pharmacy_name: string;
  pharmacy_location: string;
  inventory: InventoryItem[];
}

interface SimplifiedPharmacyDashboardProps {
  onLogout: () => void;
}

const SimplifiedPharmacyDashboard: React.FC<SimplifiedPharmacyDashboardProps> = ({ onLogout }) => {
  const [inventory, setInventory] = useState<PharmacyInventory | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newMedicine, setNewMedicine] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Enhanced Add New Medicine states
  const [medicineSuggestions, setMedicineSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState('tablets');
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{name?: string; quantity?: string}>({});
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkMedicines, setBulkMedicines] = useState<Array<{name: string; quantity: string; unit: string}>>([{name: '', quantity: '', unit: 'tablets'}]);

  const user = authService.getCurrentUser();
  const token = localStorage.getItem('pharmacist_token');

  useEffect(() => {
    loadInventory();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.suggestions-dropdown') && !target.closest('.unit-dropdown')) {
        setShowSuggestions(false);
        setShowUnitDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Helper functions
  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { status: 'critical', color: 'bg-red-500', text: 'Out of Stock' };
    if (quantity <= 5) return { status: 'low', color: 'bg-yellow-500', text: 'Low Stock' };
    return { status: 'sufficient', color: 'bg-green-500', text: 'In Stock' };
  };

  const getStockIcon = (quantity: number) => {
    if (quantity === 0) return <AlertTriangle className="h-4 w-4" />;
    if (quantity <= 5) return <AlertTriangle className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredInventory = inventory?.inventory.filter(item =>
    item.medicine_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Calculate total inventory count instead of value
  const totalInventoryCount = inventory?.inventory.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // Common medicine suggestions
  const commonMedicines = [
    'Paracetamol', 'Aspirin', 'Ibuprofen', 'Amoxicillin', 'Cetirizine',
    'Omeprazole', 'Metformin', 'Amlodipine', 'Atorvastatin', 'Losartan',
    'Metoprolol', 'Lisinopril', 'Diclofenac', 'Ciprofloxacin', 'Azithromycin',
    'Pantoprazole', 'Tramadol', 'Codeine', 'Morphine', 'Insulin'
  ];

  const unitOptions = [
    'tablets', 'strips', 'bottles', 'vials', 'syrups', 'capsules', 'injections', 'patches'
  ];

  const loadInventory = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await medicineService.getPharmacistInventory(token);
      setInventory(data);
    } catch (err) {
      console.error('Failed to load inventory:', err);
      setError('Failed to load inventory. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (medicineName: string, newQuantity: number) => {
    if (!token) return;
    
    try {
      setUpdating(medicineName);
      await medicineService.updatePharmacistStock(token, medicineName, newQuantity);
      await loadInventory(); // Refresh inventory
      showToast(`${medicineName} stock updated to ${newQuantity}`, 'success');
    } catch (err) {
      console.error('Failed to update stock:', err);
      setError(`Failed to update ${medicineName} stock. Please try again.`);
      showToast(`Failed to update ${medicineName} stock`, 'error');
    } finally {
      setUpdating(null);
    }
  };

  // Validation functions
  const validateMedicineName = (name: string) => {
    if (!name.trim()) return 'Medicine name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    return '';
  };

  const validateQuantity = (quantity: string) => {
    if (!quantity.trim()) return 'Quantity is required';
    const num = parseInt(quantity);
    if (isNaN(num)) return 'Please enter a valid number';
    if (num < 0) return 'Quantity cannot be negative';
    if (num > 10000) return 'Quantity seems too high';
    return '';
  };

  const handleMedicineNameChange = (value: string) => {
    setNewMedicine(value);
    setValidationErrors(prev => ({ ...prev, name: validateMedicineName(value) }));
    
    // Show suggestions
    if (value.length > 1) {
      const filtered = commonMedicines.filter(med => 
        med.toLowerCase().includes(value.toLowerCase())
      );
      setMedicineSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleQuantityChange = (value: string) => {
    setNewQuantity(value);
    setValidationErrors(prev => ({ ...prev, quantity: validateQuantity(value) }));
  };

  const addNewMedicine = async () => {
    const nameError = validateMedicineName(newMedicine);
    const quantityError = validateQuantity(newQuantity);
    
    if (nameError || quantityError) {
      setValidationErrors({ name: nameError, quantity: quantityError });
      return;
    }

    setIsAdding(true);
    try {
      await updateStock(newMedicine.trim(), parseInt(newQuantity));
      
      // Success animation
      setShowSuccessAnimation(true);
      setTimeout(() => setShowSuccessAnimation(false), 2000);
      
      // Clear fields
      setNewMedicine('');
      setNewQuantity('');
      setSelectedUnit('tablets');
      setValidationErrors({});
      setShowSuggestions(false);
      
      showToast(`${newMedicine.trim()} added successfully`, 'success');
    } catch (err) {
      console.error('Failed to add medicine:', err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !validationErrors.name && !validationErrors.quantity) {
      addNewMedicine();
    }
  };

  const addBulkMedicine = async (medicine: {name: string; quantity: string; unit: string}) => {
    const nameError = validateMedicineName(medicine.name);
    const quantityError = validateQuantity(medicine.quantity);
    
    if (nameError || quantityError) return false;

    try {
      await updateStock(medicine.name.trim(), parseInt(medicine.quantity));
      return true;
    } catch (err) {
      console.error('Failed to add medicine:', err);
      return false;
    }
  };

  const addAllBulkMedicines = async () => {
    setIsAdding(true);
    let successCount = 0;
    
    for (const medicine of bulkMedicines) {
      if (medicine.name.trim() && medicine.quantity.trim()) {
        const success = await addBulkMedicine(medicine);
        if (success) successCount++;
      }
    }
    
    if (successCount > 0) {
      showToast(`${successCount} medicines added successfully`, 'success');
      setBulkMedicines([{name: '', quantity: '', unit: 'tablets'}]);
      await loadInventory();
    }
    
    setIsAdding(false);
  };

  const addBulkRow = () => {
    setBulkMedicines([...bulkMedicines, {name: '', quantity: '', unit: 'tablets'}]);
  };

  const removeBulkRow = (index: number) => {
    if (bulkMedicines.length > 1) {
      setBulkMedicines(bulkMedicines.filter((_, i) => i !== index));
    }
  };

  const deleteMedicine = async (medicineName: string) => {
    if (!token) return;
    
    try {
      await medicineService.updatePharmacistStock(token, medicineName, 0);
      await loadInventory();
      showToast(`${medicineName} removed from inventory`, 'success');
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error('Failed to delete medicine:', err);
      showToast(`Failed to remove ${medicineName}`, 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('pharmacist_token');
    authService.logout();
    onLogout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50'}`} style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Clean Top Navigation Bar */}
      <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                  <Store className={`h-6 w-6 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`} />
                </div>
                <div>
                  <h1 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Pharmacy Dashboard</h1>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Inventory Management</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>{user?.name}</p>
                <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{inventory?.pharmacy_name}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setDarkMode(!darkMode)}
                  variant="outline"
                  size="sm"
                  className={`h-8 w-8 p-0 ${darkMode ? 'border-slate-600 hover:bg-slate-700 text-slate-300' : 'border-slate-300 hover:bg-slate-50 text-slate-700'}`}
                >
                  {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className={`h-8 px-3 ${darkMode ? 'border-slate-600 hover:bg-slate-700 text-slate-300' : 'border-slate-300 hover:bg-slate-50 text-slate-700'}`}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toast Notification */}
        {toast && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            <div className="flex items-center space-x-2">
              {toast.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
              <span>{toast.message}</span>
            </div>
          </div>
        )}

        {error && (
          <div className={`mb-6 p-4 ${darkMode ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200'} border rounded-lg`}>
            <p className={darkMode ? 'text-red-200' : 'text-red-800'}>{error}</p>
            <Button
              onClick={() => setError(null)}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Dismiss
            </Button>
          </div>
        )}

        {/* Professional Metric Cards */}
        {inventory && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Total Medicines */}
            <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border rounded-lg p-4 hover:shadow-sm transition-shadow`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Total Medicines</p>
                  <p className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {inventory.inventory.length}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                  <Package className={`h-5 w-5 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`} />
                </div>
              </div>
            </div>
            
            {/* Total Stock */}
            <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border rounded-lg p-4 hover:shadow-sm transition-shadow`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Total Stock</p>
                  <p className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {totalInventoryCount.toLocaleString()}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                  <Package className={`h-5 w-5 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`} />
                </div>
              </div>
            </div>
            
            {/* Low Stock Items */}
            <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border rounded-lg p-4 hover:shadow-sm transition-shadow`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Low Stock Items</p>
                  <p className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {inventory.inventory.filter(item => item.quantity <= 5).length}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                  <AlertTriangle className={`h-5 w-5 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pharmacy Info */}
        {inventory && (
          <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border rounded-lg mb-6`}>
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Pharmacy Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Store className={`h-4 w-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>{inventory.pharmacy_name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className={`h-4 w-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                  <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{inventory.pharmacy_location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Package className={`h-4 w-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                  <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{inventory.inventory.length} medicines</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add New Medicine Section */}
        <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border rounded-lg mb-8`}>
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="flex justify-between items-center">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Add New Medicine
              </h2>
              <Button
                onClick={() => setBulkMode(!bulkMode)}
                variant="outline"
                size="sm"
                className={`h-8 px-3 ${darkMode ? 'border-slate-600 hover:bg-slate-700 text-slate-300' : 'border-slate-300 hover:bg-slate-50 text-slate-700'}`}
              >
                {bulkMode ? 'Single Add' : 'Bulk Add'}
              </Button>
            </div>
          </div>
          <div className="p-6">
            {!bulkMode ? (
              // Single Add Mode
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div className="md:col-span-2">
                    <Label htmlFor="medicine-name" className={`block mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Medicine Name
                    </Label>
                    <div className="relative">
                      <Input
                        id="medicine-name"
                        value={newMedicine}
                        onChange={(e) => handleMedicineNameChange(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter medicine name"
                        className={`w-full ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'} ${
                          validationErrors.name ? 'border-red-500' : ''
                        }`}
                      />
                      {showSuggestions && medicineSuggestions.length > 0 && (
                        <div className={`suggestions-dropdown absolute z-10 w-full mt-1 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} border rounded-md shadow-lg`}>
                          {medicineSuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setNewMedicine(suggestion);
                                setShowSuggestions(false);
                                setValidationErrors(prev => ({ ...prev, name: '' }));
                              }}
                              className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
                                darkMode ? 'hover:bg-gray-600 text-white' : 'text-gray-900'
                              }`}
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {validationErrors.name && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="quantity" className={`block mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Quantity
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={newQuantity}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter quantity"
                      min="0"
                      className={`w-full ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'} ${
                        validationErrors.quantity ? 'border-red-500' : ''
                      }`}
                    />
                    {validationErrors.quantity && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.quantity}</p>
                    )}
                  </div>

                  <div>
                    <Label className={`block mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Unit</Label>
                    <div className="relative unit-dropdown">
                      <Button
                        variant="outline"
                        onClick={() => setShowUnitDropdown(!showUnitDropdown)}
                        className={`w-full justify-between ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                      >
                        {selectedUnit}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      {showUnitDropdown && (
                        <div className={`absolute z-10 w-full mt-1 ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-300'} border rounded-md shadow-lg`}>
                          {unitOptions.map((unit) => (
                            <button
                              key={unit}
                              onClick={() => {
                                setSelectedUnit(unit);
                                setShowUnitDropdown(false);
                              }}
                              className={`w-full text-left px-3 py-2 hover:bg-slate-100 ${
                                darkMode ? 'hover:bg-slate-600 text-white' : 'text-slate-900'
                              }`}
                            >
                              {unit}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Button
                      onClick={addNewMedicine}
                      disabled={!newMedicine.trim() || !newQuantity.trim() || !!validationErrors.name || !!validationErrors.quantity || isAdding}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 font-medium transition-colors"
                    >
                      {isAdding ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : showSuccessAnimation ? (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      ) : (
                        <Plus className="h-4 w-4 mr-2" />
                      )}
                      {isAdding ? 'Adding...' : 'Add Medicine'}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              // Bulk Add Mode
              <div className="space-y-4">
                <div className="space-y-3">
                  {bulkMedicines.map((medicine, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
                      <div className="md:col-span-2">
                        <Input
                          placeholder="Medicine name"
                          value={medicine.name}
                          onChange={(e) => {
                            const newMedicines = [...bulkMedicines];
                            newMedicines[index].name = e.target.value;
                            setBulkMedicines(newMedicines);
                          }}
                          className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          placeholder="Quantity"
                          value={medicine.quantity}
                          onChange={(e) => {
                            const newMedicines = [...bulkMedicines];
                            newMedicines[index].quantity = e.target.value;
                            setBulkMedicines(newMedicines);
                          }}
                          min="0"
                          className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                        />
                      </div>
                      <div>
                        <select
                          value={medicine.unit}
                          onChange={(e) => {
                            const newMedicines = [...bulkMedicines];
                            newMedicines[index].unit = e.target.value;
                            setBulkMedicines(newMedicines);
                          }}
                          className={`w-full px-3 py-2 border rounded-md ${
                            darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                          }`}
                        >
                          {unitOptions.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex space-x-1">
                        {bulkMedicines.length > 1 && (
                          <Button
                            onClick={() => removeBulkRow(index)}
                            variant="destructive"
                            size="sm"
                            className="p-2 bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          onClick={addBulkRow}
                          variant="outline"
                          size="sm"
                          className="p-2"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    onClick={() => setBulkMode(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={addAllBulkMedicines}
                    disabled={isAdding || bulkMedicines.every(m => !m.name.trim() || !m.quantity.trim())}
                  >
                    {isAdding ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    {isAdding ? 'Adding...' : `Add All (${bulkMedicines.filter(m => m.name.trim() && m.quantity.trim()).length})`}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Inventory List */}
        <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border rounded-lg`}>
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Current Inventory
              </h2>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search medicines..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200'}`}
                  />
                </div>
                <Button
                  onClick={loadInventory}
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  className={`h-8 px-3 ${darkMode ? 'border-slate-600 hover:bg-slate-700 text-slate-300' : 'border-slate-300 hover:bg-slate-50 text-slate-700'}`}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
          <div className="p-6">
            {filteredInventory.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className={`text-slate-600 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {searchTerm ? 'No medicines found matching your search' : 'No medicines in inventory'}
                </p>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {searchTerm ? 'Try a different search term' : 'Add your first medicine above'}
                </p>
              </div>
            ) : (
              <div className="space-y-0">
                {filteredInventory.map((item, index) => {
                  const stockStatus = getStockStatus(item.quantity);
                  return (
                    <div key={index} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-slate-200 last:border-b-0 hover:bg-slate-50 transition-colors ${
                      darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'
                    }`}>
                      <div className="flex-1 mb-4 sm:mb-0">
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className={`text-base font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            {item.medicine_name}
                          </h3>
                          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color} text-white`}>
                            {getStockIcon(item.quantity)}
                            <span>{stockStatus.text}</span>
                          </div>
                        </div>
                        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          Last updated: {new Date(item.last_updated).toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStock(item.medicine_name, Math.max(0, item.quantity - 1))}
                            disabled={updating === item.medicine_name}
                            className={`h-8 w-8 p-0 ${darkMode ? 'border-slate-600 hover:bg-slate-700 text-slate-300' : 'border-slate-300 hover:bg-slate-50 text-slate-600'}`}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          
                          <div className={`min-w-[60px] text-center px-3 py-1 rounded text-sm font-medium ${darkMode ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900'}`}>
                            {updating === item.medicine_name ? (
                              <RefreshCw className="h-3 w-3 animate-spin mx-auto" />
                            ) : (
                              item.quantity
                            )}
                          </div>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStock(item.medicine_name, item.quantity + 1)}
                            disabled={updating === item.medicine_name}
                            className={`h-8 w-8 p-0 ${darkMode ? 'border-slate-600 hover:bg-slate-700 text-slate-300' : 'border-slate-300 hover:bg-slate-50 text-slate-600'}`}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="w-20 sm:w-24">
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const newQty = parseInt(e.target.value);
                              if (!isNaN(newQty) && newQty >= 0) {
                                updateStock(item.medicine_name, newQty);
                              }
                            }}
                            disabled={updating === item.medicine_name}
                            min="0"
                            className={`text-center ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200'}`}
                          />
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowDeleteConfirm(item.medicine_name)}
                          className={`h-8 w-8 p-0 ${darkMode ? 'border-red-600 hover:bg-red-900/20 text-red-400' : 'border-red-300 hover:bg-red-50 text-red-600'}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} max-w-md w-full mx-4`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Confirm Delete
              </h3>
              <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Are you sure you want to remove <strong>{showDeleteConfirm}</strong> from your inventory?
              </p>
              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowDeleteConfirm(null)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => deleteMedicine(showDeleteConfirm)}
                  variant="destructive"
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimplifiedPharmacyDashboard;
