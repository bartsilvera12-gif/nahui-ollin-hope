import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { getSupabase, type StoryRow } from "@/lib/supabase";
import {
  Button,
  Card,
  EmptyState,
  Field,
  ImageUrlList,
  PageHeader,
  TextArea,
  TextInput,
} from "@/components/admin/ui";

export const Route = createFileRoute("/admin/stories")({
  component: StoriesAdmin,
});

type EditState = Partial<StoryRow> & { _new?: boolean };

const emptyStory: EditState = {
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

function StoriesAdmin() {
  const sb = useMemo(() => getSupabase(), []);
  const [rows, setRows] = useState<StoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await sb
      .from("stories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) setError(error.message);
    else setRows((data ?? []) as StoryRow[]);
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
      ? await sb.from("stories").insert(payload)
      : await sb.from("stories").update(payload).eq("id", item.id!);
    if (error) setError(error.message);
    else {
      setEditing(null);
      await load();
    }
  };

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar este testimonio?")) return;
    const { error } = await sb.from("stories").delete().eq("id", id);
    if (error) setError(error.message);
    else await load();
  };

  const toggleVisible = async (row: StoryRow) => {
    const { error } = await sb.from("stories").update({ visible: !row.visible }).eq("id", row.id);
    if (error) setError(error.message);
    else load();
  };

  return (
    <div>
      <PageHeader
        title="Testimonios"
        subtitle="Historias que aparecen en el carrusel de la sección 'Historias que nos inspiran'."
        action={
          <Button onClick={() => setEditing({ ...emptyStory })}>
            <Plus className="h-4 w-4" />
            Nuevo testimonio
          </Button>
        }
      />

      {error && (
        <Card className="mb-4 border-rose-200 bg-rose-50 text-sm text-rose-700">{error}</Card>
      )}

      {loading ? (
        <EmptyState message="Cargando…" />
      ) : rows.length === 0 ? (
        <EmptyState message="Todavía no hay testimonios. Creá el primero con el botón de arriba." />
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
        <StoryEditor
          value={editing}
          onChange={setEditing}
          onClose={() => setEditing(null)}
          onSave={() => save(editing)}
        />
      )}
    </div>
  );
}

function StoryEditor({
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
            {value._new ? "Nuevo testimonio" : "Editar testimonio"}
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
                placeholder="Marzo 2026"
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
              rows={4}
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
            Este testimonio usa modo <strong>Antes / Ahora</strong>
          </label>

          {value.has_before_after ? (
            <>
              <ImageUrlList
                label="Imágenes ANTES"
                value={value.before_images ?? []}
                onChange={(arr) => onChange({ ...value, before_images: arr })}
              />
              <ImageUrlList
                label="Imágenes AHORA"
                value={value.after_images ?? []}
                onChange={(arr) => onChange({ ...value, after_images: arr })}
              />
            </>
          ) : (
            <ImageUrlList
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
