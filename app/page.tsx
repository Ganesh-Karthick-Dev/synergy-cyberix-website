import { HeroSection } from "@/components/hero-section"
import { OfferSnippet } from "@/components/offer-snippet"
import { StatsSection } from "@/components/stats-section"
import { ProblemSection } from "@/components/problem-section"
import { FeaturesSection } from "@/components/features-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { BenefitsSection } from "@/components/benefits-section"
import { FreeTrialSection } from "@/components/free-trial-section"
import { WhyChooseUsSection } from "@/components/why-choose-us-section"
import { PricingSection } from "@/components/pricing-section"
import { UseCasesSection } from "@/components/use-cases-section"
import { WarningSection } from "@/components/warning-section"
import { FAQSection } from "@/components/faq-section"
import { FooterSection } from "@/components/footer-section"

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <main>
      <HeroSection />
      {/* <OfferSnippet /> */}
      <StatsSection />
      <ProblemSection />
      <FeaturesSection />
      <div id="about-us">
        <HowItWorksSection />
      </div>
      <BenefitsSection />
      <FreeTrialSection />
      <div id="why-choose">
        <WhyChooseUsSection />
      </div>
      <div id="pricing">
        <PricingSection />
      </div>
      <UseCasesSection />
      <div id="warning">
        <WarningSection />
      </div>
      <FAQSection />
      <FooterSection />
    </main>
  )
}
