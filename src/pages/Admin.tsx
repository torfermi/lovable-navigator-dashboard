import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppStore, useRolePermissions, useQuickLogin, type UserRole } from '@/stores/useAppStore';
import {
  Settings24Regular,
  Person24Regular,
  Shield24Regular,
  Database24Regular,
  CloudSync24Regular,
  Warning24Regular,
  CheckmarkCircle24Regular,
  Add24Regular,
  Edit24Regular,
  Delete24Regular,
  ArrowClockwise24Regular,
} from '@fluentui/react-icons';

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  lastLogin: Date;
  isActive: boolean;
  department: string;
}

const mockUsers: SystemUser[] = [
  {
    id: '1',
    name: 'Administrador Sistema',
    email: 'admin@ingenieriacopilot.com',
    role: 'admin',
    lastLogin: new Date('2024-06-15T10:30:00'),
    isActive: true,
    department: 'Sistemas',
  },
  {
    id: '2',
    name: 'Juan Pérez',
    email: 'juan.perez@ingenieriacopilot.com',
    role: 'ingeniero',
    lastLogin: new Date('2024-06-15T09:15:00'),
    isActive: true,
    department: 'Ingeniería',
  },
  {
    id: '3',
    name: 'María González',
    email: 'maria.gonzalez@ingenieriacopilot.com',
    role: 'compras',
    lastLogin: new Date('2024-06-14T16:45:00'),
    isActive: true,
    department: 'Compras',
  },
  {
    id: '4',
    name: 'Carlos López',
    email: 'carlos.lopez@ingenieriacopilot.com',
    role: 'ingeniero',
    lastLogin: new Date('2024-06-12T14:20:00'),
    isActive: false,
    department: 'Ingeniería',
  },
];

const systemServices = [
  {
    name: 'Base de Datos',
    status: 'operational',
    lastCheck: new Date(),
    description: 'PostgreSQL principal',
  },
  {
    name: 'Microsoft Graph API',
    status: 'operational',
    lastCheck: new Date(),
    description: 'Integración Office 365',
  },
  {
    name: 'n8n Webhooks',
    status: 'warning',
    lastCheck: new Date(),
    description: 'Automatización de procesos',
  },
  {
    name: 'Sistema de Archivos',
    status: 'operational',
    lastCheck: new Date(),
    description: 'Almacenamiento de documentos',
  },
  {
    name: 'Chat Assistant',
    status: 'operational',
    lastCheck: new Date(),
    description: 'Motor de IA conversacional',
  },
];

export const Admin: React.FC = () => {
  const { appConfig, addNotification } = useAppStore();
  const { isAdmin } = useRolePermissions();
  const { loginAs } = useQuickLogin();
  const [users] = useState<SystemUser[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Redirect si no es admin
  if (!isAdmin()) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Shield24Regular className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Acceso Restringido</h3>
            <p className="text-muted-foreground mb-4">
              Esta sección está disponible solo para administradores.
            </p>
            <Button variant="outline" onClick={() => loginAs('admin')}>
              Iniciar como Admin (Demo)
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'ingeniero':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'compras':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getServiceStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getServiceStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckmarkCircle24Regular className="w-4 h-4" />;
      case 'warning':
        return <Warning24Regular className="w-4 h-4" />;
      case 'error':
        return <Warning24Regular className="w-4 h-4" />;
      default:
        return <Warning24Regular className="w-4 h-4" />;
    }
  };

  const handleTestNotification = () => {
    addNotification({
      type: 'success',
      title: 'Configuración actualizada',
      message: 'Los cambios del sistema han sido aplicados correctamente.',
    });
  };

  const roleStats = {
    admin: users.filter(u => u.role === 'admin').length,
    ingeniero: users.filter(u => u.role === 'ingeniero').length,
    compras: users.filter(u => u.role === 'compras').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Panel de Administración</h1>
          <p className="text-muted-foreground mt-2">
            Gestión del sistema, usuarios y configuraciones
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleTestNotification}>
            <ArrowClockwise24Regular className="w-4 h-4 mr-2" />
            Probar Notificación
          </Button>
          <Button className="bg-gradient-primary text-white">
            <Settings24Regular className="w-4 h-4 mr-2" />
            Configuración Global
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Usuarios</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <Person24Regular className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Usuarios Activos</p>
                <p className="text-2xl font-bold text-success">{users.filter(u => u.isActive).length}</p>
              </div>
              <CheckmarkCircle24Regular className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Servicios Operativos</p>
                <p className="text-2xl font-bold text-success">
                  {systemServices.filter(s => s.status === 'operational').length}
                </p>
              </div>
              <Database24Regular className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Versión Sistema</p>
                <p className="text-2xl font-bold">{appConfig.version}</p>
              </div>
              <CloudSync24Regular className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="roles">Roles y Permisos</TabsTrigger>
          <TabsTrigger value="system">Estado del Sistema</TabsTrigger>
          <TabsTrigger value="integrations">Integraciones</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gestión de Usuarios</CardTitle>
                  <CardDescription>
                    Administra los usuarios del sistema y sus permisos
                  </CardDescription>
                </div>
                <Button>
                  <Add24Regular className="w-4 h-4 mr-2" />
                  Nuevo Usuario
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-semibold">{user.name}</h4>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-sm text-muted-foreground">
                          Último acceso: {user.lastLogin.toLocaleDateString('es-ES')} {user.lastLogin.toLocaleTimeString('es-ES')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                      
                      <Badge variant={user.isActive ? 'default' : 'secondary'}>
                        {user.isActive ? 'Activo' : 'Inactivo'}
                      </Badge>
                      
                      <Button variant="ghost" size="sm">
                        <Edit24Regular className="w-4 h-4" />
                      </Button>
                      
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Delete24Regular className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield24Regular className="w-5 h-5 mr-2 text-destructive" />
                  Administrador
                </CardTitle>
                <CardDescription>
                  Acceso completo al sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Usuarios:</span>
                    <Badge variant="destructive">{roleStats.admin}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    • Gestión de usuarios<br/>
                    • Configuración del sistema<br/>
                    • Acceso a todos los módulos<br/>
                    • Gestión de integraciones
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Person24Regular className="w-5 h-5 mr-2 text-primary" />
                  Ingeniero
                </CardTitle>
                <CardDescription>
                  Acceso a proyectos y documentación
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Usuarios:</span>
                    <Badge variant="default">{roleStats.ingeniero}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    • Gestión de proyectos<br/>
                    • Acceso a documentos<br/>
                    • Chat de ingeniería<br/>
                    • Creación de reportes
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Person24Regular className="w-5 h-5 mr-2 text-accent" />
                  Compras
                </CardTitle>
                <CardDescription>
                  Acceso a proveedores y cotizaciones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Usuarios:</span>
                    <Badge className="bg-accent text-accent-foreground">{roleStats.compras}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    • Gestión de proveedores<br/>
                    • Documentos comerciales<br/>
                    • Chat de consultas<br/>
                    • Reportes de compras
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estado de Servicios</CardTitle>
              <CardDescription>
                Monitoreo en tiempo real de los servicios del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemServices.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={getServiceStatusColor(service.status)}>
                        {getServiceStatusIcon(service.status)}
                      </div>
                      <div>
                        <h4 className="font-semibold">{service.name}</h4>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge 
                        variant={service.status === 'operational' ? 'default' : 'destructive'}
                        className={service.status === 'warning' ? 'bg-warning text-warning-foreground' : ''}
                      >
                        {service.status === 'operational' ? 'Operativo' : 
                         service.status === 'warning' ? 'Advertencia' : 'Error'}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        Verificado: {service.lastCheck.toLocaleTimeString('es-ES')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Microsoft Graph API</CardTitle>
                <CardDescription>
                  Integración con Office 365 y SharePoint
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Estado:</span>
                    <Badge className="bg-success text-success-foreground">Conectado</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Último sync:</span>
                    <span className="text-sm text-muted-foreground">Hace 2 min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Documentos sync:</span>
                    <span className="text-sm">1,247</span>
                  </div>
                  <Button variant="outline" className="w-full">
                    Configurar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>n8n Webhooks</CardTitle>
                <CardDescription>
                  Automatización de procesos y workflows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Estado:</span>
                    <Badge className="bg-warning text-warning-foreground">Configurando</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Workflows activos:</span>
                    <span className="text-sm">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Ejecuciones hoy:</span>
                    <span className="text-sm">42</span>
                  </div>
                  <Button variant="outline" className="w-full">
                    Configurar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};