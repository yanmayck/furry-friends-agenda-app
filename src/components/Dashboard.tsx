
import React from "react";
import { useStore } from "@/context/StoreContext";
import { Card } from "@/components/ui/card";

export const Dashboard: React.FC = () => {
  const { appointments, groomers } = useStore();
  
  // Calculate stats
  const waitingAppointments = appointments.filter(appointment => appointment.status === "waiting").length;
  const inProgressAppointments = appointments.filter(appointment => appointment.status === "progress").length;
  const completedAppointments = appointments.filter(appointment => appointment.status === "completed").length;
  const availableGroomers = groomers.filter(groomer => groomer.status === "available").length;
  
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4 border-l-4 border-yellow-400">
          <h3 className="text-sm font-medium text-gray-500">Em espera</h3>
          <p className="text-3xl font-bold text-gray-800 mt-1">{waitingAppointments}</p>
        </Card>
        
        <Card className="p-4 border-l-4 border-blue-400">
          <h3 className="text-sm font-medium text-gray-500">Em andamento</h3>
          <p className="text-3xl font-bold text-gray-800 mt-1">{inProgressAppointments}</p>
        </Card>
        
        <Card className="p-4 border-l-4 border-green-400">
          <h3 className="text-sm font-medium text-gray-500">Concluídos</h3>
          <p className="text-3xl font-bold text-gray-800 mt-1">{completedAppointments}</p>
        </Card>
        
        <Card className="p-4 border-l-4 border-purple-400">
          <h3 className="text-sm font-medium text-gray-500">Tosadores disponíveis</h3>
          <p className="text-3xl font-bold text-gray-800 mt-1">{availableGroomers}/{groomers.length}</p>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-3">Informações de agendamentos</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total de agendamentos</span>
              <span className="font-semibold">{appointments.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Agendamentos para hoje</span>
              <span className="font-semibold">
                {appointments.filter(appointment => 
                  appointment.date === new Date().toISOString().split('T')[0]
                ).length}
              </span>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-3">Status dos tosadores</h3>
          <div className="space-y-2">
            {groomers.length > 0 ? (
              groomers.map(groomer => (
                <div key={groomer.id} className="flex justify-between items-center">
                  <span className="truncate">{groomer.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${groomer.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {groomer.status === 'available' ? 'Disponível' : 'Ocupado'}
                  </span>
                </div>
              ))
            ) : (
              <p>Nenhum tosador cadastrado</p>
            )}
          </div>
        </Card>
      </div>
      
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-3">Próximos agendamentos</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pet</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serviço</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.filter(appointment => appointment.status !== "completed")
                .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
                .slice(0, 5)
                .map(appointment => (
                  <tr key={appointment.id}>
                    <td className="px-3 py-2 whitespace-nowrap">{appointment.petName}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {new Date(appointment.date).toLocaleDateString()} {appointment.time}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {appointment.serviceType === "bath" ? "Banho" : 
                       appointment.serviceType === "grooming" ? "Tosa" : "Banho e Tosa"}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        appointment.status === "waiting" ? "status-waiting" : 
                        appointment.status === "progress" ? "status-progress" : "status-completed"
                      }`}>
                        {appointment.status === "waiting" ? "Em espera" : 
                         appointment.status === "progress" ? "Em andamento" : "Concluído"}
                      </span>
                    </td>
                  </tr>
              ))}
              {appointments.filter(appointment => appointment.status !== "completed").length === 0 && (
                <tr>
                  <td colSpan={4} className="px-3 py-2 text-center text-sm text-gray-500">
                    Não há agendamentos pendentes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
