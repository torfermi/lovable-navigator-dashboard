import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Folder24Regular,
  Add24Regular,
  Search24Regular,
  Filter24Regular,
  MoreVertical24Regular,
  Calendar24Regular,
  Person24Regular,
  Clock24Regular,
  CheckmarkCircle24Regular,
  Warning24Regular,
  Pause24Regular,
  Play24Regular,
  Grid24Regular,
  List24Regular,
} from '@fluentui/react-icons';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'on-hold' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  startDate: Date;
  endDate: Date;
  teamMembers: Array<{
    id: string;
    name: string;
    role: string;
    avatar?: string;
  }>;
  category: 'structural' | 'electrical' | 'mechanical' | 'civil' | 'industrial';
  budget: number;
  tags: string[];
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Sistema de Ventilación Industrial',
    description: 'Diseño e implementación de sistema de ventilación para planta industrial',
    status: 'in-progress',
    priority: 'high',
    progress: 65,
    startDate: new Date('2024-05-01'),
    endDate: new Date('2024-08-15'),
    teamMembers: [
      { id: '1', name: 'Juan Pérez', role: 'Ingeniero Líder' },
      { id: '2', name: 'María González', role: 'Técnico' },
      { id: '3', name: 'Carlos López', role: 'Analista' },
    ],
    category: 'mechanical',
    budget: 450000,
    tags: ['ventilación', 'industrial', 'hvac'],
  },
  {
    id: '2',
    name: 'Estructura Torre de Comunicaciones',
    description: 'Análisis estructural y diseño de torre de telecomunicaciones de 45m',
    status: 'planning',
    priority: 'medium',
    progress: 25,
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-10-30'),
    teamMembers: [
      { id: '4', name: 'Ana Rodríguez', role: 'Ingeniera Estructural' },
      { id: '5', name: 'Roberto Silva', role: 'Arquitecto' },
    ],
    category: 'structural',
    budget: 850000,
    tags: ['torre', 'estructural', 'telecomunicaciones'],
  },
  {
    id: '3',
    name: 'Instalación Eléctrica Edificio Central',
    description: 'Proyecto completo de instalación eléctrica para nuevo edificio corporativo',
    status: 'completed',
    priority: 'high',
    progress: 100,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-05-20'),
    teamMembers: [
      { id: '6', name: 'Luis Martínez', role: 'Ingeniero Eléctrico' },
      { id: '7', name: 'Sofia Chen', role: 'Técnico Especialista' },
    ],
    category: 'electrical',
    budget: 320000,
    tags: ['eléctrico', 'edificio', 'corporativo'],
  },
  {
    id: '4',
    name: 'Puente Peatonal Urbano',
    description: 'Diseño y construcción de puente peatonal sobre avenida principal',
    status: 'on-hold',
    priority: 'low',
    progress: 40,
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-09-15'),
    teamMembers: [
      { id: '8', name: 'Diego Morales', role: 'Ingeniero Civil' },
    ],
    category: 'civil',
    budget: 1200000,
    tags: ['puente', 'urbano', 'peatonal'],
  },
];

export const Proyectos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [projects] = useState<Project[]>(mockProjects);

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'planning':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'in-progress':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: Project['priority']) => {
    switch (priority) {
      case 'low':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'high':
        return 'text-orange-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'planning':
        return <Clock24Regular className="w-4 h-4" />;
      case 'in-progress':
        return <Play24Regular className="w-4 h-4" />;
      case 'on-hold':
        return <Pause24Regular className="w-4 h-4" />;
      case 'completed':
        return <CheckmarkCircle24Regular className="w-4 h-4" />;
      default:
        return <Clock24Regular className="w-4 h-4" />;
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = selectedStatus === 'todos' || project.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const projectsByStatus = {
    todos: projects.length,
    planning: projects.filter(p => p.status === 'planning').length,
    'in-progress': projects.filter(p => p.status === 'in-progress').length,
    'on-hold': projects.filter(p => p.status === 'on-hold').length,
    completed: projects.filter(p => p.status === 'completed').length,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Proyectos</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona los proyectos de ingeniería en curso y planificados
          </p>
        </div>
        
        <Button className="bg-gradient-primary text-white">
          <Add24Regular className="w-4 h-4 mr-2" />
          Nuevo Proyecto
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Proyectos</p>
                <p className="text-2xl font-bold">{projects.length}</p>
              </div>
              <Folder24Regular className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En Progreso</p>
                <p className="text-2xl font-bold text-green-600">{projectsByStatus['in-progress']}</p>
              </div>
              <Play24Regular className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pausados</p>
                <p className="text-2xl font-bold text-yellow-600">{projectsByStatus['on-hold']}</p>
              </div>
              <Warning24Regular className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completados</p>
                <p className="text-2xl font-bold text-gray-600">{projectsByStatus.completed}</p>
              </div>
              <CheckmarkCircle24Regular className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search24Regular className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar proyectos, descripción, o tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter24Regular className="w-4 h-4 mr-2" />
                  Estado: {selectedStatus === 'todos' ? 'Todos' : selectedStatus}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedStatus('todos')}>
                  Todos ({projectsByStatus.todos})
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus('planning')}>
                  Planificación ({projectsByStatus.planning})
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus('in-progress')}>
                  En Progreso ({projectsByStatus['in-progress']})
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus('on-hold')}>
                  Pausados ({projectsByStatus['on-hold']})
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus('completed')}>
                  Completados ({projectsByStatus.completed})
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center space-x-1 border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="p-2"
              >
                <Grid24Regular className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="p-2"
              >
                <List24Regular className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Content */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{project.name}</CardTitle>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getStatusColor(project.status)}>
                        {getStatusIcon(project.status)}
                        <span className="ml-1">{project.status}</span>
                      </Badge>
                      <Badge variant="outline" className={getPriorityColor(project.priority)}>
                        {project.priority}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-1">
                        <MoreVertical24Regular className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Exportar</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Archivar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent>
                <CardDescription className="mb-4 line-clamp-2">
                  {project.description}
                </CardDescription>
                
                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progreso</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                {/* Team and dates */}
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Person24Regular className="w-4 h-4 mr-2" />
                    <span>{project.teamMembers.length} miembros</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar24Regular className="w-4 h-4 mr-2" />
                    <span>
                      {project.startDate.toLocaleDateString('es-ES')} - {project.endDate.toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <div className="font-medium text-foreground">
                    Presupuesto: {formatCurrency(project.budget)}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {project.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {project.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.tags.length - 2}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {filteredProjects.map((project) => (
                <div key={project.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold">{project.name}</h3>
                        <Badge className={getStatusColor(project.status)}>
                          {getStatusIcon(project.status)}
                          <span className="ml-1">{project.status}</span>
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(project.priority)}>
                          {project.priority}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                        {project.description}
                      </p>
                      
                      <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Person24Regular className="w-4 h-4 mr-1" />
                          {project.teamMembers.length} miembros
                        </span>
                        <span className="flex items-center">
                          <Calendar24Regular className="w-4 h-4 mr-1" />
                          {project.endDate.toLocaleDateString('es-ES')}
                        </span>
                        <span>{formatCurrency(project.budget)}</span>
                        <div className="flex items-center space-x-2">
                          <span>Progreso: {project.progress}%</span>
                          <Progress value={project.progress} className="h-2 w-20" />
                        </div>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-1">
                          <MoreVertical24Regular className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Exportar</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Archivar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {filteredProjects.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Folder24Regular className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron proyectos</h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedStatus !== 'todos' 
                ? 'Intenta ajustar tus filtros de búsqueda.'
                : 'Comienza creando tu primer proyecto.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};