-- =============================================
-- CREACIÓN DE TABLAS PARA INGENIERIACOPILOT
-- =============================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLA: correos
-- =============================================
CREATE TABLE correos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  asunto TEXT NOT NULL,
  remitente TEXT NOT NULL,
  fecha TIMESTAMP WITH TIME ZONE NOT NULL,
  pdf_url TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX idx_correos_user_id ON correos(user_id);
CREATE INDEX idx_correos_fecha ON correos(fecha DESC);
CREATE INDEX idx_correos_remitente ON correos(remitente);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_correos_updated_at 
  BEFORE UPDATE ON correos 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- TABLA: facturas
-- =============================================
CREATE TYPE estado_factura AS ENUM ('pendiente', 'clasificada');

CREATE TABLE facturas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  num_factura TEXT NOT NULL,
  proveedor TEXT NOT NULL,
  importe DECIMAL(15,2) NOT NULL CHECK (importe >= 0),
  pdf_url TEXT,
  estado estado_factura DEFAULT 'pendiente',
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX idx_facturas_user_id ON facturas(user_id);
CREATE INDEX idx_facturas_num_factura ON facturas(num_factura);
CREATE INDEX idx_facturas_proveedor ON facturas(proveedor);
CREATE INDEX idx_facturas_estado ON facturas(estado);
CREATE INDEX idx_facturas_importe ON facturas(importe DESC);

-- Trigger para updated_at
CREATE TRIGGER update_facturas_updated_at 
  BEFORE UPDATE ON facturas 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- TABLA: tareas
-- =============================================
CREATE TYPE fase_tarea AS ENUM ('diseño', 'compra', 'instalación');

CREATE TABLE tareas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  titulo TEXT NOT NULL,
  fase fase_tarea NOT NULL,
  vencimiento TIMESTAMP WITH TIME ZONE NOT NULL,
  responsable TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX idx_tareas_user_id ON tareas(user_id);
CREATE INDEX idx_tareas_fase ON tareas(fase);
CREATE INDEX idx_tareas_vencimiento ON tareas(vencimiento);
CREATE INDEX idx_tareas_responsable ON tareas(responsable);

-- Trigger para updated_at
CREATE TRIGGER update_tareas_updated_at 
  BEFORE UPDATE ON tareas 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- POLÍTICAS RLS (ROW LEVEL SECURITY)
-- =============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE correos ENABLE ROW LEVEL SECURITY;
ALTER TABLE facturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tareas ENABLE ROW LEVEL SECURITY;

-- =============================================
-- POLÍTICAS PARA CORREOS
-- =============================================

-- Admin puede ver todos los correos
CREATE POLICY "admin_can_view_all_correos" ON correos
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Los usuarios pueden ver solo sus correos
CREATE POLICY "users_can_view_own_correos" ON correos
  FOR SELECT
  USING (user_id = auth.uid());

-- Admin puede insertar correos para cualquier usuario
CREATE POLICY "admin_can_insert_all_correos" ON correos
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Los usuarios pueden insertar solo sus correos
CREATE POLICY "users_can_insert_own_correos" ON correos
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Admin puede actualizar todos los correos
CREATE POLICY "admin_can_update_all_correos" ON correos
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Los usuarios pueden actualizar solo sus correos
CREATE POLICY "users_can_update_own_correos" ON correos
  FOR UPDATE
  USING (user_id = auth.uid());

-- Admin puede eliminar todos los correos
CREATE POLICY "admin_can_delete_all_correos" ON correos
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Los usuarios pueden eliminar solo sus correos
CREATE POLICY "users_can_delete_own_correos" ON correos
  FOR DELETE
  USING (user_id = auth.uid());

-- =============================================
-- POLÍTICAS PARA FACTURAS
-- =============================================

-- Admin puede ver todas las facturas
CREATE POLICY "admin_can_view_all_facturas" ON facturas
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Los usuarios pueden ver solo sus facturas
CREATE POLICY "users_can_view_own_facturas" ON facturas
  FOR SELECT
  USING (user_id = auth.uid());

-- Admin puede insertar facturas para cualquier usuario
CREATE POLICY "admin_can_insert_all_facturas" ON facturas
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Los usuarios pueden insertar solo sus facturas
CREATE POLICY "users_can_insert_own_facturas" ON facturas
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Admin puede actualizar todas las facturas
CREATE POLICY "admin_can_update_all_facturas" ON facturas
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Los usuarios pueden actualizar solo sus facturas
CREATE POLICY "users_can_update_own_facturas" ON facturas
  FOR UPDATE
  USING (user_id = auth.uid());

-- Admin puede eliminar todas las facturas
CREATE POLICY "admin_can_delete_all_facturas" ON facturas
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Los usuarios pueden eliminar solo sus facturas
CREATE POLICY "users_can_delete_own_facturas" ON facturas
  FOR DELETE
  USING (user_id = auth.uid());

-- =============================================
-- POLÍTICAS PARA TAREAS
-- =============================================

-- Admin puede ver todas las tareas
CREATE POLICY "admin_can_view_all_tareas" ON tareas
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Los usuarios pueden ver solo sus tareas
CREATE POLICY "users_can_view_own_tareas" ON tareas
  FOR SELECT
  USING (user_id = auth.uid());

-- Admin puede insertar tareas para cualquier usuario
CREATE POLICY "admin_can_insert_all_tareas" ON tareas
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Los usuarios pueden insertar solo sus tareas
CREATE POLICY "users_can_insert_own_tareas" ON tareas
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Admin puede actualizar todas las tareas
CREATE POLICY "admin_can_update_all_tareas" ON tareas
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Los usuarios pueden actualizar solo sus tareas
CREATE POLICY "users_can_update_own_tareas" ON tareas
  FOR UPDATE
  USING (user_id = auth.uid());

-- Admin puede eliminar todas las tareas
CREATE POLICY "admin_can_delete_all_tareas" ON tareas
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Los usuarios pueden eliminar solo sus tareas
CREATE POLICY "users_can_delete_own_tareas" ON tareas
  FOR DELETE
  USING (user_id = auth.uid());

-- =============================================
-- DATOS DE EJEMPLO PARA DESARROLLO
-- =============================================

-- Nota: Los usuarios se crean a través del sistema de autenticación de Supabase
-- Este script solo crea las tablas y políticas. Los datos de ejemplo se 
-- pueden insertar después del registro de usuarios.

-- =============================================
-- FUNCIONES AUXILIARES
-- =============================================

-- Función para obtener estadísticas de un usuario
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  stats JSON;
BEGIN
  SELECT json_build_object(
    'correos_count', (SELECT COUNT(*) FROM correos WHERE user_id = user_uuid),
    'facturas_count', (SELECT COUNT(*) FROM facturas WHERE user_id = user_uuid),
    'facturas_pendientes', (SELECT COUNT(*) FROM facturas WHERE user_id = user_uuid AND estado = 'pendiente'),
    'tareas_count', (SELECT COUNT(*) FROM tareas WHERE user_id = user_uuid),
    'tareas_por_fase', (
      SELECT json_object_agg(fase, count)
      FROM (
        SELECT fase, COUNT(*) as count
        FROM tareas 
        WHERE user_id = user_uuid
        GROUP BY fase
      ) fase_counts
    )
  ) INTO stats;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener tareas próximas a vencer
CREATE OR REPLACE FUNCTION get_upcoming_tasks(user_uuid UUID, days_ahead INTEGER DEFAULT 7)
RETURNS TABLE(
  id UUID,
  titulo TEXT,
  fase fase_tarea,
  vencimiento TIMESTAMP WITH TIME ZONE,
  responsable TEXT,
  dias_restantes INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.titulo,
    t.fase,
    t.vencimiento,
    t.responsable,
    EXTRACT(DAYS FROM (t.vencimiento - NOW()))::INTEGER as dias_restantes
  FROM tareas t
  WHERE t.user_id = user_uuid
    AND t.vencimiento BETWEEN NOW() AND NOW() + INTERVAL '1 day' * days_ahead
  ORDER BY t.vencimiento ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;