export const sanitizedInputForPrice = (
  e: React.ChangeEvent<HTMLInputElement>,
) => {
  const input = e.target as HTMLInputElement;
  let value = input.value;
  value = value.replace(/[^0-9.]/g, '');
  const parts = value.split('.');
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('');
  }
  input.value = value;
  return value;
};
