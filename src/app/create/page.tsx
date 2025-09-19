"use client";

import { AppLayout } from "@/newui/components/AppLayout";
import { EnhancedCreateStream } from "@/newui/components/EnhancedCreateStream";

export default function CreatePage() {
  return (
    <AppLayout>
      <EnhancedCreateStream />
    </AppLayout>
  );
}