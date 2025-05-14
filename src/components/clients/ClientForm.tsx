
import React, { useState, useEffect } from "react";
import { Client, useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ClientFormProps {
  client?: Client;
  onClose: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ client, onClose }) => {
  const { addClient, updateClient } = useStore();
  const isEditing = !!client;
  
  const [formData, setFormData] = useState({
    tutorName: "",
    petName: "",
    phone: "",
    email: "",
    address: "",
  });
  
  // If editing, populate form with client data
  useEffect(() => {
    if (client) {
      setFormData({
        tutorName: client.tutorName,
        petName: client.petName,
        phone: client.phone,
        email: client.email,
        address: client.address,
      });
    }
  }, [client]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = () => {
    // Validate form
    if (!formData.tutorName.trim() || !formData.petName.trim() || !formData.phone.trim()) {
      alert("Por favor, preencha os campos obrigatórios: Nome do Tutor, Nome do Pet e Telefone.");
      return;
    }
    
    if (isEditing && client) {
      updateClient({
        ...client,
        ...formData
      });
    } else {
      addClient(formData);
    }
    
    onClose();
  };
  
  return (
    <Card className="p-4">
      <h2 className="text-xl font-bold mb-4">{isEditing ? "Editar Cliente" : "Novo Cliente"}</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="tutorName">Nome do Tutor *</Label>
          <Input 
            id="tutorName" 
            name="tutorName" 
            value={formData.tutorName}
            onChange={handleChange} 
            placeholder="Nome completo do tutor" 
            required 
          />
        </div>
        
        <div>
          <Label htmlFor="petName">Nome do Pet *</Label>
          <Input 
            id="petName" 
            name="petName" 
            value={formData.petName}
            onChange={handleChange} 
            placeholder="Nome do pet" 
            required 
          />
        </div>
        
        <div>
          <Label htmlFor="phone">Telefone *</Label>
          <Input 
            id="phone" 
            name="phone" 
            value={formData.phone}
            onChange={handleChange} 
            placeholder="(00) 12345-6789"
            required 
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            name="email" 
            type="email"
            value={formData.email}
            onChange={handleChange} 
            placeholder="email@exemplo.com" 
          />
        </div>
        
        <div>
          <Label htmlFor="address">Endereço</Label>
          <Input 
            id="address" 
            name="address" 
            value={formData.address}
            onChange={handleChange} 
            placeholder="Endereço completo" 
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

export default ClientForm;
