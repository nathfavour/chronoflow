# Wallet Integration & On-Chain Interaction Blueprint

> Status: Draft (v1) — Use this as the canonical guide for implementing a robust, extensible wallet + transaction layer powering all ChronoFlow dApp flows.
>
> Goal: Move from a minimal single injected provider usage (current) to a production‑grade, multi‑connector, resilient, observable, and user‑friendly Web3 interaction stack.

---
## 0. Immediate TODO Snapshot (Aggregated)
(Imported & expanded from prior session; re-ordered logically.)

### Phase 1 – Core Wallet & State
1. [ ] Multi‑wallet connector abstraction (Injected, WalletConnect, CoinbaseWallet placeholder)  
2. [ ] Provider detection + prioritization (EIP‑6963 when available)  
3. [ ] Connection modal / lightweight selector UI  
4. [ ] Persist last connector + auto‑reconnect (localStorage)  
5. [ ] Chain/network check + mismatch UI (Somnia chain id gating)  
6. [ ] Account & chain change listeners (EIP‑1193)  
7. [ ] Structured error mapping layer (typed codes → user messages)  
8. [ ] Basic Tx queue (FIFO) + global status store  
9. [ ] Uniform signature / tx cancel handling

### Phase 2 – Token Allowances / Streams
10. [ ] ERC20 allowance fetch (lazy + cached)  
11. [ ] ensureAllowance(token, requiredAmount) helper  
12. [ ] Approval transaction flow (Approve → Wait → Continue)  
13. [ ] Create Stream flow gating on allowance  
14. [ ] Allowance invalidation on account / chain / token change  
15. [ ] Human readable & precise amount conversions (already partial) — harden & test edge cases

### Phase 3 – NFT (Stream NFT) Approvals / Marketplace
16. [ ] NFT ownership check before listing (ownerOf)  
17. [ ] isApprovedForAll / per‑token getApproved strategy  
18. [ ] ensureNftApproval(marketplace) helper  
19. [ ] Listing creation gating on approval & ownership  
20. [ ] Error surface for unowned token / stale UI tokenId

### Phase 4 – Listings & Stream Data Reads
21. [ ] getListing(tokenId) read wrapper  
22. [ ] fetchListings(batchRange or event backfill)  
23. [ ] Event subscription (Listed / Sold / Unlisted) to live update  
24. [ ] getStream(streamId) + derived real‑time streamable balance  
25. [ ] Replace mock marketplace array with reactive listing store (fallback to mock if read fails)  
26. [ ] Skeleton & empty states for marketplace

### Phase 5 – UX Enhancements
27. [ ] Explorer links (hash, address, tokenId, streamId)  
28. [ ] Distinct button loading states (action‑scoped pending)  
29. [ ] Toast harmonization (pending / mined / error patterns)  
30. [ ] Inline form validation (address checksum, numeric ranges)  
31. [ ] Gas estimation preview + user abort option  
32. [ ] Transaction cost summary (value + estimated gas * price)

### Phase 6 – Reliability & Observability
33. [ ] Retry policy (idempotent reads) w/ backoff  
34. [ ] Heartbeat RPC latency gauge (degrades UI if high)  
35. [ ] Metrics hooks (count tx success / fail) – optional internal  
36. [ ] Graceful degraded mode (read-only if write provider absent)  
37. [ ] Structured logging toggle (DEV only)  
38. [ ] Internal diagnostic panel (current connector, chain, queue)  
39. [ ] Fallback RPCs list & rotation on failure

### Phase 7 – Cleanup & Polish
40. [ ] Remove unused imports (carryover task)  
41. [ ] Type tighten public context interfaces (narrow any)  
42. [ ] JSDoc for exported helpers  
43. [ ] Security review pass  
44. [ ] Final QA script

---
## 1. Current State Summary
- Single `connect()` using `window.ethereum` (no multi‑connector, no persistence).  
- No chain id validation; assumes correct network.  
- No allowance / NFT approval gating (transactions can revert).  
- Single tx status (`tx`) — no queue, last tx overwrites previous state.  
- Core contract ABIs + simple sendTransaction logic in context.  
- Marketplace & Create Stream flows rely on blind success; errors surface only via thrown message.

---
## 2. Target Architecture Overview
Layered approach (bottom → top):
1. Transport & Providers: RPC public client(s), injected provider(s), WalletConnect relay (future), fallback list.  
2. Connectors: Uniform interface `{ id, name, icon, ready, connect(), disconnect(), onAccountsChanged, onChainChanged }`.  
3. Wallet Manager: Chooses active connector, maintains `WalletState`, persists preferences, auto‑reconnects.  
4. Chain Guard: Validates `chainId` == Somnia; surfaces mismatch & optional switch request (if supported).  
5. Contracts & Helpers: Factories (already present) + read/write wrappers (allowance, approvals, listings, streams).  
6. Transaction Orchestrator: Queue, send, observe receipts, emit lifecycle events.  
7. Domain Flows: createStream, listNFT, buyNFT augmented with pre‑flight checks.  
8. UI Hooks & Components: `useWallet()`, `useAllowances()`, `useListings()`, Connect Modal, Action buttons.  
9. UX Feedback: Toasts, inline errors, skeleton loaders, explorer links.  
10. Diagnostics: Dev panel, structured logs.

---
## 3. State & Type Model (Core Interfaces)
```ts
interface WalletState {
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  address?: `0x${string}`;
  chainId?: number;
  connectorId?: string; // e.g. 'injected', 'walletconnect'
  errorCode?: WalletErrorCode;
  errorMessage?: string;
}

interface TxRecord {
  id: string; // uuid
  hash?: Hash;
  status: 'idle' | 'pending' | 'mined' | 'failed';
  createdAt: number;
  updatedAt: number;
  action?: string; // e.g. 'createStream'
  meta?: Record<string, any>;
  errorMessage?: string;
}

interface AllowanceState {
  token: string; // symbol
  spender: `0x${string}`;
  value: bigint;
  lastFetched: number;
  loading: boolean;
  error?: string;
}

interface Listing {
  tokenId: bigint;
  seller: `0x${string}`;
  price: bigint;
  loading?: boolean;
  error?: string;
}
```

---
## 4. Connectors Abstraction
```ts
interface WalletConnector {
  id: string;
  name: string;
  ready(): boolean; // available in environment
  connect(): Promise<{ accounts: string[]; chainId: number }>;
  disconnect(): Promise<void>;
  onAccountsChanged?(cb: (accounts: string[]) => void): void;
  onChainChanged?(cb: (chainId: number) => void): void;
  request<T = any>(args: { method: string; params?: any[] | object }): Promise<T>;
}
```
- InjectedConnector: wraps `window.ethereum` (multi-provider aware: EIP‑6963 discovery when possible).  
- WalletConnectConnector: deferred (scaffold interface + TODO for package integration).  
- (Optional) Coinbase / Phantom placeholders for later.

---
## 5. Transaction Orchestrator
Responsibilities: 
- Accept high-level `enqueue({ to, data, value, label })`.  
- Emit lifecycle events (`onUpdate(txRecord)`).  
- Serialize send operations (or support limited parallelism with dependencies).  
- Auto wait for receipt & update status; capture revert reasons where possible.  
- Provide `useTxQueue()` hook returning list + convenience helpers.  
- Backoff strategy for receipt polling (viem already handles waiting; augment with timeout fallback).  
- Explorer link generation: `https://explorer.somnia.network/tx/${hash}` (placeholder; confirm actual URL).

---
## 6. Pre-Flight Validation Matrix
| Flow | Checks | Blocking? | Recovery |
|------|--------|-----------|----------|
| createStream | wallet connected, chain ok, recipient address valid, time ordering, amount > 0, token known, allowance >= deposit | YES | Offer Approve, fix inputs |
| listNFT | wallet connected, ownerOf(tokenId) == user, marketplace approval set, not already listed | YES | Prompt Approve / refresh ownership |
| buyNFT | wallet connected, listing exists, value == price, not seller, chain ok | YES | Refresh listing / abort |
| withdrawFromStream (future) | wallet connected, stream exists, user is recipient/payer authorized, amount <= streamable | YES | Show available amount |

---
## 7. Allowance Strategy
- Cache key: `${chainId}:${tokenAddress}:${owner}:${spender}`.  
- Lazy fetch on demand (when opening Create Stream form or token changed).  
- Invalidate on: account change, chain change, approval tx mined, 10 min stale timer.  
- Helper `ensureAllowance(symbol, required: bigint, spender)`:
  1. Fetch current allowance.  
  2. If >= required → return.  
  3. Prompt user with Approve modal (suggest exact required or MAX strategy).  
  4. Send approve(tx).  
  5. Await mined, refetch allowance, continue.  
- Gas: show estimate (approve can be cheaper with exact vs max).  
- Prevent duplicate concurrent approve for same (token, spender) pair.

---
## 8. NFT Approval Strategy
- Prefer `setApprovalForAll(marketplace, true)` for streamlined listing (one-time).  
- For single token listing w/o global approval (optional path): call `approve(marketplace, tokenId)`.  
- Check order: isApprovedForAll → if false, (optional) check getApproved(tokenId) for single listing flow.  
- Provide explicit UI choices: [Approve Collection] or [Approve This Token].  
- Invalidate approval status on account / chain change + after approval tx.

---
## 9. Listings Data Model & Sync
Approaches:
1. Direct per-token reads on demand (cheap for sparse queries).  
2. Event backfill: scan from deployment block for Listed / Sold / Unlisted -> reconstruct state.  
3. Hybrid: start with per-token reads for user-entered tokenId + optional lazy event hydration.  

Initial MVP path: implement `getListing(tokenId)` reading `listings[tokenId]` mapping; treat seller=0 as unlisted.  
Enhancement: add event subscription (publicClient.watchEvent) to update reactive store.

---
## 10. Stream Data Reads
- `getStream(streamId)` read `streams[streamId]`.  
- Derive real-time withdrawable amount: `elapsed * deposit / duration - withdrawnAmount` (bounded).  
- Provide hook `useStream(streamId)` with interval tick (e.g., per second) or requestAnimationFrame for smooth UI (throttle on tab hidden).  
- Future: expose withdraw action.

---
## 11. Error Handling & Codes
Define `WalletErrorCode`: 
```
'NO_PROVIDER' | 'USER_REJECTED' | 'CHAIN_MISMATCH' | 'RPC_ERROR' | 'INVALID_INPUT' |
'INSUFFICIENT_ALLOWANCE' | 'NOT_OWNER' | 'ALREADY_LISTED' | 'LISTING_NOT_FOUND' |
'NETWORK_FAILURE' | 'TX_FAILED' | 'INTERNAL'
```
Mapping layer: unify raw provider error messages → normalized structure: `{ code, message, details? }`.  
User messages: friendly, actionable.  
Log (DEV): full stack / raw JSON.

---
## 12. Persistence & Storage
- `localStorage.wallet.lastConnector` (string)  
- `localStorage.wallet.autoReconnect = '1'`  
- Optional: persist known allowances (bounded TTL) for faster warm start.  
- Upon load: attempt auto connect (soft — do not block UI rendering).

---
## 13. Security & Validation
- Address checksum validation before submission.  
- Reject ENS (unless/when ENS resolution added).  
- Chain guard to prevent silent wrong-network tx (show Clear / Switch UI).  
- Sanitize numeric inputs (regex + BigInt safe boundaries).  
- Avoid approving unlimited allowances by default—explain tradeoff if offering MAX.  
- Harden against race (double submit) using button disable + per-action mutex.  
- Do not store private keys / secrets.  
- Provide disclaimers for experimental network.

---
## 14. Developer Ergonomics
Exports from `useWeb3()` (final target):
```ts
{
  wallet: WalletState;
  connect(connectorId?: string): Promise<void>;
  disconnect(): Promise<void>;
  connectors: { id: string; name: string; ready: boolean }[];
  ensureAllowance(symbol: string, amount: bigint, spender?: Address): Promise<void>;
  ensureNftApproval(opts?: { mode?: 'collection' | 'single'; tokenId?: bigint }): Promise<void>;
  getListing(tokenId: bigint): Promise<Listing | null>;
  fetchListings(tokenIds: bigint[]): Promise<Listing[]>;
  watchListings(): UnsubscribeFn; // events
  getStream(streamId: bigint): Promise<Stream | null>;
  useTxQueue(): { records: TxRecord[]; byId(id): TxRecord | undefined };
  enqueueTx(labeledCall: { to: Address; data: Hex; valueWei?: bigint; label?: string }): Promise<Hash>;
  // convenience high-level flows
  createStream(args: CreateStreamInput): Promise<{ streamId: bigint }>;
  listNFT(tokenId: bigint, priceWei: bigint): Promise<void>;
  buyNFT(tokenId: bigint, valueWei: bigint): Promise<void>;
}
```

---
## 15. UI Components Additions
- `<ConnectButton />`: shows (Connect | Address Short | Wrong Network).  
- `<WalletModal />`: list connectors, status indicators, explanatory help.  
- `<TxCenter />`: accordion / panel listing recent tx with statuses & explorer links.  
- `<ApproveTokenBanner />`: appears contextually when allowance insufficient.  
- `<ApprovalPrompt />`: for NFT approvals.  
- `<ListingStatus />`: per-token fetch & display (spinner → listed / not listed).  
- Form integration: disable submit until pre-flight passes.

---
## 16. Gas & Cost Feedback
Workflow for write operations: 
1. Build call data.  
2. `publicClient.estimateGas({ to, data, value })`.  
3. Fetch fee data (if EIP‑1559 supported).  
4. Display estimated total (convert to token where appropriate).  
5. Allow user to abort or proceed.  
6. On proceed, enqueue transaction.

---
## 17. Stepwise Implementation Plan (Phased)
### Phase 1 (Foundation)
- Introduce connectors abstraction & wallet manager into context (backward compatible).  
- Add event listeners & persistence.  
- Replace single `address` with `wallet` object; keep legacy exports temporarily.  
- Implement connection modal + basic ConnectButton.  
- Introduce basic Tx queue storing just pending & mined statuses.

### Phase 2 (Allowances)
- Add allowance cache + ensureAllowance.  
- Integrate into Create Stream flow (pre-flight).  
- Add Approve banner + toast pattern.

### Phase 3 (NFT Approvals)
- Add ensureNftApproval.  
- Integrate into listing UX (pre-flight gating).  
- Provide user choice collection vs single token.

### Phase 4 (Listings & Streams)
- Implement getListing + reactive listings store.  
- Replace mocks progressively.  
- Add getStream & useStream hook (used in analytics / dashboards).  
- Event subscriptions for live updates.

### Phase 5 (UX Polishing)
- Action-scoped loaders, explorer links, gas estimate pre-modals.  
- Inline validation & improved toast messaging.  
- Diagnostics panel (DEV only toggle).

### Phase 6 (Reliability)
- Retry wrapper for transient RPC errors.  
- Fallback RPC rotation.  
- Structured logging & metrics stubs.  
- Queue enhancements (cancellation detection, replacement).  

### Phase 7 (Final Polish)
- Remove deprecated fields.  
- Documentation & JSDoc.  
- QA script execution & signoff.

---
## 18. Error & Toast Patterns (Standardized)
| Phase | Toast Sequence |
|-------|----------------|
| Pre-flight fail | Inline error, no toast unless global issue |
| Approve token | pending: "Approving TOKEN…" → success: "TOKEN approved" → error: mapped message |
| Create stream | pending: "Creating stream…" → success: "Stream #ID created" |
| List NFT | pending: "Listing NFT #ID…" → success: "NFT #ID listed" |
| Buy NFT | pending: "Buying NFT #ID…" → success: "Purchased NFT #ID" |

Errors map to: USER_REJECTED, TX_FAILED, CHAIN_MISMATCH, INSUFFICIENT_ALLOWANCE, etc.

---
## 19. Testing Strategy
- Unit: amount parsing, allowance logic, approval gating, queue state transitions.  
- Integration (mock provider): connect → approve → create stream.  
- Manual scripts: network mismatch simulation, account switch mid-flow, rapid sequential tx.  
- Regression: listing events propagate correctly.  
- Edge: zero allowance, exact allowance, large decimals, token not in registry, tokenId unowned.

---
## 20. Rollout & Risk Mitigation
- Feature flags: `WALLET_V2_ENABLED`, `ALLOWANCE_ENABLED` to ship incrementally.  
- Maintain backward compatibility for one release (legacy `address` and `tx`).  
- Incremental PRs per phase; each PR includes docs snippet & tests where possible.  
- Add fallback to legacy simple flow if connector initialization fails.

---
## 21. Open Questions / Follow-Ups
1. Confirm Somnia chainId & explorer base URL.  
2. Should we support multiple simultaneous accounts? (Likely no, scope creep.)  
3. Strategy for large listing sets (pagination vs event index).  
4. Permit unlimited allowances UI? require explicit override.  
5. Add analytics on tx success/failure?  
6. Gas sponsorship / meta-transactions (future?).

---
## 22. Implementation Next Action (Immediate)
Proceed with Phase 1: add connectors abstraction & wallet manager inside `src/web3/context.tsx` (non-breaking), create new components: `ConnectButton`, `WalletModal`, and introduce Tx queue structure. Then integrate allowance phase.

---
## 23. Quick Reference (Cheat Sheet)
- Ensure allowance: `await ensureAllowance('USDC', depositAmount, addresses.ChronoFlowCore)`  
- Ensure NFT approval: `await ensureNftApproval({ mode: 'collection' })`  
- Enqueue tx: `enqueueTx({ to, data, valueWei, label: 'createStream' })`  
- Subscribe tx queue: `const { records } = useTxQueue()`

---
## 24. Completion Definition
Wallet integration considered "robust" when:
- Multi-connector selection working & persists.  
- Chain mismatch detected & surfaced.  
- All flows (create stream, list, buy) block on required approvals/allowances gracefully.  
- No silent tx failures (all surfaced in queue + toast).  
- Listings & streams reflect on-chain changes within 3s (event or poll).  
- Diagnostics panel exposes state (DEV).  
- All tasks in Sections Phase 1–5 marked complete; Phase 6 partly optional for MVP.

---
End of blueprint.
