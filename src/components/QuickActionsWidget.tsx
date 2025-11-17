import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Users, 
  FileText, 
  Calendar, 
  Settings, 
  Download,
  Upload,
  Search,
  Filter,
  BarChart3,
  Mail,
  Phone,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  color: string;
  badge?: string;
  disabled?: boolean;
}

interface QuickActionsWidgetProps {
  className?: string;
  compact?: boolean;
}

export const QuickActionsWidget = ({ className, compact = false }: QuickActionsWidgetProps) => {
  const navigate = useNavigate();
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  const quickActions: QuickAction[] = [
    {
      id: 'add-intern',
      title: 'Add New Intern',
      description: 'Register a new intern in the system',
      icon: Plus,
      action: () => navigate('/interns/add'),
      color: 'bg-primary/10 hover:bg-primary/20 text-primary',
    },
    {
      id: 'view-interns',
      title: 'View All Interns',
      description: 'Browse and manage intern profiles',
      icon: Users,
      action: () => navigate('/interns'),
      color: 'bg-success/10 hover:bg-success/20 text-success',
    },
    {
      id: 'generate-report',
      title: 'Generate Report',
      description: 'Create performance and analytics reports',
      icon: FileText,
      action: () => {
        toast({
          title: 'Report Generation',
          description: 'Report generation feature coming soon',
        });
      },
      color: 'bg-warning/10 hover:bg-warning/20 text-warning',
      badge: 'Soon'
    },
    {
      id: 'schedule-meeting',
      title: 'Schedule Meeting',
      description: 'Set up meetings with interns',
      icon: Calendar,
      action: () => {
        toast({
          title: 'Meeting Scheduler',
          description: 'Meeting scheduler feature coming soon',
        });
      },
      color: 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-500',
      badge: 'Soon'
    },
    {
      id: 'analytics',
      title: 'View Analytics',
      description: 'Check performance metrics and insights',
      icon: BarChart3,
      action: () => navigate('/analytics'),
      color: 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-500',
    },
    {
      id: 'settings',
      title: 'System Settings',
      description: 'Configure system preferences',
      icon: Settings,
      action: () => navigate('/settings'),
      color: 'bg-muted hover:bg-muted/80 text-muted-foreground',
    },
    {
      id: 'export-data',
      title: 'Export Data',
      description: 'Download intern data and reports',
      icon: Download,
      action: () => {
        toast({
          title: 'Data Export',
          description: 'Preparing data export...',
        });
      },
      color: 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-500',
    },
    {
      id: 'import-data',
      title: 'Import Data',
      description: 'Bulk import intern information',
      icon: Upload,
      action: () => {
        toast({
          title: 'Data Import',
          description: 'Data import feature coming soon',
        });
      },
      color: 'bg-teal-500/10 hover:bg-teal-500/20 text-teal-500',
      badge: 'Soon'
    },
  ];

  const displayActions = compact ? quickActions.slice(0, 4) : quickActions;

  return (
    <Card className={cn(
      "animate-in slide-in-from-bottom-5 duration-500 hover:shadow-lg transition-all",
      className
    )}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Quick Actions
          <Badge variant="secondary" className="ml-auto">
            {displayActions.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className={cn(
          "grid gap-3",
          compact ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-1"
        )}>
          {displayActions.map((action, index) => {
            const Icon = action.icon;
            
            return (
              <Button
                key={action.id}
                variant="ghost"
                className={cn(
                  "h-auto p-4 justify-start transition-all duration-200 group relative overflow-hidden animate-in slide-in-from-left-3",
                  action.color,
                  action.disabled && "opacity-50 cursor-not-allowed"
                )}
                onClick={action.action}
                disabled={action.disabled}
                onMouseEnter={() => setHoveredAction(action.id)}
                onMouseLeave={() => setHoveredAction(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                <div className="flex items-center gap-3 w-full relative z-10">
                  <div className={cn(
                    "p-2 rounded-lg transition-all duration-200 group-hover:scale-110",
                    hoveredAction === action.id && "animate-pulse"
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{action.title}</h4>
                      {action.badge && (
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          {action.badge}
                        </Badge>
                      )}
                    </div>
                    {!compact && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {action.description}
                      </p>
                    )}
                  </div>
                  
                  <div className={cn(
                    "transition-transform duration-200",
                    hoveredAction === action.id && "translate-x-1"
                  )}>
                    <div className="w-2 h-2 rounded-full bg-current opacity-30" />
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
        
        {compact && quickActions.length > 4 && (
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="ghost"
              className="w-full text-sm"
              onClick={() => {
                toast({
                  title: 'Quick Actions',
                  description: 'Showing all available actions',
                });
              }}
            >
              View All Actions ({quickActions.length - 4} more)
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};