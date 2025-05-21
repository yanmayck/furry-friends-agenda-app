
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PointsEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialPoints: number;
  onSave: (points: number) => void;
}

export const PointsEditDialog: React.FC<PointsEditDialogProps> = ({
  isOpen,
  onClose,
  initialPoints,
  onSave
}) => {
  const [points, setPoints] = useState<string>(initialPoints?.toString() || "1");
  
  const handleSave = () => {
    onSave(parseInt(points));
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar pontos do agendamento</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="mb-4 text-sm text-gray-600">
            Defina a complexidade do serviço baseado no temperamento do cachorro, 
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
          <Button type="button" onClick={handleSave}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
