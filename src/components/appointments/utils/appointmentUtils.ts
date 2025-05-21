
import { AppointmentStatus, ServiceType } from "@/context/StoreContext";

export const translateServiceType = (type: string): string => {
  switch (type) {
    case "bath": return "Banho";
    case "grooming": return "Tosa";
    case "both": return "Banho e Tosa";
    default: return type;
  }
};

export const translateStatus = (status: AppointmentStatus): string => {
  switch (status) {
    case "waiting": return "Em espera";
    case "progress": return "Em andamento";
    case "completed": return "Concluído";
    default: return status;
  }
};

export const getStatusClassName = (status: AppointmentStatus): string => {
  switch (status) {
    case "waiting": return "status-waiting";
    case "progress": return "status-progress";
    case "completed": return "status-completed";
    default: return "";
  }
};
