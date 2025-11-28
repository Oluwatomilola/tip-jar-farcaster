import { useState, useEffect, useCallback } from "react";
import type { FarcasterContext, FarcasterUser } from "@shared/schema";

interface UseFarcasterReturn {
  context: FarcasterContext | null;
  user: FarcasterUser | null;
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
  isDemo: boolean;
  triggerHaptic: (type: "success" | "warning" | "error" | "light" | "medium" | "heavy") => void;
}

const DEMO_USER: FarcasterUser = {
  fid: 12345,
  username: "tipjar_demo",
  displayName: "Tip Jar Demo User",
  pfpUrl: undefined,
};

const DEMO_CONTEXT: FarcasterContext = {
  user: DEMO_USER,
  client: {
    platformType: "web",
    clientFid: 0,
    added: false,
  },
};

export function useFarcaster(): UseFarcasterReturn {
  const [context, setContext] = useState<FarcasterContext | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    async function initializeFarcaster() {
      try {
        const { sdk } = await import("@farcaster/miniapp-sdk");
        
        await sdk.actions.ready();
        
        if (!mounted) return;
        
        const ctx = sdk.context as any;
        
        if (ctx && ctx.user && ctx.user.fid > 0) {
          const farcasterContext: FarcasterContext = {
            user: {
              fid: ctx.user.fid,
              username: ctx.user.username || undefined,
              displayName: ctx.user.displayName || undefined,
              pfpUrl: ctx.user.pfpUrl || undefined,
            },
            client: {
              platformType: ctx.client?.platformType,
              clientFid: ctx.client?.clientFid || 0,
              added: ctx.client?.added || false,
            },
            location: ctx.location ? { type: ctx.location.type } : undefined,
          };
          
          setContext(farcasterContext);
          setIsDemo(false);
        } else {
          setContext(DEMO_CONTEXT);
          setIsDemo(true);
        }
        
        setIsReady(true);
        setError(null);
      } catch (err) {
        console.warn("Farcaster SDK not available, using demo mode:", err);
        
        if (!mounted) return;
        
        setContext(DEMO_CONTEXT);
        setIsDemo(true);
        setIsReady(true);
        setError(null);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    initializeFarcaster();
    
    return () => {
      mounted = false;
    };
  }, []);

  const triggerHaptic = useCallback(
    async (type: "success" | "warning" | "error" | "light" | "medium" | "heavy") => {
      if (isDemo) return;
      
      try {
        const { sdk } = await import("@farcaster/miniapp-sdk");
        const haptics = sdk.haptics as any;
        
        if (type === "success" || type === "warning" || type === "error") {
          haptics?.notificationOccurred?.(type);
        } else {
          haptics?.impactOccurred?.(type);
        }
      } catch {
        // Haptics not available
      }
    },
    [isDemo]
  );

  return {
    context,
    user: context?.user || null,
    isReady,
    isLoading,
    error,
    isDemo,
    triggerHaptic,
  };
}
