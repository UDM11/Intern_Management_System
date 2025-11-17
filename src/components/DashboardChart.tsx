import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

interface DashboardChartProps {
  title: string;
  type: 'bar' | 'pie' | 'line';
  data: ChartData;
  height?: number;
  showControls?: boolean;
  className?: string;
}

export const DashboardChart = ({ 
  title, 
  type, 
  data, 
  height = 300, 
  showControls = true,
  className = '' 
}: DashboardChartProps) => {
  const [chartType, setChartType] = useState(type);
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleExport = () => {
    // Implement chart export functionality
    console.log('Exporting chart data...');
  };

  const renderChart = () => {
    // This is a simplified chart representation
    // In a real implementation, you would use a charting library like Chart.js or Recharts
    const maxValue = Math.max(...data.datasets[0].data);
    
    if (chartType === 'bar') {
      return (
        <div className="space-y-3">
          {data.labels.map((label, index) => {
            const value = data.datasets[0].data[index];
            const percentage = (value / maxValue) * 100;
            
            return (
              <div key={label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    
    if (chartType === 'pie') {
      const total = data.datasets[0].data.reduce((sum, value) => sum + value, 0);
      
      return (
        <div className="space-y-3 sm:space-y-4 h-full flex flex-col">
          <div className="relative mx-auto w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 flex-shrink-0">
            {/* Simplified pie chart representation */}
            <div className="w-full h-full rounded-full bg-gradient-to-br from-primary via-primary-light to-success relative overflow-hidden">
              <div className="absolute inset-2 sm:inset-3 md:inset-4 bg-card rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold">{total}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-1 sm:space-y-2 flex-1 overflow-y-auto">
            {data.labels.map((label, index) => {
              const value = data.datasets[0].data[index];
              const percentage = ((value / total) * 100).toFixed(1);
              
              return (
                <div key={label} className="flex items-center justify-between text-xs sm:text-sm py-1">
                  <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
                    <div 
                      className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                      style={{ 
                        backgroundColor: data.datasets[0].backgroundColor?.[index] || 
                        `hsl(${(index * 137.5) % 360}, 70%, 50%)` 
                      }}
                    />
                    <span className="text-muted-foreground truncate">{label}</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <span className="font-medium">{value}</span>
                    <span className="text-xs text-muted-foreground">({percentage}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    
    // Line chart (simplified)
    return (
      <div className="space-y-2 sm:space-y-4 h-full flex flex-col">
        <div className="flex-1 flex items-end justify-between gap-1 sm:gap-2 px-2 sm:px-4 min-h-0">
          {data.datasets[0].data.map((value, index) => {
            const height = (value / maxValue) * 100;
            
            return (
              <div key={index} className="flex flex-col items-center gap-1 sm:gap-2 flex-1 min-w-0">
                <div 
                  className="w-full bg-gradient-to-t from-primary to-primary-light rounded-t-sm transition-all duration-1000 ease-out min-h-[4px]"
                  style={{ height: `${Math.max(height, 5)}%` }}
                />
                <span className="text-xs text-muted-foreground text-center truncate w-full">
                  {data.labels[index]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Card className={`animate-in slide-in-from-bottom-5 duration-500 hover:shadow-lg transition-all ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            {chartType === 'bar' && <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />}
            {chartType === 'pie' && <PieChart className="h-4 w-4 sm:h-5 sm:w-5" />}
            {chartType === 'line' && <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />}
            <span className="truncate">{title}</span>
          </CardTitle>
          
          {showControls && (
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-16 sm:w-20 h-7 sm:h-8 text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">1D</SelectItem>
                  <SelectItem value="7d">7D</SelectItem>
                  <SelectItem value="30d">30D</SelectItem>
                  <SelectItem value="90d">90D</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={chartType} onValueChange={(value: 'bar' | 'pie' | 'line') => setChartType(value)}>
                <SelectTrigger className="w-16 sm:w-20 h-7 sm:h-8 text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar</SelectItem>
                  <SelectItem value="pie">Pie</SelectItem>
                  <SelectItem value="line">Line</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="h-7 w-7 sm:h-8 sm:w-8 p-0"
              >
                <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExport}
                className="h-7 w-7 sm:h-8 sm:w-8 p-0"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div 
          style={{ height: `${height}px` }} 
          className="relative w-full overflow-hidden"
        >
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="animate-in fade-in-0 duration-300 h-full">
              {renderChart()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};