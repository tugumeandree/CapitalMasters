import Link from 'next/link';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

const navigation = {
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Resources', href: '/resources' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Investor Protection', href: '/investor-protection' },
    { name: 'Compliance', href: '/compliance' },
    { name: 'Privacy Policy', href: '/compliance#privacy' },
    { name: 'Terms of Service', href: '/compliance#terms' },
  ],
  social: [
    { name: 'LinkedIn', href: '#', icon: 'linkedin' },
    { name: 'Twitter', href: '#', icon: 'twitter' },
    { name: 'Facebook', href: '#', icon: 'facebook' },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {/* Company Info */}
          <div className="col-span-1 sm:col-span-2">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
              CapitalMasters
            </h3>
            <p className="text-gray-400 mb-4 max-w-md">
              Professional investment management services dedicated to helping you achieve your financial goals through strategic portfolio management and expert guidance.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-5 w-5 text-primary-400" />
                <span>+256 755017384</span>
              </div>
              <div className="flex items-center space-x-2">
                <EnvelopeIcon className="h-5 w-5 text-primary-400" />
                <a href="mailto:info@capitalmasters.com" className="hover:text-primary-400 transition-colors">
                  info@capitalmasters.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <MapPinIcon className="h-5 w-5 text-primary-400" />
                <span>5 Kiwana Road, Kampala, Bukoto, Uganda</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="hover:text-primary-400 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="hover:text-primary-400 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} CapitalMasters. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex space-x-6 mt-4 md:mt-0">
            {navigation.social.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-400 hover:text-primary-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.name}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-xs text-gray-500 text-center max-w-4xl mx-auto">
            <strong>Disclaimer:</strong> Investment involves risk. Past performance is not indicative of future results. 
            CapitalMasters is a registered investment advisor. All investments are subject to market risks. 
            Please read all scheme related documents carefully before investing.
          </p>
        </div>
      </div>
    </footer>
  );
}
