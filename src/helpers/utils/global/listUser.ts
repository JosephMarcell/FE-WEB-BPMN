// type SelectOption = { value: string | number; label: string };

export const WorkflowStatus = [
  { value: 'not_active', label: 'Not Active', color: 'danger' },
  { value: 'inactive', label: 'Inactive', color: 'danger' },
  { value: 'rejected', label: 'Inactive', color: 'danger' },
  { value: 'cancel', label: 'Waiting', color: 'warning' },
  { value: 'un_approved', label: 'Need Approval', color: 'warning' },
  { value: 'need_approve', label: 'Need Approval', color: 'warning' },
  { value: 'on_going', label: 'Need Approval', color: 'warning' },
  { value: 'waiting', label: 'Waiting', color: 'warning' },
  { value: 'on_progress', label: 'On Progress', color: 'warning' },
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'ready', label: 'Ready', color: 'primary' },
  { value: 'done', label: 'Done', color: 'success' },
  { value: 'approved', label: 'Approved', color: 'success' },
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'success', label: 'Active', color: 'success' },
];

export const UserRole = [
  { value: 'SUPERADMIN', label: 'Superadmin', color: 'black' },
  { value: 'ADMIN', label: 'Admin', color: 'primary' },
  { value: 'SUPERVISOR', label: 'Supervisor', color: 'warning' },
  { value: 'USER', label: 'User', color: 'info' },
];

export const UserGender = [
  { value: 'Male', label: 'Male', color: 'secondary' },
  { value: 'Female', label: 'Female', color: 'secondary' },
];

export const UserStatus = [
  { value: true, label: 'Verified', color: 'success' },
  { value: false, label: 'Unverified', color: 'danger' },
];

export const UserOffice = [
  { value: 'Office', label: 'Office', color: 'primary' },
];

// // Contoh penggunaan
// export const roleType: SelectOption[] = [
//   // { value: 1, label: 'Low' },
//   { value: 2, label: 'Supervisor' },
//   { value: 3, label: 'Office Admin' },
// ];

// export function getFilteredAssetStatus(
//   assetCondition: string,
// ): OptionsOrGroups<SelectOption, GroupBase<SelectOption>> {
//   if (assetCondition === 'rusak') {
//     return AssetStatus.filter(status => status.value === 'tidak_aktif');
//   }
//   if (assetCondition === 'baik') {
//     return AssetStatus.filter(status => status.value !== 'dalam_perbaikan');
//   }
//   if (assetCondition === 'butuh_perbaikan') {
//     return AssetStatus.filter(status => status.value !== 'aktif');
//   }
//   return AssetStatus;
// }

// export function getFilteredConditionStatus(
//   assetStatus: string,
// ): OptionsOrGroups<SelectOption, GroupBase<SelectOption>> {
//   if (assetStatus === 'dalam_perbaikan') {
//     return AssetCondition.filter(status => status.value !== 'baik');
//   }
//   if (assetStatus === 'aktif') {
//     return AssetCondition.filter(status => status.value !== 'rusak');
//   }
//   return AssetCondition;
// }
