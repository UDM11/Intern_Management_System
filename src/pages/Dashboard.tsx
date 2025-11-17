import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, UserCheck, Clock, CheckCircle2, TrendingUp, Calendar, 
  Bell, Settings, Plus, Search, Filter, Download, RefreshCw,
  BarChart3, PieChart, Activity, Target, Award, AlertTriangle,
  ChevronRight, Eye, Edit, Trash2, MoreHorizontal
} from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { internService } from '@/services/internService';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { QuickActionsWidget } from '@/components/QuickActionsWidget';
import { PerformanceMetrics } from '@/components/PerformanceMetrics';
import { DashboardChart } from '@/components/DashboardChart';

interface DashboardStats {
  totalInterns: number;
  activeInterns: number;
  pendingTasks: number;
  completedTasks: number;
  newThisMonth: number;
  completionRate: number;
  avgTasksPerIntern: number;
  upcomingDeadlines: number;
}

interface RecentActivity {
  id: string;
  type: 'intern_joined' | 'task_completed' | 'task_assigned' | 'deadline_approaching';
  message: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
}

interface TopPerformer {
  id: string;
  name: string;
  department: string;
  completedTasks: number;
  avatar?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalInterns: 0,
    activeInterns: 0,
    pendingTasks: 0,
    completedTasks: 0,
    newThisMonth: 0,
    completionRate: 0,
    avgTasksPerIntern: 0,
    upcomingDeadlines: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('7d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [statsData, activitiesData, performersData] = await Promise.all([
        internService.getDashboardStats(),
        loadRecentActivities(),
        loadTopPerformers(),
      ]);
      
      setStats({
        ...statsData,
        newThisMonth: Math.floor(Math.random() * 15) + 5,
        completionRate: Math.floor(Math.random() * 30) + 70,
        avgTasksPerIntern: Math.floor(Math.random() * 5) + 3,
        upcomingDeadlines: Math.floor(Math.random() * 10) + 2,
      });
      setRecentActivities(activitiesData);
      setTopPerformers(performersData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecentActivities = async (): Promise<RecentActivity[]> => {
    // Mock data - replace with actual API call
    return [
      {
        id: '1',
        type: 'intern_joined',
        message: 'Sarah Johnson joined the Engineering team',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        priority: 'medium',
      },
      {
        id: '2',
        type: 'task_completed',
        message: 'Mike Chen completed "API Documentation" task',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        priority: 'low',
      },
      {
        id: '3',
        type: 'deadline_approaching',
        message: 'Project deadline in 2 days for Emma Davis',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        priority: 'high',
      },
      {
        id: '4',
        type: 'task_assigned',
        message: 'New task assigned to Alex Rodriguez',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        priority: 'medium',
      },
    ];
  };

  const loadTopPerformers = async (): Promise<TopPerformer[]> => {
    // Mock data - replace with actual API call
    return [
      { id: '1', name: 'Alice Cooper', department: 'Engineering', completedTasks: 24 },
      { id: '2', name: 'Bob Wilson', department: 'Design', completedTasks: 18 },
      { id: '3', name: 'Carol Brown', department: 'Marketing', completedTasks: 15 },
    ];
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
    toast({
      title: 'Success',
      description: 'Dashboard data refreshed',
    });
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'intern_joined': return <Users className="h-4 w-4" />;
      case 'task_completed': return <CheckCircle2 className="h-4 w-4" />;
      case 'task_assigned': return <Clock className="h-4 w-4" />;
      case 'deadline_approaching': return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: RecentActivity['priority']) => {
    switch (priority) {
      case 'high': return 'bg-destructive';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-success';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        
        <div className="grid gap-6 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Welcome back! Here's what's happening with your interns today.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={() => navigate('/interns/add')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Intern
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Interns"
          value={stats.totalInterns}
          icon={Users}
          description="All registered interns"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Active Interns"
          value={stats.activeInterns}
          icon={UserCheck}
          description="Currently active"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Pending Tasks"
          value={stats.pendingTasks}
          icon={Clock}
          description="Tasks in progress"
          trend={{ value: 5, isPositive: false }}
        />
        <StatCard
          title="Completed Tasks"
          value={stats.completedTasks}
          icon={CheckCircle2}
          description="Tasks finished"
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Additional Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">New This Month</CardTitle>
            <TrendingUp className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{stats.newThisMonth}</div>
            <p className="text-xs text-muted-foreground mt-1">+23% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
            <Target className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.completionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Above average</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Tasks/Intern</CardTitle>
            <BarChart3 className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">{stats.avgTasksPerIntern}</div>
            <p className="text-xs text-muted-foreground mt-1">Optimal workload</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Deadlines</CardTitle>
            <Calendar className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{stats.upcomingDeadlines}</div>
            <p className="text-xs text-muted-foreground mt-1">Next 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Recent Activity */}
        <Card className="lg:col-span-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <div className="flex items-center gap-2">
                <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                  <SelectTrigger className="w-24 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1d">1d</SelectItem>
                    <SelectItem value="7d">7d</SelectItem>
                    <SelectItem value="30d">30d</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {recentActivities.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50"
                >
                  <div className={`p-2 rounded-full ${getPriorityColor(activity.priority)} text-white`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{formatTimeAgo(activity.timestamp)}</p>
                  </div>
                  <Badge variant={activity.priority === 'high' ? 'destructive' : activity.priority === 'medium' ? 'default' : 'secondary'}>
                    {activity.priority}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button variant="ghost" className="w-full" onClick={() => navigate('/analytics')}>
                View All Activity
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className="lg:col-span-4">
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
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                  onClick={() => navigate(`/interns/${performer.id}`)}
                >
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-semibold">
                      {performer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    {index === 0 && (
                      <div className="absolute -top-1 -right-1 h-4 w-4 bg-warning rounded-full flex items-center justify-center">
                        <Award className="h-2 w-2 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{performer.name}</p>
                    <p className="text-xs text-muted-foreground">{performer.department}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-success">{performer.completedTasks}</p>
                    <p className="text-xs text-muted-foreground">tasks</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button variant="ghost" className="w-full" onClick={() => navigate('/interns')}>
                View All Interns
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics Section */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 xl:grid-cols-2">
        <DashboardChart
          title="Task Completion Trends"
          type="line"
          data={{
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              label: 'Completed Tasks',
              data: [65, 78, 90, 81, 95, 102],
              borderColor: 'hsl(var(--primary))',
              backgroundColor: 'hsl(var(--primary) / 0.1)'
            }]
          }}
          height={250}
        />
        
        <DashboardChart
          title="Department Distribution"
          type="pie"
          data={{
            labels: ['Engineering', 'Design', 'Marketing', 'HR', 'Sales'],
            datasets: [{
              label: 'Interns by Department',
              data: [35, 25, 20, 12, 8],
              backgroundColor: [
                'hsl(var(--primary))',
                'hsl(var(--success))',
                'hsl(var(--warning))',
                'hsl(var(--destructive))',
                'hsl(var(--muted-foreground))'
              ]
            }]
          }}
          height={250}
        />
      </div>

      {/* Performance and Actions Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <PerformanceMetrics className="lg:col-span-2" />
        <QuickActionsWidget />
      </div>

      {/* Quick Actions Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="cursor-pointer" onClick={() => navigate('/interns/add')}>
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
        
        <Card className="cursor-pointer" onClick={() => navigate('/interns')}>
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
        
        <Card className="cursor-pointer" onClick={() => navigate('/analytics')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-warning/10">
                <PieChart className="h-6 w-6 text-warning" />
              </div>
              <div>
                <h3 className="font-semibold">Analytics</h3>
                <p className="text-sm text-muted-foreground">View detailed reports</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer" onClick={() => navigate('/settings')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-muted">
                <Settings className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Settings</h3>
                <p className="text-sm text-muted-foreground">Configure system</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
