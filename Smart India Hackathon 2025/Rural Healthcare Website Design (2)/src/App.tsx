import { lazy, Suspense, useState, useEffect } from 'react';
import { User, LogOut, ChevronDown } from 'lucide-react';
import HeroSection from './components/HeroSection';
import ProblemSection from './components/ProblemSection';
import ImpactSection from './components/ImpactSection';
import FeaturesSection from './components/FeaturesSection';
import FloatingChatbot from './components/FloatingChatbot';
import SkinDiseaseDetection from './components/SkinDiseaseDetection';
import { authService, type User as AuthUser } from './services/authService';

// Lazy load ALL heavy components including new ones
const LoginPage = lazy(() => import('./components/LoginPage'));
const EmergencyFlow = lazy(() => import('./components/EmergencyFlow'));
const TelemedicineApp = lazy(() => import('./components/TelemedicineApp'));
const DigitalHealthRecords = lazy(() => import('./components/DigitalHealthRecords'));
const DoctorDashboard = lazy(() => import('./components/DoctorDashboard'));
const MedicineTracker = lazy(() => import('./components/MedicineTracker'));
const PharmacyDashboard = lazy(() => import('./components/PharmacyDashboard'));
const SimplifiedPharmacyDashboard = lazy(() => import('./components/SimplifiedPharmacyDashboard'));
const AISymptomChecker = lazy(() => import('./components/AISymptomChecker'));
const CommunityChat = lazy(() => import('./components/CommunityChat'));
const SolutionSection = lazy(() => import('./components/SolutionSection'));
const MapSection = lazy(() => import('./components/MapSection'));
const DataSection = lazy(() => import('./components/DataSection'));
const Insights = lazy(() => import('./components/Insights'));
const StakeholdersSection = lazy(() => import('./components/StakeholdersSection'));
const LearnMore = lazy(() => import('./components/LearnMore'));
const CTASection = lazy(() => import('./components/CTASection'));
const Footer = lazy(() => import('./components/Footer'));
const VillageHealthHubEmbed = lazy(() => import('./components/VillageHealthHubEmbed'));
const PregnancyTrackerEmbed = lazy(() => import('./components/PregnancyTrackerEmbed'));
const BloodDonationEmbed = lazy(() => import('./components/BloodDonationEmbed'));


type AppView = 'login' | 'website' | 'learn-more' | 'insights' | 'emergency' | 'telemedicine' | 'records' | 'doctor-dashboard' | 'medicine' | 'pharmacy' | 'symptom' | 'community' | 'village-hub' | 'pregnancy' | 'blood-donation';

// Loading component
function LoadingSection() {
  return (
    <div className="py-20 bg-gray-50 flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-gray-600">Loading...</span>
      </div>
    </div>
  );
}

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('login');
  const [userRole, setUserRole] = useState<'patient' | 'doctor' | 'pharmacist' | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [showSkinDiseaseDetection, setShowSkinDiseaseDetection] = useState(false);

  // Initialize authentication on app load
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('App: Initializing auth...');
      console.log('App: isAuthenticated:', authService.isAuthenticated());
      
      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();
        console.log('App: Current user from storage:', currentUser);
        if (currentUser) {
          setUser(currentUser);
          setUserRole(currentUser.role);
          
          // Redirect pharmacists directly to pharmacy dashboard
          if (currentUser.role === 'pharmacist') {
            setCurrentView('pharmacy');
            console.log('App: Redirecting pharmacist to pharmacy dashboard on load');
          } else {
            // All other users land on the main website first to see feature cards
            setCurrentView('website');
            console.log('App: Set user role to:', currentUser.role);
          }
        }
      } else {
        console.log('App: Not authenticated, showing login page');
        setCurrentView('login');
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isProfileDropdownOpen) {
        const target = event.target as Element;
        if (!target.closest('.profile-dropdown')) {
          setIsProfileDropdownOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  // Handle URL-based routing
  useEffect(() => {
    const handleUrlRouting = () => {
      const path = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      
      console.log('App: URL routing - path:', path, 'search:', window.location.search);
      
      // Only handle routing if user is authenticated
      if (!authService.isAuthenticated()) {
        return;
      }
      
      // Handle specific routes
      if (path === '/medicine-tracker') {
        console.log('App: Navigating to medicine tracker via URL');
        setCurrentView('medicine');
        
        // Handle pre-search parameter
        const searchMedicine = searchParams.get('search');
        if (searchMedicine) {
          console.log('App: Pre-search medicine:', searchMedicine);
          // Store the search term for the MedicineTracker component to pick up
          localStorage.setItem('medicineSearchTerm', searchMedicine);
        }
      } else if (path === '/symptom-checker') {
        console.log('App: Navigating to symptom checker via URL');
        setCurrentView('symptom');
      } else if (path === '/emergency') {
        console.log('App: Navigating to emergency via URL');
        setCurrentView('emergency');
      } else if (path === '/telemedicine') {
        console.log('App: Navigating to telemedicine via URL');
        setCurrentView('telemedicine');
      } else if (path === '/records') {
        console.log('App: Navigating to records via URL');
        setCurrentView('records');
      } else if (path === '/community') {
        console.log('App: Navigating to community via URL');
        setCurrentView('community');
      } else if (path === '/village-hub') {
        setCurrentView('village-hub');
      } else if (path === '/pregnancy') {
        setCurrentView('pregnancy');
      } else if (path === '/blood-donation') {
        setCurrentView('blood-donation');
      } else if (path === '/' || path === '/website') {
        // Default to website view for authenticated users
        if (user && user.role !== 'pharmacist') {
          setCurrentView('website');
        }
      }
    };

    // Handle initial URL
    handleUrlRouting();

    // Listen for popstate events (back/forward navigation)
    const handlePopState = () => {
      handleUrlRouting();
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [user]); // Depend on user to re-run when authentication state changes

  const handleLogin = (role: 'patient' | 'doctor' | 'pharmacist') => {
    console.log('App: handleLogin called with role:', role);
    const currentUser = authService.getCurrentUser();
    console.log('App: Current user from authService:', currentUser);
    
    if (currentUser) {
      console.log('App: Setting user and role from currentUser:', currentUser.role);
      setUser(currentUser);
      setUserRole(currentUser.role);
      
      // Redirect pharmacists directly to pharmacy dashboard
      if (currentUser.role === 'pharmacist') {
        setCurrentView('pharmacy');
        console.log('App: Redirecting pharmacist to pharmacy dashboard');
        return;
      }
    } else {
      console.log('App: No currentUser, setting role directly:', role);
      setUserRole(role);
      
      // Redirect pharmacists directly to pharmacy dashboard
      if (role === 'pharmacist') {
        setCurrentView('pharmacy');
        console.log('App: Redirecting pharmacist to pharmacy dashboard');
        return;
      }
    }
    // All other users go to the main website first to see feature cards
    setCurrentView('website');
    console.log('App: Set currentView to website');
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setUserRole(null);
    setCurrentView('login');
  };


  const handleFeatureClick = (feature: string) => {
    // Handle pharmacy dashboard feature
    if (feature === 'pharmacy') {
      setCurrentView('pharmacy');
      return;
    }
    // Handle symptom checker feature
    if (feature === 'symptom-checker') {
      setCurrentView('symptom');
      return;
    }
    setCurrentView(feature as AppView);
  };

  const handleBackToWebsite = () => {
    setCurrentView('website');
    // Update URL and smooth-scroll to Comprehensive Healthcare Solutions
    window.history.pushState({}, '', '/website#solutions');
    setTimeout(() => {
      const el = document.getElementById('solutions');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleSkinDiseaseClick = () => {
    console.log('App: Opening Skin Disease Detection modal');
    setShowSkinDiseaseDetection(true);
  };

  const handleCloseSkinDiseaseDetection = () => {
    console.log('App: Closing Skin Disease Detection modal');
    setShowSkinDiseaseDetection(false);
  };

  // Navigation helper functions that update both state and URL
  const navigateToView = (view: AppView, path: string) => {
    setCurrentView(view);
    window.history.pushState({}, '', path);
  };

  const navigateToMedicineTracker = (searchTerm?: string) => {
    setCurrentView('medicine');
    const url = searchTerm 
      ? `/medicine-tracker?search=${encodeURIComponent(searchTerm)}`
      : '/medicine-tracker';
    window.history.pushState({}, '', url);
    
    // Store search term for the component to pick up
    if (searchTerm) {
      localStorage.setItem('medicineSearchTerm', searchTerm);
    }
  };

  const navigateToVillageHub = () => {
    setCurrentView('village-hub');
    window.history.pushState({}, '', '/village-hub');
  };

  const navigateToPregnancy = () => {
    setCurrentView('pregnancy');
    window.history.pushState({}, '', '/pregnancy');
  };

  const navigateToBloodDonation = () => {
    setCurrentView('blood-donation');
    window.history.pushState({}, '', '/blood-donation');
  };

  // Show loading while initializing
  if (isLoading) {
    return <LoadingSection />;
  }

  // Show login page if not authenticated
  if (currentView === 'login') {
    return (
      <Suspense fallback={<LoadingSection />}>
        <LoginPage onLogin={handleLogin} />
      </Suspense>
    );
  }

  // Show emergency flow
  if (currentView === 'emergency') {
    return (
      <Suspense fallback={<LoadingSection />}>
        <EmergencyFlow onBack={handleBackToWebsite} />
      </Suspense>
    );
  }

  // Show feature pages
  if (currentView === 'telemedicine') {
    return (
      <Suspense fallback={<LoadingSection />}>
        <TelemedicineApp onBack={handleBackToWebsite} />
      </Suspense>
    );
  }

  if (currentView === 'records') {
    return (
      <Suspense fallback={<LoadingSection />}>
        <DigitalHealthRecords onBack={handleBackToWebsite} />
      </Suspense>
    );
  }

  if (currentView === 'doctor-dashboard') {
    return (
      <Suspense fallback={<LoadingSection />}>
        <DoctorDashboard 
          onBack={handleBackToWebsite} 
          onNavigateToRecords={(patientId: string) => {
            localStorage.setItem('selectedPatientId', patientId);
            setCurrentView('records');
          }}
        />
      </Suspense>
    );
  }

  if (currentView === 'medicine') {
    return (
      <Suspense fallback={<LoadingSection />}>
        <MedicineTracker onBack={handleBackToWebsite} />
      </Suspense>
    );
  }

  if (currentView === 'pharmacy') {
    // Show simplified dashboard for pharmacists, regular dashboard for others
    if (userRole === 'pharmacist') {
      return (
        <Suspense fallback={<LoadingSection />}>
          <SimplifiedPharmacyDashboard onLogout={handleLogout} />
        </Suspense>
      );
    } else {
      return (
        <Suspense fallback={<LoadingSection />}>
          <PharmacyDashboard onBack={handleBackToWebsite} />
        </Suspense>
      );
    }
  }

  if (currentView === 'symptom') {
    return (
      <Suspense fallback={<LoadingSection />}>
        <AISymptomChecker onBack={handleBackToWebsite} />
      </Suspense>
    );
  }

  if (currentView === 'community') {
    return (
      <Suspense fallback={<LoadingSection />}>
        <CommunityChat onClose={handleBackToWebsite} />
      </Suspense>
    );
  }

  if (currentView === 'village-hub') {
    return (
      <Suspense fallback={<LoadingSection />}>
        <VillageHealthHubEmbed onBack={handleBackToWebsite} />
      </Suspense>
    );
  }

  if (currentView === 'pregnancy') {
    return (
      <Suspense fallback={<LoadingSection />}>
        <PregnancyTrackerEmbed onBack={handleBackToWebsite} />
      </Suspense>
    );
  }

  if (currentView === 'blood-donation') {
    return (
      <Suspense fallback={<LoadingSection />}>
        <BloodDonationEmbed onBack={handleBackToWebsite} />
      </Suspense>
    );
  }

  if (currentView === 'learn-more') {
    return (
      <Suspense fallback={<LoadingSection />}>
        <LearnMore onBack={handleBackToWebsite} />
      </Suspense>
    );
  }

  if (currentView === 'insights') {
    return (
      <Suspense fallback={<LoadingSection />}>
        <Insights onBack={handleBackToWebsite} />
      </Suspense>
    );
  }


  // Show main website after login
  return (
    <div className="min-h-screen bg-white">
      {/* Header with Profile Dropdown and Emergency Button */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        {user ? (
          <div className="relative profile-dropdown">
            {/* Profile Dropdown Button */}
            <button 
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="bg-white/90 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-lg shadow-lg hover:bg-white border border-gray-200 text-sm flex items-center gap-2 transition-all duration-200"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{user.name}</span>
              <span className="text-xs text-gray-500 hidden sm:inline">({user.role})</span>
              <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsProfileDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors duration-150"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button 
            onClick={() => setCurrentView('login')}
            className="bg-white/90 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-lg shadow-lg hover:bg-white border border-gray-200 text-sm transition-all duration-200"
          >
            Login
          </button>
        )}
        
        {/* Emergency Button - Always prominent */}
        <button 
          onClick={() => setCurrentView('emergency')}
          className="bg-red-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 border border-red-300 text-sm font-medium transition-all duration-200 hover:scale-105"
        >
          🚨 Emergency
        </button>
      </div>

      <HeroSection 
        onLearnMore={() => setCurrentView('learn-more')} 
        onViewSolution={() => {
          const el = document.getElementById('solutions');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }}
      />
      <ProblemSection />
      <ImpactSection />
      
      {/* Add Features Section */}
      <FeaturesSection onFeatureClick={handleFeatureClick} userRole={userRole} />
      
      {/* Removed duplicate Our Solution section after merging bullets into Features */}
      
      <Suspense fallback={<LoadingSection />}>
        <MapSection />
      </Suspense>
      
      {/* Stakeholders moved to Learn More page */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-2xl md:text-3xl text-gray-900 mb-3">Discover our stakeholders and ecosystem</h3>
          <p className="text-gray-600 mb-8">See how patients, doctors, pharmacies, and community workers connect.</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setCurrentView('learn-more')}
              className="inline-flex items-center px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              Learn More
            </button>
            <button
              onClick={() => setCurrentView('insights')}
              className="inline-flex items-center px-6 py-3 rounded-lg bg-black text-white hover:bg-gray-900 transition-colors"
            >
              View Insights
            </button>
          </div>
        </div>
      </section>
      
      <Suspense fallback={<LoadingSection />}>
        <CTASection 
          onJoinCommunity={() => setCurrentView('community')} 
          onOpenVillageHub={() => {
            setCurrentView('village-hub');
            window.history.pushState({}, '', '/village-hub');
          }} 
        />
      </Suspense>
      
      <Suspense fallback={<LoadingSection />}>
        <Footer />
      </Suspense>
      
      {/* Floating Chatbot - Only show on main website */}
      <FloatingChatbot onSkinDiseaseClick={handleSkinDiseaseClick} />

      {/* Skin Disease Detection Modal */}
      {showSkinDiseaseDetection && (
        <SkinDiseaseDetection onBack={handleCloseSkinDiseaseDetection} />
      )}
    </div>
  );
}