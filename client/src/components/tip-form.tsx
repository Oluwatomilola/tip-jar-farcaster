import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { StatusBanner } from "@/components/status-banner";
import { Loader2, Check, AlertCircle, Send, Wallet } from "lucide-react";
import type { Currency } from "@shared/schema";

const tipFormSchema = z.object({
  amount: z
    .string()
    .min(1, "Please enter an amount")
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      },
      { message: "Amount must be a positive number" }
    ),
  currency: z.enum(["ETH", "USDC"]),
});

type TipFormValues = z.infer<typeof tipFormSchema>;

interface TipFormProps {
  targetAddress: string;
  recipientName?: string;
  onSubmit: (amount: string, currency: Currency) => Promise<void>;
  isSubmitting?: boolean;
  status?: "idle" | "loading" | "success" | "error";
  statusMessage?: string;
  onTriggerHaptic?: (type: "success" | "warning" | "error" | "light" | "medium" | "heavy") => void;
}

const presetAmounts = ["1", "5", "10", "25"];

export function TipForm({
  targetAddress,
  recipientName,
  onSubmit,
  isSubmitting = false,
  status = "idle",
  statusMessage,
  onTriggerHaptic,
}: TipFormProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("ETH");

  const form = useForm<TipFormValues>({
    resolver: zodResolver(tipFormSchema),
    defaultValues: {
      amount: "",
      currency: "ETH",
    },
  });

  const handleSubmit = async (values: TipFormValues) => {
    onTriggerHaptic?.("medium");
    await onSubmit(values.amount, values.currency as Currency);
  };

  const handlePresetClick = (amount: string) => {
    form.setValue("amount", amount);
    onTriggerHaptic?.("light");
  };

  const handleCurrencyChange = (currency: Currency) => {
    setSelectedCurrency(currency);
    form.setValue("currency", currency);
    onTriggerHaptic?.("light");
  };

  const truncatedAddress = targetAddress
    ? `${targetAddress.slice(0, 6)}...${targetAddress.slice(-4)}`
    : "";

  return (
    <Card className="p-6" data-testid="card-tip-form">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Recipient Info */}
          <div
            className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
            data-testid="recipient-info"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium text-foreground truncate"
                data-testid="text-recipient-name"
              >
                {recipientName || "Recipient"}
              </p>
              <p
                className="text-xs text-muted-foreground font-mono truncate"
                data-testid="text-recipient-address"
              >
                {truncatedAddress}
              </p>
            </div>
          </div>

          {/* Currency Selector */}
          <FormField
            control={form.control}
            name="currency"
            render={() => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Currency</FormLabel>
                <div className="flex gap-2" data-testid="currency-selector">
                  <Button
                    type="button"
                    variant={selectedCurrency === "ETH" ? "default" : "outline"}
                    className={`flex-1 ${
                      selectedCurrency === "ETH" ? "" : "text-muted-foreground"
                    }`}
                    onClick={() => handleCurrencyChange("ETH")}
                    data-testid="button-currency-eth"
                  >
                    <span className="mr-2">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
                      </svg>
                    </span>
                    ETH
                  </Button>
                  <Button
                    type="button"
                    variant={selectedCurrency === "USDC" ? "default" : "outline"}
                    className={`flex-1 ${
                      selectedCurrency === "USDC" ? "" : "text-muted-foreground"
                    }`}
                    onClick={() => handleCurrencyChange("USDC")}
                    data-testid="button-currency-usdc"
                  >
                    <span className="mr-2">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.2" />
                        <path
                          d="M12 4a8 8 0 100 16 8 8 0 000-16zm0 14.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13z"
                          fill="currentColor"
                        />
                        <path
                          d="M12.5 7.5h-1v1.05a2.5 2.5 0 00-2 2.45c0 1.24.9 2.27 2 2.45v2.05c-.55-.07-1-.47-1.1-1h-1c.12 1.13 1.02 2.05 2.1 2.15v1.35h1v-1.35c1.08-.1 1.98-1.02 2.1-2.15h-1c-.1.53-.55.93-1.1 1v-2.05c1.1-.18 2-1.21 2-2.45 0-1.24-.9-2.27-2-2.45V7.5z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                    USDC
                  </Button>
                </div>
              </FormItem>
            )}
          />

          {/* Amount Input */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Amount</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type="number"
                      step="any"
                      min="0"
                      placeholder="0.00"
                      className="text-lg py-6 pr-16 font-medium"
                      inputMode="decimal"
                      data-testid="input-tip-amount"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                      {selectedCurrency}
                    </span>
                  </div>
                </FormControl>
                <FormMessage data-testid="error-tip-amount" />
              </FormItem>
            )}
          />

          {/* Preset Amounts */}
          <div className="flex gap-2" data-testid="preset-amounts">
            {presetAmounts.map((amount) => (
              <Button
                key={amount}
                type="button"
                variant="outline"
                size="sm"
                className="flex-1 text-muted-foreground"
                onClick={() => handlePresetClick(amount)}
                data-testid={`button-preset-amount-${amount}`}
              >
                {amount} {selectedCurrency}
              </Button>
            ))}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className={`w-full py-6 text-base font-semibold transition-all duration-200 ${
              status === "success"
                ? "bg-success hover:bg-success/90"
                : status === "error"
                ? "bg-destructive hover:bg-destructive/90"
                : ""
            }`}
            disabled={isSubmitting || status === "loading"}
            data-testid="button-send-tip"
          >
            {status === "loading" || isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : status === "success" ? (
              <>
                <Check className="mr-2 h-5 w-5" />
                Tip Sent!
              </>
            ) : status === "error" ? (
              <>
                <AlertCircle className="mr-2 h-5 w-5" />
                Try Again
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Send Tip
              </>
            )}
          </Button>

          {/* Status Banner */}
          {statusMessage && (
            <StatusBanner
              status={status}
              message={statusMessage}
            />
          )}
        </form>
      </Form>
    </Card>
  );
}
