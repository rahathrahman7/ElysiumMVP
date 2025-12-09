import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/database/prisma';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';

const demoAdminEmail = process.env.DEMO_ADMIN_EMAIL;
const disableAdminAuth = process.env.DISABLE_ADMIN_AUTH === 'true';

export const metadata = {
  title: 'ELYSIUM Admin Dashboard',
  description: 'Luxury jewelry e-commerce admin dashboard',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!disableAdminAuth) {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      redirect('/api/auth/signin?callbackUrl=/admin');
    }

    const sessionRole = (session.user as any).role;
    const sessionEmail = session.user.email;

    if (sessionRole !== 'ADMIN') {
      if (sessionEmail && demoAdminEmail && sessionEmail === demoAdminEmail) {
        // Allow demo admin access
      } else {
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
