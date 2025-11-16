import { Bell, User, Search, Settings, LogOut, Moon, Sun, X, Shield, HelpCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New intern registered', message: 'John Doe has been added to the system', time: '2m ago', type: 'info', unread: true },
    { id: 2, title: 'Internship completed', message: 'Sarah Smith completed her internship', time: '1h ago', type: 'success', unread: true },
    { id: 3, title: 'System update', message: 'New features are now available', time: '3h ago', type: 'info', unread: false }
  ]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClose = () => {
      setNotificationOpen(false);
      setProfileOpen(false);
    };

    // Scroll events
    window.addEventListener('scroll', handleClose, { passive: true });
    document.addEventListener('scroll', handleClose, { passive: true });
    
    // Touch move events for mobile scrolling (not touchstart to avoid immediate close)
    document.addEventListener('touchmove', handleClose, { passive: true });
    
    // Main content scroll
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.addEventListener('scroll', handleClose, { passive: true });
      mainContent.addEventListener('touchmove', handleClose, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', handleClose);
      document.removeEventListener('scroll', handleClose);
      document.removeEventListener('touchmove', handleClose);
      if (mainContent) {
        mainContent.removeEventListener('scroll', handleClose);
        mainContent.removeEventListener('touchmove', handleClose);
      }
    };
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/dashboard': return 'Dashboard';
      case '/interns': return 'Interns';
      case '/analytics': return 'Analytics';
      case '/settings': return 'Settings';
      default: return 'Intern Management';
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    toast({
      title: `Switched to ${!isDark ? 'dark' : 'light'} mode`,
      duration: 2000,
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: 'Search functionality',
        description: `Searching for: "${searchQuery}"`,
        duration: 3000,
      });
      // Navigate to search results or filter current page
      if (location.pathname === '/interns') {
        // Filter interns if on interns page
      } else {
        navigate(`/interns?search=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  const handleNotificationClick = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, unread: false }
          : notif
      )
    );
    toast({
      title: 'Notification opened',
      description: 'Marked as read',
      duration: 2000,
    });
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, unread: false })));
    toast({
      title: 'All notifications marked as read',
      duration: 2000,
    });
  };

  const handleProfileClick = () => {
    toast({
      title: 'Profile',
      description: 'Profile page coming soon',
      duration: 2000,
    });
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleHelpClick = () => {
    toast({
      title: 'Help & Support',
      description: 'Help documentation coming soon',
      duration: 2000,
    });
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col">
            <h1 className="text-lg font-semibold text-foreground">{getPageTitle()}</h1>
            <p className="text-xs text-muted-foreground">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <h1 className="md:hidden text-lg font-semibold text-foreground">{getPageTitle()}</h1>
        </div>

        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search interns, analytics..."
              className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
            />
          </form>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden hover:bg-accent transition-colors"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            {isSearchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="hover:bg-accent transition-colors"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <DropdownMenu open={notificationOpen} onOpenChange={setNotificationOpen}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative hover:bg-accent transition-colors"
                title="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center animate-pulse"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{notifications.length}</Badge>
                  {unreadCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-xs"
                      onClick={clearAllNotifications}
                    >
                      Mark all read
                    </Button>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem 
                    key={notification.id}
                    className="flex flex-col items-start p-4 cursor-pointer hover:bg-accent"
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div className={`h-2 w-2 rounded-full ${
                        notification.unread 
                          ? notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                          : 'bg-muted-foreground/30'
                      }`} />
                      <span className={`font-medium text-sm ${
                        notification.unread ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {notification.title}
                      </span>
                      <span className="text-xs text-muted-foreground ml-auto">{notification.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 pl-4">{notification.message}</p>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No notifications
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu open={profileOpen} onOpenChange={setProfileOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {user ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email || 'user@example.com'}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Shield className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-600">Admin</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer hover:bg-accent" onClick={handleProfileClick}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-accent" onClick={handleSettingsClick}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-accent" onClick={handleHelpClick}>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isSearchOpen && (
        <div className="lg:hidden border-t border-border/40 p-4 animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search interns, analytics..."
              className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
              autoFocus
            />
          </form>
        </div>
      )}
    </header>
  );
};
