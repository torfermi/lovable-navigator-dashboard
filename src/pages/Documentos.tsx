import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Document24Regular,
  DocumentPdf24Regular,
  CloudAdd24Regular,
  Search24Regular,
  Filter24Regular,
  MoreVertical24Regular,
  FolderOpen24Regular,
  Calendar24Regular,
  Person24Regular,
  Eye24Regular,
  ArrowDownload24Regular,
  Share24Regular,
} from '@fluentui/react-icons';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'word' | 'excel' | 'generic';
  size: string;
  category: 'manual' | 'norma' | 'especificacion' | 'reporte' | 'plano';
  lastModified: Date;
  author: string;
  tags: string[];
  description: string;
}

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Manual de Instalación Eléctrica.pdf',
    type: 'pdf',
    size: '2.3 MB',
    category: 'manual',
    lastModified: new Date('2024-06-15'),
    author: 'Juan Pérez',
    tags: ['eléctrico', 'instalación', 'manual'],
    description: 'Manual completo para instalaciones eléctricas residenciales e industriales'
  },
  {
    id: '2',
    name: 'Norma IRAM 2309 - Soldadura.pdf',
    type: 'pdf',
    size: '1.8 MB',
    category: 'norma',
    lastModified: new Date('2024-06-10'),
    author: 'María González',
    tags: ['soldadura', 'norma', 'iram'],
    description: 'Norma técnica para procesos de soldadura en estructuras metálicas'
  },
  {
    id: '3',
    name: 'Especificaciones Técnicas Proyecto Alpha.docx',
    type: 'word',
    size: '456 KB',
    category: 'especificacion',
    lastModified: new Date('2024-06-12'),
    author: 'Carlos López',
    tags: ['proyecto', 'alpha', 'especificaciones'],
    description: 'Documento con especificaciones técnicas detalladas del proyecto Alpha'
  },
  {
    id: '4',
    name: 'Cálculos Estructurales Torre B.xlsx',
    type: 'excel',
    size: '789 KB',
    category: 'reporte',
    lastModified: new Date('2024-06-08'),
    author: 'Ana Rodríguez',
    tags: ['cálculos', 'estructural', 'torre'],
    description: 'Hoja de cálculo con análisis estructural completo de la Torre B'
  },
  {
    id: '5',
    name: 'Planos Arquitectónicos Edificio Central.pdf',
    type: 'pdf',
    size: '5.2 MB',
    category: 'plano',
    lastModified: new Date('2024-06-05'),
    author: 'Roberto Silva',
    tags: ['planos', 'arquitectura', 'edificio'],
    description: 'Conjunto completo de planos arquitectónicos del edificio central'
  },
];

export const Documentos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [documents] = useState<Document[]>(mockDocuments);

  const getDocumentIcon = (type: Document['type']) => {
    switch (type) {
      case 'pdf':
        return <DocumentPdf24Regular className="w-5 h-5 text-red-500" />;
      case 'word':
        return <Document24Regular className="w-5 h-5 text-blue-600" />;
      case 'excel':
        return <Document24Regular className="w-5 h-5 text-green-600" />;
      default:
        return <Document24Regular className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getCategoryColor = (category: Document['category']) => {
    switch (category) {
      case 'manual':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'norma':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'especificacion':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'reporte':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'plano':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'todos' || doc.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const documentsByCategory = {
    todos: documents.length,
    manual: documents.filter(d => d.category === 'manual').length,
    norma: documents.filter(d => d.category === 'norma').length,
    especificacion: documents.filter(d => d.category === 'especificacion').length,
    reporte: documents.filter(d => d.category === 'reporte').length,
    plano: documents.filter(d => d.category === 'plano').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Documentos</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona la documentación técnica y archivos del proyecto
          </p>
        </div>
        
        <Button className="bg-gradient-primary text-white">
          <CloudAdd24Regular className="w-4 h-4 mr-2" />
          Subir Documento
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search24Regular className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar documentos, tags, o contenido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter24Regular className="w-4 h-4 mr-2" />
                  Filtrar por categoría
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedCategory('todos')}>
                  Todos ({documentsByCategory.todos})
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedCategory('manual')}>
                  Manuales ({documentsByCategory.manual})
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedCategory('norma')}>
                  Normas ({documentsByCategory.norma})
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedCategory('especificacion')}>
                  Especificaciones ({documentsByCategory.especificacion})
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedCategory('reporte')}>
                  Reportes ({documentsByCategory.reporte})
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedCategory('plano')}>
                  Planos ({documentsByCategory.plano})
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Documents Content */}
      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">Vista Cuadrícula</TabsTrigger>
          <TabsTrigger value="list">Vista Lista</TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((document) => (
              <Card key={document.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getDocumentIcon(document.type)}
                      <Badge className={getCategoryColor(document.category)}>
                        {document.category}
                      </Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-1">
                          <MoreVertical24Regular className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Eye24Regular className="w-4 h-4 mr-2" />
                          Ver
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ArrowDownload24Regular className="w-4 h-4 mr-2" />
                          Descargar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share24Regular className="w-4 h-4 mr-2" />
                          Compartir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                    {document.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {document.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Person24Regular className="w-3 h-3 mr-1" />
                      {document.author}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar24Regular className="w-3 h-3 mr-1" />
                      {document.lastModified.toLocaleDateString('es-ES')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {document.size}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {document.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {document.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{document.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {filteredDocuments.map((document) => (
                  <div key={document.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        {getDocumentIcon(document.type)}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{document.name}</h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {document.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center">
                              <Person24Regular className="w-3 h-3 mr-1" />
                              {document.author}
                            </span>
                            <span className="flex items-center">
                              <Calendar24Regular className="w-3 h-3 mr-1" />
                              {document.lastModified.toLocaleDateString('es-ES')}
                            </span>
                            <span>{document.size}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Badge className={getCategoryColor(document.category)}>
                          {document.category}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="p-1">
                              <MoreVertical24Regular className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Eye24Regular className="w-4 h-4 mr-2" />
                              Ver
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ArrowDownload24Regular className="w-4 h-4 mr-2" />
                              Descargar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share24Regular className="w-4 h-4 mr-2" />
                              Compartir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FolderOpen24Regular className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron documentos</h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedCategory !== 'todos' 
                ? 'Intenta ajustar tus filtros de búsqueda.'
                : 'Comienza subiendo tu primer documento.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};