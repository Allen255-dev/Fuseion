import "./globals.css";
import { env } from "~/env";
import { ReactNode } from "react";
import { ReactScan } from "./scan";
import Providers from "./providers";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(env.APP_URL),
  title: "Fuseion | The Future of AI",
  description:
    "Experience the future of AI with Fuseion. Premium, intelligent, and limitless web application for modern creators.",
  applicationName: "Fuseion",
  creator: "Fuseion Team",
  authors: [{ name: "Fuseion Team", url: "https://fuseion.ai" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Fuseion",
    title: "Fuseion | The Future of AI",
    description: "Premium AI chat experience.",
    images: [
      {
        url: "/fuseion.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fuseion",
    description: "Premium AI chat experience.",
    creator: "@fuseionai",
    images: ["/fuseion.png"],
  },
  icons: {
    icon: "/fuseion.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {["local", "development"].includes(env.NODE_ENV) && <ReactScan />}
      <body
        className={`${inter.variable} ${poppins.variable} antialiased font-sans bg-background text-foreground`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
