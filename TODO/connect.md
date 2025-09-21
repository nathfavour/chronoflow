# Wallet Connection Consolidation (ConnectButton)

## Overview / Goals
Unify all wallet connection entry points behind a single `ConnectButton` component that:
- Initiates wallet connection
- Detects Somnia chain (ID 1868) vs. current chain
- Offers seamless network switch with user prompt handling
- Shows contextual status (connecting, switching, wrong network, connected)
- Minimizes duplicated UI/state logic across navigation, onboarding, settings, etc.

## Architecture
`ConnectButton` consumes web3 context (from `src/web3/context.tsx`) which now provides:
- `isConnected`, `address`, `isConnecting`
- `isCorrectNetwork` (Somnia vs. current)
- `isSwitchingNetwork`, `switchToSomnia()`
- Connection action `connect()`

Button label logic hierarchy:
1. Connecting state => `Connecting...`
2. Switching network => `Switching...`
3. Wrong network => `Switch Network`
4. Connected (future: show shortened address / status badge)
5. Default => `Connect Wallet`

Visual badge (currently simple) can be extended to show network, address or balance.

## Completed Changes
- Added Somnia chain enforcement & switch helper in `web3/context.tsx`
- Refactored `ConnectButton` to handle network mismatch & switch action
- Replaced legacy/placeholder buttons in:
  - `Navbar` (desktop + mobile)
  - `AnimatedNavbar` (desktop + mobile menu)
  - `UnifiedTopbar` (previous session)
  - `OnboardingFlow` final "getting-started" step card
  - `Settings` account-required notice
- Audit verified only remaining "Connect Wallet" literals are:
  - Static headings / labels inside content (not interactive buttons)
  - Comment markers
  - Internal default label inside `ConnectButton`

## Pending (None Required for MVP)
All targeted placeholder replacements are complete.

## Potential Future Enhancements
- Address display with ENS / truncation once connected
- Dropdown menu (copy address, disconnect, view explorer, switch network)
- Network badge with chain icon & status
- Balance preview (native + selected ERC-20) with caching
- Multi-wallet support / recently used wallet memory
- Toast notifications for connection errors & network switch failures
- Analytics events (connect attempt, success, switch network, failure reasons)
- Skeleton / shimmer state while eagerly validating existing session
- Accessibility: ARIA live region for status text

## Testing & Verification Notes
Manual checks to perform (suggested):
1. Initial load (disconnected): Button shows `Connect Wallet`.
2. Click connect: Shows `Connecting...` then either `Switch Network` (if wrong chain) or connected state.
3. On wrong network: Button offers `Switch Network`; click triggers `Switching...` then connected.
4. Network switch rejection: Should revert to `Switch Network` state gracefully.
5. Mobile menus (Navbar / AnimatedNavbar) show consistent sizing & alignment.

## Follow-Ups Outside Scope
- Implement actual wallet connector integration (currently assumed context logic)
- Add unit tests around label state machine (if test infra available)
- Centralize style variants if more button states emerge

## Ownership / Maintenance
Future network logic changes isolated to `web3/context.tsx`; UI labeling & presentation localized in `ConnectButton`.

---
Status: COMPLETE
