import { motion } from "framer-motion";
import { Utensils, Gift, Sun, HandHeart, Smile, Megaphone } from "lucide-react";
import { actions } from "@/data/site";
import { SectionTitle } from "./SectionTitle";

const iconMap = { Utensils, Gift, Sun, HandHeart, Smile, Megaphone } as const;

export function Actions() {
  return (
    <section id="acciones" className="py-20 md:py-28 bg-gradient-warm">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionTitle
          eyebrow="Lo que hacemos"
          title="Nuestras acciones"
          subtitle="Cada jornada es una oportunidad para alimentar, acompañar y regalar esperanza."
        />
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {actions.map((a, i) => {
            const Icon = iconMap[a.icon as keyof typeof iconMap] ?? HandHeart;
            return (
              <motion.article
                key={a.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                className="group bg-card rounded-3xl overflow-hidden border border-border shadow-soft hover:-translate-y-2 hover:shadow-glow transition-all"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={a.image}
                    alt={a.title}
                    loading="lazy"
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-turquoise/15 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-turquoise" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground">{a.title}</h3>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{a.description}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
