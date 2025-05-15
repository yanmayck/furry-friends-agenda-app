
import React from "react";
import { Appointment } from "@/context/StoreContext";
import { Card } from "@/components/ui/card";
import { AppointmentClientField } from "./form/AppointmentClientField";
import { PetNameField } from "./form/PetNameField";
import { AppointmentDateTimeFields } from "./form/AppointmentDateTimeFields";
import { AppointmentServiceFields } from "./form/AppointmentServiceFields";
import { AppointmentPriceField } from "./form/AppointmentPriceField";
import { AppointmentGroomerField } from "./form/AppointmentGroomerField";
import { AppointmentFormActions } from "./form/AppointmentFormActions";
import { useAppointmentForm } from "./form/useAppointmentForm";

interface AppointmentFormProps {
  appointment?: Appointment;
  onClose: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ appointment, onClose }) => {
  const {
    formData,
    isEditing,
    showCpfWarning,
    handleInputChange,
    handleSelectChange,
    handleSubmit,
    handleClientChange,
    isAdmin
  } = useAppointmentForm({ appointment, onClose });
  
  return (
    <Card className="p-4">
      <h2 className="text-xl font-bold mb-4">{isEditing ? "Editar Agendamento" : "Novo Agendamento"}</h2>
      <div className="space-y-4">
        <AppointmentClientField 
          formData={formData} 
          handleInputChange={handleInputChange} 
          handleSelectChange={handleSelectChange} 
          onClientChange={handleClientChange}
          showCpfWarning={showCpfWarning}
          isAdmin={isAdmin()}
        />
        
        <PetNameField 
          formData={formData} 
          handleInputChange={handleInputChange} 
          handleSelectChange={handleSelectChange} 
        />
        
        <AppointmentDateTimeFields 
          formData={formData} 
          handleInputChange={handleInputChange} 
          handleSelectChange={handleSelectChange} 
        />
        
        <AppointmentServiceFields 
          formData={formData} 
          handleInputChange={handleInputChange} 
          handleSelectChange={handleSelectChange} 
        />
        
        <AppointmentPriceField 
          formData={formData} 
          handleInputChange={handleInputChange} 
          handleSelectChange={handleSelectChange} 
        />
        
        <AppointmentGroomerField 
          formData={formData} 
          handleInputChange={handleInputChange} 
          handleSelectChange={handleSelectChange}
          isEditing={isEditing} 
        />
        
        <AppointmentFormActions 
          isEditing={isEditing} 
          onClose={onClose} 
          onSubmit={handleSubmit} 
        />
      </div>
    </Card>
  );
};

export default AppointmentForm;
