import { motion } from "framer-motion";
import { Heart, MapPinned, HandHeart, Shield, GraduationCap, Home, Megaphone } from "lucide-react";
import { objetivos } from "@/data/site";

const iconMap = {
  Heart,
  MapPinned,
  HandHeart,
  Shield,
  GraduationCap,
  Home,
  Megaphone,
} as const;

type IconKey = keyof typeof iconMap;

export function Objectives() {
  return (
    <section className="py-20 md:py-28 bg-gradient-warm">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
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
    </section>
  );
}
