import { useState, useEffect } from 'react';
import { ArrowLeft, Pill, MapPin, AlertCircle, CheckCircle, Bell, Search, Phone, RefreshCw, Truck } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { medicineService, type MedicineSearchResult } from '../services/medicineService';
import { useTranslation } from 'react-i18next';
import LanguageToggle from './LanguageToggle';
import { getMedicineTranslation, translateFDAData, getFieldLabels, medicineTranslations, type MedicineTranslation } from '../services/medicineTranslations';

interface MedicineTrackerProps {
  onBack: () => void;
}

export default function MedicineTracker({ onBack }: MedicineTrackerProps) {
  const { t } = useTranslation();
  
  // Fallback function for translations
  const translate = (key: string, fallback?: string) => {
    const translation = t(key);
    return translation === key ? (fallback || key) : translation;
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Nabha, Punjab');
  const [searchResults, setSearchResults] = useState<MedicineSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiConnected, setApiConnected] = useState(false);
  const [medicineLanguage, setMedicineLanguage] = useState('en');
  const [placingDeliveryFor, setPlacingDeliveryFor] = useState<any | null>(null);
  const [deliverySubmitting, setDeliverySubmitting] = useState(false);
  const [deliveryMessage, setDeliveryMessage] = useState<string | null>(null);

  // Check API connection on component mount and handle pre-search
  useEffect(() => {
    checkApiConnection();
    
    // Check for pre-search medicine term from URL parameter
    const preSearchTerm = localStorage.getItem('medicineSearchTerm');
    if (preSearchTerm) {
      console.log('MedicineTracker: Found pre-search term:', preSearchTerm);
      setSearchQuery(preSearchTerm);
      // Clear the stored term after using it
      localStorage.removeItem('medicineSearchTerm');
      // Trigger search after a short delay to ensure component is fully mounted
      setTimeout(() => {
        handleSearchWithTerm(preSearchTerm);
      }, 500);
    }
    
    // Listen for pharmacy inventory updates emitted by the pharmacist dashboard
    const onInventoryUpdated = () => {
      // If we have an active query, re-run it to fetch latest stock
      if (searchQuery.trim()) {
        handleSearch();
      }
    };
    window.addEventListener('inventory-updated', onInventoryUpdated as EventListener);
    return () => window.removeEventListener('inventory-updated', onInventoryUpdated as EventListener);
  }, []);

  const checkApiConnection = async () => {
    try {
        // Test API connection by fetching pharmacies
        await medicineService.getAllPharmacies();
        setApiConnected(true);
    } catch (error) {
      console.error('API connection check failed:', error);
      setApiConnected(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a medicine name');
      return;
    }

    setLoading(true);
    setError(null);
    setSearchResults(null);

    try {
      const results = await medicineService.searchMedicine(searchQuery);
      setSearchResults(results);
    } catch (error: any) {
      setError(error.message || 'Failed to search medicine. Please try again.');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search with a specific term (used for pre-search functionality)
  const handleSearchWithTerm = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setError('Please enter a medicine name');
      return;
    }

    setLoading(true);
    setError(null);
    setSearchResults(null);

    try {
      console.log('MedicineTracker: Searching for pre-filled medicine:', searchTerm);
      const results = await medicineService.searchMedicine(searchTerm);
      setSearchResults(results);
      console.log('MedicineTracker: Search results:', results);
    } catch (error: any) {
      setError(error.message || 'Failed to search medicine. Please try again.');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getAvailabilityColor = (quantity: number) => {
    if (quantity > 20) return 'bg-green-100 text-green-800';
    if (quantity > 5) return 'bg-yellow-100 text-yellow-800';
    if (quantity > 0) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getAvailabilityText = (quantity: number) => {
    if (quantity > 20) return 'In Stock';
    if (quantity > 5) return 'Limited';
    if (quantity > 0) return 'Low Stock';
    return 'Out of Stock';
  };

  const requestDelivery = async (pharmacy: any) => {
    setDeliveryMessage(null);
    setPlacingDeliveryFor(pharmacy);
    const customerName = localStorage.getItem('user_name') || 'Guest User';
    const customerPhone = localStorage.getItem('user_phone') || '';
    const address = localStorage.getItem('user_address') || location;

    setDeliverySubmitting(true);
    try {
      const res = await medicineService.requestDelivery({
        pharmacy_id: pharmacy.pharmacy_id || pharmacy.id || 0,
        pharmacy_name: pharmacy.pharmacy,
        medicine_name: searchResults?.medicine || searchQuery,
        quantity: Math.min(1, pharmacy.quantity || 1),
        customer_name: customerName,
        customer_phone: customerPhone,
        address,
      });
      setDeliveryMessage(res.message || 'Delivery request submitted');
    } catch (e: any) {
      setDeliveryMessage(e?.message || 'Failed to place delivery request');
    } finally {
      setDeliverySubmitting(false);
      setTimeout(() => setPlacingDeliveryFor(null), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2 hover:bg-orange-50"
            >
              <ArrowLeft className="h-4 w-4" />
              {translate('symptomChecker.backToHomepage', 'Back to Homepage')}
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
                <Pill className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl text-gray-900">Nabha Medicine Availability Tracker</h1>
            </div>
            <div className="w-24"></div> {/* Spacer to balance the layout */}
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
                Real-time data connected
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4" />
                Using offline mode
              </>
            )}
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl text-gray-900 mb-4">
            Find Your Medicines 
            <span className="text-orange-600"> Near You</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time medicine availability tracking across 173 villages. Never travel 
            long distances only to find your medicine is out of stock.
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-12 border-orange-200">
          <CardContent className="p-6">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm text-gray-700 mb-2">Search Medicine</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter medicine name (e.g., Paracetamol, Metformin, Aspirin)"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div className="w-48">
                <label className="block text-sm text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter your location"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="block text-sm text-gray-700 mb-2 opacity-0 select-none">Search</label>
                <Button 
                  onClick={handleSearch}
                  disabled={loading}
                  className="bg-orange-600 hover:bg-orange-700 px-8 h-[46px]"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Common Medicines Suggestions */}
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Common medicines:</p>
              <div className="flex flex-wrap gap-2">
                {['Paracetamol', 'Aspirin', 'Ibuprofen', 'Amoxicillin', 'Cetirizine', 'Omeprazole'].map((medicine: string) => (
                  <Button
                    key={medicine}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery(medicine);
                      handleSearch();
                    }}
                    className="text-xs"
                  >
                    {medicine}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Section */}
        {searchResults && (
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Medicine Information */}
            <div className="lg:col-span-3 mb-8">
              <Card className="border-blue-200 bg-blue-50/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-blue-700">
                      <Pill className="h-5 w-5" />
                      Medicine Information
                    </CardTitle>
                    <LanguageToggle
                      currentLanguage={medicineLanguage}
                      onLanguageChange={setMedicineLanguage}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {(() => {
                    // Use real FDA data from searchResults.info
                    const fdaInfo = searchResults.info;
                    
                    // Translate FDA data based on selected language
                    const displayInfo = translateFDAData(fdaInfo, medicineLanguage);
                    const labels = getFieldLabels(medicineLanguage);
                    
                    // Check if we have specific translations for this medicine
                    const medicineName = fdaInfo.generic_name?.toLowerCase() || '';
                    const hasTranslation = medicineTranslations[medicineName] && 
                                        medicineTranslations[medicineName][medicineLanguage as keyof MedicineTranslations];
                    
                    return (
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 mb-2">
                            {searchResults.medicine}
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <span className="font-medium text-gray-700">
                                {labels.generic_name}
                              </span>
                              <p className="text-gray-900 mt-1">{displayInfo.generic_name}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">
                                {labels.purpose}
                              </span>
                              <p className="text-gray-900 mt-1">{displayInfo.purpose}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">
                                {labels.dosage}
                              </span>
                              <p className="text-gray-900 mt-1 text-sm leading-relaxed">{displayInfo.dosage}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">
                                {labels.indications}
                              </span>
                              <p className="text-gray-900 mt-1 text-sm leading-relaxed">{displayInfo.indications}</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="space-y-3">
                            <div>
                              <span className="font-medium text-gray-700">
                                {labels.category}
                              </span>
                              <p className="text-gray-900 mt-1">{displayInfo.category}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">
                                {labels.warnings}
                              </span>
                              <p className="text-gray-900 mt-1 text-sm leading-relaxed bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                {displayInfo.warnings}
                              </p>
                            </div>
                            {fdaInfo.source && (
                              <div className="text-xs text-gray-500 mt-2">
                                <span className="font-medium">{labels.source}</span> {fdaInfo.source}
                              </div>
                            )}
                            {!hasTranslation && medicineLanguage !== 'en' && (
                              <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded-lg border border-blue-200 mt-2">
                                {labels.note}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            </div>

            {/* Pharmacy List */}
            <div className="lg:col-span-2">
              <h3 className="text-xl text-gray-900 mb-4">
                Available Pharmacies ({searchResults.availability.length})
              </h3>
              {searchResults.availability.length === 0 ? (
                <Card className="border-orange-200 bg-orange-50/50">
                  <CardContent className="p-6 text-center">
                    <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Stock Available</h4>
                    <p className="text-gray-600">
                      This medicine is currently out of stock in all nearby pharmacies.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {searchResults.availability.map((pharmacy: any, index: number) => (
                    <Card key={index} className="border-orange-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="text-gray-900 mb-1">{pharmacy.pharmacy}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {pharmacy.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {pharmacy.phone}
                              </span>
                            </div>
                          </div>
                          <Badge className={`${getAvailabilityColor(pharmacy.quantity)} px-3 py-1`}>
                            {getAvailabilityText(pharmacy.quantity)}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div>
                              <span className="text-2xl font-bold text-orange-600">{pharmacy.quantity}</span>
                              <span className="text-sm text-gray-600 ml-1">units available</span>
                            </div>
                            <div className="w-32">
                              <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>Stock Level</span>
                                <span>{Math.round((pharmacy.quantity / 50) * 100)}%</span>
                              </div>
                              <Progress 
                                value={(pharmacy.quantity / 50) * 100} 
                                className="h-2"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <MapPin className="h-3 w-3 mr-1" />
                              Directions
                            </Button>
                            <Button variant="outline" size="sm">
                              <Phone className="h-3 w-3 mr-1" />
                              Call
                            </Button>
                            <Button 
                              size="sm" 
                              className="bg-orange-600 hover:bg-orange-700 text-white"
                              onClick={() => requestDelivery(pharmacy)}
                              disabled={deliverySubmitting && placingDeliveryFor?.pharmacy === pharmacy.pharmacy}
                            >
                              <Truck className="h-3 w-3 mr-1" />
                              {deliverySubmitting && placingDeliveryFor?.pharmacy === pharmacy.pharmacy ? 'Placing...' : 'Deliver'}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <span className="text-xs text-gray-500">
                            Last updated: {new Date(pharmacy.last_updated).toLocaleString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Statistics */}
            <div>
              <h3 className="text-xl text-gray-900 mb-4">Availability Stats</h3>
              <div className="space-y-4">
                <Card className="border-green-200 bg-green-50/50">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {searchResults.availability.filter((p: any) => p.quantity > 0).length}
                      </div>
                      <p className="text-sm text-gray-600">Pharmacies with Stock</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-blue-200 bg-blue-50/50">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {searchResults.availability.reduce((sum: number, p: any) => sum + p.quantity, 0)}
                      </div>
                      <p className="text-sm text-gray-600">Total Units Available</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-orange-200 bg-orange-50/50">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {searchResults.availability.length > 0 
                          ? Math.round(searchResults.availability.reduce((sum: number, p: any) => sum + p.quantity, 0) / searchResults.availability.length)
                          : 0
                        }
                      </div>
                      <p className="text-sm text-gray-600">Average Stock per Pharmacy</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Delivery feedback */}
        {deliveryMessage && (
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardContent className="p-4 text-sm text-green-800">{deliveryMessage}</CardContent>
          </Card>
        )}

        {/* Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center border-orange-200 bg-orange-50/50">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Real-time Updates</h3>
              <p className="text-gray-600 text-sm">Live stock information from local pharmacies</p>
            </CardContent>
          </Card>

          <Card className="text-center border-blue-200 bg-blue-50/50">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Location Based</h3>
              <p className="text-gray-600 text-sm">Find medicines in your nearby area</p>
            </CardContent>
          </Card>

          <Card className="text-center border-green-200 bg-green-50/50">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Pill className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Medicine Info</h3>
              <p className="text-gray-600 text-sm">Detailed information and safety warnings</p>
            </CardContent>
          </Card>

          <Card className="text-center border-purple-200 bg-purple-50/50">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Stock Alerts</h3>
              <p className="text-gray-600 text-sm">Get notified when medicines are back in stock</p>
            </CardContent>
          </Card>
        </div>

        {/* Disclaimer */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-yellow-600 mt-1" />
              <div>
                <h4 className="text-yellow-800 mb-2">Important Notice</h4>
                <p className="text-yellow-700 text-sm">
                  Stock information is updated in real-time by local pharmacies. Please call the pharmacy 
                  before visiting to confirm availability. This information is for guidance only and should 
                  not replace professional medical advice.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}