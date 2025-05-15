
import React, { useState, useEffect } from "react";
import { Appointment, Client, Groomer, AppointmentStatus, ServiceType, TransportType, Package, useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";

interface AppointmentFormProps {
  appointment?: Appointment;
  onClose: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ appointment, onClose }) => {
  const { clients, groomers, packages, addAppointment, updateAppointment, getClientById } = useStore();
  const { isAdmin } = useAuth();
  const isEditing = !!appointment;
  
  const [formData, setFormData] = useState<{
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
  }>({
    clientId: "",
    petName: "",
    date: new Date().toISOString().split('T')[0],
    time: "08:00",
    serviceType: "bath",
    groomerId: null,
    status: "waiting",
    packageId: null,
    transportType: "client",
    price: 0
  });

  const [selectedClientPetName, setSelectedClientPetName] = useState<string>("");
  const [selectedClientCpf, setSelectedClientCpf] = useState<string>("");
  const [showCpfWarning, setShowCpfWarning] = useState<boolean>(false);
  
  // Base prices for services (these could be stored in a configuration)
  const servicePrices = {
    bath: 30,
    grooming: 40,
    both: 60
  };
  
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
        status: appointment.status,
        packageId: appointment.packageId || null,
        transportType: appointment.transportType || "client",
        price: appointment.price
      });
      
      // Set pet name from the client
      const client = getClientById(appointment.clientId);
      if (client) {
        setSelectedClientPetName(client.petName);
        setSelectedClientCpf(client.cpf);
      }
    }
  }, [appointment, getClientById]);
  
  // Update pet name and CPF when client changes
  useEffect(() => {
    if (formData.clientId) {
      const selectedClient = clients.find(client => client.id === formData.clientId);
      if (selectedClient) {
        setSelectedClientPetName(selectedClient.petName);
        setSelectedClientCpf(selectedClient.cpf);
        setFormData(prev => ({ ...prev, petName: selectedClient.petName }));
        
        // Show warning if CPF is empty
        if (isAdmin() && !selectedClient.cpf) {
          setShowCpfWarning(true);
        } else {
          setShowCpfWarning(false);
        }
      }
    }
  }, [formData.clientId, clients, isAdmin]);
  
  // Update price based on selected service and package
  useEffect(() => {
    let price = 0;
    
    if (formData.packageId) {
      const selectedPackage = packages.find(pkg => pkg.id === formData.packageId);
      if (selectedPackage) {
        price = formData.transportType === "client" ? selectedPackage.basePrice : selectedPackage.pickupPrice;
      }
    } else {
      price = servicePrices[formData.serviceType] || 0;
    }
    
    setFormData(prev => ({ ...prev, price }));
  }, [formData.serviceType, formData.packageId, formData.transportType, packages]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    if (name === "packageId") {
      const packageId = value === "none" ? null : value;
      
      // If a package is selected, service type is automatically "package"
      if (packageId) {
        setFormData(prev => ({ 
          ...prev, 
          [name]: packageId,
          serviceType: "package" 
        }));
      } else {
        setFormData(prev => ({ 
          ...prev, 
          [name]: packageId 
        }));
      }
    } else if (name === "groomerId") {
      const groomerId = value === "none" ? null : value;
      setFormData(prev => ({ ...prev, [name]: groomerId }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = () => {
    // Validate form
    if (!formData.clientId || !formData.date || !formData.time) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Check if client has CPF (for admins only)
    if (isAdmin() && !selectedClientCpf && !formData.packageId) {
      if (!confirm("O cliente não possui CPF registrado, necessário para emissão de nota. Deseja continuar mesmo assim?")) {
        return;
      }
    }
    
    // For package appointments, ensure transportType is set
    if (formData.packageId && !formData.transportType) {
      alert("Por favor, selecione o tipo de transporte para o pacote.");
      return;
    }

    const appointmentData = {
      clientId: formData.clientId,
      petName: formData.petName,
      date: formData.date,
      time: formData.time,
      serviceType: formData.serviceType,
      groomerId: formData.groomerId,
      status: formData.status,
      packageId: formData.packageId,
      transportType: formData.transportType,
      price: formData.price
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
  
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };
  
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
        
        {showCpfWarning && isAdmin() && (
          <div className="p-2 bg-amber-50 border border-amber-200 rounded text-amber-800 text-sm">
            Atenção: Este cliente não possui CPF registrado, necessário para emissão de nota fiscal.
          </div>
        )}
        
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="packageId">Pacote</Label>
            <Select 
              value={formData.packageId || "none"} 
              onValueChange={(value) => handleSelectChange("packageId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um pacote" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem pacote</SelectItem>
                {packages.map(pkg => (
                  <SelectItem key={pkg.id} value={pkg.id}>
                    {pkg.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {!formData.packageId ? (
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
          ) : (
            <div>
              <Label htmlFor="transportType">Tipo de Transporte</Label>
              <Select 
                value={formData.transportType} 
                onValueChange={(value) => handleSelectChange("transportType", value as TransportType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o transporte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Cliente traz o pet</SelectItem>
                  <SelectItem value="pickup">Serviço de busca</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        <div>
          <Label htmlFor="price">Valor</Label>
          <Input 
            id="price" 
            name="price"
            type="text"
            value={formatCurrency(formData.price)}
            disabled
          />
        </div>
        
        <div>
          <Label htmlFor="groomerId">Tosador</Label>
          <Select 
            value={formData.groomerId || "none"} 
            onValueChange={(value) => handleSelectChange("groomerId", value)}
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
