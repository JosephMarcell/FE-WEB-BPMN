import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sensor Configuration',
};

export default function SensorConfigurationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
