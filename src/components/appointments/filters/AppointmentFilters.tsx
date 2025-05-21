
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppointmentStatus } from "@/context/StoreContext";
import { useStore } from "@/context/StoreContext";

interface AppointmentFiltersProps {
  dateFilter: string;
  statusFilter: AppointmentStatus | "all";
  groomerFilter: string;
  setDateFilter: (date: string) => void;
  setStatusFilter: (status: AppointmentStatus | "all") => void;
  setGroomerFilter: (groomerId: string) => void;
}

export const AppointmentFilters: React.FC<AppointmentFiltersProps> = ({
  dateFilter,
  statusFilter,
  groomerFilter,
  setDateFilter,
  setStatusFilter,
  setGroomerFilter
}) => {
  const { groomers } = useStore();
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
        <Input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-full"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as AppointmentStatus | "all")}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="waiting">Em espera</SelectItem>
            <SelectItem value="progress">Em andamento</SelectItem>
            <SelectItem value="completed">Concluído</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tosador</label>
        <Select value={groomerFilter} onValueChange={setGroomerFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Tosador" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="unassigned">Não atribuído</SelectItem>
            {groomers.map((groomer) => (
              <SelectItem key={groomer.id} value={groomer.id}>{groomer.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
