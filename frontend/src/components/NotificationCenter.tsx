import { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  Check, 
  AlertTriangle, 
  Info, 
  CheckCircle2,
  Clock,
  Users,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

interface NotificationCenterProps {
  className?: string;
}

export const NotificationCenter = ({ className }: NotificationCenterProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        addNewNotification();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  const loadNotifications = () => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'info',
        title: 'New Intern Registered',
        message: 'Sarah Johnson has joined the Engineering team',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        read: false,
        priority: 'medium',
        actionUrl: '/interns/sarah-johnson'
      },
      {
        id: '2',
        type: 'warning',
        title: 'Deadline Approaching',
        message: 'Project submission due in 2 days for Mike Chen',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        read: false,
        priority: 'high',
        actionUrl: '/interns/mike-chen'
      },
      {
        id: '3',
        type: 'success',
        title: 'Task Completed',
        message: 'Emma Davis completed "API Documentation" task',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        read: true,
        priority: 'low'
      },
      {
        id: '4',
        type: 'error',
        title: 'Task Overdue',
        message: 'Database migration task is overdue for Alex Rodriguez',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        read: false,
        priority: 'high',
        actionUrl: '/interns/alex-rodriguez'
      }
    ];
    
    setNotifications(mockNotifications);
  };

  const addNewNotification = () => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      type: ['info', 'success', 'warning'][Math.floor(Math.random() * 3)] as Notification['type'],
      title: 'System Update',
      message: 'A new system event has occurred',
      timestamp: new Date().toISOString(),
      read: false,
      priority: 'medium'
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info': return <Info className="h-4 w-4" />;
      case 'success': return <CheckCircle2 className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'info': return 'text-blue-500 bg-blue-50';
      case 'success': return 'text-success bg-success/10';
      case 'warning': return 'text-warning bg-warning/10';
      case 'error': return 'text-destructive bg-destructive/10';
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high': return 'border-l-destructive';
      case 'medium': return 'border-l-warning';
      case 'low': return 'border-l-success';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "relative transition-all duration-200 hover:scale-105",
            className
          )}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs animate-pulse"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-96 p-0 animate-in slide-in-from-top-2 duration-200" 
        align="end"
      >
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Mark all read
                  </Button>
                )}
                <Badge variant="secondary">{notifications.length}</Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification, index) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 border-l-4 transition-all duration-200 hover:bg-muted/50 cursor-pointer animate-in slide-in-from-right-2",
                        getPriorityColor(notification.priority),
                        !notification.read && "bg-muted/30"
                      )}
                      onClick={() => !notification.read && markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "p-2 rounded-full flex-shrink-0",
                          getNotificationColor(notification.type)
                        )}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4 className={cn(
                                "text-sm font-medium",
                                !notification.read && "font-semibold"
                              )}>
                                {notification.title}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {formatTimeAgo(notification.timestamp)}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          {notification.actionUrl && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-2 h-6 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log('Navigate to:', notification.actionUrl);
                              }}
                            >
                              View Details
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {notifications.length > 0 && (
              <div className="p-3 border-t">
                <Button
                  variant="ghost"
                  className="w-full text-sm"
                  onClick={() => {
                    setIsOpen(false);
                    console.log('Navigate to notifications page');
                  }}
                >
                  View All Notifications
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};