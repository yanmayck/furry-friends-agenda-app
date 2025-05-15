
// Types and interfaces for the store

// Client model
export interface Client {
  id: string;
  tutorName: string;
  petName: string;
  cpf: string;
  phone: string;
  email: string;
  address: string;
}

// Pet model
export interface Pet {
  id: string;
  clientId: string;
  name: string;
  foodType: string;
  lastTickMedicine: {
    name: string;
    date: string;
  };
  rabiesVaccine: {
    isUpToDate: boolean;
    lastDate: string;
  };
  vaccineHistory: Array<{
    name: string;
    date: string;
  }>;
}

// Groomer model
export interface Groomer {
  id: string;
  name: string;
  status: "available" | "busy";
  commissionPercentage: number;
}

// Commission model
export interface Commission {
  id: string;
  groomerId: string;
  appointmentId: string;
  value: number;
  date: string;
}

// Package model
export interface Package {
  id: string;
  name: string;
  description: string;
  includesBaths: number;
  includesGrooming: boolean;
  includesHydration: boolean;
  basePrice: number;
  pickupPrice: number;
}

// Appointment types
export type AppointmentStatus = "waiting" | "progress" | "completed";
export type ServiceType = "bath" | "grooming" | "both" | "package";
export type TransportType = "client" | "pickup";

// Appointment model
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

// Utility function for generating IDs
export const generateId = () => Math.random().toString(36).slice(2, 11);
