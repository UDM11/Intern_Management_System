import { ReactNode, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={toggleSidebar}
        isMobile={isMobile}
      />
      <div className={cn(
        "flex flex-1 flex-col min-w-0 transition-all duration-300",
        !isMobile && (sidebarCollapsed ? "md:ml-16" : "md:ml-72")
      )}>
        <Navbar />
        <main className="flex-1 p-4 md:p-6 overflow-auto pb-20 md:pb-6">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
