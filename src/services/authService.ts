import api from './api';

export const authService = {
  login: async (email: string, password: string) => {
    // Mock API call - replace with actual endpoint
    // const response = await api.post('/auth/login', { email, password });
    // return response.data;
    
    // Simulated response for demo purposes
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        resolve({
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: '1',
            email: email,
            name: 'Admin User',
          },
        });
      }, 1000);
    });
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
};
