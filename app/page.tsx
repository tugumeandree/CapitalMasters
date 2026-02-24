import Link from "next/link";
import { ArrowRightIcon, ShieldCheckIcon, ChartBarIcon, UsersIcon } from "@heroicons/react/24/outline";
import { generateOrganizationSchema } from "@/lib/seo";
import GrowthRoadmapSection from "@/components/GrowthRoadmapSection";
import CommodityAllocationChart from "@/components/charts/CommodityAllocationChart";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Join CapitalMasters, founded by Andrew Tugume, and invest in coffee and cocoa with transparent digital compliance and disciplined portfolio management.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  const organizationSchema = generateOrganizationSchema();
  const founderSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Andrew Tugume",
    jobTitle: "Founder & Chief Investor",
    worksFor: {
      "@type": "Organization",
      name: "CapitalMasters",
    },
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://capitalmasters.com'}/about`,
  };

  return (
    <div className="w-full">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(founderSchema) }}
      />
      {/* Hero Section */}
      <section className="relative bg-[#1A237E] text-white section-padding overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-400 rounded-full blur-3xl"></div>
        </div>
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {/* Logo & Tagline */}
              <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-4">
                <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold text-lg">C</span>
                </div>
                <div>
                  <div className="text-lg font-bold">CapitalMasters</div>
                  <div className="text-xs text-[#C5A021]">Investment Excellence Since 2025</div>
                </div>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-[#C5A021]">
                Transforming Africa's Economic Future
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-[#F5F5F5] leading-relaxed">
                Join us in building Africa's prosperity. Strategic investment management channeling global 
                capital into continental growth opportunities. Experience excellence with Uganda's premier 
                investment firm.
              </p>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-4 text-xs sm:text-sm">
                <div className="flex items-center space-x-2">
                  <ShieldCheckIcon className="h-5 w-5 text-secondary-400" />
                  <span className="ledger-text">Self Help Stage</span>
                </div>
                <div className="flex items-center space-x-2">
                  <UsersIcon className="h-5 w-5 text-secondary-400" />
                  <span className="ledger-text">100 Clients</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ChartBarIcon className="h-5 w-5 text-secondary-400" />
                  <span className="ledger-text">UGX 900M+ AUM</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/contact" className="btn-primary inline-flex items-center">
                  Get Started
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
                <Link href="/services" className="btn-outline bg-white/10 border-white text-white hover:bg-white hover:text-primary-900">
                  Explore Services
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary-400/20 to-primary-500/20 rounded-2xl backdrop-blur-sm" />
              <div className="absolute inset-0 flex items-center justify-center">
                <ChartBarIcon className="h-64 w-64 text-white/30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-[#F5F5F5]">
        <div className="container-custom">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose CapitalMasters?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Africa's investment leader combining continental expertise, cutting-edge technology, and 
              personalized service to deliver exceptional returns and drive economic transformation.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="theme-card card-investment p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <ShieldCheckIcon className="h-8 w-8 text-[#C5A021]" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                Step-by-Step Compliance
              </h3>
              <p className="text-gray-600 mb-4">
                Step 1: KYC onboarding and member verification. Step 2: digital transaction logging and dual approval controls. Step 3: regulated bank custody and reconciliations. Step 4: periodic audits, risk reviews, and transparent member reporting.
              </p>
              <Link href="/investor-protection" className="text-primary-600 font-semibold hover:text-primary-700 text-sm inline-flex items-center">
                Learn about our protection →
              </Link>
            </div>

            <div className="theme-card card-investment p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <ChartBarIcon className="h-8 w-8 text-[#C5A021]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Proven Performance
              </h3>
              <p className="text-gray-600">
                All our clients receive a minimum 8% return on investment through disciplined portfolio management and consistent risk controls.
              </p>
            </div>

            <div className="theme-card card-farming p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <UsersIcon className="h-8 w-8 text-[#C5A021]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Expert Guidance
              </h3>
              <p className="text-gray-600">
                Dedicated advisors with decades of experience helping clients achieve their financial objectives.
              </p>
            </div>
          </div>
        </div>
      </section>

      <GrowthRoadmapSection />

      {/* Commodity Allocation Section */}
      <section className="section-padding bg-[#F5F5F5]">
        <div className="container-custom">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Current Commodity Allocation
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Our current portfolio focus is on two core commodities: coffee and cocoa.
            </p>
          </div>

          <div className="theme-card card-farming p-6 md:p-8 max-w-4xl mx-auto">
            <CommodityAllocationChart />
            <div className="mt-4 flex flex-wrap justify-center gap-6 text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#2E7D32]" />
                <span className="text-gray-700">Coffee</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#C5A021]" />
                <span className="text-gray-700">Cocoa</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-[#2E7D32] text-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            <div>
              <div className="ledger-text text-3xl sm:text-4xl md:text-5xl font-bold mb-2">2+</div>
              <div className="text-primary-100">Years of Excellence</div>
            </div>
            <div>
              <div className="ledger-text text-5xl font-bold mb-2">UGX 900M+</div>
              <div className="text-primary-100">Assets Under Management</div>
            </div>
            <div>
              <div className="ledger-text text-5xl font-bold mb-2">100</div>
              <div className="text-primary-100">Satisfied Clients</div>
            </div>
            <div>
              <div className="ledger-text text-5xl font-bold mb-2">5+</div>
              <div className="text-primary-100">Expert Professionals</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="bg-[#1A237E] rounded-2xl p-12 text-center text-white border border-[#C5A021]/35">
            <h2 className="text-4xl font-bold text-[#C5A021] mb-4">
              Join CapitalMasters And Start Investing In Coffee And Cocoa Now
            </h2>
            <p className="text-xl text-[#F5F5F5] mb-8 max-w-2xl mx-auto">
              We invest in two seasons each year: February–May and September–December. Target return is 8% monthly ROI (32% per 4-month season). Minimum investment is UGX 1M.
            </p>
            <p className="text-sm text-[#F5F5F5]/85 mb-6">
              Preferred contact: WhatsApp first, then call or email. Website form is last resort.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://wa.me/256755017384?text=Hello%20CapitalMasters%2C%20I%20want%20to%20join%20and%20invest%20in%20coffee%20and%20cocoa."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center"
              >
                WhatsApp Now
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </a>
              <a href="tel:+256755017384" className="btn-outline border-white text-white hover:bg-white hover:text-[#1A237E]">
                Call +256 755017384
              </a>
              <a href="mailto:info@capitalmasters.com" className="btn-outline border-white text-white hover:bg-white hover:text-[#1A237E]">
                Email Us
              </a>
              <Link href="/contact#contact-form" className="text-[#F5F5F5] underline underline-offset-4 hover:text-white">
                Use Contact Form (Last Resort)
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
