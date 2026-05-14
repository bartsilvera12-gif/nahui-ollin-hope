import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Cross, Images, ListChecks, MessageSquareHeart } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { Card, PageHeader } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

type Counts = { stories: number; actions: number; gallery: number; evangelization: number };

function Dashboard() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const sb = getSupabase();
    const fetchAll = async () => {
      try {
        const [s, a, g, e] = await Promise.all([
          sb.from("stories").select("id", { count: "exact", head: true }),
          sb.from("actions").select("id", { count: "exact", head: true }),
          sb.from("gallery_images").select("id", { count: "exact", head: true }),
          sb.from("evangelization_cases").select("id", { count: "exact", head: true }),
        ]);
        if (s.error) throw s.error;
        if (a.error) throw a.error;
        if (g.error) throw g.error;
        if (e.error) throw e.error;
        setCounts({
          stories: s.count ?? 0,
          actions: a.count ?? 0,
          gallery: g.count ?? 0,
          evangelization: e.count ?? 0,
        });
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Error consultando Supabase");
      }
    };
    fetchAll();
  }, []);

  const cards = [
    {
      to: "/admin/stories",
      icon: MessageSquareHeart,
      title: "Testimonios",
      count: counts?.stories,
      desc: "Historias de transformación y carrusel principal.",
    },
    {
      to: "/admin/evangelization",
      icon: Cross,
      title: "Evangelización",
      count: counts?.evangelization,
      desc: "Casos de acompañamiento espiritual.",
    },
    {
      to: "/admin/actions",
      icon: ListChecks,
      title: "Acciones",
      count: counts?.actions,
      desc: "Tarjetas de la sección 'Acciones que realizamos'.",
    },
    {
      to: "/admin/gallery",
      icon: Images,
      title: "Galería",
      count: counts?.gallery,
      desc: "Fotos del mosaico de la sección galería.",
    },
  ];

  return (
    <div>
      <PageHeader title="Resumen" subtitle="Estado del contenido publicado en el sitio." />

      {err && (
        <Card className="mb-6 border-rose-200 bg-rose-50 text-sm text-rose-700">
          <p className="font-semibold">No se pudieron leer las tablas.</p>
          <p className="mt-1">{err}</p>
          <p className="mt-2 text-xs text-rose-600">
            Verificá que corriste el SQL de <code>supabase/schema.sql</code> y que el schema{" "}
            <code>nahui</code> está expuesto en Project Settings → API → Exposed schemas.
          </p>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ to, icon: Icon, title, count, desc }) => (
          <Link key={to} to={to} className="group">
            <Card className="h-full transition-all group-hover:-translate-y-0.5 group-hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-deep-blue/10 text-deep-blue">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-3xl font-bold tabular-nums text-slate-900">
                  {count ?? "—"}
                </span>
              </div>
              <h2 className="mt-4 text-base font-bold text-slate-900">{title}</h2>
              <p className="mt-1 text-sm text-slate-500">{desc}</p>
              <p className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-deep-blue">
                Administrar
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
