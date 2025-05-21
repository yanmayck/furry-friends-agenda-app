
import { useEffect, useState } from "react";
import { Appointment, AppointmentStatus, ServiceType, TransportType, useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { AppointmentFormData } from "./types";
import { servicePrices } from "./utils";

interface UseAppointmentFormProps {
  appointment?: Appointment;
  onClose: () => void;
}

export const useAppointmentForm = ({ appointment, onClose }: UseAppointmentFormProps) => {
  const { clients, groomers, packages, addAppointment, updateAppointment, getClientById } = useStore();
  const { isAdmin } = useAuth();
  const isEditing = !!appointment;
  
  const [formData, setFormData] = useState<AppointmentFormData>({
    clientId: "",
    petName: "",
    date: new Date().toISOString().split('T')[0],
    time: "08:00",
    serviceType: "bath",
    groomerId: null,
    status: "waiting",
    packageId: null,
    transportType: "none" as TransportType,
    price: 0,
    points: 1
  });

  const [selectedClientPetName, setSelectedClientPetName] = useState<string>("");
  const [selectedClientCpf, setSelectedClientCpf] = useState<string>("");
  const [showCpfWarning, setShowCpfWarning] = useState<boolean>(false);
  
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
        transportType: appointment.transportType || "none",
        price: appointment.price,
        points: appointment.points || 1
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
        price = formData.transportType === "none" ? selectedPackage.basePrice : selectedPackage.pickupPrice;
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
      price: formData.price,
      points: parseInt(formData.points as any) || 1
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

  const handleClientChange = (clientId: string) => {
    const selectedClient = clients.find(client => client.id === clientId);
    if (selectedClient) {
      setSelectedClientPetName(selectedClient.petName);
      setSelectedClientCpf(selectedClient.cpf);
    }
  };

  return {
    formData,
    isEditing,
    showCpfWarning,
    handleInputChange,
    handleSelectChange,
    handleSubmit,
    handleClientChange,
    isAdmin
  };
};
