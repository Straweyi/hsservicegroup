import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { HowItWorks, Testimonials, WhyUs, FaqSection } from "@/components/sections";
import { Booking } from "@/components/booking";
import { Footer } from "@/components/footer";
import { buildOrganizationJsonLd } from "@/lib/seo";

export default function Home() {
  const jsonLd = buildOrganizationJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <HowItWorks />
        <Testimonials />
        <WhyUs />
        <FaqSection />
        <Booking />
      </main>
      <Footer />
    </>
  );
}
