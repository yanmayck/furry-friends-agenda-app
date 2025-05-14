
import React, { useState } from "react";
import { Groomer, useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit, Trash2, Plus } from "lucide-react";
import GroomerForm from "./GroomerForm";

const GroomersList: React.FC = () => {
  const { groomers, deleteGroomer, getGroomerWorkload } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingGroomer, setEditingGroomer] = useState<Groomer | undefined>(undefined);
  
  const handleEditGroomer = (groomer: Groomer) => {
    setEditingGroomer(groomer);
    setShowForm(true);
  };
  
  const handleDeleteGroomer = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este tosador?")) {
      deleteGroomer(id);
    }
  };
  
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingGroomer(undefined);
  };
  
  return (
    <div className="space-y-4">
      {showForm ? (
        <GroomerForm groomer={editingGroomer} onClose={handleCloseForm} />
      ) : (
        <>
          <div className="flex justify-end">
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Tosador
            </Button>
          </div>
          
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Carga de Trabalho
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {groomers.length > 0 ? (
                    groomers.map((groomer) => (
                      <tr key={groomer.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{groomer.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            groomer.status === "available" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {groomer.status === "available" ? "Disponível" : "Ocupado"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {getGroomerWorkload(groomer.id)} agendamentos
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditGroomer(groomer)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteGroomer(groomer.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                        Nenhum tosador cadastrado. Clique em 'Novo Tosador' para adicionar.
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

export default GroomersList;
