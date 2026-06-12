import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import WhyCareerPilot from '../components/WhyCareerPilot';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import DataSection from '../components/DataSection';
import CTABanner from '../components/CTABanner';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0b1120] transition-colors duration-300">
      <Navbar />
      <Hero />
      <WhyCareerPilot />
      <Features />
      <HowItWorks />
      <DataSection />
      <CTABanner />
      <Footer />
    </div>
  );
}
