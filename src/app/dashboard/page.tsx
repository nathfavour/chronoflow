"use client";

import { AppLayout } from "@/newui/components/AppLayout";
import { EnhancedDashboard } from "@/newui/components/EnhancedDashboard";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const handleViewAnalytics = () => {
    router.push("/analytics");
  };

  return (
    <AppLayout>
      <EnhancedDashboard onViewAnalytics={handleViewAnalytics} />
    </AppLayout>
  );
}