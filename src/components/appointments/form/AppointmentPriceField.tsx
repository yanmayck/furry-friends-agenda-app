
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormFieldProps } from "./types";
import { formatCurrency } from "./utils";

export const AppointmentPriceField: React.FC<FormFieldProps> = ({ formData }) => {
  return (
    <div>
      <Label htmlFor="price">Valor</Label>
      <Input 
        id="price" 
        name="price"
        type="text"
        value={formatCurrency(formData.price)}
        disabled
      />
    </div>
  );
};
