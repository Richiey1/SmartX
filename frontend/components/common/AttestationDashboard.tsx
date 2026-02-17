'use client'

import React from 'react'
import { Card } from '@/components/ui/Card'
import { CheckCircle2, Clock, ShieldCheck, ExternalLink, Filter, Search } from 'lucide-react'

// Mock data for initial implementation
const attestations = [
  {
    id: '0x123...456',
    platform: 'Uber',
    amount: '$2,450.00',
    date: 'Oct 24, 2025',
    status: 'verified',
    type: 'Monthly Earnings'
  },
  {
    id: '0x789...012',
    platform: 'Upwork',
    amount: '$1,200.00',
    date: 'Oct 20, 2025',
    status: 'pending',
    type: 'Project Payout'
  },
  {
    id: '0x345...678',
    platform: 'DoorDash',
    amount: '$850.00',
    date: 'Oct 15, 2025',
    status: 'verified',
    type: 'Weekly Earnings'
  }
]

export function AttestationDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Attestation Ledger</h2>
          <p className="text-gray-400">View and manage your on-chain income credentials.</p>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search ID..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
          <button className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
            <Filter className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {attestations.map((item, i) => (
          <Card key={i} className="p-6 bg-white/5 border-white/10 hover:border-primary/20 transition-all group rounded-3xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${item.status === 'verified' ? 'bg-green-500/10' : 'bg-orange-500/10'}`}>
                  {item.status === 'verified' ? (
                    <ShieldCheck className="w-6 h-6 text-green-500" />
                  ) : (
                    <Clock className="w-6 h-6 text-orange-500" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-lg">{item.platform}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      item.status === 'verified' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{item.type} • {item.date}</p>
                </div>
              </div>

              <div className="flex items-center justify-between w-full md:w-auto gap-12">
                <div className="text-right">
                  <p className="text-xl font-bold text-white">{item.amount}</p>
                  <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">{item.id}</p>
                </div>
                <button className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all group-hover:shadow-lg group-hover:shadow-primary/10">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
