interface IInventoryTypeLabelProps {
  type: 'purchase' | 'sales';
}

export const InventoryTypeLabel = ({ type }: IInventoryTypeLabelProps) => {
  const getType = () => {
    switch (type) {
      case 'purchase':
        return 'Purchase';
      case 'sales':
        return 'Sales';
      default:
        return 'Unknown';
    }
  };
  const getBGColor = () => {
    switch (type) {
      case 'purchase':
        return 'bg-success';
      case 'sales':
        return 'bg-secondary';
      default:
        return 'bg-secondary';
    }
  };
  return <span className={'badge ' + getBGColor()}>{getType()}</span>;
};
