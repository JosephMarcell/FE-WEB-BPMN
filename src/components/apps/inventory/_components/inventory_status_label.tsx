interface IInventoryStatusLabelProps {
  status: 'waiting' | 'on production';
}

export const InventoryStatusLabel = ({
  status,
}: IInventoryStatusLabelProps) => {
  const getStatus = () => {
    switch (status) {
      case 'waiting':
        return 'Waiting';
      case 'on production':
        return 'On Production';
      default:
        return 'Unknown';
    }
  };
  const getBGColor = () => {
    switch (status) {
      case 'waiting':
        return 'bg-success';
      case 'on production':
        return 'bg-secondary';
      default:
        return 'bg-secondary';
    }
  };
  return (
    <span className={'badge rounded-full ' + getBGColor()}>{getStatus()}</span>
  );
};
