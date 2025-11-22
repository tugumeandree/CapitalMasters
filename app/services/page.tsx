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
    description: 'Customized investment portfolios designed to meet your specific financial goals and risk tolerance.',
    features: [
      'Personalized asset allocation',
      'Active portfolio rebalancing',
      'Performance monitoring and reporting',
      'Tax-efficient investment strategies',
    ],
  },
  {
    icon: CurrencyDollarIcon,
    title: 'Wealth Advisory',
    description: 'Comprehensive wealth management solutions for high-net-worth individuals and families.',
    features: [
      'Holistic financial planning',
      'Estate planning coordination',
      'Philanthropic planning',
      'Multi-generational wealth transfer',
    ],
  },
  {
    icon: BuildingLibraryIcon,
    title: 'Institutional Services',
    description: 'Sophisticated investment solutions for corporations, endowments, and foundations.',
    features: [
      'Custom investment policy development',
      'Fiduciary consulting',
      'Asset-liability matching',
      'Performance attribution analysis',
    ],
  },
  {
    icon: ArrowTrendingUpIcon,
    title: 'Alternative Investments',
    description: 'Access to exclusive investment opportunities beyond traditional stocks and bonds.',
    features: [
      'Private equity investments',
      'Hedge fund strategies',
      'Real estate opportunities',
      'Commodities and derivatives',
    ],
  },
  {
    icon: GlobeAltIcon,
    title: 'Global Investment Strategy',
    description: 'Diversified international investment opportunities across global markets.',
    features: [
      'International equity portfolios',
      'Emerging markets exposure',
      'Currency hedging strategies',
      'Global sector allocation',
    ],
  },
  {
    icon: ShieldCheckIcon,
    title: 'Risk Management',
    description: 'Advanced risk assessment and mitigation strategies to protect your investments.',
    features: [
      'Comprehensive risk analysis',
      'Downside protection strategies',
      'Volatility management',
      'Portfolio stress testing',
    ],
  },
  {
    icon: UserGroupIcon,
    title: 'Retirement Planning',
    description: 'Strategic planning to ensure a comfortable and secure retirement.',
    features: [
      'Pension and retirement fund management',
      'Pension plan consulting',
      'NSSF and retirement benefit optimization',
      'Healthcare and long-term planning',
    ],
  },
  {
    icon: BriefcaseIcon,
    title: 'Corporate Services',
    description: 'Investment solutions for corporate treasury and executive compensation.',
    features: [
      'Cash management strategies',
      'Executive benefit programs',
      'Deferred compensation plans',
      'Stock option planning',
    ],
  },
];

const investmentProcess = [
  {
    step: '01',
    title: 'Discovery',
    description: 'We start by understanding your financial goals, risk tolerance, and time horizon.',
  },
  {
    step: '02',
    title: 'Strategy',
    description: 'We develop a customized investment strategy tailored to your unique needs.',
  },
  {
    step: '03',
    title: 'Implementation',
    description: 'We execute your investment plan with precision and efficiency.',
  },
  {
    step: '04',
    title: 'Monitoring',
    description: 'We continuously monitor and adjust your portfolio to optimize performance.',
  },
];

export default function Services() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white section-padding">
        <div className="container-custom text-center">
          <h1 className="text-5xl font-bold mb-6">Our Investment Services</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Comprehensive investment solutions designed to help you achieve your financial goals
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
                    <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center">
                      <service.icon className="h-6 w-6 text-primary-600" />
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
                            className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0"
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
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
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 text-white text-2xl font-bold rounded-full mb-4">
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
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-primary-200 -z-10" />
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Key Investment Sectors
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our expertise spans multiple sectors, providing diversified opportunities for growth
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group bg-white border-2 border-gray-200 hover:border-primary-600 rounded-xl p-6 transition-all duration-300">
              <div className="bg-blue-100 group-hover:bg-blue-600 w-16 h-16 rounded-lg flex items-center justify-center mb-4 transition-colors">
                <svg className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Real Estate</h3>
              <p className="text-gray-600 text-sm">
                Commercial and residential property investments with strong appreciation potential
              </p>
            </div>

            <div className="group bg-white border-2 border-gray-200 hover:border-primary-600 rounded-xl p-6 transition-all duration-300">
              <div className="bg-green-100 group-hover:bg-green-600 w-16 h-16 rounded-lg flex items-center justify-center mb-4 transition-colors">
                <svg className="h-8 w-8 text-green-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Financial Services</h3>
              <p className="text-gray-600 text-sm">
                Banking, insurance, and fintech companies driving financial innovation
              </p>
            </div>

            <div className="group bg-white border-2 border-gray-200 hover:border-primary-600 rounded-xl p-6 transition-all duration-300">
              <div className="bg-amber-100 group-hover:bg-amber-600 w-16 h-16 rounded-lg flex items-center justify-center mb-4 transition-colors">
                <svg className="h-8 w-8 text-amber-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Agribusiness</h3>
              <p className="text-gray-600 text-sm">
                Sustainable agriculture and food production ventures with global reach
              </p>
            </div>

            <div className="group bg-white border-2 border-gray-200 hover:border-primary-600 rounded-xl p-6 transition-all duration-300">
              <div className="bg-purple-100 group-hover:bg-purple-600 w-16 h-16 rounded-lg flex items-center justify-center mb-4 transition-colors">
                <svg className="h-8 w-8 text-purple-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Technology</h3>
              <p className="text-gray-600 text-sm">
                Cutting-edge tech companies and digital transformation leaders
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Downloadable Resources */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
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
                <svg className="h-6 w-6 text-gray-400 group-hover:text-primary-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                <svg className="h-6 w-6 text-gray-400 group-hover:text-primary-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                <svg className="h-6 w-6 text-gray-400 group-hover:text-primary-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Schedule a consultation with one of our investment advisors to discuss your financial goals.
            </p>
            <a
              href="/contact"
              className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-200"
            >
              Schedule Consultation
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
