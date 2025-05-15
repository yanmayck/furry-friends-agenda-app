
import React, { createContext, useContext, useState, useEffect } from "react";
import { Commission } from "../models/types";
import { generateId } from "../models/types";
import { loadFromStorage, saveToStorage } from "../utils/storage";

interface CommissionContextType {
  commissions: Commission[];
  addCommission: (commission: Omit<Commission, "id">) => void;
  getCommissionsByGroomerId: (groomerId: string) => Commission[];
  getTotalCommissionsByGroomerId: (groomerId: string, month?: number, year?: number) => number;
  getCommissionsByMonth: (month: number, year: number) => Commission[];
}

const CommissionContext = createContext<CommissionContextType | undefined>(undefined);

export const useCommissions = () => {
  const context = useContext(CommissionContext);
  if (!context) {
    throw new Error("useCommissions must be used within a CommissionProvider");
  }
  return context;
};

export const CommissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [commissions, setCommissions] = useState<Commission[]>([]);

  // Load commissions from localStorage on mount
  useEffect(() => {
    const storedCommissions = loadFromStorage<Commission[]>("petshop-commissions", []);
    setCommissions(storedCommissions);
  }, []);

  // Save commissions to localStorage when they change
  useEffect(() => {
    saveToStorage("petshop-commissions", commissions);
  }, [commissions]);

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

  return (
    <CommissionContext.Provider
      value={{
        commissions,
        addCommission,
        getCommissionsByGroomerId,
        getTotalCommissionsByGroomerId,
        getCommissionsByMonth,
      }}
    >
      {children}
    </CommissionContext.Provider>
  );
};
