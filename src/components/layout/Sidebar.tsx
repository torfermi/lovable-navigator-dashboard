import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppStore, useRolePermissions, type UserRole } from '@/stores/useAppStore';
import { cn } from '@/lib/utils';
import {
  Home24Regular,
  Chat24Regular,
  Document24Regular,
  Folder24Regular,
  Settings24Regular,
  ChevronLeft24Regular,
  ChevronRight24Regular,
} from '@fluentui/react-icons';

interface SidebarProps {
  className?: string;
}

const navigationItems: Array<{
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredRoles: UserRole[];
}> = [
  {
    name: 'Panel',
    href: '/',
    icon: Home24Regular,
    requiredRoles: ['admin', 'ingeniero', 'compras'],
  },
  {
    name: 'Chat',
    href: '/chat',
    icon: Chat24Regular,
    requiredRoles: ['admin', 'ingeniero', 'compras'],
  },
  {
    name: 'Documentos',
    href: '/documentos',
    icon: Document24Regular,
    requiredRoles: ['admin', 'ingeniero', 'compras'],
  },
  {
    name: 'Proyectos',
    href: '/proyectos',
    icon: Folder24Regular,
    requiredRoles: ['admin', 'ingeniero'],
  },
  {
    name: 'Admin',
    href: '/admin',
    icon: Settings24Regular,
    requiredRoles: ['admin'],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const { isSidebarCollapsed, toggleSidebar } = useAppStore();
  const { canAccess } = useRolePermissions();
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const filteredItems = navigationItems.filter(item => 
    canAccess(item.requiredRoles)
  );

  return (
    <aside
      className={cn(
        "bg-card border-r border-border transition-all duration-300 ease-in-out flex flex-col h-full",
        isSidebarCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!isSidebarCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">IC</span>
            </div>
            <span className="font-semibold text-foreground">IngenieríaCopilot</span>
          </div>
        )}
        
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
          aria-label={isSidebarCollapsed ? "Expandir sidebar" : "Contraer sidebar"}
        >
          {isSidebarCollapsed ? (
            <ChevronRight24Regular className="w-5 h-5" />
          ) : (
            <ChevronLeft24Regular className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={cn(
                    "flex items-center rounded-lg transition-all duration-200 group relative",
                    isSidebarCollapsed ? "p-3 justify-center" : "p-3",
                    active
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  title={isSidebarCollapsed ? item.name : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  
                  {!isSidebarCollapsed && (
                    <span className="ml-3 font-medium">{item.name}</span>
                  )}
                  
                  {/* Tooltip para modo colapsado */}
                  {isSidebarCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap">
                      {item.name}
                    </div>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer info */}
      {!isSidebarCollapsed && (
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            <div className="font-medium">IngenieríaCopilot</div>
            <div>v1.0.0</div>
          </div>
        </div>
      )}
    </aside>
  );
};