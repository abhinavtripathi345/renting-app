import React from 'react';
import './globals.css';
import AdminSidebar from '../components/AdminSidebar';

export const metadata = {
  title: 'Renting App — Admin Dashboard',
  description: 'Vehicle Rental Marketplace Administration Portal',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-slate-50 text-slate-900">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">{children}</div>
      </body>
    </html>
  );
}
