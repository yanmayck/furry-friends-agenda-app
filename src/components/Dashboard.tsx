
import React from "react";
import { Card } from "@/components/ui/card";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";

const Dashboard: React.FC = () => {
  const { appointments, groomers, clients, pets, commissions } = useStore();
  const { user, isAdmin } = useAuth();
  
  // Calculate counts
  const waitingAppointments = appointments.filter(a => a.status === "waiting").length;
  const inProgressAppointments = appointments.filter(a => a.status === "progress").length;
  const completedAppointments = appointments.filter(a => a.status === "completed").length;
  
  const availableGroomers = groomers.filter(g => g.status === "available").length;
  
  // Get current month commissions for admins
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthCommissions = commissions.filter(commission => {
    const commissionDate = new Date(commission.date);
    return commissionDate.getMonth() === currentMonth && commissionDate.getFullYear() === currentYear;
  });
  
  const totalCurrentMonthCommissions = currentMonthCommissions.reduce(
    (sum, commission) => sum + commission.value, 0
  );
  
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };
  
  // Function to check for pets with expired vaccinations
  const checkForExpiredVaccines = () => {
    const currentDate = new Date();
    
    const petsWithExpiredVaccines = pets.filter(pet => {
      if (!pet.rabiesVaccine.isUpToDate) return true;
      
      const rabiesDate = new Date(pet.rabiesVaccine.lastDate);
      const diffMonths = (currentDate.getFullYear() - rabiesDate.getFullYear()) * 12 + 
                         (currentDate.getMonth() - rabiesDate.getMonth());
                         
      // Vaccine is expired if older than 12 months
      return diffMonths >= 12;
    });
    
    return petsWithExpiredVaccines.length;
  };
  
  const expiredVaccines = checkForExpiredVaccines();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Bem-vindo, {user?.username}</h1>
        <p className="text-gray-600">
          Você está conectado como {user?.role === "admin" ? "Administrador" : "Usuário Comum"}.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gray-50">
          <div className="flex flex-col">
            <span className="text-lg font-medium">Clientes</span>
            <span className="text-3xl font-bold mt-2">{clients.length}</span>
          </div>
        </Card>
        
        <Card className="p-4 bg-gray-50">
          <div className="flex flex-col">
            <span className="text-lg font-medium">Pets</span>
            <span className="text-3xl font-bold mt-2">{pets.length}</span>
            {expiredVaccines > 0 && (
              <span className="text-xs text-red-600 font-medium mt-1">
                {expiredVaccines} com vacinas vencidas
              </span>
            )}
          </div>
        </Card>
        
        <Card className="p-4 bg-gray-50">
          <div className="flex flex-col">
            <span className="text-lg font-medium">Tosadores</span>
            <span className="text-3xl font-bold mt-2">{groomers.length}</span>
            <span className="text-xs font-medium mt-1">
              {availableGroomers} disponíveis
            </span>
          </div>
        </Card>
        
        {isAdmin() && (
          <Card className="p-4 bg-gray-50">
            <div className="flex flex-col">
              <span className="text-lg font-medium">Comissões (Mês)</span>
              <span className="text-3xl font-bold mt-2">{formatCurrency(totalCurrentMonthCommissions)}</span>
            </div>
          </Card>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex flex-col">
            <span className="text-lg font-medium text-amber-800">Em espera</span>
            <span className="text-3xl font-bold mt-2 text-amber-900">{waitingAppointments}</span>
            <span className="text-sm text-amber-700 mt-1">agendamentos</span>
          </div>
        </Card>
        
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex flex-col">
            <span className="text-lg font-medium text-blue-800">Em andamento</span>
            <span className="text-3xl font-bold mt-2 text-blue-900">{inProgressAppointments}</span>
            <span className="text-sm text-blue-700 mt-1">agendamentos</span>
          </div>
        </Card>
        
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex flex-col">
            <span className="text-lg font-medium text-green-800">Concluídos</span>
            <span className="text-3xl font-bold mt-2 text-green-900">{completedAppointments}</span>
            <span className="text-sm text-green-700 mt-1">agendamentos</span>
          </div>
        </Card>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Instruções de Uso</h2>
        
        <ul className="space-y-1 text-sm text-gray-600 list-disc list-inside">
          <li>Use a navegação lateral para acessar as diferentes seções do sistema.</li>
          <li>
            Na seção de <strong>Clientes</strong>, você pode visualizar os dados de tutores e seus pets.
            {isAdmin() ? " Como administrador, você pode criar, editar e excluir clientes." : ""}
          </li>
          <li>
            Na seção de <strong>Pets</strong>, gerencie o cadastro e histórico de vacinação dos animais.
          </li>
          <li>
            <strong>Agendamentos</strong> permite criar e gerenciar os serviços de banho e tosa.
          </li>
          <li>
            Na seção de <strong>Tosadores</strong>, visualize e gerencie os profissionais disponíveis.
            {isAdmin() ? " Como administrador, você pode cadastrar novos tosadores e definir seus percentuais de comissão." : ""}
          </li>
          <li>
            <strong>Pacotes</strong> exibe os planos disponíveis para os clientes.
            {isAdmin() ? " Como administrador, você pode criar e editar esses pacotes." : ""}
          </li>
          {isAdmin() && (
            <li>
              A seção de <strong>Relatórios</strong> está disponível exclusivamente para administradores e mostra estatísticas de comissões e serviços.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
