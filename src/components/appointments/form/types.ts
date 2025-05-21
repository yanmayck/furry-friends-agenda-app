
import { ServiceType, TransportType, AppointmentStatus } from "@/context/StoreContext";
import React from "react";

export interface AppointmentFormData {
  clientId: string;
  petName: string;
  date: string;
  time: string;
  serviceType: ServiceType;
  groomerId: string | null;
  status: AppointmentStatus;
  packageId: string | null;
  transportType: TransportType;
  price: number;
  points: number;
}

export interface FormFieldProps {
  formData: AppointmentFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}
