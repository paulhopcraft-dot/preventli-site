import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PainPoints from "@/components/PainPoints";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import AIAgents from "@/components/AIAgents";
import RiskAssessment from "@/components/RiskAssessment";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import Calculator from "@/components/Calculator";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <PainPoints />
      <HowItWorks />
      <Features />
      <AIAgents />
      <RiskAssessment />
      <Testimonials />
      <Pricing />
      <Calculator />
      <ContactForm />
      <Footer />
    </main>
  );
}
