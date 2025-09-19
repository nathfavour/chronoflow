"use client";

import { UnifiedTopbar } from "@/newui/components/UnifiedTopbar";
import { StreamAnalytics } from "@/newui/components/StreamAnalytics";
import { useRouter } from "next/navigation";

export default function AnalyticsPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/dashboard");
  };

  const handlePageChange = (page: string) => {
    router.push(`/${page}`);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <UnifiedTopbar
        currentPage="analytics"
        onPageChange={handlePageChange}
        onBack={handleBack}
      />

      <main className="flex-1">
        <StreamAnalytics onBack={handleBack} />
      </main>
    </div>
  );
}