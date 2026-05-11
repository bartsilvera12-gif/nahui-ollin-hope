import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Eye, EyeOff, Trash2, Upload } from "lucide-react";
import { getSupabase, uploadMedia, type GalleryImageRow } from "@/lib/supabase";
import { Button, Card, EmptyState, Field, PageHeader, TextInput } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/gallery")({
  component: GalleryAdmin,
});

function GalleryAdmin() {
  const sb = useMemo(() => getSupabase(), []);
  const [rows, setRows] = useState<GalleryImageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const [manualAlt, setManualAlt] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await sb
      .from("gallery_images")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) setError(error.message);
    else setRows((data ?? []) as GalleryImageRow[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nextSortOrder = () => (rows.length ? Math.max(...rows.map((r) => r.sort_order)) + 1 : 1);

  const insertRow = async (url: string, alt: string | null) => {
    const { error } = await sb
      .from("gallery_images")
      .insert({ url, alt: alt || null, sort_order: nextSortOrder(), visible: true });
    if (error) throw error;
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const publicUrl = await uploadMedia(file, "gallery");
        await insertRow(publicUrl, file.name);
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir las imágenes");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const addManual = async () => {
    if (!manualUrl.trim()) return;
    setError(null);
    try {
      await insertRow(manualUrl.trim(), manualAlt.trim() || null);
      setManualUrl("");
      setManualAlt("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error agregando imagen");
    }
  };

  const toggleVisible = async (row: GalleryImageRow) => {
    const { error } = await sb
      .from("gallery_images")
      .update({ visible: !row.visible })
      .eq("id", row.id);
    if (error) setError(error.message);
    else load();
  };

  const updateSort = async (id: string, sort_order: number) => {
    const { error } = await sb.from("gallery_images").update({ sort_order }).eq("id", id);
    if (error) setError(error.message);
    else load();
  };

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar esta imagen de la galería?")) return;
    const { error } = await sb.from("gallery_images").delete().eq("id", id);
    if (error) setError(error.message);
    else await load();
  };

  return (
    <div>
      <PageHeader
        title="Galería"
        subtitle="Imágenes del mosaico público. Las nuevas se suben a Supabase Storage."
      />

      <Card className="mb-6">
        <h2 className="text-sm font-bold text-slate-900">Subir imágenes</h2>
        <p className="mt-1 text-xs text-slate-500">
          Podés subir varias a la vez. Se guardan en el bucket <code>nahui-media</code>.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            className="text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-deep-blue file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-deep-blue/90"
          />
          {uploading && <span className="text-sm text-slate-500">Subiendo…</span>}
        </div>

        <div className="mt-6 border-t border-slate-200 pt-4">
          <h3 className="text-sm font-bold text-slate-900">…o agregar por URL</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <Field label="URL">
              <TextInput
                placeholder="/galeria/galeria-22.jpg o https://…"
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
              />
            </Field>
            <Field label="Descripción (alt)">
              <TextInput
                placeholder="Niños en jornada solidaria"
                value={manualAlt}
                onChange={(e) => setManualAlt(e.target.value)}
              />
            </Field>
            <div className="self-end">
              <Button onClick={addManual} disabled={!manualUrl.trim()}>
                <Upload className="h-4 w-4" />
                Agregar
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {error && (
        <Card className="mb-4 border-rose-200 bg-rose-50 text-sm text-rose-700">{error}</Card>
      )}

      {loading ? (
        <EmptyState message="Cargando…" />
      ) : rows.length === 0 ? (
        <EmptyState message="La galería está vacía. Subí o agregá la primera imagen." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {rows.map((row) => (
            <Card key={row.id} className="p-3">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-100">
                <img src={row.url} alt={row.alt ?? ""} className="h-full w-full object-cover" />
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
                <Button variant="outline" onClick={() => toggleVisible(row)} title={row.visible ? "Ocultar" : "Mostrar"}>
                  {row.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button variant="danger" onClick={() => remove(row.id)} title="Eliminar">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
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
