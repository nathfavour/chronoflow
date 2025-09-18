"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateFlowForm } from "./create-flow-form";
import React from "react";

export function CreateFlowDialog({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a new value stream</DialogTitle>
          <DialogDescription>
            Lock tokens in a contract that will stream to a recipient over time.
          </DialogDescription>
        </DialogHeader>
        <CreateFlowForm onFinished={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
