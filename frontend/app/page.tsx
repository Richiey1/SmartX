'use client'

import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Shield, CreditCard, Landmark, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 pt-32 pb-20 text-center max-w-5xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-8 animate-pulse uppercase tracking-widest">
            <Shield className="w-3 h-3" /> Empowering the Gig Economy
          </div>
          <h1 className="text-5xl sm:text-8xl font-bold tracking-tight mb-8 leading-none">
            Your Income, <br />
            <span className="text-primary">Verified On-Chain.</span>
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            GigID provides on-chain income attestations and verifiable credentials, 
            allowing gig workers to prove earnings to lenders without revealing sensitive data.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto px-10 h-16 text-lg rounded-2xl shadow-2xl shadow-primary/20">
                Get Started
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-10 h-16 text-lg border-white/10 hover:bg-white/5 rounded-2xl">
                Learn More
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 max-w-7xl mx-auto mb-32">
          <h2 className="text-3xl font-bold text-center mb-16 uppercase tracking-widest text-gray-500">Core Capabilities</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-10 bg-white/5 border-white/10 hover:border-primary/30 transition-all rounded-3xl group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Landmark className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">On-Chain Attestations</h3>
              <p className="text-gray-400 leading-relaxed">
                Immutable record of your earnings from platforms like Uber, Upwork, and DoorDash, verified cryptographically.
              </p>
            </Card>
            <Card className="p-10 bg-white/5 border-white/10 hover:border-secondary/30 transition-all rounded-3xl group">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <CreditCard className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Income NFTs</h3>
              <p className="text-gray-400 leading-relaxed">
                Mint your income history into portable, soulbound NFTs that follow you across the global financial ecosystem.
              </p>
            </Card>
            <Card className="p-10 bg-white/5 border-white/10 hover:border-accent/30 transition-all rounded-3xl group">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Privacy First</h3>
              <p className="text-gray-400 leading-relaxed">
                Prove you earn "more than $50k" without revealing your exact bank balance using selective disclosure.
              </p>
            </Card>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 px-6 border-y border-white/5 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
               <h2 className="text-4xl font-bold mb-4">How It Works</h2>
               <p className="text-gray-400">Join the thousands of workers taking control of their financial identity.</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-12">
               {[
                 { step: "01", title: "Connect", desc: "Link your web3 wallet and gig platforms." },
                 { step: "02", title: "Verify", desc: "Request attestations for your payment history." },
                 { step: "03", title: "Mint", desc: "Convert your proofs into an Income Credential NFT." },
                 { step: "04", title: "Share", desc: "Provide instant verification to lenders and banks." }
               ].map((item, i) => (
                 <div key={i} className="relative">
                   <div className="text-6xl font-black text-white/5 absolute -top-10 -left-4 select-none">{item.step}</div>
                   <h4 className="text-xl font-bold mb-3 relative z-10">{item.title}</h4>
                   <p className="text-gray-500 relative z-10">{item.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="p-16 text-center text-gray-500 text-sm border-t border-white/5">
        <div className="flex justify-center gap-10 mb-10">
          <a href="#" className="hover:text-primary transition-colors uppercase tracking-widest font-bold text-[10px]">Documentation</a>
          <a href="#" className="hover:text-primary transition-colors uppercase tracking-widest font-bold text-[10px]">Registry</a>
          <a href="#" className="hover:text-primary transition-colors uppercase tracking-widest font-bold text-[10px]">Privacy Policy</a>
        </div>
        <p>&copy; 2026 GigID Protocol. Built on Base Mainnet.</p>
      </footer>
    </div>
  );
}
