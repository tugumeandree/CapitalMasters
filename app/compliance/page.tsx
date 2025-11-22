import { Metadata } from 'next';
import { ShieldCheckIcon, DocumentTextIcon, ScaleIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Compliance & Legal - CapitalMasters',
  description: 'CapitalMasters compliance information, privacy policy, terms of service, and regulatory disclosures.',
};

export default function Compliance() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white section-padding">
        <div className="container-custom text-center">
          <h1 className="text-5xl font-bold mb-6">Compliance & Legal</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Our commitment to transparency, regulatory compliance, and protecting your interests
          </p>
        </div>
      </section>

      {/* Licensing Section */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-5xl">
          <div className="flex items-center mb-8">
            <ShieldCheckIcon className="h-8 w-8 text-primary-600 mr-3" />
            <h2 className="text-4xl font-bold text-gray-900">Licensing & Registration</h2>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              CapitalMasters is a registered investment advisor with the Securities and Exchange Commission (SEC) 
              under the Investment Advisers Act of 1940. Our CRD number is 123456.
            </p>

            <div className="bg-primary-50 border-l-4 border-primary-600 p-6 my-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Regulatory Bodies & Licensing</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <div>
                    <strong>Securities and Exchange Commission (SEC)</strong> - Registered Investment Advisor
                    <br />
                    <span className="text-sm text-gray-600">CRD Number: 123456</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <div>
                    <strong>Financial Industry Regulatory Authority (FINRA)</strong> - Member Firm
                    <br />
                    <span className="text-sm text-gray-600">Member ID: 78910</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <div>
                    <strong>Securities Investor Protection Corporation (SIPC)</strong> - Member
                    <br />
                    <span className="text-sm text-gray-600">Protection up to $500,000</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <div>
                    <strong>Uganda Investment Authority (UIA)</strong> - Licensed Investment Company
                    <br />
                    <span className="text-sm text-gray-600">License No: UIA/2024/001</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <div>
                    <strong>Capital Markets Authority (CMA)</strong> - Regulated Entity
                    <br />
                    <span className="text-sm text-gray-600">CMA Registration: CMA/FMD/2024/045</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 my-8">
              <h4 className="font-bold text-gray-900 mb-3">Regulatory Compliance Statement</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                CapitalMasters is fully licensed and authorized to operate as an investment management firm 
                under the regulatory oversight of the Uganda Investment Authority (UIA) and Capital Markets 
                Authority (CMA). We adhere to all applicable laws, regulations, and industry standards to 
                ensure the highest level of investor protection and operational integrity. Our compliance 
                program is regularly audited by independent third parties to maintain transparency and accountability.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Professional Credentials</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our investment professionals hold various industry certifications including CFA (Chartered Financial Analyst), 
              CFP (Certified Financial Planner), and CAIA (Chartered Alternative Investment Analyst) designations.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Policy */}
      <section id="privacy" className="section-padding bg-gray-50">
        <div className="container-custom max-w-5xl">
          <div className="flex items-center mb-8">
            <ScaleIcon className="h-8 w-8 text-primary-600 mr-3" />
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
              <li>Provide investment advisory services and portfolio management</li>
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
            <DocumentTextIcon className="h-8 w-8 text-primary-600 mr-3" />
            <h2 className="text-4xl font-bold text-gray-900">Terms of Service</h2>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-sm text-gray-500 mb-4">Last Updated: November 22, 2025</p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Investment Advisory Agreement</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              By engaging CapitalMasters for investment advisory services, you agree to the terms outlined in your 
              Investment Advisory Agreement. This agreement specifies the scope of services, fee structure, and terms of engagement.
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
                <li>• Interest rate risk: Bond values decrease when interest rates rise</li>
                <li>• Currency risk: International investments subject to exchange rate fluctuations</li>
                <li>• Credit risk: Possibility of issuer default or credit downgrade</li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Fee Structure</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our advisory fees are based on assets under management and are detailed in your Investment Advisory Agreement. 
              Fees are typically charged quarterly in advance and may be tax-deductible. Additional expenses may include 
              custodial fees, transaction costs, and fund expenses.
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
              Either party may terminate the advisory relationship with written notice. Upon termination, 
              fees will be prorated to the date of termination, and any unearned fees will be refunded.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Arbitration</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Disputes may be subject to arbitration in accordance with the rules of FINRA or another 
              agreed-upon arbitration forum, as specified in your Investment Advisory Agreement.
            </p>
          </div>
        </div>
      </section>

      {/* Contact for Questions */}
      <section className="section-padding bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Questions About Compliance?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Our compliance team is available to answer any questions about our regulatory obligations and your rights.
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-200"
          >
            Contact Compliance Team
          </a>
        </div>
      </section>
    </div>
  );
}
