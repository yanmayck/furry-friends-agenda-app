
import React, { useState } from "react";
import { Client, useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Edit, Trash2, Plus, Search, Users } from "lucide-react";
import ClientForm from "./ClientForm";
import { useAuth } from "@/context/AuthContext";
import PetForm from "../pets/PetForm";
import { toast } from "@/components/ui/use-toast";

const ClientsList: React.FC = () => {
  const { clients, deleteClient, getPetsByClientId } = useStore();
  const { isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showPetForm, setShowPetForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>(undefined);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  
  const filteredClients = clients.filter(client => 
    client.tutorName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    client.petName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleEditClient = (client: Client) => {
    if (!isAdmin()) {
      toast({
        title: "Permissão negada",
        description: "Apenas administradores podem editar clientes.",
        variant: "destructive"
      });
      return;
    }
    
    setEditingClient(client);
    setShowForm(true);
  };
  
  const handleDeleteClient = (id: string) => {
    if (!isAdmin()) {
      toast({
        title: "Permissão negada",
        description: "Apenas administradores podem excluir clientes.",
        variant: "destructive"
      });
      return;
    }
    
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      deleteClient(id);
    }
  };
  
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingClient(undefined);
  };
  
  const handleClosePetForm = () => {
    setShowPetForm(false);
    setSelectedClientId("");
  };
  
  const handleAddPet = (clientId: string) => {
    setSelectedClientId(clientId);
    setShowPetForm(true);
  };
  
  // Format CPF for display
  const formatCpf = (cpf: string): string => {
    if (!cpf) return "Não informado";
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
  
  // Mask CPF for non-admin users
  const maskCpf = (cpf: string): string => {
    if (!cpf) return "Não informado";
    return "•••.•••.•••-••";
  };
  
  return (
    <div className="space-y-4">
      {showForm ? (
        <ClientForm client={editingClient} onClose={handleCloseForm} />
      ) : showPetForm ? (
        <PetForm clientId={selectedClientId} onClose={handleClosePetForm} />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-2 justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar clientes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            {isAdmin() && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Cliente
              </Button>
            )}
          </div>
          
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tutor / Pet
                    </th>
                    {isAdmin() && (
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CPF
                      </th>
                    )}
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contato
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Endereço
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pets
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredClients.length > 0 ? (
                    filteredClients.map((client) => (
                      <tr key={client.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{client.tutorName}</div>
                          <div className="text-sm text-gray-500">{client.petName}</div>
                        </td>
                        {isAdmin() && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatCpf(client.cpf)}</div>
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{client.phone}</div>
                          <div className="text-sm text-gray-500">{client.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 line-clamp-1">{client.address}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {getPetsByClientId(client.id).length} pets
                          </div>
                          <Button 
                            size="sm" 
                            variant="link" 
                            className="text-xs p-0 h-auto" 
                            onClick={() => handleAddPet(client.id)}
                          >
                            Adicionar Pet
                          </Button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleEditClient(client)}
                              disabled={!isAdmin()}
                              title={!isAdmin() ? "Apenas administradores podem editar" : ""}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => handleDeleteClient(client.id)}
                              disabled={!isAdmin()}
                              title={!isAdmin() ? "Apenas administradores podem excluir" : ""}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={isAdmin() ? 6 : 5} className="px-6 py-4 text-center text-sm text-gray-500">
                        {searchQuery ? "Nenhum cliente encontrado com esse termo de busca." : "Nenhum cliente cadastrado."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default ClientsList;
