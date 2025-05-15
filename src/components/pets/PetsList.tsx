
import React, { useState } from "react";
import { useStore, Pet, Client } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2, Plus, Search, Dog, AlertCircle } from "lucide-react";
import PetForm from "./PetForm";

const PetsList: React.FC = () => {
  const { pets, deletePet, clients, getPetsByClientId } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | undefined>(undefined);
  
  // Filter pets based on search query and client filter
  let filteredPets = pets;
  
  if (clientFilter) {
    filteredPets = getPetsByClientId(clientFilter);
  }
  
  if (searchQuery) {
    filteredPets = filteredPets.filter(pet =>
      pet.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  const handleEditPet = (pet: Pet) => {
    setEditingPet(pet);
    setShowForm(true);
  };
  
  const handleDeletePet = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este pet?")) {
      deletePet(id);
    }
  };
  
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPet(undefined);
  };
  
  // Check if vaccines are up to date or about to expire
  const checkVaccinationStatus = (pet: Pet): { status: 'ok' | 'warning' | 'expired', message: string } => {
    if (!pet.rabiesVaccine.isUpToDate) {
      return {
        status: 'expired',
        message: 'Vacina contra raiva vencida'
      };
    }
    
    const rabiesDate = new Date(pet.rabiesVaccine.lastDate);
    const currentDate = new Date();
    
    // Calculate difference in months
    const diffMonths = (currentDate.getFullYear() - rabiesDate.getFullYear()) * 12 + 
                       (currentDate.getMonth() - rabiesDate.getMonth());
                       
    if (diffMonths >= 10 && diffMonths < 12) {
      // Expiring in next 2 months
      return {
        status: 'warning',
        message: 'Vacina contra raiva expira em breve'
      };
    }
    
    if (diffMonths >= 12) {
      return {
        status: 'expired',
        message: 'Vacina contra raiva vencida'
      };
    }
    
    return {
      status: 'ok',
      message: 'Vacinas em dia'
    };
  };
  
  const getClientName = (clientId: string): string => {
    const client = clients.find((c: Client) => c.id === clientId);
    return client ? client.tutorName : "Cliente desconhecido";
  };
  
  return (
    <div className="space-y-4">
      {showForm ? (
        <PetForm pet={editingPet} onClose={handleCloseForm} />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-2 justify-between">
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar pets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              
              <Select 
                value={clientFilter} 
                onValueChange={setClientFilter}
              >
                <SelectTrigger className="w-full sm:max-w-xs">
                  <SelectValue placeholder="Filtrar por tutor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os tutores</SelectItem>
                  {clients.map((client: Client) => (
                    <SelectItem key={client.id} value={client.id}>{client.tutorName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Pet
            </Button>
          </div>
          
          {filteredPets.length === 0 ? (
            <Card className="p-6 text-center">
              <div className="flex flex-col items-center justify-center space-y-2">
                <Dog className="h-12 w-12 text-gray-400" />
                <h3 className="text-lg font-medium">Nenhum pet encontrado</h3>
                <p className="text-sm text-gray-500">
                  {searchQuery || clientFilter
                    ? "Tente ajustar seus filtros de busca."
                    : "Clique em 'Novo Pet' para adicionar."}
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPets.map((pet) => {
                const vacStatus = checkVaccinationStatus(pet);
                
                return (
                  <Card key={pet.id} className="overflow-hidden">
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="font-medium text-lg">{pet.name}</h3>
                          <p className="text-sm text-gray-500">Tutor: {getClientName(pet.clientId)}</p>
                        </div>
                        {vacStatus.status !== 'ok' && (
                          <div className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center ${
                            vacStatus.status === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                          }`}>
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {vacStatus.message}
                          </div>
                        )}
                      </div>
                      <div className="mt-3 space-y-2">
                        <div>
                          <p className="text-xs font-medium text-gray-500">Ração</p>
                          <p className="text-sm">{pet.foodType || "Não informado"}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">Último Anti-carrapato</p>
                          <p className="text-sm">
                            {pet.lastTickMedicine.name
                              ? `${pet.lastTickMedicine.name} - ${new Date(pet.lastTickMedicine.date).toLocaleDateString()}`
                              : "Não informado"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">Vacina contra Raiva</p>
                          <p className={`text-sm ${!pet.rabiesVaccine.isUpToDate ? 'text-red-600' : ''}`}>
                            {pet.rabiesVaccine.lastDate
                              ? `Última dose: ${new Date(pet.rabiesVaccine.lastDate).toLocaleDateString()}`
                              : "Não vacinado"}
                            {!pet.rabiesVaccine.isUpToDate && " - VENCIDA"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-2 border-t flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditPet(pet)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeletePet(pet.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PetsList;
