import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Cormorant_Garamond, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const ClientUI = dynamic(() => import("@/components/ClientUI"), { ssr: false });
const LenisProvider = dynamic(() => import("@/components/LenisProvider"), { ssr: false });

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-cormorant",
});

const dm = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sakshinimje.in"),
  title: "Sakshi Nimje — Full Stack Developer & SAP Engineer",
  description: "Portfolio of Sakshi Nimje, Full-Stack Engineer and SAP Developer specializing in enterprise backends and beautiful motion design.",
  icons: {
    icon: "/cat.png",
  },
  openGraph: {
    title: "Sakshi Nimje — Full Stack Developer & SAP Engineer",
    description: "I engineer enterprise backends and animate the web.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sakshi Nimje Portfolio",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning 
      className={`${cormorant.variable} ${dm.variable} ${mono.variable}`}
    >
      <body className="antialiased min-h-screen">
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          enableSystem={false}
          disableTransitionOnChange
        >
          <ClientUI />
          <LenisProvider>{children}</LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

