
import React from "react";
import { Card } from "@/components/ui/card";
import { useStore } from "@/context/StoreContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";

interface AppointmentCardProps {
  appointment: any;
  onAssignPoints?: () => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onAssignPoints }) => {
  const { getClientById } = useStore();
  
  const client = getClientById(appointment.clientId);
  
  // Função para traduzir o tipo de serviço
  const translateServiceType = (type: string) => {
    switch (type) {
      case "bath": return "Banho";
      case "grooming": return "Tosa";
      case "both": return "Banho e Tosa";
      case "package": return "Pacote";
      default: return type;
    }
  };
  
  // Função para determinar a cor de fundo baseada no status
  const getStatusBgColor = () => {
    switch (appointment.status) {
      case "waiting": return "bg-yellow-50 border-yellow-200";
      case "progress": return "bg-blue-50 border-blue-200";
      case "completed": return "bg-green-50 border-green-200";
      default: return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <Card className={`p-2 sm:p-3 border-l-4 ${getStatusBgColor()} hover:shadow-md transition-shadow`}>
      <div className="space-y-1">
        <div className="flex justify-between items-start">
          <div className="font-medium text-sm sm:text-base">{appointment.petName}</div>
          <Badge variant="outline" className="text-xs">
            {appointment.time}
          </Badge>
        </div>
        
        <div className="text-xs sm:text-sm text-gray-600">
          {client ? client.tutorName : "Cliente não encontrado"}
        </div>
        
        <div className="flex justify-between items-center pt-1">
          <Badge variant="secondary" className="text-xs">
            {translateServiceType(appointment.serviceType)}
          </Badge>
          {appointment.status === "waiting" ? (
            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 text-xs">
              Em espera
            </Badge>
          ) : appointment.status === "progress" ? (
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs">
              Em andamento
            </Badge>
          ) : (
            <div className="flex items-center gap-1">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
                Concluído
              </Badge>
              {onAssignPoints && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={onAssignPoints}
                  className="h-5 sm:h-6 p-0 sm:p-1"
                  title="Atribuir pontos"
                >
                  <Award size={14} />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
