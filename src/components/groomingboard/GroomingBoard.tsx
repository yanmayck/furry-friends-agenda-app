
import React, { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppointmentCard } from "./AppointmentCard";
import { GroomerColumn } from "./GroomerColumn";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "@/components/ui/use-toast";
import { Award } from "lucide-react";
import { AssignPointsDialog } from "./AssignPointsDialog";

export const GroomingBoard: React.FC = () => {
  const { appointments, updateAppointment, groomers, autoAssignGroomer } = useStore();
  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  const [isPointsDialogOpen, setIsPointsDialogOpen] = useState(false);
  
  const today = format(new Date(), 'yyyy-MM-dd');
  
  // Filter appointments for today
  useEffect(() => {
    const filteredAppointments = appointments.filter(
      appointment => appointment.date === today && appointment.status !== "completed"
    );
    setTodayAppointments(filteredAppointments);
  }, [appointments, today]);

  // Handle auto assign all unassigned appointments
  const handleAutoAssignAll = () => {
    const unassignedAppointments = todayAppointments.filter(app => app.groomerId === null);
    
    if (unassignedAppointments.length === 0) {
      toast({
        title: "Nenhum agendamento para atribuir",
        description: "Não há agendamentos não atribuídos.",
      });
      return;
    }
    
    unassignedAppointments.forEach(app => {
      autoAssignGroomer(app.id);
    });
    
    toast({
      title: "Atribuição automática concluída",
      description: `${unassignedAppointments.length} agendamentos foram atribuídos automaticamente.`
    });
  };

  // Handle drag end event
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Return if dropped outside a droppable area
    if (!destination) return;

    // Return if dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    // Find the appointment that was dragged
    const appointment = appointments.find(app => app.id === draggableId);
    if (!appointment) return;

    // Handle logic when dropping in a groomer column
    if (destination.droppableId !== 'unassigned') {
      // Update appointment with new groomer
      updateAppointment({
        ...appointment,
        groomerId: destination.droppableId,
        status: appointment.status === "waiting" ? "progress" : appointment.status
      });
      
      // If appointment is completed, ask for point assignment
      if (appointment.status === "completed") {
        setSelectedAppointment(appointment);
        setIsPointsDialogOpen(true);
      }
    } else if (source.droppableId !== 'unassigned') {
      // If moving from a groomer column to the unassigned column
      updateAppointment({
        ...appointment,
        groomerId: null,
        status: "waiting"
      });
    }
  };

  // Group appointments by groomer
  const getAppointmentsByGroomer = (groomerId: string | null) => {
    return todayAppointments.filter(app => app.groomerId === groomerId);
  };

  // Get unassigned appointments (not assigned to any groomer)
  const unassignedAppointments = getAppointmentsByGroomer(null);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold">
            Agendamentos para hoje: {format(new Date(), 'dd/MM/yyyy', { locale: ptBR })}
          </div>
          <Button 
            onClick={handleAutoAssignAll}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Award size={18} />
            Atribuir Automaticamente
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Unassigned appointments column */}
          <div className="col-span-1">
            <Card className="p-4 h-full">
              <h3 className="font-semibold mb-4 text-center bg-slate-100 py-2 rounded">
                Banho e Tosa (Não atribuídos)
              </h3>
              <Droppable droppableId="unassigned">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="min-h-[300px] bg-slate-50 p-2 rounded space-y-2"
                  >
                    {unassignedAppointments.map((appointment, index) => (
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
                            <AppointmentCard 
                              appointment={appointment} 
                              onAssignPoints={() => {
                                setSelectedAppointment(appointment);
                                setIsPointsDialogOpen(true);
                              }}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Card>
          </div>
          
          {/* Groomer columns */}
          <div className="col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groomers.map(groomer => (
              <GroomerColumn 
                key={groomer.id} 
                groomer={groomer} 
                appointments={getAppointmentsByGroomer(groomer.id)} 
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Points assignment dialog */}
      {selectedAppointment && (
        <AssignPointsDialog 
          isOpen={isPointsDialogOpen} 
          onClose={() => setIsPointsDialogOpen(false)}
          appointment={selectedAppointment}
        />
      )}
    </DragDropContext>
  );
};
