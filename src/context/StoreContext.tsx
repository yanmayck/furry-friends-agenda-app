
import React, { createContext, useContext, useEffect, useState } from "react";

// Define types for our data models
export interface Client {
  id: string;
  tutorName: string;
  petName: string;
  phone: string;
  email: string;
  address: string;
}

export interface Groomer {
  id: string;
  name: string;
  status: "available" | "busy";
}

export type AppointmentStatus = "waiting" | "progress" | "completed";
export type ServiceType = "bath" | "grooming" | "both";

export interface Appointment {
  id: string;
  clientId: string;
  petName: string;
  date: string;
  time: string;
  serviceType: ServiceType;
  groomerId: string | null;
  status: AppointmentStatus;
}

interface StoreContextType {
  clients: Client[];
  groomers: Groomer[];
  appointments: Appointment[];
  addClient: (client: Omit<Client, "id">) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  addGroomer: (groomer: Omit<Groomer, "id">) => void;
  updateGroomer: (groomer: Groomer) => void;
  deleteGroomer: (id: string) => void;
  addAppointment: (appointment: Omit<Appointment, "id">) => void;
  updateAppointment: (appointment: Appointment) => void;
  deleteAppointment: (id: string) => void;
  getClientById: (id: string) => Client | undefined;
  getGroomerById: (id: string) => Groomer | undefined;
  autoAssignGroomer: (appointmentId: string) => void;
  getGroomerWorkload: (groomerId: string) => number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [groomers, setGroomers] = useState<Groomer[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Load data from localStorage on initial mount
  useEffect(() => {
    const storedClients = localStorage.getItem("petshop-clients");
    const storedGroomers = localStorage.getItem("petshop-groomers");
    const storedAppointments = localStorage.getItem("petshop-appointments");

    if (storedClients) setClients(JSON.parse(storedClients));
    if (storedGroomers) setGroomers(JSON.parse(storedGroomers));
    if (storedAppointments) setAppointments(JSON.parse(storedAppointments));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("petshop-clients", JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem("petshop-groomers", JSON.stringify(groomers));
  }, [groomers]);

  useEffect(() => {
    localStorage.setItem("petshop-appointments", JSON.stringify(appointments));
  }, [appointments]);

  // Helper functions
  const generateId = () => Math.random().toString(36).slice(2, 11);
  
  const getClientById = (id: string) => {
    return clients.find(client => client.id === id);
  };
  
  const getGroomerById = (id: string) => {
    return groomers.find(groomer => groomer.id === id);
  };
  
  const getGroomerWorkload = (groomerId: string) => {
    return appointments.filter(
      appointment => appointment.groomerId === groomerId && appointment.status !== "completed"
    ).length;
  };
  
  // Client CRUD operations
  const addClient = (client: Omit<Client, "id">) => {
    const newClient = { ...client, id: generateId() };
    setClients([...clients, newClient]);
  };
  
  const updateClient = (updatedClient: Client) => {
    setClients(
      clients.map(client => 
        client.id === updatedClient.id ? updatedClient : client
      )
    );
  };
  
  const deleteClient = (id: string) => {
    // Check if there are any appointments associated with this client
    const hasAppointments = appointments.some(appointment => {
      const client = getClientById(appointment.clientId);
      return client && id === client.id;
    });

    if (hasAppointments) {
      alert("This client has appointments scheduled. Please delete their appointments first.");
      return;
    }
    
    setClients(clients.filter(client => client.id !== id));
  };
  
  // Groomer CRUD operations
  const addGroomer = (groomer: Omit<Groomer, "id">) => {
    const newGroomer = { ...groomer, id: generateId() };
    setGroomers([...groomers, newGroomer]);
  };
  
  const updateGroomer = (updatedGroomer: Groomer) => {
    setGroomers(
      groomers.map(groomer => 
        groomer.id === updatedGroomer.id ? updatedGroomer : groomer
      )
    );
  };
  
  const deleteGroomer = (id: string) => {
    // Check if there are any appointments assigned to this groomer
    const hasAssignedAppointments = appointments.some(appointment => appointment.groomerId === id);
    
    if (hasAssignedAppointments) {
      alert("This groomer has appointments assigned. Please reassign those appointments first.");
      return;
    }
    
    setGroomers(groomers.filter(groomer => groomer.id !== id));
  };
  
  // Appointment CRUD operations
  const addAppointment = (appointment: Omit<Appointment, "id">) => {
    const newAppointment = { ...appointment, id: generateId() };
    setAppointments([...appointments, newAppointment]);
  };
  
  const updateAppointment = (updatedAppointment: Appointment) => {
    setAppointments(
      appointments.map(appointment => 
        appointment.id === updatedAppointment.id ? updatedAppointment : appointment
      )
    );
  };
  
  const deleteAppointment = (id: string) => {
    setAppointments(appointments.filter(appointment => appointment.id !== id));
  };
  
  // Auto assign a groomer to an appointment based on workload
  const autoAssignGroomer = (appointmentId: string) => {
    const availableGroomers = groomers.filter(groomer => groomer.status === "available");
    
    if (availableGroomers.length === 0) {
      alert("No available groomers.");
      return;
    }
    
    // Find the groomer with the least workload
    let leastBusyGroomer = availableGroomers[0];
    let minWorkload = getGroomerWorkload(leastBusyGroomer.id);
    
    availableGroomers.forEach(groomer => {
      const workload = getGroomerWorkload(groomer.id);
      if (workload < minWorkload) {
        leastBusyGroomer = groomer;
        minWorkload = workload;
      }
    });
    
    // Update the appointment with the assigned groomer
    setAppointments(
      appointments.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, groomerId: leastBusyGroomer.id } 
          : appointment
      )
    );
  };
  
  const value = {
    clients,
    groomers,
    appointments,
    addClient,
    updateClient,
    deleteClient,
    addGroomer,
    updateGroomer,
    deleteGroomer,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    getClientById,
    getGroomerById,
    autoAssignGroomer,
    getGroomerWorkload
  };
  
  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};
