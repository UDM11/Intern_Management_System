import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Settings,
  Menu, 
  X, 
  Search,
  LogOut
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  isMobile?: boolean;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  badge?: string | number;
  isNew?: boolean;
}

const getNavigationItems = (): NavigationItem[] => [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: LayoutDashboard
  },
  { 
    name: 'Interns', 
    href: '/interns', 
    icon: Users
  },
  { 
    name: 'Analytics', 
    href: '/analytics', 
    icon: BarChart3
  },
  { 
    name: 'Settings', 
    href: '/settings', 
    icon: Settings
  }
];

export function Sidebar({ collapsed, onToggle, isMobile: isMobileProp }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const isMobileHook = useIsMobile();
  const isMobile = isMobileProp ?? isMobileHook;
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = getNavigationItems();

  const filteredNavigation = navigation.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderNavigationItem = (item: NavigationItem) => {
    return (
      <div key={item.name}>
        <div className="relative group">
          <NavLink
            to={item.href}
            end
            className={cn(
              'flex items-center justify-between px-3 py-2.5 rounded-lg text-sidebar-foreground transition-all duration-200',
              'pl-3'
            )}
            activeClassName="text-white font-medium shadow-sm"
            style={location.pathname === item.href ? { backgroundColor: '#1f2937' } : {}}
          >
            <div className="flex items-center space-x-3">
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {(!collapsed || isMobile) && (
                <>
                  <span className="font-medium">{item.name}</span>
                  {item.badge && !loading && (
                    <Badge 
                      variant={typeof item.badge === 'string' ? 'secondary' : 'default'} 
                      className="text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </div>
            {item.isNew && (!collapsed || isMobile) && (
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            )}
          </NavLink>
          
          {/* Tooltip for collapsed state */}
          {collapsed && !isMobile && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              {item.name}
              {item.badge && !loading && (
                <span className="ml-2 px-1.5 py-0.5 bg-primary rounded text-xs">
                  {item.badge}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-gradient-to-b from-sidebar to-sidebar/95 backdrop-blur-sm border-r border-sidebar-border/50 transition-all duration-300 shadow-xl',
          'hidden md:block',
          collapsed ? 'w-16' : 'w-72'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border/50 bg-gradient-to-r from-primary/10 to-primary/5">
            {!collapsed && (
              <div>
                <span className="font-bold text-lg text-blue-600">Intern MS</span>
                <p className="text-xs text-muted-foreground">Management System</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="text-sidebar-foreground hover:bg-sidebar-accent h-8 w-8"
            >
              {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </Button>
          </div>

          {/* Search Bar */}
          {!collapsed && (
            <div className="p-4 border-b border-sidebar-border/30">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search navigation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-sidebar-accent/50 border-sidebar-border/50 focus:border-primary/50 text-white placeholder:text-gray-400"
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
            {filteredNavigation.map(item => renderNavigationItem(item))}
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-sidebar-border/30">
            <Button
              onClick={logout}
              variant="ghost"
              className="w-full flex items-center justify-start px-3 py-2.5 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-all duration-200"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <span className="ml-3 font-medium">Logout</span>
              )}
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-sidebar to-sidebar/95 backdrop-blur-sm border-t border-sidebar-border/50 shadow-xl">
        <div className="flex items-center justify-around px-2 py-3">
          {navigation.slice(0, 4).map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end
              className="flex flex-col items-center justify-center p-2 rounded-lg text-sidebar-foreground transition-all duration-200 min-w-0 flex-1 relative"
              activeClassName="text-white font-medium"
              style={location.pathname === item.href ? { backgroundColor: '#1f2937' } : {}}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium truncate">{item.name}</span>
              {item.badge && !loading && (
                <Badge 
                  variant={typeof item.badge === 'string' ? 'secondary' : 'default'} 
                  className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs min-w-4"
                >
                  {typeof item.badge === 'number' && item.badge > 99 ? '99+' : item.badge}
                </Badge>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}

export { Sidebar as default };