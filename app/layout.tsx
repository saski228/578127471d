import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { BookingProvider } from "@/components/booking";
import { Header } from "@/components/header";
import { TransitionProvider } from "@/components/transition";
import "./globals.css";

const title = "Оранжерея — ресторан на крыше в Симферополе";
const description =
  "Авторская кухня, коктейли и летняя терраса в Симферополе. Меню, фотографии и бронирование столов в ресторане Оранжерея на Севастопольской, 62.";

export const metadata: Metadata = {
  title: { default: title, template: "%s | Оранжерея" },
  description,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title,
    description,
    locale: "ru_RU",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
};
export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0b110e",
  width: "device-width",
  initialScale: 1,
};

// Включает вступительные анимации до первой отрисовки.
// Без JS атрибут не появится, и всё остаётся видимым.
const boot = `try{document.documentElement.dataset.stage="boot"}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <link
          rel="preload"
          href="/fonts/russo-cyrillic.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
      </head>
      <body className="antialiased">
        <TransitionProvider>
          <BookingProvider>
            <Header />
            {children}
          </BookingProvider>
        </TransitionProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
