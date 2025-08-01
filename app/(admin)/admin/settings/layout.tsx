import { ReactNode } from 'react';

export default function SettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="space-y-6 p-6">
      {children}
    </div>
  );
}
