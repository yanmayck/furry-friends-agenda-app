
import React from "react";
import { Button } from "@/components/ui/button";

interface AppointmentFormActionsProps {
  isEditing: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export const AppointmentFormActions: React.FC<AppointmentFormActionsProps> = ({ 
  isEditing, 
  onClose, 
  onSubmit 
}) => {
  return (
    <div className="flex justify-end space-x-2 pt-2">
      <Button variant="outline" onClick={onClose}>Cancelar</Button>
      <Button onClick={onSubmit}>{isEditing ? "Atualizar" : "Agendar"}</Button>
    </div>
  );
};
