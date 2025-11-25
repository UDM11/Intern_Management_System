import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  Award,
  Target,
  TrendingUp,
  Activity,
  MoreVertical,
  Eye,
  Star
} from 'lucide-react';
import { internService, Intern, Task } from '@/services/internService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

const InternDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [intern, setIntern] = useState<Intern | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    deadline: '',
    status: 'pending' as Task['status'],
  });

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const [internData, tasksData] = await Promise.all([
        internService.getInternById(parseInt(id)),
        internService.getInternTasks(parseInt(id)),
      ]);
      setIntern(internData);
      setTasks(tasksData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive',
      });
      navigate('/interns');
    } finally {
      setIsLoading(false);
    }
  };

  const openTaskModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setTaskForm({
        title: task.title,
        description: task.description,
        deadline: task.deadline,
        status: task.status,
      });
    } else {
      setEditingTask(null);
      setTaskForm({
        title: '',
        description: '',
        deadline: '',
        status: 'pending',
      });
    }
    setIsTaskModalOpen(true);
  };

  const handleTaskSubmit = async () => {
    if (!id) return;

    try {
      if (editingTask) {
        await internService.updateTask(editingTask.id, taskForm);
        toast({ title: 'Success', description: 'Task updated successfully' });
      } else {
        await internService.createTask({ ...taskForm, intern_id: parseInt(id) });
        toast({ title: 'Success', description: 'Task created successfully' });
      }
      setIsTaskModalOpen(false);
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save task',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await internService.deleteTask(taskId);
      toast({ title: 'Success', description: 'Task deleted successfully' });
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete task',
        variant: 'destructive',
      });
    }
  };

  const handleMarkComplete = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await internService.updateTask(task.id, { status: newStatus });
      toast({ title: 'Success', description: 'Task status updated' });
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive',
      });
    }
  };

  const getFilteredTasks = () => {
    if (filterStatus === 'all') return tasks;
    return tasks.filter((task) => task.status === filterStatus);
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-warning" />;
      case 'overdue':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
    }
  };

  const getStatusBadge = (status: Task['status']) => {
    const variants = {
      completed: 'bg-success text-success-foreground',
      pending: 'bg-warning text-warning-foreground',
      overdue: 'bg-destructive text-destructive-foreground'
    };
    return variants[status] || 'bg-muted';
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

  const completionRate = intern?.task_stats?.completion_rate || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-80 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!intern) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-3 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 sm:gap-4 animate-slide-in-left">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/interns')}
              className="hover-lift flex-shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <Avatar className="h-12 w-12 sm:h-16 sm:w-16 hover-scale transition-smooth flex-shrink-0">
                <AvatarImage src="" />
                <AvatarFallback className="text-sm sm:text-xl font-bold">
                  {intern.full_name ? intern.full_name.split(' ').map(n => n[0]).join('').toUpperCase() : 'IN'}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-3xl font-bold gradient-text truncate">{intern.full_name}</h1>
                <p className="text-muted-foreground flex items-center gap-2 text-sm sm:text-base">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">{intern.email}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2 animate-slide-in-right">
            <Button 
              variant="outline"
              onClick={() => navigate(`/interns/${id}/edit`)}
              className="hover-lift w-full sm:w-auto"
            >
              <Edit className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Edit Profile</span>
              <span className="sm:hidden">Edit</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Main Content */}
          <div className="order-2 lg:order-1 lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Profile Overview */}
            <Card className="hover-lift transition-smooth animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Overview
                </CardTitle>
                <CardDescription>
                  Comprehensive intern profile information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      Phone
                    </div>
                    <p className="font-medium">{intern.phone || 'Not provided'}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      Email
                    </div>
                    <p className="font-medium">{intern.email}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      Department
                    </div>
                    <Badge variant="outline" className={getDepartmentColor(intern.department)}>
                      {intern.department}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      Position
                    </div>
                    <p className="font-medium">{intern.position || 'Not specified'}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Award className="h-4 w-4" />
                      University
                    </div>
                    <p className="font-medium">{intern.university || 'Not provided'}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Join Date
                    </div>
                    <p className="font-medium">{new Date(intern.join_date).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Activity className="h-4 w-4" />
                      Status
                    </div>
                    <Badge 
                      variant={intern.status === 'active' ? 'default' : 'secondary'} 
                      className={intern.status === 'active' ? 'bg-success hover:bg-success/80' : ''}
                    >
                      {intern.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Target className="h-4 w-4" />
                      Completion Rate
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">{completionRate.toFixed(1)}%</p>
                      <Progress value={completionRate} className="h-2" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Award className="h-4 w-4" />
                      Total Tasks
                    </div>
                    <p className="font-medium text-2xl">{intern?.task_stats?.total_tasks || 0}</p>
                  </div>
                </div>
                
                {/* Skills Section */}
                {intern.skills && intern.skills.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="h-4 w-4" />
                        Skills & Technologies
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {intern.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="hover-scale transition-smooth">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tasks Section */}
            <Card className="hover-lift transition-smooth animate-slide-up">
              <CardHeader className="pb-4 sm:pb-6">
                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                        <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                        Tasks & Assignments
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Manage and track intern tasks and progress
                      </CardDescription>
                    </div>
                    <Button 
                      onClick={() => openTaskModal()}
                      className="hover-lift hover-glow w-full sm:w-auto"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Task
                    </Button>
                  </div>
                  <div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Tasks</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>

                <div className="space-y-4">
                  {getFilteredTasks().length === 0 ? (
                    <div className="text-center py-12">
                      <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No tasks found</p>
                      <p className="text-sm text-muted-foreground">
                        {filterStatus === 'all' ? 'Add a task to get started' : `No ${filterStatus} tasks`}
                      </p>
                    </div>
                  ) : (
                    getFilteredTasks().map((task, index) => (
                      <div 
                        key={task.id} 
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-smooth animate-scale-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0 w-full sm:w-auto">
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {getStatusIcon(task.status)}
                            <Badge className={`${getStatusBadge(task.status)} text-xs`}>
                              {task.status}
                            </Badge>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate text-sm sm:text-base">{task.title}</h4>
                            <p className="text-xs sm:text-sm text-muted-foreground truncate">{task.description}</p>
                            <p className="text-xs text-muted-foreground">
                              Due: {new Date(task.deadline).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkComplete(task)}
                            className="hover-lift flex-1 sm:flex-none text-xs sm:text-sm"
                          >
                            <span className="hidden sm:inline">{task.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}</span>
                            <span className="sm:hidden">{task.status === 'completed' ? 'Pending' : 'Complete'}</span>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openTaskModal(task)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Task
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteTask(task.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Task
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="order-1 lg:order-2 space-y-4 sm:space-y-6">
            {/* Task Statistics */}
            <Card className="hover-lift transition-smooth animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Task Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-success" />
                    <span className="text-xs sm:text-sm font-medium">Completed</span>
                  </div>
                  <span className="font-bold text-success text-sm sm:text-base">
                    {intern?.task_stats?.completed_tasks || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-warning" />
                    <span className="text-xs sm:text-sm font-medium">Pending</span>
                  </div>
                  <span className="font-bold text-warning text-sm sm:text-base">
                    {intern?.task_stats?.pending_tasks || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
                    <span className="text-xs sm:text-sm font-medium">Overdue</span>
                  </div>
                  <span className="font-bold text-destructive text-sm sm:text-base">
                    {intern?.task_stats?.overdue_tasks || 0}
                  </span>
                </div>
                <div className="pt-3 sm:pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium">Completion Rate</span>
                    <span className="font-bold text-sm sm:text-base">{completionRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={completionRate} className="mt-2 h-1.5 sm:h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="hover-lift transition-smooth animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover-lift text-sm"
                  onClick={() => navigate(`/interns/${id}/edit`)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover-lift text-sm"
                  onClick={() => openTaskModal()}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Task
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover-lift text-sm"
                  onClick={() => navigate('/interns')}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View All Interns
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Task Modal */}
        <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
          <DialogContent className="animate-scale-in w-[95vw] max-w-md sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="Enter task title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={taskForm.deadline}
                  onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={taskForm.status}
                  onValueChange={(value: Task['status']) => setTaskForm({ ...taskForm, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setIsTaskModalOpen(false)} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button onClick={handleTaskSubmit} className="hover-lift w-full sm:w-auto">
                {editingTask ? 'Update Task' : 'Create Task'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default InternDetail;