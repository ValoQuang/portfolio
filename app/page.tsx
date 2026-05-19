import { Nav } from "@/components/Nav";
import { ScrollIndicator } from "@/components/ScrollIndicator";
import { SmoothScroll } from "@/components/SmoothScroll";
import { UniverseClient } from "@/components/UniverseClient";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { OrbitIntro } from "@/components/sections/OrbitIntro";
import { Chapter } from "@/components/sections/Chapter";
import { Skills } from "@/components/sections/Skills";
import { Signal } from "@/components/sections/Signal";
import { chapters } from "@/lib/data";

export default function Page() {
  return (
    <>
      <SmoothScroll />
      <UniverseClient />
      <Nav />
      <ScrollIndicator />

      <div className="vignette-overlay" aria-hidden />

      <main className="relative z-10">
        <Hero />
        <Manifesto />
        <OrbitIntro />
        {chapters.map((c) => (
          <Chapter key={c.id} chapter={c} total={chapters.length} />
        ))}
        <Skills />
        <Signal />
      </main>
    </>
  );
}
