import React, { useState } from "react";
import { Appointment, AppointmentStatus, useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2, Plus, Calendar } from "lucide-react";
import AppointmentForm from "./AppointmentForm";

const AppointmentsList: React.FC = () => {
  const { appointments, deleteAppointment, groomers, clients, updateAppointment, autoAssignGroomer, getClientById, getGroomerById } = useStore();
  
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | undefined>(undefined);
  
  // Filters
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">("all");
  const [groomerFilter, setGroomerFilter] = useState("all");

  const handleEditAppointment = (appointment: Appointment) => {
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
    const appointment = appointments.find(a => a.id === appointmentId);
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
  
  // Apply filters
  const filteredAppointments = appointments.filter(appointment => {
    // Filter by date
    if (dateFilter && appointment.date !== dateFilter) {
      return false;
    }
    
    // Filter by status
    if (statusFilter !== "all" && appointment.status !== statusFilter) {
      return false;
    }
    
    // Filter by groomer
    if (groomerFilter !== "all" && appointment.groomerId !== groomerFilter) {
      return false;
    }
    
    return true;
  });
  
  const getClientName = (clientId: string) => {
    const client = getClientById(clientId);
    return client ? client.tutorName : "Cliente não encontrado";
  };
  
  const getGroomerName = (groomerId: string | null) => {
    if (!groomerId) return "Não atribuído";
    const groomer = getGroomerById(groomerId);
    return groomer ? groomer.name : "Tosador não encontrado";
  };
  
  const translateServiceType = (type: string) => {
    switch (type) {
      case "bath": return "Banho";
      case "grooming": return "Tosa";
      case "both": return "Banho e Tosa";
      default: return type;
    }
  };
  
  const translateStatus = (status: AppointmentStatus) => {
    switch (status) {
      case "waiting": return "Em espera";
      case "progress": return "Em andamento";
      case "completed": return "Concluído";
      default: return status;
    }
  };
  
  return (
    <div className="space-y-4">
      {showForm ? (
        <AppointmentForm appointment={editingAppointment} onClose={handleCloseForm} />
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-end">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as AppointmentStatus | "all")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="waiting">Em espera</SelectItem>
                    <SelectItem value="progress">Em andamento</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tosador</label>
                <Select value={groomerFilter} onValueChange={setGroomerFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tosador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="unassigned">Não atribuído</SelectItem>
                    {groomers.map((groomer) => (
                      <SelectItem key={groomer.id} value={groomer.id}>{groomer.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Agendamento
            </Button>
          </div>
          
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente / Pet
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data / Hora
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Serviço
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tosador
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{getClientName(appointment.clientId)}</div>
                          <div className="text-sm text-gray-500">{appointment.petName}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(appointment.date).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">{appointment.time}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{translateServiceType(appointment.serviceType)}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {appointment.groomerId ? (
                            <div className="text-sm text-gray-900">{getGroomerName(appointment.groomerId)}</div>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs" 
                              onClick={() => handleAutoAssign(appointment.id)}
                            >
                              Atribuir auto
                            </Button>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <Select 
                            value={appointment.status} 
                            onValueChange={(value) => handleStatusChange(appointment.id, value as AppointmentStatus)}
                          >
                            <SelectTrigger className={`h-8 text-xs w-28 ${
                              appointment.status === "waiting" ? "status-waiting" : 
                              appointment.status === "progress" ? "status-progress" : "status-completed"
                            }`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="waiting">Em espera</SelectItem>
                              <SelectItem value="progress">Em andamento</SelectItem>
                              <SelectItem value="completed">Concluído</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditAppointment(appointment)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteAppointment(appointment.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-4 text-center text-sm text-gray-500">
                        {dateFilter || statusFilter !== "all" || groomerFilter !== "all"
                          ? "Nenhum agendamento encontrado com os filtros selecionados."
                          : "Nenhum agendamento cadastrado. Clique em 'Novo Agendamento' para adicionar."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default AppointmentsList;
