import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans">
      <header className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center max-w-7xl mx-auto w-full z-50 bg-background/80 backdrop-blur-sm">
        <Logo />
        <div className="flex gap-4">
          <Link href="/dashboard">
            <Button variant="primary">Launch App</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 pt-32">
        {/* Hero Section */}
        <section className="px-6 text-center max-w-5xl mx-auto mb-32">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-8 leading-tight">
            Automate your yield with <br />
            <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Intelligent Vaults</span>
          </h1>
          <p className="text-xl text-neutral-muted mb-12 max-w-2xl mx-auto leading-relaxed">
            Create personalized ERC-4626 vaults, deploy automated DeFi strategies, and maximize your returns on Base without the complexity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create">
              <Button size="lg" className="w-full sm:w-auto px-8">Create Vault</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8">View Dashboard</Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 max-w-7xl mx-auto mb-32">
          <h2 className="text-3xl font-bold text-center mb-16">Why SmartX?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 text-2xl">
                🔒
              </div>
              <h3 className="text-xl font-bold mb-3">Non-Custodial</h3>
              <p className="text-neutral-muted">
                You retain full control of your assets. Smart contracts handle the logic, but your keys remain yours.
              </p>
            </Card>
            <Card className="p-8 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-6 text-2xl">
                ⚡
              </div>
              <h3 className="text-xl font-bold mb-3">Automated Yield</h3>
              <p className="text-neutral-muted">
                Set protocol allocations once and let the vault optimize your yield across Aave, Compound, and more.
              </p>
            </Card>
            <Card className="p-8 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-6 text-2xl">
                ⛽
              </div>
              <h3 className="text-xl font-bold mb-3">Gas Optimized</h3>
              <p className="text-neutral-muted">
                Built on Base for lightning-fast transactions and minimal gas fees, maximizing your net returns.
              </p>
            </Card>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-neutral-card py-24 px-6 border-y border-gray-100 dark:border-gray-800">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-primary mb-2">$12M+</p>
              <p className="text-neutral-muted">TVL</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">4,500+</p>
              <p className="text-neutral-muted">Active Vaults</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">12%</p>
              <p className="text-neutral-muted">Avg. APY</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">$0.05</p>
              <p className="text-neutral-muted">Avg. Gas Cost</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="p-12 text-center text-neutral-muted text-sm border-t border-gray-100 dark:border-gray-800">
        <div className="flex justify-center gap-8 mb-8">
          <a href="#" className="hover:text-primary transition-colors">Docs</a>
          <a href="#" className="hover:text-primary transition-colors">Twitter</a>
          <a href="#" className="hover:text-primary transition-colors">Discord</a>
          <a href="#" className="hover:text-primary transition-colors">Github</a>
        </div>
        <p>&copy; 2026 SmartX Protocol. Built on Base.</p>
      </footer>
    </div>
  );
}
