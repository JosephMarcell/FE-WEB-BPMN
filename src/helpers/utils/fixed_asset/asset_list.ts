export interface AssetListProperty {
  pkid: string;
  asset_code: string;
  purchase_date: string | null;
  asset_type: string | null;
  last_usage: string | null;
  condition: string | null;
  status: string | null;
  description: string | null;
  age: number | null;
  specification: string | null;
  manufacturer: string | null;
  office_pkid: number | null;
  office_name: string | null;
  is_deleted: boolean;
}

export const assetListInitialState: AssetListProperty = {
  pkid: 'auto',
  asset_code: '',
  purchase_date: new Date().toLocaleDateString('en-CA'),
  asset_type: null,
  last_usage: ' ',
  condition: null,
  status: null,
  description: null,
  age: 1,
  specification: null,
  manufacturer: null,
  office_pkid: null,
  office_name: null,
  is_deleted: false,
};
