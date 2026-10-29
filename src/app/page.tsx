import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { HowItWorks, Testimonials, WhyUs, FaqSection } from "@/components/sections";
import { Booking } from "@/components/booking";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
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
