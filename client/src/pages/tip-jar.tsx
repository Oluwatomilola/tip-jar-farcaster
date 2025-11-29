import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { useFarcaster } from "@/hooks/use-farcaster";
import { UserProfileCard } from "@/components/user-profile-card";
import { TipForm } from "@/components/tip-form";
import { WalletConnect } from "@/components/wallet-connect";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Coins, Heart, ExternalLink, Settings, Wallet, Zap } from "lucide-react";
import type { Currency } from "@shared/schema";

const DEFAULT_TARGET_ADDRESS = "0x742d35Cc6634C0532925a3b844Bc9e7595f1F6E6";

type TipStatus = "idle" | "loading" | "success" | "error";

const settingsSchema = z.object({
  recipientName: z.string().min(1, "Recipient name is required").max(50, "Name too long"),
  targetAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
});

type SettingsValues = z.infer<typeof settingsSchema>;

export default function TipJar() {
  const { user, isLoading, isDemo, triggerHaptic } = useFarcaster();
  const { address: connectedAddress, isConnected } = useAccount();
  const { 
    sendTransactionAsync, 
    data: txHash, 
    isPending: isSendingTx,
    reset: resetTx 
  } = useSendTransaction();
  const { 
    isLoading: isConfirming, 
    isSuccess: isTxConfirmed,
    isError: isConfirmError 
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const [targetAddress, setTargetAddress] = useState(DEFAULT_TARGET_ADDRESS);
  const [recipientName, setRecipientName] = useState("Creator");
  const [status, setStatus] = useState<TipStatus>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (isTxConfirmed && txHash) {
      setStatus("success");
      setStatusMessage("Transaction confirmed!");
      triggerHaptic("success");
      setIsSubmitting(false);
      setTimeout(() => {
        setStatus("idle");
        setStatusMessage("");
        resetTx();
      }, 5000);
    }
  }, [isTxConfirmed, txHash, triggerHaptic, resetTx]);

  useEffect(() => {
    if (isConfirmError) {
      setStatus("error");
      setStatusMessage("Transaction failed to confirm on-chain");
      triggerHaptic("error");
      setIsSubmitting(false);
      setTimeout(() => {
        setStatus("idle");
        setStatusMessage("");
        resetTx();
      }, 5000);
    }
  }, [isConfirmError, triggerHaptic, resetTx]);

  const settingsForm = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      recipientName: recipientName,
      targetAddress: targetAddress,
    },
  });

  const handleSettingsSave = (values: SettingsValues) => {
    setRecipientName(values.recipientName);
    setTargetAddress(values.targetAddress);
    setShowSettings(false);
    triggerHaptic("success");
  };

  const handleDirectTip = useCallback(
    async (amount: string) => {
      if (!isConnected || !connectedAddress) {
        setStatus("error");
        setStatusMessage("Please connect your wallet first");
        triggerHaptic("error");
        setTimeout(() => {
          setStatus("idle");
          setStatusMessage("");
        }, 3000);
        return;
      }

      setIsSubmitting(true);
      setStatus("loading");
      setStatusMessage("Confirm the transaction in your wallet...");

      try {
        const hash = await sendTransactionAsync({
          to: targetAddress as `0x${string}`,
          value: parseEther(amount),
        });
        
        if (hash) {
          setStatus("loading");
          setStatusMessage("Transaction sent! Waiting for confirmation...");
        }
      } catch (error: any) {
        setStatus("error");
        const errorMessage = error?.message?.includes("User rejected") || error?.message?.includes("rejected")
          ? "Transaction was rejected"
          : error?.shortMessage || error?.message?.slice(0, 100) || "Transaction failed. Please try again.";
        setStatusMessage(errorMessage);
        triggerHaptic("error");
        setIsSubmitting(false);
        setTimeout(() => {
          setStatus("idle");
          setStatusMessage("");
          resetTx();
        }, 5000);
      }
    },
    [isConnected, connectedAddress, targetAddress, sendTransactionAsync, triggerHaptic, resetTx]
  );

  const handleSubmitTip = useCallback(
    async (amount: string, currency: Currency) => {
      setIsSubmitting(true);
      setStatus("loading");
      setStatusMessage("Generating payment link...");

      try {
        const response = await fetch("/api/tip", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            targetAddress,
            amount,
            currency,
            senderFid: user?.fid,
            senderUsername: user?.username,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to generate payment link");
        }

        if (data.success && data.paymentUrl) {
          setStatus("success");
          setStatusMessage("Payment link opened! Complete your tip in the new window.");
          triggerHaptic("success");

          window.open(data.paymentUrl, "_blank");

          setTimeout(() => {
            setStatus("idle");
            setStatusMessage("");
          }, 5000);
        } else {
          throw new Error(data.error || "Failed to generate payment link");
        }
      } catch (error) {
        setStatus("error");
        setStatusMessage(
          error instanceof Error ? error.message : "Something went wrong. Please try again."
        );
        triggerHaptic("error");

        setTimeout(() => {
          setStatus("idle");
          setStatusMessage("");
        }, 5000);
      } finally {
        setIsSubmitting(false);
      }
    },
    [targetAddress, user, triggerHaptic]
  );

  const handleTipSubmit = useCallback(
    async (amount: string, currency: Currency) => {
      if (isConnected && currency === "ETH") {
        await handleDirectTip(amount);
      } else {
        await handleSubmitTip(amount, currency);
      }
    },
    [isConnected, handleDirectTip, handleSubmitTip]
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-[100] bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md">
                <Coins className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground" data-testid="text-app-title">
                  Tip Jar
                </h1>
                <p className="text-xs text-muted-foreground">Send crypto tips</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isDemo && (
                <Badge variant="secondary" className="text-xs" data-testid="badge-demo-mode">
                  Demo
                </Badge>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(!showSettings)}
                data-testid="button-toggle-settings"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        <Card className="p-4" data-testid="card-wallet-connect">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {isConnected ? "Wallet Connected" : "Connect Wallet"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isConnected ? "Send ETH tips directly" : "For direct ETH transfers"}
                </p>
              </div>
            </div>
            <WalletConnect />
          </div>
        </Card>

        {showSettings && (
          <Card className="p-4" data-testid="card-settings">
            <Form {...settingsForm}>
              <form
                onSubmit={settingsForm.handleSubmit(handleSettingsSave)}
                className="space-y-4"
              >
                <FormField
                  control={settingsForm.control}
                  name="recipientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Recipient Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Creator name"
                          data-testid="input-recipient-name"
                        />
                      </FormControl>
                      <FormMessage data-testid="error-recipient-name" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={settingsForm.control}
                  name="targetAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Wallet Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="0x..."
                          className="font-mono text-sm"
                          data-testid="input-target-address"
                        />
                      </FormControl>
                      <FormMessage data-testid="error-target-address" />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowSettings(false)}
                    data-testid="button-cancel-settings"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" data-testid="button-save-settings">
                    Save
                  </Button>
                </div>
              </form>
            </Form>
          </Card>
        )}

        <div className="text-center space-y-3 py-4" data-testid="section-hero">
          <div className="flex items-center justify-center gap-2">
            <Heart className="w-5 h-5 text-destructive animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">
              Support creators you love
            </span>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Send cryptocurrency tips instantly to your favorite creators
          </p>
        </div>

        <UserProfileCard user={user} isLoading={isLoading} />

        <TipForm
          targetAddress={targetAddress}
          recipientName={recipientName}
          onSubmit={handleTipSubmit}
          isSubmitting={isSubmitting || isSendingTx || isConfirming}
          status={status}
          statusMessage={statusMessage}
          onTriggerHaptic={triggerHaptic}
        />

        {isConnected && (
          <Card className="p-4 border-primary/20 bg-primary/5" data-testid="card-direct-tip-info">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  Direct Wallet Transfer
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  ETH tips are sent directly from your wallet.
                  USDC tips use a payment link.
                </p>
              </div>
            </div>
          </Card>
        )}

        <Card className="p-4" data-testid="card-info">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Payment Link Option
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isConnected 
                  ? "USDC tips are processed via Send.it payment links."
                  : "Tips are processed via Send.it payment links."}
              </p>
            </div>
          </div>
        </Card>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border py-3 z-[100]">
        <div className="max-w-md mx-auto px-4">
          <p
            className="text-center text-xs text-muted-foreground"
            data-testid="text-footer"
          >
            Built for the Farcaster ecosystem
          </p>
        </div>
      </footer>
    </div>
  );
}
