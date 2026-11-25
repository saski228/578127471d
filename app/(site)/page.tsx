import { Hero } from "@/components/hero";
import { MenuPreview, About, Reviews, Contacts, Footer } from "@/components/sections";
import { Gallery } from "@/components/gallery";
import { getContent } from "@/lib/content";
import { siteUrl } from "@/lib/site";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default async function Page() {
  const c = await getContent();
  const ld = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Оранжерея",
    url: siteUrl,
    image: `${siteUrl}/og.png`,
    telephone: `+${c.s.phone.replace(/\D/g, "").replace(/^8/, "7")}`,
    priceRange: c.s.avgCheck,
    hasMenu: `${siteUrl}/menu`,
    address: { "@type": "PostalAddress", streetAddress: c.s.address, addressLocality: "Симферополь", addressCountry: "RU" },
    geo: { "@type": "GeoCoordinates", latitude: 44.937691, longitude: 34.093679 },
    openingHoursSpecification: c.hours.map((h, i) => (h.closed ? null : {
      "@type": "OpeningHoursSpecification", dayOfWeek: DAYS[i], opens: h.open, closes: h.close,
    })).filter(Boolean),
    sameAs: [c.s.vkUrl, c.s.mapsUrl].filter(Boolean),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <main id="top">
        <Hero photos={c.gallery} />
        <MenuPreview cats={c.cats} />
        <About c={c} />
        <Reviews c={c} />
        <Gallery photos={c.gallery} />
        <Contacts c={c} />
      </main>
      <Footer c={c} />
    </>
  );
}
