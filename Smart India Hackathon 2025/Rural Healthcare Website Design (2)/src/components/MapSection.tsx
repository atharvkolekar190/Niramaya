import { Map, List, MapPin } from 'lucide-react';
import { useState, memo, useEffect } from 'react';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { InteractiveMap, facilities } from './InteractiveMap';
import { FilterPanel } from './FilterPanel';
import { HealthcareStats } from './HealthcareStats';

function MapSection() {
  const [language, setLanguage] = useState<'en' | 'hi' | 'pa'>('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [, setSelectedFacility] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [activeTab, setActiveTab] = useState('map');
  const [selectedFromListId, setSelectedFromListId] = useState<number | undefined>(undefined);
  
  const [filters, setFilters] = useState({
    specialty: 'all',
    type: 'all', 
    availability: 'all',
    isGovernment: undefined as boolean | undefined
  });

  // Dynamic stats from map
  const [stats, setStats] = useState({
    nearbyCount: 0,
    availableDoctors: 0,
    emergencyServices: 0
  });

  // Listen for online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-6 text-gray-900">
            Healthcare Network <span className="text-green-600">Map</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Interactive visualization of Nabha's healthcare infrastructure and 
            the 173 villages that will benefit from our telemedicine solution.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Sidebar - Improved Balance and Spacing */}
          <div className="lg:col-span-4 space-y-5 lg:space-y-6">
            <FilterPanel
              language={language}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filters={filters}
              onFilterChange={setFilters}
              onLanguageChange={setLanguage}
            />
            
            <HealthcareStats
              language={language}
              isOnline={isOnline}
              nearbyCount={stats.nearbyCount}
              availableDoctors={stats.availableDoctors}
              emergencyServices={stats.emergencyServices}
            />
          </div>

          {/* Main Content - Map and Tabs */}
          <div className="lg:col-span-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList className="grid w-auto grid-cols-2 bg-gray-100 p-1 rounded-lg">
                  <TabsTrigger 
                    value="map" 
                    className="flex items-center gap-2 px-4 py-2 rounded-md transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <Map className="w-4 h-4" />
                    Interactive Map
                  </TabsTrigger>
                  <TabsTrigger 
                    value="list" 
                    className="flex items-center gap-2 px-4 py-2 rounded-md transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <List className="w-4 h-4" />
                    Facilities List
                  </TabsTrigger>
                </TabsList>
                
                {/* Near Me Button - Now in Map Toolbar */}
                <button 
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  onClick={() => {
                    // This would trigger geolocation and center map on user location
                    console.log('Near Me functionality would be implemented here');
                  }}
                >
                  <MapPin className="w-4 h-4" />
                  Near Me
                </button>
              </div>

              <TabsContent value="map" className="mt-0">
                <Card className="h-[400px] lg:h-[650px] overflow-hidden shadow-lg border-2">
                  <InteractiveMap
                    language={language}
                    filters={filters}
                    searchQuery={searchQuery}
                    onFacilitySelect={setSelectedFacility}
                    onStatsChange={setStats}
                    selectedFacilityId={selectedFromListId}
                  />
                </Card>
              </TabsContent>

              <TabsContent value="list" className="mt-6">
                <Card className="p-0 overflow-hidden">
                  <div className="p-4 border-b bg-gray-50">
                    <h3 className="font-medium">Healthcare Facilities List</h3>
                  </div>
                  <div className="divide-y max-h-[600px] overflow-y-auto">
                    {facilities
                      .filter((f) => {
                        const matchesType = filters.type === 'all' || f.type === filters.type;
                        const matchesAvailability = filters.availability === 'all' || f.availability === filters.availability;
                        const matchesGov = filters.isGovernment === undefined || f.isGovernment === filters.isGovernment;
                        const matchesSpec = filters.specialty === 'all' || f.specialties.includes(filters.specialty);
                        const nameToSearch = language === 'hi' ? f.nameHindi : language === 'pa' ? f.namePunjabi : f.name;
                        const matchesSearch = !searchQuery || nameToSearch.toLowerCase().includes(searchQuery.toLowerCase()) || f.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
                        return matchesType && matchesAvailability && matchesGov && matchesSpec && matchesSearch;
                      })
                      .map((f) => (
                        <div key={f.id} className="p-4 flex items-start justify-between gap-4 hover:bg-gray-50">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{f.type === 'pharmacy' ? '💊' : f.type === 'emergency' ? '🚑' : '🏥'}</span>
                              <h4 className="font-medium">{language === 'hi' ? f.nameHindi : language === 'pa' ? f.namePunjabi : f.name}</h4>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{f.distance} • {f.travelTime} • {f.hours}</p>
                            <p className="text-sm text-gray-600">{f.specialties.join(', ')}</p>
                            {f.doctors && f.doctors.filter(d => d.available).length > 0 && (
                              <p className="text-xs text-green-600 mt-1">
                                {f.doctors.filter(d => d.available).length} doctor(s) available
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              f.availability === 'available' ? 'bg-green-100 text-green-800' :
                              f.availability === 'limited' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {f.availability}
                            </span>
                            <button 
                              className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                              onClick={() => { setSelectedFromListId(f.id); setSelectedFacility(f); setActiveTab('map'); }}
                            >
                              View on Map
                            </button>
                            {f.phone && (
                              <button 
                                className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                                onClick={() => window.open(`tel:${f.phone}`, '_self')}
                              >
                                Call
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(MapSection);