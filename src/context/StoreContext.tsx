
import React, { createContext, useContext, useState, useEffect } from "react";
import { Client, Pet, Groomer, Appointment, Commission, Package, GroomerPoint } from "./models/types";
import { ClientProvider, useClients } from "./clients/ClientContext";
import { PetProvider, usePets } from "./pets/PetContext";
import { GroomerProvider, useGroomers } from "./groomers/GroomerContext";
import { AppointmentProvider, useAppointments } from "./appointments/AppointmentContext";
import { CommissionProvider, useCommissions } from "./commissions/CommissionContext";
import { PackageProvider, usePackages } from "./packages/PackageContext";
import { GroomerPointsProvider, useGroomerPoints } from "./points/GroomerPointsContext";

// Re-export types for components to use
export type { Client, Pet, Groomer, Appointment, Commission, Package, GroomerPoint };
export type ServiceType = "bath" | "grooming" | "both" | "package";
export type TransportType = "pickup" | "delivery" | "none";
export type AppointmentStatus = "waiting" | "progress" | "completed" | "canceled";

interface StoreContextType {
  clients: Client[];
  pets: Pet[];
  groomers: Groomer[];
  appointments: Appointment[];
  commissions: Commission[];
  packages: Package[];
  groomerPoints: GroomerPoint[];
  addClient: (client: Omit<Client, "id">) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  addPet: (pet: Omit<Pet, "id">) => void;
  updatePet: (pet: Pet) => void;
  deletePet: (id: string) => void;
  addGroomer: (groomer: Omit<Groomer, "id">) => void;
  updateGroomer: (groomer: Groomer) => void;
  deleteGroomer: (id: string) => void;
  addAppointment: (appointment: Omit<Appointment, "id">) => void;
  updateAppointment: (appointment: Appointment) => void;
  deleteAppointment: (id: string) => void;
  addCommission: (commission: Omit<Commission, "id">) => void;
  getCommissionsByGroomerId: (groomerId: string) => Commission[];
  getTotalCommissionsByGroomerId: (groomerId: string, month?: number, year?: number) => number;
  addPackage: (pack: Omit<Package, "id">) => void;
  updatePackage: (pack: Package) => void;
  deletePackage: (id: string) => void;
  getClientById: (id: string) => Client | undefined;
  getPetById: (id: string) => Pet | undefined;
  getPetsByClientId?: (clientId: string) => Pet[];
  getGroomerById: (id: string) => Groomer | undefined;
  getPackageById: (id: string) => Package | undefined;
  getGroomerWorkload: (groomerId: string, onlyCompletedAppointments?: boolean) => number;
  getGroomerMonthlyPoints: (groomerId: string, month?: number, year?: number) => number;
  getGroomerPointsByMonth: (month: number, year: number) => GroomerPoint[];
  addGroomerPoints: (groomerId: string, points: number, appointmentId: string) => void;
  autoAssignGroomer?: (appointmentId: string) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ClientProvider>
      <PetProvider>
        <GroomerProvider>
          <PackageProvider>
            <CommissionProvider>
              <AppointmentProvider>
                <GroomerPointsProvider>
                  <StoreProviderInner>{children}</StoreProviderInner>
                </GroomerPointsProvider>
              </AppointmentProvider>
            </CommissionProvider>
          </PackageProvider>
        </GroomerProvider>
      </PetProvider>
    </ClientProvider>
  );
};

const StoreProviderInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { clients, addClient, updateClient, deleteClient, getClientById } = useClients();
  const { pets, addPet, updatePet, deletePet, getPetById, getPetsByClientId } = usePets();
  const { groomers, addGroomer, updateGroomer, deleteGroomer, getGroomerById, getGroomerWorkload } = useGroomers();
  const { appointments, addAppointment, updateAppointment, deleteAppointment, autoAssignGroomer } = useAppointments();
  const { commissions, addCommission, getCommissionsByGroomerId, getTotalCommissionsByGroomerId } = useCommissions();
  const { packages, addPackage, updatePackage, deletePackage, getPackageById } = usePackages();
  const { groomerPoints, addGroomerPoints, getGroomerMonthlyPoints, getGroomerPointsByMonth } = useGroomerPoints();

  const store = {
    clients,
    pets,
    groomers,
    appointments,
    commissions,
    packages,
    groomerPoints,
    addClient,
    updateClient,
    deleteClient,
    addPet,
    updatePet,
    deletePet,
    addGroomer,
    updateGroomer,
    deleteGroomer,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    addCommission,
    getCommissionsByGroomerId,
    getTotalCommissionsByGroomerId,
    addPackage,
    updatePackage,
    deletePackage,
    getClientById,
    getPetById,
    getPetsByClientId,
    getGroomerById,
    getPackageById,
    getGroomerWorkload,
    getGroomerMonthlyPoints,
    getGroomerPointsByMonth,
    addGroomerPoints,
    autoAssignGroomer,
  };

  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
};
