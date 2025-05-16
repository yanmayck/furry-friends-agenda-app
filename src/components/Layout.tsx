
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Users,
  PawPrint,
  Calendar as CalendarIcon,
  User as UserIcon,
  Package as PackageIcon,
  Scissors,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  setActivePage: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activePage, setActivePage }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: "clients", label: "Clientes", icon: <Users className="h-4 w-4" /> },
    { id: "pets", label: "Pets", icon: <PawPrint className="h-4 w-4" /> },
    { id: "appointments", label: "Agendamentos", icon: <CalendarIcon className="h-4 w-4" /> },
    { id: "banho-tosa", label: "Banho e Tosa", icon: <Scissors className="h-4 w-4" /> },
    { id: "groomers", label: "Tosadores", icon: <UserIcon className="h-4 w-4" /> },
    { id: "packages", label: "Pacotes", icon: <PackageIcon className="h-4 w-4" /> },
  ];

  const isActive = (menuId: string) => {
    // Use location.pathname to check for active state
    return location.pathname === '/' && menuId === 'dashboard' || location.pathname.includes(menuId);
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-700">
      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="md:hidden">
            Menu
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>
              Navegue pelas opções do sistema.
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            {menuItems.map((item) => (
              <Link to={item.id === 'dashboard' ? '/' : `/${item.id}`} key={item.id}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${isActive(item.id) ? 'font-semibold' : ''}`}
                  onClick={() => setActivePage(item.id)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>
          <Separator />
          <div className="py-4">
            <Button variant="outline" className="w-full justify-start" onClick={logout}>
              Sair
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Menu */}
      <div className="hidden md:flex flex-col w-64 bg-gray-50 border-r border-gray-200">
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <span className="text-lg font-semibold">Pet Shop Manager</span>
        </div>
        <div className="flex-grow p-4 space-y-2">
          {menuItems.map((item) => (
            <Link to={item.id === 'dashboard' ? '/' : `/${item.id}`} key={item.id}>
              <Button
                variant="ghost"
                className={`w-full justify-start ${isActive(item.id) ? 'font-semibold' : ''}`}
                onClick={() => setActivePage(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Button>
            </Link>
          ))}
        </div>
        <Separator />
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>{user?.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{user?.username}</p>
              <p className="text-sm text-gray-500 leading-none">Admin</p>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start" onClick={logout}>
            Sair
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        {children}
      </div>
    </div>
  );
};

export { Layout };
