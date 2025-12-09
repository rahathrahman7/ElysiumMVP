# ELYSIUM - Launch Checklist

**Use this checklist to track progress toward launch**

---

## 🚀 Pre-Launch Checklist

### Phase 1: Database & Infrastructure (1-2 hours)

- [ ] **Create Vercel Postgres Database**
  - [ ] Go to Vercel Dashboard → Storage → Create Database
  - [ ] Select Postgres
  - [ ] Name: `elysium-production`
  - [ ] Copy all connection strings

- [ ] **Configure Environment Variables**
  - [ ] Create `.env.local` from `.env.example`
  - [ ] Add `DATABASE_URL` from Vercel
  - [ ] Generate `NEXTAUTH_SECRET`: `openssl rand -base64 32`
  - [ ] Add Stripe test keys (switch to live before production)
  - [ ] Add Resend API key
  - [ ] Add Sanity credentials

- [ ] **Run Database Migrations**
  ```bash
  pnpm db:generate
  pnpm db:push
  ```
  - [ ] Verify tables created in Vercel dashboard
  - [ ] Check all 13 models are present

- [ ] **Test Locally**
  - [ ] Start dev server: `pnpm dev`
  - [ ] Open http://localhost:3000
  - [ ] Verify site loads without errors

---

### Phase 2: Authentication Testing (30 minutes)

- [ ] **Test User Registration**
  - [ ] Register new user account
  - [ ] Verify email validation works
  - [ ] Check password requirements enforced
  - [ ] Confirm user created in database

- [ ] **Test Login/Logout**
  - [ ] Login with new account
  - [ ] Check session persists on refresh
  - [ ] Test logout
  - [ ] Verify session cleared

- [ ] **Test Protected Routes**
  - [ ] Try accessing `/api/cart` without login (should fail)
  - [ ] Login and try again (should work)
  - [ ] Verify authorization checks working

---

### Phase 3: E-commerce Flow Testing (1 hour)

- [ ] **Test Product Browsing**
  - [ ] View product listing page
  - [ ] Test filters (metal, diamond, size, price)
  - [ ] Verify filter persistence in URL
  - [ ] Check product detail pages load

- [ ] **Test Product Configuration**
  - [ ] Open configurator
  - [ ] Select different metals
  - [ ] Choose diamond specifications
  - [ ] Select ring size
  - [ ] Add engraving (if enabled)
  - [ ] Verify price updates in real-time

- [ ] **Test Cart Functionality**
  - [ ] Add configured product to cart
  - [ ] Verify cart count updates
  - [ ] Open cart drawer
  - [ ] Update quantity
  - [ ] Remove item
  - [ ] Add multiple items
  - [ ] Verify cart persists after logout/login

- [ ] **Test Wishlist**
  - [ ] Add product to wishlist
  - [ ] View wishlist page
  - [ ] Remove from wishlist
  - [ ] Verify persistence

---

### Phase 4: Checkout & Payment Testing (1 hour)

- [ ] **Stripe Test Mode Setup**
  - [ ] Verify test keys in environment
  - [ ] Install Stripe CLI: `brew install stripe/stripe-cli/stripe`
  - [ ] Login: `stripe login`
  - [ ] Forward webhooks: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
  - [ ] Copy webhook secret to `.env.local`

- [ ] **Test Checkout Flow**
  - [ ] Add items to cart
  - [ ] Click checkout
  - [ ] Verify order created (check database)
  - [ ] Redirected to Stripe Checkout
  - [ ] Use test card: `4242 4242 4242 4242`
  - [ ] Complete payment

- [ ] **Verify Order Processing**
  - [ ] Check order status updated to "PAID"
  - [ ] Verify cart cleared after checkout
  - [ ] Check order appears in order history
  - [ ] Verify order details correct

- [ ] **Test Webhook Handling**
  - [ ] Check Stripe CLI shows webhook received
  - [ ] Verify order status updates automatically
  - [ ] Test failed payment (use test card: `4000 0000 0000 0002`)
  - [ ] Verify order marked as "PAYMENT_FAILED"

---

### Phase 5: Content Management (Client Team)

- [ ] **Sanity CMS Setup**
  - [ ] Access Sanity Studio
  - [ ] Verify product schema
  - [ ] Test creating sample product
  - [ ] Test image upload

- [ ] **Product Catalog**
  - [ ] Add all products
  - [ ] Upload product images (min 2000x2000px)
  - [ ] Write product descriptions
  - [ ] Set pricing
  - [ ] Configure variants (metal, size)
  - [ ] Set stock levels

- [ ] **Content Pages**
  - [ ] About page content
  - [ ] Contact information
  - [ ] Care instructions
  - [ ] Size guide
  - [ ] Education/guide content

- [ ] **Legal Pages**
  - [ ] Privacy policy
  - [ ] Terms of service
  - [ ] Return/refund policy
  - [ ] Shipping policy

---

### Phase 6: Production Deployment (2 hours)

- [ ] **Vercel Project Setup**
  - [ ] Push code to GitHub
  - [ ] Import repository to Vercel
  - [ ] Connect repository

- [ ] **Production Environment Variables**
  - [ ] `NEXT_PUBLIC_SITE_URL` → Production domain
  - [ ] `NEXTAUTH_URL` → Production domain
  - [ ] `NEXTAUTH_SECRET` → New secret (generate fresh)
  - [ ] `DATABASE_URL` → Production database
  - [ ] `STRIPE_SECRET_KEY` → **LIVE** key (not test!)
  - [ ] `STRIPE_PUBLISHABLE_KEY` → **LIVE** key
  - [ ] `STRIPE_WEBHOOK_SECRET` → Production webhook secret
  - [ ] `RESEND_API_KEY` → Production key
  - [ ] Sanity credentials
  - [ ] Plausible domain (if using)

- [ ] **Database Migration**
  - [ ] Run: `pnpm db:push` (in production)
  - [ ] Verify tables created
  - [ ] (Optional) Seed initial data

- [ ] **Stripe Production Setup**
  - [ ] Switch Stripe to live mode
  - [ ] Create production webhook endpoint
  - [ ] URL: `https://yourdomain.com/api/webhooks/stripe`
  - [ ] Select events:
    - [ ] `checkout.session.completed`
    - [ ] `payment_intent.succeeded`
    - [ ] `payment_intent.payment_failed`
    - [ ] `charge.refunded`
  - [ ] Copy webhook signing secret
  - [ ] Add to Vercel environment variables
  - [ ] Redeploy to apply changes

- [ ] **Deploy to Production**
  - [ ] Trigger deployment
  - [ ] Monitor build logs
  - [ ] Verify deployment successful

---

### Phase 7: Production Testing (2 hours)

- [ ] **Basic Functionality**
  - [ ] Visit production URL
  - [ ] Check SSL certificate (should show padlock)
  - [ ] Test all main pages load
  - [ ] Verify no console errors

- [ ] **Mobile Testing**
  - [ ] Test on iPhone
  - [ ] Test on Android
  - [ ] Test on iPad/tablet
  - [ ] Verify responsive design works
  - [ ] Test touch interactions

- [ ] **Browser Testing**
  - [ ] Chrome
  - [ ] Safari
  - [ ] Firefox
  - [ ] Edge
  - [ ] Mobile browsers

- [ ] **Complete Purchase Flow (Small Amount)**
  - [ ] Use REAL credit card with small amount (£1 test)
  - [ ] Complete entire flow
  - [ ] Verify payment processed
  - [ ] Check order created
  - [ ] Verify webhook received
  - [ ] Refund test transaction in Stripe dashboard

- [ ] **Performance Check**
  - [ ] Run Lighthouse audit
  - [ ] Target: Performance > 80
  - [ ] Target: Accessibility > 90
  - [ ] Target: SEO > 90
  - [ ] Check page load times < 2 seconds

---

### Phase 8: Monitoring & Analytics (1 hour)

- [ ] **Error Tracking (Recommended)**
  - [ ] Set up Sentry (optional but recommended)
  - [ ] Add Sentry DSN to environment
  - [ ] Test error reporting

- [ ] **Analytics Setup**
  - [ ] Configure Plausible (or Google Analytics)
  - [ ] Add tracking domain to environment
  - [ ] Verify tracking works
  - [ ] Set up goals/conversions

- [ ] **Uptime Monitoring**
  - [ ] Set up UptimeRobot (free tier)
  - [ ] Monitor production URL
  - [ ] Configure email alerts

- [ ] **Database Monitoring**
  - [ ] Check Vercel Postgres dashboard
  - [ ] Set up connection alerts
  - [ ] Verify backup schedule

---

### Phase 9: Final Preparations (1 day)

- [ ] **Email Configuration**
  - [ ] Verify sender domain in Resend
  - [ ] Update sender email in `/api/bespoke`
  - [ ] Test bespoke enquiry email
  - [ ] (Optional) Set up order confirmation emails

- [ ] **SEO Optimization**
  - [ ] Verify meta titles and descriptions
  - [ ] Check Open Graph images
  - [ ] Submit sitemap to Google Search Console
  - [ ] Verify robots.txt

- [ ] **Security Review**
  - [ ] All API keys in environment variables (not code)
  - [ ] HTTPS enforced
  - [ ] Rate limiting considered
  - [ ] CORS properly configured
  - [ ] Input validation on all endpoints

- [ ] **Documentation**
  - [ ] Update README with production URL
  - [ ] Document any custom configurations
  - [ ] Create runbook for common issues
  - [ ] Train team on CMS usage

---

### Phase 10: Go-Live Preparation

- [ ] **Backup & Rollback Plan**
  - [ ] Document rollback procedure
  - [ ] Verify database backup schedule
  - [ ] Test restore process (staging)

- [ ] **Support Setup**
  - [ ] Customer support email configured
  - [ ] FAQ page created
  - [ ] Returns process documented
  - [ ] Shipping info added

- [ ] **Marketing Ready**
  - [ ] Social media accounts ready
  - [ ] Email list prepared (if applicable)
  - [ ] Launch announcement draft
  - [ ] PR plan (if applicable)

- [ ] **Domain & DNS**
  - [ ] Custom domain configured in Vercel
  - [ ] DNS records updated
  - [ ] SSL certificate active
  - [ ] WWW redirect configured

---

## 🎉 Launch Day

- [ ] **Final Verification** (30 min before)
  - [ ] All systems operational
  - [ ] Test checkout one more time
  - [ ] Monitor error logs
  - [ ] Team on standby

- [ ] **Go Live**
  - [ ] Make announcement
  - [ ] Monitor closely for first hour
  - [ ] Check for any errors
  - [ ] Verify orders processing correctly

- [ ] **First Day Monitoring**
  - [ ] Check analytics hourly
  - [ ] Monitor error rates
  - [ ] Watch database performance
  - [ ] Respond to any customer issues quickly

---

## 📊 Post-Launch (Week 1)

- [ ] **Daily Monitoring**
  - [ ] Check order volume
  - [ ] Review conversion rates
  - [ ] Monitor error logs
  - [ ] Customer feedback collection

- [ ] **Performance Review**
  - [ ] Page load times
  - [ ] API response times
  - [ ] Database query performance
  - [ ] Mobile vs desktop usage

- [ ] **User Feedback**
  - [ ] Collect customer feedback
  - [ ] Track common questions
  - [ ] Note usability issues
  - [ ] Plan improvements

---

## 🎯 Success Criteria

✅ **Launch Successful When:**
- All checklist items completed
- Zero critical errors
- Orders processing automatically
- Payments working correctly
- Mobile experience smooth
- Customer support ready
- Monitoring active

---

## 📞 Emergency Contacts

**Critical Issues:**
- Database down → Contact Vercel support
- Payments failing → Check Stripe dashboard
- Site down → Check Vercel deployment status
- Security issue → Immediate rollback

**Support Resources:**
- [Vercel Status](https://www.vercel-status.com)
- [Stripe Status](https://status.stripe.com)
- [Backend Setup Guide](./docs/BACKEND_SETUP.md)
- [API Documentation](./docs/API_REFERENCE.md)

---

**Start Date:** _______________
**Target Launch:** _______________
**Actual Launch:** _______________

---

*Print this checklist and check items off as you complete them!*
