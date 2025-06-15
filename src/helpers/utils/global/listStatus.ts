import { GroupBase, OptionsOrGroups } from 'react-select';

import { getTranslation } from '@/lib/lang/i18n';

const { t } = getTranslation();

type SelectOption = { value: string; label: string };

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

export const AssetCondition = [
  { value: 'baik', label: t('good'), color: 'success' },
  { value: 'butuh_perbaikan', label: t('needs_repair'), color: 'warning' },
  { value: 'rusak', label: t('damaged'), color: 'danger' },
];

export const AssetStatus = [
  { value: 'aktif', label: t('active'), color: 'success' },
  { value: 'tidak_layak', label: t('unfit_for_use'), color: 'danger' },
  {
    value: 'menunggu_perbaikan',
    label: t('awaiting_repair'),
    color: 'warning',
  },
  { value: 'dalam_perbaikan', label: t('under_repair'), color: 'black' },
  { value: 'Dalam Progress', label: t('in_progress'), color: 'warning' },
  { value: 'Belum Mulai', label: t('not_started'), color: 'danger' },
  { value: 'Selesai', label: t('completed'), color: 'success' },
  { value: 'UNDER_REVIEW', label: 'Under Review', color: 'warning' },
  { value: 'REPORTED', label: 'Reported', color: 'success' },
];

export const AssetMaintenanceLogOptions = [
  { value: 'Dalam Progress', label: t('in_progress'), color: 'warning' },
  { value: 'Belum Mulai', label: t('not_started'), color: 'danger' },
  { value: 'Selesai', label: t('completed'), color: 'success' },
];

export const assetTypeOptions = [
  { value: 'DRONE', label: 'DRONE' },
  { value: 'IOT', label: 'IOT' },
  { value: 'VEHICLE', label: 'VEHICLE' },
  { value: 'SENSOR', label: 'SENSOR' },
  { value: 'OTHER', label: 'OTHER' },
];

export const severityType = [
  { value: 'LOW', label: 'LOW', color: 'success' },
  { value: 'MEDIUM', label: 'MEDIUM', color: 'warning' },
  { value: 'HIGH', label: 'HIGH', color: 'danger' },
];

export const violationType = [
  { value: 'ILLEGAL_FISHING', label: t('illegal_fishing') },
  { value: 'POLLUTION', label: t('pollution') },
  {
    value: 'HABITAT_DESTRUCTION',
    label: t('habitat_destruction'),
  },
  { value: 'ASSET_MISSING', label: t('asset_missing') },
  { value: 'OTHER', label: t('other') },
];

export function getFilteredConditionStatus(
  assetStatus: string,
): OptionsOrGroups<SelectOption, GroupBase<SelectOption>> {
  if (assetStatus === 'aktif') {
    return AssetCondition.filter(status => status.value !== 'rusak');
  }
  if (assetStatus === 'menunggu_perbaikan') {
    return AssetCondition.filter(status => status.value === 'butuh_perbaikan');
  }
  if (assetStatus === 'dalam_perbaikan') {
    return AssetCondition.filter(status => status.value === 'butuh_perbaikan');
  }
  if (assetStatus === 'tidak_layak') {
    return AssetCondition.filter(status => status.value === 'rusak');
  }
  return AssetCondition;
}
