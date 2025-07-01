import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export class AuthService {
  // Registro con email y password
  static async signUp(email: string, password: string, metadata: { 
    name: string;
    role: 'admin' | 'ingeniero' | 'compras';
    department?: string;
  }) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error en registro:', error);
      return { data: null, error: error as Error };
    }
  }

  // Login con email y password
  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error en login:', error);
      return { data: null, error: error as Error };
    }
  }

  // Logout
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      return { error: null };
    } catch (error) {
      console.error('Error en logout:', error);
      return { error: error as Error };
    }
  }

  // Obtener sesión actual
  static async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        throw error;
      }
      return { session, error: null };
    } catch (error) {
      console.error('Error obteniendo sesión:', error);
      return { session: null, error: error as Error };
    }
  }

  // Obtener usuario actual
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        throw error;
      }
      return { user, error: null };
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      return { user: null, error: error as Error };
    }
  }

  // Resetear password
  static async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) {
        throw error;
      }
      
      return { error: null };
    } catch (error) {
      console.error('Error reseteando password:', error);
      return { error: error as Error };
    }
  }

  // Actualizar password
  static async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        throw error;
      }
      
      return { error: null };
    } catch (error) {
      console.error('Error actualizando password:', error);
      return { error: error as Error };
    }
  }

  // Actualizar perfil de usuario
  static async updateProfile(updates: {
    name?: string;
    department?: string;
    avatar_url?: string;
  }) {
    try {
      const { error } = await supabase.auth.updateUser({
        data: updates
      });
      
      if (error) {
        throw error;
      }
      
      return { error: null };
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      return { error: error as Error };
    }
  }

  // Verificar si el usuario es admin
  static isAdmin(user: User | null): boolean {
    return user?.user_metadata?.role === 'admin';
  }

  // Obtener rol del usuario
  static getUserRole(user: User | null): 'admin' | 'ingeniero' | 'compras' | null {
    return user?.user_metadata?.role || null;
  }

  // Escuchar cambios de autenticación
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}