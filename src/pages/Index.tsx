
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import Dashboard from "@/components/Dashboard";
import ClientsList from "@/components/clients/ClientsList";
import AppointmentsList from "@/components/appointments/AppointmentsList";
import GroomersList from "@/components/groomers/GroomersList";
import PetsList from "@/components/pets/PetsList";
import PackagesList from "@/components/packages/PackagesList";
import Reports from "@/components/reports/Reports";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const Index: React.FC = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Redireciona para página de banho e tosa quando essa opção é selecionada
  const handlePageChange = (page: string) => {
    if (page === "banho-tosa") {
      navigate('/banho-tosa');
      return;
    }
    setActivePage(page);
  };
  
  return (
    <Layout activePage={activePage} setActivePage={handlePageChange}>
      {activePage === "dashboard" && <Dashboard />}
      {activePage === "clients" && <ClientsList />}
      {activePage === "pets" && <PetsList />}
      {activePage === "appointments" && <AppointmentsList />}
      {activePage === "groomers" && <GroomersList />}
      {activePage === "packages" && <PackagesList />}
      {activePage === "reports" && isAdmin() && <Reports />}
    </Layout>
  );
};

export default Index;
