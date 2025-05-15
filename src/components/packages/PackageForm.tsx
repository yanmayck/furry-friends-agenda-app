
import React, { useState, useEffect } from "react";
import { Package, useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";

interface PackageFormProps {
  package?: Package;
  onClose: () => void;
}

const PackageForm: React.FC<PackageFormProps> = ({ package: pkg, onClose }) => {
  const { addPackage, updatePackage } = useStore();
  const { isAdmin } = useAuth();
  const isEditing = !!pkg;
  
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    includesBaths: number;
    includesGrooming: boolean;
    includesHydration: boolean;
    basePrice: number;
    pickupPrice: number;
  }>({
    name: "",
    description: "",
    includesBaths: 0,
    includesGrooming: false,
    includesHydration: false,
    basePrice: 0,
    pickupPrice: 0,
  });
  
  // If editing, populate form with package data
  useEffect(() => {
    if (pkg) {
      setFormData({
        name: pkg.name,
        description: pkg.description,
        includesBaths: pkg.includesBaths,
        includesGrooming: pkg.includesGrooming,
        includesHydration: pkg.includesHydration,
        basePrice: pkg.basePrice,
        pickupPrice: pkg.pickupPrice
      });
    }
  }, [pkg]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "includesBaths" || name === "basePrice" || name === "pickupPrice") {
      // Convert to number
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = () => {
    // Validate form
    if (!formData.name || !formData.description) {
      alert("Por favor, preencha os campos obrigatórios: Nome e Descrição");
      return;
    }
    
    if (formData.basePrice <= 0 || formData.pickupPrice <= 0) {
      alert("O preço deve ser maior que zero.");
      return;
    }

    // Only allow admins to add/edit packages
    if (!isAdmin()) {
      alert("Apenas administradores podem criar ou editar pacotes.");
      return;
    }
    
    if (isEditing && pkg) {
      updatePackage({
        ...pkg,
        ...formData
      });
    } else {
      addPackage(formData);
    }
    
    onClose();
  };
  
  return (
    <Card className="p-4">
      <h2 className="text-xl font-bold mb-4">{isEditing ? "Editar Pacote" : "Novo Pacote"}</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nome do Pacote *</Label>
          <Input 
            id="name" 
            name="name" 
            value={formData.name}
            onChange={handleInputChange} 
            placeholder="Nome do pacote" 
            required 
          />
        </div>
        
        <div>
          <Label htmlFor="description">Descrição *</Label>
          <Textarea 
            id="description" 
            name="description" 
            value={formData.description}
            onChange={handleInputChange} 
            placeholder="Descrição detalhada do pacote" 
            required 
            className="min-h-[100px]"
          />
        </div>
        
        <div>
          <Label htmlFor="includesBaths">Número de Banhos</Label>
          <Input 
            id="includesBaths" 
            name="includesBaths" 
            type="number"
            min="0"
            value={formData.includesBaths}
            onChange={handleInputChange} 
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="includesGrooming"
            checked={formData.includesGrooming}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, includesGrooming: checked }))}
          />
          <Label htmlFor="includesGrooming">Inclui Tosa Higiênica</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="includesHydration"
            checked={formData.includesHydration}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, includesHydration: checked }))}
          />
          <Label htmlFor="includesHydration">Inclui Hidratação</Label>
        </div>
        
        <div>
          <Label htmlFor="basePrice">Preço Base (R$) *</Label>
          <Input 
            id="basePrice" 
            name="basePrice" 
            type="number"
            min="0"
            step="0.01"
            value={formData.basePrice}
            onChange={handleInputChange} 
            placeholder="0.00"
            required 
          />
        </div>
        
        <div>
          <Label htmlFor="pickupPrice">Preço com Serviço de Busca (R$) *</Label>
          <Input 
            id="pickupPrice" 
            name="pickupPrice" 
            type="number"
            min="0"
            step="0.01"
            value={formData.pickupPrice}
            onChange={handleInputChange} 
            placeholder="0.00"
            required 
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>{isEditing ? "Atualizar" : "Cadastrar"}</Button>
        </div>
      </div>
    </Card>
  );
};

export default PackageForm;
