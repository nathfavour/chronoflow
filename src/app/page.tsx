import Navbar from "@/newui/Navbar";
import Hero from "@/newui/Hero";
import { Dashboard } from "@/newui/components/Dashboard";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Navbar />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Hero />
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <Dashboard />
        </div>
      </main>
    </div>
  );
}
