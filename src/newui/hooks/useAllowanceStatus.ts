import { useState, useEffect, useCallback } from 'react';
import { encodeFunctionData } from 'viem';
import { getToken } from '@/web3/tokens';
import { addresses } from '@/web3/integrations';

// Minimal ABI subset for allowance checks (read-only)
const ERC20_ABI: any = [
  { type: 'function', stateMutability: 'view', name: 'allowance', inputs: [ { name: 'owner', type: 'address' }, { name: 'spender', type: 'address' } ], outputs: [ { name: '', type: 'uint256' } ] }
];

export type AllowanceState = 'idle' | 'checking' | 'ready' | 'insufficient' | 'unsupported' | 'error';

export interface AllowanceResult {
  status: AllowanceState;
  lastAllowance: bigint | null;
  requiredDeposit: bigint | null;
  refresh: () => void;
  preApprove: (opts: { symbol: string; amount: bigint; ensureAllowance: (symbol: string, spender: any, amount: bigint) => Promise<boolean | void>; onTxSuccess?: () => void; setPreApproving?: (v: boolean) => void; toastWrap: <T>(p: Promise<T>, msgs: { loading: string; success: (val: any) => string; error: (e: any) => string }) => any; }) => Promise<void>;
}

function toUnitsLocal(amount: string, decimals: number): bigint {
  const sanitized = amount.trim();
  if (!/^[0-9]*([.][0-9]*)?$/.test(sanitized)) return 0n;
  const [wholeRaw, fracRaw = ''] = sanitized.split('.');
  const whole = wholeRaw === '' ? '0' : wholeRaw;
  const fracPadded = (fracRaw + '0'.repeat(decimals)).slice(0, decimals);
  try {
    return BigInt(whole) * 10n ** BigInt(decimals) + BigInt(fracPadded || '0');
  } catch {
    return 0n;
  }
}

interface Params {
  address?: string | null;
  tokenSymbol: string;
  totalAmount: string;
}

export function useAllowanceStatus({ address, tokenSymbol, totalAmount }: Params): AllowanceResult {
  const [status, setStatus] = useState<AllowanceState>('idle');
  const [lastAllowance, setLastAllowance] = useState<bigint | null>(null);
  const [requiredDeposit, setRequiredDeposit] = useState<bigint | null>(null);
  const [nonce, setNonce] = useState(0);

  const refresh = useCallback(() => setNonce(n => n + 1), []);

  useEffect(() => {
    if (!address || !tokenSymbol || !totalAmount) {
      setStatus('idle');
      setLastAllowance(null);
      setRequiredDeposit(null);
      return;
    }
    if (parseFloat(totalAmount) <= 0) {
      setStatus('idle');
      return;
    }
    const token = getToken(tokenSymbol);
    if (!token) { setStatus('idle'); return; }
    if (token.symbol.toUpperCase() === 'ETH') {
      setStatus('unsupported');
      setLastAllowance(null);
      setRequiredDeposit(null);
      return;
    }

    let cancelled = false;
    setStatus('checking');
    const deposit = toUnitsLocal(totalAmount, token.decimals);
    setRequiredDeposit(deposit);
    const handle = setTimeout(async () => {
      try {
        const anyWindow: any = window;
        if (!anyWindow?.ethereum) throw new Error('No wallet');
        const data = encodeFunctionData({ abi: ERC20_ABI, functionName: 'allowance', args: [address, addresses.ChronoFlowCore] });
        const callParams: any = { to: token.address, data };
        const result: string = await anyWindow.ethereum.request({ method: 'eth_call', params: [callParams, 'latest'] });
        if (cancelled) return;
        const allowanceBn = BigInt(result);
        setLastAllowance(allowanceBn);
        setStatus(allowanceBn >= deposit ? 'ready' : 'insufficient');
      } catch (e) {
        if (cancelled) return;
        setStatus('error');
      }
    }, 400);

    return () => { cancelled = true; clearTimeout(handle); };
  }, [address, tokenSymbol, totalAmount, nonce]);

  const preApprove: AllowanceResult['preApprove'] = async ({ symbol, amount, ensureAllowance, onTxSuccess, setPreApproving, toastWrap }) => {
    if (!symbol || !amount) return;
    try {
      setPreApproving?.(true);
      await toastWrap(
        ensureAllowance(symbol, addresses.ChronoFlowCore, amount),
        {
          loading: 'Sending approval transaction...',
            success: (ok) => (ok ? 'Allowance updated' : 'Allowance unchanged'),
            error: (e) => e?.message || 'Approval failed'
        }
      );
      onTxSuccess?.();
      refresh(); // auto refresh after approval
    } finally {
      setPreApproving?.(false);
    }
  };

  return { status, lastAllowance, requiredDeposit, refresh, preApprove };
}
