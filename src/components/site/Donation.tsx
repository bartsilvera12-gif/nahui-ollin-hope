import { motion } from "framer-motion";
import { Heart, ArrowRight } from "lucide-react";
import { WHATSAPP_URL } from "@/data/site";

export function Donation() {
  return (
    <section id="donar" className="relative py-20 md:py-28 bg-gradient-brand overflow-hidden">
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-16 h-72 w-72 rounded-full bg-white/10" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-turquoise/30 blur-2xl" />
        <div className="absolute top-1/4 right-1/3 h-40 w-40 rounded-full border-2 border-white/20" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative mx-auto max-w-4xl px-4 md:px-8 text-center text-white"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-4 py-1.5 mb-6 border border-white/20">
          <Heart className="h-4 w-4 fill-current text-heart" />
          <span className="text-xs font-semibold tracking-wide">Sumá tu corazón</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold leading-tight">
          Tu ayuda puede cambiar el día de un niño
        </h2>
        <p className="mt-5 text-base md:text-lg text-white/85 max-w-2xl mx-auto">
          Cada aporte nos permite llegar con alimentos, regalos, acompañamiento y
          esperanza a más niños en situación vulnerable.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-heart px-7 py-4 text-sm font-semibold text-white shadow-glow hover:scale-105 hover:brightness-110 transition-all"
          >
            <Heart className="h-4 w-4 fill-current" /> Donar ahora
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 rounded-full bg-transparent border-2 border-white/70 px-7 py-4 text-sm font-semibold text-white hover:bg-white hover:text-deep-blue transition-all"
          >
            Quiero ser voluntario
          </a>
        </div>
        <p className="mt-5 text-xs text-white/70">Próximamente habilitaremos más medios de donación.</p>
        <p className="mt-8 italic text-white/85 text-sm md:text-base">
          “Tu gesto puede convertirse en alimento, compañía y esperanza.”
        </p>
      </motion.div>
    </section>
  );
}
