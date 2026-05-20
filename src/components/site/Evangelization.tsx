import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { getSupabase, supabaseConfigured, type EvangelizationMediaRow } from "@/lib/supabase";
import { evangelizationMedia } from "@/data/site";
import { SectionTitle } from "./SectionTitle";

const staticItems: EvangelizationMediaRow[] = evangelizationMedia.map((m, i) => ({
  id: `static-${i}`,
  url: m.src,
  alt: m.alt ?? null,
  media_type: m.type,
  sort_order: i,
  visible: true,
  created_at: "",
}));

export function Evangelization() {
  const [items, setItems] = useState<EvangelizationMediaRow[]>(staticItems);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (!supabaseConfigured) return;
    const sb = getSupabase();
    sb.from("evangelization_media")
      .select("*")
      .eq("visible", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        const rows = (data ?? []) as EvangelizationMediaRow[];
        if (rows.length > 0) setItems(rows);
      });
  }, []);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => ((i! + 1) % items.length));
      if (e.key === "ArrowLeft") setOpen((i) => ((i! - 1 + items.length) % items.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, items.length]);

  const current = open !== null ? items[open] : null;

  return (
    <section id="evangelizacion" className="py-20 md:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionTitle
          eyebrow="Evangelización"
          title="Caminando con Cristo"
          subtitle="Imágenes y videos del acompañamiento espiritual: bautismo, catequesis, primera comunión y confirmación."
        />

        {items.length === 0 ? (
          <p className="mt-12 text-center text-muted-foreground">
            Pronto compartiremos los primeros momentos.
          </p>
        ) : (
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 [grid-auto-flow:dense]">
            {items.map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
                onClick={() => setOpen(i)}
                className={`group relative overflow-hidden rounded-2xl shadow-soft focus:outline-none focus:ring-2 focus:ring-turquoise ${
                  i % 5 === 0 ? "row-span-2 aspect-[3/4]" : "aspect-square"
                }`}
                aria-label={item.media_type === "video" ? `Ver video ${i + 1}` : `Ver imagen ${i + 1}`}
              >
                {item.media_type === "image" ? (
                  <img
                    src={item.url}
                    alt={item.alt ?? ""}
                    loading="lazy"
                    onError={(e) => {
                      const btn = e.currentTarget.closest("button");
                      if (btn) btn.style.display = "none";
                    }}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 bg-slate-100"
                  />
                ) : (
                  <>
                    <video
                      src={item.url}
                      muted
                      playsInline
                      preload="metadata"
                      onLoadedMetadata={(e) => {
                        try { e.currentTarget.currentTime = 0.1; } catch {}
                      }}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 bg-slate-200"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition">
                      <div className="h-14 w-14 rounded-full bg-white/90 flex items-center justify-center shadow-glow">
                        <Play className="h-6 w-6 text-deep-blue fill-deep-blue ml-1" />
                      </div>
                    </div>
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-deep-blue/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {item.alt && item.alt.trim() && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent px-3 pt-8 pb-2 text-left">
                    <p className="line-clamp-2 text-xs md:text-sm font-medium text-white drop-shadow">
                      {item.alt}
                    </p>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        )}
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
              onClick={(e) => { e.stopPropagation(); setOpen((i) => ((i! - 1 + items.length) % items.length)); }}
              className="absolute left-3 md:left-8 h-12 w-12 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              aria-label="Siguiente"
              onClick={(e) => { e.stopPropagation(); setOpen((i) => ((i! + 1) % items.length)); }}
              className="absolute right-3 md:right-8 h-12 w-12 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            {current.media_type === "image" ? (
              <motion.img
                key={open}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                src={current.url}
                alt={current.alt ?? "Imagen ampliada"}
                onClick={(e) => e.stopPropagation()}
                className="max-h-[88vh] max-w-[92vw] rounded-2xl shadow-glow object-contain"
              />
            ) : (
              <motion.video
                key={open}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                src={current.url}
                controls
                autoPlay
                playsInline
                onClick={(e) => e.stopPropagation()}
                className="max-h-[88vh] max-w-[92vw] rounded-2xl shadow-glow bg-black"
              />
            )}
            {current.alt && current.alt.trim() && (
              <div
                className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 max-w-[80vw] rounded-lg bg-black/60 px-4 py-2 text-center text-sm text-white backdrop-blur-sm"
                onClick={(e) => e.stopPropagation()}
              >
                {current.alt}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
