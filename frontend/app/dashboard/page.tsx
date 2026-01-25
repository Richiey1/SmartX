"use client";

import React from 'react';
import { VaultCard } from '../../components/vaults/VaultCard';
import { Button } from '../../components/ui/Button';
import { useRouter } from 'next/navigation';

// Mock data for initial development
const MOCK_VAULTS = [
  {
    address: '0x71C95911E9a5D330f4D621842EC243EE14721085',
    name: 'Stable Yield Alpha',
    totalAssets: '12,450.00',
    apy: '8.5',
    allocations: [
      { protocol: 'Aave', percentage: 60 },
      { protocol: 'Compound', percentage: 40 },
    ],
  },
  {
    address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    name: 'Degen Strategy',
    totalAssets: '3,200.00',
    apy: '14.2',
    allocations: [
      { protocol: 'Aave', percentage: 20 },
      { protocol: 'Uniswap', percentage: 80 },
    ],
  },
];

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-dark dark:text-neutral-text">Dashboard</h1>
          <p className="text-neutral-muted mt-1">Manage your active vaults and track performance.</p>
        </div>
        <Button onClick={() => router.push('/create')}>
          + Create New Vault
        </Button>
      </div>

      {MOCK_VAULTS.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_VAULTS.map((vault) => (
            <VaultCard key={vault.address} {...vault} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-neutral-card rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          <h3 className="text-xl font-medium text-neutral-dark dark:text-neutral-text mb-2">No Vaults Found</h3>
          <p className="text-neutral-muted mb-6">You haven't created any yield strategies yet.</p>
          <Button onClick={() => router.push('/create')}>Create Your First Vault</Button>
        </div>
      )}
    </div>
  );
}
