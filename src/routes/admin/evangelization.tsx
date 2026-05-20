import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, Trash2, Upload, Play, Image as ImageIcon, Video as VideoIcon } from "lucide-react";
import { getSupabase, type EvangelizationMediaRow } from "@/lib/supabase";
import { Button, Card, EmptyState, Field, PageHeader, TextInput } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/evangelization")({
  component: EvangelizationAdmin,
});

type MediaType = "image" | "video";

function detectMediaTypeFromUrl(url: string): MediaType {
  return /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(url) ? "video" : "image";
}

function EvangelizationAdmin() {
  const sb = useMemo(() => getSupabase(), []);
  const [rows, setRows] = useState<EvangelizationMediaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [manualUrl, setManualUrl] = useState("");
  const [manualAlt, setManualAlt] = useState("");
  const [manualType, setManualType] = useState<MediaType>("image");

  const load = async () => {
    setLoading(true);
    const { data, error } = await sb
      .from("evangelization_media")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) setError(error.message);
    else setRows((data ?? []) as EvangelizationMediaRow[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nextSortOrder = () => (rows.length ? Math.max(...rows.map((r) => r.sort_order)) + 1 : 1);

  const addManual = async () => {
    if (!manualUrl.trim()) return;
    setError(null);
    const { error } = await sb
      .from("evangelization_media")
      .insert({
        url: manualUrl.trim(),
        alt: manualAlt.trim() || null,
        media_type: manualType,
        sort_order: nextSortOrder(),
        visible: true,
      });
    if (error) {
      setError(error.message);
      return;
    }
    setManualUrl("");
    setManualAlt("");
    setManualType("image");
    await load();
  };

  const toggleVisible = async (row: EvangelizationMediaRow) => {
    const { error } = await sb
      .from("evangelization_media")
      .update({ visible: !row.visible })
      .eq("id", row.id);
    if (error) setError(error.message);
    else load();
  };

  const updateSort = async (id: string, sort_order: number) => {
    const { error } = await sb
      .from("evangelization_media")
      .update({ sort_order })
      .eq("id", id);
    if (error) setError(error.message);
    else load();
  };

  const updateAlt = async (id: string, alt: string) => {
    const next = alt.trim() || null;
    const { error } = await sb
      .from("evangelization_media")
      .update({ alt: next })
      .eq("id", id);
    if (error) setError(error.message);
    else load();
  };

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar este item?")) return;
    const { error } = await sb.from("evangelization_media").delete().eq("id", id);
    if (error) setError(error.message);
    else await load();
  };

  return (
    <div>
      <PageHeader
        title="Evangelización"
        subtitle="Gestioná los items existentes (orden, descripción, visibilidad)."
      />

      <Card className="mb-6">
        <h2 className="text-sm font-bold text-slate-900">Agregar por URL</h2>
        <p className="mt-1 text-xs text-slate-500">
          Pegá la ruta de un archivo existente (ej: <code>/evangelizacion/foto.jpg</code>) o una URL completa.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_220px_auto]">
          <Field label="URL">
            <TextInput
              placeholder="https://… o /evangelizacion/foto.jpg"
              value={manualUrl}
              onChange={(e) => {
                const v = e.target.value;
                setManualUrl(v);
                setManualType(detectMediaTypeFromUrl(v));
              }}
            />
          </Field>
          <Field label="Descripción (opcional)" hint="Si la dejás vacía, no se mostrará en el sitio">
            <TextInput
              placeholder="Bautismo de Pedro"
              value={manualAlt}
              onChange={(e) => setManualAlt(e.target.value)}
            />
          </Field>
          <Field label="Tipo">
            <div className="inline-flex h-10 w-full items-center rounded-lg border border-slate-300 bg-slate-100 p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setManualType("image")}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 text-xs font-semibold transition-all h-full ${
                  manualType === "image"
                    ? "bg-white text-deep-blue shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <ImageIcon className="h-3.5 w-3.5" />
                Imagen
              </button>
              <button
                type="button"
                onClick={() => setManualType("video")}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 text-xs font-semibold transition-all h-full ${
                  manualType === "video"
                    ? "bg-white text-deep-blue shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <VideoIcon className="h-3.5 w-3.5" />
                Video
              </button>
            </div>
          </Field>
          <div className="self-end">
            <Button onClick={addManual} disabled={!manualUrl.trim()}>
              <Upload className="h-4 w-4" />
              Agregar
            </Button>
          </div>
        </div>
      </Card>

      {error && (
        <Card className="mb-4 border-rose-200 bg-rose-50 text-sm text-rose-700">{error}</Card>
      )}

      {loading ? (
        <EmptyState message="Cargando…" />
      ) : rows.length === 0 ? (
        <EmptyState message="No hay items." />
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
