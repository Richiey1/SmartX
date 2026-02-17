import { AttestationDashboard } from "@/components/common/AttestationDashboard";
import { Navbar } from "@/components/common/Navbar";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <AttestationDashboard />
      </main>
    </div>
  );
}
