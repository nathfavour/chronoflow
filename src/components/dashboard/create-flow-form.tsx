"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  recipient: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address"),
  amount: z.coerce.number().positive("Amount must be positive"),
  token: z.string().min(1, "Please select a token"),
  durationDays: z.coerce.number().min(0).default(0),
  durationHours: z.coerce.number().min(0).max(23).default(0),
  durationMinutes: z.coerce.number().min(0).max(59).default(0),
}).refine(data => (data.durationDays * 24 * 60) + (data.durationHours * 60) + data.durationMinutes > 0, {
  message: "Total duration must be greater than 0 minutes.",
  path: ["durationMinutes"],
});

type FormValues = z.infer<typeof formSchema>;

export function CreateFlowForm({ onFinished }: { onFinished: () => void }) {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipient: "",
      amount: undefined,
      token: "USDC",
      durationDays: 7,
      durationHours: 0,
      durationMinutes: 0,
    },
  });

  function onSubmit(values: FormValues) {
    console.log(values);
    toast({
      title: "Flow Created!",
      description: `Streaming ${values.amount} ${values.token} to ${values.recipient.slice(0,6)}...`,
    });
    onFinished();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="recipient"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipient Wallet</FormLabel>
              <FormControl>
                <Input placeholder="0x..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-5 gap-2">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>Total Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="1000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Token</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select token" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USDC">USDC</SelectItem>
                      <SelectItem value="SOM">SOM</SelectItem>
                      <SelectItem value="WETH">WETH</SelectItem>
                      <SelectItem value="DAI">DAI</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <div>
          <FormLabel>Stream Duration</FormLabel>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <FormField
              control={form.control}
              name="durationDays"
              render={({ field }) => (
                <FormItem>
                   <FormControl><Input type="number" placeholder="Days" {...field} /></FormControl>
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="durationHours"
              render={({ field }) => (
                <FormItem>
                   <FormControl><Input type="number" placeholder="Hours" {...field} /></FormControl>
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="durationMinutes"
              render={({ field }) => (
                <FormItem>
                   <FormControl><Input type="number" placeholder="Minutes" {...field} /></FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormMessage>{form.formState.errors.durationMinutes?.message}</FormMessage>
        </div>
        <Button type="submit" className="w-full">
          Start Flow
        </Button>
      </form>
    </Form>
  );
}
