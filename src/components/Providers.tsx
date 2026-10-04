"use client";

import { type ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "@/components/error-boundary";
import { AmbientSound } from "@/components/AmbientSound";
import { Preloader } from "@/components/Preloader";
import { ScrollToTop } from "@/components/ScrollToTop";
import { StarCursor } from "@/components/StarCursor";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MetaPixel } from "@/components/MetaPixel";
import { Analytics } from "@/components/Analytics";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <MetaPixel />
          <Analytics />
          <Preloader />
          <StarCursor />
          <ErrorBoundary>
            <ScrollToTop />
            {children}
          </ErrorBoundary>
          <ExitIntentPopup />
          <AmbientSound />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </MotionConfig>
  );
}
