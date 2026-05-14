import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { galleryItems } from "@/data/site";
import { SectionTitle } from "./SectionTitle";

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => ((i! + 1) % galleryItems.length));
      if (e.key === "ArrowLeft") setOpen((i) => ((i! - 1 + galleryItems.length) % galleryItems.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const current = open !== null ? galleryItems[open] : null;

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionTitle
          eyebrow="Galería"
          title="Momentos que dejan huella"
          subtitle="Imágenes que representan la fuerza de la comunidad cuando se une para ayudar."
        />
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 [grid-auto-flow:dense]">
          {galleryItems.map((item, i) => (
            <motion.button
              key={item.src}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
              onClick={() => setOpen(i)}
              className={`group relative overflow-hidden rounded-2xl shadow-soft focus:outline-none focus:ring-2 focus:ring-turquoise ${
                i % 5 === 0 ? "row-span-2 aspect-[3/4]" : "aspect-square"
              }`}
              aria-label={item.type === "video" ? `Ver video ${i + 1}` : `Ver imagen ${i + 1}`}
            >
              {item.type === "image" ? (
                <img
                  src={item.src}
                  alt={`Galería Nahui Ollin ${i + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <>
                  <video
                    src={item.src}
                    poster={item.poster}
                    muted
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition">
                    <div className="h-14 w-14 rounded-full bg-white/90 flex items-center justify-center shadow-glow">
                      <Play className="h-6 w-6 text-deep-blue fill-deep-blue ml-1" />
                    </div>
                  </div>
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-deep-blue/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open !== null && current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
          >
            <button
              aria-label="Cerrar"
              onClick={() => setOpen(null)}
              className="absolute top-5 right-5 h-11 w-11 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              aria-label="Anterior"
              onClick={(e) => { e.stopPropagation(); setOpen((i) => ((i! - 1 + galleryItems.length) % galleryItems.length)); }}
              className="absolute left-3 md:left-8 h-12 w-12 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              aria-label="Siguiente"
              onClick={(e) => { e.stopPropagation(); setOpen((i) => ((i! + 1) % galleryItems.length)); }}
              className="absolute right-3 md:right-8 h-12 w-12 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            {current.type === "image" ? (
              <motion.img
                key={open}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                src={current.src}
                alt="Imagen ampliada"
                onClick={(e) => e.stopPropagation()}
                className="max-h-[88vh] max-w-[92vw] rounded-2xl shadow-glow object-contain"
              />
            ) : (
              <motion.video
                key={open}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                src={current.src}
                controls
                autoPlay
                playsInline
                onClick={(e) => e.stopPropagation()}
                className="max-h-[88vh] max-w-[92vw] rounded-2xl shadow-glow bg-black"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
