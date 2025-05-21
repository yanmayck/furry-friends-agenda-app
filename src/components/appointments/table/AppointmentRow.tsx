
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Award } from "lucide-react";
import { AppointmentStatus } from "@/context/StoreContext";
import { translateServiceType, getStatusClassName } from "../utils/appointmentUtils";
import { useStore } from "@/context/StoreContext";

interface AppointmentRowProps {
  appointment: any;
  handleEditAppointment: (appointment: any) => void;
  handleDeleteAppointment: (id: string) => void;
  handleStatusChange: (appointmentId: string, status: AppointmentStatus) => void;
  handleAutoAssign: (appointmentId: string) => void;
  handleEditPoints: (appointmentId: string) => void;
}

export const AppointmentRow: React.FC<AppointmentRowProps> = ({
  appointment,
  handleEditAppointment,
  handleDeleteAppointment,
  handleStatusChange,
  handleAutoAssign,
  handleEditPoints
}) => {
  const { getClientById, getGroomerById } = useStore();
  
  const getClientName = (clientId: string) => {
    const client = getClientById(clientId);
    return client ? client.tutorName : "Cliente não encontrado";
  };
  
  const getGroomerName = (groomerId: string | null) => {
    if (!groomerId) return "Não atribuído";
    const groomer = getGroomerById(groomerId);
    return groomer ? groomer.name : "Tosador não encontrado";
  };
  
  return (
    <tr>
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{getClientName(appointment.clientId)}</div>
        <div className="text-sm text-gray-500">{appointment.petName}</div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {new Date(appointment.date).toLocaleDateString()}
        </div>
        <div className="text-sm text-gray-500">{appointment.time}</div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{translateServiceType(appointment.serviceType)}</div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        {appointment.groomerId ? (
          <div className="text-sm text-gray-900">{getGroomerName(appointment.groomerId)}</div>
        ) : (
          <Button 
            size="sm" 
            variant="outline" 
            className="text-xs" 
            onClick={() => handleAutoAssign(appointment.id)}
          >
            Atribuir auto
          </Button>
        )}
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <Select 
          value={appointment.status} 
          onValueChange={(value) => handleStatusChange(appointment.id, value as AppointmentStatus)}
        >
          <SelectTrigger className={`h-8 text-xs w-28 ${getStatusClassName(appointment.status)}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="waiting">Em espera</SelectItem>
            <SelectItem value="progress">Em andamento</SelectItem>
            <SelectItem value="completed">Concluído</SelectItem>
          </SelectContent>
        </Select>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <span className="text-sm text-gray-900 mr-2">
            {appointment.points || 1}
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEditPoints(appointment.id)}
            className="p-1 h-8"
          >
            <Award className="h-4 w-4" />
          </Button>
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-right">
        <div className="flex justify-end space-x-2">
          <Button size="sm" variant="outline" onClick={() => handleEditAppointment(appointment)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="destructive" onClick={() => handleDeleteAppointment(appointment.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};
