"use client";

import { CleanHero } from "@/newui/components/CleanHero";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleLaunchApp = () => {
    router.push("/dashboard");
  };

  return <CleanHero onLaunchApp={handleLaunchApp} />;
}
