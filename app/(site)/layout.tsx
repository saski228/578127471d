import { BookingProvider } from "@/components/booking";
import { Header } from "@/components/header";
import { MobileBar } from "@/components/mobile-bar";
import { SiteProvider } from "@/components/site-context";
import { TransitionProvider } from "@/components/transition";
import { getContent } from "@/lib/content";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const c = await getContent();
  return (
    <SiteProvider value={{ s: c.s, t: c.t, hours: c.hours }}>
      <TransitionProvider>
        <BookingProvider>
          <Header />
          {children}
          <MobileBar />
        </BookingProvider>
      </TransitionProvider>
    </SiteProvider>
  );
}
