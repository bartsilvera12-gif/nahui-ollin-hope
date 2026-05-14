import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { stories } from "@/data/site";
import { SectionTitle } from "./SectionTitle";

type Phase = "antes" | "ahora";

export function Stories() {
  const [activeStory, setActiveStory] = useState(0);
  const [activeImg, setActiveImg] = useState(0);
  const [phase, setPhase] = useState<Phase>("antes");
  const story = stories[activeStory];

  const hasBeforeAfter = Boolean(story.beforeImages && story.afterImages);

  const activeImages = useMemo(() => {
    if (hasBeforeAfter) {
      return phase === "antes" ? story.beforeImages! : story.afterImages!;
    }
    return story.images;
  }, [hasBeforeAfter, phase, story]);

  // Reset image index when story or phase changes
  useEffect(() => {
    setActiveImg(0);
  }, [activeStory, phase]);

  // Autoplay images
  useEffect(() => {
    const id = setInterval(() => {
      setActiveImg((i) => (i + 1) % activeImages.length);
    }, 5000);
    return () => clearInterval(id);
  }, [activeImages.length]);

  const selectStory = (i: number) => {
    setActiveStory(i);
    setPhase("antes");
  };
  const prev = () =>
    setActiveImg((i) => (i - 1 + activeImages.length) % activeImages.length);
  const next = () => setActiveImg((i) => (i + 1) % activeImages.length);

  return (
    <section id="historias" className="py-20 md:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionTitle
          eyebrow="Historias"
          title="Historias que nos inspiran"
          subtitle="Detrás de cada jornada hay momentos que nos recuerdan el poder de estar presentes."
        />

        {/* Story tabs */}
        <div className="mt-10 flex flex-wrap justify-center gap-2 md:gap-3">
          {stories.map((s, i) => (
            <button
              key={s.title}
              onClick={() => selectStory(i)}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all ${
                i === activeStory
                  ? "bg-gradient-brand text-white shadow-soft"
                  : "bg-secondary text-secondary-foreground hover:bg-turquoise/10"
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>

        <motion.div
          key={activeStory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-10 bg-card rounded-[2rem] border border-border shadow-soft overflow-hidden grid lg:grid-cols-2"
        >
          {/* Carousel */}
          <div className="relative order-1 lg:order-2 aspect-[4/3] lg:aspect-auto lg:min-h-[460px] bg-muted">
            <AnimatePresence mode="wait">
              <motion.img
                key={`${activeStory}-${phase}-${activeImg}`}
                src={activeImages[activeImg]}
                alt={`${story.title} - ${hasBeforeAfter ? phase : "imagen"} ${activeImg + 1}`}
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
          </div>

          {/* Text */}
          <div className="order-2 lg:order-1 p-8 md:p-12 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-turquoise uppercase tracking-wider">
              <CalendarDays className="h-4 w-4" />
              {story.date}
            </div>
            <h3 className="mt-3 text-2xl md:text-3xl font-bold text-foreground">
              {story.title}
            </h3>
            <p className="mt-5 text-muted-foreground leading-relaxed whitespace-pre-line">
              {story.description}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
