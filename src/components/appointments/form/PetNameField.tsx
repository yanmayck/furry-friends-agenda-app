
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormFieldProps } from "./types";

export const PetNameField: React.FC<FormFieldProps> = ({ formData }) => {
  return (
    <div>
      <Label htmlFor="petName">Nome do Pet</Label>
      <Input 
        id="petName" 
        name="petName" 
        value={formData.petName}
        disabled
        placeholder="Nome do pet" 
      />
    </div>
  );
};
