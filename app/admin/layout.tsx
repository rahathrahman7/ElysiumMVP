import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/database/prisma';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';
import { isAdminAuthDisabled, isDemoAdminBypassEnabled } from '@/lib/auth/productionGuards';

export const metadata = {
  title: 'ELYSIUM Admin Dashboard',
  description: 'Luxury jewelry e-commerce admin dashboard',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // DISABLE_ADMIN_AUTH / DEMO_ADMIN_* are ignored in production (fail closed).
  if (!isAdminAuthDisabled()) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      redirect('/api/auth/signin?callbackUrl=/admin');
    }

    const sessionRole = session.user.role;
    const sessionEmail = session.user.email;
    const demoEmail = process.env.DEMO_ADMIN_EMAIL;

    if (sessionRole !== 'ADMIN') {
      const demoAllowed =
        isDemoAdminBypassEnabled() &&
        sessionEmail &&
        demoEmail &&
        sessionEmail === demoEmail;

      if (!demoAllowed) {
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { role: true }
        });

        if (user?.role !== 'ADMIN') {
          redirect('/');
        }
      }
    }
  }

  return (
    <div className="flex min-h-screen bg-[#FEFDFB]">
      <AdminSidebar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
