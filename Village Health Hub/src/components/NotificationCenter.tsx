import React, { useState, useEffect } from 'react';
import { Bell, X, Check, AlertTriangle, Heart, Calendar, MapPin, Pill, Users, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface NotificationCenterProps {
  userRole: string | null;
  isOnline: boolean;
  emergencyMode: boolean;
}

export function NotificationCenter({ userRole, isOnline, emergencyMode }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'appointment',
      title: 'Upcoming Appointment',
      message: 'Dr. Sarah Johnson consultation in 30 minutes',
      time: '30 min ago',
      read: false,
      priority: 'high',
      icon: Calendar,
      color: 'text-blue-500'
    },
    {
      id: 2,
      type: 'emergency',
      title: 'Emergency Alert',
      message: 'Emergency services activated for patient in Kotagiri Village',
      time: '1 hour ago',
      read: false,
      priority: 'urgent',
      icon: Zap,
      color: 'text-red-500'
    },
    {
      id: 3,
      type: 'medicine',
      title: 'Medicine Reminder',
      message: 'Time to take your blood pressure medication',
      time: '2 hours ago',
      read: true,
      priority: 'medium',
      icon: Pill,
      color: 'text-green-500'
    },
    {
      id: 4,
      type: 'health',
      title: 'Health Tip',
      message: 'You\'ve reached your daily step goal of 8,000 steps!',
      time: '4 hours ago',
      read: false,
      priority: 'low',
      icon: Heart,
      color: 'text-pink-500'
    },
    {
      id: 5,
      type: 'hub',
      title: 'New Hub Available',
      message: 'A new health hub has opened in Hillview Colony',
      time: '1 day ago',
      read: true,
      priority: 'low',
      icon: MapPin,
      color: 'text-purple-500'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-red-500 bg-red-50 dark:bg-red-950';
      case 'high': return 'border-orange-500 bg-orange-50 dark:bg-orange-950';
      case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950';
      case 'low': return 'border-blue-500 bg-blue-50 dark:bg-blue-950';
      default: return 'border-gray-500 bg-gray-50 dark:bg-gray-950';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark All Read
            </Button>
          </div>
        </div>
        <CardDescription>
          Stay updated with important health information and alerts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 max-h-96 overflow-y-auto">
        {notifications.map((notification, index) => {
          const Icon = notification.icon;
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 border rounded-lg transition-all cursor-pointer ${
                notification.read 
                  ? 'border-border bg-muted/30' 
                  : `${getPriorityColor(notification.priority)} border-l-4`
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${
                  notification.read ? 'bg-muted' : 'bg-white dark:bg-gray-800'
                }`}>
                  <Icon className={`h-4 w-4 ${notification.color}`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-medium ${notification.read ? 'text-muted-foreground' : ''}`}>
                      {notification.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {notification.priority}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {notification.time}
                      </span>
                    </div>
                  </div>
                  
                  <p className={`text-sm ${
                    notification.read ? 'text-muted-foreground' : 'text-foreground'
                  }`}>
                    {notification.message}
                  </p>
                  
                  <div className="flex gap-2 mt-3">
                    {!notification.read && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Mark Read
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
        
        {notifications.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No notifications at the moment</p>
            <p className="text-sm">You're all caught up!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}