
import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import Dashboard from "@/components/Dashboard";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

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
