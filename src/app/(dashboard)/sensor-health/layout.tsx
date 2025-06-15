import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sensor Health Monitoring',
};

export default function SensorHealthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
