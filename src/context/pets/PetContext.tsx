
import React, { createContext, useContext, useState, useEffect } from "react";
import { Pet } from "../models/types";
import { generateId } from "../models/types";
import { loadFromStorage, saveToStorage } from "../utils/storage";
import { toast } from "@/components/ui/use-toast";

interface PetContextType {
  pets: Pet[];
  addPet: (pet: Omit<Pet, "id">) => void;
  updatePet: (pet: Pet) => void;
  deletePet: (id: string) => void;
  getPetById: (id: string) => Pet | undefined;
  getPetsByClientId: (clientId: string) => Pet[];
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export const usePets = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error("usePets must be used within a PetProvider");
  }
  return context;
};

export const PetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pets, setPets] = useState<Pet[]>([]);

  // Load pets from localStorage on mount
  useEffect(() => {
    const storedPets = loadFromStorage<Pet[]>("petshop-pets", []);
    setPets(storedPets);
  }, []);

  // Save pets to localStorage when they change
  useEffect(() => {
    saveToStorage("petshop-pets", pets);
  }, [pets]);

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
    const petToDelete = pets.find(pet => pet.id === id);
    setPets(pets.filter(pet => pet.id !== id));
    
    if (petToDelete) {
      toast({
        title: "Pet excluído",
        description: `${petToDelete.name} foi removido com sucesso.`
      });
    }
  };

  return (
    <PetContext.Provider
      value={{
        pets,
        addPet,
        updatePet,
        deletePet,
        getPetById,
        getPetsByClientId,
      }}
    >
      {children}
    </PetContext.Provider>
  );
};
