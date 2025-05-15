import React, { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";

interface GroomerFormProps {
  groomer?: any;
  onClose: () => void;
  showStatusOnly?: boolean;
}

const GroomerForm: React.FC<GroomerFormProps> = ({ groomer, onClose, showStatusOnly = false }) => {
  const { addGroomer, updateGroomer } = useStore();
  const { isAdmin } = useAuth();
  const isEditing = !!groomer;
  
  const [formData, setFormData] = useState({
    name: "",
    status: "available" as "available" | "busy",
    commissionPercentage: 20
  });
  
  // If editing, populate form with groomer data
  useEffect(() => {
    if (groomer) {
      setFormData({
        name: groomer.name,
        status: groomer.status,
        commissionPercentage: groomer.commissionPercentage || 20
      });
    }
  }, [groomer]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "commissionPercentage") {
      // Ensure commission is between 0 and 100
      const commission = Math.min(Math.max(parseInt(value) || 0, 0), 100);
      setFormData(prev => ({ ...prev, [name]: commission }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = () => {
    // Validate form
    if (!formData.name.trim() && !showStatusOnly) {
      toast({
        title: "Erro",
        description: "Por favor, preencha o nome do tosador.",
        variant: "destructive"
      });
      return;
    }
    
    // If not admin and trying to do more than just update status
    if (!isAdmin() && !showStatusOnly) {
      toast({
        title: "Permissão negada",
        description: "Apenas administradores podem criar ou editar completamente os tosadores.",
        variant: "destructive"
      });
      return;
    }
    
    if (isEditing && groomer) {
      if (showStatusOnly) {
        // Only update status if in status-only mode
        updateGroomer({
          ...groomer,
          status: formData.status
        });
      } else {
        updateGroomer({
          ...groomer,
          ...formData
        });
      }
    } else if (isAdmin()) {
      // Only admin can add new groomers
      addGroomer(formData);
    }
    
    onClose();
  };
  
  return (
    <Card className="p-4">
      <h2 className="text-xl font-bold mb-4">
        {showStatusOnly 
          ? "Atualizar Status do Tosador" 
          : isEditing 
            ? "Editar Tosador" 
            : "Novo Tosador"}
      </h2>
      <div className="space-y-4">
        {!showStatusOnly && (
          <div>
            <Label htmlFor="name">Nome do Tosador *</Label>
            <Input 
              id="name" 
              name="name" 
              value={formData.name}
              onChange={handleChange} 
              placeholder="Nome completo" 
              required 
              disabled={!isAdmin()}
            />
          </div>
        )}
        
        <div>
          <Label htmlFor="status">Status</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as "available" | "busy" }))}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Disponível</SelectItem>
              <SelectItem value="busy">Ocupado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {!showStatusOnly && isAdmin() && (
          <div>
            <Label htmlFor="commissionPercentage">Percentual de Comissão (%)</Label>
            <Input 
              id="commissionPercentage" 
              name="commissionPercentage" 
              type="number"
              min="0"
              max="100"
              value={formData.commissionPercentage}
              onChange={handleChange} 
              placeholder="20" 
              disabled={!isAdmin()}
            />
            <p className="text-xs text-gray-500 mt-1">Percentual do valor do serviço (0-100%)</p>
          </div>
        )}
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>
            {showStatusOnly ? "Atualizar Status" : isEditing ? "Atualizar" : "Cadastrar"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default GroomerForm;
