import api from './api';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  phone?: string;
  department?: string;
  full_name?: string;
  avatar_url?: string;
  is_active: boolean;
}

export interface UserProfileUpdate {
  username?: string;
  email?: string;
  phone?: string;
  department?: string;
  full_name?: string;
}

export const settingsService = {
  // Get current user profile
  getUserProfile: async (): Promise<UserProfile> => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update user profile
  updateUserProfile: async (profileData: UserProfileUpdate): Promise<UserProfile> => {
    try {
      console.log('Updating profile with data:', profileData);
      const response = await api.put('/users/profile', profileData);
      console.log('Profile update response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Profile update error:', error);
      throw error;
    }
  },

  // Upload avatar
  uploadAvatar: async (file: File): Promise<{ avatar_url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    const response = await fetch(`${baseUrl}/users/profile/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    // Convert relative URL to absolute URL
    const backendBaseUrl = baseUrl.replace('/api', '');
    result.avatar_url = `${backendBaseUrl}${result.avatar_url}`;
    return result;
  },

  // Helper function to get full avatar URL
  getFullAvatarUrl: (avatarUrl?: string): string | undefined => {
    if (!avatarUrl) return undefined;
    if (avatarUrl.startsWith('http')) return avatarUrl;
    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace('/api', '');
    return `${baseUrl}${avatarUrl}`;
  },
};