import { Metadata } from 'next';
import { ShieldCheckIcon, DocumentTextIcon, ScaleIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Compliance & Legal - CapitalMasters',
  description: 'CapitalMasters compliance information, privacy policy, terms of service, and current regulatory pathway disclosures.',
};

export default function Compliance() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-[#1A237E] text-white section-padding">
        <div className="container-custom text-center">
          <h1 className="text-5xl font-bold text-[#C5A021] mb-6">Compliance & Legal</h1>
          <p className="text-xl text-[#F5F5F5] max-w-3xl mx-auto">
            Our commitment to transparency, digital controls, and responsible growth from Self Help stage to higher regulatory tiers
          </p>
        </div>
      </section>

      {/* Licensing Section */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-5xl">
          <div className="flex items-center mb-8">
            <ShieldCheckIcon className="h-8 w-8 text-[#1A237E] mr-3" />
            <h2 className="text-4xl font-bold text-gray-900">Current Compliance Status</h2>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              CapitalMasters currently operates as a Self Help Group (SHG) investment club and is not yet a fully licensed fund manager. Our present controls are built around transparent governance, digital transaction workflows, and regulated banking channels.
            </p>

            <div className="bg-[#F5F5F5] border-l-4 border-[#2E7D32] p-6 my-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Regulatory Pathway & Position</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-[#2E7D32] mr-2">•</span>
                  <div>
                    <strong>Current Stage:</strong> Self Help Group / Investment Club
                    <br />
                    <span className="text-sm text-gray-600">Operating with internal governance, digital controls, and regulated bank channels</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#2E7D32] mr-2">•</span>
                  <div>
                    <strong>Year 2 Objective:</strong> UIA License
                    <br />
                    <span className="text-sm text-gray-600">Formal growth milestone in the scale-operations phase</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#2E7D32] mr-2">•</span>
                  <div>
                    <strong>Year 3 Objective:</strong> SACCO Tier 4 Pathway (UMRA)
                    <br />
                    <span className="text-sm text-gray-600">Governance and capital standards for formal cooperative transition</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#2E7D32] mr-2">•</span>
                  <div>
                    <strong>Year 4 Objective:</strong> Pre-MDI Readiness
                    <br />
                    <span className="text-sm text-gray-600">Controls and audit maturity before higher-tier licensing</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#2E7D32] mr-2">•</span>
                  <div>
                    <strong>Year 5+ Objective:</strong> CMA Fund Manager License
                    <br />
                    <span className="text-sm text-gray-600">Long-term licensing target as institutional capacity expands</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 my-8">
              <h4 className="font-bold text-gray-900 mb-3">Compliance Statement</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                CapitalMasters does not currently represent itself as a fully licensed fund manager. We operate with transparent internal governance and digital controls while progressing through our regulatory roadmap. All member funds are handled through regulated banking channels and documented workflows to protect investor interests.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Operational Controls</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our compliance controls include KYC onboarding, dual-approval transactions, digital recordkeeping, periodic reconciliation, and scheduled governance reviews. These controls are designed to protect principal and support our minimum 8% ROI objective.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Policy */}
      <section id="privacy" className="section-padding bg-gray-50">
        <div className="container-custom max-w-5xl">
          <div className="flex items-center mb-8">
            <ScaleIcon className="h-8 w-8 text-[#1A237E] mr-3" />
            <h2 className="text-4xl font-bold text-gray-900">Privacy Policy</h2>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-sm text-gray-500 mb-4">Last Updated: November 22, 2025</p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Information We Collect</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              CapitalMasters collects personal information necessary to provide investment management services, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>Personal identification information (name, address, national ID/passport)</li>
              <li>Financial information (income, assets, investment experience)</li>
              <li>Account information and transaction history</li>
              <li>Communications and correspondence with our firm</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How We Use Your Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use your information to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>Provide investment-club services and portfolio operations</li>
              <li>Process transactions and maintain your account</li>
              <li>Comply with legal and regulatory requirements</li>
              <li>Communicate with you about your account and our services</li>
              <li>Improve our services and customer experience</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Information Sharing</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not sell or share your personal information with third parties for marketing purposes. 
              We may share information with:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>Service providers who assist in our business operations (with strict confidentiality agreements)</li>
              <li>Regulatory authorities as required by law</li>
              <li>Financial institutions necessary for transaction processing</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Data Security</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We maintain physical, electronic, and procedural safeguards to protect your information. 
              Our security measures include encryption, secure data centers, access controls, and regular security audits.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Your Rights</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>Access and review your personal information</li>
              <li>Request corrections to inaccurate information</li>
              <li>Opt-out of certain information sharing (with limitations)</li>
              <li>Close your account and request deletion of information (subject to legal requirements)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Terms of Service */}
      <section id="terms" className="section-padding bg-white">
        <div className="container-custom max-w-5xl">
          <div className="flex items-center mb-8">
            <DocumentTextIcon className="h-8 w-8 text-[#1A237E] mr-3" />
            <h2 className="text-4xl font-bold text-gray-900">Terms of Service</h2>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-sm text-gray-500 mb-4">Last Updated: November 22, 2025</p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Investment Advisory Agreement</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              By participating with CapitalMasters, you agree to the documented member terms that define contribution requirements, service scope, fee framework, governance rules, and reporting expectations.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Investment Risk Disclosure</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>All investments involve risk, including the possible loss of principal.</strong> There is no guarantee 
              that any investment strategy will achieve its objectives. Past performance is not indicative of future results.
            </p>

            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 my-8">
              <h4 className="font-bold text-gray-900 mb-2">Important Risk Considerations:</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Market risk: Investment values fluctuate with market conditions</li>
                <li>• Liquidity risk: Some investments may be difficult to sell quickly</li>
                <li>• Commodity price risk: Coffee and cocoa prices can move materially</li>
                <li>• Operational risk: Delays or execution gaps can affect outcomes</li>
                <li>• Counterparty risk: Buyers/suppliers may underperform contractual obligations</li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Fee Structure</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our fee and cost structure is disclosed transparently to members before participation. Any applicable operational costs are documented and reported through our digital workflow.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Client Responsibilities</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Clients are responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>Providing accurate and complete financial information</li>
              <li>Notifying us of any changes in financial circumstances or investment objectives</li>
              <li>Reviewing account statements and confirmations promptly</li>
              <li>Understanding the risks associated with investments</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Termination</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Either party may terminate participation subject to the agreed terms and active investment cycle conditions. Any applicable settlement process is documented transparently.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Dispute Resolution</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Disputes are handled using the dispute-resolution process defined in member terms and applicable local legal frameworks.
            </p>
          </div>
        </div>
      </section>

      {/* Contact for Questions */}
      <section className="section-padding bg-[#2E7D32] text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Questions About Compliance?</h2>
          <p className="text-xl text-[#F5F5F5] mb-8 max-w-2xl mx-auto">
            Our team is available to explain our current controls, regulatory pathway, and your rights as a member or client.
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-[#1A237E] px-8 py-4 rounded-lg font-semibold hover:bg-[#F5F5F5] transition-colors duration-200"
          >
            Contact Compliance Team
          </a>
        </div>
      </section>
    </div>
  );
}
