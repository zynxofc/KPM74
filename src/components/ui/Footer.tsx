import Link from "next/link";
import { navigationConfig } from "@/lib/config";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const footerLinks = navigationConfig.navLinks.filter(link => link.href !== "/");

  return (
    <footer className="w-full bg-slate-100 dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-4 md:order-2">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-slate-500 hover:text-primary dark:hover:text-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 rounded px-2 py-0.5"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-sm leading-5 text-slate-400 dark:text-slate-500">
            &copy; {currentYear} LinTree KPM. Semua Hak Cipta Dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
};
