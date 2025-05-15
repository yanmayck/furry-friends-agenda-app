
import React from "react";
import { AppointmentStatus, useStore } from "@/context/StoreContext";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormFieldProps } from "./types";

export const AppointmentGroomerField: React.FC<FormFieldProps & {
  isEditing: boolean;
}> = ({ formData, handleSelectChange, isEditing }) => {
  const { groomers } = useStore();
  const availableGroomers = groomers.filter(groomer => groomer.status === "available");

  return (
    <>
      <div>
        <Label htmlFor="groomerId">Tosador</Label>
        <Select 
          value={formData.groomerId || "none"} 
          onValueChange={(value) => handleSelectChange("groomerId", value === "none" ? null : value)}
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
            value={formData.status || "waiting"} 
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
    </>
  );
};
