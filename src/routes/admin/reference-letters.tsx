import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, Trash2, Play } from "lucide-react";
import { getSupabase, type ReferenceLetterRow } from "@/lib/supabase";
import { Button, Card, EmptyState, PageHeader, TextInput } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/reference-letters")({
  component: ReferenceLettersAdmin,
});

function ReferenceLettersAdmin() {
  const sb = useMemo(() => getSupabase(), []);
  const [rows, setRows] = useState<ReferenceLetterRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await sb
      .from("reference_letters")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) setError(error.message);
    else setRows((data ?? []) as ReferenceLetterRow[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleVisible = async (row: ReferenceLetterRow) => {
    const { error } = await sb
      .from("reference_letters")
      .update({ visible: !row.visible })
      .eq("id", row.id);
    if (error) setError(error.message);
    else load();
  };

  const updateSort = async (id: string, sort_order: number) => {
    const { error } = await sb
      .from("reference_letters")
      .update({ sort_order })
      .eq("id", id);
    if (error) setError(error.message);
    else load();
  };

  const updateAlt = async (id: string, alt: string) => {
    const next = alt.trim() || null;
    const { error } = await sb
      .from("reference_letters")
      .update({ alt: next })
      .eq("id", id);
    if (error) setError(error.message);
    else load();
  };

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar esta carta?")) return;
    const { error } = await sb.from("reference_letters").delete().eq("id", id);
    if (error) setError(error.message);
    else await load();
  };

  return (
    <div>
      <PageHeader
        title="Cartas Referenciales"
        subtitle="Gestioná las cartas existentes (orden, descripción, visibilidad)."
      />

      {error && (
        <Card className="mb-4 border-rose-200 bg-rose-50 text-sm text-rose-700">{error}</Card>
      )}

      {loading ? (
        <EmptyState message="Cargando…" />
      ) : rows.length === 0 ? (
        <EmptyState message="No hay cartas." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {rows.map((row) => (
            <Card key={row.id} className="p-3">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-100">
                {row.media_type === "video" ? (
                  <>
                    <video
                      src={row.url}
                      muted
                      playsInline
                      preload="metadata"
                      onLoadedMetadata={(e) => {
                        try { e.currentTarget.currentTime = 0.1; } catch {}
                      }}
                      className="h-full w-full object-cover bg-slate-200"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="h-10 w-10 rounded-full bg-white/90 flex items-center justify-center shadow">
                        <Play className="h-4 w-4 text-deep-blue fill-deep-blue ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute top-2 left-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                      Video
                    </span>
                  </>
                ) : (
                  <img src={row.url} alt={row.alt ?? ""} className="h-full w-full object-cover" />
                )}
                {!row.visible && (
                  <div className="absolute inset-0 grid place-items-center bg-slate-900/40 text-xs font-semibold text-white">
                    Oculto
                  </div>
                )}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <TextInput
                  type="number"
                  className="h-9 text-xs"
                  value={row.sort_order}
                  onChange={(e) => updateSort(row.id, Number(e.target.value))}
                  title="Orden"
                />
                <Button
                  variant="outline"
                  onClick={() => toggleVisible(row)}
                  title={row.visible ? "Ocultar" : "Mostrar"}
                >
                  {row.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button variant="danger" onClick={() => remove(row.id)} title="Eliminar">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <TextInput
                key={`alt-${row.id}-${row.alt ?? ""}`}
                className="mt-2 h-9 text-xs"
                placeholder="Descripción (vacío = no se muestra)"
                defaultValue={row.alt ?? ""}
                onBlur={(e) => {
                  const next = e.target.value;
                  if (next !== (row.alt ?? "")) updateAlt(row.id, next);
                }}
                title="Texto descriptivo (se guarda al salir del campo)"
              />
              <p className="mt-1 truncate text-[10px] text-slate-400" title={row.url}>
                {row.url}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
