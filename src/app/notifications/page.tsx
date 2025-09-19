"use client";

import { UnifiedTopbar } from "@/newui/components/UnifiedTopbar";
import { NotificationCenter } from "@/newui/components/NotificationCenter";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/dashboard");
  };

  const handlePageChange = (page: string) => {
    router.push(`/${page}`);
  };

  const handleClose = () => {
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <UnifiedTopbar
        currentPage="notifications"
        onPageChange={handlePageChange}
        onBack={handleBack}
      />

      <main className="flex-1">
        <NotificationCenter onClose={handleClose} />
      </main>
    </div>
  );
}