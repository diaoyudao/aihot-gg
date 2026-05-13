import type { Metadata } from "next";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-sans/700.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/ibm-plex-mono/600.css";
import "@fontsource/ibm-plex-mono/700.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/800.css";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: {
    default: "AIHOT - AI 资讯精选",
    template: "%s - AIHOT",
  },
  description: "基于 168 个精选信源的 AI 资讯聚合，每日模型/产品/行业/论文/技巧一站掌握",
  openGraph: {
    title: "AIHOT - AI 资讯精选",
    description: "基于 168 个精选信源的 AI 资讯聚合",
    siteName: "AIHOT",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "AIHOT - AI 资讯精选",
    description: "基于 168 个精选信源的 AI 资讯聚合",
  },
  metadataBase: new URL("https://aihot.virxact.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className="h-full bg-bg-0 text-text-0">
        <ThemeProvider>
          <div className="app-shell">
            <Sidebar />
            <main className="app-main">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
