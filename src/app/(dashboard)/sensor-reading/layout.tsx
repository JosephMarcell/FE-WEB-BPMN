import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sensor Reading',
};

export default function SensorReadingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
