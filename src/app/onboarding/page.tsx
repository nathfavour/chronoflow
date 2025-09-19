"use client";

import { UnifiedTopbar } from "@/newui/components/UnifiedTopbar";
import { OnboardingFlow } from "@/newui/components/OnboardingFlow";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();

  const handleComplete = () => {
    router.push("/dashboard");
  };

  const handleSkip = () => {
    router.push("/dashboard");
  };

  const handlePageChange = (page: string) => {
    router.push(`/${page}`);
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <UnifiedTopbar
        currentPage="onboarding"
        onPageChange={handlePageChange}
        onBack={handleBack}
      />

      <main className="flex-1">
        <OnboardingFlow onComplete={handleComplete} onSkip={handleSkip} />
      </main>
    </div>
  );
}