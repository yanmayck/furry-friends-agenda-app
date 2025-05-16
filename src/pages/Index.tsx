
import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import Dashboard from "@/components/Dashboard";
import ClientsList from "@/components/clients/ClientsList";
import AppointmentsList from "@/components/appointments/AppointmentsList";
import GroomersList from "@/components/groomers/GroomersList";
import PetsList from "@/components/pets/PetsList";
import PackagesList from "@/components/packages/PackagesList";
import Reports from "@/components/reports/Reports";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const Index: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [activePage, setActivePage] = useState("dashboard");
  
  // Set activePage based on current location
  useEffect(() => {
    const path = location.pathname.replace('/', '');
    if (path === '') {
      setActivePage("dashboard");
    } else {
      setActivePage(path);
    }
  }, [location]);
  
  // Handle page navigation
  const handlePageChange = (page: string) => {
    if (page === "dashboard") {
      navigate('/');
    } else {
      navigate(`/${page}`);
    }
    setActivePage(page);
  };
  
  return (
    <Layout activePage={activePage} setActivePage={handlePageChange}>
      <Dashboard />
    </Layout>
  );
};

export default Index;
