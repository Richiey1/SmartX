"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

export default function VaultManagementPage() {
  const params = useParams();
  const address = params.address as string;
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-dark dark:text-neutral-text">Vault Management</h1>
        <p className="text-neutral-muted font-mono mt-2">{address}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <p className="text-sm text-neutral-muted mb-1">Total Assets</p>
          <p className="text-2xl font-bold">1,250.00 USDC</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-muted mb-1">Your Shares</p>
          <p className="text-2xl font-bold">1,250.00 vUSDC</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-muted mb-1">Current APY</p>
          <p className="text-2xl font-bold text-primary">8.5%</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex gap-4 border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">
              <button
                onClick={() => setActiveTab('deposit')}
                className={`text-lg font-medium pb-1 ${
                  activeTab === 'deposit' 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-neutral-muted hover:text-neutral-dark'
                }`}
              >
                Deposit
              </button>
              <button
                onClick={() => setActiveTab('withdraw')}
                className={`text-lg font-medium pb-1 ${
                  activeTab === 'withdraw' 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-neutral-muted hover:text-neutral-dark'
                }`}
              >
                Withdraw
              </button>
            </div>

            {activeTab === 'deposit' ? (
              <div className="space-y-4">
                <Input label="Amount to Deposit" placeholder="0.00" type="number" />
                <div className="flex justify-between text-sm text-neutral-muted">
                  <span>Balance: 5,000.00 USDC</span>
                  <button className="text-primary hover:underline">Max</button>
                </div>
                <Button className="w-full">Approve USDC</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Input label="Amount to Withdraw" placeholder="0.00" type="number" />
                <div className="flex justify-between text-sm text-neutral-muted">
                  <span>Available: 1,250.00 vUSDC</span>
                  <button className="text-primary hover:underline">Max</button>
                </div>
                <Button className="w-full" variant="outline">Withdraw Funds</Button>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="font-bold mb-4">Protocol Allocation</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Aave</span>
                <span className="font-medium">60%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Compound</span>
                <span className="font-medium">40%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-6">Manage Allocations</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
