export const priority = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
];

export const approvalStatus = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Rejected', label: 'Rejected' },
];

export interface PurchaseRequestDetailProperty {
  item_pkid: number | null;
  quantity: number | null;
  description: string | null;
  currency_code: string | null;
}
export interface PurchaseRequestProperty {
  pkid: number | null;
  code: string | null;
  currency_code: string | null;
  requested_date: Date | null;
  approval_status: string | null;
  approval_date?: Date | null;
  required_date?: Date | null;
  total_amount: number | null;
  priority?: string | null;
  department?: string | null;
  attachment?: string | null;
  description?: string | null;
  purchaseRequestDetails: PurchaseRequestDetailProperty[];
}
export const purchaseRequestDetailInitialState: PurchaseRequestDetailProperty[] =
  [
    {
      item_pkid: null,
      quantity: null,
      description: null,
      currency_code: null,
    },
  ];
export const purchaseRequestInitialState: PurchaseRequestProperty = {
  pkid: null,
  code: null,
  currency_code: null,
  requested_date: null,
  approval_status: null,
  approval_date: null,
  required_date: null,
  total_amount: 0,
  priority: null,
  department: null,
  attachment: null,
  description: null,
  purchaseRequestDetails: purchaseRequestDetailInitialState,
};
