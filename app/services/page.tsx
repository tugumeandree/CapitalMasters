import { Metadata } from 'next';
import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  BuildingLibraryIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Investment Services - CapitalMasters',
  description: 'Explore our comprehensive investment services including portfolio management, wealth advisory, and financial planning.',
};

const services = [
  {
    icon: ChartBarIcon,
    title: 'Portfolio Management',
    description: 'Disciplined portfolio management built around our current commodity-focused strategy.',
    features: [
      'Commodity-focused allocation for current stage',
      'Active monitoring of coffee and cocoa positions',
      'Quarterly performance updates to members',
      'Return-focused rebalancing decisions',
    ],
  },
  {
    icon: CurrencyDollarIcon,
    title: 'Commodity Investment Services',
    description: 'Current live investment execution in coffee and cocoa value chains.',
    features: [
      'Coffee investment opportunities',
      'Cocoa investment opportunities',
      'Pricing and market cycle tracking',
      'Structured entry and exit planning',
    ],
  },
  {
    icon: BuildingLibraryIcon,
    title: 'Governance & Compliance Support',
    description: 'Step-by-step compliance controls that protect member and client capital.',
    features: [
      'KYC onboarding and member verification',
      'Dual approval transaction controls',
      'Digital audit trails and reporting',
      'Compliance pathway from SHG to SACCO/MDI/CMA',
    ],
  },
  {
    icon: ArrowTrendingUpIcon,
    title: 'Capital Growth Planning',
    description: 'Roadmap-driven growth planning for members and long-term investors.',
    features: [
      'Annual target tracking and milestone reviews',
      'Member contribution planning',
      'Compounding strategy with disciplined reinvestment',
      'Performance checkpoints against return targets',
    ],
  },
  {
    icon: GlobeAltIcon,
    title: 'Digital Investment Operations',
    description: 'Fintech-powered workflows for transparency, accountability, and speed.',
    features: [
      'All transactions processed digitally',
      'Secure records and member visibility tools',
      'Real-time operational logging',
      'Structured communication and reporting workflows',
    ],
  },
  {
    icon: ShieldCheckIcon,
    title: 'Risk Management',
    description: 'Practical controls to protect principal and support consistent returns.',
    features: [
      'Commodity concentration controls',
      'Capital protection thresholds',
      'Ongoing risk and volatility monitoring',
      'Escalation plans for market disruptions',
    ],
  },
  {
    icon: UserGroupIcon,
    title: 'Member Advisory',
    description: 'Guidance to help members align contributions with investment goals.',
    features: [
      'Contribution and participation guidance',
      'Goal-based portfolio discussions',
      'Investment literacy and updates',
      'Client support through WhatsApp and direct channels',
    ],
  },
  {
    icon: BriefcaseIcon,
    title: 'Treasury & Cash Management',
    description: 'Conservative cash and liquidity management for operational stability.',
    features: [
      'Regulated bank account custody',
      'Cash flow planning and deployment schedules',
      'Reconciliation and controls monitoring',
      'Liquidity buffers for strategic flexibility',
    ],
  },
];

const investmentProcess = [
  {
    step: '01',
    title: 'Onboarding',
    description: 'Client KYC, goal capture, and contribution planning are completed first.',
  },
  {
    step: '02',
    title: 'Compliance Review',
    description: 'Transactions and allocations go through dual approval and policy checks.',
  },
  {
    step: '03',
    title: 'Execution',
    description: 'Capital is deployed into current commodity positions (coffee and cocoa).',
  },
  {
    step: '04',
    title: 'Monitoring & Reporting',
    description: 'Performance, risk, and progress are reviewed and shared transparently.',
  },
];

export default function Services() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-[#1A237E] text-white section-padding">
        <div className="container-custom text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#C5A021] mb-6">Our Investment Services</h1>
          <p className="text-base sm:text-lg md:text-xl text-[#F5F5F5] max-w-3xl mx-auto">
            Practical, transparent services aligned with our current investment-club stage and growth roadmap
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service) => (
              <div 
                key={service.title}
                className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="bg-[#F5F5F5] w-12 h-12 rounded-lg flex items-center justify-center">
                      <service.icon className="h-6 w-6 text-[#1A237E]" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {service.description}
                    </p>
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center text-gray-700">
                          <svg
                            className="h-5 w-5 text-[#2E7D32] mr-2 flex-shrink-0"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Process */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Investment Process
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A systematic approach to achieving your financial objectives
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {investmentProcess.map((item, index) => (
              <div key={item.step} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2E7D32] text-white text-2xl font-bold rounded-full mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
                {index < investmentProcess.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-[#C5A021]/40 -z-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Sectors */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Key Investment Sectors
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our current live sectors are commodity-focused with strong operational discipline
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group bg-white border-2 border-gray-200 hover:border-[#2E7D32] rounded-xl p-6 transition-all duration-300">
              <div className="bg-blue-100 group-hover:bg-blue-600 w-16 h-16 rounded-lg flex items-center justify-center mb-4 transition-colors">
                <svg className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Coffee</h3>
              <p className="text-gray-600 text-sm">
                Structured investment in coffee value chains with disciplined market tracking
              </p>
            </div>

            <div className="group bg-white border-2 border-gray-200 hover:border-[#2E7D32] rounded-xl p-6 transition-all duration-300">
              <div className="bg-green-100 group-hover:bg-green-600 w-16 h-16 rounded-lg flex items-center justify-center mb-4 transition-colors">
                <svg className="h-8 w-8 text-green-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cocoa</h3>
              <p className="text-gray-600 text-sm">
                Targeted cocoa allocations with transparent execution and reporting
              </p>
            </div>

            <div className="group bg-white border-2 border-gray-200 hover:border-[#2E7D32] rounded-xl p-6 transition-all duration-300">
              <div className="bg-amber-100 group-hover:bg-amber-600 w-16 h-16 rounded-lg flex items-center justify-center mb-4 transition-colors">
                <svg className="h-8 w-8 text-amber-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Treasury Bills</h3>
              <p className="text-gray-600 text-sm">
                Low-risk treasury positioning for capital preservation and liquidity support
              </p>
            </div>

            <div className="group bg-white border-2 border-gray-200 hover:border-[#2E7D32] rounded-xl p-6 transition-all duration-300">
              <div className="bg-purple-100 group-hover:bg-purple-600 w-16 h-16 rounded-lg flex items-center justify-center mb-4 transition-colors">
                <svg className="h-8 w-8 text-purple-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fintech Operations</h3>
              <p className="text-gray-600 text-sm">
                Digital transaction workflows, recordkeeping, and compliance monitoring tools
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Downloadable Resources */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Investment Resources
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Download our comprehensive guides and brochures
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <a href="#" className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-red-100 w-12 h-12 rounded flex items-center justify-center">
                  <span className="text-red-600 font-bold text-sm">PDF</span>
                </div>
                <svg className="h-6 w-6 text-gray-400 group-hover:text-[#2E7D32] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Investment Services Brochure</h3>
              <p className="text-sm text-gray-600 mb-3">Complete overview of our investment offerings</p>
              <span className="text-xs text-gray-500">2.3 MB • Updated Nov 2025</span>
            </a>

            <a href="#" className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-red-100 w-12 h-12 rounded flex items-center justify-center">
                  <span className="text-red-600 font-bold text-sm">PDF</span>
                </div>
                <svg className="h-6 w-6 text-gray-400 group-hover:text-[#2E7D32] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Fee Schedule & Pricing</h3>
              <p className="text-sm text-gray-600 mb-3">Transparent fee structure and pricing details</p>
              <span className="text-xs text-gray-500">1.1 MB • Updated Nov 2025</span>
            </a>

            <a href="#" className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-red-100 w-12 h-12 rounded flex items-center justify-center">
                  <span className="text-red-600 font-bold text-sm">PDF</span>
                </div>
                <svg className="h-6 w-6 text-gray-400 group-hover:text-[#2E7D32] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Sector Analysis Report</h3>
              <p className="text-sm text-gray-600 mb-3">In-depth analysis of key investment sectors</p>
              <span className="text-xs text-gray-500">4.7 MB • Updated Nov 2025</span>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="bg-[#1A237E] rounded-2xl p-6 sm:p-8 md:p-12 text-center text-white border border-[#C5A021]/35">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-[#F5F5F5] mb-8 max-w-2xl mx-auto">
              Schedule a consultation to discuss our current commodity strategy and minimum 8% ROI objective.
            </p>
            <a
              href="/contact"
              className="inline-block bg-white text-[#1A237E] px-8 py-4 rounded-lg font-semibold hover:bg-[#F5F5F5] transition-colors duration-200"
            >
              Schedule Consultation
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
