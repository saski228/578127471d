import { Hero } from "@/components/hero";
import {
  MenuPreview,
  About,
  Contacts,
  Footer,
} from "@/components/sections";
import { Gallery } from "@/components/gallery";

export default function Page() {
  return (
    <>
      <main id="top">
        <Hero />
        <MenuPreview />
        <About />
        <Gallery />
        <Contacts />
      </main>
      <Footer />
    </>
  );
}
