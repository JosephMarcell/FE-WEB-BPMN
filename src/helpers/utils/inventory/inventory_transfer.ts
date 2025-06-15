import { CustomerProperty } from '@/helpers/utils/sales/customer';

export interface TransferSaleItemsProps {
  item_code: string;
  fix_qty: number;
}

export interface NewTransferSaleProps {
  sales_id: string;
  items_opt: TransferSaleItemsProps[];
}

export interface ItemTransferState {
  item_code: string;
  quantity_transfer: number;
}

export interface FormGeneralReceiveSalesItem {
  item_id: number;
  item_code: string;
  item_name: string;
  item_unit: string;
  quantity: number;
  accepted_quantity: number;
  rejected_quantity: number;
}

export interface NewGeneralTransfer {
  activity_target: string;
  sales_invoice?: string;
  sale_at?: string;
  inventory_id?: number;
  type: string;
  status: string;
  items: ItemTransferState[];
  Customer?: CustomerProperty;
}

export interface initialNewGeneralTransfer {
  activity_target: '';
  type: '';
  status: '';
  items: ItemTransferState[];
}
