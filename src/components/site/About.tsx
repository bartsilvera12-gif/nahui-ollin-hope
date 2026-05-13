import { motion } from "framer-motion";
import {
  Heart,
  Sparkles,
  Shield,
  Users,
  HandHeart,
  Target,
  Eye,
  MapPinned,
  GraduationCap,
  Home,
  Megaphone,
} from "lucide-react";
import { aboutContent, objetivos, values } from "@/data/site";
import crFeedinKids from "@/assets/cr-feedin-kids.jpg";

const iconMap = {
  Heart,
  Sparkles,
  Shield,
  Users,
  HandHeart,
  MapPinned,
  GraduationCap,
  Home,
  Megaphone,
} as const;

type IconKey = keyof typeof iconMap;

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
                src={crFeedinKids}
                alt="Carmen Rosa junto a los niños en el basurero"
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
              ¿Quiénes somos?
            </h2>
            <div className="mt-5 space-y-3">
              {aboutContent.quienesSomos.map((p, i) => (
                <p key={i} className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-6">
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-3xl p-7 md:p-8 border border-border shadow-soft"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-brand flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Misión</h3>
            </div>
            <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
              {aboutContent.mision}
            </p>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-card rounded-3xl p-7 md:p-8 border border-border shadow-soft"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-brand flex items-center justify-center">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Visión</h3>
            </div>
            <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
              {aboutContent.vision}
            </p>
          </motion.article>
        </div>

        <div className="mt-16">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-turquoise">
              Nuestros objetivos
            </span>
            <h3 className="mt-3 text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
              Para qué trabajamos
            </h3>
          </div>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {objetivos.map((o, i) => {
              const Icon = iconMap[o.icon as IconKey] ?? Heart;
              return (
                <motion.article
                  key={o.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group bg-card rounded-3xl p-6 border border-border shadow-soft hover:-translate-y-1.5 hover:shadow-glow transition-all"
                >
                  <div className="h-12 w-12 rounded-2xl bg-gradient-brand flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-bold text-foreground">{o.title}</h4>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {o.description}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>

        <div className="mt-16">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-turquoise">
              Nuestros valores
            </span>
            <h3 className="mt-3 text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
              Lo que nos guía
            </h3>
          </div>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {values.map((v, i) => {
              const Icon = iconMap[v.icon as IconKey] ?? Heart;
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
                  <h4 className="font-bold text-foreground">{v.title}</h4>
                  <p className="mt-2 text-sm text-muted-foreground">{v.description}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
