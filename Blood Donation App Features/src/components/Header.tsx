import React from 'react';
import { BloodDropIcon } from './BloodDropIcon';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Bell, Settings, User } from 'lucide-react';

interface HeaderProps {
  currentUser: {
    name: string;
    role: 'donor' | 'receiver' | 'admin';
    bloodType?: string;
  };
  onRoleChange: (role: 'donor' | 'receiver' | 'admin') => void;
}

export function Header({ currentUser, onRoleChange }: HeaderProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'donor':
        return 'bg-green-100 text-green-800';
      case 'receiver':
        return 'bg-blue-100 text-blue-800';
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BloodDropIcon className="text-primary" size={32} />
          <div>
            <h1 className="text-xl font-bold text-primary">BloodConnect</h1>
            <p className="text-sm text-muted-foreground">Saving lives together</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Role Switcher for Demo */}
          <div className="flex space-x-2">
            <Button
              variant={currentUser.role === 'donor' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onRoleChange('donor')}
              className="text-xs"
            >
              Donor
            </Button>
            <Button
              variant={currentUser.role === 'receiver' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onRoleChange('receiver')}
              className="text-xs"
            >
              Patient
            </Button>
            {/* Admin role toggle removed per requirement */}
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
              <Badge className="ml-1 h-5 w-5 rounded-full bg-primary text-xs">3</Badge>
            </Button>
            
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                <p className="font-medium">{currentUser.name}</p>
                <div className="flex items-center space-x-1">
                  <Badge className={getRoleColor(currentUser.role)}>
                    {currentUser.role}
                  </Badge>
                  {currentUser.bloodType && (
                    <Badge variant="outline" className="text-primary">
                      {currentUser.bloodType}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}