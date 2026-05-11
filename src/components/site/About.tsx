import { motion } from "framer-motion";
import { Heart, Sparkles, Shield, Users, HandHeart } from "lucide-react";
import { values } from "@/data/site";

const iconMap = { Heart, Sparkles, Shield, Users, HandHeart } as const;

export function About() {
  return (
    <section id="sobre" className="relative py-20 md:py-28 bg-gradient-warm">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-soft">
              <img
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1000&auto=format&fit=crop"
                alt="Voluntarios acompañando a niños en una jornada comunitaria"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-turquoise/20 -z-10" />
            <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-heart/10 -z-10" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-turquoise">
              Sobre la fundación
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Sobre Nahui Ollin Inc
            </h2>
            <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
              Nahui Ollin Inc nace con el propósito de acompañar, proteger y brindar
              esperanza a niños en situación vulnerable. Cada acción busca crear un
              impacto real: un plato de comida, un regalo, una visita, una sonrisa o una
              oportunidad para sentirse vistos y cuidados.
            </p>
          </motion.div>
        </div>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {values.map((v, i) => {
            const Icon = iconMap[v.icon as keyof typeof iconMap] ?? Heart;
            return (
              <motion.article
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group bg-card rounded-3xl p-6 border border-border shadow-soft hover:-translate-y-1.5 hover:shadow-glow transition-all"
              >
                <div className="h-12 w-12 rounded-2xl bg-gradient-brand flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
