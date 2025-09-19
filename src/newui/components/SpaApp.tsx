"use client";

import React, { useCallback, useState } from "react";
import { UnifiedTopbar } from "./UnifiedTopbar";
import { AppNavigation } from "./AppNavigation";
import { Hero } from "./Hero";
import { EnhancedDashboard } from "./EnhancedDashboard";
import { EnhancedCreateStream } from "./EnhancedCreateStream";
import { EnhancedMarketplace } from "./EnhancedMarketplace";
import { EnhancedSettings } from "./EnhancedSettings";
import { StreamAnalytics } from "./StreamAnalytics";
import { NotificationCenter } from "./NotificationCenter";
import { OnboardingFlow } from "./OnboardingFlow";

type Page =
  | "home"
  | "dashboard"
  | "create"
  | "marketplace"
  | "settings"
  | "analytics"
  | "notifications"
  | "onboarding";

export default function SpaApp() {
  const [currentPage, setCurrentPage] = useState<Page>("home");

  const handlePageChange = useCallback((page: Page) => {
    setCurrentPage(page);
    // scroll to top for new pages
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Hero onLaunchApp={() => setCurrentPage("dashboard")} />;
      case "dashboard":
        return <EnhancedDashboard onViewAnalytics={() => setCurrentPage("analytics")} />;
      case "create":
        return <EnhancedCreateStream />;
      case "marketplace":
        return <EnhancedMarketplace />;
      case "settings":
        return <EnhancedSettings />;
      case "analytics":
        return <StreamAnalytics />;
      case "notifications":
        return <NotificationCenter />;
      case "onboarding":
        return <OnboardingFlow />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <UnifiedTopbar
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onBack={() => setCurrentPage("dashboard")}
      />

      <div className="flex flex-1">
        <AppNavigation currentPage={currentPage as any} onPageChange={handlePageChange} />

        <main className="flex-1">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
