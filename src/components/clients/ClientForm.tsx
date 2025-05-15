
import React, { useState, useEffect } from "react";
import { Client, useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";

interface ClientFormProps {
  client?: Client;
  onClose: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ client, onClose }) => {
  const { addClient, updateClient } = useStore();
  const { isAdmin } = useAuth();
  const isEditing = !!client;
  
  const [formData, setFormData] = useState({
    tutorName: "",
    petName: "",
    cpf: "",
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
        cpf: client.cpf,
        phone: client.phone,
        email: client.email,
        address: client.address,
      });
    }
  }, [client]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "cpf") {
      // Only allow numbers and limit to 11 characters
      const numericValue = value.replace(/\D/g, '').slice(0, 11);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const formatCpf = (cpf: string): string => {
    if (!cpf) return "";
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length <= 3) {
      return cpf;
    } else if (cpf.length <= 6) {
      return `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
    } else if (cpf.length <= 9) {
      return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
    } else {
      return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
    }
  };

  const validateCpf = (cpf: string): boolean => {
    if (!cpf) return false;
    cpf = cpf.replace(/\D/g, '');
    return cpf.length === 11;
  };
  
  const handleSubmit = () => {
    // Validate form
    if (!formData.tutorName.trim() || !formData.petName.trim() || !formData.phone.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha os campos obrigatórios: Nome do Tutor, Nome do Pet e Telefone.",
        variant: "destructive"
      });
      return;
    }

    // Validate CPF
    if (!validateCpf(formData.cpf)) {
      toast({
        title: "CPF inválido",
        description: "Por favor, informe um CPF válido com 11 dígitos.",
        variant: "destructive"
      });
      return;
    }
    
    // Only allow admin to add/edit clients
    if (!isAdmin()) {
      toast({
        title: "Permissão negada",
        description: "Apenas administradores podem cadastrar ou editar clientes.",
        variant: "destructive"
      });
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
  
  if (!isAdmin()) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium">Permissão negada</h3>
          <p className="text-sm text-gray-500 mt-2">
            Apenas administradores podem cadastrar ou editar clientes.
          </p>
          <Button className="mt-4" onClick={onClose}>Voltar</Button>
        </div>
      </Card>
    );
  }
  
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
          <Label htmlFor="cpf">CPF do Tutor *</Label>
          <Input 
            id="cpf" 
            name="cpf" 
            value={formatCpf(formData.cpf)}
            onChange={handleChange} 
            placeholder="000.000.000-00"
            required 
          />
          <p className="text-xs text-gray-500 mt-1">Necessário para emissão de nota fiscal</p>
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
