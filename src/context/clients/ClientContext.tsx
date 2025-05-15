
import React, { createContext, useContext, useState, useEffect } from "react";
import { Client } from "../models/types";
import { generateId } from "../models/types";
import { loadFromStorage, saveToStorage } from "../utils/storage";
import { toast } from "@/components/ui/use-toast";

interface ClientContextType {
  clients: Client[];
  addClient: (client: Omit<Client, "id">) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const useClients = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error("useClients must be used within a ClientProvider");
  }
  return context;
};

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);

  // Load clients from localStorage on mount
  useEffect(() => {
    const storedClients = loadFromStorage<Client[]>("petshop-clients", []);
    setClients(storedClients);
  }, []);

  // Save clients to localStorage when they change
  useEffect(() => {
    saveToStorage("petshop-clients", clients);
  }, [clients]);

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
    const clientToDelete = clients.find(client => client.id === id);
    setClients(clients.filter(client => client.id !== id));
    
    if (clientToDelete) {
      toast({
        title: "Cliente excluído",
        description: `${clientToDelete.tutorName} foi removido com sucesso.`
      });
    }
  };

  return (
    <ClientContext.Provider
      value={{
        clients,
        addClient,
        updateClient,
        deleteClient,
        getClientById,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};
