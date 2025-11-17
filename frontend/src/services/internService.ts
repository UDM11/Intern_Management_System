import api from './api';

export interface Intern {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  joinDate: string;
  status: 'active' | 'inactive';
}

export interface Task {
  id: string;
  internId: string;
  title: string;
  description: string;
  deadline: string;
  status: 'pending' | 'completed' | 'overdue';
}

// Mock data for demonstration
const mockInterns: Intern[] = [
  {
    id: '1',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    department: 'Engineering',
    joinDate: '2024-01-15',
    status: 'active',
  },
  {
    id: '2',
    fullName: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1234567891',
    department: 'Marketing',
    joinDate: '2024-02-01',
    status: 'active',
  },
  {
    id: '3',
    fullName: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    phone: '+1234567892',
    department: 'Design',
    joinDate: '2024-01-20',
    status: 'inactive',
  },
];

const mockTasks: Task[] = [
  {
    id: '1',
    internId: '1',
    title: 'Complete onboarding documentation',
    description: 'Review and complete all onboarding forms',
    deadline: '2024-12-20',
    status: 'completed',
  },
  {
    id: '2',
    internId: '1',
    title: 'Setup development environment',
    description: 'Install necessary tools and configure workspace',
    deadline: '2024-12-25',
    status: 'pending',
  },
  {
    id: '3',
    internId: '1',
    title: 'Review codebase',
    description: 'Familiarize with the existing codebase',
    deadline: '2024-12-15',
    status: 'overdue',
  },
];

export const internService = {
  getInterns: async (page = 1, limit = 10, search = '', department = '') => {
    // Mock API call
    return new Promise<{ interns: Intern[]; total: number }>((resolve) => {
      setTimeout(() => {
        let filtered = [...mockInterns];
        
        if (search) {
          filtered = filtered.filter(intern => 
            intern.fullName.toLowerCase().includes(search.toLowerCase()) ||
            intern.email.toLowerCase().includes(search.toLowerCase())
          );
        }
        
        if (department) {
          filtered = filtered.filter(intern => intern.department === department);
        }
        
        const start = (page - 1) * limit;
        const end = start + limit;
        
        resolve({
          interns: filtered.slice(start, end),
          total: filtered.length,
        });
      }, 500);
    });
  },

  getInternById: async (id: string) => {
    return new Promise<Intern>((resolve, reject) => {
      setTimeout(() => {
        const intern = mockInterns.find(i => i.id === id);
        if (intern) {
          resolve(intern);
        } else {
          reject(new Error('Intern not found'));
        }
      }, 500);
    });
  },

  createIntern: async (data: Omit<Intern, 'id'>) => {
    return new Promise<Intern>((resolve) => {
      setTimeout(() => {
        const newIntern = {
          id: String(mockInterns.length + 1),
          ...data,
        };
        mockInterns.push(newIntern);
        resolve(newIntern);
      }, 500);
    });
  },

  updateIntern: async (id: string, data: Partial<Intern>) => {
    return new Promise<Intern>((resolve, reject) => {
      setTimeout(() => {
        const index = mockInterns.findIndex(i => i.id === id);
        if (index !== -1) {
          mockInterns[index] = { ...mockInterns[index], ...data };
          resolve(mockInterns[index]);
        } else {
          reject(new Error('Intern not found'));
        }
      }, 500);
    });
  },

  deleteIntern: async (id: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const index = mockInterns.findIndex(i => i.id === id);
        if (index !== -1) {
          mockInterns.splice(index, 1);
          resolve();
        } else {
          reject(new Error('Intern not found'));
        }
      }, 500);
    });
  },

  getInternTasks: async (internId: string) => {
    return new Promise<Task[]>((resolve) => {
      setTimeout(() => {
        const tasks = mockTasks.filter(t => t.internId === internId);
        resolve(tasks);
      }, 500);
    });
  },

  createTask: async (data: Omit<Task, 'id'>) => {
    return new Promise<Task>((resolve) => {
      setTimeout(() => {
        const newTask = {
          id: String(mockTasks.length + 1),
          ...data,
        };
        mockTasks.push(newTask);
        resolve(newTask);
      }, 500);
    });
  },

  updateTask: async (id: string, data: Partial<Task>) => {
    return new Promise<Task>((resolve, reject) => {
      setTimeout(() => {
        const index = mockTasks.findIndex(t => t.id === id);
        if (index !== -1) {
          mockTasks[index] = { ...mockTasks[index], ...data };
          resolve(mockTasks[index]);
        } else {
          reject(new Error('Task not found'));
        }
      }, 500);
    });
  },

  deleteTask: async (id: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const index = mockTasks.findIndex(t => t.id === id);
        if (index !== -1) {
          mockTasks.splice(index, 1);
          resolve();
        } else {
          reject(new Error('Task not found'));
        }
      }, 500);
    });
  },

  getDashboardStats: async () => {
    return new Promise<{
      totalInterns: number;
      activeInterns: number;
      pendingTasks: number;
      completedTasks: number;
    }>((resolve) => {
      setTimeout(() => {
        resolve({
          totalInterns: mockInterns.length,
          activeInterns: mockInterns.filter(i => i.status === 'active').length,
          pendingTasks: mockTasks.filter(t => t.status === 'pending').length,
          completedTasks: mockTasks.filter(t => t.status === 'completed').length,
        });
      }, 500);
    });
  },
};
