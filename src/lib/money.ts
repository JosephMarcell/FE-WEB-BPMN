export const writeCurrency = (value: number) => {
  return `Rp${value.toLocaleString('id-ID', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
