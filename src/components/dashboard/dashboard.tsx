"use client";

import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateFlowDialog } from "./create-flow-dialog";
import { StreamCard } from "./stream-card";
import { mockStreams } from "@/lib/mock-data";
import { Stream } from "@/lib/types";

// A mock wallet address for demonstration purposes
const MOCK_WALLET_ADDRESS = "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B";

export default function Dashboard() {
  const incomingStreams = mockStreams.filter(
    (s) => s.recipient.toLowerCase() === MOCK_WALLET_ADDRESS.toLowerCase()
  );
  const outgoingStreams = mockStreams.filter(
    (s) => s.sender.toLowerCase() === MOCK_WALLET_ADDRESS.toLowerCase()
  );

  const renderStreamList = (streams: Stream[], emptyMessage: string) => {
    if (streams.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-12 text-center">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      );
    }
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {streams.map((stream) => (
          <StreamCard key={stream.id} stream={stream} />
        ))}
      </div>
    );
  };

  return (
    <div className="flex w-full flex-col">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Streams</h1>
        <CreateFlowDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create a Flow
          </Button>
        </CreateFlowDialog>
      </div>
      <Tabs defaultValue="incoming" className="mt-4">
        <TabsList className="grid w-full grid-cols-2 md:w-96">
          <TabsTrigger value="incoming">Incoming</TabsTrigger>
          <TabsTrigger value="outgoing">Outgoing</TabsTrigger>
        </TabsList>
        <TabsContent value="incoming" className="mt-6">
          {renderStreamList(incomingStreams, "You have no incoming streams.")}
        </TabsContent>
        <TabsContent value="outgoing" className="mt-6">
          {renderStreamList(outgoingStreams, "You have no outgoing streams.")}
        </TabsContent>
      </Tabs>
    </div>
  );
}
