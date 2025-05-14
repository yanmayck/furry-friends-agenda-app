
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import Dashboard from "@/components/Dashboard";
import ClientsList from "@/components/clients/ClientsList";
import AppointmentsList from "@/components/appointments/AppointmentsList";
import GroomersList from "@/components/groomers/GroomersList";

const Index: React.FC = () => {
  const [activePage, setActivePage] = useState("dashboard");
  
  return (
    <Layout activePage={activePage} setActivePage={setActivePage}>
      {activePage === "dashboard" && <Dashboard />}
      {activePage === "clients" && <ClientsList />}
      {activePage === "appointments" && <AppointmentsList />}
      {activePage === "groomers" && <GroomersList />}
    </Layout>
  );
};

export default Index;
