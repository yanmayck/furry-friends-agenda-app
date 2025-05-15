
// Inner provider that consumes all the individual hooks and provides the combined context
const StoreProviderInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get all the individual contexts
  const clientContext = useClients();
  const petContext = usePets();
  const groomerContext = useGroomers();
  const packageContext = usePackages();
  const appointmentContext = useAppointments();
  const commissionContext = useCommissions();

  // Add specific custom functions that combine multiple contexts
  
  // Compute groomer workload without cyclic dependencies
  const getGroomerWorkload = (groomerId: string) => {
    if (!appointmentContext.appointments) return 0;
    
    return appointmentContext.appointments.filter(
      appointment => 
        appointment.groomerId === groomerId && 
        appointment.status !== "completed"
    ).length;
  };

  // Check if a groomer has appointments before deleting
  const deleteGroomer = (id: string) => {
    if (!appointmentContext.appointments) return;
    
    const hasAssignedAppointments = appointmentContext.appointments.some(
      appointment => appointment.groomerId === id
    );
    
    if (hasAssignedAppointments) {
      toast({
        title: "Não é possível excluir",
        description: "Este tosador tem agendamentos atribuídos. Por favor, reatribua esses agendamentos primeiro.",
        variant: "destructive"
      });
      return;
    }
    
    groomerContext.deleteGroomer(id);
  };

  // Override package deletion to check for appointments using it
  const deletePackage = (id: string) => {
    // Check if there are any appointments using this package
    const hasAppointments = appointmentContext.appointments.some(appointment => appointment.packageId === id);
    
    if (hasAppointments) {
      toast({
        title: "Não é possível excluir",
        description: "Este pacote está sendo usado em agendamentos. Por favor, remova ou atualize esses agendamentos primeiro.",
        variant: "destructive"
      });
      return;
    }
    
    packageContext.deletePackage(id);
  };

  // Combine all contexts into a single value
  const value: StoreContextType = {
    ...clientContext,
    ...petContext,
    ...packageContext,
    ...commissionContext,
    ...appointmentContext,
    ...groomerContext,
    getGroomerWorkload,
    deleteGroomer,
    deletePackage, // Override the package context's deletePackage with our version that checks appointments
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};
