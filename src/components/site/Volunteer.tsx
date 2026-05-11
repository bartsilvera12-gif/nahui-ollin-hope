import { motion } from "framer-motion";
import { Utensils, Gift, HandHeart, Megaphone, ArrowRight } from "lucide-react";
import { volunteerWays, WHATSAPP_URL } from "@/data/site";

const iconMap = { Utensils, Gift, HandHeart, Megaphone } as const;

export function Volunteer() {
  return (
    <section id="voluntariado" className="py-20 md:py-28 bg-gradient-warm">
      <div className="mx-auto max-w-7xl px-4 md:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="aspect-square rounded-[2rem] overflow-hidden shadow-soft">
            <img
              src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1000&auto=format&fit=crop"
              alt="Voluntarios sonriendo durante una jornada solidaria"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -top-5 -right-5 h-28 w-28 rounded-full bg-heart/15 -z-10" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-turquoise">Voluntariado</span>
          <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">Sumate a esta misión</h2>
          <p className="mt-5 text-muted-foreground text-base md:text-lg">
            Cada mano ayuda, cada gesto cuenta. Podés ser parte de las jornadas
            solidarias de Nahui Ollin Inc.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {volunteerWays.map((w) => {
              const Icon = iconMap[w.icon as keyof typeof iconMap];
              return (
                <div
                  key={w.title}
                  className="flex items-center gap-3 bg-card rounded-2xl px-4 py-3 border border-border shadow-soft hover:-translate-y-1 transition-transform"
                >
                  <div className="h-10 w-10 rounded-xl bg-turquoise/15 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-turquoise" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{w.title}</span>
                </div>
              );
            })}
          </div>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-heart px-6 py-3.5 text-sm font-semibold text-white shadow-soft hover:scale-105 hover:brightness-110 transition-all"
          >
            Quiero ayudar
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <p className="mt-6 italic text-muted-foreground text-sm">
            “No hace falta hacer algo enorme para cambiar un día. A veces, un gesto alcanza.”
          </p>
        </motion.div>
      </div>
    </section>
  );
}
