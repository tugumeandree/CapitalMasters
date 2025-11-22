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
    title: 'Understanding Market Volatility',
    category: 'Market Insights',
    excerpt: 'Learn how to navigate market fluctuations and maintain a steady investment strategy.',
    date: 'November 15, 2025',
    readTime: '5 min read',
  },
  {
    id: 2,
    title: 'Diversification Strategies for 2025',
    category: 'Investment Strategy',
    excerpt: 'Explore effective diversification techniques to optimize your portfolio performance.',
    date: 'November 10, 2025',
    readTime: '7 min read',
  },
  {
    id: 3,
    title: 'Tax-Efficient Investing Guide',
    category: 'Tax Planning',
    excerpt: 'Maximize your after-tax returns with smart investment strategies and planning.',
    date: 'November 5, 2025',
    readTime: '6 min read',
  },
  {
    id: 4,
    title: 'Retirement Planning Essentials',
    category: 'Retirement',
    excerpt: 'Key considerations for building a secure retirement portfolio at any age.',
    date: 'October 28, 2025',
    readTime: '8 min read',
  },
];

const faqs = [
  {
    question: 'What is the minimum investment required?',
    answer: 'Our minimum investment requirement varies by service. For individual portfolio management, the minimum is typically $250,000. However, we offer various investment solutions to accommodate different investment levels.',
  },
  {
    question: 'What fees do you charge?',
    answer: 'Our fee structure is transparent and competitive. We typically charge an annual management fee based on assets under management, ranging from 0.75% to 1.25%. There are no hidden fees or commissions.',
  },
  {
    question: 'How often will I receive portfolio updates?',
    answer: 'Clients receive quarterly performance reports and account statements. Additionally, you have 24/7 access to your portfolio through our secure client portal, and your dedicated advisor is available for consultations at any time.',
  },
  {
    question: 'What is your investment philosophy?',
    answer: 'We believe in a disciplined, research-driven approach to investing. Our strategy focuses on diversification, risk management, and long-term value creation. We combine fundamental analysis with quantitative techniques to identify opportunities.',
  },
  {
    question: 'Are my investments insured?',
    answer: 'While investments themselves are subject to market risk and are not FDIC insured, your account is protected by SIPC (Securities Investor Protection Corporation) up to $500,000. We also maintain additional insurance coverage for client protection.',
  },
  {
    question: 'Can I access my funds at any time?',
    answer: 'Yes, your investments remain liquid and you can access your funds at any time. However, we recommend maintaining a long-term investment horizon for optimal results. Some investment vehicles may have specific liquidity terms.',
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
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white section-padding">
        <div className="container-custom text-center">
          <h1 className="text-5xl font-bold mb-6">Investment Resources</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Educational content, insights, and tools to help you make informed investment decisions
          </p>
        </div>
      </section>

      {/* Articles Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="flex items-center mb-8">
            <DocumentTextIcon className="h-8 w-8 text-primary-600 mr-3" />
            <h2 className="text-4xl font-bold text-gray-900">Latest Articles</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="mb-4">
                  <span className="inline-block bg-primary-100 text-primary-700 text-xs font-semibold px-3 py-1 rounded-full">
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
                <button className="mt-4 text-primary-600 font-semibold hover:text-primary-700">
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
            <QuestionMarkCircleIcon className="h-8 w-8 text-primary-600 mr-3" />
            <h2 className="text-4xl font-bold text-gray-900">
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
                    className={`h-6 w-6 text-primary-600 flex-shrink-0 transform transition-transform ${
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
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-12 text-white text-center">
            <EnvelopeIcon className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Get the latest market insights, investment tips, and exclusive content delivered to your inbox.
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
                  className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-200 disabled:opacity-50"
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Investment Guides & Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Download our comprehensive guides and tools to enhance your investment knowledge
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <DocumentTextIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Investment Guide 2025
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Complete guide to building a diversified portfolio
              </p>
              <button className="text-primary-600 font-semibold hover:text-primary-700">
                Download PDF
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <DocumentTextIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Retirement Calculator
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Plan your retirement with our interactive tool
              </p>
              <button className="text-primary-600 font-semibold hover:text-primary-700">
                Access Tool
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <DocumentTextIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Market Outlook Report
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Quarterly analysis and investment outlook
              </p>
              <button className="text-primary-600 font-semibold hover:text-primary-700">
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
