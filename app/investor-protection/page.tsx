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
  description: 'Learn how CapitalMasters currently protects member investments through step-by-step compliance, digital controls, and regulated banking channels while scaling from Self Help stage.',
  keywords: 'investor protection, self help group, investment club, digital compliance, uganda investment club, capitalmasters',
};

export default function InvestorProtection() {
  const protectionMeasures = [
    {
      icon: ShieldCheckIcon,
      title: 'Step-by-Step Compliance',
      description: 'Controls that match our current Self Help stage operations',
      details: [
        'Member KYC onboarding and identity verification before investing',
        'Dual approval workflow for investment disbursements',
        'Digital transaction logs with transparent member visibility',
        'Periodic internal compliance checks and governance reviews',
        'Documented pathway from SHG to SACCO and later CMA licensing',
      ],
    },
    {
      icon: BuildingLibraryIcon,
      title: 'Banking & Custody Discipline',
      description: 'Member funds are held and tracked through regulated channels',
      details: [
        'Pooled funds are stored in regulated bank accounts',
        'No cash-box or padlock operations in our model',
        'Dedicated records for member contributions and returns',
        'Scheduled reconciliations against bank statements',
        'Clear audit trail for every capital movement',
      ],
    },
    {
      icon: UserGroupIcon,
      title: 'Transparent Governance',
      description: 'Collective oversight protects member savings and investment capital',
      details: [
        'Committee-led approvals and documented meeting decisions',
        'Investment policy focused on disciplined commodity exposure',
        'Open communication on performance and risk status',
        'Member-first governance with accountability standards',
        'Quarterly review cadence for strategy and controls',
      ],
    },
    {
      icon: ChartBarIcon,
      title: 'Capital Preservation & Returns',
      description: 'Risk controls designed to sustain returns and protect principal',
      details: [
        'Commodity investment focus on coffee and cocoa in current stage',
        'Position sizing and phased deployment of member capital',
        'Market monitoring and structured exit planning',
        'Conservative controls to support minimum 8% ROI target',
        'Continuous updates to members on portfolio risk and return',
      ],
    },
    {
      icon: LockClosedIcon,
      title: 'Digital Security Measures',
      description: 'Fintech-enabled operations with traceable and secure workflows',
      details: [
        'All transactions processed through digital channels',
        'Restricted access controls for financial records',
        'Time-stamped transaction history for accountability',
        'Protected member data with role-based permissions',
        'Operational alerts for unusual activity and exceptions',
      ],
    },
    {
      icon: DocumentCheckIcon,
      title: 'Member Agreements',
      description: 'Clear terms that define rights, obligations, and reporting',
      details: [
        'Documented contribution and distribution framework',
        'Clear disclosure of investment risks and timelines',
        'Defined approval and escalation procedures',
        'Transparent communication standards and reporting schedule',
        'Member responsibilities clearly outlined',
      ],
    },
    {
      icon: ScaleIcon,
      title: 'Governance & Legal Pathway',
      description: 'Structured legal progression aligned to annual growth stages',
      details: [
        'Year 1-2: Investment club governance under local registration',
        'Year 3: SACCO transition process and UMRA Tier 4 pathway',
        'Year 4: Pre-MDI controls and audit readiness',
        'Year 5+: Fund manager licensing pathway through CMA',
        'Compliance milestones tracked and communicated to members',
      ],
    },
    {
      icon: CheckBadgeIcon,
      title: 'Continuous Monitoring',
      description: 'Regular oversight to keep operations transparent and disciplined',
      details: [
        'Routine reconciliation and portfolio performance checks',
        'Exception tracking for missed approvals or data gaps',
        'Periodic member account and contribution reviews',
        'Scheduled governance and compliance status updates',
        'Quarterly performance reporting to all members',
      ],
    },
  ];

  const compliancePath = [
    {
      authority: 'Current Stage',
      license: 'Self Help Group / Investment Club',
      description: 'Operating with internal governance, digital controls, and regulated banking channels',
    },
    {
      authority: 'Near-Term Pathway',
      license: 'SACCO Tier 4 Progression',
      description: 'Preparing governance and operating standards required for Tier 4 SACCO transition',
    },
    {
      authority: 'Mid-Term Pathway',
      license: 'Pre-MDI Readiness',
      description: 'Scaling systems, controls, and audits in preparation for the next regulatory stage',
    },
    {
      authority: 'Long-Term Pathway',
      license: 'CMA Fund Manager License',
      description: 'Targeting full investment and asset management licensing as the business matures',
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-[#1A237E] text-white section-padding">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#2E7D32] rounded-full mb-6">
              <ShieldCheckIcon className="h-10 w-10 text-white" />
            </div>
            <h1 className="heading-1 mb-6 text-[#C5A021]">
              Investor Protection
            </h1>
            <p className="text-xl text-[#F5F5F5] mb-8 leading-relaxed">
              Your trust is our priority. CapitalMasters currently operates at Self Help stage with digital-first controls, transparent governance, and regulated banking practices to protect member capital.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <p className="text-sm text-[#F5F5F5]/80">Current Stage</p>
                <p className="text-2xl font-bold">Self Help Group</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <p className="text-sm text-[#F5F5F5]/80">Client Assets Protected</p>
                <p className="text-2xl font-bold">UGX 900M+</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <p className="text-sm text-[#F5F5F5]/80">Client Return Floor</p>
                <p className="text-2xl font-bold">8% Minimum ROI</p>
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
                At CapitalMasters, investor protection starts with practical controls that match our current operating stage. We run as a Self Help Group investment club with disciplined approvals, transparent records, and clear accountability across all member transactions.
              </p>
              <p className="text-lg leading-relaxed">
                Our model follows the same hierarchy shown on the homepage: security first, then growth, then legacy. We use digital tools, regulated bank custody, and periodic governance reviews to safeguard member funds while scaling toward SACCO and future fund-manager licensing stages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Regulatory Licenses */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">Compliance Pathway</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our compliance position is communicated honestly: current-stage controls today, with clear milestones toward higher regulatory tiers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {compliancePath.map((license, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[#2E7D32]">
                <div className="flex items-start space-x-4">
                  <div className="bg-[#F5F5F5] rounded-lg p-3 flex-shrink-0">
                    <CheckBadgeIcon className="h-6 w-6 text-[#2E7D32]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{license.authority}</h3>
                    <p className="text-sm text-[#1A237E] font-semibold mb-2">{license.license}</p>
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
              We protect member investments through transparent controls, digital execution, and disciplined governance that match our current stage.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {protectionMeasures.map((measure, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="bg-[#1A237E] rounded-lg p-3 flex-shrink-0">
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
      <section className="section-padding bg-gradient-to-r from-[#2E7D32] to-[#1A237E] text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <ShieldCheckIcon className="h-16 w-16 mx-auto mb-6 text-[#C5A021]" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Your Trust, Our Responsibility
            </h2>
            <p className="text-xl text-[#F5F5F5] mb-8 leading-relaxed">
              CapitalMasters commits to protecting member capital through digital controls, transparent governance, regulated banking practices, and disciplined investment execution. As we scale year by year, each compliance milestone is designed to strengthen protection for every client.
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 inline-block">
              <p className="text-sm text-[#F5F5F5]/80 mb-2">Current Commitments</p>
              <p className="text-2xl font-bold">100 Clients • UGX 900M+ • 8% Minimum ROI</p>
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
              We are available to explain our current compliance controls, governance model, and growth pathway in detail.
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
