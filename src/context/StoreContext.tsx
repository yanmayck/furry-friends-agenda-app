
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

// Define types for our data models
export interface Client {
  id: string;
  tutorName: string;
  petName: string;
  cpf: string;
  phone: string;
  email: string;
  address: string;
}

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

export interface Groomer {
  id: string;
  name: string;
  status: "available" | "busy";
  commissionPercentage: number;
}

export interface Commission {
  id: string;
  groomerId: string;
  appointmentId: string;
  value: number;
  date: string;
}

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

export type AppointmentStatus = "waiting" | "progress" | "completed";
export type ServiceType = "bath" | "grooming" | "both" | "package";
export type TransportType = "client" | "pickup";

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

interface StoreContextType {
  clients: Client[];
  pets: Pet[];
  groomers: Groomer[];
  appointments: Appointment[];
  packages: Package[];
  commissions: Commission[];
  
  // Client methods
  addClient: (client: Omit<Client, "id">) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;
  
  // Pet methods
  addPet: (pet: Omit<Pet, "id">) => void;
  updatePet: (pet: Pet) => void;
  deletePet: (id: string) => void;
  getPetById: (id: string) => Pet | undefined;
  getPetsByClientId: (clientId: string) => Pet[];
  
  // Groomer methods
  addGroomer: (groomer: Omit<Groomer, "id">) => void;
  updateGroomer: (groomer: Groomer) => void;
  deleteGroomer: (id: string) => void;
  getGroomerById: (id: string) => Groomer | undefined;
  getGroomerWorkload: (groomerId: string) => number;
  
  // Appointment methods
  addAppointment: (appointment: Omit<Appointment, "id">) => void;
  updateAppointment: (appointment: Appointment) => void;
  deleteAppointment: (id: string) => void;
  autoAssignGroomer: (appointmentId: string) => void;
  
  // Package methods
  addPackage: (pkg: Omit<Package, "id">) => void;
  updatePackage: (pkg: Package) => void;
  deletePackage: (id: string) => void;
  getPackageById: (id: string) => Package | undefined;
  
  // Commission methods
  addCommission: (commission: Omit<Commission, "id">) => void;
  getCommissionsByGroomerId: (groomerId: string) => Commission[];
  getTotalCommissionsByGroomerId: (groomerId: string, month?: number, year?: number) => number;
  getCommissionsByMonth: (month: number, year: number) => Commission[];
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [groomers, setGroomers] = useState<Groomer[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);

  // Load data from localStorage on initial mount
  useEffect(() => {
    const storedClients = localStorage.getItem("petshop-clients");
    const storedPets = localStorage.getItem("petshop-pets");
    const storedGroomers = localStorage.getItem("petshop-groomers");
    const storedAppointments = localStorage.getItem("petshop-appointments");
    const storedPackages = localStorage.getItem("petshop-packages");
    const storedCommissions = localStorage.getItem("petshop-commissions");

    if (storedClients) setClients(JSON.parse(storedClients));
    if (storedPets) setPets(JSON.parse(storedPets));
    if (storedGroomers) setGroomers(JSON.parse(storedGroomers));
    if (storedAppointments) setAppointments(JSON.parse(storedAppointments));
    if (storedPackages) setPackages(JSON.parse(storedPackages));
    if (storedCommissions) setCommissions(JSON.parse(storedCommissions));
    
    // Initialize default package if none exists
    if (!storedPackages || JSON.parse(storedPackages).length === 0) {
      const defaultPackage: Package = {
        id: generateId(),
        name: "Pacote Semanal",
        description: "4 banhos com direito a 1 tosa higiênica ou hidratação",
        includesBaths: 4,
        includesGrooming: true,
        includesHydration: true,
        basePrice: 130.00,
        pickupPrice: 140.00
      };
      setPackages([defaultPackage]);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("petshop-clients", JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem("petshop-pets", JSON.stringify(pets));
  }, [pets]);

  useEffect(() => {
    localStorage.setItem("petshop-groomers", JSON.stringify(groomers));
  }, [groomers]);

  useEffect(() => {
    localStorage.setItem("petshop-appointments", JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem("petshop-packages", JSON.stringify(packages));
  }, [packages]);

  useEffect(() => {
    localStorage.setItem("petshop-commissions", JSON.stringify(commissions));
  }, [commissions]);

  // Helper functions
  const generateId = () => Math.random().toString(36).slice(2, 11);
  
  // Client functions
  const getClientById = (id: string) => {
    return clients.find(client => client.id === id);
  };
  
  const addClient = (client: Omit<Client, "id">) => {
    const newClient = { ...client, id: generateId() };
    setClients([...clients, newClient]);
    toast({
      title: "Cliente adicionado",
      description: `${client.tutorName} foi cadastrado com sucesso.`
    });
  };
  
  const updateClient = (updatedClient: Client) => {
    setClients(
      clients.map(client => 
        client.id === updatedClient.id ? updatedClient : client
      )
    );
    toast({
      title: "Cliente atualizado",
      description: `${updatedClient.tutorName} foi atualizado com sucesso.`
    });
  };
  
  const deleteClient = (id: string) => {
    // Check if there are any appointments or pets associated with this client
    const hasAppointments = appointments.some(appointment => appointment.clientId === id);
    const hasPets = pets.some(pet => pet.clientId === id);

    if (hasAppointments || hasPets) {
      toast({
        title: "Não é possível excluir",
        description: "Este cliente tem agendamentos ou pets associados. Por favor, remova-os primeiro.",
        variant: "destructive"
      });
      return;
    }
    
    const clientToDelete = clients.find(client => client.id === id);
    setClients(clients.filter(client => client.id !== id));
    
    if (clientToDelete) {
      toast({
        title: "Cliente excluído",
        description: `${clientToDelete.tutorName} foi removido com sucesso.`
      });
    }
  };
  
  // Pet functions
  const getPetById = (id: string) => {
    return pets.find(pet => pet.id === id);
  };
  
  const getPetsByClientId = (clientId: string) => {
    return pets.filter(pet => pet.clientId === clientId);
  };
  
  const addPet = (pet: Omit<Pet, "id">) => {
    const newPet = { ...pet, id: generateId() };
    setPets([...pets, newPet]);
    toast({
      title: "Pet adicionado",
      description: `${pet.name} foi cadastrado com sucesso.`
    });
  };
  
  const updatePet = (updatedPet: Pet) => {
    setPets(
      pets.map(pet => 
        pet.id === updatedPet.id ? updatedPet : pet
      )
    );
    toast({
      title: "Pet atualizado",
      description: `${updatedPet.name} foi atualizado com sucesso.`
    });
  };
  
  const deletePet = (id: string) => {
    // Check if there are any appointments associated with this pet
    const hasAppointments = appointments.some(appointment => {
      const pet = getPetById(id);
      return pet && appointment.petName === pet.name;
    });

    if (hasAppointments) {
      toast({
        title: "Não é possível excluir",
        description: "Este pet tem agendamentos associados. Por favor, remova-os primeiro.",
        variant: "destructive"
      });
      return;
    }
    
    const petToDelete = pets.find(pet => pet.id === id);
    setPets(pets.filter(pet => pet.id !== id));
    
    if (petToDelete) {
      toast({
        title: "Pet excluído",
        description: `${petToDelete.name} foi removido com sucesso.`
      });
    }
  };
  
  // Groomer functions
  const getGroomerById = (id: string) => {
    return groomers.find(groomer => groomer.id === id);
  };
  
  const getGroomerWorkload = (groomerId: string) => {
    return appointments.filter(
      appointment => appointment.groomerId === groomerId && appointment.status !== "completed"
    ).length;
  };
  
  const addGroomer = (groomer: Omit<Groomer, "id">) => {
    const newGroomer = { ...groomer, id: generateId() };
    setGroomers([...groomers, newGroomer]);
    toast({
      title: "Tosador adicionado",
      description: `${groomer.name} foi cadastrado com sucesso.`
    });
  };
  
  const updateGroomer = (updatedGroomer: Groomer) => {
    setGroomers(
      groomers.map(groomer => 
        groomer.id === updatedGroomer.id ? updatedGroomer : groomer
      )
    );
    toast({
      title: "Tosador atualizado",
      description: `${updatedGroomer.name} foi atualizado com sucesso.`
    });
  };
  
  const deleteGroomer = (id: string) => {
    // Check if there are any appointments assigned to this groomer
    const hasAssignedAppointments = appointments.some(appointment => appointment.groomerId === id);
    
    if (hasAssignedAppointments) {
      toast({
        title: "Não é possível excluir",
        description: "Este tosador tem agendamentos atribuídos. Por favor, reatribua esses agendamentos primeiro.",
        variant: "destructive"
      });
      return;
    }
    
    const groomerToDelete = groomers.find(groomer => groomer.id === id);
    setGroomers(groomers.filter(groomer => groomer.id !== id));
    
    if (groomerToDelete) {
      toast({
        title: "Tosador excluído",
        description: `${groomerToDelete.name} foi removido com sucesso.`
      });
    }
  };
  
  // Package functions
  const getPackageById = (id: string) => {
    return packages.find(pkg => pkg.id === id);
  };
  
  const addPackage = (pkg: Omit<Package, "id">) => {
    const newPackage = { ...pkg, id: generateId() };
    setPackages([...packages, newPackage]);
    toast({
      title: "Pacote adicionado",
      description: `${pkg.name} foi cadastrado com sucesso.`
    });
  };
  
  const updatePackage = (updatedPackage: Package) => {
    setPackages(
      packages.map(pkg => 
        pkg.id === updatedPackage.id ? updatedPackage : pkg
      )
    );
    toast({
      title: "Pacote atualizado",
      description: `${updatedPackage.name} foi atualizado com sucesso.`
    });
  };
  
  const deletePackage = (id: string) => {
    // Check if there are any appointments using this package
    const hasAppointments = appointments.some(appointment => appointment.packageId === id);
    
    if (hasAppointments) {
      toast({
        title: "Não é possível excluir",
        description: "Este pacote está sendo usado em agendamentos. Por favor, remova ou atualize esses agendamentos primeiro.",
        variant: "destructive"
      });
      return;
    }
    
    const packageToDelete = packages.find(pkg => pkg.id === id);
    setPackages(packages.filter(pkg => pkg.id !== id));
    
    if (packageToDelete) {
      toast({
        title: "Pacote excluído",
        description: `${packageToDelete.name} foi removido com sucesso.`
      });
    }
  };
  
  // Appointment functions
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
        
        const newCommission: Omit<Commission, "id"> = {
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
    
    // Also delete any commissions related to this appointment
    const relatedCommissions = commissions.filter(commission => commission.appointmentId === id);
    if (relatedCommissions.length > 0) {
      setCommissions(commissions.filter(commission => commission.appointmentId !== id));
    }
    
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
    
    // Find the groomer with the least workload
    let leastBusyGroomer = availableGroomers[0];
    let minWorkload = getGroomerWorkload(leastBusyGroomer.id);
    
    availableGroomers.forEach(groomer => {
      const workload = getGroomerWorkload(groomer.id);
      if (workload < minWorkload) {
        leastBusyGroomer = groomer;
        minWorkload = workload;
      }
    });
    
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
  
  // Commission functions
  const addCommission = (commission: Omit<Commission, "id">) => {
    const newCommission = { ...commission, id: generateId() };
    setCommissions([...commissions, newCommission]);
  };
  
  const getCommissionsByGroomerId = (groomerId: string) => {
    return commissions.filter(commission => commission.groomerId === groomerId);
  };
  
  const getCommissionsByMonth = (month: number, year: number) => {
    return commissions.filter(commission => {
      const commissionDate = new Date(commission.date);
      return commissionDate.getMonth() === month && commissionDate.getFullYear() === year;
    });
  };
  
  const getTotalCommissionsByGroomerId = (groomerId: string, month?: number, year?: number) => {
    const groomerCommissions = getCommissionsByGroomerId(groomerId);
    
    if (month !== undefined && year !== undefined) {
      const filteredCommissions = groomerCommissions.filter(commission => {
        const commissionDate = new Date(commission.date);
        return commissionDate.getMonth() === month && commissionDate.getFullYear() === year;
      });
      
      return filteredCommissions.reduce((total, commission) => total + commission.value, 0);
    }
    
    return groomerCommissions.reduce((total, commission) => total + commission.value, 0);
  };
  
  const value = {
    clients,
    pets,
    groomers,
    appointments,
    packages,
    commissions,
    addClient,
    updateClient,
    deleteClient,
    getClientById,
    addPet,
    updatePet,
    deletePet,
    getPetById,
    getPetsByClientId,
    addGroomer,
    updateGroomer,
    deleteGroomer,
    getGroomerById,
    getGroomerWorkload,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    autoAssignGroomer,
    addPackage,
    updatePackage,
    deletePackage,
    getPackageById,
    addCommission,
    getCommissionsByGroomerId,
    getTotalCommissionsByGroomerId,
    getCommissionsByMonth
  };
  
  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};
