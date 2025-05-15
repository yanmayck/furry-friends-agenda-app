
import React from "react";
import { ServiceType, TransportType, useStore } from "@/context/StoreContext";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormFieldProps } from "./types";

export const AppointmentServiceFields: React.FC<FormFieldProps> = ({ 
  formData, 
  handleSelectChange 
}) => {
  const { packages } = useStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="packageId">Pacote</Label>
        <Select 
          value={formData.packageId || "none"} 
          onValueChange={(value) => handleSelectChange("packageId", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um pacote" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Sem pacote</SelectItem>
            {packages.map(pkg => (
              <SelectItem key={pkg.id} value={pkg.id}>
                {pkg.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {!formData.packageId ? (
        <div>
          <Label htmlFor="serviceType">Tipo de Serviço *</Label>
          <Select 
            value={formData.serviceType} 
            onValueChange={(value) => handleSelectChange("serviceType", value as ServiceType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o serviço" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bath">Banho</SelectItem>
              <SelectItem value="grooming">Tosa</SelectItem>
              <SelectItem value="both">Banho e Tosa</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div>
          <Label htmlFor="transportType">Tipo de Transporte</Label>
          <Select 
            value={formData.transportType} 
            onValueChange={(value) => handleSelectChange("transportType", value as TransportType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o transporte" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="client">Cliente traz o pet</SelectItem>
              <SelectItem value="pickup">Serviço de busca</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};
