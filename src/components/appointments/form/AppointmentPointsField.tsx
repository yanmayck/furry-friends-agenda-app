
import React from "react";
import { FormFieldProps } from "./types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormDescription } from "@/components/ui/form";

export const AppointmentPointsField: React.FC<FormFieldProps> = ({ 
  formData, 
  handleInputChange 
}) => {
  return (
    <div>
      <Label htmlFor="points">Pontos</Label>
      <Input
        id="points"
        name="points"
        type="number"
        min="1"
        max="3"
        value={formData.points || 1}
        onChange={handleInputChange}
        className="w-full"
      />
      <FormDescription className="text-sm text-gray-500">
        Defina a quantidade de pontos para este agendamento (1-3)
      </FormDescription>
    </div>
  );
};
