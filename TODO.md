# ChronoFlow Migration TODO

## Migration Structure & Analysis

### Current Issues with Existing Migration
- ❌ Using SPA approach instead of Next.js file-based routing 
- ❌ Sidebar shows on landing page (should only show on app pages)
- ❌ Bottom navigation shows on landing (should only show on mobile app pages)
- ❌ Landing page is incomplete - only has Hero, missing other sections
- ❌ No proper Next.js pages for /dashboard, /marketplace, /create, /settings
- ❌ Version-specific imports (e.g., sonner@2.0.3) need cleaning

### Original React App Structure (ignore1/figmamake_chronoflow)
**Main App Logic**: App.tsx
- Uses CleanHero for landing (not just Hero)
- Landing has NO sidebar/navigation (showSidebar logic)
- Complete landing includes: CleanHero + InteractiveStreamSimulator + Features + SocialProof + SecurityAudits
- App pages (dashboard/create/marketplace/settings) show UnifiedTopbar + AppNavigation
- Fullscreen pages (analytics/notifications) show only UnifiedTopbar
- Uses Enhanced* components for app functionality

**Key Components Missing from Current Migration**:
- CleanHero (complete landing experience)
- InteractiveStreamSimulator 
- SocialProofSection
- SecurityAuditsSection
- SomniaNetworkBadge
- Proper page routing logic

## Migration Tasks

### Phase 1: Fix File-Based Routing Structure
- [ ] Remove SpaApp.tsx (wrong approach)
- [ ] Create Next.js app pages:
  - [ ] `/` (landing) - src/app/page.tsx
  - [ ] `/dashboard` - src/app/dashboard/page.tsx  
  - [ ] `/marketplace` - src/app/marketplace/page.tsx
  - [ ] `/create` - src/app/create/page.tsx
  - [ ] `/settings` - src/app/settings/page.tsx
  - [ ] `/analytics` - src/app/analytics/page.tsx (fullscreen)
  - [ ] `/notifications` - src/app/notifications/page.tsx (fullscreen)

### Phase 2: Fix Landing Page
- [ ] Replace Hero with CleanHero in landing
- [ ] Add missing landing sections:
  - [ ] InteractiveStreamSimulator
  - [ ] SocialProofSection  
  - [ ] SecurityAuditsSection
  - [ ] SomniaNetworkBadge
- [ ] Ensure NO sidebar/navigation on landing
- [ ] Remove UnifiedTopbar from landing (or make it landing-specific)

### Phase 3: Fix App Pages Layout
- [ ] Create app layout component for dashboard/create/marketplace/settings pages
- [ ] Include UnifiedTopbar + AppNavigation for app pages
- [ ] Ensure sidebar shows on desktop, bottom nav on mobile
- [ ] Wire navigation between pages using Next.js router

### Phase 4: Fix Fullscreen Pages  
- [ ] Analytics page - only UnifiedTopbar, no sidebar
- [ ] Notifications page - only UnifiedTopbar, no sidebar
- [ ] Add back navigation functionality

### Phase 5: Clean Component Imports
- [ ] Fix all version-specific imports (sonner@2.0.3 → sonner)
- [ ] Fix motion/react imports → framer-motion
- [ ] Add missing "use client" directives
- [ ] Fix any missing components from ignore1 that aren't in newui

### Phase 6: Test & Verify
- [ ] Run TypeScript check
- [ ] Run Next.js build
- [ ] Test navigation between all pages
- [ ] Verify landing has complete content
- [ ] Verify app pages have proper navigation
- [ ] Verify fullscreen pages work correctly

## Component Status

### ✅ Already Migrated (in newui/components)
- EnhancedDashboard, EnhancedCreateStream, EnhancedMarketplace, EnhancedSettings
- UnifiedTopbar, AppNavigation, ThemeProvider, ToastProvider
- StreamAnalytics, NotificationCenter 
- UI components (button, card, etc.)

### ❌ Missing/Incomplete
- CleanHero (exists but may be incomplete)
- InteractiveStreamSimulator 
- SocialProofSection
- SecurityAuditsSection  
- SomniaNetworkBadge
- OnboardingFlow
- GlobalErrorBoundary

### 🔧 Needs Import Fixes
- All components using motion/react → framer-motion
- All components using sonner@2.0.3 → sonner
- Components missing "use client" directives

## Expected Final Structure
```
src/app/
├── page.tsx (landing - CleanHero + sections, NO nav)
├── dashboard/page.tsx (app layout + EnhancedDashboard)  
├── marketplace/page.tsx (app layout + EnhancedMarketplace)
├── create/page.tsx (app layout + EnhancedCreateStream)
├── settings/page.tsx (app layout + EnhancedSettings)
├── analytics/page.tsx (fullscreen + StreamAnalytics)
├── notifications/page.tsx (fullscreen + NotificationCenter)
└── layout.tsx (root layout - ThemeProvider + Toaster)
```

## Validation Criteria
- ✅ Landing page (`/`) shows complete CleanHero experience without navigation
- ✅ App pages show UnifiedTopbar + sidebar navigation  
- ✅ Mobile shows bottom navigation on app pages
- ✅ Fullscreen pages show only topbar
- ✅ All navigation works via Next.js routing
- ✅ No version-specific imports
- ✅ TypeScript builds successfully