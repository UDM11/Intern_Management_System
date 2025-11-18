import api from './api';

export interface Intern {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  department: string;
  join_date: string;
  status: 'active' | 'inactive';
}

export interface Task {
  id: number;
  intern_id: number;
  title: string;
  description: string;
  deadline: string;
  status: 'pending' | 'completed' | 'overdue';
  created_at: string;
}



export const internService = {
  getInterns: async (page = 1, limit = 10, search = '', department = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(department && { department }),
    });
    
    const response = await api.get(`/interns?${params}`);
    return response.data;
  },

  getInternById: async (id: number) => {
    const response = await api.get(`/interns/${id}`);
    return response.data;
  },

  createIntern: async (data: Omit<Intern, 'id' | 'join_date'>) => {
    const response = await api.post('/interns', data);
    return response.data;
  },

  updateIntern: async (id: number, data: Partial<Intern>) => {
    const response = await api.put(`/interns/${id}`, data);
    return response.data;
  },

  deleteIntern: async (id: number) => {
    const response = await api.delete(`/interns/${id}`);
    return response.data;
  },

  getInternTasks: async (internId: number) => {
    const response = await api.get(`/tasks/intern/${internId}`);
    return response.data;
  },

  createTask: async (data: Omit<Task, 'id' | 'created_at'>) => {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  updateTask: async (id: number, data: Partial<Task>) => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id: number) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  getDepartmentStats: async () => {
    const response = await api.get('/dashboard/departments');
    return response.data;
  },
};
