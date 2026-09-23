import { Card } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Search } from 'lucide-react';

interface FilterPanelProps {
  language: 'en' | 'hi' | 'pa';
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: {
    specialty: string;
    type: string;
    availability: string;
    isGovernment?: boolean;
  };
  onFilterChange: (filters: any) => void;
  onLanguageChange: (lang: 'en' | 'hi' | 'pa') => void;
}

const translations = {
  en: {
    search: "Search hospitals, doctors, or specialties...",
    filters: "Filters",
    specialty: "Specialty",
    type: "Type", 
    availability: "Availability",
    sector: "Sector",
    language: "Language",
    all: "All",
    general: "General",
    emergency: "Emergency", 
    cardiology: "Cardiology",
    orthopedics: "Orthopedics",
    gynecology: "Gynecology",
    pediatrics: "Pediatrics",
    hospital: "Hospital",
    clinic: "Clinic",
    pharmacy: "Pharmacy",
    available: "Available",
    limited: "Limited",
    unavailable: "Unavailable",
    government: "Government",
    private: "Private",
    english: "English",
    hindi: "हिंदी",
    punjabi: "ਪੰਜਾਬੀ",
    clearFilters: "Clear Filters",
    nearMe: "Near Me"
  },
  hi: {
    search: "अस्पताल, डॉक्टर या विशेषता खोजें...",
    filters: "फिल्टर",
    specialty: "विशेषता",
    type: "प्रकार",
    availability: "उपलब्धता", 
    sector: "क्षेत्र",
    language: "भाषा",
    all: "सभी",
    general: "सामान्य",
    emergency: "आपातकाल",
    cardiology: "हृदय रोग",
    orthopedics: "हड्डी रोग",
    gynecology: "स्त्री रोग",
    pediatrics: "बाल रोग",
    hospital: "अस्पताल",
    clinic: "क्लिनिक",
    pharmacy: "दवाखाना",
    available: "उपलब्ध",
    limited: "सीमित",
    unavailable: "अनुपलब्ध",
    government: "सरकारी",
    private: "निजी",
    english: "English",
    hindi: "हिंदी", 
    punjabi: "ਪੰਜਾਬੀ",
    clearFilters: "फिल्टर साफ़ करें",
    nearMe: "मेरे पास"
  },
  pa: {
    search: "ਹਸਪਤਾਲ, ਡਾਕਟਰ ਜਾਂ ਮਾਹਰਤਾ ਖੋਜੋ...",
    filters: "ਫਿਲਟਰ",
    specialty: "ਮਾਹਰਤਾ",
    type: "ਕਿਸਮ",
    availability: "ਉਪਲਬਧਤਾ",
    sector: "ਸੈਕਟਰ", 
    language: "ਭਾਸ਼ਾ",
    all: "ਸਾਰੇ",
    general: "ਆਮ",
    emergency: "ਐਮਰਜੈਂਸੀ",
    cardiology: "ਦਿਲ ਦੀਆਂ ਬਿਮਾਰੀਆਂ",
    orthopedics: "ਹੱਡੀਆਂ ਦੀਆਂ ਬਿਮਾਰੀਆਂ",
    gynecology: "ਔਰਤਾਂ ਦੀਆਂ ਬਿਮਾਰੀਆਂ",
    pediatrics: "ਬੱਚਿਆਂ ਦੀਆਂ ਬਿਮਾਰੀਆਂ",
    hospital: "ਹਸਪਤਾਲ",
    clinic: "ਕਲੀਨਿਕ",
    pharmacy: "ਦਵਾਖ਼ਾਨਾ",
    available: "ਉਪਲਬਧ",
    limited: "ਸੀਮਿਤ",
    unavailable: "ਅਣਉਪਲਬਧ",
    government: "ਸਰਕਾਰੀ",
    private: "ਨਿਜੀ",
    english: "English",
    hindi: "हिंदी",
    punjabi: "ਪੰਜਾਬੀ",
    clearFilters: "ਫਿਲਟਰ ਸਾਫ਼ ਕਰੋ",
    nearMe: "ਮੇਰੇ ਕੋਲ"
  }
};

export function FilterPanel({
  language,
  searchQuery,
  onSearchChange,
  filters,
  onFilterChange,
  onLanguageChange
}: FilterPanelProps) {
  const t = translations[language];

  const handleFilterChange = (key: string, value: string | boolean | undefined) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFilterChange({
      specialty: 'all',
      type: 'all',
      availability: 'all',
      isGovernment: undefined
    });
    onSearchChange('');
  };

  const hasActiveFilters = filters.specialty !== 'all' || 
                          filters.type !== 'all' || 
                          filters.availability !== 'all' || 
                          filters.isGovernment !== undefined ||
                          searchQuery !== '';

  return (
    <div className="space-y-4">
      {/* Compact Header with Language and Clear */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Filters & Search</h2>
        <div className="flex items-center gap-2">
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-24 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-50 min-w-[8rem] shadow-lg border border-gray-200 rounded-md bg-white">
              <SelectItem value="en">EN</SelectItem>
              <SelectItem value="hi">हिं</SelectItem>
              <SelectItem value="pa">ਪੰ</SelectItem>
            </SelectContent>
          </Select>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 text-xs">
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Search - Compact */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder={t.search}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-10 text-sm w-full"
        />
      </div>

      {/* Compact Filters Grid */}
      <Card className="p-4 border-l-4 border-l-blue-500 shadow-sm">
        <div className="grid grid-cols-2 gap-3">
          {/* Specialty Filter */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">{t.specialty}</label>
            <Select value={filters.specialty} onValueChange={(value: string) => handleFilterChange('specialty', value)}>
              <SelectTrigger className="h-8 text-xs w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-50 min-w-[8rem] shadow-lg border border-gray-200 rounded-md bg-white">
                <SelectItem value="all">{t.all}</SelectItem>
                <SelectItem value="General">{t.general}</SelectItem>
                <SelectItem value="Emergency">{t.emergency}</SelectItem>
                <SelectItem value="Cardiology">{t.cardiology}</SelectItem>
                <SelectItem value="Orthopedics">{t.orthopedics}</SelectItem>
                <SelectItem value="Gynecology">{t.gynecology}</SelectItem>
                <SelectItem value="Pediatrics">{t.pediatrics}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">{t.type}</label>
            <Select value={filters.type} onValueChange={(value: string) => handleFilterChange('type', value)}>
              <SelectTrigger className="h-8 text-xs w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-50 min-w-[8rem] shadow-lg border border-gray-200 rounded-md bg-white">
                <SelectItem value="all">{t.all}</SelectItem>
                <SelectItem value="hospital">{t.hospital}</SelectItem>
                <SelectItem value="clinic">{t.clinic}</SelectItem>
                <SelectItem value="pharmacy">{t.pharmacy}</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Availability Filter */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">{t.availability}</label>
            <Select value={filters.availability} onValueChange={(value: string) => handleFilterChange('availability', value)}>
              <SelectTrigger className="h-8 text-xs w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-50 min-w-[8rem] shadow-lg border border-gray-200 rounded-md bg-white">
                <SelectItem value="all">{t.all}</SelectItem>
                <SelectItem value="available">{t.available}</SelectItem>
                <SelectItem value="limited">{t.limited}</SelectItem>
                <SelectItem value="unavailable">{t.unavailable}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sector Filter */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">{t.sector}</label>
            <Select 
              value={filters.isGovernment === undefined ? 'all' : filters.isGovernment ? 'government' : 'private'} 
              onValueChange={(value: string) => handleFilterChange('isGovernment', value === 'all' ? undefined : value === 'government')}
            >
              <SelectTrigger className="h-8 text-xs w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-50 min-w-[8rem] shadow-lg border border-gray-200 rounded-md bg-white">
                <SelectItem value="all">{t.all}</SelectItem>
                <SelectItem value="government">{t.government}</SelectItem>
                <SelectItem value="private">{t.private}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Active Filters Display - Compact */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1 pt-2">
          {searchQuery && (
            <Badge variant="secondary" className="text-xs px-2 py-1">
              {searchQuery}
            </Badge>
          )}
          {filters.specialty !== 'all' && (
            <Badge variant="secondary" className="text-xs px-2 py-1">
              {filters.specialty}
            </Badge>
          )}
          {filters.type !== 'all' && (
            <Badge variant="secondary" className="text-xs px-2 py-1">
              {filters.type}
            </Badge>
          )}
          {filters.availability !== 'all' && (
            <Badge variant="secondary" className="text-xs px-2 py-1">
              {filters.availability}
            </Badge>
          )}
          {filters.isGovernment !== undefined && (
            <Badge variant="secondary" className="text-xs px-2 py-1">
              {filters.isGovernment ? t.government : t.private}
            </Badge>
          )}
        </div>
      )}
      
      {/* Extra spacing to prevent dropdown overlap */}
      <div className="h-4"></div>
    </div>
  );
}
