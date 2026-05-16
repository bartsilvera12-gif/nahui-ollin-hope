import { motion } from "framer-motion";

export function Meaning() {
  return (
    <section
      id="nahui-ollin"
      className="relative py-16 md:py-24 bg-gradient-to-b from-white to-cream"
    >
      <div className="mx-auto max-w-4xl px-4 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-turquoise">
            El significado
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-bold text-gradient-brand">
            NAHUI OLLIN
          </h2>
          <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed">
            Es el nombre en el idioma náhuatl de la flor de cuatro pétalos
            ubicada sobre el vientre de la santísima Virgen de Guadalupe en la
            tilma de San Juan Diego, que significa el centro del universo:
            Jesucristo.
          </p>
          <p className="mt-4 text-lg md:text-xl font-semibold text-deep-blue">
            Nahui Ollin significa Jesús en el vientre de María.
          </p>
          <div className="mt-8 h-px w-24 mx-auto bg-gradient-brand" />
          <p className="mt-8 text-base md:text-lg text-muted-foreground leading-relaxed">
            En Nahui Ollin acompañamos a niños en extrema pobreza en basureros
            mediante la alimentación, catequesis, evangelización, educación,
            apoyo y acciones solidarias que devuelven sonrisas y tocan con Amor
            los corazones.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
