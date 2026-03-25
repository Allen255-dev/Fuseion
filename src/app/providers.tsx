"use client";

import { env } from "~/env";
import { ReactNode } from "react";
import { ThemeProvider } from "./theme";
import { Toaster } from "~/components/ui/sonner";
import { ConvexClientProvider } from "~/components/ConvexClientProvider";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider
      enableSystem
      attribute="class"
      defaultTheme="dark"
      disableTransitionOnChange
    >
      <ConvexClientProvider>
        <SessionProvider>
          {children}
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </SessionProvider>
      </ConvexClientProvider>
    </ThemeProvider>
  );
};

export default Providers;
