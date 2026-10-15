import { Nav } from "@/components/Nav";
import { SmoothScroll } from "@/components/SmoothScroll";
import { UniverseClient } from "@/components/UniverseClient";
import { BackgroundAudio } from "@/components/BackgroundAudio";
import { ObservatoryHUD } from "@/components/ObservatoryHUD";
import { IntroOverlay, IntroGate } from "@/components/IntroOverlay";
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
      <IntroOverlay />
      <BackgroundAudio />

      <IntroGate>
        <a href="#main" className="skip-link">Skip to content</a>
        <Nav />
        <ObservatoryHUD />

        <div className="scanlines" aria-hidden />
        <div className="vignette-overlay" aria-hidden />

        <main id="main" className="relative z-10">
          <Hero />
          <Manifesto />
          <OrbitIntro />
          {chapters.map((c) => (
            <Chapter key={c.id} chapter={c} total={chapters.length} />
          ))}
          <Skills />
          <Signal />
        </main>
      </IntroGate>
    </>
  );
}
