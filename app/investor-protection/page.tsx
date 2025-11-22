import type { Metadata } from 'next';
import {
  ShieldCheckIcon,
  BuildingLibraryIcon,
  LockClosedIcon,
  DocumentCheckIcon,
  ChartBarIcon,
  UserGroupIcon,
  ScaleIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Investor Protection | CapitalMasters',
  description: 'Learn how CapitalMasters safeguards your investments through regulatory compliance, fund segregation, transparent governance, and comprehensive security measures.',
  keywords: 'investor protection, investment security, regulatory compliance, fund safety, CMA Uganda, UIA',
};

export default function InvestorProtection() {
  const protectionMeasures = [
    {
      icon: ShieldCheckIcon,
      title: 'Regulatory Compliance',
      description: 'Licensed and supervised by leading regulatory authorities',
      details: [
        'Licensed by Uganda Capital Markets Authority (CMA)',
        'Registered with Uganda Investment Authority (UIA)',
        'Member of East African Securities Regulatory Authorities (EASRA)',
        'Annual regulatory audits and compliance reviews',
        'Transparent reporting to regulatory bodies',
      ],
    },
    {
      icon: BuildingLibraryIcon,
      title: 'Custody & Fund Segregation',
      description: 'Your funds are protected and kept separate from company assets',
      details: [
        'Client funds held in segregated trust accounts',
        'Partnership with top-tier custodian banks',
        'Complete separation from company operating funds',
        'Third-party verification of client holdings',
        'Daily reconciliation of client accounts',
      ],
    },
    {
      icon: UserGroupIcon,
      title: 'Transparent Governance',
      description: 'Strong oversight and ethical business practices',
      details: [
        'Independent Board of Directors with fiduciary duty',
        'Audit and Risk Committee oversight',
        'Regular internal and external audits',
        'Clear investment policy statements',
        'Transparent fee structures and disclosures',
      ],
    },
    {
      icon: ChartBarIcon,
      title: 'Risk Management',
      description: 'Comprehensive frameworks to protect your investments',
      details: [
        'Robust internal control systems',
        'Continuous portfolio monitoring and rebalancing',
        'Diversification strategies to minimize risk',
        'Independent third-party risk assessments',
        'Stress testing and scenario analysis',
      ],
    },
    {
      icon: LockClosedIcon,
      title: 'Security Measures',
      description: 'Advanced technology protecting your data and transactions',
      details: [
        'Bank-level 256-bit SSL encryption',
        'Multi-factor authentication (MFA) for account access',
        'Regular security audits and penetration testing',
        'GDPR and data protection compliance',
        '24/7 security monitoring and incident response',
      ],
    },
    {
      icon: DocumentCheckIcon,
      title: 'Client Agreements',
      description: 'Clear, transparent contracts protecting your interests',
      details: [
        'Comprehensive investment agreements',
        'Clear disclosure of all risks and fees',
        'Transparent terms and conditions',
        'Defined dispute resolution procedures',
        'Client rights and obligations clearly outlined',
      ],
    },
    {
      icon: ScaleIcon,
      title: 'Insurance & Legal Safeguards',
      description: 'Additional layers of protection for your peace of mind',
      details: [
        'Professional indemnity insurance coverage',
        'Fidelity insurance against fraud or dishonesty',
        'Errors and omissions insurance',
        'Dedicated legal team for dispute resolution',
        'Access to independent arbitration services',
      ],
    },
    {
      icon: CheckBadgeIcon,
      title: 'Continuous Monitoring',
      description: 'Ongoing vigilance to protect your investments',
      details: [
        'Real-time portfolio performance tracking',
        'Automated compliance monitoring systems',
        'Regular client account reviews',
        'Proactive risk alerts and notifications',
        'Quarterly performance and compliance reports',
      ],
    },
  ];

  const licenses = [
    {
      authority: 'Uganda Capital Markets Authority (CMA)',
      license: 'License No: CMA/FD/2024/001',
      description: 'Authorized fund manager and investment advisor',
    },
    {
      authority: 'Uganda Investment Authority (UIA)',
      license: 'License No: UIA/INV/2024/789',
      description: 'Registered investment company',
    },
    {
      authority: 'Securities and Exchange Commission (SEC)',
      license: 'SEC Registration No: 801-123456',
      description: 'Registered Investment Adviser',
    },
    {
      authority: 'Financial Industry Regulatory Authority (FINRA)',
      license: 'FINRA Member Firm',
      description: 'Broker-dealer registration',
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white section-padding">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-600 rounded-full mb-6">
              <ShieldCheckIcon className="h-10 w-10 text-white" />
            </div>
            <h1 className="heading-1 mb-6">
              Investor Protection
            </h1>
            <p className="text-xl text-primary-100 mb-8 leading-relaxed">
              Your trust is our priority. CapitalMasters is committed to safeguarding your investments through rigorous regulatory compliance, advanced security measures, and transparent business practices.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <p className="text-sm text-primary-200">Licensed & Regulated</p>
                <p className="text-2xl font-bold">4 Authorities</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <p className="text-sm text-primary-200">Client Assets Protected</p>
                <p className="text-2xl font-bold">$2.5B+</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <p className="text-sm text-primary-200">Security Rating</p>
                <p className="text-2xl font-bold">A+</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-2 mb-6 text-center">Our Commitment to Your Security</h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="text-lg leading-relaxed mb-4">
                At CapitalMasters, we understand that entrusting your wealth to an investment firm is a significant decision. Your financial security is our paramount concern, and we have implemented comprehensive measures to protect your investments at every level.
              </p>
              <p className="text-lg leading-relaxed">
                We operate under strict regulatory oversight, employ best-in-class security technologies, and maintain transparent governance structures. Our multi-layered approach to investor protection ensures that your assets are safeguarded against operational, financial, and cyber risks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Regulatory Licenses */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">Licensed & Regulated</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              CapitalMasters operates under the supervision of multiple regulatory authorities, ensuring the highest standards of compliance and investor protection.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {licenses.map((license, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-primary-600">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 rounded-lg p-3 flex-shrink-0">
                    <CheckBadgeIcon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{license.authority}</h3>
                    <p className="text-sm text-primary-600 font-semibold mb-2">{license.license}</p>
                    <p className="text-sm text-gray-600">{license.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Protection Measures Grid */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">Comprehensive Protection Framework</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our multi-faceted approach ensures your investments are protected through regulatory compliance, operational excellence, and cutting-edge security.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {protectionMeasures.map((measure, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="bg-primary-600 rounded-lg p-3 flex-shrink-0">
                    <measure.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{measure.title}</h3>
                    <p className="text-gray-600 mb-4">{measure.description}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {measure.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckBadgeIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment Statement */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <ShieldCheckIcon className="h-16 w-16 mx-auto mb-6 text-primary-200" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Your Trust, Our Responsibility
            </h2>
            <p className="text-xl text-primary-100 mb-8 leading-relaxed">
              CapitalMasters adheres to the highest ethical standards and fiduciary duty. We are committed to acting in your best interests at all times, maintaining transparency in all our operations, and continuously enhancing our protection measures.
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 inline-block">
              <p className="text-sm text-primary-200 mb-2">24/7 Client Support & Security Monitoring</p>
              <p className="text-2xl font-bold">Always Protecting Your Interests</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-2 mb-6">Questions About Investor Protection?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Our compliance team is here to answer any questions about how we protect your investments.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/contact" className="btn-primary">
                Contact Compliance Team
              </a>
              <a href="/compliance" className="btn-outline">
                View Full Compliance Details
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
