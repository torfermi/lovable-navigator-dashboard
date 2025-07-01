import { createClient } from '@supabase/supabase-js';

// Estas variables se obtienen de las variables de entorno de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables de entorno de Supabase');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Tipos de la base de datos
export interface Correo {
  id: string;
  asunto: string;
  remitente: string;
  fecha: string;
  pdf_url?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Factura {
  id: string;
  num_factura: string;
  proveedor: string;
  importe: number;
  pdf_url?: string;
  estado: 'pendiente' | 'clasificada';
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Tarea {
  id: string;
  titulo: string;
  fase: 'diseño' | 'compra' | 'instalación';
  vencimiento: string;
  responsable: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// Database schema type
export interface Database {
  public: {
    Tables: {
      correos: {
        Row: Correo;
        Insert: Omit<Correo, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Correo, 'id' | 'created_at' | 'updated_at'>>;
      };
      facturas: {
        Row: Factura;
        Insert: Omit<Factura, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Factura, 'id' | 'created_at' | 'updated_at'>>;
      };
      tareas: {
        Row: Tarea;
        Insert: Omit<Tarea, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Tarea, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}