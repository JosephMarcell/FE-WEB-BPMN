export const businessType = [
  { value: 'MANUFACTURER', label: 'Manufacturer' },
  { value: 'DISTRIBUTOR', label: 'Distributor' },
  { value: 'WHOLESALER', label: 'Wholesaler' },
  { value: 'RETAILER', label: 'Retailer' },
  { value: 'SERVICE_PROVIDER', label: 'Service Provider' },
  { value: 'CONTRACTOR', label: 'Contractor' },
  { value: 'FARMER', label: 'Farmer' },
  { value: 'RAW_MATERIAL_SUPPLIER', label: 'Raw Material Supplier' },
  { value: 'EQUIPMENT_SUPPLIER', label: 'Equipment Supplier' },
  { value: 'CONSULTANT', label: 'Consultant' },
  { value: 'LOGISTICS_PROVIDER', label: 'Logistics Provider' },
  { value: 'MAINTENANCE_PROVIDER', label: 'Maintenance Provider' },
  { value: 'IT_SERVICES', label: 'IT Services' },
  { value: 'FINANCIAL_SERVICES', label: 'Financial Services' },
  { value: 'PACKAGING_SUPPLIER', label: 'Packaging Supplier' },
  { value: 'OTHER', label: 'Other' },
];

export const paymentTerms = [
  { value: 'NET_7', label: 'Net 7' },
  { value: 'NET_15', label: 'Net 15' },
  { value: 'NET_30', label: 'Net 30' },
  { value: 'NET_60', label: 'Net 60' },
  { value: 'NET_90', label: 'Net 90' },
  { value: 'NET_120', label: 'Net 120' },
  { value: 'COD', label: 'COD' },
  { value: 'CIA', label: 'CIA' },
  { value: 'PREPAID', label: 'Prepaid' },
  { value: 'POSTPAID', label: 'Postpaid' },
  { value: 'EOM', label: 'EOM' },
  { value: 'TWO_TEN_NET_30', label: '2/10 Net 30' },
  { value: 'ONE_TEN_NET_30', label: '1/10 Net 30' },
  { value: 'PIA', label: 'PIA' },
  { value: 'PROGRESS_PAYMENT', label: 'Progress Payment' },
  { value: 'REVOLVING_CREDIT', label: 'Revolving Credit' },
  { value: 'LETTER_OF_CREDIT', label: 'Letter of Credit (L/C)' },
  { value: 'BILL_OF_EXCHANGE', label: 'Bill of Exchange' },
  { value: 'DEFERRED_PAYMENT', label: 'Deferred Payment' },
  { value: 'MONTHLY_INSTALLMENTS', label: 'Monthly Installments' },
  { value: 'BIWEEKLY_INSTALLMENTS', label: 'Bi-weekly Installments' },
  { value: 'OTHER', label: 'Other' },
];

export interface SupplierProperty {
  pkid?: number | null;
  code: string | null;
  name: string | null;
  contact_number?: string | null;
  email?: string | null;
  address?: string | null;
  postal_code?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  npwp?: string | null;
  fax_number?: string | null;
  website?: string | null;
  contact_person?: string | null;
  payment_terms?: string | null;
  bank_account?: string | null;
  business_type?: string | null;
  status: boolean | null;
}

export const supplierInitialState: SupplierProperty = {
  pkid: null,
  code: null,
  name: null,
  contact_number: null,
  email: null,
  address: null,
  postal_code: null,
  city: null,
  state: null,
  country: null,
  npwp: null,
  fax_number: null,
  website: null,
  contact_person: null,
  payment_terms: null,
  bank_account: null,
  business_type: null,
  status: null,
};
