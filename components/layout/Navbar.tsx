'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/Logo';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Resources', href: '/resources' },
  { name: 'Investor Protection', href: '/investor-protection' },
  { name: 'Compliance', href: '/compliance' },
  { name: 'Contact', href: '/contact' },
  { name: 'Admin Portal', href: '/admin' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  
  // Check if user is on a portal page (client-portal or admin)
  const isPortalPage = pathname?.startsWith('/client-portal') || pathname?.startsWith('/admin');
  
  useEffect(() => {
    console.log('Navbar user:', user, 'role:', (user as any)?.role);
  }, [user]);

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <nav className="bg-[#1A237E] shadow-md sticky top-0 z-50 border-b border-[#C5A021]/40">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo variant="light" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {/* Only show website navigation when NOT on portal pages */}
            {!isPortalPage && navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  isActive(item.href)
                    ? 'text-[#C5A021] border-b-2 border-[#C5A021]'
                    : 'text-white hover:text-[#C5A021]'
                } px-3 py-2 text-sm font-medium transition-colors duration-200`}
              >
                {item.name}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {(user as any)?.role === 'admin' ? (
                  <>
                    <Link
                      href="/client-portal"
                      className="bg-[#2E7D32] hover:bg-[#276A2A] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      Client Portal
                    </Link>
                    <Link
                      href="/admin"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      Admin Portal
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/client-portal"
                      className="text-white hover:text-[#C5A021] px-3 py-2 text-sm font-medium"
                  >
                    Client Portal
                  </Link>
                )}
                <span className="text-[#F5F5F5] text-sm">{user?.name || 'User'}</span>
                <button
                  onClick={handleLogout}
                  className="bg-[#F5F5F5] hover:bg-white text-[#1A237E] px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/client-portal"
                className="bg-[#2E7D32] hover:bg-[#276A2A] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Client Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-[#C5A021] p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1A237E] border-t border-[#C5A021]/40">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Only show website navigation when NOT on portal pages */}
            {!isPortalPage && navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`${
                  isActive(item.href)
                    ? 'bg-[#C5A021]/20 text-[#C5A021]'
                    : 'text-white hover:bg-white/10'
                } block px-3 py-2 rounded-md text-base font-medium`}
              >
                {item.name}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <>
                {(user as any)?.role === 'admin' ? (
                  <>
                    <Link
                      href="/client-portal"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-md text-base font-medium bg-[#2E7D32] text-white hover:bg-[#276A2A]"
                    >
                      Client Portal
                    </Link>
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-md text-base font-medium bg-purple-600 text-white hover:bg-purple-700"
                    >
                      Admin Portal
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/client-portal"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10"
                  >
                    Client Portal
                  </Link>
                )}
                <div className="px-3 py-2 text-sm text-[#F5F5F5]">
                  {user?.name || 'User'}
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/client-portal"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium bg-[#2E7D32] text-white hover:bg-[#276A2A]"
              >
                Client Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
