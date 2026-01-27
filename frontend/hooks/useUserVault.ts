import { useReadContract, useWriteContract } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';

// Minimal ERC-4626 ABI
const VAULT_ABI = [
  {
    name: 'deposit',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'assets', type: 'uint256' }, { name: 'receiver', type: 'address' }],
    outputs: [{ name: 'shares', type: 'uint256' }],
  },
  {
    name: 'withdraw',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'assets', type: 'uint256' }, { name: 'receiver', type: 'address' }, { name: 'owner', type: 'address' }],
    outputs: [{ name: 'shares', type: 'uint256' }],
  },
  {
    name: 'totalAssets',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

export function useUserVault(vaultAddress: `0x${string}`) {
  const { writeContract, isPending } = useWriteContract();

  const { data: totalAssets } = useReadContract({
    address: vaultAddress,
    abi: VAULT_ABI,
    functionName: 'totalAssets',
  });

  const deposit = (amount: string, receiver: `0x${string}`) => {
    writeContract({
      address: vaultAddress,
      abi: VAULT_ABI,
      functionName: 'deposit',
      args: [parseUnits(amount, 6), receiver], // Assuming USDC (6 decimals)
    });
  };

  const withdraw = (amount: string, receiver: `0x${string}`, owner: `0x${string}`) => {
    writeContract({
      address: vaultAddress,
      abi: VAULT_ABI,
      functionName: 'withdraw',
      args: [parseUnits(amount, 6), receiver, owner],
    });
  };

  return {
    totalAssets: totalAssets ? formatUnits(totalAssets, 6) : '0',
    deposit,
    withdraw,
    isPending,
  };
}
