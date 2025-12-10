import { create } from "zustand";

export interface Notification {
  id: number;
  message: string;
  description?: string;
  type: "upcoming" | "overdue";
  date: string;
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (n: Notification) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],

  addNotification: (n) =>
    set((state) => ({
      notifications: [...state.notifications, n],
    })),

  clearNotifications: () => set({ notifications: [] }),
}));
