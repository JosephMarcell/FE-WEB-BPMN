import React from 'react';

interface PayrollData {
  nama_golongan: string;
  pkid: number;
  [key: string]: number | string | boolean;
}

interface WhiteCollarPayrollClassDetailProps {
  data: PayrollData | undefined;
}

const WhiteCollarPayrollClassDetail: React.FC<
  WhiteCollarPayrollClassDetailProps
> = ({ data }) => {
  if (!data) {
    return <p>No data available</p>;
  }

  return (
    <div>
      <h1 className='pb-4 pl-4 text-xl font-bold'>
        Details for {data.nama_golongan}
      </h1>
      <table>
        <thead>
          <tr>
            <th>Tahun</th>
            <th>Gaji</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([key, value]) => {
            if (key.startsWith('tahun_') && typeof value === 'number') {
              const tahun = key.split('_')[1];
              return (
                <tr key={tahun}>
                  <td>{tahun}</td>
                  <td>Rp {value.toLocaleString('id-ID')},00</td>
                </tr>
              );
            }
            return null;
          })}
        </tbody>
      </table>
    </div>
  );
};

export default WhiteCollarPayrollClassDetail;
