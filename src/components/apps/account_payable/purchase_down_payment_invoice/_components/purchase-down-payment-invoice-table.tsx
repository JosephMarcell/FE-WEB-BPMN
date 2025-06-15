import React from 'react';

import RenderDataTable from '@/components/commons/data-tables';

import { useGeneratePDFPurchaseDownPaymentInvoice } from '@/app/api/hooks/account_payable/purchase_down_payment_invoice/useGeneratePDFPurchaseDownPaymentInvoice';
import { useHardDeletePurchaseDownPaymentInvoice } from '@/app/api/hooks/account_payable/purchase_down_payment_invoice/useHardDeletePurchaseDownPaymentInvoice';

interface MyData {
  [key: string]: unknown;
}

interface IProps<T extends object> {
  data?: T[];
  isLoading?: boolean;
  refetch?: () => void;
  exportCSV?: () => void;
}

const PurchaseDownPaymentInvoiceTable = <T extends object>({
  data,
  isLoading,
  refetch = () => undefined,
}: // exportCSV,
IProps<T>) => {
  const { generatePDF } = useGeneratePDFPurchaseDownPaymentInvoice();
  const { mutateAsync: deletePurchaseDownPaymentInvoice } =
    useHardDeletePurchaseDownPaymentInvoice();

  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'code', title: 'Invoice Code' },
    { accessor: 'purchase_order_code', title: 'Purchase Order Code' },
    { accessor: 'currency_code', title: 'Currency' },
    { accessor: 'invoice_number', title: 'Invoice Number' },
    { accessor: 'invoice_date', title: 'Invoice Date' },
    { accessor: 'due_date', title: 'Due Date' },
    { accessor: 'received_date', title: 'Received Date' },
    { accessor: 'sub_total', title: 'Sub Total' },
    { accessor: 'total', title: 'Total' },
    { accessor: 'taxes_included', title: 'Taxes Included' },
    { accessor: 'taxes', title: 'Taxes' },
    { accessor: 'total_price_item_with_taxes', title: 'Total with Taxes' },
    { accessor: 'discount_included', title: 'Discount Included' },
    { accessor: 'discounts', title: 'Discounts' },
    { accessor: 'discount_amount', title: 'Discount Amount' },
    {
      accessor: 'total_price_item_with_discount',
      title: 'Total with Discount',
    },
    { accessor: 'delivery_cost_included', title: 'Delivery Cost Included' },
    { accessor: 'delivery_cost', title: 'Delivery Cost' },
    {
      accessor: 'total_price_item_with_delivery_cost',
      title: 'Total with Delivery Cost',
    },
    { accessor: 'dp_percent', title: 'Down Payment Percent' },
    { accessor: 'dp_paid_amount', title: 'Down Payment Paid Amount' },
    { accessor: 'dp_method', title: 'Down Payment Method' },
    { accessor: 'dp_stage', title: 'Down Payment Stage' },
    { accessor: 'remaining_payments', title: 'Remaining Payments' },
    { accessor: 'paid', title: 'Paid' },
    { accessor: 'description', title: 'Description' },
    { accessor: 'payment_status', title: 'Payment Status' },
    { accessor: 'action', title: 'Action' },
  ];

  const handleDownloadRow = (id: number) => {
    generatePDF(id);
  };

  const handleDeleteRow = async (id: number) => {
    await deletePurchaseDownPaymentInvoice(id);
    refetch();
  };

  return (
    <RenderDataTable
      title='Purchase Down Payment Invoice'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      hide_columns={['pkid']}
      detailPath='/account_payable/purchase_down_payment_invoice'
      action='RUDX'
      // exportCSV={exportCSV}
      handleDownloadRow={handleDownloadRow}
      deleteFunc={handleDeleteRow}
    />
  );
};

export default PurchaseDownPaymentInvoiceTable;
