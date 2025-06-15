import React from 'react';

import './Timeline.css';

import { RoutingProperty } from '@/helpers/utils/manufacturing/routing';

interface RoutingDetail {
  data: RoutingProperty[];
}
const Timeline = ({ data }: RoutingDetail) => {
  const groupedData: { [key: number]: RoutingProperty[] } = data.reduce(
    (acc, item: RoutingProperty) => {
      (acc[item.order ?? 0] = acc[item.order ?? 0] || []).push(item);
      return acc;
    },
    {} as { [key: number]: RoutingProperty[] },
  );

  return (
    <div className='timeline-container'>
      {Object.keys(groupedData)
        .sort((a: string, b: string) => Number(a) - Number(b))
        .map(order => (
          <div key={order} className='timeline-group'>
            {groupedData[Number(order)].map(
              (item: RoutingProperty, index: number) => (
                <div key={index} className='timeline-item'>
                  <div className='timeline-item-content'>
                    <span className='order-number'>{item.order}</span>
                    <h3 className='operation-name'>{item.name}</h3>
                    <p>{item.name}</p>
                    <span className='circle' />
                    {index < groupedData[Number(order)].length - 1 && (
                      <span className='horizontal-line' />
                    )}
                  </div>
                </div>
              ),
            )}
            {parseInt(order) < Object.keys(groupedData).length && (
              <span className='vertical-line' />
            )}
          </div>
        ))}
    </div>
  );
};

export default Timeline;
