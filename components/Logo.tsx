import Link from 'next/link';

type LogoProps = {
  className?: string;
  variant?: 'light' | 'dark';
};

export default function Logo({ className = '', variant = 'dark' }: LogoProps) {
  const isLight = variant === 'light';

  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
      <div className="relative">
        {/* Logo Icon - Letter C with M inside */}
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={isLight ? 'text-[#C5A021]' : 'text-primary-600'}
        >
          {/* Outer Circle */}
          <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="3" fill="none" />
          {/* Letter C */}
          <path
            d="M26 12C23 10 17 10 14 14C11 18 11 22 14 26C17 30 23 30 26 28"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          {/* Letter M inside */}
          <path
            d="M16 24V16L20 20L24 16V24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className={`text-xl font-bold leading-tight ${isLight ? 'text-white' : 'text-gray-900'}`}>
          CapitalMasters
        </span>
        <span className={`text-xs leading-tight ${isLight ? 'text-[#F5F5F5]' : 'text-gray-600'}`}>
          Investment Excellence
        </span>
      </div>
    </Link>
  );
}
