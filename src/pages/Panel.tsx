import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { DatabaseService } from '@/services/databaseService';
import { useAppStore, useRolePermissions } from '@/stores/useAppStore';
import { NavLink } from 'react-router-dom';
import {
  Mail24Regular,
  Receipt24Regular,
  List24Regular,
  Calendar24Regular,
  ChevronRight24Regular,
  Person24Regular,
  Clock24Regular,
  Warning24Regular,
  CheckmarkCircle24Regular,
  ArrowTrending24Regular,
} from '@fluentui/react-icons';
import type { Correo, Factura, Tarea } from '@/lib/supabase';

interface DashboardData {
  correosCriticos: Correo[];
  facturasPendientes: Factura[];
  tareasAbiertas: {
    diseño: Tarea[];
    compra: Tarea[];
    instalación: Tarea[];
  };
  proximasReuniones: Array<{
    id: string;
    titulo: string;
    fecha: Date;
    tipo: string;
  }>;
}

export const Panel: React.FC = () => {
  const { user, isAuthenticated } = useSupabaseAuth();
  const { addNotification } = useAppStore();
  const { currentRole, isAdmin } = useRolePermissions();
  
  const [data, setData] = useState<DashboardData>({
    correosCriticos: [],
    facturasPendientes: [],
    tareasAbiertas: {
      diseño: [],
      compra: [],
      instalación: [],
    },
    proximasReuniones: [],
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadDashboardData();
    }
  }, [isAuthenticated, user]);

  const loadDashboardData = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Cargar correos críticos (últimos 10)
      const { data: correos, error: correosError } = await DatabaseService.getCorreos();
      if (correosError) throw correosError;
      
      // Cargar facturas pendientes
      const { data: facturas, error: facturasError } = await DatabaseService.getFacturas(undefined, 'pendiente');
      if (facturasError) throw facturasError;
      
      // Cargar tareas por fase
      const { data: tareasDiseño, error: tareasError1 } = await DatabaseService.getTareas(undefined, 'diseño');
      const { data: tareasCompra, error: tareasError2 } = await DatabaseService.getTareas(undefined, 'compra');
      const { data: tareasInstalacion, error: tareasError3 } = await DatabaseService.getTareas(undefined, 'instalación');
      
      if (tareasError1 || tareasError2 || tareasError3) {
        throw new Error('Error cargando tareas');
      }
      
      // Mock data para próximas reuniones
      const mockReuniones = [
        {
          id: '1',
          titulo: 'Revisión Proyecto Alpha',
          fecha: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          tipo: 'Seguimiento',
        },
        {
          id: '2',
          titulo: 'Presentación Proveedores',
          fecha: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
          tipo: 'Comercial',
        },
        {
          id: '3',
          titulo: 'Sprint Planning',
          fecha: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          tipo: 'Desarrollo',
        },
      ];

      setData({
        correosCriticos: correos?.slice(0, 10) || [],
        facturasPendientes: facturas || [],
        tareasAbiertas: {
          diseño: tareasDiseño || [],
          compra: tareasCompra || [],
          instalación: tareasInstalacion || [],
        },
        proximasReuniones: mockReuniones,
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error cargando datos';
      setError(errorMessage);
      addNotification({
        type: 'error',
        title: 'Error cargando dashboard',
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const currentTime = new Date().toLocaleString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTotalFacturasAmount = () => {
    return data.facturasPendientes.reduce((sum, factura) => sum + factura.importe, 0);
  };

  const getTotalTareas = () => {
    return data.tareasAbiertas.diseño.length + 
           data.tareasAbiertas.compra.length + 
           data.tareasAbiertas.instalación.length;
  };

  const getProximaReunion = () => {
    if (data.proximasReuniones.length === 0) return null;
    return data.proximasReuniones.sort((a, b) => a.fecha.getTime() - b.fecha.getTime())[0];
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1
    },
    hover: {
      y: -8,
      scale: 1.02
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Person24Regular className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Inicia Sesión</h3>
            <p className="text-muted-foreground">
              Necesitas estar autenticado para ver el panel.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Animado */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <motion.h1 
            className="text-3xl font-bold text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Bienvenido, {user?.user_metadata?.name || user?.email || 'Usuario'}
          </motion.h1>
          <motion.div 
            className="flex items-center text-muted-foreground mt-2 space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center">
              <Calendar24Regular className="w-4 h-4 mr-2" />
              <span className="capitalize">{currentTime}</span>
            </div>
            {currentRole && (
              <Badge variant="outline" className="text-sm">
                <Person24Regular className="w-3 h-3 mr-1" />
                {currentRole}
              </Badge>
            )}
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button variant="outline" onClick={loadDashboardData} disabled={loading}>
            <ArrowTrending24Regular className="w-4 h-4 mr-2" />
            {loading ? 'Actualizando...' : 'Actualizar'}
          </Button>
        </motion.div>
      </motion.div>

      {/* KPI Cards Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Correos Críticos */}
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          className="cursor-pointer"
        >
          <Card className="h-full shadow-professional transition-all duration-300 hover:shadow-lg border-l-4 border-l-engineering-blue">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Mail24Regular className="w-8 h-8 text-engineering-blue" />
                <Badge variant="destructive" className="text-xs">
                  {data.correosCriticos.length > 5 ? 'CRÍTICO' : 'NORMAL'}
                </Badge>
              </div>
              <CardTitle className="text-lg">Correos Críticos</CardTitle>
              <CardDescription>Últimos 10 sin procesar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-3xl font-bold text-engineering-blue">
                  {data.correosCriticos.length}
                </div>
                
                {data.correosCriticos.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Más reciente:</div>
                    <div className="p-2 bg-muted rounded text-sm">
                      <div className="font-medium truncate">
                        {data.correosCriticos[0]?.asunto}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {data.correosCriticos[0]?.remitente}
                      </div>
                    </div>
                  </div>
                )}
                
                <Button asChild variant="outline" className="w-full mt-4">
                  <NavLink to="/documentos" className="flex items-center">
                    Ver detalles
                    <ChevronRight24Regular className="w-4 h-4 ml-2" />
                  </NavLink>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Facturas Pendientes */}
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          className="cursor-pointer"
        >
          <Card className="h-full shadow-professional transition-all duration-300 hover:shadow-lg border-l-4 border-l-warning">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Receipt24Regular className="w-8 h-8 text-warning" />
                <Badge variant={data.facturasPendientes.length > 10 ? 'destructive' : 'secondary'}>
                  {data.facturasPendientes.length > 10 ? 'ALTO' : 'OK'}
                </Badge>
              </div>
              <CardTitle className="text-lg">Facturas Pendientes</CardTitle>
              <CardDescription>Sin clasificar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-3xl font-bold text-warning">
                  {data.facturasPendientes.length}
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Importe total:</div>
                  <div className="text-lg font-semibold text-foreground">
                    {formatCurrency(getTotalFacturasAmount())}
                  </div>
                </div>
                
                {data.facturasPendientes.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Próxima:</div>
                    <div className="text-sm font-medium truncate">
                      {data.facturasPendientes[0]?.proveedor} - {data.facturasPendientes[0]?.num_factura}
                    </div>
                  </div>
                )}
                
                <Button asChild variant="outline" className="w-full mt-4">
                  <NavLink to="/documentos" className="flex items-center">
                    Ver detalles
                    <ChevronRight24Regular className="w-4 h-4 ml-2" />
                  </NavLink>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tareas por Fase */}
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          className="cursor-pointer"
        >
          <Card className="h-full shadow-professional transition-all duration-300 hover:shadow-lg border-l-4 border-l-success">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <List24Regular className="w-8 h-8 text-success" />
                <Badge variant={getTotalTareas() > 20 ? 'destructive' : 'default'}>
                  {getTotalTareas() > 20 ? 'SOBRECARGA' : 'NORMAL'}
                </Badge>
              </div>
              <CardTitle className="text-lg">Tareas Abiertas</CardTitle>
              <CardDescription>Por fase de trabajo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-3xl font-bold text-success">
                  {getTotalTareas()}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Diseño</span>
                    <Badge variant="outline">{data.tareasAbiertas.diseño.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Compra</span>
                    <Badge variant="outline">{data.tareasAbiertas.compra.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Instalación</span>
                    <Badge variant="outline">{data.tareasAbiertas.instalación.length}</Badge>
                  </div>
                </div>
                
                <Button asChild variant="outline" className="w-full mt-4">
                  <NavLink to="/proyectos" className="flex items-center">
                    Ver detalles
                    <ChevronRight24Regular className="w-4 h-4 ml-2" />
                  </NavLink>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Próximas Reuniones */}
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          className="cursor-pointer"
        >
          <Card className="h-full shadow-professional transition-all duration-300 hover:shadow-lg border-l-4 border-l-engineering-teal">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Calendar24Regular className="w-8 h-8 text-engineering-teal" />
                <Badge variant="outline" className="text-engineering-teal">
                  PRÓXIMAMENTE
                </Badge>
              </div>
              <CardTitle className="text-lg">Próximas Reuniones</CardTitle>
              <CardDescription>Esta semana</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-3xl font-bold text-engineering-teal">
                  {data.proximasReuniones.length}
                </div>
                
                {getProximaReunion() && (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Próxima:</div>
                    <div className="p-2 bg-muted rounded text-sm">
                      <div className="font-medium truncate">
                        {getProximaReunion()?.titulo}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Clock24Regular className="w-3 h-3 mr-1" />
                        {getProximaReunion()?.fecha.toLocaleDateString('es-ES')}
                      </div>
                    </div>
                  </div>
                )}
                
                <Button variant="outline" className="w-full mt-4" disabled>
                  <Calendar24Regular className="w-4 h-4 mr-2" />
                  Próximamente
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Estado de Carga o Error */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <div className="inline-flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-muted-foreground">Cargando datos...</span>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-destructive">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 text-destructive">
                  <Warning24Regular className="w-5 h-5" />
                  <span className="font-medium">Error cargando datos</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={loadDashboardData}
                  className="mt-3"
                >
                  Reintentar
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resumen Rápido */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="bg-gradient-subtle">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckmarkCircle24Regular className="w-5 h-5 mr-2 text-success" />
              Resumen de Actividad
            </CardTitle>
            <CardDescription>
              Estado general de tus actividades en IngenieríaCopilot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-sm text-muted-foreground">Documentos</div>
                <div className="text-xl font-semibold">{data.correosCriticos.length + data.facturasPendientes.length}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Tareas</div>
                <div className="text-xl font-semibold">{getTotalTareas()}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Reuniones</div>
                <div className="text-xl font-semibold">{data.proximasReuniones.length}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Pendientes</div>
                <div className="text-xl font-semibold text-warning">
                  {data.facturasPendientes.length + data.correosCriticos.length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};