
import React, { createContext, useContext, useState, useEffect } from "react";
import { Appointment } from "../models/types";
import { generateId } from "../models/types";
import { loadFromStorage, saveToStorage } from "../utils/storage";
import { toast } from "@/components/ui/use-toast";
import { useGroomers } from "../groomers/GroomerContext";
import { useCommissions } from "../commissions/CommissionContext";

interface AppointmentContextType {
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, "id">) => void;
  updateAppointment: (appointment: Appointment) => void;
  deleteAppointment: (id: string) => void;
  autoAssignGroomer: (appointmentId: string) => void;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error("useAppointments must be used within an AppointmentProvider");
  }
  return context;
};

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { groomers, getGroomerById } = useGroomers();
  const { addCommission } = useCommissions();

  // Load appointments from localStorage on mount
  useEffect(() => {
    const storedAppointments = loadFromStorage<Appointment[]>("petshop-appointments", []);
    setAppointments(storedAppointments);
  }, []);

  // Save appointments to localStorage when they change
  useEffect(() => {
    saveToStorage("petshop-appointments", appointments);
  }, [appointments]);

  const addAppointment = (appointment: Omit<Appointment, "id">) => {
    const newAppointment = { ...appointment, id: generateId() };
    setAppointments([...appointments, newAppointment]);
    toast({
      title: "Agendamento criado",
      description: `Agendamento para ${appointment.petName} foi criado com sucesso.`
    });
  };
  
  const updateAppointment = (updatedAppointment: Appointment) => {
    const oldAppointment = appointments.find(app => app.id === updatedAppointment.id);
    
    // If the appointment is being marked as completed, generate a commission
    if (oldAppointment && oldAppointment.status !== "completed" && updatedAppointment.status === "completed" && updatedAppointment.groomerId) {
      const groomer = getGroomerById(updatedAppointment.groomerId);
      
      if (groomer) {
        const commissionValue = (updatedAppointment.price * groomer.commissionPercentage) / 100;
        
        const newCommission = {
          groomerId: updatedAppointment.groomerId,
          appointmentId: updatedAppointment.id,
          value: commissionValue,
          date: new Date().toISOString().split('T')[0]
        };
        
        addCommission(newCommission);
      }
    }
    
    setAppointments(
      appointments.map(appointment => 
        appointment.id === updatedAppointment.id ? updatedAppointment : appointment
      )
    );
    
    toast({
      title: "Agendamento atualizado",
      description: `Agendamento para ${updatedAppointment.petName} foi atualizado com sucesso.`
    });
  };
  
  const deleteAppointment = (id: string) => {
    const appointmentToDelete = appointments.find(appointment => appointment.id === id);
    setAppointments(appointments.filter(appointment => appointment.id !== id));
    
    if (appointmentToDelete) {
      toast({
        title: "Agendamento excluído",
        description: `Agendamento para ${appointmentToDelete.petName} foi removido com sucesso.`
      });
    }
  };
  
  // Auto assign a groomer to an appointment based on workload
  const autoAssignGroomer = (appointmentId: string) => {
    const availableGroomers = groomers.filter(groomer => groomer.status === "available");
    
    if (availableGroomers.length === 0) {
      toast({
        title: "Sem tosadores disponíveis",
        description: "Não há tosadores disponíveis para atribuir.",
        variant: "destructive"
      });
      return;
    }
    
    // Find the groomer with the least workload by counting their active appointments
    let groomersWithWorkload = availableGroomers.map(groomer => {
      const workload = appointments.filter(
        appointment => appointment.groomerId === groomer.id && appointment.status !== "completed"
      ).length;
      
      return { groomer, workload };
    });
    
    // Sort by workload (ascending)
    groomersWithWorkload.sort((a, b) => a.workload - b.workload);
    const leastBusyGroomer = groomersWithWorkload[0].groomer;
    
    // Update the appointment with the assigned groomer
    setAppointments(
      appointments.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, groomerId: leastBusyGroomer.id } 
          : appointment
      )
    );
    
    toast({
      title: "Tosador atribuído",
      description: `${leastBusyGroomer.name} foi atribuído automaticamente ao agendamento.`
    });
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        autoAssignGroomer,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};
