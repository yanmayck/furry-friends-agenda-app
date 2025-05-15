
import React, { createContext, useContext } from "react";
import { toast } from "@/components/ui/use-toast";

// Import types
import type {
  Client,
  Pet,
  Groomer,
  Appointment,
  Package,
  Commission,
  AppointmentStatus,
  ServiceType,
  TransportType,
} from "./models/types";

// Import providers
import { ClientProvider, useClients } from "./clients/ClientContext";
import { PetProvider, usePets } from "./pets/PetContext";
import { GroomerProvider, useGroomers } from "./groomers/GroomerContext";
import { PackageProvider, usePackages } from "./packages/PackageContext";
import { AppointmentProvider, useAppointments } from "./appointments/AppointmentContext";
import { CommissionProvider, useCommissions } from "./commissions/CommissionContext";

// Re-export all types for backwards compatibility
export type {
  Client,
  Pet,
  Groomer,
  Appointment,
  Package,
  Commission,
  AppointmentStatus,
  ServiceType,
  TransportType,
};

// Define the complete store context type that combines all sub-contexts
interface StoreContextType {
  // Client methods and state
  clients: Client[];
  addClient: (client: Omit<Client, "id">) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;
  
  // Pet methods and state
  pets: Pet[];
  addPet: (pet: Omit<Pet, "id">) => void;
  updatePet: (pet: Pet) => void;
  deletePet: (id: string) => void;
  getPetById: (id: string) => Pet | undefined;
  getPetsByClientId: (clientId: string) => Pet[];
  
  // Groomer methods and state
  groomers: Groomer[];
  addGroomer: (groomer: Omit<Groomer, "id">) => void;
  updateGroomer: (groomer: Groomer) => void;
  deleteGroomer: (id: string) => void;
  getGroomerById: (id: string) => Groomer | undefined;
  getGroomerWorkload: (groomerId: string) => number;
  
  // Appointment methods and state
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, "id">) => void;
  updateAppointment: (appointment: Appointment) => void;
  deleteAppointment: (id: string) => void;
  autoAssignGroomer: (appointmentId: string) => void;
  
  // Package methods and state
  packages: Package[];
  addPackage: (pkg: Omit<Package, "id">) => void;
  updatePackage: (pkg: Package) => void;
  deletePackage: (id: string) => void;
  getPackageById: (id: string) => Package | undefined;
  
  // Commission methods and state
  commissions: Commission[];
  addCommission: (commission: Omit<Commission, "id">) => void;
  getCommissionsByGroomerId: (groomerId: string) => Commission[];
  getTotalCommissionsByGroomerId: (groomerId: string, month?: number, year?: number) => number;
  getCommissionsByMonth: (month: number, year: number) => Commission[];
}

// Create the combined context
const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Main hook that provides access to the entire store
export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};

// Combined provider that wraps all individual providers
// Important: CommissionProvider must come before AppointmentProvider, which must come after GroomerProvider
export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ClientProvider>
      <PetProvider>
        <PackageProvider>
          <GroomerProvider>
            <CommissionProvider>
              <AppointmentProvider>
                <StoreProviderInner>{children}</StoreProviderInner>
              </AppointmentProvider>
            </CommissionProvider>
          </GroomerProvider>
        </PackageProvider>
      </PetProvider>
    </ClientProvider>
  );
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

  // Modify getGroomerWorkload to pass appointments
  const getGroomerWorkload = (groomerId: string) => {
    return groomerContext.getGroomerWorkload(groomerId, appointmentContext.appointments);
  };

  // Check if a groomer has appointments before deleting
  const deleteGroomer = (id: string) => {
    const hasAssignedAppointments = appointmentContext.appointments.some(appointment => appointment.groomerId === id);
    
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
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};
