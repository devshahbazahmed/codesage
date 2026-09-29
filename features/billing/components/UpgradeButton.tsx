"use client";

import { useRouter } from "next/navigation";
import Script from "next/script";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { statusButtonClass } from "@/features/dashboard/lib/status-styles";
import { startProSubscription } from "@/lib/billing";

type RazorpayCheckout = new (options: Record<string, unknown>) => {
  open: () => void;
};

declare global {
  interface Window {
    Razorpay: RazorpayCheckout;
  }
}

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

export default function UpgradeButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!;
    if (!key) {
      toast.error("Razorpay is not configured yet.");
      return;
    }

    if (!window.Razorpay) {
      toast.error("Checkout is still loading, please try again in a moment.");
      return;
    }
    setLoading(true);
    try {
      const { subscriptionId } = await startProSubscription();

      const checkout = new window.Razorpay({
        key,
        subscription_id: subscriptionId,
        name: "CodeSage AI Code Reviewer",
        description: "Pro plan -- Unlimited AI reviews",
        handler: () => {
          toast.success("Payment successful! Your pro plan will activate shortly.");
          router.refresh();
        },
      });

      checkout.open();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not start checkout.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <Script src={RAZORPAY_SCRIPT_URL} strategy="lazyOnload"></Script>
      <Button onClick={handleUpgrade} disabled={loading} className={cn(statusButtonClass.success)}>
        {loading ? "Opening checkout..." : "Upgrade to Pro"}
      </Button>
    </>
  );
}
