import {
  supplierInitialState,
  SupplierProperty,
} from '@/helpers/utils/purchasing/supplier';
import {
  customerInitialState,
  CustomerProperty,
} from '@/helpers/utils/sales/customer';

export interface NewReceiveProps {
  purchase_id: number;
}

export interface NewGeneralReceiveItem {
  item_id: number;
  quantity: number;
}

export interface NewGeneralReceive {
  date: string;
  status: string;
  type: string;
  activity_target: string;
  is_rejected: boolean;
  inventory_id: number;
  items: NewGeneralReceiveItem[];
}

export interface FormGeneralReceiveBuyItem {
  item_id: number;
  item_code: string;
  item_name: string;
  item_unit: string;
  quantity: number;
  accepted_quantity: number;
  rejected_quantity: number;
}

export interface FormGeneralReceiveBuy {
  date: string;
  status: string;
  type: string;
  activity_target: string;
  purchase_invoice: string;
  buy_at: string;
  is_rejected: boolean;
  inventory_id: number;
  items: FormGeneralReceiveBuyItem[];
  Supplier: SupplierProperty;
}

export interface FormGeneralReceiveSaleRetur {
  date: string;
  status: string;
  type: string;
  activity_target: string;
  sale_invoice: string;
  sale_at: string;
  is_rejected: boolean;
  inventory_id: number;
  items: FormGeneralReceiveBuyItem[];
  Customer: CustomerProperty;
}

export interface ItemReceiveState {
  quantity: number;
  Item: {
    name: string;
    code: string;
    Unit: {
      code: string;
    };
  };
}

export const formGeneralReceiveBuyInitialState: FormGeneralReceiveBuy = {
  date: '',
  status: '',
  type: '',
  activity_target: '',
  purchase_invoice: '',
  buy_at: '',
  is_rejected: false,
  inventory_id: 0,
  items: [],
  Supplier: supplierInitialState,
};

export const formGeneralReceiveSaleReturState: FormGeneralReceiveSaleRetur = {
  date: '',
  status: '',
  type: '',
  activity_target: '',
  sale_invoice: '',
  sale_at: '',
  is_rejected: false,
  inventory_id: 0,
  items: [],
  Customer: customerInitialState,
};
