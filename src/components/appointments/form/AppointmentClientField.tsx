
import React, { useEffect } from "react";
import { Client, useStore } from "@/context/StoreContext";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormFieldProps } from "./types";

export const AppointmentClientField: React.FC<FormFieldProps & {
  onClientChange: (clientId: string) => void;
  showCpfWarning: boolean;
  isAdmin: boolean;
}> = ({ formData, handleSelectChange, onClientChange, showCpfWarning, isAdmin }) => {
  const { clients } = useStore();

  useEffect(() => {
    if (formData.clientId) {
      onClientChange(formData.clientId);
    }
  }, [formData.clientId, onClientChange]);

  return (
    <>
      <div>
        <Label htmlFor="clientId">Cliente *</Label>
        <Select 
          value={formData.clientId || ""} 
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
      
      {showCpfWarning && isAdmin && (
        <div className="p-2 bg-amber-50 border border-amber-200 rounded text-amber-800 text-sm">
          Atenção: Este cliente não possui CPF registrado, necessário para emissão de nota fiscal.
        </div>
      )}
    </>
  );
};
