import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, UserCheck, Clock, CheckCircle2, TrendingUp, 
  Plus, Activity, Award, AlertTriangle, ChevronRight, Eye
} from 'lucide-react';
import { internService } from '@/services/internService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

interface DashboardStats {
  totalInterns: number;
  activeInterns: number;
  pendingTasks: number;
  completedTasks: number;
}

interface RecentActivity {
  id: string;
  message: string;
  timestamp: string;
  type: 'success' | 'warning' | 'info';
}

interface TopPerformer {
  id: string;
  name: string;
  department: string;
  completedTasks: number;
  completionRate: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalInterns: 0,
    activeInterns: 0,
    pendingTasks: 0,
    completedTasks: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const statsData = await internService.getDashboardStats();
      setStats(statsData);
      setRecentActivities([
        { id: '1', message: 'Sarah Johnson joined Engineering team', timestamp: '2 hours ago', type: 'success' },
        { id: '2', message: 'Mike Chen completed API Documentation', timestamp: '4 hours ago', type: 'success' },
        { id: '3', message: 'Project deadline approaching for Emma Davis', timestamp: '6 hours ago', type: 'warning' },
        { id: '4', message: 'New task assigned to Alex Rodriguez', timestamp: '8 hours ago', type: 'info' },
      ]);
      setTopPerformers([
        { id: '1', name: 'Alice Cooper', department: 'Engineering', completedTasks: 24, completionRate: 95 },
        { id: '2', name: 'Bob Wilson', department: 'Design', completedTasks: 18, completionRate: 88 },
        { id: '3', name: 'Carol Brown', department: 'Marketing', completedTasks: 15, completionRate: 82 },
      ]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'info': return <Activity className="h-4 w-4 text-primary" />;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getDepartmentColor = (dept: string) => {
    const colors = {
      'Engineering': 'bg-blue-100 text-blue-800',
      'Marketing': 'bg-green-100 text-green-800',
      'Design': 'bg-purple-100 text-purple-800',
      'Sales': 'bg-orange-100 text-orange-800',
    };
    return colors[dept as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-slide-in-left">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your intern management overview.</p>
        </div>
        <Button onClick={() => navigate('/interns/add')} className="hover-lift hover-glow">
          <Plus className="mr-2 h-4 w-4" />
          Add Intern
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-slide-up">
        <Card className="hover-lift transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interns</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInterns}</div>
            <p className="text-xs text-muted-foreground">All registered interns</p>
          </CardContent>
        </Card>
        
        <Card className="hover-lift transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Interns</CardTitle>
            <UserCheck className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.activeInterns}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        
        <Card className="hover-lift transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.pendingTasks}</div>
            <p className="text-xs text-muted-foreground">Tasks in progress</p>
          </CardContent>
        </Card>
        
        <Card className="hover-lift transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.completedTasks}</div>
            <p className="text-xs text-muted-foreground">Tasks finished</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3 animate-slide-up">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 hover-lift transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div 
                  key={activity.id} 
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button variant="ghost" className="w-full hover-lift" onClick={() => navigate('/interns')}>
                View All Interns
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className="hover-lift transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <div 
                  key={performer.id} 
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                  onClick={() => navigate(`/interns/${performer.id}`)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold">
                      {getInitials(performer.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{performer.name}</p>
                    <Badge variant="outline" className={`text-xs ${getDepartmentColor(performer.department)}`}>
                      {performer.department}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{performer.completedTasks}</p>
                    <p className="text-xs text-muted-foreground">tasks</p>
                    <Progress value={performer.completionRate} className="w-12 h-1 mt-1" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button variant="ghost" className="w-full hover-lift" onClick={() => navigate('/interns')}>
                View All Performers
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-slide-up">
        <Card className="cursor-pointer hover-lift transition-smooth" onClick={() => navigate('/interns/add')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Add New Intern</h3>
                <p className="text-sm text-muted-foreground">Register a new intern</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover-lift transition-smooth" onClick={() => navigate('/interns')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-success/10">
                <Eye className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="font-semibold">View All Interns</h3>
                <p className="text-sm text-muted-foreground">Manage intern profiles</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover-lift transition-smooth" onClick={() => navigate('/interns')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-warning/10">
                <TrendingUp className="h-6 w-6 text-warning" />
              </div>
              <div>
                <h3 className="font-semibold">Performance</h3>
                <p className="text-sm text-muted-foreground">View analytics</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;