import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Eye, EyeOff, Pencil, Plus, Save, Trash2, Upload, X } from "lucide-react";
import { getSupabase, uploadMedia, type EvangelizationRow } from "@/lib/supabase";
import {
  Button,
  Card,
  EmptyState,
  Field,
  PageHeader,
  TextArea,
  TextInput,
} from "@/components/admin/ui";

export const Route = createFileRoute("/admin/evangelization")({
  component: EvangelizationAdmin,
});

type EditState = Partial<EvangelizationRow> & { _new?: boolean };

const emptyCase: EditState = {
  _new: true,
  title: "",
  date: "",
  description: "",
  has_before_after: false,
  images: [],
  before_images: [],
  after_images: [],
  sort_order: 0,
  visible: true,
};

function EvangelizationAdmin() {
  const sb = useMemo(() => getSupabase(), []);
  const [rows, setRows] = useState<EvangelizationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await sb
      .from("evangelization_cases")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) setError(error.message);
    else setRows((data ?? []) as EvangelizationRow[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async (item: EditState) => {
    setError(null);
    const payload = {
      title: item.title?.trim() ?? "",
      date: item.date?.trim() || null,
      description: item.description?.trim() ?? "",
      has_before_after: !!item.has_before_after,
      images: item.images ?? [],
      before_images: item.before_images ?? [],
      after_images: item.after_images ?? [],
      sort_order: Number(item.sort_order ?? 0),
      visible: !!item.visible,
    };
    if (!payload.title || !payload.description) {
      setError("Título y descripción son obligatorios.");
      return;
    }
    const { error } = item._new
      ? await sb.from("evangelization_cases").insert(payload)
      : await sb.from("evangelization_cases").update(payload).eq("id", item.id!);
    if (error) setError(error.message);
    else {
      setEditing(null);
      await load();
    }
  };

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar este caso de evangelización?")) return;
    const { error } = await sb.from("evangelization_cases").delete().eq("id", id);
    if (error) setError(error.message);
    else await load();
  };

  const toggleVisible = async (row: EvangelizationRow) => {
    const { error } = await sb
      .from("evangelization_cases")
      .update({ visible: !row.visible })
      .eq("id", row.id);
    if (error) setError(error.message);
    else load();
  };

  return (
    <div>
      <PageHeader
        title="Evangelización"
        subtitle="Casos de acompañamiento espiritual mostrados en la sección 'Caminando con Cristo'."
        action={
          <Button onClick={() => setEditing({ ...emptyCase })}>
            <Plus className="h-4 w-4" />
            Nuevo caso
          </Button>
        }
      />

      {error && (
        <Card className="mb-4 border-rose-200 bg-rose-50 text-sm text-rose-700">{error}</Card>
      )}

      {loading ? (
        <EmptyState message="Cargando…" />
      ) : rows.length === 0 ? (
        <EmptyState message="Todavía no hay casos. Creá el primero con el botón de arriba." />
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <Card key={row.id} className="flex flex-wrap items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-base font-bold text-slate-900">{row.title}</h3>
                  {row.has_before_after && (
                    <span className="rounded-full bg-turquoise/15 px-2 py-0.5 text-xs font-semibold text-turquoise">
                      Antes / Ahora
                    </span>
                  )}
                  {!row.visible && (
                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-600">
                      Oculto
                    </span>
                  )}
                </div>
                {row.date && <p className="mt-0.5 text-xs text-slate-500">{row.date}</p>}
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">{row.description}</p>
                <p className="mt-2 text-xs text-slate-400">
                  Orden {row.sort_order} ·{" "}
                  {row.has_before_after
                    ? `${row.before_images.length} antes · ${row.after_images.length} ahora`
                    : `${row.images.length} imagen${row.images.length === 1 ? "" : "es"}`}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button variant="outline" onClick={() => toggleVisible(row)}>
                  {row.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {row.visible ? "Ocultar" : "Mostrar"}
                </Button>
                <Button variant="outline" onClick={() => setEditing({ ...row })}>
                  <Pencil className="h-4 w-4" />
                  Editar
                </Button>
                <Button variant="danger" onClick={() => remove(row.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {editing && (
        <CaseEditor
          value={editing}
          onChange={setEditing}
          onClose={() => setEditing(null)}
          onSave={() => save(editing)}
        />
      )}
    </div>
  );
}

function CaseEditor({
  value,
  onChange,
  onClose,
  onSave,
}: {
  value: EditState;
  onChange: (v: EditState) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 px-4 py-10"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-900">
            {value._new ? "Nuevo caso de evangelización" : "Editar caso"}
          </h2>
          <Button variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <Field label="Título">
            <TextInput
              value={value.title ?? ""}
              onChange={(e) => onChange({ ...value, title: e.target.value })}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Fecha (texto libre)">
              <TextInput
                placeholder="Confirmación 2025"
                value={value.date ?? ""}
                onChange={(e) => onChange({ ...value, date: e.target.value })}
              />
            </Field>
            <Field label="Orden">
              <TextInput
                type="number"
                value={value.sort_order ?? 0}
                onChange={(e) => onChange({ ...value, sort_order: Number(e.target.value) })}
              />
            </Field>
          </div>
          <Field label="Descripción">
            <TextArea
              rows={6}
              value={value.description ?? ""}
              onChange={(e) => onChange({ ...value, description: e.target.value })}
            />
          </Field>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={!!value.has_before_after}
              onChange={(e) => onChange({ ...value, has_before_after: e.target.checked })}
            />
            Este caso usa modo <strong>Antes / Ahora</strong>
          </label>

          {value.has_before_after ? (
            <>
              <ImageUploader
                label="Imágenes ANTES"
                value={value.before_images ?? []}
                onChange={(arr) => onChange({ ...value, before_images: arr })}
              />
              <ImageUploader
                label="Imágenes AHORA"
                value={value.after_images ?? []}
                onChange={(arr) => onChange({ ...value, after_images: arr })}
              />
            </>
          ) : (
            <ImageUploader
              label="Imágenes del carrusel"
              value={value.images ?? []}
              onChange={(arr) => onChange({ ...value, images: arr })}
            />
          )}

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={!!value.visible}
              onChange={(e) => onChange({ ...value, visible: e.target.checked })}
            />
            Visible en el sitio
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onSave}>
            <Save className="h-4 w-4" />
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
}

function ImageUploader({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErr(null);
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const u = await uploadMedia(file, "evangelization");
        urls.push(u);
      }
      onChange([...value, ...urls]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error al subir");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeAt = (i: number) => {
    const next = value.slice();
    next.splice(i, 1);
    onChange(next);
  };

  return (
    <Field label={label}>
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            className="text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-deep-blue file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-deep-blue/90"
          />
          {uploading && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <Upload className="h-3 w-3 animate-pulse" /> Subiendo…
            </span>
          )}
        </div>
        {err && <p className="text-xs text-rose-600">{err}</p>}

        {value.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {value.map((url, i) => (
              <div key={`${url}-${i}`} className="relative aspect-square overflow-hidden rounded-lg bg-slate-100">
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-rose-600 text-white shadow"
                  aria-label="Quitar"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <TextArea
          rows={Math.max(2, value.length)}
          placeholder="También podés pegar URLs (una por línea)"
          value={value.join("\n")}
          onChange={(e) =>
            onChange(
              e.target.value
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean),
            )
          }
        />
      </div>
    </Field>
  );
}
