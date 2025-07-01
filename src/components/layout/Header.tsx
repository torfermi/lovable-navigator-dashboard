import React from 'react';
import { useAppStore, useRolePermissions, useQuickLogin } from '@/stores/useAppStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  WeatherMoon24Regular,
  WeatherSunny24Regular,
  Person24Regular,
  SignOut24Regular,
  Settings24Regular,
  Alert24Regular,
} from '@fluentui/react-icons';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const { 
    isDarkMode, 
    toggleDarkMode, 
    user, 
    isAuthenticated, 
    logout,
    notifications 
  } = useAppStore();
  
  const { currentRole } = useRolePermissions();
  const { loginAs } = useQuickLogin();

  const unreadCount = notifications.filter(n => !n.read).length;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-destructive text-destructive-foreground';
      case 'ingeniero':
        return 'bg-primary text-primary-foreground';
      case 'compras':
        return 'bg-accent text-accent-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className={`bg-card border-b border-border px-4 py-3 flex items-center justify-between ${className}`}>
      {/* Left side - breadcrumb could go here */}
      <div className="flex items-center space-x-4">
        <h1 className="text-lg font-semibold text-foreground">
          {/* Esto se puede actualizar dinámicamente según la página */}
        </h1>
      </div>

      {/* Right side - controls */}
      <div className="flex items-center space-x-3">
        {/* Dark mode toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleDarkMode}
          className="p-2"
          aria-label={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
          {isDarkMode ? (
            <WeatherSunny24Regular className="w-5 h-5" />
          ) : (
            <WeatherMoon24Regular className="w-5 h-5" />
          )}
        </Button>

        {/* Notifications */}
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" className="relative p-2">
            <Alert24Regular className="w-5 h-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>
        )}

        {/* User menu */}
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {getUserInitials(user?.name || 'U')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{user?.name}</span>
                  <Badge variant="outline" className={`text-xs ${getRoleColor(currentRole || '')}`}>
                    {currentRole}
                  </Badge>
                </div>
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem>
                <Person24Regular className="mr-2 h-4 w-4" />
                Perfil
              </DropdownMenuItem>
              
              <DropdownMenuItem>
                <Settings24Regular className="mr-2 h-4 w-4" />
                Configuración
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={logout} className="text-destructive">
                <SignOut24Regular className="mr-2 h-4 w-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          /* Demo login buttons para desarrollo */
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Demo:</span>
            <Button variant="outline" size="sm" onClick={() => loginAs('admin')}>
              Admin
            </Button>
            <Button variant="outline" size="sm" onClick={() => loginAs('ingeniero')}>
              Ingeniero
            </Button>
            <Button variant="outline" size="sm" onClick={() => loginAs('compras')}>
              Compras
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};