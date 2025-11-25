import api from './api';

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  priority: string;
}

class NotificationService {
  async getNotifications(): Promise<Notification[]> {
    const response = await api.get('/notifications/');
    return response.data;
  }

  async getUnreadCount(): Promise<number> {
    const response = await api.get('/notifications/unread-count');
    return response.data.count;
  }

  async markAsRead(notificationId: number): Promise<void> {
    await api.put(`/notifications/${notificationId}/read`);
  }

  async markAllAsRead(): Promise<void> {
    await api.put('/notifications/mark-all-read');
  }
}

export const notificationService = new NotificationService();