import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import AdminNavigation from '@/components/admin/AdminNavigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Redirect to login if not authenticated
  if (!session || (session.user as any)?.role !== 'admin') {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation />
      <main className="py-6">
        <div className="container mx-auto px-4">
          {children}
        </div>
      </main>
    </div>
  );
}

