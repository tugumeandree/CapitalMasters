export default function WhatsAppContactButton() {
  const whatsappNumber = '256755017384';
  const message = encodeURIComponent('Hello CapitalMasters, I would like to discuss my investment goals.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact CapitalMasters on WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white font-semibold shadow-lg hover:bg-[#1faa53] transition-colors duration-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M20.52 3.48A11.82 11.82 0 0012.03 0C5.52 0 .23 5.3.23 11.8c0 2.08.54 4.11 1.56 5.9L0 24l6.48-1.7a11.73 11.73 0 005.55 1.41h.01c6.5 0 11.79-5.3 11.79-11.81 0-3.15-1.22-6.1-3.31-8.4zm-8.49 18.24h-.01a9.84 9.84 0 01-5-1.37l-.36-.21-3.85 1.01 1.03-3.75-.23-.39a9.8 9.8 0 01-1.5-5.22c0-5.43 4.42-9.85 9.86-9.85 2.64 0 5.12 1.03 6.98 2.9a9.8 9.8 0 012.88 6.96c0 5.44-4.42 9.86-9.8 9.86z" />
        <path d="M17.42 14.34c-.29-.14-1.7-.84-1.96-.94-.26-.1-.45-.14-.64.15-.18.29-.73.94-.89 1.13-.16.2-.33.22-.62.07-.29-.15-1.22-.45-2.32-1.44-.86-.77-1.44-1.72-1.61-2.01-.16-.29-.02-.45.12-.6.13-.13.29-.33.43-.5.14-.17.19-.29.29-.48.1-.2.05-.37-.02-.51-.08-.14-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.49h-.55c-.2 0-.51.07-.77.37-.26.29-.99.97-.99 2.36s1.01 2.73 1.15 2.92c.14.2 1.97 3.01 4.77 4.22.67.29 1.19.46 1.59.59.67.21 1.28.18 1.77.11.54-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.2-.55-.34z" />
      </svg>
      <span className="hidden sm:inline">WhatsApp Us</span>
    </a>
  );
}
