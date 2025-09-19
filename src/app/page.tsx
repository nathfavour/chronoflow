"use client";

import { CleanHero } from "@/newui/components/CleanHero";
import { UnifiedTopbar } from "@/newui/components/UnifiedTopbar";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleLaunchApp = () => {
    router.push("/dashboard");
  };

  const handlePageChange = (page: string) => {
    router.push(`/${page}`);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <UnifiedTopbar
        currentPage="home"
        onPageChange={handlePageChange}
        onBack={() => router.push("/")}
      />
      
      <CleanHero onLaunchApp={handleLaunchApp} />
    </div>
  );
}
