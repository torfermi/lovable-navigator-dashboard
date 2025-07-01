import { useEffect, useState } from 'react';
import { AuthService } from '@/services/authService';
import { useAppStore } from '@/stores/useAppStore';
import type { User } from '@supabase/supabase-js';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { setUser: setStoreUser, logout: logoutStore } = useAppStore();

  useEffect(() => {
    // Obtener sesión inicial
    const getInitialSession = async () => {
      try {
        const { session, error } = await AuthService.getCurrentSession();
        if (error) {
          setError(error.message);
        } else {
          setUser(session?.user || null);
          
          // Sincronizar con el store de Zustand
          if (session?.user) {
            const storeUser = {
              id: session.user.id,
              name: session.user.user_metadata?.name || session.user.email || 'Usuario',
              email: session.user.email || '',
              role: session.user.user_metadata?.role || 'ingeniero',
            };
            setStoreUser(storeUser);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = AuthService.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        setUser(session?.user || null);
        setError(null);
        
        if (session?.user) {
          // Usuario logueado
          const storeUser = {
            id: session.user.id,
            name: session.user.user_metadata?.name || session.user.email || 'Usuario',
            email: session.user.email || '',
            role: session.user.user_metadata?.role || 'ingeniero',
          };
          setStoreUser(storeUser);
        } else {
          // Usuario deslogueado
          logoutStore();
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [setStoreUser, logoutStore]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await AuthService.signIn(email, password);
      
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      
      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error en el login';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata: {
    name: string;
    role: 'admin' | 'ingeniero' | 'compras';
    department?: string;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await AuthService.signUp(email, password, metadata);
      
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      
      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error en el registro';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await AuthService.signOut();
      
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error en el logout';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await AuthService.resetPassword(email);
      
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al resetear password';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: {
    name?: string;
    department?: string;
    avatar_url?: string;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await AuthService.updateProfile(updates);
      
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error actualizando perfil';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin: AuthService.isAdmin(user),
    userRole: AuthService.getUserRole(user),
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    clearError: () => setError(null),
  };
};