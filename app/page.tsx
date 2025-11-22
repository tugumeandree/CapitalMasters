import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ShieldCheckIcon, ChartBarIcon, UsersIcon } from "@heroicons/react/24/outline";
import { generateOrganizationSchema } from "@/lib/seo";

export default function Home() {
  const organizationSchema = generateOrganizationSchema();

  return (
    <div className="w-full">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white section-padding overflow-hidden">
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
                  <div className="text-xs text-primary-100">Investment Excellence Since 2008</div>
                </div>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Transforming Africa's Economic Future
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-primary-100 leading-relaxed">
                Join us in building Africa's prosperity. Strategic investment management channeling global 
                capital into continental growth opportunities. Experience excellence with Uganda's premier 
                investment firm.
              </p>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-4 text-xs sm:text-sm">
                <div className="flex items-center space-x-2">
                  <ShieldCheckIcon className="h-5 w-5 text-secondary-400" />
                  <span>SEC Registered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <UsersIcon className="h-5 w-5 text-secondary-400" />
                  <span>5,000+ Clients</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ChartBarIcon className="h-5 w-5 text-secondary-400" />
                  <span>$2.5B+ AUM</span>
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
      <section className="section-padding bg-gray-50">
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
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <ShieldCheckIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                Secure & Compliant
              </h3>
              <p className="text-gray-600 mb-4">
                Fully licensed and regulated. Your investments are protected with industry-leading security measures.
              </p>
              <Link href="/investor-protection" className="text-primary-600 font-semibold hover:text-primary-700 text-sm inline-flex items-center">
                Learn about our protection →
              </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <ChartBarIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Proven Performance
              </h3>
              <p className="text-gray-600">
                Track record of consistent returns through diverse market conditions and strategic portfolio management.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <UsersIcon className="h-8 w-8 text-primary-600" />
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

      {/* Stats Section */}
      <section className="section-padding bg-primary-600 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">15+</div>
              <div className="text-primary-100">Assets Under Management</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">15+</div>
              <div className="text-primary-100">Years of Experience</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">5,000+</div>
              <div className="text-primary-100">Satisfied Clients</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">98%</div>
              <div className="text-primary-100">Client Retention Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Start Your Investment Journey?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of successful investors who trust CapitalMasters with their financial future.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact" className="btn-secondary inline-flex items-center">
                Schedule Consultation
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/client-portal" className="btn-outline border-white text-white hover:bg-white hover:text-primary-900">
                Client Portal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
