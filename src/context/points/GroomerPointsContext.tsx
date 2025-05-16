
import React, { createContext, useContext, useState, useEffect } from "react";
import { GroomerPoint, generateId } from "../models/types";
import { loadFromStorage, saveToStorage } from "../utils/storage";
import { toast } from "@/components/ui/use-toast";

interface GroomerPointsContextType {
  groomerPoints: GroomerPoint[];
  addGroomerPoints: (groomerId: string, points: number, appointmentId: string) => void;
  getGroomerMonthlyPoints: (groomerId: string, month?: number, year?: number) => number;
  getGroomerPointsByMonth: (month: number, year: number) => GroomerPoint[];
}

const GroomerPointsContext = createContext<GroomerPointsContextType | undefined>(undefined);

export const useGroomerPoints = () => {
  const context = useContext(GroomerPointsContext);
  if (!context) {
    throw new Error("useGroomerPoints must be used within a GroomerPointsProvider");
  }
  return context;
};

export const GroomerPointsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [groomerPoints, setGroomerPoints] = useState<GroomerPoint[]>([]);

  // Load groomer points from localStorage on mount
  useEffect(() => {
    const storedPoints = loadFromStorage<GroomerPoint[]>("petshop-groomer-points", []);
    setGroomerPoints(storedPoints);
  }, []);

  // Save groomer points to localStorage when they change
  useEffect(() => {
    saveToStorage("petshop-groomer-points", groomerPoints);
  }, [groomerPoints]);

  // Add points for a groomer
  const addGroomerPoints = (groomerId: string, points: number, appointmentId: string) => {
    // Check if points were already assigned to this appointment
    const existingPointRecord = groomerPoints.find(record => record.appointmentId === appointmentId);
    
    if (existingPointRecord) {
      // Update existing record
      setGroomerPoints(groomerPoints.map(record => 
        record.id === existingPointRecord.id 
          ? { ...record, points } 
          : record
      ));
      
      toast({
        title: "Pontos atualizados",
        description: `Pontos atualizados com sucesso.`
      });
      
      return;
    }
    
    // Add new points record
    const newPointRecord: GroomerPoint = {
      id: generateId(),
      groomerId,
      appointmentId,
      points,
      date: new Date().toISOString().split('T')[0]
    };
    
    setGroomerPoints([...groomerPoints, newPointRecord]);
    
    toast({
      title: "Pontos registrados",
      description: `${points} ${points === 1 ? 'ponto registrado' : 'pontos registrados'} com sucesso.`
    });
  };

  // Get monthly points for a groomer
  const getGroomerMonthlyPoints = (groomerId: string, month?: number, year?: number) => {
    const currentDate = new Date();
    const targetMonth = month !== undefined ? month : currentDate.getMonth();
    const targetYear = year !== undefined ? year : currentDate.getFullYear();
    
    return groomerPoints
      .filter(point => {
        const pointDate = new Date(point.date);
        return (
          point.groomerId === groomerId && 
          pointDate.getMonth() === targetMonth &&
          pointDate.getFullYear() === targetYear
        );
      })
      .reduce((total, point) => total + point.points, 0);
  };

  // Get all points for a specific month
  const getGroomerPointsByMonth = (month: number, year: number) => {
    return groomerPoints.filter(point => {
      const pointDate = new Date(point.date);
      return pointDate.getMonth() === month && pointDate.getFullYear() === year;
    });
  };

  return (
    <GroomerPointsContext.Provider
      value={{
        groomerPoints,
        addGroomerPoints,
        getGroomerMonthlyPoints,
        getGroomerPointsByMonth,
      }}
    >
      {children}
    </GroomerPointsContext.Provider>
  );
};
