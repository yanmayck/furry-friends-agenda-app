
import React, { useState, useEffect } from "react";
import { Appointment, Client, Groomer, AppointmentStatus, ServiceType, useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AppointmentFormProps {
  appointment?: Appointment;
  onClose: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ appointment, onClose }) => {
  const { clients, groomers, addAppointment, updateAppointment, getClientById } = useStore();
  const isEditing = !!appointment;
  
  const [formData, setFormData] = useState<{
    clientId: string;
    petName: string;
    date: string;
    time: string;
    serviceType: ServiceType;
    groomerId: string | null;
    status: AppointmentStatus;
  }>({
    clientId: "",
    petName: "",
    date: new Date().toISOString().split('T')[0],
    time: "08:00",
    serviceType: "bath",
    groomerId: null,
    status: "waiting"
  });

  const [selectedClientPetName, setSelectedClientPetName] = useState<string>("");
  
  // If editing, populate form with appointment data
  useEffect(() => {
    if (appointment) {
      setFormData({
        clientId: appointment.clientId,
        petName: appointment.petName,
        date: appointment.date,
        time: appointment.time,
        serviceType: appointment.serviceType,
        groomerId: appointment.groomerId,
        status: appointment.status
      });
      
      // Set pet name from the client
      const client = getClientById(appointment.clientId);
      if (client) {
        setSelectedClientPetName(client.petName);
      }
    }
  }, [appointment, getClientById]);
  
  // Update pet name when client changes
  useEffect(() => {
    if (formData.clientId) {
      const selectedClient = clients.find(client => client.id === formData.clientId);
      if (selectedClient) {
        setSelectedClientPetName(selectedClient.petName);
        setFormData(prev => ({ ...prev, petName: selectedClient.petName }));
      }
    }
  }, [formData.clientId, clients]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = () => {
    // Validate form
    if (!formData.clientId || !formData.date || !formData.time) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const appointmentData = {
      clientId: formData.clientId,
      petName: formData.petName,
      date: formData.date,
      time: formData.time,
      serviceType: formData.serviceType,
      groomerId: formData.groomerId,
      status: formData.status
    };
    
    if (isEditing && appointment) {
      updateAppointment({
        ...appointment,
        ...appointmentData
      });
    } else {
      addAppointment(appointmentData);
    }
    
    onClose();
  };
  
  const availableGroomers = groomers.filter(groomer => groomer.status === "available");
  
  return (
    <Card className="p-4">
      <h2 className="text-xl font-bold mb-4">{isEditing ? "Editar Agendamento" : "Novo Agendamento"}</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="clientId">Cliente *</Label>
          <Select 
            value={formData.clientId} 
            onValueChange={(value) => handleSelectChange("clientId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um cliente" />
            </SelectTrigger>
            <SelectContent>
              {clients.map(client => (
                <SelectItem key={client.id} value={client.id}>
                  {client.tutorName} ({client.petName})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="petName">Nome do Pet</Label>
          <Input 
            id="petName" 
            name="petName" 
            value={formData.petName}
            disabled
            placeholder="Nome do pet" 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Data *</Label>
            <Input 
              id="date" 
              name="date" 
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              required 
            />
          </div>
          
          <div>
            <Label htmlFor="time">Hora *</Label>
            <Input 
              id="time" 
              name="time" 
              type="time"
              value={formData.time}
              onChange={handleInputChange}
              required 
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="serviceType">Tipo de Serviço *</Label>
          <Select 
            value={formData.serviceType} 
            onValueChange={(value) => handleSelectChange("serviceType", value as ServiceType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o serviço" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bath">Banho</SelectItem>
              <SelectItem value="grooming">Tosa</SelectItem>
              <SelectItem value="both">Banho e Tosa</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="groomerId">Tosador</Label>
          <Select 
            value={formData.groomerId || ""} 
            onValueChange={(value) => handleSelectChange("groomerId", value || null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um tosador" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhum</SelectItem>
              {availableGroomers.map(groomer => (
                <SelectItem key={groomer.id} value={groomer.id}>
                  {groomer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {isEditing && (
          <div>
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => handleSelectChange("status", value as AppointmentStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="waiting">Em espera</SelectItem>
                <SelectItem value="progress">Em andamento</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>{isEditing ? "Atualizar" : "Agendar"}</Button>
        </div>
      </div>
    </Card>
  );
};

export default AppointmentForm;
