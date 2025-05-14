
import React, { useState } from "react";
import { Home, Users, Calendar, Scissors } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  setActivePage: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activePage, setActivePage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigationItems = [
    { key: "dashboard", label: "Dashboard", icon: Home },
    { key: "clients", label: "Clientes", icon: Users },
    { key: "appointments", label: "Agendamentos", icon: Calendar },
    { key: "groomers", label: "Tosadores", icon: Scissors },
  ];
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigationItems.map((item) => (
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
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigationItems.map((item) => (
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
