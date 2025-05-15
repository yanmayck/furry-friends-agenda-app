
import React, { useState, useEffect } from "react";
import { Pet, useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface PetFormProps {
  pet?: Pet;
  onClose: () => void;
  clientId?: string;
}

const PetForm: React.FC<PetFormProps> = ({ pet, onClose, clientId }) => {
  const { clients, addPet, updatePet } = useStore();
  const isEditing = !!pet;
  
  const [formData, setFormData] = useState<{
    clientId: string;
    name: string;
    foodType: string;
    lastTickMedicine: {
      name: string;
      date: string;
    };
    rabiesVaccine: {
      isUpToDate: boolean;
      lastDate: string;
    };
    vaccineHistory: Array<{
      name: string;
      date: string;
    }>;
  }>({
    clientId: clientId || "",
    name: "",
    foodType: "",
    lastTickMedicine: {
      name: "",
      date: new Date().toISOString().split('T')[0]
    },
    rabiesVaccine: {
      isUpToDate: true,
      lastDate: new Date().toISOString().split('T')[0]
    },
    vaccineHistory: []
  });
  
  const [currentVaccine, setCurrentVaccine] = useState({
    name: "",
    date: new Date().toISOString().split('T')[0]
  });
  
  // If editing, populate form with pet data
  useEffect(() => {
    if (pet) {
      setFormData({
        clientId: pet.clientId,
        name: pet.name,
        foodType: pet.foodType,
        lastTickMedicine: {
          name: pet.lastTickMedicine.name,
          date: pet.lastTickMedicine.date
        },
        rabiesVaccine: {
          isUpToDate: pet.rabiesVaccine.isUpToDate,
          lastDate: pet.rabiesVaccine.lastDate
        },
        vaccineHistory: [...pet.vaccineHistory]
      });
    }
  }, [pet]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleVaccineInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentVaccine(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTickMedicineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      lastTickMedicine: {
        ...prev.lastTickMedicine,
        [name]: value
      }
    }));
  };
  
  const handleRabiesDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      rabiesVaccine: {
        ...prev.rabiesVaccine,
        lastDate: value
      }
    }));
  };
  
  const handleRabiesStatusChange = (value: boolean) => {
    setFormData(prev => ({
      ...prev,
      rabiesVaccine: {
        ...prev.rabiesVaccine,
        isUpToDate: value
      }
    }));
  };
  
  const addVaccineToHistory = () => {
    if (currentVaccine.name.trim() === "") {
      alert("Por favor, insira o nome da vacina.");
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      vaccineHistory: [...prev.vaccineHistory, { ...currentVaccine }]
    }));
    
    // Reset the current vaccine fields
    setCurrentVaccine({
      name: "",
      date: new Date().toISOString().split('T')[0]
    });
  };
  
  const removeVaccineFromHistory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      vaccineHistory: prev.vaccineHistory.filter((_, i) => i !== index)
    }));
  };
  
  const handleSubmit = () => {
    // Validate form
    if (!formData.clientId || !formData.name) {
      alert("Por favor, preencha os campos obrigatórios: Cliente e Nome do Pet");
      return;
    }
    
    if (isEditing && pet) {
      updatePet({
        ...pet,
        ...formData
      });
    } else {
      addPet(formData);
    }
    
    onClose();
  };
  
  return (
    <Card className="p-4">
      <h2 className="text-xl font-bold mb-4">{isEditing ? "Editar Pet" : "Novo Pet"}</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="clientId">Cliente *</Label>
          <Select 
            value={formData.clientId} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, clientId: value }))}
            disabled={!!clientId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um cliente" />
            </SelectTrigger>
            <SelectContent>
              {clients.map(client => (
                <SelectItem key={client.id} value={client.id}>
                  {client.tutorName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="name">Nome do Pet *</Label>
          <Input 
            id="name" 
            name="name" 
            value={formData.name}
            onChange={handleInputChange} 
            placeholder="Nome do pet" 
            required 
          />
        </div>
        
        <div>
          <Label htmlFor="foodType">Tipo de Ração</Label>
          <Input 
            id="foodType" 
            name="foodType" 
            value={formData.foodType}
            onChange={handleInputChange} 
            placeholder="Marca, tipo e frequência" 
          />
        </div>
        
        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">Medicamento Anti-carrapato</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="name">Nome do Medicamento</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.lastTickMedicine.name}
                onChange={handleTickMedicineChange} 
                placeholder="Nome do medicamento" 
              />
            </div>
            
            <div>
              <Label htmlFor="date">Data de Aplicação</Label>
              <Input 
                id="date" 
                name="date" 
                type="date"
                value={formData.lastTickMedicine.date}
                onChange={handleTickMedicineChange}
              />
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">Vacina Contra Raiva</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
            <div>
              <Label htmlFor="rabiesDate">Data da Última Dose</Label>
              <Input 
                id="rabiesDate" 
                type="date"
                value={formData.rabiesVaccine.lastDate}
                onChange={handleRabiesDateChange}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="rabiesStatus"
                checked={formData.rabiesVaccine.isUpToDate}
                onCheckedChange={handleRabiesStatusChange}
              />
              <Label htmlFor="rabiesStatus">Vacina em dia</Label>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">Histórico de Vacinas</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <Label htmlFor="vaccineName">Nome da Vacina</Label>
              <Input 
                id="vaccineName" 
                name="name" 
                value={currentVaccine.name}
                onChange={handleVaccineInputChange} 
                placeholder="Nome da vacina" 
              />
            </div>
            
            <div>
              <Label htmlFor="vaccineDate">Data de Aplicação</Label>
              <Input 
                id="vaccineDate" 
                name="date" 
                type="date"
                value={currentVaccine.date}
                onChange={handleVaccineInputChange}
              />
            </div>
          </div>
          
          <Button type="button" size="sm" onClick={addVaccineToHistory}>
            Adicionar Vacina
          </Button>
          
          {formData.vaccineHistory.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-medium mb-2">Vacinas Registradas:</h4>
              <div className="bg-gray-50 rounded border p-2">
                <ul className="divide-y">
                  {formData.vaccineHistory.map((vaccine, index) => (
                    <li key={index} className="py-2 flex justify-between items-center">
                      <div>
                        <span className="font-medium">{vaccine.name}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          {new Date(vaccine.date).toLocaleDateString()}
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => removeVaccineFromHistory(index)}
                      >
                        Remover
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>{isEditing ? "Atualizar" : "Cadastrar"}</Button>
        </div>
      </div>
    </Card>
  );
};

export default PetForm;
