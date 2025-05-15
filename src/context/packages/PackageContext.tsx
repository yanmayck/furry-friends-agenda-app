
import React, { createContext, useContext, useState, useEffect } from "react";
import { Package } from "../models/types";
import { generateId } from "../models/types";
import { loadFromStorage, saveToStorage } from "../utils/storage";
import { toast } from "@/components/ui/use-toast";

interface PackageContextType {
  packages: Package[];
  addPackage: (pkg: Omit<Package, "id">) => void;
  updatePackage: (pkg: Package) => void;
  deletePackage: (id: string) => void;
  getPackageById: (id: string) => Package | undefined;
}

const PackageContext = createContext<PackageContextType | undefined>(undefined);

export const usePackages = () => {
  const context = useContext(PackageContext);
  if (!context) {
    throw new Error("usePackages must be used within a PackageProvider");
  }
  return context;
};

export const PackageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [packages, setPackages] = useState<Package[]>([]);

  // Load packages from localStorage on mount and initialize default package if none exists
  useEffect(() => {
    const storedPackages = loadFromStorage<Package[]>("petshop-packages", []);
    
    if (storedPackages.length === 0) {
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
    } else {
      setPackages(storedPackages);
    }
  }, []);

  // Save packages to localStorage when they change
  useEffect(() => {
    saveToStorage("petshop-packages", packages);
  }, [packages]);

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
    // We'll check if there are any appointments using this package at the StoreContext level
    // to avoid circular dependencies
    const packageToDelete = packages.find(pkg => pkg.id === id);
    setPackages(packages.filter(pkg => pkg.id !== id));
    
    if (packageToDelete) {
      toast({
        title: "Pacote excluído",
        description: `${packageToDelete.name} foi removido com sucesso.`
      });
    }
  };

  return (
    <PackageContext.Provider
      value={{
        packages,
        addPackage,
        updatePackage,
        deletePackage,
        getPackageById,
      }}
    >
      {children}
    </PackageContext.Provider>
  );
};
