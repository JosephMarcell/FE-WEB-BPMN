import React from 'react';

import IconX from '@/components/icon/icon-x';

interface Item {
  id: number;
  title: string;
  description: string;
  rate: number;
  quantity: number;
}

interface InvoiceItemProps {
  item: Item;
  onChange: (type: string, value: string, id: number) => void;
  onRemove: (item: Item) => void;
}

const InvoiceItem: React.FC<InvoiceItemProps> = ({
  item,
  onChange,
  onRemove,
}) => {
  return (
    <tr className='align-top'>
      <td>
        <input
          type='text'
          className='form-input min-w-[200px]'
          placeholder='Enter Item Name'
          defaultValue={item.title}
          onBlur={e => onChange('title', e.target.value, item.id)}
        />
        <textarea
          className='form-textarea mt-4'
          placeholder='Enter Description'
          defaultValue={item.description}
          onBlur={e => onChange('description', e.target.value, item.id)}
        />
      </td>
      <td>
        <input
          type='number'
          className='form-input w-32'
          placeholder='Quantity'
          defaultValue={item.quantity}
          min={0}
          onChange={e => onChange('quantity', e.target.value, item.id)}
        />
      </td>
      <td>
        <input
          type='number'
          className='form-input w-32'
          placeholder='Price'
          defaultValue={item.rate}
          min={0}
          onChange={e => onChange('rate', e.target.value, item.id)}
        />
      </td>
      <td>${item.quantity * item.rate}</td>
      <td>
        <button type='button' onClick={() => onRemove(item)}>
          <IconX className='h-5 w-5' />
        </button>
      </td>
    </tr>
  );
};

export default InvoiceItem;
