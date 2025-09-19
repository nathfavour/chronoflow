"use client";

import { UnifiedTopbar } from "./UnifiedTopbar";
import { AppNavigation } from "./AppNavigation";
import { useRouter, usePathname } from "next/navigation";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Convert pathname to page type for UnifiedTopbar
  const getPageFromPath = (path: string) => {
    if (path.startsWith("/dashboard")) return "dashboard";
    if (path.startsWith("/marketplace")) return "marketplace";
    if (path.startsWith("/create")) return "create";
    if (path.startsWith("/settings")) return "settings";
    if (path.startsWith("/analytics")) return "analytics";
    if (path.startsWith("/notifications")) return "notifications";
    if (path.startsWith("/onboarding")) return "onboarding";
    return "dashboard";
  };

  const currentPage = getPageFromPath(pathname);

  const handlePageChange = (page: string) => {
    router.push(`/${page}`);
  };

  const handleBack = () => {
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <UnifiedTopbar
        currentPage={currentPage as any}
        onPageChange={handlePageChange}
        onBack={handleBack}
      />

      <div className="flex flex-1">
        <AppNavigation 
          currentPage={currentPage as any} 
          onPageChange={handlePageChange} 
        />

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}