import { motion } from "framer-motion";
import { Heart, ArrowRight, Users, Calendar } from "lucide-react";
import logo from "@/assets/logo.png";
import { DONATION_URL } from "@/data/site";
import { FloatingDecorations } from "./FloatingDecorations";

export function Hero() {
  return (
    <section id="inicio" className="relative pt-28 md:pt-36 pb-20 md:pb-28 bg-gradient-hero overflow-hidden">
      <FloatingDecorations />
      <div className="relative mx-auto max-w-7xl px-4 md:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
            <span className="text-gradient-brand">NAHUI OLLIN</span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
            Es el nombre en el idioma náhuatl de la flor de cuatro pétalos
            ubicada sobre el vientre de la santísima Virgen de Guadalupe en la
            tilma de San Juan Diego que significa el centro del universo:
            Jesucristo.
          </p>
          <p className="mt-3 text-base md:text-lg font-semibold text-deep-blue max-w-xl">
            Nahui Ollin significa Jesús en el vientre de María.
          </p>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
            En Nahui Ollin acompañamos a niños en extrema pobreza en basureros
            mediante la alimentación, catequesis, evangelización, educación,
            apoyo y acciones solidarias que devuelven sonrisas y tocan con Amor
            los corazones.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={DONATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-heart px-6 py-3.5 text-sm font-semibold text-white shadow-soft hover:scale-105 hover:brightness-110 transition-all"
            >
              <Heart className="h-4 w-4 fill-current" /> Donar ahora
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#sobre"
              className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur border border-border px-6 py-3.5 text-sm font-semibold text-deep-blue hover:bg-white transition-all"
            >
              Conocer la fundación
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative aspect-square rounded-[2.5rem] overflow-hidden shadow-glow">
            <img
              src="/hero.jpg"
              alt="Niños vestidos de blanco en primera comunión acompañados por la fundación"
              className="h-full w-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-deep-blue/30 to-transparent" />
          </div>

          {/* Logo medallion */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-white p-2 shadow-soft"
          >
            <img src={logo} alt="Logo Nahui Ollin Inc" className="h-full w-full rounded-full object-cover" />
          </motion.div>

          {/* Floating cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="absolute -bottom-4 -left-4 md:-left-10 bg-white rounded-2xl shadow-soft px-4 py-3 flex items-center gap-3"
          >
            <div className="h-10 w-10 rounded-full bg-turquoise/15 flex items-center justify-center">
              <Users className="h-5 w-5 text-turquoise" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">250+</p>
              <p className="text-xs text-muted-foreground">niños acompañados</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="absolute top-6 -right-3 md:-right-8 bg-white rounded-2xl shadow-soft px-4 py-3 flex items-center gap-3"
          >
            <div className="h-10 w-10 rounded-full bg-heart/15 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-heart" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">40+</p>
              <p className="text-xs text-muted-foreground">jornadas solidarias</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="absolute bottom-12 -right-2 md:-right-6 bg-white rounded-2xl shadow-soft px-4 py-3 flex items-center gap-3"
          >
            <div className="h-10 w-10 rounded-full bg-olive/15 flex items-center justify-center">
              <Heart className="h-5 w-5 text-olive fill-current" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Movimiento</p>
              <p className="text-xs text-muted-foreground">solidario</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
