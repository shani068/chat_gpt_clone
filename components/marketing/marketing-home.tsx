import { Navbar } from "@/components/layout/navbar";
import { CallToAction } from "@/components/marketing/call-to-action";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { ProductPreview } from "@/components/marketing/product-preview";
import { SiteFooter } from "@/components/marketing/site-footer";

/** Public marketing landing shown to signed-out visitors on `/`. */
export function MarketingHome() {
  return (
    <div className="bg-background min-h-dvh">
      <Navbar />

      <main>
        <Hero />
        <FeatureGrid />

        <section
          id="preview"
          className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24"
        >
          <header className="max-w-2xl">
            <p className="text-caption text-accent-strong font-mono tracking-[0.16em] uppercase">
              The interface
            </p>
            <h2 className="text-h1 text-foreground mt-3 text-balance">
              This is the actual product, not a mockup
            </h2>
            <p className="text-body text-muted-foreground mt-3 max-w-[56ch] text-pretty">
              The panel below renders with the same markdown pipeline, the same
              tokens and the same components as the application. Try the copy
              button on the code block.
            </p>
          </header>

          <ProductPreview className="mt-10 sm:mt-12" />
        </section>

        <HowItWorks />
        <CallToAction />
      </main>

      <SiteFooter />
    </div>
  );
}
