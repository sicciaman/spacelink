import HeroSection from '../components/landing/HeroSection';
import PricingSection from '../components/landing/PricingSection';
import FAQSection from '../components/faq/FAQSection';

export default function Landing() {
  return (
    <div className="bg-white">
      <HeroSection />
      <PricingSection />
      <FAQSection />
    </div>
  );
}