import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { getContent } from "@/lib/content";
import { siteUrl } from "@/lib/site";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const { s } = await getContent();
  return {
    metadataBase: new URL(siteUrl),
    title: { default: s.seoTitle, template: "%s | Оранжерея" },
    description: s.seoDescription,
    alternates: { canonical: "/" },
    icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }], apple: "/apple-icon.png" },
    openGraph: {
      title: s.seoTitle, description: s.seoDescription, locale: "ru_RU", type: "website", siteName: "Оранжерея",
      images: [{ url: "/og.png", width: 1200, height: 630 }],
    },
  };
}
export const viewport: Viewport = { colorScheme: "dark", themeColor: "#0b110e", width: "device-width", initialScale: 1 };

// Включает вступительные анимации до первой отрисовки. Без JS всё остаётся видимым.
const boot = `try{document.documentElement.dataset.stage="boot";history.scrollRestoration="manual";if(!location.hash)scrollTo(0,0)}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <link rel="preload" href="/fonts/russo-cyrillic.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
