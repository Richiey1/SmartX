'use client'

import React from 'react'
import { Card } from '@/components/ui/Card'
import { ShieldCheck, ShieldAlert, BadgeCheck, FileText, Share2, Download } from 'lucide-react'

// Mock data for initial implementation
const credentials = [
  {
    id: 'CID-2025-001',
    category: 'Annual Income 2024',
    amount: '$28,450.00',
    date: 'Jan 15, 2025',
    type: 'Comprehensive Proof',
    score: 'A+'
  },
  {
    id: 'CID-2024-042',
    category: 'Q4 Uber Earnings',
    amount: '$8,200.00',
    date: 'Dec 05, 2024',
    type: 'Periodic Attestation',
    score: 'B'
  }
]

export function CredentialNFTs() {
  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Income Credentials</h2>
          <p className="text-gray-400">Mint and share your soulbound income NFTs.</p>
        </div>
        
        <button className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold hover:opacity-90 transition-all flex items-center gap-2">
          <BadgeCheck className="w-5 h-5" />
          Mint New Credential
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {credentials.map((nft, i) => (
          <Card key={i} className="p-0 overflow-hidden bg-white/5 border-white/10 rounded-[2.5rem] group hover:border-primary/30 transition-all">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div className="p-4 rounded-3xl bg-primary/10 border border-primary/20">
                   <ShieldCheck className="w-8 h-8 text-primary" />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Status</span>
                  <span className="text-xs font-bold text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">SOULBOUND</span>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{nft.category}</h3>
                <p className="text-sm text-gray-500">{nft.type}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-6 border-y border-white/5">
                <div>
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Verified Amount</p>
                  <p className="text-xl font-bold text-white">{nft.amount}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Trust Score</p>
                  <p className="text-xl font-bold text-primary">{nft.score}</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="font-mono text-[9px] text-gray-600 uppercase tracking-tighter">
                  ID: {nft.id}
                </div>
                <div className="flex gap-2">
                   <button className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                    <Share2 className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                    <Download className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="p-8 bg-orange-500/5 border border-orange-500/20 rounded-[2.5rem] flex gap-6 items-start">
        <div className="p-4 bg-orange-500/10 rounded-3xl shrink-0">
          <ShieldAlert className="w-6 h-6 text-orange-500" />
        </div>
        <div>
          <h4 className="font-bold text-orange-200 mb-1">Soulbound Token Warning</h4>
          <p className="text-xs text-orange-500/60 leading-relaxed">
            GigID Credential NFTs are strictly non-transferable. They are permanently linked to your wallet address to preserve the integrity of your financial reputation.
          </p>
        </div>
      </div>
    </div>
  )
}
