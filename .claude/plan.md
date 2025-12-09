# ELYSIUM Admin Dashboard - Implementation Plan

## Executive Summary

Build a premium, luxury-branded admin dashboard that matches ELYSIUM's sophisticated aesthetic. The dashboard will serve as the client's daily command center for managing orders, inventory, customer inquiries, and business analytics.

---

## Design Philosophy

### Brand Consistency
- **Primary Brown**: `#753600` (sidebar, headers, primary actions)
- **Gold Accent**: `#D4AF37` (hover states, highlights, active indicators)
- **Ivory Background**: `#FEFDFB` (content area)
- **Pearl Secondary**: `#F8F6F2` (cards, sections)
- **Typography**: Cormorant Garamond (headings), Inter (body text)

### Visual Style
- Elegant sidebar navigation with subtle gold hover effects
- Cream/ivory content area with soft shadows
- Premium card components with refined borders
- Subtle animations (fade-in, smooth transitions)
- Status indicators using tasteful color coding
- No gradients (per client requirement)

---

## Dashboard Structure

### 1. Layout Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ELYSIUM Admin Header                      │
│  [Logo]                              [Notifications] [User]  │
├────────────┬────────────────────────────────────────────────┤
│            │                                                 │
│  SIDEBAR   │              MAIN CONTENT AREA                 │
│            │                                                 │
│  Dashboard │  ┌─────────────────────────────────────────┐   │
│  Orders    │  │  Page Title + Breadcrumbs               │   │
│  Inquiries │  └─────────────────────────────────────────┘   │
│  Inventory │                                                 │
│  Customers │  ┌─────────────────────────────────────────┐   │
│  Analytics │  │                                         │   │
│  Settings  │  │           Dynamic Content               │   │
│            │  │                                         │   │
│            │  └─────────────────────────────────────────┘   │
│            │                                                 │
└────────────┴────────────────────────────────────────────────┘
```

### 2. Navigation Structure

**Sidebar Menu:**
1. **Dashboard** - Overview & Quick Stats
2. **Orders** - Order Management & Timeline
3. **Inquiries** - Bespoke Leads & Consultations
4. **Inventory** - Stock Management
5. **Customers** - User Database
6. **Analytics** - Business Intelligence
7. **Settings** - Admin Configuration

---

## Page Specifications

### Page 1: Dashboard Overview (`/admin`)

**Purpose**: Daily snapshot of business health

**Components**:

#### A. Key Metrics Strip (4 cards)
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  📦 Orders   │ │  💰 Revenue  │ │  📩 Inquiries│ │  👁 Views    │
│  Today: 5    │ │  £12,450     │ │  New: 3      │ │  Today: 847  │
│  +12% ↑      │ │  This Week   │ │  Pending: 7  │ │  +23% ↑      │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

#### B. Recent Orders Table (Last 5)
- Order Number | Customer | Items | Status | Amount | Date
- Click to view full order details
- Status badges with color coding

#### C. Pending Inquiries Alert
- Highlighted card for inquiries needing response
- Shows name, email, inquiry date, days waiting
- Quick action buttons: View | Email | Mark Contacted

#### D. Low Stock Alerts
- Products below threshold
- Quick restock button

#### E. Quick Actions Panel
- "Add New Order"
- "Add Inventory"
- "View Analytics"
- "Export Reports"

---

### Page 2: Orders Management (`/admin/orders`)

**Purpose**: Complete order lifecycle management

**Components**:

#### A. Orders Filter Bar
- Status filter (All, Pending, Paid, Shipped, Delivered, etc.)
- Date range picker
- Search by order number or customer email
- Export CSV button

#### B. Orders Table
| Order # | Customer | Email | Items | Total | Status | Date | Actions |
|---------|----------|-------|-------|-------|--------|------|---------|
| ELY-XXX | Name     | email | 2     | £3,450| Paid   | Dec 5| View    |

#### C. Order Detail Modal/Page
```
┌─────────────────────────────────────────────────────────────┐
│ ORDER: ELY-XXXXX                                   [Close]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─── Timeline ─────────────────────────────────────────┐   │
│  │ ● Order Created        Dec 5, 2024 @ 2:30 PM        │   │
│  │ ● Payment Received     Dec 5, 2024 @ 2:35 PM        │   │
│  │ ● Processing Started   Dec 6, 2024 @ 9:00 AM        │   │
│  │ ○ Shipped              (Pending)                     │   │
│  │ ○ Delivered            (Pending)                     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  Customer Information          Shipping Address             │
│  ─────────────────────         ─────────────────            │
│  Name: John Smith              123 High Street              │
│  Email: john@email.com         London, W1A 1AA              │
│  Phone: +44 7700 900000        United Kingdom               │
│                                                             │
│  Order Items                                                │
│  ─────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ [Image] Celeste Six-Claw Solitaire                   │   │
│  │         18k Yellow Gold | Lab | 1ct | F | VS1        │   │
│  │         Size: M | Engraving: "Forever"               │   │
│  │         Qty: 1 × £2,950                              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Notes: Gift wrap requested                                 │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Update Status: [Dropdown ▼]    [Add Note]  [Email] │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### Page 3: Inquiries Management (`/admin/inquiries`)

**Purpose**: Manage bespoke leads and consultation requests

**Components**:

#### A. Inquiry Status Tabs
- All | New (badge) | Contacted | Quoted | Converted | Archived

#### B. Inquiries Table
| Date | Name | Email | Phone | Budget | Status | Days Waiting | Actions |

#### C. Inquiry Detail Modal
- Full inquiry details
- Notes/Communication log
- Status update dropdown
- Quick email composer
- Follow-up reminder scheduler

#### D. Email Templates
- Pre-built templates for:
  - Initial Response
  - Quote Follow-up
  - Consultation Booking
  - Thank You

---

### Page 4: Inventory Management (`/admin/inventory`)

**Purpose**: Stock control and variant management

**Components**:

#### A. Inventory Overview Cards
```
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  Total Products  │ │  Low Stock Items │ │  Out of Stock    │
│       12         │ │        3         │ │        1         │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

#### B. Product Inventory Table
| Product | Variant | Stock Level | Reserved | Available | Threshold | Actions |
|---------|---------|-------------|----------|-----------|-----------|---------|
| Celeste | YG-1ct-F-VS1 | 5 | 2 | 3 | 3 | Edit |

#### C. Add/Edit Inventory Modal
- Product selector (dropdown)
- Variant key generator (Metal + Carat + Colour + Clarity)
- Stock level input
- Low stock threshold
- Notes

#### D. Bulk Actions
- Import CSV
- Export CSV
- Bulk update stock levels

---

### Page 5: Customers (`/admin/customers`)

**Purpose**: Customer database and order history

**Components**:

#### A. Customer Search & Filter
- Search by name, email, phone
- Filter by: Has Orders, Has Wishlist, Recent

#### B. Customers Table
| Name | Email | Orders | Total Spent | Last Order | Joined | Actions |

#### C. Customer Detail Modal
- Profile information
- Order history (with links)
- Wishlist items
- Product views
- Notes

---

### Page 6: Analytics (`/admin/analytics`)

**Purpose**: Business intelligence and insights

**Components**:

#### A. Date Range Selector
- Today | 7 Days | 30 Days | Custom Range

#### B. Revenue Chart
- Line graph showing daily/weekly revenue
- Comparison with previous period

#### C. Top Products
- Most viewed products
- Best sellers
- Conversion rate by product

#### D. Traffic Overview
- Page views over time
- Popular pages
- Device breakdown

#### E. Inquiry Conversion
- Lead to customer conversion rate
- Average response time
- Inquiry source breakdown

---

## Database Schema Updates

### Add Admin Role to User Model
```prisma
model User {
  // ... existing fields
  role        String  @default("CUSTOMER") // ADMIN | CUSTOMER
}
```

### Add Communication Log for Inquiries
```prisma
model InquiryNote {
  id          String   @id @default(uuid())
  leadId      String
  content     String
  createdBy   String   // Admin user ID
  createdAt   DateTime @default(now())

  lead        BespokeLead @relation(fields: [leadId], references: [id])
}
```

### Update BespokeLead Status Options
```
NEW → CONTACTED → QUOTED → NEGOTIATING → CONVERTED → LOST → ARCHIVED
```

---

## API Routes Structure

```
/api/admin/
├── dashboard/
│   └── stats          GET - Dashboard overview stats
├── orders/
│   ├── route.ts       GET - List all orders (paginated, filtered)
│   └── [id]/
│       ├── route.ts   GET, PATCH - Single order details/update
│       └── timeline   GET - Order status history
├── inquiries/
│   ├── route.ts       GET, POST - List/create inquiries
│   └── [id]/
│       ├── route.ts   GET, PATCH, DELETE
│       ├── notes      GET, POST - Communication log
│       └── email      POST - Send email to lead
├── inventory/
│   ├── route.ts       GET, POST - List/add inventory
│   ├── [id]           PATCH, DELETE
│   ├── bulk           POST - Bulk update
│   └── low-stock      GET - Low stock items
├── customers/
│   ├── route.ts       GET - List customers
│   └── [id]           GET - Customer details
└── analytics/
    ├── revenue        GET - Revenue stats
    ├── products       GET - Product performance
    └── traffic        GET - Traffic analytics
```

---

## Authentication & Authorization

### Admin Middleware
```typescript
// lib/auth/adminAuth.ts
export async function requireAdmin(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (user?.role !== 'ADMIN') {
    throw new Error('Forbidden');
  }

  return user;
}
```

### Protected Layout
```typescript
// app/admin/layout.tsx
// Check admin role, redirect to login if unauthorized
```

---

## File Structure

```
app/
├── admin/
│   ├── layout.tsx              # Admin layout with sidebar
│   ├── page.tsx                # Dashboard overview
│   ├── orders/
│   │   ├── page.tsx            # Orders list
│   │   └── [id]/page.tsx       # Order details
│   ├── inquiries/
│   │   └── page.tsx            # Inquiries management
│   ├── inventory/
│   │   └── page.tsx            # Inventory management
│   ├── customers/
│   │   └── page.tsx            # Customer list
│   ├── analytics/
│   │   └── page.tsx            # Analytics dashboard
│   └── settings/
│       └── page.tsx            # Admin settings
└── api/admin/
    └── [... API routes]

components/admin/
├── layout/
│   ├── AdminSidebar.tsx        # Elegant sidebar navigation
│   ├── AdminHeader.tsx         # Top header with user menu
│   └── AdminLayout.tsx         # Main layout wrapper
├── dashboard/
│   ├── StatCard.tsx            # Metric display card
│   ├── RecentOrders.tsx        # Recent orders table
│   └── PendingInquiries.tsx    # Inquiry alerts
├── orders/
│   ├── OrdersTable.tsx         # Orders data table
│   ├── OrderDetail.tsx         # Order detail view
│   ├── OrderTimeline.tsx       # Status timeline
│   └── OrderStatusBadge.tsx    # Status indicator
├── inquiries/
│   ├── InquiriesTable.tsx      # Inquiries list
│   ├── InquiryDetail.tsx       # Inquiry modal
│   └── EmailComposer.tsx       # Quick email
├── inventory/
│   ├── InventoryTable.tsx      # Stock table
│   └── InventoryForm.tsx       # Add/edit form
├── customers/
│   ├── CustomersTable.tsx      # Customer list
│   └── CustomerDetail.tsx      # Customer profile
├── analytics/
│   ├── RevenueChart.tsx        # Revenue visualization
│   └── TopProducts.tsx         # Product performance
└── ui/
    ├── AdminCard.tsx           # Styled card component
    ├── AdminTable.tsx          # Data table component
    ├── AdminBadge.tsx          # Status badges
    ├── AdminButton.tsx         # Brown/gold buttons
    └── AdminModal.tsx          # Modal dialogs

lib/services/
├── admin.ts                    # Admin dashboard stats
└── leads.ts                    # Bespoke leads management
```

---

## Implementation Phases

### Phase 1: Foundation (Core Layout & Navigation)
1. Create admin layout with luxury sidebar
2. Build admin header with notifications
3. Set up admin route protection
4. Create base UI components (AdminCard, AdminTable, AdminButton)

### Phase 2: Dashboard Overview
1. Build dashboard stats API endpoint
2. Create StatCard components
3. Build RecentOrders widget
4. Create PendingInquiries alert widget
5. Add quick actions panel

### Phase 3: Orders Management
1. Create orders list API with filters
2. Build OrdersTable with pagination
3. Create order detail view with timeline
4. Add status update functionality
5. Implement order notes feature

### Phase 4: Inquiries Management
1. Build inquiries list API
2. Create InquiriesTable component
3. Build inquiry detail modal
4. Add notes/communication log
5. Implement email integration

### Phase 5: Inventory Management
1. Build inventory list/update APIs
2. Create InventoryTable component
3. Add/edit inventory modal
4. Low stock alerts widget
5. Bulk import/export

### Phase 6: Customers & Analytics
1. Build customers list API
2. Create CustomersTable
3. Customer detail with order history
4. Analytics API endpoints
5. Charts and visualizations

---

## Visual Component Examples

### AdminCard Component
```tsx
<div className="bg-white border border-elysium-whisper shadow-sm p-6 hover:shadow-md transition-shadow">
  <div className="flex items-center justify-between mb-4">
    <h3 className="font-serif text-lg text-[#753600]">{title}</h3>
    <span className="text-elysium-gold">{icon}</span>
  </div>
  <div className="text-3xl font-serif text-[#753600] mb-2">{value}</div>
  <p className="text-sm text-gray-600">{description}</p>
</div>
```

### AdminButton Variants
```tsx
// Primary (Gold)
<button className="bg-elysium-gold text-[#753600] px-6 py-2 font-medium
  hover:bg-[#753600] hover:text-white transition-colors">
  Primary Action
</button>

// Secondary (Brown outline)
<button className="border-2 border-[#753600] text-[#753600] px-6 py-2
  font-medium hover:bg-[#753600] hover:text-white transition-colors">
  Secondary
</button>
```

### Status Badges
```tsx
const statusColors = {
  PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
  PAID: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  SHIPPED: 'bg-blue-100 text-blue-800 border-blue-200',
  DELIVERED: 'bg-green-100 text-green-800 border-green-200',
  CANCELLED: 'bg-red-100 text-red-800 border-red-200',
};
```

---

## Summary

This admin dashboard will provide the client with:

1. **At-a-glance business health** via the dashboard overview
2. **Complete order visibility** with timeline tracking
3. **Lead management** for bespoke inquiries
4. **Inventory control** with low stock alerts
5. **Customer insights** with order history
6. **Business analytics** for informed decisions

All wrapped in ELYSIUM's signature luxury aesthetic, ensuring the admin experience matches the premium customer-facing brand.

---

**Estimated Implementation**: 6 phases, comprehensive build
**Technology**: Next.js 15, TypeScript, Tailwind CSS, Prisma, PostgreSQL
