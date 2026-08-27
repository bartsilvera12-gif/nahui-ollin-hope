import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Smile, CalendarHeart, Users, Utensils } from "lucide-react";
import { impactStats } from "@/data/site";
import { SectionTitle } from "./SectionTitle";

const iconMap = { Smile, CalendarHeart, Users, Utensils } as const;

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref}>
      {n.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

export function Impact() {
  return (
    <section className="relative py-20 md:py-28 bg-background overflow-hidden">
      <div aria-hidden className="absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-turquoise/8 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <SectionTitle
          eyebrow="Impacto"
          title="Nuestro impacto en acción"
          subtitle="Cada número representa una historia, una sonrisa y una oportunidad para acompañar."
        />
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-5">
          {impactStats.map((s, i) => {
            const Icon = iconMap[s.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative bg-card rounded-3xl p-6 md:p-8 border border-border shadow-soft text-center"
              >
                <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-brand flex items-center justify-center mb-4">
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <p className="text-3xl md:text-4xl font-bold text-deep-blue">
                  <Counter to={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-sm text-muted-foreground font-medium">{s.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
