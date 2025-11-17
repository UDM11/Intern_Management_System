import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Award, 
  Clock, 
  CheckCircle2,
  AlertTriangle,
  Users,
  Calendar,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface MetricData {
  id: string;
  title: string;
  value: number;
  target: number;
  unit: string;
  trend: {
    value: number;
    isPositive: boolean;
    period: string;
  };
  status: 'excellent' | 'good' | 'warning' | 'critical';
  description: string;
}

interface PerformanceMetricsProps {
  className?: string;
  showDetails?: boolean;
}

export const PerformanceMetrics = ({ className, showDetails = true }: PerformanceMetricsProps) => {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockMetrics: MetricData[] = [
      {
        id: 'completion-rate',
        title: 'Task Completion Rate',
        value: 87,
        target: 90,
        unit: '%',
        trend: { value: 5.2, isPositive: true, period: 'vs last month' },
        status: 'good',
        description: 'Percentage of tasks completed on time'
      },
      {
        id: 'intern-satisfaction',
        title: 'Intern Satisfaction',
        value: 4.6,
        target: 4.5,
        unit: '/5',
        trend: { value: 0.3, isPositive: true, period: 'vs last quarter' },
        status: 'excellent',
        description: 'Average satisfaction rating from intern feedback'
      },
      {
        id: 'avg-response-time',
        title: 'Avg Response Time',
        value: 2.3,
        target: 2.0,
        unit: 'hrs',
        trend: { value: 0.5, isPositive: false, period: 'vs last week' },
        status: 'warning',
        description: 'Average time to respond to intern queries'
      },
      {
        id: 'retention-rate',
        title: 'Retention Rate',
        value: 94,
        target: 85,
        unit: '%',
        trend: { value: 8.1, isPositive: true, period: 'vs last year' },
        status: 'excellent',
        description: 'Percentage of interns who complete their program'
      },
      {
        id: 'skill-improvement',
        title: 'Skill Improvement',
        value: 78,
        target: 75,
        unit: '%',
        trend: { value: 3.7, isPositive: true, period: 'vs baseline' },
        status: 'good',
        description: 'Average skill improvement during internship'
      },
      {
        id: 'mentor-engagement',
        title: 'Mentor Engagement',
        value: 68,
        target: 80,
        unit: '%',
        trend: { value: 2.1, isPositive: false, period: 'vs last month' },
        status: 'warning',
        description: 'Active mentor participation in intern development'
      }
    ];
    
    setMetrics(mockMetrics);
    setIsLoading(false);
  };

  const getStatusColor = (status: MetricData['status']) => {
    switch (status) {
      case 'excellent': return 'text-success bg-success/10 border-success/20';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'warning': return 'text-warning bg-warning/10 border-warning/20';
      case 'critical': return 'text-destructive bg-destructive/10 border-destructive/20';
    }
  };

  const getStatusIcon = (status: MetricData['status']) => {
    switch (status) {
      case 'excellent': return <Award className="h-4 w-4" />;
      case 'good': return <CheckCircle2 className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const calculateProgress = (value: number, target: number) => {
    return Math.min((value / target) * 100, 100);
  };

  if (isLoading) {
    return (
      <Card className={cn("animate-pulse", className)}>
        <CardHeader>
          <div className="h-6 bg-muted rounded w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted rounded w-32" />
                <div className="h-2 bg-muted rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "animate-in slide-in-from-right-5 duration-500 hover:shadow-lg transition-all",
      className
    )}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Performance Metrics
          <Badge variant="secondary" className="ml-auto">
            {metrics.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric, index) => {
            const progress = calculateProgress(metric.value, metric.target);
            const isSelected = selectedMetric === metric.id;
            
            return (
              <div
                key={metric.id}
                className={cn(
                  "p-4 rounded-lg border transition-all duration-200 cursor-pointer animate-in slide-in-from-right-3",
                  getStatusColor(metric.status),
                  isSelected && "ring-2 ring-primary/20 scale-[1.02]"
                )}
                onClick={() => setSelectedMetric(isSelected ? null : metric.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(metric.status)}
                    <h4 className="font-medium text-sm">{metric.title}</h4>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold">{metric.value}</span>
                      <span className="text-xs text-muted-foreground">{metric.unit}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      {metric.trend.isPositive ? (
                        <TrendingUp className="h-3 w-3 text-success" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-destructive" />
                      )}
                      <span className={metric.trend.isPositive ? 'text-success' : 'text-destructive'}>
                        {metric.trend.isPositive ? '+' : ''}{metric.trend.value}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Target: {metric.target}{metric.unit}</span>
                    <span className="font-medium">{progress.toFixed(0)}% of target</span>
                  </div>
                  
                  <Progress 
                    value={progress} 
                    className="h-2"
                  />
                </div>
                
                {showDetails && isSelected && (
                  <div className="mt-3 pt-3 border-t border-current/10 animate-in slide-in-from-top-2 duration-200">
                    <p className="text-xs text-muted-foreground mb-2">
                      {metric.description}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{metric.trend.period}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('View details for:', metric.id);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="text-muted-foreground">Overall Performance: </span>
              <span className="font-medium text-success">Good</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                console.log('Navigate to analytics');
              }}
            >
              View Full Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};