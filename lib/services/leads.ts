import { prisma } from '@/lib/database/prisma';

/**
 * Get all bespoke leads with optional filtering
 */
export async function getAllLeads(params?: {
  status?: string;
  limit?: number;
  offset?: number;
}) {
  const where: any = {};

  if (params?.status && params.status !== 'ALL') {
    where.status = params.status;
  }

  return await prisma.bespokeLead.findMany({
    where,
    include: {
      inquiryNotes: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: params?.limit,
    skip: params?.offset,
  });
}

/**
 * Get a single lead by ID
 */
export async function getLeadById(id: string) {
  return await prisma.bespokeLead.findUnique({
    where: { id },
    include: {
      inquiryNotes: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            }
          }
        },
        orderBy: { createdAt: 'asc' }
      }
    }
  });
}

/**
 * Update lead status
 */
export async function updateLeadStatus(id: string, status: string) {
  return await prisma.bespokeLead.update({
    where: { id },
    data: {
      status,
      updatedAt: new Date(),
    }
  });
}

/**
 * Add note to lead
 */
export async function addLeadNote(leadId: string, userId: string, content: string) {
  return await prisma.inquiryNote.create({
    data: {
      leadId,
      userId,
      content,
    }
  });
}

/**
 * Delete a lead
 */
export async function deleteLead(id: string) {
  return await prisma.bespokeLead.delete({
    where: { id }
  });
}
