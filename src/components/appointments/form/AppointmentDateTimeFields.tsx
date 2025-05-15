
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormFieldProps } from "./types";

export const AppointmentDateTimeFields: React.FC<FormFieldProps> = ({ 
  formData, 
  handleInputChange 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="date">Data *</Label>
        <Input 
          id="date" 
          name="date" 
          type="date"
          value={formData.date}
          onChange={handleInputChange}
          required 
        />
      </div>
      
      <div>
        <Label htmlFor="time">Hora *</Label>
        <Input 
          id="time" 
          name="time" 
          type="time"
          value={formData.time}
          onChange={handleInputChange}
          required 
        />
      </div>
    </div>
  );
};
