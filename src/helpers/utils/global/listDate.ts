export const listMonths = [
  { value: 'January', label: 'January' },
  { value: 'February', label: 'February' },
  { value: 'March', label: 'March' },
  { value: 'April', label: 'April' },
  { value: 'May', label: 'May' },
  { value: 'June', label: 'June' },
  { value: 'July', label: 'July' },
  { value: 'August', label: 'August' },
  { value: 'September', label: 'September' },
  { value: 'October', label: 'October' },
  { value: 'November', label: 'November' },
  { value: 'December', label: 'December' },
];
const currentDate = new Date();
export const listYears = [
  {
    value: currentDate.getFullYear() - 1,
    label: currentDate.getFullYear() - 1,
  },
  {
    value: currentDate.getFullYear(),
    label: currentDate.getFullYear(),
  },
  {
    value: currentDate.getFullYear() + 1,
    label: currentDate.getFullYear() + 1,
  },
];
