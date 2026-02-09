'use client'

import React from 'react'
import { Logo } from './Logo'
import { useAccount, useDisconnect } from 'wagmi'

export function Navbar() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <nav className="flex items-center justify-between p-4 border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <Logo />
      
      <div className="flex items-center gap-4">
        {isConnected ? (
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-gray-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
              {truncateAddress(address!)}
            </span>
            <button 
              onClick={() => disconnect()}
              className="text-xs uppercase tracking-wider font-bold text-red-500 hover:text-red-400 transition-colors"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button 
            className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
            onClick={() => {/* WalletConnect trigger */}}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  )
}
