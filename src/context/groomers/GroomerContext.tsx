
import React, { createContext, useContext, useState, useEffect } from "react";
import { Groomer } from "../models/types";
import { generateId } from "../models/types";
import { loadFromStorage, saveToStorage } from "../utils/storage";
import { toast } from "@/components/ui/use-toast";

interface GroomerContextType {
  groomers: Groomer[];
  addGroomer: (groomer: Omit<Groomer, "id">) => void;
  updateGroomer: (groomer: Groomer) => void;
  deleteGroomer: (id: string) => void;
  getGroomerById: (id: string) => Groomer | undefined;
  getGroomerWorkload: (groomerId: string, onlyCompletedAppointments?: boolean) => number;
}

const GroomerContext = createContext<GroomerContextType | undefined>(undefined);

export const useGroomers = () => {
  const context = useContext(GroomerContext);
  if (!context) {
    throw new Error("useGroomers must be used within a GroomerProvider");
  }
  return context;
};

export const GroomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [groomers, setGroomers] = useState<Groomer[]>([]);

  // Load groomers from localStorage on mount
  useEffect(() => {
    const storedGroomers = loadFromStorage<Groomer[]>("petshop-groomers", []);
    setGroomers(storedGroomers);
  }, []);

  // Save groomers to localStorage when they change
  useEffect(() => {
    saveToStorage("petshop-groomers", groomers);
  }, [groomers]);

  const getGroomerById = (id: string) => {
    return groomers.find(groomer => groomer.id === id);
  };
  
  // Modified to accept an optional parameter for filtering completed appointments
  const getGroomerWorkload = (groomerId: string, onlyCompletedAppointments?: boolean) => {
    // Since appointments are passed from a higher context, we return 0 here
    // The actual implementation is in the StoreProviderInner component
    return 0;
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
    // We don't check for appointments here to avoid circular dependency
    // This check will be handled at a higher level in StoreProviderInner
    const groomerToDelete = groomers.find(groomer => groomer.id === id);
    setGroomers(groomers.filter(groomer => groomer.id !== id));
    
    if (groomerToDelete) {
      toast({
        title: "Tosador excluído",
        description: `${groomerToDelete.name} foi removido com sucesso.`
      });
    }
  };

  return (
    <GroomerContext.Provider
      value={{
        groomers,
        addGroomer,
        updateGroomer,
        deleteGroomer,
        getGroomerById,
        getGroomerWorkload,
      }}
    >
      {children}
    </GroomerContext.Provider>
  );
};
