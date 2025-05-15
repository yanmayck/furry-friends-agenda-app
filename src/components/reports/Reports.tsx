
import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const Reports: React.FC = () => {
  const { groomers, appointments, commissions, getCommissionsByGroomerId } = useStore();
  
  // Get current month and year
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  
  // Generate an array of past 5 years for the select options
  const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - i);
  
  // Filter appointments and commissions by selected month and year
  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    return appointmentDate.getMonth() === selectedMonth && appointmentDate.getFullYear() === selectedYear;
  });
  
  const filteredCommissions = commissions.filter(commission => {
    const commissionDate = new Date(commission.date);
    return commissionDate.getMonth() === selectedMonth && commissionDate.getFullYear() === selectedYear;
  });
  
  // Calculate statistics
  const groomerStats = groomers.map(groomer => {
    // All commissions for this groomer
    const groomerCommissions = getCommissionsByGroomerId(groomer.id);
    
    // Commissions for this groomer in selected month/year
    const monthlyCommissions = groomerCommissions.filter(commission => {
      const commissionDate = new Date(commission.date);
      return commissionDate.getMonth() === selectedMonth && commissionDate.getFullYear() === selectedYear;
    });
    
    // Completed appointments by this groomer
    const completedAppointments = appointments.filter(appointment => 
      appointment.groomerId === groomer.id && appointment.status === "completed"
    );
    
    // Completed appointments by this groomer in selected month/year
    const monthlyCompletedAppointments = completedAppointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate.getMonth() === selectedMonth && appointmentDate.getFullYear() === selectedYear;
    });
    
    // Count unique pets serviced by this groomer
    const uniquePets = new Set();
    completedAppointments.forEach(appointment => uniquePets.add(appointment.petName));
    
    // Count unique pets serviced by this groomer in selected month/year
    const monthlyUniquePets = new Set();
    monthlyCompletedAppointments.forEach(appointment => monthlyUniquePets.add(appointment.petName));
    
    return {
      id: groomer.id,
      name: groomer.name,
      totalCommissions: groomerCommissions.reduce((sum, commission) => sum + commission.value, 0),
      monthlyCommissions: monthlyCommissions.reduce((sum, commission) => sum + commission.value, 0),
      totalAppointments: completedAppointments.length,
      monthlyAppointments: monthlyCompletedAppointments.length,
      totalPets: uniquePets.size,
      monthlyPets: monthlyUniquePets.size
    };
  });
  
  // Count service types
  const serviceTypeCounts = filteredAppointments.reduce(
    (acc, appointment) => {
      acc[appointment.serviceType] = (acc[appointment.serviceType] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  
  // Format data for charts
  const commissionChartData = groomerStats.map(groomer => ({
    name: groomer.name,
    value: groomer.monthlyCommissions,
    total: groomer.totalCommissions
  }));
  
  const appointmentChartData = groomerStats.map(groomer => ({
    name: groomer.name,
    value: groomer.monthlyAppointments,
    total: groomer.totalAppointments
  }));
  
  const serviceChartData = [
    { name: "Banho", value: serviceTypeCounts["bath"] || 0 },
    { name: "Tosa", value: serviceTypeCounts["grooming"] || 0 },
    { name: "Banho e Tosa", value: serviceTypeCounts["both"] || 0 },
    { name: "Pacote", value: serviceTypeCounts["package"] || 0 }
  ];
  
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end gap-4">
        <div>
          <Label htmlFor="month">Mês</Label>
          <Select 
            value={selectedMonth.toString()} 
            onValueChange={(value) => setSelectedMonth(parseInt(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue id="month" placeholder="Selecione o mês" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="year">Ano</Label>
          <Select 
            value={selectedYear.toString()} 
            onValueChange={(value) => setSelectedYear(parseInt(value))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue id="year" placeholder="Selecione o ano" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card className="p-4">
        <h2 className="text-xl font-bold mb-4">Comissões por Tosador</h2>
        
        <div className="mb-6 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={commissionChartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar name={`Comissões (${months[selectedMonth]} ${selectedYear})`} dataKey="value" fill="#9b87f5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tosador</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comissões (Mês)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comissões (Total)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agendamentos (Mês)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agendamentos (Total)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pets Atendidos (Mês)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pets Atendidos (Total)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {groomerStats.length > 0 ? (
                groomerStats.map((groomer) => (
                  <tr key={groomer.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{groomer.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(groomer.monthlyCommissions)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(groomer.totalCommissions)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{groomer.monthlyAppointments}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{groomer.totalAppointments}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{groomer.monthlyPets}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{groomer.totalPets}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    Nenhum dado disponível para este período.
                  </td>
                </tr>
              )}
              {groomerStats.length > 0 && (
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(groomerStats.reduce((sum, groomer) => sum + groomer.monthlyCommissions, 0))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(groomerStats.reduce((sum, groomer) => sum + groomer.totalCommissions, 0))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {groomerStats.reduce((sum, groomer) => sum + groomer.monthlyAppointments, 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {groomerStats.reduce((sum, groomer) => sum + groomer.totalAppointments, 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <h2 className="text-xl font-bold mb-4">Agendamentos por Tosador</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={appointmentChartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar name={`Agendamentos (${months[selectedMonth]} ${selectedYear})`} dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card className="p-4">
          <h2 className="text-xl font-bold mb-4">Tipos de Serviço</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={serviceChartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar name={`Serviços (${months[selectedMonth]} ${selectedYear})`} dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
