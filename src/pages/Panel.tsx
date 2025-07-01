import React from 'react';
import { useAppStore, useRolePermissions } from '@/stores/useAppStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Home24Regular,
  Chat24Regular,
  Document24Regular,
  Folder24Regular,
  Settings24Regular,
  ChevronRight24Regular,
  Person24Regular,
  Calendar24Regular,
  Clock24Regular,
} from '@fluentui/react-icons';
import { NavLink } from 'react-router-dom';

export const Panel: React.FC = () => {
  const { user, addNotification } = useAppStore();
  const { currentRole, isAdmin, isIngeniero, isCompras } = useRolePermissions();

  const currentTime = new Date().toLocaleString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const quickActions = [
    {
      title: 'Iniciar Chat',
      description: 'Conversa con el asistente de ingeniería',
      icon: Chat24Regular,
      href: '/chat',
      color: 'text-engineering-blue',
      available: true,
    },
    {
      title: 'Ver Documentos',
      description: 'Accede a la documentación técnica',
      icon: Document24Regular,
      href: '/documentos',
      color: 'text-engineering-teal',
      available: true,
    },
    {
      title: 'Gestionar Proyectos',
      description: 'Administra tus proyectos de ingeniería',
      icon: Folder24Regular,
      href: '/proyectos',
      color: 'text-primary',
      available: isAdmin() || isIngeniero(),
    },
    {
      title: 'Panel Admin',
      description: 'Configuración y administración del sistema',
      icon: Settings24Regular,
      href: '/admin',
      color: 'text-destructive',
      available: isAdmin(),
    },
  ];

  const roleStats = {
    admin: {
      title: 'Administrador del Sistema',
      description: 'Acceso completo a todas las funcionalidades',
      stats: [
        { label: 'Usuarios activos', value: '12' },
        { label: 'Proyectos', value: '8' },
        { label: 'Documentos', value: '156' },
      ],
    },
    ingeniero: {
      title: 'Ingeniero',
      description: 'Gestión de proyectos y documentación técnica',
      stats: [
        { label: 'Mis proyectos', value: '3' },
        { label: 'Documentos', value: '45' },
        { label: 'Chats activos', value: '7' },
      ],
    },
    compras: {
      title: 'Departamento de Compras',
      description: 'Gestión de proveedores y documentación comercial',
      stats: [
        { label: 'Proveedores', value: '23' },
        { label: 'Cotizaciones', value: '12' },
        { label: 'Órdenes pendientes', value: '5' },
      ],
    },
  };

  const currentRoleInfo = currentRole ? roleStats[currentRole] : null;

  const handleTestNotification = () => {
    addNotification({
      type: 'info',
      title: 'Notificación de prueba',
      message: 'Esta es una notificación de ejemplo del sistema IngenieríaCopilot.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Bienvenido, {user?.name}
          </h1>
          <div className="flex items-center text-muted-foreground mt-2 space-x-4">
            <div className="flex items-center">
              <Calendar24Regular className="w-4 h-4 mr-2" />
              <span className="capitalize">{currentTime}</span>
            </div>
            {currentRole && (
              <Badge variant="outline" className="text-sm">
                <Person24Regular className="w-3 h-3 mr-1" />
                {currentRoleInfo?.title}
              </Badge>
            )}
          </div>
        </div>
        
        <Button variant="outline" onClick={handleTestNotification}>
          <Clock24Regular className="w-4 h-4 mr-2" />
          Prueba Notificación
        </Button>
      </div>

      {/* Role Information Card */}
      {currentRoleInfo && (
        <Card className="shadow-professional">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Person24Regular className="w-5 h-5 mr-2 text-primary" />
              {currentRoleInfo.title}
            </CardTitle>
            <CardDescription>{currentRoleInfo.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentRoleInfo.stats.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions
          .filter(action => action.available)
          .map((action, index) => {
            const Icon = action.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 group">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Icon className={`w-6 h-6 ${action.color}`} />
                    <ChevronRight24Regular className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-lg mb-2">{action.title}</CardTitle>
                  <CardDescription className="mb-4">
                    {action.description}
                  </CardDescription>
                  <Button asChild variant="outline" className="w-full">
                    <NavLink to={action.href}>
                      Acceder
                    </NavLink>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>Estado del Sistema</CardTitle>
          <CardDescription>
            Información general sobre el estado de IngenieríaCopilot
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm">Servicios operativos</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm">Base de datos activa</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span className="text-sm">Mantenimiento programado</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm">Integraciones activas</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>
            Últimas acciones realizadas en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <Document24Regular className="w-5 h-5 text-engineering-teal" />
              <div className="flex-1">
                <div className="font-medium">Documento actualizado</div>
                <div className="text-sm text-muted-foreground">Manual técnico v2.1 - hace 2 horas</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <Folder24Regular className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <div className="font-medium">Proyecto creado</div>
                <div className="text-sm text-muted-foreground">Sistema de ventilación - hace 1 día</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <Chat24Regular className="w-5 h-5 text-engineering-blue" />
              <div className="flex-1">
                <div className="font-medium">Nueva conversación</div>
                <div className="text-sm text-muted-foreground">Consulta sobre cálculos estructurales - hace 3 días</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};