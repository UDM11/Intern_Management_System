import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatCard = ({ title, value, icon: Icon, description, trend, className }: StatCardProps) => {
  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-l-4 border-l-primary/20 hover:border-l-primary",
      className
    )}>
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          {title}
        </CardTitle>
        <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="text-3xl font-bold text-foreground mb-1 transition-all duration-300 group-hover:text-primary">
          {typeof value === 'number' ? (
            <span className="tabular-nums">{value.toLocaleString()}</span>
          ) : (
            value
          )}
        </div>
        
        {description && (
          <p className="text-xs text-muted-foreground mb-2 transition-colors group-hover:text-muted-foreground/80">
            {description}
          </p>
        )}
        
        {trend && (
          <div className="flex items-center gap-1 text-xs">
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full transition-all duration-300",
              trend.isPositive 
                ? "bg-success/10 text-success hover:bg-success/20" 
                : "bg-destructive/10 text-destructive hover:bg-destructive/20"
            )}>
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span className="font-medium">
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            </div>
            <span className="text-muted-foreground ml-1">vs last month</span>
          </div>
        )}
      </CardContent>
      
      {/* Animated border effect */}
      <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-primary/20 transition-all duration-300" />
    </Card>
  );
};
