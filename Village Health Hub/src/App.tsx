import React, { useState, useEffect } from 'react';
import { Stethoscope, User, Calendar, MapPin, Package, Star, Menu, X, Bot, Activity, Zap, Shield, Bell, Heart } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet';
import { Badge } from './components/ui/badge';
import { motion } from 'motion/react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { LandingPage } from './components/LandingPage';
import { UserRegistration } from './components/UserRegistration';
import { VolunteerDashboard } from './components/VolunteerDashboard';
import { PatientDashboard } from './components/PatientDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { MapView } from './components/MapView';
import { BookingSystem } from './components/BookingSystem';
import { MedicineInventory } from './components/MedicineInventory';
import { DoctorScheduling } from './components/DoctorScheduling';
import { ReviewSystem } from './components/ReviewSystem';
import { AIHealthAssistant } from './components/AIHealthAssistant';
import { HealthAnalytics } from './components/HealthAnalytics';
import { EmergencySOS } from './components/EmergencySOS';
import { TelemedicineHub } from './components/TelemedicineHub';
import { SymptomChecker } from './components/SymptomChecker';
import { NotificationCenter } from './components/NotificationCenter';

type UserRole = 'volunteer' | 'patient' | 'doctor' | null;
type CurrentView = 'landing' | 'registration' | 'dashboard' | 'map' | 'booking' | 'inventory' | 'scheduling' | 'reviews' | 'ai-assistant' | 'analytics' | 'emergency' | 'telemedicine' | 'symptoms';

export default function App() {
  const [currentView, setCurrentView] = useState<CurrentView>('landing');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [isOnline, setIsOnline] = useState(true);
  const [emergencyMode, setEmergencyMode] = useState(false);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setIsLoggedIn(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUserRole(null);
    setIsLoggedIn(false);
    setCurrentView('landing');
  };

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: User, color: 'text-blue-500', isNew: false },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Bot, color: 'text-purple-500', isNew: true },
    { id: 'map', label: 'Find Hubs', icon: MapPin, color: 'text-green-500', isNew: false },
    { id: 'telemedicine', label: 'Telemedicine', icon: Activity, color: 'text-red-500', isNew: true },
    { id: 'symptoms', label: 'Symptom Checker', icon: Heart, color: 'text-pink-500', isNew: true },
    { id: 'booking', label: 'Bookings', icon: Calendar, color: 'text-orange-500', isNew: false },
    { id: 'inventory', label: 'Inventory', icon: Package, color: 'text-cyan-500', isNew: false },
    { id: 'analytics', label: 'Health Analytics', icon: Activity, color: 'text-indigo-500', isNew: true },
    { id: 'scheduling', label: 'Scheduling', icon: Stethoscope, color: 'text-teal-500', isNew: false },
    { id: 'reviews', label: 'Reviews', icon: Star, color: 'text-yellow-500', isNew: false },
    { id: 'emergency', label: 'Emergency SOS', icon: Zap, color: 'text-red-600', isNew: true },
  ];

  const renderNavigation = () => (
    <motion.nav 
      className="flex flex-col space-y-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {navigation.map((item, index) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Button
              variant={isActive ? 'secondary' : 'ghost'}
              className={`justify-start gap-3 h-12 group relative overflow-hidden transition-all duration-300 ${
                isActive ? 'bg-gradient-to-r from-primary/10 to-primary/20 border-l-4 border-primary shadow-lg' : 'hover:bg-gradient-to-r hover:from-muted/50 hover:to-muted/80'
              }`}
              onClick={() => {
                setCurrentView(item.id as CurrentView);
                setIsMobileMenuOpen(false);
              }}
            >
              <Icon className={`h-5 w-5 transition-all duration-300 ${item.color} ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
              <span className="transition-all duration-300">{item.label}</span>
              {item.isNew && (
                <Badge variant="destructive" className="ml-auto text-xs animate-pulse">
                  NEW
                </Badge>
              )}
              {item.id === 'emergency' && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="ml-auto"
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </motion.div>
              )}
            </Button>
          </motion.div>
        );
      })}
    </motion.nav>
  );

  const renderContent = () => {
    const commonProps = { userRole, isOnline, emergencyMode };
    
    switch (currentView) {
      case 'landing':
        return <LandingPage onGetStarted={() => setCurrentView('registration')} />;
      case 'registration':
        return <UserRegistration onLogin={handleLogin} onBack={() => setCurrentView('landing')} />;
      case 'dashboard':
        if (userRole === 'volunteer') return <VolunteerDashboard {...commonProps} />;
        if (userRole === 'patient') return <PatientDashboard {...commonProps} />;
        if (userRole === 'doctor') return <DoctorDashboard {...commonProps} />;
        return null;
      case 'ai-assistant':
        return <AIHealthAssistant {...commonProps} />;
      case 'map':
        return <MapView {...commonProps} />;
      case 'telemedicine':
        return <TelemedicineHub {...commonProps} />;
      case 'symptoms':
        return <SymptomChecker {...commonProps} />;
      case 'booking':
        return <BookingSystem {...commonProps} />;
      case 'inventory':
        return <MedicineInventory {...commonProps} />;
      case 'analytics':
        return <HealthAnalytics {...commonProps} />;
      case 'scheduling':
        return <DoctorScheduling {...commonProps} />;
      case 'reviews':
        return <ReviewSystem {...commonProps} />;
      case 'emergency':
        return <EmergencySOS {...commonProps} onEmergencyToggle={setEmergencyMode} />;
      default:
        return null;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        {renderContent()}
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${emergencyMode ? 'bg-red-50 dark:bg-red-950' : 'bg-gradient-to-br from-background via-background to-muted/20'}`}>
      {/* Emergency Alert Banner */}
      {emergencyMode && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-red-600 text-white py-2 px-4 text-center font-medium"
        >
          <div className="flex items-center justify-center gap-2">
            <Zap className="h-4 w-4 animate-pulse" />
            Emergency Mode Active - Priority Support Available
            <Zap className="h-4 w-4 animate-pulse" />
          </div>
        </motion.div>
      )}

      {/* Header */}
      <motion.header 
        className={`border-b backdrop-blur-sm transition-all duration-300 ${emergencyMode ? 'bg-red-100/80 dark:bg-red-900/80 border-red-300' : 'bg-card/80 shadow-sm'}`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <Stethoscope className={`h-8 w-8 transition-colors duration-300 ${emergencyMode ? 'text-red-600' : 'text-primary'}`} />
            </motion.div>
            <div>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Village Health Hub
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  {userRole === 'volunteer' && 'Host Dashboard'}
                  {userRole === 'patient' && 'Patient Portal'}
                  {userRole === 'doctor' && 'Healthcare Provider'}
                </p>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                  <span className="text-xs text-muted-foreground">{isOnline ? 'Online' : 'Offline'}</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => setCurrentView('dashboard')}
              >
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {notifications}
                  </motion.div>
                )}
              </Button>
            </motion.div>

            {/* Status Indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-muted">
              <Shield className="h-4 w-4 text-green-500" />
              <span className="text-sm">Secure</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <Button variant="outline" onClick={handleLogout} className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50">
                Logout
              </Button>
            </div>
            
            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon" className="relative">
                  <Menu className="h-5 w-5" />
                  {notifications > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full"></div>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 bg-gradient-to-b from-card to-muted/20">
                <div className="flex flex-col gap-6 pt-6">
                  <motion.div 
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Stethoscope className="h-6 w-6 text-primary" />
                    <span className="font-semibold">Village Health Hub</span>
                  </motion.div>
                  {renderNavigation()}
                  <Button variant="outline" onClick={handleLogout} className="mt-auto">
                    Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <motion.aside 
          className="hidden md:block w-64 min-h-[calc(100vh-80px)] border-r bg-card/50 backdrop-blur-sm"
          initial={{ x: -264, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-6 space-y-6">
            {renderNavigation()}
            
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border"
            >
              <h4 className="font-medium mb-2 text-sm">Quick Stats</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Hubs</span>
                  <span className="font-medium">47</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Online Doctors</span>
                  <span className="font-medium text-green-600">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Emergency Ready</span>
                  <span className="font-medium text-blue-600">24/7</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-80px)] overflow-auto">
          <motion.div 
            className="container mx-auto p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>

      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
      >
        <Button
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-2 border-white"
          onClick={() => setCurrentView('emergency')}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Zap className="h-6 w-6" />
          </motion.div>
        </Button>
      </motion.div>
    </div>
  );
}