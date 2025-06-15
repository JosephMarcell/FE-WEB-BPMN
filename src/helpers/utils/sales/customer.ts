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

export const customerTypes = [
  { value: 'INDIVIDUAL', label: 'Individual' },
  { value: 'COMPANY', label: 'Company' },
  { value: 'ORGANIZATION', label: 'Organization' },
  { value: 'GOVERNMENT', label: 'Government' },
  { value: 'NON_PROFIT', label: 'Non-Profit' },
  { value: 'SME', label: 'SME' },
  { value: 'STARTUP', label: 'Startup' },
  { value: 'FREELANCER', label: 'Freelancer' },
  { value: 'MANUFACTURER', label: 'Manufacturer' },
  { value: 'DISTRIBUTOR', label: 'Distributor' },
  { value: 'WHOLESALER', label: 'Wholesaler' },
  { value: 'RETAILER', label: 'Retailer' },
  { value: 'SERVICE_PROVIDER', label: 'Service Provider' },
  { value: 'CONTRACTOR', label: 'Contractor' },
  { value: 'CONSULTANT', label: 'Consultant' },
  { value: 'LOGISTICS_PROVIDER', label: 'Logistics Provider' },
  { value: 'MAINTENANCE_PROVIDER', label: 'Maintenance Provider' },
  { value: 'IT_SERVICES', label: 'IT Services' },
  { value: 'FINANCIAL_SERVICES', label: 'Financial Services' },
  { value: 'HEALTHCARE_PROVIDER', label: 'Healthcare Provider' },
  { value: 'EDUCATION_PROVIDER', label: 'Education Provider' },
  { value: 'E_COMMERCE', label: 'E-commerce' },
  { value: 'REAL_ESTATE', label: 'Real Estate' },
  { value: 'HOSPITALITY', label: 'Hospitality' },
  { value: 'AGRICULTURE', label: 'Agriculture' },
  { value: 'AUTOMOTIVE', label: 'Automotive' },
  { value: 'ENTERTAINMENT', label: 'Entertainment' },
  { value: 'TELECOMMUNICATIONS', label: 'Telecommunications' },
  { value: 'PHARMACEUTICAL', label: 'Pharmaceutical' },
  { value: 'ENERGY', label: 'Energy' },
  { value: 'UTILITY', label: 'Utility' },
  { value: 'TRANSPORTATION', label: 'Transportation' },
  { value: 'FOOD_AND_BEVERAGE', label: 'Food and Beverage' },
  { value: 'TEXTILE', label: 'Textile' },
  { value: 'CONSTRUCTION', label: 'Construction' },
  { value: 'MINING', label: 'Mining' },
  { value: 'CHEMICAL', label: 'Chemical' },
  { value: 'AEROSPACE', label: 'Aerospace' },
  { value: 'ELECTRONICS', label: 'Electronics' },
  { value: 'FURNITURE', label: 'Furniture' },
  { value: 'MEDIA', label: 'Media' },
  { value: 'OTHER', label: 'Other' },
];
export interface CustomerProperty {
  pkid: number | null;
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
  payment_terms?: string | null;
  customer_type?: string | null;
  industry?: string | null;
  account_manager?: string | null;
  company?: string | null;
  status: boolean | null;
}

export const customerInitialState: CustomerProperty = {
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
  payment_terms: null,
  customer_type: null,
  industry: null,
  account_manager: null,
  company: null,
  status: null,
};
