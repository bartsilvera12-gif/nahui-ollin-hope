import { useEffect, useState } from "react";
import { Menu, X, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";
import { navLinks, DONATION_URL } from "@/data/site";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/90 backdrop-blur-md shadow-soft" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8 h-18 py-3 flex items-center justify-between">
        <a href="#inicio" className="flex items-center gap-3">
          <img src={logo} alt="Logo Nahui Ollin Inc" className="h-11 w-11 rounded-full object-cover ring-2 ring-turquoise/30" />
          <span className="font-bold text-foreground text-lg leading-tight">
            Nahui Ollin <span className="text-turquoise">Inc</span>
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="text-sm font-medium text-foreground/80 hover:text-turquoise transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href={DONATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:inline-flex items-center gap-2 rounded-full bg-heart px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:scale-105 hover:brightness-110 transition-all"
        >
          <Heart className="h-4 w-4 fill-current" /> Donar ahora
        </a>

        <button
          aria-label="Abrir menú"
          onClick={() => setOpen(!open)}
          className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-full bg-background/80 border border-border"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background/95 backdrop-blur-md border-t border-border overflow-hidden"
          >
            <nav className="flex flex-col px-6 py-4 gap-1">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="py-3 text-base font-medium text-foreground hover:text-turquoise"
                >
                  {l.label}
                </a>
              ))}
              <a
                href={DONATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-heart px-5 py-3 text-sm font-semibold text-white"
              >
                <Heart className="h-4 w-4 fill-current" /> Donar ahora
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
