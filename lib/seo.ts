// Utility functions for SEO optimization

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: 'CapitalMasters',
    description: 'Professional investment management and wealth advisory services',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://capitalmasters.com',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
    telephone: '+1-555-123-4567',
    email: 'info@capitalmasters.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '5 Kiwana Road',
      addressLocality: 'Bukoto',
      addressRegion: 'Kampala',
      postalCode: '00256',
      addressCountry: 'UG',
    },
    sameAs: [
      'https://www.linkedin.com/company/capitalmasters',
      'https://twitter.com/capitalmasters',
      'https://www.facebook.com/capitalmasters',
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '13:00',
      },
    ],
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateServiceSchema(service: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.name,
    description: service.description,
    provider: {
      '@type': 'FinancialService',
      name: 'CapitalMasters',
      url: process.env.NEXT_PUBLIC_SITE_URL,
    },
    url: service.url,
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateContactSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact CapitalMasters',
    description: 'Get in touch with our investment advisory team',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/contact`,
    mainEntity: {
      '@type': 'FinancialService',
      name: 'CapitalMasters',
      telephone: '+1-555-123-4567',
      email: 'info@capitalmasters.com',
    },
  };
}
