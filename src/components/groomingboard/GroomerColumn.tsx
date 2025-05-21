
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { AppointmentCard } from "./AppointmentCard";
import { Groomer } from "@/context/models/types";

interface GroomerColumnProps {
  groomer: Groomer;
  appointments: any[];
}

export const GroomerColumn: React.FC<GroomerColumnProps> = ({ groomer, appointments }) => {
  return (
    <Card className="p-3 lg:p-4 h-full">
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-2 lg:mb-4">
          <h3 className="font-semibold text-sm lg:text-base">{groomer.name}</h3>
          <Badge
            variant={groomer.status === "available" ? "outline" : "secondary"}
            className={
              groomer.status === "available" 
                ? "bg-green-50 text-green-700 hover:bg-green-50 text-xs" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-100 text-xs"
            }
          >
            {groomer.status === "available" ? "Disponível" : "Ocupado"}
          </Badge>
        </div>
        
        <Droppable droppableId={groomer.id}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="min-h-[150px] max-h-[350px] overflow-y-auto bg-slate-50 p-2 rounded space-y-2"
            >
              {appointments.length === 0 ? (
                <p className="text-center text-xs text-muted-foreground py-4">
                  Nenhum agendamento atribuído
                </p>
              ) : (
                appointments.map((appointment, index) => (
                  <Draggable 
                    key={appointment.id} 
                    draggableId={appointment.id} 
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <AppointmentCard appointment={appointment} />
                      </div>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </Card>
  );
};
