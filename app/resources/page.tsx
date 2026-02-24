'use client';

import { useState } from 'react';
import { 
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  EnvelopeIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { generateFAQSchema } from '@/lib/seo';

const articles = [
  {
    id: 1,
    title: 'Coffee Market Cycle Basics',
    category: 'Market Insights',
    excerpt: 'Understand coffee price cycles and how disciplined timing supports capital protection.',
    date: 'November 15, 2025',
    readTime: '5 min read',
  },
  {
    id: 2,
    title: 'Cocoa Investment Risk Controls',
    category: 'Investment Strategy',
    excerpt: 'Learn practical controls we use to manage cocoa exposure and protect member capital.',
    date: 'November 10, 2025',
    readTime: '7 min read',
  },
  {
    id: 3,
    title: 'Digital Compliance Workflow',
    category: 'Tax Planning',
    excerpt: 'How KYC, dual approvals, and digital records are used in our daily operations.',
    date: 'November 5, 2025',
    readTime: '6 min read',
  },
  {
    id: 4,
    title: 'From SHG to SACCO: Growth Pathway',
    category: 'Growth Roadmap',
    excerpt: 'A practical overview of our transition plan from investment club to licensed institutions.',
    date: 'October 28, 2025',
    readTime: '8 min read',
  },
];

const faqs = [
  {
    question: 'What is the minimum investment required?',
    answer: 'Our current minimum contribution is UGX 1M per participating member under our investment-club model.',
  },
  {
    question: 'What fees do you charge?',
    answer: 'We use a transparent fee and cost structure communicated clearly to members before participation. There are no hidden charges.',
  },
  {
    question: 'How often will I receive portfolio updates?',
    answer: 'Members receive periodic performance and compliance updates through our digital workflow, including transaction records and portfolio summaries.',
  },
  {
    question: 'What is your investment philosophy?',
    answer: 'Our current strategy focuses on disciplined commodity investing in coffee and cocoa, supported by treasury allocation, risk controls, and transparent governance.',
  },
  {
    question: 'Are my investments insured?',
    answer: 'Investments carry market risk, but pooled funds are managed through regulated bank channels with digital controls, approvals, and reconciliation processes to protect capital.',
  },
  {
    question: 'Can I access my funds at any time?',
    answer: 'Access depends on the active investment cycle and agreed participation terms. We communicate liquidity windows and timelines clearly before deployment.',
  },
];

export default function Resources() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Generate FAQ schema for SEO
  const faqSchema = generateFAQSchema(faqs);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubscribed(true);
        setEmail('');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      alert('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      {/* Hero Section */}
      <section className="bg-[#1A237E] text-white section-padding">
        <div className="container-custom text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#C5A021] mb-6">Investment Resources</h1>
          <p className="text-base sm:text-lg md:text-xl text-[#F5F5F5] max-w-3xl mx-auto">
            Practical resources to help members understand our coffee and cocoa strategy, governance controls, and growth roadmap
          </p>
        </div>
      </section>

      {/* Articles Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="flex items-center mb-8">
            <DocumentTextIcon className="h-8 w-8 text-[#1A237E] mr-3" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Latest Articles</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="mb-4">
                  <span className="inline-block bg-[#F5F5F5] text-[#1A237E] text-xs font-semibold px-3 py-1 rounded-full">
                    {article.category}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {article.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{article.date}</span>
                  <span>{article.readTime}</span>
                </div>
                <button className="mt-4 text-[#2E7D32] font-semibold hover:text-[#276A2A]">
                  Read More →
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="flex items-center mb-8">
            <QuestionMarkCircleIcon className="h-8 w-8 text-[#1A237E] mr-3" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-900 pr-8">
                    {faq.question}
                  </span>
                  <svg
                    className={`h-6 w-6 text-[#2E7D32] flex-shrink-0 transform transition-transform ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto bg-[#1A237E] rounded-2xl p-6 sm:p-8 md:p-12 text-white text-center border border-[#C5A021]/35">
            <EnvelopeIcon className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-xl text-[#F5F5F5] mb-8">
              Get updates on commodity opportunities, compliance milestones, and portfolio insights.
            </p>

            {subscribed ? (
              <div className="flex items-center justify-center space-x-2 text-green-200">
                <CheckCircleIcon className="h-6 w-6" />
                <span className="text-lg font-semibold">
                  Successfully subscribed! Check your email.
                </span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-6 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-white text-[#1A237E] px-8 py-3 rounded-lg font-semibold hover:bg-[#F5F5F5] transition-colors duration-200 disabled:opacity-50"
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Investment Guides & Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Download our comprehensive guides and tools to enhance your investment knowledge
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="bg-[#F5F5F5] w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <DocumentTextIcon className="h-8 w-8 text-[#1A237E]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Commodity Investment Guide 2026
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Practical guide to coffee and cocoa investment strategy
              </p>
              <button className="text-[#2E7D32] font-semibold hover:text-[#276A2A]">
                Download PDF
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="bg-[#F5F5F5] w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <DocumentTextIcon className="h-8 w-8 text-[#1A237E]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Compliance Checklist
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Step-by-step controls for KYC, approvals, and reporting
              </p>
              <button className="text-[#2E7D32] font-semibold hover:text-[#276A2A]">
                Access Tool
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="bg-[#F5F5F5] w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <DocumentTextIcon className="h-8 w-8 text-[#1A237E]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Portfolio Progress Report
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Current performance summary and roadmap milestones
              </p>
              <button className="text-[#2E7D32] font-semibold hover:text-[#276A2A]">
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
