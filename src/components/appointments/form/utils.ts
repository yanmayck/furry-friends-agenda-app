
export const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// Base prices for services
export const servicePrices = {
  bath: 30,
  grooming: 40,
  both: 60
};
