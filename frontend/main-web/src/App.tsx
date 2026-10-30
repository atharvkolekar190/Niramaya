import { lazy, Suspense, useState, useEffect } from 'react';
import { User, LogOut, ChevronDown, HeartPulse, CalendarDays, FileText, BookOpen, Menu, X } from 'lucide-react';
import HeroSection from './components/HeroSection';
import ProblemSection from './components/ProblemSection';
import FeaturesSection from './components/FeaturesSection';
import FloatingChatbot from './components/FloatingChatbot';
import { authService, type User as AuthUser } from './services/authService';

// Lazy load ALL heavy components including new ones
const LoginPage = lazy(() => import('./components/LoginPage'));
const TelemedicineApp = lazy(() => import('./components/TelemedicineApp'));
const DigitalHealthRecords = lazy(() => import('./components/DigitalHealthRecords'));
const DoctorDashboard = lazy(() => import('./components/DoctorDashboard'));
const PharmacyDashboard = lazy(() => import('./components/PharmacyDashboard'));
const SimplifiedPharmacyDashboard = lazy(() => import('./components/SimplifiedPharmacyDashboard'));
const SolutionSection = lazy(() => import('./components/SolutionSection'));
const MapSection = lazy(() => import('./components/MapSection'));
const DataSection = lazy(() => import('./components/DataSection'));
const Insights = lazy(() => import('./components/Insights'));
const WellnessLibrary = lazy(() => import('./components/WellnessLibrary'));
const StakeholdersSection = lazy(() => import('./components/StakeholdersSection'));
const LearnMore = lazy(() => import('./components/LearnMore'));
const CTASection = lazy(() => import('./components/CTASection'));
const Footer = lazy(() => import('./components/Footer'));


type AppView = 'login' | 'website' | 'learn-more' | 'insights' | 'health-resources' | 'telemedicine' | 'records' | 'doctor-dashboard' | 'pharmacy';

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
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

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
      console.log('App: URL routing - path:', path, 'search:', window.location.search);
      
      // Only handle routing if user is authenticated
      if (!authService.isAuthenticated()) {
        return;
      }
      
      // Handle specific routes
      if (path === '/telemedicine') {
        console.log('App: Navigating to telemedicine via URL');
        setCurrentView('telemedicine');
      } else if (path === '/records') {
        console.log('App: Navigating to records via URL');
        setCurrentView('records');
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

  const handleQuickNavigation = (view: AppView) => {
    setIsMobileNavOpen(false);
    setCurrentView(view);
  };

  // Navigation helper functions that update both state and URL
  const navigateToView = (view: AppView, path: string) => {
    setCurrentView(view);
    window.history.pushState({}, '', path);
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

  if (currentView === 'health-resources') {
    return (
      <Suspense fallback={<LoadingSection />}>
        <WellnessLibrary onBack={handleBackToWebsite} />
      </Suspense>
    );
  }


  // Show main website after login
  return (
    <div className="niramaya-page">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <button type="button" onClick={handleBackToWebsite} className="flex items-center gap-3 text-left">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-900/15">
              <HeartPulse className="h-5 w-5" />
            </span>
            <span className="hidden sm:block">
              <span className="block text-sm font-bold tracking-tight text-slate-900">Niramaya</span>
              <span className="block text-xs text-slate-500">Digital Healthcare</span>
            </span>
          </button>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
            <button type="button" onClick={() => handleQuickNavigation('telemedicine')} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700">
              <CalendarDays className="mr-2 inline h-4 w-4" />Appointments
            </button>
            <button type="button" onClick={() => handleQuickNavigation('records')} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700">
              <FileText className="mr-2 inline h-4 w-4" />Health records
            </button>
            <button type="button" onClick={() => handleQuickNavigation('health-resources')} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700">
              <BookOpen className="mr-2 inline h-4 w-4" />Wellness Library
            </button>
          </nav>
          <div className="flex items-center gap-2">
            <div className="relative profile-dropdown">
              {user ? (
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:border-emerald-300 hover:bg-emerald-50"
                  aria-expanded={isProfileDropdownOpen}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><User className="h-4 w-4" /></span>
                  <span className="hidden md:block">{user.name}</span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>
              ) : (
                <button onClick={() => setCurrentView('login')} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">Login</button>
              )}
              {isProfileDropdownOpen && user && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                  <div className="border-b border-slate-100 px-3 py-2">
                    <p className="font-semibold text-slate-900">{user.name}</p>
                    <p className="text-xs capitalize text-slate-500">{user.role} account</p>
                  </div>
                  <button onClick={handleLogout} className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-red-50 hover:text-red-700">
                    <LogOut className="h-4 w-4" />Log out
                  </button>
                </div>
              )}
            </div>
            <button type="button" className="rounded-xl border border-slate-200 p-2 lg:hidden" onClick={() => setIsMobileNavOpen(!isMobileNavOpen)} aria-label="Toggle navigation">
              {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {isMobileNavOpen && (
          <nav className="border-t border-slate-100 bg-white px-4 py-3 lg:hidden" aria-label="Mobile navigation">
            <div className="mx-auto grid max-w-7xl gap-1 sm:grid-cols-3">
              <button onClick={() => handleQuickNavigation('telemedicine')} className="rounded-lg px-3 py-3 text-left text-sm font-medium text-slate-700 hover:bg-emerald-50">Appointments & consultations</button>
              <button onClick={() => handleQuickNavigation('records')} className="rounded-lg px-3 py-3 text-left text-sm font-medium text-slate-700 hover:bg-emerald-50">Digital health records</button>
              <button onClick={() => handleQuickNavigation('health-resources')} className="rounded-lg px-3 py-3 text-left text-sm font-medium text-slate-700 hover:bg-emerald-50">Wellness Library</button>
            </div>
          </nav>
        )}
      </header>
      {/* Legacy profile container retained for layout compatibility */}
      <div className="hidden">
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
        <CTASection />
      </Suspense>
      
      <Suspense fallback={<LoadingSection />}>
        <Footer />
      </Suspense>
      
      {/* Floating Chatbot - Only show on main website */}
      <FloatingChatbot />
    </div>
  );
}