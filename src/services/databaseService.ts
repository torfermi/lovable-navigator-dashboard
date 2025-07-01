import { supabase } from '@/lib/supabase';
import type { Correo, Factura, Tarea } from '@/lib/supabase';

export class DatabaseService {
  // =============================================
  // SERVICIO PARA CORREOS
  // =============================================
  
  static async getCorreos(userId?: string) {
    try {
      let query = supabase
        .from('correos')
        .select('*')
        .order('fecha', { ascending: false });

      // Si se especifica userId y el usuario actual es admin, filtrar por ese usuario
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error obteniendo correos:', error);
      return { data: null, error: error as Error };
    }
  }

  static async createCorreo(correo: Omit<Correo, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('correos')
        .insert([correo])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creando correo:', error);
      return { data: null, error: error as Error };
    }
  }

  static async updateCorreo(id: string, updates: Partial<Omit<Correo, 'id' | 'created_at' | 'updated_at'>>) {
    try {
      const { data, error } = await supabase
        .from('correos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error actualizando correo:', error);
      return { data: null, error: error as Error };
    }
  }

  static async deleteCorreo(id: string) {
    try {
      const { error } = await supabase
        .from('correos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error eliminando correo:', error);
      return { error: error as Error };
    }
  }

  // =============================================
  // SERVICIO PARA FACTURAS
  // =============================================

  static async getFacturas(userId?: string, estado?: 'pendiente' | 'clasificada') {
    try {
      let query = supabase
        .from('facturas')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      if (estado) {
        query = query.eq('estado', estado);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error obteniendo facturas:', error);
      return { data: null, error: error as Error };
    }
  }

  static async createFactura(factura: Omit<Factura, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('facturas')
        .insert([factura])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creando factura:', error);
      return { data: null, error: error as Error };
    }
  }

  static async updateFactura(id: string, updates: Partial<Omit<Factura, 'id' | 'created_at' | 'updated_at'>>) {
    try {
      const { data, error } = await supabase
        .from('facturas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error actualizando factura:', error);
      return { data: null, error: error as Error };
    }
  }

  static async deleteFactura(id: string) {
    try {
      const { error } = await supabase
        .from('facturas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error eliminando factura:', error);
      return { error: error as Error };
    }
  }

  // =============================================
  // SERVICIO PARA TAREAS
  // =============================================

  static async getTareas(userId?: string, fase?: 'diseño' | 'compra' | 'instalación') {
    try {
      let query = supabase
        .from('tareas')
        .select('*')
        .order('vencimiento', { ascending: true });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      if (fase) {
        query = query.eq('fase', fase);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error obteniendo tareas:', error);
      return { data: null, error: error as Error };
    }
  }

  static async createTarea(tarea: Omit<Tarea, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('tareas')
        .insert([tarea])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creando tarea:', error);
      return { data: null, error: error as Error };
    }
  }

  static async updateTarea(id: string, updates: Partial<Omit<Tarea, 'id' | 'created_at' | 'updated_at'>>) {
    try {
      const { data, error } = await supabase
        .from('tareas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error actualizando tarea:', error);
      return { data: null, error: error as Error };
    }
  }

  static async deleteTarea(id: string) {
    try {
      const { error } = await supabase
        .from('tareas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error eliminando tarea:', error);
      return { error: error as Error };
    }
  }

  // =============================================
  // FUNCIONES AUXILIARES Y ESTADÍSTICAS
  // =============================================

  static async getUserStats(userId: string) {
    try {
      const { data, error } = await supabase
        .rpc('get_user_stats', { user_uuid: userId });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return { data: null, error: error as Error };
    }
  }

  static async getUpcomingTasks(userId: string, daysAhead: number = 7) {
    try {
      const { data, error } = await supabase
        .rpc('get_upcoming_tasks', { 
          user_uuid: userId, 
          days_ahead: daysAhead 
        });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error obteniendo tareas próximas:', error);
      return { data: null, error: error as Error };
    }
  }

  // Búsqueda de documentos por contenido
  static async searchDocuments(query: string, userId?: string) {
    try {
      // Buscar en correos
      let correosQuery = supabase
        .from('correos')
        .select('*, type:!"correo"')
        .or(`asunto.ilike.%${query}%,remitente.ilike.%${query}%`);

      if (userId) {
        correosQuery = correosQuery.eq('user_id', userId);
      }

      // Buscar en facturas
      let facturasQuery = supabase
        .from('facturas')
        .select('*, type:!"factura"')
        .or(`num_factura.ilike.%${query}%,proveedor.ilike.%${query}%`);

      if (userId) {
        facturasQuery = facturasQuery.eq('user_id', userId);
      }

      const [correosResult, facturasResult] = await Promise.all([
        correosQuery,
        facturasQuery
      ]);

      if (correosResult.error) throw correosResult.error;
      if (facturasResult.error) throw facturasResult.error;

      const results = [
        ...(correosResult.data || []),
        ...(facturasResult.data || [])
      ];

      return { data: results, error: null };
    } catch (error) {
      console.error('Error en búsqueda:', error);
      return { data: null, error: error as Error };
    }
  }

  // Obtener resumen del dashboard
  static async getDashboardSummary(userId: string) {
    try {
      const [correosResult, facturasResult, tareasResult] = await Promise.all([
        this.getCorreos(userId),
        this.getFacturas(userId),
        this.getTareas(userId)
      ]);

      if (correosResult.error) throw correosResult.error;
      if (facturasResult.error) throw facturasResult.error;
      if (tareasResult.error) throw tareasResult.error;

      const summary = {
        correos: {
          total: correosResult.data?.length || 0,
          recientes: correosResult.data?.slice(0, 5) || []
        },
        facturas: {
          total: facturasResult.data?.length || 0,
          pendientes: facturasResult.data?.filter(f => f.estado === 'pendiente').length || 0,
          clasificadas: facturasResult.data?.filter(f => f.estado === 'clasificada').length || 0,
          totalImporte: facturasResult.data?.reduce((sum, f) => sum + f.importe, 0) || 0
        },
        tareas: {
          total: tareasResult.data?.length || 0,
          porFase: {
            diseño: tareasResult.data?.filter(t => t.fase === 'diseño').length || 0,
            compra: tareasResult.data?.filter(t => t.fase === 'compra').length || 0,
            instalación: tareasResult.data?.filter(t => t.fase === 'instalación').length || 0
          },
          proximasVencer: tareasResult.data?.filter(t => {
            const vencimiento = new Date(t.vencimiento);
            const hoy = new Date();
            const diferencia = vencimiento.getTime() - hoy.getTime();
            const diasRestantes = Math.ceil(diferencia / (1000 * 3600 * 24));
            return diasRestantes <= 7 && diasRestantes >= 0;
          }).length || 0
        }
      };

      return { data: summary, error: null };
    } catch (error) {
      console.error('Error obteniendo resumen del dashboard:', error);
      return { data: null, error: error as Error };
    }
  }
}