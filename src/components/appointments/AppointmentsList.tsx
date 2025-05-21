
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AppointmentForm from "./AppointmentForm";
import { AppointmentStatus } from "@/context/StoreContext";
import { PointsEditDialog } from "./PointsEditDialog";
import { AppointmentFilters } from "./filters/AppointmentFilters";
import { AppointmentsTable } from "./table/AppointmentsTable";
import { useAppointmentsFilter } from "./hooks/useAppointmentsFilter";

const AppointmentsList: React.FC = () => {
  const { 
    deleteAppointment, 
    updateAppointment, 
    updateAppointmentPoints,
    autoAssignGroomer
  } = useStore();
  
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<any>(undefined);
  
  // Points editing
  const [isPointsDialogOpen, setIsPointsDialogOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  
  // Get filtering logic and filtered appointments
  const {
    dateFilter,
    statusFilter,
    groomerFilter,
    setDateFilter,
    setStatusFilter,
    setGroomerFilter,
    filteredAppointments
  } = useAppointmentsFilter();

  const handleEditAppointment = (appointment: any) => {
    setEditingAppointment(appointment);
    setShowForm(true);
  };
  
  const handleDeleteAppointment = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este agendamento?")) {
      deleteAppointment(id);
    }
  };
  
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAppointment(undefined);
  };
  
  const handleStatusChange = (appointmentId: string, status: AppointmentStatus) => {
    const appointment = filteredAppointments.find(a => a.id === appointmentId);
    if (appointment) {
      updateAppointment({
        ...appointment,
        status
      });
    }
  };
  
  const handleAutoAssign = (appointmentId: string) => {
    autoAssignGroomer(appointmentId);
  };

  const handleEditPoints = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setIsPointsDialogOpen(true);
  };
  
  const handleSavePoints = (points: number) => {
    if (selectedAppointmentId) {
      updateAppointmentPoints(selectedAppointmentId, points);
    }
  };
  
  return (
    <Layout activePage="appointments" setActivePage={() => {}}>
      <div className="space-y-4">
        {showForm ? (
          <AppointmentForm appointment={editingAppointment} onClose={handleCloseForm} />
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-end">
              <AppointmentFilters
                dateFilter={dateFilter}
                statusFilter={statusFilter}
                groomerFilter={groomerFilter}
                setDateFilter={setDateFilter}
                setStatusFilter={setStatusFilter}
                setGroomerFilter={setGroomerFilter}
              />
              
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Agendamento
              </Button>
            </div>
            
            <AppointmentsTable 
              filteredAppointments={filteredAppointments}
              dateFilter={dateFilter}
              statusFilter={statusFilter}
              groomerFilter={groomerFilter}
              handleEditAppointment={handleEditAppointment}
              handleDeleteAppointment={handleDeleteAppointment}
              handleStatusChange={handleStatusChange}
              handleAutoAssign={handleAutoAssign}
              handleEditPoints={handleEditPoints}
            />
            
            {/* Points edit dialog */}
            <PointsEditDialog
              isOpen={isPointsDialogOpen}
              onClose={() => setIsPointsDialogOpen(false)}
              initialPoints={selectedAppointmentId ? 
                (filteredAppointments.find(a => a.id === selectedAppointmentId)?.points || 1) : 1}
              onSave={handleSavePoints}
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export default AppointmentsList;
