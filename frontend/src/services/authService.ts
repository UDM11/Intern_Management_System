import api from './api';

export const authService = {
  login: async (email: string, password: string) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/auth/login`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Invalid credentials');
    }
    
    const data = await response.json();
    return {
      token: data.access_token,
      user: {
        id: '1',
        email: email,
        name: 'Admin User',
      },
    };
  },

  register: async (username: string, email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { username, email, password });
      
      // Return token and user data for auto-login
      if (response.data.access_token) {
        return {
          token: response.data.access_token,
          user: response.data.user
        };
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle specific error messages
      if (error.message.includes('Username or email already registered')) {
        throw new Error('Username or email already exists');
      }
      if (error.message.includes('400')) {
        throw new Error('Invalid registration data');
      }
      if (error.message.includes('500')) {
        throw new Error('Server error - please try again later');
      }
      
      throw new Error(error.message || 'Failed to create account');
    }
  },
};
