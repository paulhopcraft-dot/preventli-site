import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PainPoints from "@/components/PainPoints";
import HowItWorks from "@/components/HowItWorks";
import OnlineDoctor from "@/components/OnlineDoctor";
import PreEmployment from "@/components/PreEmployment";
import Features from "@/components/Features";
import AIAgents from "@/components/AIAgents";
import RiskAssessment from "@/components/RiskAssessment";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import Calculator from "@/components/premium-calculator/Calculator";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <PainPoints />
      <HowItWorks />
      <OnlineDoctor />
      <PreEmployment />
      <Features />
      <AIAgents />
      <RiskAssessment />
      <Testimonials />
      <Pricing />
      <section id="calculator" className="py-20 bg-[#F8F9FA]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#5E7012] text-sm font-semibold uppercase tracking-widest">
              WorkCover premium calculator
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0A1628] mt-3 mb-4">
              Estimate your WorkCover premium
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              See your estimated WorkSafe Victoria premium — and how managing
              claims well could bring it down.
            </p>
          </div>
          <Calculator />
        </div>
      </section>
      <ContactForm />
      <Footer />
    </main>
  );
}
