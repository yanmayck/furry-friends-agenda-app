import React, { createContext, useContext } from "react";
import { ClientProvider, useClients } from "./clients/ClientContext";
import { PetProvider, usePets } from "./pets/PetContext";
import { GroomerProvider, useGroomers } from "./groomers/GroomerContext";
import { PackageProvider, usePackages } from "./packages/PackageContext";
import { AppointmentProvider, useAppointments } from "./appointments/AppointmentContext";
import { CommissionProvider, useCommissions } from "./commissions/CommissionContext";
import { toast } from "@/components/ui/use-toast";
import { 
  Client, 
  Groomer, 
  Package, 
  Pet, 
  generateId
} from "./models/types";

// Define custom types for this context
export type AppointmentStatus = "waiting" | "progress" | "completed";
export type ServiceType = "bath" | "grooming" | "both" | "package";
export type TransportType = "client" | "pickup";

export interface Appointment {
  id: string;
  clientId: string;
  petName: string;
  date: string;
  time: string;
  serviceType: ServiceType;
  groomerId: string | null;
  status: AppointmentStatus;
  packageId?: string | null;
  transportType?: TransportType;
  price: number;
}

// Define the combined context type
interface StoreContextType {
  // Client context
  clients: Client[];
  addClient: (client: Omit<Client, "id">) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;
  
  // Pet context
  pets: Pet[];
  addPet: (pet: Omit<Pet, "id">) => void;
  updatePet: (pet: Pet) => void;
  deletePet: (id: string) => void;
  getPetById: (id: string) => Pet | undefined;
  getPetsByClientId: (clientId: string) => Pet[];
  
  // Package context
  packages: Package[];
  addPackage: (pkg: Omit<Package, "id">) => void;
  updatePackage: (pkg: Package) => void;
  deletePackage: (id: string) => void;
  getPackageById: (id: string) => Package | undefined;
  
  // Groomer context
  groomers: Groomer[];
  addGroomer: (groomer: Omit<Groomer, "id">) => void;
  updateGroomer: (groomer: Groomer) => void;
  deleteGroomer: (id: string) => void;
  getGroomerById: (id: string) => Groomer | undefined;
  getGroomerWorkload: (groomerId: string) => number;
  
  // Appointment context
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, "id">) => void;
  updateAppointment: (appointment: Appointment) => void;
  deleteAppointment: (id: string) => void;
  autoAssignGroomer: (appointmentId: string) => void;
  
  // Commission context
  commissions: any[];
  addCommission: (commission: Omit<any, "id">) => void;
  getCommissionsByGroomerId: (groomerId: string) => any[];
  getTotalCommissionsByGroomerId: (groomerId: string, month?: number, year?: number) => number;
  getCommissionsByMonth: (month: number, year: number) => any[];
}

// Create the context
const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Custom hook to use the store context
export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};

// Inner provider that consumes all the individual hooks and provides the combined context
const StoreProviderInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get all the individual contexts
  const clientContext = useClients();
  const petContext = usePets();
  const groomerContext = useGroomers();
  const packageContext = usePackages();
  const appointmentContext = useAppointments();
  const commissionContext = useCommissions();

  // Add specific custom functions that combine multiple contexts
  
  // Compute groomer workload without cyclic dependencies
  const getGroomerWorkload = (groomerId: string) => {
    if (!appointmentContext.appointments) return 0;
    
    return appointmentContext.appointments.filter(
      appointment => 
        appointment.groomerId === groomerId && 
        appointment.status !== "completed"
    ).length;
  };

  // Check if a groomer has appointments before deleting
  const deleteGroomer = (id: string) => {
    if (!appointmentContext.appointments) return;
    
    const hasAssignedAppointments = appointmentContext.appointments.some(
      appointment => appointment.groomerId === id
    );
    
    if (hasAssignedAppointments) {
      toast({
        title: "Não é possível excluir",
        description: "Este tosador tem agendamentos atribuídos. Por favor, reatribua esses agendamentos primeiro.",
        variant: "destructive"
      });
      return;
    }
    
    groomerContext.deleteGroomer(id);
  };

  // Override package deletion to check for appointments using it
  const deletePackage = (id: string) => {
    // Check if there are any appointments using this package
    const hasAppointments = appointmentContext.appointments.some(appointment => appointment.packageId === id);
    
    if (hasAppointments) {
      toast({
        title: "Não é possível excluir",
        description: "Este pacote está sendo usado em agendamentos. Por favor, remova ou atualize esses agendamentos primeiro.",
        variant: "destructive"
      });
      return;
    }
    
    packageContext.deletePackage(id);
  };

  // Combine all contexts into a single value
  const value: StoreContextType = {
    ...clientContext,
    ...petContext,
    ...packageContext,
    ...commissionContext,
    ...appointmentContext,
    ...groomerContext,
    getGroomerWorkload,
    deleteGroomer,
    deletePackage, // Override the package context's deletePackage with our version that checks appointments
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};

// Outer provider that sets up all the individual providers
export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ClientProvider>
      <PetProvider>
        <GroomerProvider>
          <CommissionProvider>
            <AppointmentProvider>
              <PackageProvider>
                <StoreProviderInner>
                  {children}
                </StoreProviderInner>
              </PackageProvider>
            </AppointmentProvider>
          </CommissionProvider>
        </GroomerProvider>
      </PetProvider>
    </ClientProvider>
  );
};

// Export types from models for easier access
export type {
  Client,
  Groomer,
  Package,
  Pet,
};
