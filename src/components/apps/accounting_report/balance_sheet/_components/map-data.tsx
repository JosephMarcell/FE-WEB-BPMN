import Link from 'next/link';
import React from 'react';

import { renderLargaData } from '@/helpers/utils/general_ledger/dataProcessing';

interface Data {
  date: Date;
  debit: number;
  credit: number;
  description: string;
  transactionType: string;
  balance: number;
}

interface Total {
  total: number;
}

interface Item {
  coa_name: string;
  coa_number: string;
  data: Array<Data>;
  total: number;
}

interface Props {
  title: string;
  data: Array<Item | Total>;
  toDetail?: string;
}

const MapData = (props: Props) => {
  return (
    <>
      {props.data?.map((itemOrTotal: Item | Total, index: number) => {
        if ('coa_name' in itemOrTotal) {
          const item = itemOrTotal as Item;
          return (
            <div key={index} className='ml-3 flex justify-between'>
              <p className='text-black'>{item.coa_name}</p>
              <p className='text-black'>
                <Link
                  className='cursor-pointer text-black hover:text-blue-500'
                  href={props.toDetail ? props.toDetail : '#'}
                >
                  {renderLargaData(item.total)}
                </Link>
              </p>
            </div>
          );
        } else {
          const total = itemOrTotal as Total;
          // "Jumlah" only for Total type
          return (
            <React.Fragment key={index}>
              <hr />
              <div className='mb-4 flex justify-between'>
                <p className='font-bold text-black'>Jumlah {props.title}</p>
                <Link
                  className='cursor-pointer text-black hover:text-blue-500'
                  href={props.toDetail ? props.toDetail : '#'}
                >
                  {renderLargaData(total.total)}
                </Link>
              </div>
            </React.Fragment>
          );
        }
      })}
    </>
  );
};

export default MapData;
