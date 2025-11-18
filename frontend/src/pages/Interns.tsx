import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Filter, 
  Download, 
  Users, 
  TrendingUp,
  Calendar,
  Mail,
  Phone,
  Building2,
  MoreVertical,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  RefreshCw,
  MapPin,
  GraduationCap,
  Briefcase,
  Clock,
  CheckCircle2,
  AlertCircle,
  Star,
  Award,
  Target,
  Activity
} from 'lucide-react';
import { internService, Intern } from '@/services/internService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';

type ViewMode = 'table' | 'grid';
type SortField = 'full_name' | 'email' | 'department' | 'join_date' | 'status';
type SortOrder = 'asc' | 'desc';

const Interns = () => {
  const [interns, setInterns] = useState<Intern[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [sortField, setSortField] = useState<SortField>('full_name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const navigate = useNavigate();
  const limit = 12;

  useEffect(() => {
    loadInterns();
  }, [page, search, department, status]);

  const loadInterns = async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      
      const data = await internService.getInterns(page, limit, search, department);
      setInterns(data.interns);
      setTotal(data.total);
    } catch (error) {
      console.error('Error loading interns:', error);
      toast({
        title: 'Error',
        description: 'Failed to load interns',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadInterns(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      await internService.deleteIntern(deleteId);
      toast({
        title: 'Success',
        description: 'Intern deleted successfully',
      });
      loadInterns();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete intern',
        variant: 'destructive',
      });
    } finally {
      setDeleteId(null);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedInterns = useMemo(() => {
    return [...interns].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'join_date') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [interns, sortField, sortOrder]);

  const filteredInterns = useMemo(() => {
    return sortedInterns.filter(intern => {
      if (status && intern.status !== status) return false;
      return true;
    });
  }, [sortedInterns, status]);

  const stats = useMemo(() => {
    const activeCount = interns.filter(i => i.status === 'active').length;
    const inactiveCount = interns.filter(i => i.status === 'inactive').length;
    const departments = [...new Set(interns.map(i => i.department))].length;
    
    return {
      total: interns.length,
      active: activeCount,
      inactive: inactiveCount,
      departments
    };
  }, [interns]);

  const totalPages = Math.ceil(total / limit);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getDepartmentColor = (dept: string) => {
    const colors = {
      'Engineering': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Marketing': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Design': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Sales': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    };
    return colors[dept as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const exportData = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Department', 'Join Date', 'Status'],
      ...interns.map(intern => [
        intern.full_name,
        intern.email,
        intern.phone,
        intern.department,
        intern.join_date,
        intern.status
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'interns.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="animate-slide-in-left">
          <h1 className="text-3xl font-bold gradient-text">Interns Management</h1>
          <p className="text-muted-foreground mt-1">Manage and track all your interns efficiently</p>
        </div>
        <div className="flex gap-2 animate-slide-in-right">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="hover-lift"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportData}
            className="hover-lift"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button 
            onClick={() => navigate('/interns/add')}
            className="hover-lift hover-glow"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Intern
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
        <Card className="hover-lift transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interns</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All registered interns</p>
          </CardContent>
        </Card>
        
        <Card className="hover-lift transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Interns</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        
        <Card className="hover-lift transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Interns</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground">Not currently active</p>
          </CardContent>
        </Card>
        
        <Card className="hover-lift transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.departments}</div>
            <p className="text-xs text-muted-foreground">Active departments</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card className="animate-slide-up">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 transition-smooth focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Select value={department || undefined} onValueChange={setDepartment}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={status || undefined} onValueChange={setStatus}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                
                {(department || status) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setDepartment('');
                      setStatus('');
                    }}
                    className="hover-lift"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center border rounded-lg p-1">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 w-8 p-0"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <div className="animate-slide-up">
        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full loading-shimmer" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[200px] loading-shimmer" />
                      <Skeleton className="h-4 w-[150px] loading-shimmer" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : viewMode === 'table' ? (
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort('full_name')}
                  >
                    <div className="flex items-center gap-2">
                      Name
                      {sortField === 'full_name' && (
                        sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50 transition-colors hidden sm:table-cell"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center gap-2">
                      Email
                      {sortField === 'email' && (
                        sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50 transition-colors hidden md:table-cell"
                    onClick={() => handleSort('department')}
                  >
                    <div className="flex items-center gap-2">
                      Department
                      {sortField === 'department' && (
                        sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50 transition-colors hidden lg:table-cell"
                    onClick={() => handleSort('join_date')}
                  >
                    <div className="flex items-center gap-2">
                      Join Date
                      {sortField === 'join_date' && (
                        sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      {sortField === 'status' && (
                        sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInterns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="h-12 w-12 text-muted-foreground/50" />
                        <p>No interns found</p>
                        <p className="text-sm">Try adjusting your search or filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInterns.map((intern, index) => (
                    <TableRow 
                      key={intern.id} 
                      className="hover:bg-muted/50 transition-colors animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs font-medium">
                              {getInitials(intern.full_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{intern.full_name}</div>
                            <div className="text-sm text-muted-foreground sm:hidden">
                              {intern.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{intern.email}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline" className={getDepartmentColor(intern.department)}>
                          {intern.department}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {new Date(intern.join_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={intern.status === 'active' ? 'default' : 'secondary'}
                          className={intern.status === 'active' ? 'bg-success hover:bg-success/80' : ''}
                        >
                          {intern.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/interns/${intern.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/interns/${intern.id}/edit`)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => setDeleteId(intern.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        ) : (
          <div className="grid-responsive">
            {filteredInterns.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground mb-2">No interns found</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                </CardContent>
              </Card>
            ) : (
              filteredInterns.map((intern, index) => {
                // Mock data for enhanced details
                const mockData = {
                  university: ['MIT', 'Stanford', 'Harvard', 'Berkeley', 'CMU'][index % 5],
                  position: ['Software Engineer Intern', 'Marketing Intern', 'Design Intern', 'Sales Intern'][index % 4],
                  completionRate: Math.floor(Math.random() * 40) + 60, // 60-100%
                  totalTasks: Math.floor(Math.random() * 20) + 5, // 5-25 tasks
                  completedTasks: 0,
                  skills: [
                    ['React', 'TypeScript', 'Node.js'],
                    ['Digital Marketing', 'SEO', 'Analytics'],
                    ['Figma', 'Adobe XD', 'Photoshop'],
                    ['Salesforce', 'CRM', 'Lead Generation']
                  ][index % 4],
                  rating: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0
                  daysActive: Math.floor(Math.random() * 90) + 30 // 30-120 days
                };
                mockData.completedTasks = Math.floor((mockData.completionRate / 100) * mockData.totalTasks);
                
                return (
                  <Card 
                    key={intern.id} 
                    className="hover-lift transition-smooth animate-scale-in cursor-pointer group overflow-hidden"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => navigate(`/interns/${intern.id}`)}
                  >
                    {/* Header with Avatar and Basic Info */}
                    <CardHeader className="pb-4 relative">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-500" />
                      
                      <div className="flex items-start justify-between relative z-10">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <Avatar className="h-14 w-14 ring-2 ring-background shadow-lg hover-scale">
                              <AvatarFallback className="font-semibold text-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                                {getInitials(intern.full_name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-success rounded-full border-2 border-background flex items-center justify-center">
                              <div className="h-2 w-2 bg-white rounded-full" />
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                              {intern.full_name}
                            </CardTitle>
                            <p className="text-sm font-medium text-muted-foreground">{mockData.position}</p>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="outline" 
                                className={`${getDepartmentColor(intern.department)} text-xs font-medium`}
                              >
                                {intern.department}
                              </Badge>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{mockData.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/interns/${intern.id}`);
                            }}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/interns/${intern.id}/edit`);
                            }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteId(intern.id);
                              }}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4 pt-0">
                      {/* Contact Information */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate font-medium">{intern.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{intern.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{mockData.university}</span>
                        </div>
                      </div>
                      
                      <Separator className="my-3" />
                      
                      {/* Performance Metrics */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">Task Completion</span>
                          </div>
                          <span className="text-sm font-bold">{mockData.completionRate}%</span>
                        </div>
                        <Progress value={mockData.completionRate} className="h-2" />
                        
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div className="space-y-1">
                            <div className="flex items-center justify-center gap-1">
                              <CheckCircle2 className="h-4 w-4 text-success" />
                              <span className="text-lg font-bold text-success">{mockData.completedTasks}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Completed</p>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-center gap-1">
                              <Clock className="h-4 w-4 text-warning" />
                              <span className="text-lg font-bold text-warning">{mockData.totalTasks - mockData.completedTasks}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Pending</p>
                          </div>
                        </div>
                      </div>
                      
                      <Separator className="my-3" />
                      
                      {/* Skills */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Skills</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {mockData.skills.slice(0, 3).map((skill, skillIndex) => (
                            <Badge 
                              key={skillIndex} 
                              variant="secondary" 
                              className="text-xs px-2 py-1 hover-scale"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {mockData.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs px-2 py-1">
                              +{mockData.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <Separator className="my-3" />
                      
                      {/* Footer Information */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-4">
                          <Badge
                            variant={intern.status === 'active' ? 'default' : 'secondary'}
                            className={`${intern.status === 'active' ? 'bg-success hover:bg-success/80' : ''} font-medium`}
                          >
                            {intern.status}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Activity className="h-3 w-3" />
                            <span>{mockData.daysActive} days active</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>Joined {new Date(intern.join_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="animate-slide-up">
          <CardContent className="flex items-center justify-between py-4">
            <p className="text-sm text-muted-foreground">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} results
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="hover-lift"
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                      className="w-8 h-8 p-0 hover-lift"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="hover-lift"
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="animate-scale-in">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the intern
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover-lift">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive hover:bg-destructive/90 hover-lift"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Interns;
