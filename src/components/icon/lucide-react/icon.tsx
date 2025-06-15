import { icons } from 'lucide-react';

interface IconProps {
  name: string;
  color: string;
  size: number;
  className?: string;
}
const Icon = ({ name, color, size, className }: IconProps) => {
  const LucideIcon = icons[name as keyof typeof icons];

  return <LucideIcon color={color} size={size} className={className} />;
};

export default Icon;
