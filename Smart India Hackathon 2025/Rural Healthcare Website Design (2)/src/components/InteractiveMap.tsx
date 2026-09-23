import { useEffect, useMemo, useState } from 'react';
import { Map, Marker, useMap } from '@vis.gl/react-maplibre';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Phone, Clock, Users, Navigation, Video } from 'lucide-react';

// Comprehensive healthcare facilities data for Nabha region and surrounding areas
export const facilities = [
  // Major Hospitals / Nursing Homes
  {
    id: 1,
    name: "Civil Hospital",
    nameHindi: "सिविल अस्पताल",
    namePunjabi: "ਸਿਵਿਲ ਹਸਪਤਾਲ",
    type: "hospital",
    lat: 30.3719,
    lng: 76.1494,
    availability: "available",
    distance: "0.5 km",
    travelTime: "2 min",
    phone: "01765-220644",
    hours: "24 hrs",
    specialties: ["General", "Emergency", "Cardiology", "Pediatrics"],
    isGovernment: true,
    address: "94CW+W9M, Guru Nanak Pura Mohalla, Nabha, Punjab 147201",
    doctors: [
      { name: "Dr. Medical Officer", specialty: "General Medicine", available: true },
      { name: "Dr. Emergency Team", specialty: "Emergency", available: true }
    ],
    medicineStock: "available"
  },
  {
    id: 2,
    name: "Shreya Hospital",
    nameHindi: "श्रेया अस्पताल",
    namePunjabi: "ਸ਼ਰੇਆ ਹਸਪਤਾਲ",
    type: "hospital",
    lat: 30.3750,
    lng: 76.1520,
    availability: "available",
    distance: "0.8 km",
    travelTime: "3 min",
    phone: "01765-650141",
    hours: "24 hrs",
    specialties: ["General", "Emergency", "Surgery"],
    isGovernment: false,
    address: "Bouran Gate, Nr Charan Gas Agency, Nabha HO, Nabha 147201",
    doctors: [
      { name: "Dr. Shreya", specialty: "General Medicine", available: true },
      { name: "Dr. Surgical Team", specialty: "Surgery", available: true }
    ],
    medicineStock: "available"
  },
  {
    id: 3,
    name: "Bansal Hospital and Laparoscopic Centre",
    nameHindi: "बंसल अस्पताल और लैप्रोस्कोपिक सेंटर",
    namePunjabi: "ਬੰਸਲ ਹਸਪਤਾਲ ਅਤੇ ਲੈਪ੍ਰੋਸਕੋਪਿਕ ਸੈਂਟਰ",
    type: "hospital",
    lat: 30.3680,
    lng: 76.1460,
    availability: "available",
    distance: "1.2 km",
    travelTime: "4 min",
    phone: "01765-229000",
    hours: "24 hrs",
    specialties: ["General", "Laparoscopic Surgery", "Gynecology"],
    isGovernment: false,
    address: "Basantpura, Nabha HO, Near Cinema Road, Nabha Punjab",
    doctors: [
      { name: "Dr. Bansal", specialty: "Laparoscopic Surgery", available: true },
      { name: "Dr. Gynecology", specialty: "Gynecology", available: true }
    ],
    medicineStock: "available"
  },
  {
    id: 4,
    name: "Sawhney Hospital & Maternity Home",
    nameHindi: "सावने अस्पताल और मातृत्व गृह",
    namePunjabi: "ਸਾਵਨੇ ਹਸਪਤਾਲ ਅਤੇ ਮਾਤ੍ਰਿਤਵ ਘਰ",
    type: "hospital",
    lat: 30.3740,
    lng: 76.1480,
    availability: "available",
    distance: "0.7 km",
    travelTime: "2 min",
    phone: "01765-229611",
    hours: "24 hrs",
    specialties: ["General", "Maternity", "Gynecology", "Pediatrics"],
    isGovernment: false,
    address: "Ripudaman Pura, Patiala Gate, Nabha - 147201, Near Gurudwara Akalgarh",
    doctors: [
      { name: "Dr. Sawhney", specialty: "Maternity", available: true },
      { name: "Dr. Pediatrician", specialty: "Pediatrics", available: true }
    ],
    medicineStock: "available"
  },
  {
    id: 5,
    name: "Dr. Garg Children Hospital",
    nameHindi: "डॉ. गर्ग चिल्ड्रन अस्पताल",
    namePunjabi: "ਡਾ. ਗਰਗ ਚਿਲਡਰਨ ਹਸਪਤਾਲ",
    type: "hospital",
    lat: 30.3700,
    lng: 76.1500,
    availability: "available",
    distance: "0.3 km",
    travelTime: "1 min",
    phone: "01765-231000",
    hours: "24 hrs",
    specialties: ["Pediatrics", "Children Health", "Emergency"],
    isGovernment: false,
    address: "3 Circular Road, Himmat Nagar, Nabha, Punjab 147201",
    doctors: [
      { name: "Dr. Garg", specialty: "Pediatrics", available: true },
      { name: "Dr. Child Specialist", specialty: "Children Health", available: true }
    ],
    medicineStock: "available"
  },
  {
    id: 6,
    name: "Shyam Nursing Home",
    nameHindi: "श्याम नर्सिंग होम",
    namePunjabi: "ਸ਼ਿਆਮ ਨਰਸਿੰਗ ਹੋਮ",
    type: "hospital",
    lat: 30.3690,
    lng: 76.1510,
    availability: "available",
    distance: "0.4 km",
    travelTime: "1 min",
    phone: "01765-232000",
    hours: "24 hrs",
    specialties: ["General", "Nursing Care", "Post-operative"],
    isGovernment: false,
    address: "Circular Road, Himmat Nagar, Nabha, Punjab 147201",
    doctors: [
      { name: "Dr. Shyam", specialty: "General Medicine", available: true },
      { name: "Nursing Staff", specialty: "Nursing Care", available: true }
    ],
    medicineStock: "available"
  },
  // Additional Hospitals and Clinics
  {
    id: 7,
    name: "Apollo Clinic",
    nameHindi: "अपोलो क्लिनिक",
    namePunjabi: "ਅਪੋਲੋ ਕਲੀਨਿਕ",
    type: "clinic",
    lat: 30.3730,
    lng: 76.1530,
    availability: "available",
    distance: "0.9 km",
    travelTime: "3 min",
    phone: "01765-234000",
    hours: "8:00 AM - 8:00 PM",
    specialties: ["General Medicine", "Consultation"],
    isGovernment: false,
    address: "Main Market, Nabha, Punjab 147201",
    doctors: [
      { name: "Dr. Apollo", specialty: "General Medicine", available: true }
    ],
    medicineStock: "available"
  },
  {
    id: 8,
    name: "Fortis Healthcare Centre",
    nameHindi: "फोर्टिस हेल्थकेयर सेंटर",
    namePunjabi: "ਫੋਰਟਿਸ ਹੈਲਥਕੇਅਰ ਸੈਂਟਰ",
    type: "hospital",
    lat: 30.3670,
    lng: 76.1550,
    availability: "available",
    distance: "1.3 km",
    travelTime: "4 min",
    phone: "01765-235000",
    hours: "24 hrs",
    specialties: ["General", "Cardiology", "Orthopedics"],
    isGovernment: false,
    address: "Near Bus Stand, Nabha, Punjab 147201",
    doctors: [
      { name: "Dr. Fortis", specialty: "Cardiology", available: true },
      { name: "Dr. Ortho", specialty: "Orthopedics", available: true }
    ],
    medicineStock: "available"
  },
  {
    id: 9,
    name: "Max Healthcare Center",
    nameHindi: "मैक्स हेल्थकेयर सेंटर",
    namePunjabi: "ਮੈਕਸ ਹੈਲਥਕੇਅਰ ਸੈਂਟਰ",
    type: "clinic",
    lat: 30.3790,
    lng: 76.1470,
    availability: "available",
    distance: "1.8 km",
    travelTime: "5 min",
    phone: "01765-236000",
    hours: "9:00 AM - 7:00 PM",
    specialties: ["General Medicine", "Dermatology"],
    isGovernment: false,
    address: "Railway Road, Nabha, Punjab 147201",
    doctors: [
      { name: "Dr. Max", specialty: "General Medicine", available: true },
      { name: "Dr. Skin", specialty: "Dermatology", available: true }
    ],
    medicineStock: "available"
  },
  {
    id: 10,
    name: "AIIMS Outreach Center",
    nameHindi: "एम्स आउटरीच सेंटर",
    namePunjabi: "ਏਮਐਸ ਆਉਟਰੀਚ ਸੈਂਟਰ",
    type: "hospital",
    lat: 30.3650,
    lng: 76.1520,
    availability: "available",
    distance: "2.1 km",
    travelTime: "6 min",
    phone: "01765-237000",
    hours: "24 hrs",
    specialties: ["General", "Emergency", "Specialist Care"],
    isGovernment: true,
    address: "Government Complex, Nabha, Punjab 147201",
    doctors: [
      { name: "Dr. AIIMS", specialty: "General Medicine", available: true },
      { name: "Dr. Specialist", specialty: "Specialist Care", available: true }
    ],
    medicineStock: "available"
  },
  {
    id: 11,
    name: "Medanta Healthcare",
    nameHindi: "मेदांता हेल्थकेयर",
    namePunjabi: "ਮੇਡਾਂਟਾ ਹੈਲਥਕੇਅਰ",
    type: "hospital",
    lat: 30.3710,
    lng: 76.1560,
    availability: "available",
    distance: "1.0 km",
    travelTime: "3 min",
    phone: "01765-238000",
    hours: "24 hrs",
    specialties: ["General", "Neurology", "Oncology"],
    isGovernment: false,
    address: "Commercial Area, Nabha, Punjab 147201",
    doctors: [
      { name: "Dr. Medanta", specialty: "Neurology", available: true },
      { name: "Dr. Cancer", specialty: "Oncology", available: true }
    ],
    medicineStock: "available"
  },
  {
    id: 12,
    name: "Artemis Hospital",
    nameHindi: "आर्टेमिस अस्पताल",
    namePunjabi: "ਆਰਟੇਮਿਸ ਹਸਪਤਾਲ",
    type: "hospital",
    lat: 30.3760,
    lng: 76.1490,
    availability: "available",
    distance: "0.8 km",
    travelTime: "3 min",
    phone: "01765-239000",
    hours: "24 hrs",
    specialties: ["General", "Surgery", "ICU"],
    isGovernment: false,
    address: "Industrial Area, Nabha, Punjab 147201",
    doctors: [
      { name: "Dr. Artemis", specialty: "Surgery", available: true },
      { name: "Dr. ICU", specialty: "Critical Care", available: true }
    ],
    medicineStock: "available"
  },
  // Pharmacies / Medical Stores
  {
    id: 13,
    name: "Prem Medical Store",
    nameHindi: "प्रेम मेडिकल स्टोर",
    namePunjabi: "ਪ੍ਰੇਮ ਮੈਡੀਕਲ ਸਟੋਰ",
    type: "pharmacy",
    lat: 30.3720,
    lng: 76.1540,
    availability: "available",
    distance: "0.6 km",
    travelTime: "2 min",
    phone: "07009011125",
    hours: "8:00 AM - 10:00 PM",
    specialties: ["Medicines", "General Health"],
    isGovernment: false,
    address: "Bhawra Bazar, Nabha, Punjab 147201",
    doctors: [],
    medicineStock: "available"
  },
  {
    id: 14,
    name: "Indu Medical Agencies",
    nameHindi: "इंडू मेडिकल एजेंसीज",
    namePunjabi: "ਇੰਡੂ ਮੈਡੀਕਲ ਏਜੰਸੀਜ਼",
    type: "pharmacy",
    lat: 30.3660,
    lng: 76.1580,
    availability: "available",
    distance: "1.5 km",
    travelTime: "5 min",
    phone: "09914105750",
    hours: "9:00 AM - 9:00 PM",
    specialties: ["Medicines", "Medical Supplies"],
    isGovernment: false,
    address: "Alohran Kalan Road, Nabha, Punjab 147201",
    doctors: [],
    medicineStock: "available"
  },
  {
    id: 15,
    name: "Rajinder Medical Hall",
    nameHindi: "राजिंदर मेडिकल हॉल",
    namePunjabi: "ਰਾਜਿੰਦਰ ਮੈਡੀਕਲ ਹਾਲ",
    type: "pharmacy",
    lat: 30.3780,
    lng: 76.1420,
    availability: "available",
    distance: "2.0 km",
    travelTime: "6 min",
    phone: "01765-233000",
    hours: "8:00 AM - 10:00 PM",
    specialties: ["Medicines", "Chemist"],
    isGovernment: false,
    address: "Near or on Nabha Road / Tripuri Town area",
    doctors: [],
    medicineStock: "available"
  },
  {
    id: 16,
    name: "Apollo Pharmacy",
    nameHindi: "अपोलो फार्मेसी",
    namePunjabi: "ਅਪੋਲੋ ਫਾਰਮੇਸੀ",
    type: "pharmacy",
    lat: 30.3740,
    lng: 76.1550,
    availability: "available",
    distance: "0.8 km",
    travelTime: "3 min",
    phone: "01765-240000",
    hours: "8:00 AM - 10:00 PM",
    specialties: ["Medicines", "Prescription"],
    isGovernment: false,
    address: "Market Complex, Nabha, Punjab 147201",
    doctors: [],
    medicineStock: "available"
  },
  {
    id: 17,
    name: "MedPlus Pharmacy",
    nameHindi: "मेडप्लस फार्मेसी",
    namePunjabi: "ਮੇਡਪਲਸ ਫਾਰਮੇਸੀ",
    type: "pharmacy",
    lat: 30.3690,
    lng: 76.1570,
    availability: "available",
    distance: "1.2 km",
    travelTime: "4 min",
    phone: "01765-241000",
    hours: "9:00 AM - 9:00 PM",
    specialties: ["Medicines", "Health Products"],
    isGovernment: false,
    address: "Shopping Center, Nabha, Punjab 147201",
    doctors: [],
    medicineStock: "available"
  },
  {
    id: 18,
    name: "Wellness Pharmacy",
    nameHindi: "वेलनेस फार्मेसी",
    namePunjabi: "ਵੈਲਨੈਸ ਫਾਰਮੇਸੀ",
    type: "pharmacy",
    lat: 30.3770,
    lng: 76.1440,
    availability: "available",
    distance: "1.7 km",
    travelTime: "5 min",
    phone: "01765-242000",
    hours: "8:00 AM - 10:00 PM",
    specialties: ["Medicines", "Wellness Products"],
    isGovernment: false,
    address: "Wellness Plaza, Nabha, Punjab 147201",
    doctors: [],
    medicineStock: "available"
  },
  {
    id: 19,
    name: "Health Plus Medical",
    nameHindi: "हेल्थ प्लस मेडिकल",
    namePunjabi: "ਹੈਲਥ ਪਲਸ ਮੈਡੀਕਲ",
    type: "pharmacy",
    lat: 30.3630,
    lng: 76.1500,
    availability: "available",
    distance: "2.2 km",
    travelTime: "6 min",
    phone: "01765-243000",
    hours: "8:00 AM - 10:00 PM",
    specialties: ["Medicines", "Medical Equipment"],
    isGovernment: false,
    address: "Health Zone, Nabha, Punjab 147201",
    doctors: [],
    medicineStock: "available"
  },
  {
    id: 20,
    name: "Care Pharmacy",
    nameHindi: "केयर फार्मेसी",
    namePunjabi: "ਕੇਅਰ ਫਾਰਮੇਸੀ",
    type: "pharmacy",
    lat: 30.3800,
    lng: 76.1480,
    availability: "available",
    distance: "1.9 km",
    travelTime: "5 min",
    phone: "01765-244000",
    hours: "8:00 AM - 10:00 PM",
    specialties: ["Medicines", "Patient Care"],
    isGovernment: false,
    address: "Care Complex, Nabha, Punjab 147201",
    doctors: [],
    medicineStock: "available"
  },
  // Emergency Services
  {
    id: 21,
    name: "Emergency Medical Services",
    nameHindi: "आपातकालीन चिकित्सा सेवाएं",
    namePunjabi: "ਜ਼ਰੂਰੀ ਚਿਕਿਤਸਾ ਸੇਵਾਵਾਂ",
    type: "emergency",
    lat: 30.3720,
    lng: 76.1510,
    availability: "available",
    distance: "0.5 km",
    travelTime: "2 min",
    phone: "108",
    hours: "24 hrs",
    specialties: ["Emergency", "Ambulance", "Critical Care"],
    isGovernment: true,
    address: "Emergency Center, Nabha, Punjab 147201",
    doctors: [
      { name: "Emergency Team", specialty: "Emergency Medicine", available: true }
    ],
    medicineStock: "available"
  },
  {
    id: 22,
    name: "Red Cross Society",
    nameHindi: "रेड क्रॉस सोसाइटी",
    namePunjabi: "ਰੈੱਡ ਕਰਾਸ ਸੋਸਾਇਟੀ",
    type: "emergency",
    lat: 30.3700,
    lng: 76.1530,
    availability: "available",
    distance: "0.7 km",
    travelTime: "2 min",
    phone: "01765-245000",
    hours: "24 hrs",
    specialties: ["Emergency", "First Aid", "Blood Bank"],
    isGovernment: false,
    address: "Red Cross Building, Nabha, Punjab 147201",
    doctors: [
      { name: "Red Cross Team", specialty: "First Aid", available: true }
    ],
    medicineStock: "available"
  },
  // Rural Health Centers
  {
    id: 23,
    name: "Primary Health Center - Nabha",
    nameHindi: "प्राथमिक स्वास्थ्य केंद्र - नाभा",
    namePunjabi: "ਪ੍ਰਾਥਮਿਕ ਸਿਹਤ ਕੇਂਦਰ - ਨਾਭਾ",
    type: "clinic",
    lat: 30.3680,
    lng: 76.1590,
    availability: "available",
    distance: "1.4 km",
    travelTime: "4 min",
    phone: "01765-246000",
    hours: "8:00 AM - 4:00 PM",
    specialties: ["General", "Immunization", "Maternal Health"],
    isGovernment: true,
    address: "PHC Building, Nabha, Punjab 147201",
    doctors: [
      { name: "Dr. PHC", specialty: "General Medicine", available: true },
      { name: "ANM", specialty: "Maternal Health", available: true }
    ],
    medicineStock: "available"
  },
  {
    id: 24,
    name: "Community Health Center",
    nameHindi: "सामुदायिक स्वास्थ्य केंद्र",
    namePunjabi: "ਕਮਿਊਨਿਟੀ ਹੈਲਥ ਸੈਂਟਰ",
    type: "clinic",
    lat: 30.3750,
    lng: 76.1450,
    availability: "available",
    distance: "1.1 km",
    travelTime: "3 min",
    phone: "01765-247000",
    hours: "8:00 AM - 4:00 PM",
    specialties: ["General", "Family Planning", "Child Health"],
    isGovernment: true,
    address: "CHC Complex, Nabha, Punjab 147201",
    doctors: [
      { name: "Dr. CHC", specialty: "General Medicine", available: true },
      { name: "Dr. Family", specialty: "Family Planning", available: true }
    ],
    medicineStock: "available"
  },
  {
    id: 25,
    name: "Sub Health Center - Village",
    nameHindi: "उप स्वास्थ्य केंद्र - गांव",
    namePunjabi: "ਸਬ ਹੈਲਥ ਸੈਂਟਰ - ਪਿੰਡ",
    type: "clinic",
    lat: 30.3820,
    lng: 76.1600,
    availability: "available",
    distance: "2.5 km",
    travelTime: "7 min",
    phone: "01765-248000",
    hours: "9:00 AM - 3:00 PM",
    specialties: ["General", "Basic Health"],
    isGovernment: true,
    address: "Village Center, Near Nabha, Punjab 147201",
    doctors: [
      { name: "Dr. Village", specialty: "General Medicine", available: true }
    ],
    medicineStock: "limited"
  }
];

interface InteractiveMapProps {
  language: 'en' | 'hi' | 'pa';
  filters: {
    specialty: string;
    type: string;
    availability: string;
    isGovernment?: boolean;
  };
  searchQuery: string;
  onFacilitySelect: (facility: any) => void;
  onStatsChange?: (stats: { nearbyCount: number; availableDoctors: number; emergencyServices: number }) => void;
  selectedFacilityId?: number;
}

export function InteractiveMap({ 
  language, 
  filters, 
  searchQuery, 
  onFacilitySelect, 
  onStatsChange, 
  selectedFacilityId 
}: InteractiveMapProps) {
  const [userLocation, setUserLocation] = useState({ lat: 30.3719, lng: 76.1494 }); // Default to Nabha
  const [selectedFacility, setSelectedFacility] = useState<any>(null);
  const { current: map } = useMap();

  // Filter facilities based on search and filters
  const filteredFacilities = useMemo(() => facilities.filter(facility => {
    const nameToSearch = language === 'hi' ? facility.nameHindi : 
                        language === 'pa' ? facility.namePunjabi : facility.name;
    
    const matchesSearch = searchQuery === '' || 
      nameToSearch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.specialties.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSpecialty = filters.specialty === 'all' || 
      facility.specialties.includes(filters.specialty);
    
    const matchesType = filters.type === 'all' || facility.type === filters.type;
    
    const matchesAvailability = filters.availability === 'all' || 
      facility.availability === filters.availability;
    
    const matchesGovernment = filters.isGovernment === undefined || 
      facility.isGovernment === filters.isGovernment;
    
    return matchesSearch && matchesSpecialty && matchesType && matchesAvailability && matchesGovernment;
  }), [language, searchQuery, filters]);

  const getMarkerColor = (availability: string) => {
    switch (availability) {
      case 'available': return '#22c55e'; // Green
      case 'limited': return '#f59e0b';   // Yellow  
      case 'unavailable': return '#ef4444'; // Red
      default: return '#6b7280'; // Gray
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hospital': return '🏥';
      case 'clinic': return '🏥';
      case 'pharmacy': return '💊';
      case 'emergency': return '🚑';
      default: return '📍';
    }
  };

  const getFacilityName = (facility: any) => {
    switch (language) {
      case 'hi': return facility.nameHindi;
      case 'pa': return facility.namePunjabi;
      default: return facility.name;
    }
  };

  const handleEmergencyCall = () => {
    window.open('tel:108', '_self');
  };

  const handleGetDirections = (facility: any) => {
    const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${facility.lat},${facility.lng}`;
    window.open(url, '_blank');
  };

  const handleVideoCall = (facility: any) => {
    // Integration with telemedicine app
    const telemedicineUrl = `http://localhost:5175/?facility=${encodeURIComponent(facility.name)}&type=consultation`;
    window.open(telemedicineUrl, '_blank');
  };

  // Geolocate user
  useEffect(() => {
    if (!('geolocation' in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      },
      () => {
        // Fallback to Nabha location if geolocation fails
        console.log('Geolocation failed, using default Nabha location');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  }, []);

  // Compute dynamic stats from filtered facilities
  useEffect(() => {
    if (!onStatsChange) return;
    const nearbyCount = filteredFacilities.filter(f => f.type === 'hospital' || f.type === 'clinic').length;
    const availableDoctors = filteredFacilities.reduce((sum, f) => {
      if (!Array.isArray(f.doctors)) return sum;
      return sum + f.doctors.filter((d: any) => d.available).length;
    }, 0);
    const emergencyServices = filteredFacilities.filter(f => f.type === 'emergency').length;
    onStatsChange({ nearbyCount, availableDoctors, emergencyServices });
  }, [filteredFacilities, onStatsChange]);

  // Respond to external selection (e.g., from List view)
  useEffect(() => {
    if (selectedFacilityId && map) {
      const facility = facilities.find(f => f.id === selectedFacilityId);
      if (facility) {
        map.flyTo({
          center: [facility.lng, facility.lat],
          zoom: 15,
          duration: 1000
        });
        setSelectedFacility(facility);
      }
    }
  }, [selectedFacilityId, map]);

  return (
    <div className="relative h-full">
      {/* Map Container */}
      <div className="absolute inset-0">
        <Map
          initialViewState={{
            longitude: 76.1494, // Nabha longitude
            latitude: 30.3719,  // Nabha latitude
            zoom: 12
          }}
          mapStyle="https://tiles.openfreemap.org/styles/liberty"
          style={{ width: '100%', height: '100%' }}
        >
          {/* User Location Marker */}
          <Marker longitude={userLocation.lng} latitude={userLocation.lat}>
            <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </Marker>

          {/* Healthcare Facilities */}
          {filteredFacilities.map((facility) => (
            <Marker
              key={facility.id}
              longitude={facility.lng}
              latitude={facility.lat}
              onClick={() => {
                setSelectedFacility(facility);
                onFacilitySelect(facility);
                
                // Fly to the selected facility
                if (map) {
                  map.flyTo({
                    center: [facility.lng, facility.lat],
                    zoom: Math.max(map.getZoom(), 15),
                    duration: 0 // make movement instant (no animation)
                  });
                }
              }}
            >
              <div 
                className={`w-10 h-10 rounded-full border-3 border-white shadow-xl flex items-center justify-center cursor-pointer ${
                  selectedFacility?.id === facility.id ? 'ring-4 ring-blue-400 ring-opacity-50' : ''
                }`}
                style={{ 
                  backgroundColor: getMarkerColor(facility.availability),
                  borderColor: selectedFacility?.id === facility.id ? '#3b82f6' : 'white'
                }}
                title={getFacilityName(facility)}
              >
                <span className="text-white text-sm font-bold">
                  {getTypeIcon(facility.type)}
                </span>
              </div>
            </Marker>
          ))}

        </Map>
      </div>

      {/* External Popup for selected facility */}
      {selectedFacility && (
        <div className="external-popup">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-4">
            {/* Header with close button */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-md flex-shrink-0"
                     style={{ backgroundColor: getMarkerColor(selectedFacility.availability) }}>
                  {getTypeIcon(selectedFacility.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{getFacilityName(selectedFacility)}</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge 
                      variant={selectedFacility.availability === 'available' ? 'default' : 
                             selectedFacility.availability === 'limited' ? 'secondary' : 'destructive'}
                      className="capitalize text-xs px-2 py-0.5 h-5"
                    >
                      {selectedFacility.availability}
                    </Badge>
                    {selectedFacility.isGovernment ? (
                      <Badge variant="outline" className="text-xs px-2 py-0.5 h-5 border-gray-300">Government</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs px-2 py-0.5 h-5 border-gray-300">Private</Badge>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedFacility(null)}
                className="ml-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Details */}
            <div className="space-y-3 mb-5">
              {selectedFacility.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span className="text-gray-700">
                    <strong>Phone:</strong> {selectedFacility.phone}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">
                  <strong>Hours:</strong> {selectedFacility.hours}
                </span>
              </div>
            </div>

            {/* Available Doctors */}
            {selectedFacility.doctors && selectedFacility.doctors.length > 0 && (
              <div className="mb-5">
                <h4 className="font-semibold mb-3 text-gray-900 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Available Doctors ({selectedFacility.doctors.filter((d: any) => d.available).length})
                </h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {selectedFacility.doctors.filter((d: any) => d.available).map((doctor: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-900">{doctor.name}</div>
                        <div className="text-xs text-gray-600">{doctor.specialty}</div>
                      </div>
                    </div>
                  ))}
                  {selectedFacility.doctors.filter((d: any) => !d.available).length > 0 && (
                    <div className="text-xs text-gray-500 mt-2 text-center">
                      +{selectedFacility.doctors.filter((d: any) => !d.available).length} doctor(s) currently unavailable
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              {selectedFacility.phone && (
                <Button size="sm" onClick={() => window.open(`tel:${selectedFacility.phone}`, '_self')} 
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                  <Phone className="w-4 h-4" />
                  Call Now
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={() => handleGetDirections(selectedFacility)}
                      className="flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50">
                <Navigation className="w-4 h-4" />
                Directions
              </Button>
              {selectedFacility.type !== 'pharmacy' && selectedFacility.type !== 'emergency' && (
                <Button size="sm" variant="secondary" onClick={() => handleVideoCall(selectedFacility)}
                        className="col-span-2 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white">
                  <Video className="w-4 h-4" />
                  Start Video Consultation
                </Button>
              )}
              {selectedFacility.type === 'emergency' && (
                <Button size="sm" variant="destructive" onClick={handleEmergencyCall}
                        className="col-span-2 flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  Emergency Call (108)
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Map Controls */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 border">
        <div className="text-sm font-semibold text-gray-800 mb-3">Interactive Legend</div>
        <div className="space-y-2 text-xs">
          <button 
            className="flex items-center gap-2 w-full p-2 rounded hover:bg-green-50 transition-colors"
            onClick={() => {
              // This would filter to show only available facilities
              console.log('Filter by Available');
            }}
          >
            <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
            <span className="font-medium">Available</span>
            <span className="ml-auto text-green-600 font-semibold">
              {filteredFacilities.filter(f => f.availability === 'available').length}
            </span>
          </button>
          <button 
            className="flex items-center gap-2 w-full p-2 rounded hover:bg-yellow-50 transition-colors"
            onClick={() => {
              // This would filter to show only limited facilities
              console.log('Filter by Limited');
            }}
          >
            <div className="w-4 h-4 bg-yellow-500 rounded-full border-2 border-white shadow-sm"></div>
            <span className="font-medium">Limited</span>
            <span className="ml-auto text-yellow-600 font-semibold">
              {filteredFacilities.filter(f => f.availability === 'limited').length}
            </span>
          </button>
          <button 
            className="flex items-center gap-2 w-full p-2 rounded hover:bg-red-50 transition-colors"
            onClick={() => {
              // This would filter to show only unavailable facilities
              console.log('Filter by Unavailable');
            }}
          >
            <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-sm"></div>
            <span className="font-medium">Unavailable</span>
            <span className="ml-auto text-red-600 font-semibold">
              {filteredFacilities.filter(f => f.availability === 'unavailable').length}
            </span>
          </button>
        </div>
        <div className="mt-3 pt-2 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            Click legend items to filter
          </div>
        </div>
      </div>

      {/* Emergency Call Button */}
      <div className="absolute bottom-4 right-4">
        <Button 
          size="lg" 
          onClick={handleEmergencyCall}
          className="rounded-full shadow-lg bg-red-600 hover:bg-red-700 text-white border-2 border-white"
        >
          <Phone className="w-5 h-5 mr-2" />
          Emergency Call
        </Button>
      </div>
    </div>
  );
}
