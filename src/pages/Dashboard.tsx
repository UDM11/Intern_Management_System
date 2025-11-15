import { useEffect, useState } from 'react';
import { Users, UserCheck, Clock, CheckCircle2 } from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { internService } from '@/services/internService';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalInterns: 0,
    activeInterns: 0,
    pendingTasks: 0,
    completedTasks: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const data = await internService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your Intern Management System</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your Intern Management System</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Interns"
          value={stats.totalInterns}
          icon={Users}
          description="All registered interns"
        />
        <StatCard
          title="Active Interns"
          value={stats.activeInterns}
          icon={UserCheck}
          description="Currently active"
        />
        <StatCard
          title="Pending Tasks"
          value={stats.pendingTasks}
          icon={Clock}
          description="Tasks in progress"
        />
        <StatCard
          title="Completed Tasks"
          value={stats.completedTasks}
          icon={CheckCircle2}
          description="Tasks finished"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="h-2 w-2 rounded-full bg-success" />
              <span className="text-muted-foreground">New intern John Doe joined Engineering</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">Task assigned to Jane Smith</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="h-2 w-2 rounded-full bg-warning" />
              <span className="text-muted-foreground">Upcoming deadline for Bob Johnson</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a
              href="/interns/add"
              className="block rounded-md bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground transition-smooth hover:bg-primary-dark"
            >
              Add New Intern
            </a>
            <a
              href="/interns"
              className="block rounded-md bg-secondary px-4 py-3 text-center text-sm font-medium text-secondary-foreground transition-smooth hover:bg-muted"
            >
              View All Interns
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
