
import React, { useState, useEffect } from "react";
import { Groomer, useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GroomerFormProps {
  groomer?: Groomer;
  onClose: () => void;
}

const GroomerForm: React.FC<GroomerFormProps> = ({ groomer, onClose }) => {
  const { addGroomer, updateGroomer } = useStore();
  const isEditing = !!groomer;
  
  const [formData, setFormData] = useState({
    name: "",
    status: "available" as "available" | "busy",
  });
  
  // If editing, populate form with groomer data
  useEffect(() => {
    if (groomer) {
      setFormData({
        name: groomer.name,
        status: groomer.status
      });
    }
  }, [groomer]);
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, name: e.target.value }));
  };
  
  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      status: value as "available" | "busy" 
    }));
  };
  
  const handleSubmit = () => {
    // Validate form
    if (!formData.name.trim()) {
      alert("Por favor, informe o nome do tosador.");
      return;
    }
    
    if (isEditing && groomer) {
      updateGroomer({
        ...groomer,
        ...formData
      });
    } else {
      addGroomer(formData);
    }
    
    onClose();
  };
  
  return (
    <Card className="p-4">
      <h2 className="text-xl font-bold mb-4">{isEditing ? "Editar Tosador" : "Novo Tosador"}</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nome *</Label>
          <Input 
            id="name" 
            name="name" 
            value={formData.name}
            onChange={handleNameChange}
            placeholder="Nome do tosador" 
            required 
          />
        </div>
        
        <div>
          <Label htmlFor="status">Status</Label>
          <Select 
            value={formData.status} 
            onValueChange={handleStatusChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Disponível</SelectItem>
              <SelectItem value="busy">Ocupado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>{isEditing ? "Atualizar" : "Cadastrar"}</Button>
        </div>
      </div>
    </Card>
  );
};

export default GroomerForm;
