'use client'

import React, { useState } from 'react'
import { AttestationDashboard } from "@/components/common/AttestationDashboard";
import { CredentialNFTs } from "@/components/common/CredentialNFTs";
import { Navbar } from "@/components/common/Navbar";
import { FileText, BadgeCheck } from 'lucide-react'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'attestations' | 'nfts'>('attestations')

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Dashboard Tabs */}
        <div className="flex gap-2 mb-12 bg-white/5 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('attestations')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'attestations' 
                ? 'bg-white/10 text-white shadow-lg shadow-black/50' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            Ledger
          </button>
          <button
            onClick={() => setActiveTab('nfts')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'nfts' 
                ? 'bg-white/10 text-white shadow-lg shadow-black/50' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <BadgeCheck className="w-4 h-4" />
            NFTs
          </button>
        </div>

        {activeTab === 'attestations' ? (
          <AttestationDashboard />
        ) : (
          <CredentialNFTs />
        )}
      </main>
    </div>
  );
}
