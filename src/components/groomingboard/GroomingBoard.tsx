
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
import { Award, ChevronLeft, ChevronRight } from "lucide-react";
import { AssignPointsDialog } from "./AssignPointsDialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const GroomingBoard: React.FC = () => {
  const { appointments, updateAppointment, groomers, autoAssignGroomer } = useStore();
  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  const [isPointsDialogOpen, setIsPointsDialogOpen] = useState(false);
  const [activeGroomerIndex, setActiveGroomerIndex] = useState(0);
  
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
  
  // Navegação de groomers em dispositivos móveis
  const nextGroomer = () => {
    if (activeGroomerIndex < groomers.length - 1) {
      setActiveGroomerIndex(activeGroomerIndex + 1);
    }
  };
  
  const prevGroomer = () => {
    if (activeGroomerIndex > 0) {
      setActiveGroomerIndex(activeGroomerIndex - 1);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div className="text-base sm:text-lg font-semibold">
            Agendamentos para hoje: {format(new Date(), 'dd/MM/yyyy', { locale: ptBR })}
          </div>
          <Button 
            onClick={handleAutoAssignAll}
            variant="secondary"
            className="flex items-center gap-1 text-xs sm:text-sm sm:gap-2 py-1 h-8 sm:h-10"
            size="sm"
          >
            <Award size={16} />
            <span className="whitespace-nowrap">Atribuir Automaticamente</span>
          </Button>
        </div>
        
        {/* Layout para desktop */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-4">
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
        
        {/* Layout para mobile */}
        <div className="lg:hidden flex flex-col gap-4">
          {/* Unassigned appointments column */}
          <Card className="p-3">
            <h3 className="font-semibold mb-3 text-center bg-slate-100 py-2 rounded text-sm">
              Não atribuídos
            </h3>
            <Droppable droppableId="unassigned">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="min-h-[150px] max-h-[250px] overflow-y-auto bg-slate-50 p-2 rounded space-y-2"
                >
                  {unassignedAppointments.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-4">
                      Nenhum agendamento não atribuído
                    </p>
                  ) : (
                    unassignedAppointments.map((appointment, index) => (
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
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Card>
          
          {/* Groomer navigation */}
          {groomers.length > 0 && (
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="px-2 h-8" 
                  onClick={prevGroomer}
                  disabled={activeGroomerIndex === 0}
                >
                  <ChevronLeft size={18} />
                </Button>
                <p className="text-sm font-medium">
                  {groomers[activeGroomerIndex]?.name || ""}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="px-2 h-8" 
                  onClick={nextGroomer}
                  disabled={activeGroomerIndex === groomers.length - 1}
                >
                  <ChevronRight size={18} />
                </Button>
              </div>
              
              {/* Groomer column */}
              {groomers[activeGroomerIndex] && (
                <GroomerColumn 
                  groomer={groomers[activeGroomerIndex]} 
                  appointments={getAppointmentsByGroomer(groomers[activeGroomerIndex].id)} 
                />
              )}
            </div>
          )}
          
          {/* Horizontal scroll for all groomers on small tablets */}
          <div className="hidden sm:block md:hidden mt-2">
            <h3 className="font-semibold mb-2 text-sm">Todos os Tosadores</h3>
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex space-x-4 pb-2">
                {groomers.map(groomer => (
                  <div key={groomer.id} className="w-[280px] shrink-0">
                    <GroomerColumn 
                      groomer={groomer} 
                      appointments={getAppointmentsByGroomer(groomer.id)} 
                    />
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
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
