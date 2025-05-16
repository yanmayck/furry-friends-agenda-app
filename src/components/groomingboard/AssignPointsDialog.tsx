
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";

interface AssignPointsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: any;
}

export const AssignPointsDialog: React.FC<AssignPointsDialogProps> = ({
  isOpen,
  onClose,
  appointment
}) => {
  const [points, setPoints] = useState<string>("1");
  const { addGroomerPoints, getGroomerById } = useStore();
  
  const handleAssignPoints = () => {
    if (!appointment.groomerId) {
      toast({
        title: "Erro ao atribuir pontos",
        description: "Este agendamento não está atribuído a nenhum tosador.",
        variant: "destructive"
      });
      onClose();
      return;
    }
    
    const groomer = getGroomerById(appointment.groomerId);
    if (!groomer) {
      toast({
        title: "Erro ao atribuir pontos",
        description: "Tosador não encontrado.",
        variant: "destructive"
      });
      onClose();
      return;
    }
    
    addGroomerPoints(appointment.groomerId, parseInt(points), appointment.id);
    
    toast({
      title: "Pontos atribuídos com sucesso",
      description: `${points} ${parseInt(points) === 1 ? 'ponto' : 'pontos'} atribuído(s) para ${groomer.name}.`
    });
    
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Atribuir pontos para o serviço</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="mb-4 text-sm text-gray-600">
            Avalie a complexidade do serviço de acordo com o temperamento do cachorro, 
            nível de embolo dos pelos, grau de sujeira e outros fatores.
          </p>
          
          <RadioGroup value={points} onValueChange={setPoints}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="r1" />
              <Label htmlFor="r1" className="font-normal">1 ponto - Serviço simples</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="r2" />
              <Label htmlFor="r2" className="font-normal">2 pontos - Serviço de complexidade média</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3" id="r3" />
              <Label htmlFor="r3" className="font-normal">3 pontos - Serviço complexo</Label>
            </div>
          </RadioGroup>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleAssignPoints}>
            Atribuir pontos
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
