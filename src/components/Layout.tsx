
import React, { useState } from "react";
import { Home, Users, Calendar, Scissors, Package, FileText, LogOut, Dog } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  setActivePage: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activePage, setActivePage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  
  const navigationItems = [
    { key: "dashboard", label: "Dashboard", icon: Home, allowed: true },
    { key: "clients", label: "Clientes", icon: Users, allowed: true },
    { key: "pets", label: "Pets", icon: Dog, allowed: true },
    { key: "appointments", label: "Agendamentos", icon: Calendar, allowed: true },
    { key: "groomers", label: "Tosadores", icon: Scissors, allowed: true },
    { key: "packages", label: "Pacotes", icon: Package, allowed: true },
    { key: "reports", label: "Relatórios", icon: FileText, allowed: isAdmin() },
  ];
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex md:flex-col w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-petshop-purple flex items-center gap-2">
            <Scissors className="h-6 w-6" />
            <span>PetShop Manager</span>
          </h1>
        </div>
        
        {/* User info */}
        <div className="p-4 border-b">
          <div className="text-sm">
            <p className="font-medium">{user?.username}</p>
            <p className="text-gray-500">{user?.role === 'admin' ? 'Administrador' : 'Usuário Comum'}</p>
          </div>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigationItems
            .filter(item => item.allowed)
            .map((item) => (
              <button
                key={item.key}
                onClick={() => setActivePage(item.key)}
                className={cn(
                  "flex items-center px-4 py-3 w-full text-left rounded-lg transition-colors",
                  activePage === item.key
                    ? "bg-petshop-purple text-white"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </button>
            ))}
            
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-3 w-full text-left rounded-lg transition-colors text-gray-600 hover:bg-gray-100 mt-auto"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sair
          </button>
        </nav>
      </aside>

      {/* Mobile sidebar */}
      <div className="md:hidden">
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity lg:hidden"
             style={{ display: isMobileMenuOpen ? "block" : "none" }}
             onClick={() => setIsMobileMenuOpen(false)}>
        </div>
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold text-petshop-purple flex items-center gap-2">
              <Scissors className="h-6 w-6" />
              <span>PetShop Manager</span>
            </h1>
          </div>
          
          {/* User info */}
          <div className="p-4 border-b">
            <div className="text-sm">
              <p className="font-medium">{user?.username}</p>
              <p className="text-gray-500">{user?.role === 'admin' ? 'Administrador' : 'Usuário Comum'}</p>
            </div>
          </div>
          
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigationItems
              .filter(item => item.allowed)
              .map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setActivePage(item.key);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "flex items-center px-4 py-3 w-full text-left rounded-lg transition-colors",
                    activePage === item.key
                      ? "bg-petshop-purple text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </button>
              ))}
              
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-3 w-full text-left rounded-lg transition-colors text-gray-600 hover:bg-gray-100 mt-auto"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sair
            </button>
          </nav>
        </aside>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top navbar */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <button className="md:hidden text-gray-600" onClick={toggleMobileMenu}>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex-1 md:ml-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {navigationItems.find(item => item.key === activePage)?.label || "Dashboard"}
              </h2>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">{user?.username}</p>
                <p className="text-xs text-gray-500">{user?.role === 'admin' ? 'Administrador' : 'Usuário Comum'}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};
