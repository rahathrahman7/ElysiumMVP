# Technical Specification: Database Architecture & Backend

Date: October 7, 2025
Author: Rahath
Epic ID: Epic 1-6 (Backend Foundation)
Status: Draft

---

## Overview

This specification defines the hybrid database architecture for ELYSIUM's luxury jewelry e-commerce platform, implementing a multi-database strategy that leverages Sanity CMS for content management and PostgreSQL for transactional data, unified through Next.js API routes.

## Objectives and Scope

**Primary Objectives:**
- Implement secure, scalable database layer for luxury e-commerce
- Maintain Sanity CMS benefits while adding transactional capabilities
- Ensure PCI compliance and GDPR adherence
- Support high-value transactions (£1k-50k+) with 99.9% reliability

**In Scope:**
- PostgreSQL database setup and schema design
- Prisma ORM integration
- NextAuth.js authentication system
- Cart and order management
- Inventory tracking system
- Customer data management

**Out of Scope:**
- Sanity CMS modifications (keeping current setup)
- Payment processing (handled by Stripe)
- Frontend components (existing Next.js frontend)

## System Architecture Alignment

**Hybrid Multi-Database Architecture:**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   SANITY CMS    │    │ POSTGRESQL DB   │    │   STRIPE API    │
│                 │    │                 │    │                 │
│ • Products      │    │ • Users         │    │ • Payments      │
│ • Collections   │    │ • Orders        │    │ • Subscriptions │
│ • Content       │    │ • Cart Items    │    │ • Webhooks      │
│ • Media Assets  │    │ • Inventory     │    │ • Customers     │
│ • SEO Data      │    │ • Analytics     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   NEXT.JS API   │
                    │                 │
                    │ • Data Layer    │
                    │ • Business Logic│
                    │ • Validation    │
                    │ • Caching       │
                    └─────────────────┘
```

## Detailed Design

### Services and Modules

**1. Database Service (`lib/database/`)**
```typescript
// Prisma client setup
export const prisma = new PrismaClient()

// Connection pooling
// Environment configuration
// Migration management
```

**2. Authentication Service (`lib/auth/`)**
```typescript
// NextAuth.js configuration
// Session management
// User registration/login
// Role-based access control
```

**3. Cart Service (`lib/cart/`)**
```typescript
// Cart CRUD operations
// Session-based cart
// Cart persistence
// Configuration saving
```

**4. Order Service (`lib/orders/`)**
```typescript
// Order creation
// Payment processing integration
// Order status management
// Email notifications
```

**5. Inventory Service (`lib/inventory/`)**
```typescript
// Stock tracking
// Reserved inventory
// Low stock alerts
// Inventory updates
```

### Data Models and Contracts

**Core Entities:**

```sql
-- Users & Authentication
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL
);

-- Customer Data
CREATE TABLE customer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  phone VARCHAR(50),
  date_of_birth DATE,
  preferences JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) CHECK (type IN ('billing', 'shipping')),
  line1 VARCHAR(255) NOT NULL,
  line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(2) NOT NULL,
  is_default BOOLEAN DEFAULT FALSE
);

-- Shopping Cart
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_slug VARCHAR(255) NOT NULL,
  configuration JSONB NOT NULL,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  total_amount_gbp DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'GBP',
  stripe_payment_intent_id VARCHAR(255),
  billing_address_id UUID REFERENCES addresses(id),
  shipping_address_id UUID REFERENCES addresses(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_slug VARCHAR(255) NOT NULL,
  configuration JSONB NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price_gbp DECIMAL(10,2) NOT NULL,
  total_price_gbp DECIMAL(10,2) NOT NULL
);

-- Inventory Management
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_slug VARCHAR(255) NOT NULL,
  variant_key VARCHAR(255) NOT NULL,
  stock_level INTEGER DEFAULT 0,
  reserved_stock INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  last_updated TIMESTAMP DEFAULT NOW(),
  UNIQUE(product_slug, variant_key)
);

-- Analytics & Wishlist
CREATE TABLE wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_slug VARCHAR(255) NOT NULL,
  configuration JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_slug)
);

CREATE TABLE product_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  product_slug VARCHAR(255) NOT NULL,
  session_id VARCHAR(255),
  viewed_at TIMESTAMP DEFAULT NOW()
);
```

### APIs and Interfaces

**Authentication APIs:**
```typescript
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/session
POST /api/auth/logout
```

**Cart APIs:**
```typescript
GET    /api/cart
POST   /api/cart/add
PUT    /api/cart/update
DELETE /api/cart/remove
POST   /api/cart/save-configuration
```

**Order APIs:**
```typescript
POST /api/orders/create
GET  /api/orders/:id
GET  /api/orders/user/:userId
PUT  /api/orders/:id/status
```

**Inventory APIs:**
```typescript
GET  /api/inventory/:productSlug
POST /api/inventory/reserve
POST /api/inventory/release
GET  /api/inventory/low-stock
```

### Workflows and Sequencing

**Order Creation Flow:**
1. Validate cart items and inventory
2. Create order record
3. Reserve inventory
4. Process payment via Stripe
5. Update order status
6. Send confirmation email
7. Release reserved inventory if payment fails

**Cart Management Flow:**
1. Add item to cart (session or authenticated)
2. Validate product configuration
3. Check inventory availability
4. Persist cart state
5. Sync with user account on login

## Non-Functional Requirements

### Performance

**Database Performance:**
- Query response time < 100ms for 95th percentile
- Connection pooling: 20-100 connections
- Read replicas for analytics queries
- Database connection timeout: 30 seconds
- Query optimization with proper indexing

**API Performance:**
- Response time < 200ms for critical endpoints
- Caching layer with Redis for session data
- Database query caching with 5-minute TTL

### Security

**Data Protection:**
- Encryption at rest using PostgreSQL TDE
- Encryption in transit with TLS 1.3
- API authentication via NextAuth.js JWT tokens
- Role-based access control (customer, admin, staff)
- Input validation and SQL injection prevention

**Compliance:**
- PCI DSS Level 1 compliance (via Stripe)
- GDPR compliance with data retention policies
- Right to deletion implementation
- Data export functionality for GDPR requests

### Reliability/Availability

**High Availability:**
- 99.9% uptime target
- Database backups every 6 hours
- Point-in-time recovery capability
- Automated failover for database
- Health checks and monitoring

**Error Handling:**
- Graceful degradation for non-critical features
- Retry logic for transient failures
- Circuit breaker pattern for external APIs
- Comprehensive error logging

### Observability

**Monitoring:**
- Database performance metrics
- API response time monitoring
- Error rate tracking
- User session analytics
- Real-time alerts for system issues

**Logging:**
- Structured logging with JSON format
- Request/response logging
- Database query logging (non-sensitive)
- Audit trail for sensitive operations

## Dependencies and Integrations

**Core Dependencies:**
- **Vercel Postgres**: Primary database hosting
- **Prisma ORM**: Database abstraction and migrations
- **NextAuth.js**: Authentication and session management
- **@vercel/postgres**: Database client
- **bcryptjs**: Password hashing

**External Integrations:**
- **Sanity CMS**: Product catalog synchronization
- **Stripe**: Payment processing and webhooks
- **Resend**: Email notifications
- **Plausible**: Analytics events

## Implementation Phases

**Phase 1: Foundation (Week 1-2)**
- Vercel Postgres setup
- Prisma schema implementation
- NextAuth.js configuration
- Basic user management

**Phase 2: Core Features (Week 3-4)**
- Shopping cart implementation
- Order processing pipeline
- Stripe integration
- Email notifications

**Phase 3: Advanced Features (Week 5-6)**
- Inventory management
- Analytics tracking
- Admin interfaces
- Performance optimization

## Migration Strategy

**Data Migration:**
- No migration needed from Sanity (remains unchanged)
- New PostgreSQL database starts fresh
- Gradual feature rollout with feature flags

**Rollback Plan:**
- Maintain static product data as fallback
- Feature flags for new functionality
- Database backup before each deployment

## Validation and Testing

**Database Testing:**
- Unit tests for Prisma operations
- Integration tests for API endpoints
- Load testing for concurrent users
- Data integrity validation

**Security Testing:**
- SQL injection testing
- Authentication flow testing
- Authorization boundary testing
- Data encryption verification

---

**Architecture Decision Records (ADRs) tracked separately in `/docs/architecture-decisions/`**