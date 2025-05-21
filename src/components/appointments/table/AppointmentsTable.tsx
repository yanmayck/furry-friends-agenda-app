
import React from "react";
import { Card } from "@/components/ui/card";
import { AppointmentStatus } from "@/context/StoreContext";
import { AppointmentRow } from "./AppointmentRow";

interface AppointmentsTableProps {
  filteredAppointments: any[];
  dateFilter: string;
  statusFilter: AppointmentStatus | "all";
  groomerFilter: string;
  handleEditAppointment: (appointment: any) => void;
  handleDeleteAppointment: (id: string) => void;
  handleStatusChange: (appointmentId: string, status: AppointmentStatus) => void;
  handleAutoAssign: (appointmentId: string) => void;
  handleEditPoints: (appointmentId: string) => void;
}

export const AppointmentsTable: React.FC<AppointmentsTableProps> = ({
  filteredAppointments,
  dateFilter,
  statusFilter,
  groomerFilter,
  handleEditAppointment,
  handleDeleteAppointment,
  handleStatusChange,
  handleAutoAssign,
  handleEditPoints
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente / Pet
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data / Hora
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Serviço
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tosador
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pontos
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <AppointmentRow
                  key={appointment.id}
                  appointment={appointment}
                  handleEditAppointment={handleEditAppointment}
                  handleDeleteAppointment={handleDeleteAppointment}
                  handleStatusChange={handleStatusChange}
                  handleAutoAssign={handleAutoAssign}
                  handleEditPoints={handleEditPoints}
                />
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-center text-sm text-gray-500">
                  {dateFilter || statusFilter !== "all" || groomerFilter !== "all"
                    ? "Nenhum agendamento encontrado com os filtros selecionados."
                    : "Nenhum agendamento cadastrado. Clique em 'Novo Agendamento' para adicionar."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
