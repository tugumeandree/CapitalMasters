'use client';

import { motion } from 'framer-motion';

const roadmapItems = [
  {
    year: 'Year 1',
    stage: 'Investment Club Foundations',
    target: 'UGX 50M savings',
    regulator: 'Local CDO',
    actions: [
      'Operate CapitalMasters as an investment club with 20 members',
      'Set a minimum investment of UGX 1M per member in Year 1',
      'Deploy pooled capital into commodities (coffee and cocoa)',
      'Run all transactions through fintech tools and regulated bank channels',
    ],
  },
  {
    year: 'Year 2',
    stage: 'Scale Operations',
    target: 'UGX 200M savings',
    regulator: 'UMRA oversight',
    actions: [
      'Grow membership to 30 and split groups if needed',
      'Link to SACCO for access to structured lending',
      'Apply for and secure a UIA license as part of formal growth',
      'Invest 30% in CMA-approved bonds and shares',
      'Use elected committee governance with 60% women and digital records',
    ],
  },
  {
    year: 'Year 3',
    stage: 'SACCO Tier 4 Transition',
    target: 'UGX 500M+ savings',
    regulator: 'UMRA',
    actions: [
      'Register under the Cooperatives Act and obtain UMRA Tier 4 license',
      'Maintain 10% core capital of assets and submit business plan',
      'Launch member dividends and external loan services',
      'Hold annual general meeting (AGM) with compliance reporting',
    ],
  },
  {
    year: 'Year 4',
    stage: 'Pre-MDI Preparation',
    target: 'UGX 1B assets',
    regulator: 'Prep BoU',
    actions: [
      'Expand membership to 200+ and digitize operations',
      'Strengthen compliance through Tier 2/3-style audits',
      'Develop full risk policy and governance controls',
      'Scale revenue through fees plus treasury bill yield compounding',
    ],
  },
  {
    year: 'Year 5+',
    stage: 'Fund Manager Expansion',
    target: 'UGX 2B+ assets',
    regulator: 'CMA',
    actions: [
      'Incorporate CapitalMasters as a private limited company',
      'Apply for CMA fund manager licensing with required capital',
      'Set up fit-and-proper board and directors',
      'Manage collective investment schemes and portfolio mandates',
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function GrowthRoadmapSection() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">CapitalMasters Growth Roadmap</h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            CapitalMasters, a Ugandan self-help group (SHG) investment club, follows this annual roadmap to grow into a SACCO, then an MDI, and eventually a full investment and asset management company.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid lg:grid-cols-2 gap-6"
        >
          {roadmapItems.map((item) => (
            <motion.article
              key={item.year}
              variants={itemVariants}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h3 className="text-xl font-bold text-gray-900">{item.year}: {item.stage}</h3>
                <span className="text-sm font-semibold bg-primary-50 text-primary-700 px-3 py-1 rounded-full">
                  {item.target}
                </span>
              </div>

              <ul className="space-y-2 mb-4 text-gray-700 text-sm sm:text-base">
                {item.actions.map((action) => (
                  <li key={action} className="flex items-start">
                    <span className="mr-2 text-primary-600">•</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>

              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-700">Regulator:</span> {item.regulator}
              </p>
            </motion.article>
          ))}
        </motion.div>

        <div className="mt-12 bg-white rounded-xl shadow-md overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead className="bg-primary-600 text-white">
              <tr>
                <th className="px-4 py-3 font-semibold">Year</th>
                <th className="px-4 py-3 font-semibold">Stage</th>
                <th className="px-4 py-3 font-semibold">Key Actions</th>
                <th className="px-4 py-3 font-semibold">Capital Target</th>
                <th className="px-4 py-3 font-semibold">Regulator</th>
              </tr>
            </thead>
            <tbody>
              {roadmapItems.map((item, index) => (
                <tr key={`${item.year}-row`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-gray-900 font-semibold">{item.year}</td>
                  <td className="px-4 py-3 text-gray-700">{item.stage}</td>
                  <td className="px-4 py-3 text-gray-700">{item.actions[0]}</td>
                  <td className="px-4 py-3 text-gray-700">{item.target}</td>
                  <td className="px-4 py-3 text-gray-700">{item.regulator}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 bg-[#1A237E] text-white rounded-xl p-6 sm:p-8 border border-[#C5A021]/35">
          <h3 className="text-2xl font-bold text-[#C5A021] mb-3">Current Protection & Governance</h3>
          <p className="text-[#F5F5F5] leading-relaxed">
            CapitalMasters currently operates as a Self-help Group (SHG) and investment club using strict internal governance and regulated financial practices aligned with UMRA guidance. We enforce transparency, collective oversight, low-risk investment discipline, and zero tolerance for arrears through a digital recordkeeping workflow. All transactions are digital and pooled funds are held in regulated bank accounts for safety.
          </p>
        </div>
      </div>
    </section>
  );
}
