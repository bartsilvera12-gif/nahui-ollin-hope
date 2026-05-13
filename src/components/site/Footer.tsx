import { Instagram, Facebook, MessageCircle, Phone, Printer } from "lucide-react";
import logo from "@/assets/logo.png";
import { WHATSAPP_URL, DONATION_URL, FACEBOOK_URL, FAX, PHONE_FREE } from "@/data/site";

export function Footer() {
  return (
    <footer className="bg-deep-blue text-white">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-14 grid md:grid-cols-2 gap-10 items-center justify-items-center text-center">
        <div className="flex flex-col items-center">
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
              { Icon: Facebook, href: FACEBOOK_URL, label: "Facebook" },
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
          <div className="mt-4 space-y-1.5 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-turquoise shrink-0" />
              <span>Llamada gratis: {PHONE_FREE}</span>
            </div>
            <div className="flex items-center gap-2">
              <Printer className="h-4 w-4 text-turquoise shrink-0" />
              <span>Fax: {FAX}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <h4 className="font-semibold text-turquoise">Sumate</h4>
          <p className="mt-4 text-sm text-white/80 leading-relaxed max-w-xs">
            Tu aporte se transforma en alimento, compañía y esperanza para más niños.
          </p>
          <a
            href={DONATION_URL}
            target="_blank"
            rel="noopener noreferrer"
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
