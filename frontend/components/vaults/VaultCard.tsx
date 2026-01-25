import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useRouter } from 'next/navigation';

interface VaultCardProps {
  address: string;
  name: string;
  totalAssets: string;
  apy: string;
  allocations: { protocol: string; percentage: number }[];
}

export const VaultCard: React.FC<VaultCardProps> = ({
  address,
  name,
  totalAssets,
  apy,
  allocations,
}) => {
  const router = useRouter();

  return (
    <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-neutral-dark dark:text-neutral-text group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-sm text-neutral-muted font-mono">{address.slice(0, 6)}...{address.slice(-4)}</p>
        </div>
        <div className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-semibold">
          {apy}% APY
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-neutral-muted mb-1">Total Assets</p>
          <p className="text-2xl font-bold text-neutral-dark dark:text-neutral-text">{totalAssets} USDC</p>
        </div>

        <div>
          <p className="text-sm text-neutral-muted mb-2">Allocations</p>
          <div className="flex gap-1 h-2 rounded-full overflow-hidden">
            {allocations.map((alloc) => (
              <div
                key={alloc.protocol}
                style={{ width: `${alloc.percentage}%` }}
                className={`h-full ${
                  alloc.protocol === 'Aave' ? 'bg-purple-500' :
                  alloc.protocol === 'Compound' ? 'bg-green-500' :
                  'bg-pink-500'
                }`}
                title={`${alloc.protocol}: ${alloc.percentage}%`}
              />
            ))}
          </div>
          <div className="flex gap-4 mt-2 text-xs text-neutral-muted">
            {allocations.map((alloc) => (
              <span key={alloc.protocol} className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${
                  alloc.protocol === 'Aave' ? 'bg-purple-500' :
                  alloc.protocol === 'Compound' ? 'bg-green-500' :
                  'bg-pink-500'
                }`} />
                {alloc.protocol}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4 flex gap-2">
          <Button 
            className="flex-1" 
            variant="outline" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/vaults/${address}`);
            }}
          >
            Manage
          </Button>
          <Button 
            className="flex-1" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/vaults/${address}?action=deposit`);
            }}
          >
            Deposit
          </Button>
        </div>
      </div>
    </Card>
  );
};
