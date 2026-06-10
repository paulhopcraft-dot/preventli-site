import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import DemoHero from "@/components/DemoHero";
import DemoWalkthrough from "@/components/DemoWalkthrough";
import DemoForm from "@/components/DemoForm";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Book a Demo | Preventli",
  description:
    "See Preventli in action — a guided walkthrough of WorkCover case management, expert RTW plans, and pre-employment screening. Book your free demo.",
};

export default function DemoPage() {
  return (
    <main>
      <Navbar />
      <DemoHero />
      <DemoWalkthrough />
      <DemoForm />
      <Footer />
    </main>
  );
}
