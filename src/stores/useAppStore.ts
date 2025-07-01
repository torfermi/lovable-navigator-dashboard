import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Tipos para el manejo de roles y estado global
export type UserRole = 'admin' | 'ingeniero' | 'compras';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
}

export interface AppState {
  // Tema
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Sidebar
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Usuario y autenticación
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;

  // UI State
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  
  // Notificaciones
  notifications: Array<{
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
  }>;
  addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // Configuración de la aplicación
  appConfig: {
    companyName: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
  };
}

// Configuración inicial
const initialAppConfig = {
  companyName: 'IngenieríaCopilot',
  version: '1.0.0',
  environment: 'development' as const,
};

// Usuarios semilla para desarrollo (ahora con Supabase no son necesarios)
const seedUsers: Record<UserRole, User> = {
  admin: {
    id: 'admin-001',
    name: 'Administrador Sistema',
    email: 'admin@ingenieriacopilot.com',
    role: 'admin',
    department: 'Sistemas',
  },
  ingeniero: {
    id: 'eng-001',
    name: 'Juan Pérez',
    email: 'juan.perez@ingenieriacopilot.com',
    role: 'ingeniero',
    department: 'Ingeniería',
  },
  compras: {
    id: 'pur-001',
    name: 'María González',
    email: 'maria.gonzalez@ingenieriacopilot.com',
    role: 'compras',
    department: 'Compras',
  },
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Tema
      isDarkMode: false,
      toggleDarkMode: () => {
        const newMode = !get().isDarkMode;
        set({ isDarkMode: newMode });
        
        // Aplicar el tema al DOM
        if (newMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      // Sidebar
      isSidebarCollapsed: false,
      toggleSidebar: () => set({ isSidebarCollapsed: !get().isSidebarCollapsed }),
      setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),

      // Usuario
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),

      // UI State
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),

      // Notificaciones
      notifications: [],
      addNotification: (notification) => {
        const newNotification = {
          ...notification,
          id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
          read: false,
        };
        set((state) => ({
          notifications: [newNotification, ...state.notifications].slice(0, 50), // Límite de 50 notificaciones
        }));
      },
      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif
          ),
        }));
      },
      clearNotifications: () => set({ notifications: [] }),

      // Configuración
      appConfig: initialAppConfig,
    }),
    {
      name: 'ingenieria-copilot-storage',
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        isSidebarCollapsed: state.isSidebarCollapsed,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Utilidades para manejo de roles
export const useRolePermissions = () => {
  const user = useAppStore((state) => state.user);
  
  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const isAdmin = (): boolean => hasRole('admin');
  const isIngeniero = (): boolean => hasRole('ingeniero');
  const isCompras = (): boolean => hasRole('compras');

  const canAccess = (requiredRoles: UserRole[]): boolean => {
    if (isAdmin()) return true; // Admin tiene acceso a todo
    return hasAnyRole(requiredRoles);
  };

  return {
    hasRole,
    hasAnyRole,
    isAdmin,
    isIngeniero,
    isCompras,
    canAccess,
    currentRole: user?.role,
  };
};

// Hook para login rápido con usuarios semilla (solo desarrollo)
export const useQuickLogin = () => {
  const setUser = useAppStore((state) => state.setUser);

  const loginAs = (role: UserRole) => {
    const user = seedUsers[role];
    setUser(user);
  };

  return { loginAs, seedUsers };
};

// Inicialización del tema al cargar la aplicación
if (typeof window !== 'undefined') {
  const isDarkMode = useAppStore.getState().isDarkMode;
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
  }
}