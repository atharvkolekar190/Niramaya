import React, { useState } from 'react';
import { Header } from './components/Header';
import { DonorDashboard } from './components/DonorDashboard';
import { ReceiverDashboard } from './components/ReceiverDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { MapView } from './components/MapView';
import { ChatInterface } from './components/ChatInterface';
import { SafetyGuidelines } from './components/SafetyGuidelines';
import { Button } from './components/ui/button';
import { BloodDropIcon } from './components/BloodDropIcon';
import { 
  LayoutDashboard, 
  MapPin, 
  MessageCircle, 
  Shield, 
  Calendar,
  Settings
} from 'lucide-react';

type UserRole = 'donor' | 'receiver' | 'admin';
type ActiveTab = 'dashboard' | 'map' | 'chat' | 'safety' | 'schedule' | 'settings';

export default function App() {
  const [currentUser, setCurrentUser] = useState({
    name: 'Alex Johnson',
    role: 'donor' as UserRole,
    bloodType: 'O+'
  });
  
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  const handleRoleChange = (role: UserRole) => {
    setCurrentUser(prev => ({
      ...prev,
      role,
      // Update blood type based on role for demo
      bloodType: role === 'donor' ? 'O+' : role === 'receiver' ? 'A-' : undefined
    }));
    setActiveTab('dashboard'); // Reset to dashboard when switching roles
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'map', label: 'Find Donors', icon: MapPin },
    { id: 'chat', label: 'Messages', icon: MessageCircle },
    { id: 'safety', label: 'Safety Guide', icon: Shield },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        if (currentUser.role === 'donor') return <DonorDashboard />;
        if (currentUser.role === 'receiver') return <ReceiverDashboard />;
        if (currentUser.role === 'admin') return <AdminDashboard />;
        break;
      case 'map':
        return <MapView />;
      case 'chat':
        return <ChatInterface />;
      case 'safety':
        return <SafetyGuidelines />;
      case 'schedule':
        return <div className="p-6"><h2>Schedule Management - Coming Soon</h2></div>;
      case 'settings':
        return <div className="p-6"><h2>Settings - Coming Soon</h2></div>;
      default:
        return <DonorDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentUser={currentUser} onRoleChange={handleRoleChange} />
      
      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab(item.id as ActiveTab)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>

          {/* Quick Stats Sidebar */}
          <div className="p-4 border-t border-gray-200 mt-auto">
            <div className="space-y-3">
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <BloodDropIcon className="text-primary mx-auto mb-1" size={24} />
                <p className="text-sm font-medium">Today's Goal</p>
                <p className="text-xs text-muted-foreground">Help save 3 lives</p>
              </div>
              
              {currentUser.role === 'donor' && (
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium">Next Eligible</p>
                  <p className="text-lg font-bold text-green-600">42 days</p>
                </div>
              )}
              
              {currentUser.role === 'receiver' && (
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium">Active Requests</p>
                  <p className="text-lg font-bold text-blue-600">2</p>
                </div>
              )}
              
              {currentUser.role === 'admin' && (
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium">Pending Reviews</p>
                  <p className="text-lg font-bold text-purple-600">8</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {renderContent()}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BloodDropIcon className="text-primary" size={16} />
            <p className="text-sm text-muted-foreground">
              © 2025 BloodConnect. Saving lives, one donation at a time.
            </p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>Emergency: 1-800-BLOOD-HELP</span>
            <span>•</span>
            <span>Available 24/7</span>
          </div>
        </div>
      </footer>
    </div>
  );
}