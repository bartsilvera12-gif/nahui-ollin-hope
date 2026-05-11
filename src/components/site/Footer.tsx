import { Instagram, Facebook, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.png";
import { navLinks, WHATSAPP_URL } from "@/data/site";

export function Footer() {
  return (
    <footer className="bg-deep-blue text-white">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-14 grid md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo Nahui Ollin Inc" className="h-12 w-12 rounded-full ring-2 ring-turquoise/40" />
            <span className="font-bold text-lg">Nahui Ollin Inc</span>
          </div>
          <p className="mt-4 text-white/75 text-sm leading-relaxed max-w-xs">
            Movidos por amor, unidos por la esperanza.
          </p>
          <div className="mt-5 flex gap-3">
            {[
              { Icon: Instagram, href: "#", label: "Instagram" },
              { Icon: Facebook, href: "#", label: "Facebook" },
              { Icon: MessageCircle, href: WHATSAPP_URL, label: "WhatsApp" },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noreferrer"
                className="h-10 w-10 rounded-full bg-white/10 hover:bg-turquoise hover:text-white flex items-center justify-center transition-colors"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-turquoise">Navegación</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-white/80 hover:text-turquoise transition-colors">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-turquoise">Sumate</h4>
          <p className="mt-4 text-sm text-white/80 leading-relaxed">
            Tu aporte se transforma en alimento, compañía y esperanza para más niños.
          </p>
          <a
            href="#donar"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-heart px-5 py-2.5 text-sm font-semibold text-white hover:scale-105 transition-transform"
          >
            Donar ahora
          </a>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 md:px-8 py-5 text-xs text-white/60 text-center">
          © 2026 Nahui Ollin Inc. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
