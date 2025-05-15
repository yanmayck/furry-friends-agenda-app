
import React, { useState } from "react";
import { useStore, Package } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit, Trash2, Plus, Package as PackageIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import PackageForm from "./PackageForm";

const PackagesList: React.FC = () => {
  const { packages, deletePackage } = useStore();
  const { isAdmin } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | undefined>(undefined);
  
  const handleEditPackage = (pkg: Package) => {
    setEditingPackage(pkg);
    setShowForm(true);
  };
  
  const handleDeletePackage = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este pacote?")) {
      deletePackage(id);
    }
  };
  
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPackage(undefined);
  };

  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };
  
  return (
    <div className="space-y-4">
      {showForm ? (
        <PackageForm package={editingPackage} onClose={handleCloseForm} />
      ) : (
        <>
          <div className="flex justify-between">
            <h1 className="text-xl font-bold">Pacotes de Serviços</h1>
            {isAdmin() && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Pacote
              </Button>
            )}
          </div>
          
          {packages.length === 0 ? (
            <Card className="p-6 text-center">
              <div className="flex flex-col items-center justify-center space-y-2">
                <PackageIcon className="h-12 w-12 text-gray-400" />
                <h3 className="text-lg font-medium">Nenhum pacote encontrado</h3>
                <p className="text-sm text-gray-500">
                  {isAdmin() 
                    ? "Clique em 'Novo Pacote' para adicionar."
                    : "Nenhum pacote disponível no momento."}
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {packages.map(pkg => (
                <Card key={pkg.id} className="overflow-hidden">
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{pkg.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{pkg.description}</p>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Banhos inclusos:</span>
                        <span className="font-medium">{pkg.includesBaths}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Tosa inclusa:</span>
                        <span className="font-medium">{pkg.includesGrooming ? "Sim" : "Não"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Hidratação inclusa:</span>
                        <span className="font-medium">{pkg.includesHydration ? "Sim" : "Não"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Preço base:</span>
                        <span className="font-medium">{formatCurrency(pkg.basePrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Com serviço de busca:</span>
                        <span className="font-medium">{formatCurrency(pkg.pickupPrice)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {isAdmin() && (
                    <div className="bg-gray-50 px-4 py-2 border-t flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditPackage(pkg)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeletePackage(pkg.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PackagesList;
