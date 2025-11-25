import { User, Search, Settings, LogOut, Moon, Sun, X, Shield, HelpCircle, Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NotificationCenter } from '@/components/NotificationCenter';
import { toast } from '@/components/ui/use-toast';
import { settingsService } from '@/services/settingsService';
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavbarProps {
  onMobileMenuClick?: () => void;
}

export const Navbar = ({ onMobileMenuClick }: NavbarProps) => {
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
  const [currentTime, setCurrentTime] = useState(new Date());
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClose = () => {
      setProfileOpen(false);
      setIsSearchOpen(false);
    };

    // Simple scroll handler that directly closes dropdowns
    const handleScroll = () => {
      if (profileOpen) {
        setProfileOpen(false);
      }
      if (isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    // Scroll events on multiple elements
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    document.body.addEventListener('scroll', handleScroll, { passive: true });
    
    // Touch move events for mobile scrolling
    document.addEventListener('touchmove', handleScroll, { passive: true });
    document.body.addEventListener('touchmove', handleScroll, { passive: true });
    
    // Find all scrollable containers
    const scrollableElements = [
      document.querySelector('main'),
      document.querySelector('[data-scroll-area]'),
      document.querySelector('.overflow-auto'),
      document.querySelector('.overflow-y-auto'),
      document.querySelector('.scroll-area')
    ].filter(Boolean);
    
    scrollableElements.forEach(element => {
      if (element) {
        element.addEventListener('scroll', handleScroll, { passive: true });
        element.addEventListener('touchmove', handleScroll, { passive: true });
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);
      document.body.removeEventListener('scroll', handleScroll);
      document.removeEventListener('touchmove', handleScroll);
      document.body.removeEventListener('touchmove', handleScroll);
      
      scrollableElements.forEach(element => {
        if (element) {
          element.removeEventListener('scroll', handleScroll);
          element.removeEventListener('touchmove', handleScroll);
        }
      });
    };
  }, [profileOpen, isSearchOpen]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getUserDisplayName = () => {
    return user?.full_name || user?.username || 'User';
  };

  const getUserEmail = () => {
    return user?.email || 'user@example.com';
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

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden hover:bg-accent transition-colors"
            onClick={onMobileMenuClick}
          >
            <Menu className="h-4 w-4" />
          </Button>
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

          <NotificationCenter />

          <DropdownMenu open={profileOpen} onOpenChange={setProfileOpen} modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={settingsService.getFullAvatarUrl(user?.avatar_url)} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {getInitials(getUserDisplayName())}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{getUserDisplayName()}</p>
                  <p className="text-xs leading-none text-muted-foreground">{getUserEmail()}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Shield className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-600">Admin</span>
                    {user?.department && (
                      <span className="text-xs text-muted-foreground">• {user.department}</span>
                    )}
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
