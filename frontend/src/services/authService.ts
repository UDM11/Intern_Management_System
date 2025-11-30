import api from './api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const authService = {
  login: async (email: string, password: string) => {
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);
      
      console.log('Login attempt:', { email, apiUrl: API_BASE_URL });
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        body: formData,
      });
      
      console.log('Login response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Invalid credentials' }));
        console.error('Login error:', errorData);
        throw new Error(errorData.detail || 'Invalid credentials');
      }
      
      const data = await response.json();
      console.log('Login successful');
      
      return {
        token: data.access_token,
      };
    } catch (error: any) {
      console.error('Login service error:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please check if the backend is running.');
      }
      throw error;
    }
  },
};
