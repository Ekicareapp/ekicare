import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#F86F4D] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Top row */}
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between">
          {/* Left: Logo */}
          <Link href="/">
            <Image
              src="/logo-alt-ekicare.png"
              alt="Ekicare Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
          </Link>

          {/* Center: Menu */}
          <nav className="order-last md:order-none">
            <ul className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm">
              <li>
                <Link href="/#comment-ca-marche" className="hover:underline">
                  Comment ça marche ?
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:underline">
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:underline">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:underline">
                  Nous contacter
                </Link>
              </li>
            </ul>
          </nav>

          {/* Right: Social icons */}
          <div className="flex items-center gap-4">
            <Link href="https://facebook.com" aria-label="Facebook" className="hover:opacity-90" target="_blank">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 21V12.75H16.25L16.75 9.5H13.5V7.625C13.5 6.725 13.775 6 15.075 6H16.875V3.125C16.55 3.075 15.475 3 14.25 3C11.7 3 9.975 4.575 9.975 7.3V9.5H7.25V12.75H9.975V21H13.5Z" fill="white"/>
              </svg>
            </Link>
            <Link href="https://instagram.com" aria-label="Instagram" className="hover:opacity-90" target="_blank">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 7.5C9.515 7.5 7.5 9.515 7.5 12C7.5 14.485 9.515 16.5 12 16.5C14.485 16.5 16.5 14.485 16.5 12C16.5 9.515 14.485 7.5 12 7.5ZM12 15C10.35 15 9 13.65 9 12C9 10.35 10.35 9 12 9C13.65 9 15 10.35 15 12C15 13.65 13.65 15 12 15Z" fill="white"/>
                <path d="M16.875 4.5H7.125C5.4 4.5 4.5 5.4 4.5 7.125V16.875C4.5 18.6 5.4 19.5 7.125 19.5H16.875C18.6 19.5 19.5 18.6 19.5 16.875V7.125C19.5 5.4 18.6 4.5 16.875 4.5ZM18 16.875C18 17.775 17.775 18 16.875 18H7.125C6.225 18 6 17.775 6 16.875V7.125C6 6.225 6.225 6 7.125 6H16.875C17.775 6 18 6.225 18 7.125V16.875Z" fill="white"/>
                <circle cx="17.25" cy="6.75" r="0.75" fill="white"/>
              </svg>
            </Link>
            <Link href="https://linkedin.com" aria-label="LinkedIn" className="hover:opacity-90" target="_blank">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.75 9H9.75V21H6.75V9ZM8.25 3.75C7.2 3.75 6.375 4.575 6.375 5.625C6.375 6.675 7.2 7.5 8.25 7.5C9.3 7.5 10.125 6.675 10.125 5.625C10.125 4.575 9.3 3.75 8.25 3.75ZM12 9H14.85V10.575H14.8875C15.285 9.825 16.275 9 17.7375 9C20.4 9 21 10.725 21 13.275V21H18V14.25C18 12.9 17.97 11.175 16.125 11.175C14.25 11.175 14 12.6 14 14.15V21H11V9H12Z" fill="white"/>
              </svg>
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-white/30" />

        {/* Bottom row */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-sm">
          <p className="opacity-90">© 2025 Ekicare. Tous droits réservés.</p>
          <ul className="flex flex-wrap items-center gap-4 md:gap-6">
            <li>
              <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms" className="hover:underline">Terms of Service</Link>
            </li>
            <li>
              <Link href="/cookies" className="hover:underline">Cookies Settings</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
