import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CalendarDays, Cross } from "lucide-react";
import { getSupabase, supabaseConfigured, type EvangelizationRow } from "@/lib/supabase";
import { evangelizationCases } from "@/data/site";
import { SectionTitle } from "./SectionTitle";

const staticCases: EvangelizationRow[] = evangelizationCases.map((c, i) => ({
  id: `static-${i}`,
  title: c.title,
  date: c.date ?? null,
  description: c.description,
  has_before_after: !!c.hasBeforeAfter,
  images: c.images ?? [],
  before_images: c.beforeImages ?? [],
  after_images: c.afterImages ?? [],
  sort_order: i,
  visible: true,
  created_at: "",
  updated_at: "",
}));

type Phase = "antes" | "ahora";

export function Evangelization() {
  const [cases, setCases] = useState<EvangelizationRow[]>(staticCases);
  const [loading, setLoading] = useState(supabaseConfigured);
  const [activeCase, setActiveCase] = useState(0);
  const [activeImg, setActiveImg] = useState(0);
  const [phase, setPhase] = useState<Phase>("antes");

  useEffect(() => {
    if (!supabaseConfigured) return;
    const sb = getSupabase();
    sb.from("evangelization_cases")
      .select("*")
      .eq("visible", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        const rows = (data ?? []) as EvangelizationRow[];
        if (rows.length > 0) setCases(rows);
        setLoading(false);
      });
  }, []);

  const current = cases[activeCase];
  const hasBeforeAfter = Boolean(
    current?.has_before_after && current.before_images?.length && current.after_images?.length,
  );

  const activeImages = useMemo(() => {
    if (!current) return [] as string[];
    if (hasBeforeAfter) {
      return phase === "antes" ? current.before_images : current.after_images;
    }
    return current.images ?? [];
  }, [current, hasBeforeAfter, phase]);

  useEffect(() => {
    setActiveImg(0);
  }, [activeCase, phase]);

  useEffect(() => {
    if (activeImages.length <= 1) return;
    const id = setInterval(() => {
      setActiveImg((i) => (i + 1) % activeImages.length);
    }, 5000);
    return () => clearInterval(id);
  }, [activeImages.length]);

  if (loading || cases.length === 0) {
    return (
      <section id="evangelizacion" className="py-20 md:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <SectionTitle
            eyebrow="Evangelización"
            title="Caminando con Cristo"
            subtitle="Cada niño acompañado es una semilla de fe. Pronto compartiremos los primeros casos."
          />
        </div>
      </section>
    );
  }

  const selectCase = (i: number) => {
    setActiveCase(i);
    setPhase("antes");
  };
  const prev = () =>
    setActiveImg((i) => (i - 1 + activeImages.length) % activeImages.length);
  const next = () => setActiveImg((i) => (i + 1) % activeImages.length);

  return (
    <section id="evangelizacion" className="py-20 md:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionTitle
          eyebrow="Evangelización"
          title="Caminando con Cristo"
          subtitle="Acompañamos a estos niños en su crecimiento espiritual: bautismo, catequesis, primera comunión y confirmación."
        />

        <div className="mt-10 flex flex-wrap justify-center gap-2 md:gap-3">
          {cases.map((c, i) => (
            <button
              key={c.id}
              onClick={() => selectCase(i)}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all inline-flex items-center gap-1.5 ${
                i === activeCase
                  ? "bg-gradient-brand text-white shadow-soft"
                  : "bg-secondary text-secondary-foreground hover:bg-turquoise/10"
              }`}
            >
              <Cross className="h-3.5 w-3.5" />
              {c.title}
            </button>
          ))}
        </div>

        <motion.div
          key={activeCase}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-10 bg-card rounded-[2rem] border border-border shadow-soft overflow-hidden grid lg:grid-cols-2 lg:items-stretch"
        >
          <div className="relative order-1 lg:order-2 aspect-[4/3] lg:aspect-auto lg:h-[600px] bg-muted">
            <AnimatePresence mode="wait">
              <motion.img
                key={`${activeCase}-${phase}-${activeImg}`}
                src={activeImages[activeImg]}
                alt={`${current.title} - ${hasBeforeAfter ? phase : "imagen"} ${activeImg + 1}`}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>

            {hasBeforeAfter && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex gap-1 rounded-full bg-white/85 backdrop-blur p-1 shadow-soft">
                <button
                  onClick={() => setPhase("antes")}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    phase === "antes"
                      ? "bg-gradient-brand text-white shadow-soft"
                      : "text-deep-blue hover:bg-turquoise/10"
                  }`}
                >
                  Antes
                </button>
                <button
                  onClick={() => setPhase("ahora")}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    phase === "ahora"
                      ? "bg-gradient-brand text-white shadow-soft"
                      : "text-deep-blue hover:bg-turquoise/10"
                  }`}
                >
                  Ahora
                </button>
              </div>
            )}

            {activeImages.length > 1 && (
              <>
                <button
                  aria-label="Imagen anterior"
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/85 backdrop-blur shadow-soft flex items-center justify-center hover:scale-110 transition"
                >
                  <ChevronLeft className="h-5 w-5 text-deep-blue" />
                </button>
                <button
                  aria-label="Imagen siguiente"
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/85 backdrop-blur shadow-soft flex items-center justify-center hover:scale-110 transition"
                >
                  <ChevronRight className="h-5 w-5 text-deep-blue" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {activeImages.map((_, i) => (
                    <button
                      key={i}
                      aria-label={`Ir a imagen ${i + 1}`}
                      onClick={() => setActiveImg(i)}
                      className={`h-2 rounded-full transition-all ${
                        i === activeImg ? "w-8 bg-white" : "w-2 bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="order-2 lg:order-1 p-8 md:p-12 flex flex-col lg:max-h-[600px] lg:overflow-y-auto">
            {current.date && (
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-turquoise uppercase tracking-wider">
                <CalendarDays className="h-4 w-4" />
                {current.date}
              </div>
            )}
            <h3 className="mt-3 text-2xl md:text-3xl font-bold text-foreground">
              {current.title}
            </h3>
            <p className="mt-5 text-muted-foreground leading-relaxed whitespace-pre-line">
              {current.description}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
