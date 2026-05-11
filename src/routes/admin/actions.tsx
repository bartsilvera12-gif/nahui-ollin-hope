import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ComponentType } from "react";
import {
  Activity,
  Apple,
  ArrowDown,
  ArrowUp,
  Baby,
  Book,
  BookOpen,
  Box,
  Brush,
  Building,
  Calendar,
  CalendarDays,
  CalendarHeart,
  Church,
  Coffee,
  Coins,
  Cookie,
  Cross,
  Droplet,
  Droplets,
  Eye,
  EyeOff,
  Flower,
  Gift,
  Globe,
  GraduationCap,
  HandCoins,
  HandHeart,
  Handshake,
  Heart,
  HeartHandshake,
  HeartPulse,
  Home,
  Laugh,
  Leaf,
  Mail,
  Megaphone,
  Music,
  NotebookPen,
  Package,
  Palette,
  PartyPopper,
  Pencil,
  PiggyBank,
  Pill,
  Pizza,
  Plus,
  Rainbow,
  Sandwich,
  Save,
  School,
  Shirt,
  Smile,
  SmilePlus,
  Soup,
  Sparkles,
  Sprout,
  Star,
  Stethoscope,
  Sun,
  Sunrise,
  Tent,
  ThumbsUp,
  Trash2,
  User,
  UserPlus,
  Users,
  Users2,
  Utensils,
  UtensilsCrossed,
  Wallet,
  X,
} from "lucide-react";
import { getSupabase, type ActionRow } from "@/lib/supabase";
import { Button, Card, EmptyState, Field, PageHeader, TextArea, TextInput } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/actions")({
  component: ActionsAdmin,
});

type LucideIcon = ComponentType<{ className?: string }>;

const ICON_OPTIONS: { name: string; Icon: LucideIcon; label: string }[] = [
  // Comida
  { name: "Utensils", Icon: Utensils, label: "Cubiertos" },
  { name: "UtensilsCrossed", Icon: UtensilsCrossed, label: "Comedor" },
  { name: "Apple", Icon: Apple, label: "Fruta" },
  { name: "Cookie", Icon: Cookie, label: "Galleta" },
  { name: "Pizza", Icon: Pizza, label: "Pizza" },
  { name: "Sandwich", Icon: Sandwich, label: "Sándwich" },
  { name: "Soup", Icon: Soup, label: "Sopa" },
  { name: "Coffee", Icon: Coffee, label: "Café" },
  { name: "Droplet", Icon: Droplet, label: "Gota de agua" },
  { name: "Droplets", Icon: Droplets, label: "Agua" },
  // Regalos / objetos
  { name: "Gift", Icon: Gift, label: "Regalo" },
  { name: "Package", Icon: Package, label: "Caja" },
  { name: "Box", Icon: Box, label: "Donaciones" },
  { name: "Shirt", Icon: Shirt, label: "Ropa" },
  // Personas / niños
  { name: "Baby", Icon: Baby, label: "Bebé" },
  { name: "Smile", Icon: Smile, label: "Sonrisa" },
  { name: "SmilePlus", Icon: SmilePlus, label: "Alegría" },
  { name: "Laugh", Icon: Laugh, label: "Risa" },
  { name: "Users", Icon: Users, label: "Comunidad" },
  { name: "Users2", Icon: Users2, label: "Grupo" },
  { name: "User", Icon: User, label: "Persona" },
  { name: "UserPlus", Icon: UserPlus, label: "Sumar" },
  { name: "ThumbsUp", Icon: ThumbsUp, label: "Aprobación" },
  // Salud
  { name: "Heart", Icon: Heart, label: "Amor" },
  { name: "HeartPulse", Icon: HeartPulse, label: "Vida" },
  { name: "Activity", Icon: Activity, label: "Actividad" },
  { name: "Stethoscope", Icon: Stethoscope, label: "Salud" },
  { name: "Pill", Icon: Pill, label: "Medicina" },
  // Educación
  { name: "BookOpen", Icon: BookOpen, label: "Lectura" },
  { name: "Book", Icon: Book, label: "Libro" },
  { name: "GraduationCap", Icon: GraduationCap, label: "Educación" },
  { name: "NotebookPen", Icon: NotebookPen, label: "Estudio" },
  { name: "School", Icon: School, label: "Escuela" },
  // Hogar
  { name: "Home", Icon: Home, label: "Hogar" },
  { name: "Tent", Icon: Tent, label: "Refugio" },
  { name: "Building", Icon: Building, label: "Edificio" },
  // Acompañamiento / comunidad
  { name: "HandHeart", Icon: HandHeart, label: "Acompañamiento" },
  { name: "HeartHandshake", Icon: HeartHandshake, label: "Solidaridad" },
  { name: "Handshake", Icon: Handshake, label: "Compromiso" },
  { name: "PartyPopper", Icon: PartyPopper, label: "Celebración" },
  // Esperanza / valores
  { name: "Sparkles", Icon: Sparkles, label: "Esperanza" },
  { name: "Sun", Icon: Sun, label: "Jornada" },
  { name: "Sunrise", Icon: Sunrise, label: "Amanecer" },
  { name: "Star", Icon: Star, label: "Estrella" },
  { name: "Flower", Icon: Flower, label: "Flor" },
  { name: "Leaf", Icon: Leaf, label: "Hoja" },
  { name: "Sprout", Icon: Sprout, label: "Brote" },
  { name: "Rainbow", Icon: Rainbow, label: "Arcoíris" },
  // Arte / música
  { name: "Music", Icon: Music, label: "Música" },
  { name: "Palette", Icon: Palette, label: "Arte" },
  { name: "Brush", Icon: Brush, label: "Pincel" },
  // Religión
  { name: "Cross", Icon: Cross, label: "Cruz" },
  { name: "Church", Icon: Church, label: "Iglesia" },
  // Comunicación
  { name: "Megaphone", Icon: Megaphone, label: "Campaña" },
  { name: "Mail", Icon: Mail, label: "Mensaje" },
  // Calendario
  { name: "Calendar", Icon: Calendar, label: "Calendario" },
  { name: "CalendarDays", Icon: CalendarDays, label: "Días" },
  { name: "CalendarHeart", Icon: CalendarHeart, label: "Jornada solidaria" },
  // Mundo
  { name: "Globe", Icon: Globe, label: "Mundo" },
  // Donación financiera
  { name: "HandCoins", Icon: HandCoins, label: "Donación" },
  { name: "Wallet", Icon: Wallet, label: "Billetera" },
  { name: "Coins", Icon: Coins, label: "Aportes" },
  { name: "PiggyBank", Icon: PiggyBank, label: "Ahorro" },
];

const ICON_MAP: Record<string, LucideIcon> = Object.fromEntries(
  ICON_OPTIONS.map((o) => [o.name, o.Icon]),
);

function renderIcon(name: string | undefined, className?: string) {
  const Icon = (name && ICON_MAP[name]) || Heart;
  return <Icon className={className} />;
}

type EditState = Partial<ActionRow> & { _new?: boolean };

const emptyAction: EditState = {
  _new: true,
  icon: "Heart",
  title: "",
  description: "",
  image: "",
  visible: true,
};

function ActionsAdmin() {
  const sb = useMemo(() => getSupabase(), []);
  const [rows, setRows] = useState<ActionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await sb
      .from("actions")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) setError(error.message);
    else setRows((data ?? []) as ActionRow[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nextSortOrder = () =>
    rows.length ? Math.max(...rows.map((r) => r.sort_order)) + 1 : 1;

  const save = async (item: EditState) => {
    setError(null);
    const payload = {
      icon: item.icon?.trim() || "Heart",
      title: item.title?.trim() ?? "",
      description: item.description?.trim() ?? "",
      image: item.image?.trim() ?? "",
      visible: !!item.visible,
      ...(item._new ? { sort_order: nextSortOrder() } : {}),
    };
    if (!payload.title || !payload.description || !payload.image) {
      setError("Título, descripción e imagen son obligatorios.");
      return;
    }
    const { error } = item._new
      ? await sb.from("actions").insert(payload)
      : await sb.from("actions").update(payload).eq("id", item.id!);
    if (error) setError(error.message);
    else {
      setEditing(null);
      await load();
    }
  };

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar esta acción?")) return;
    const { error } = await sb.from("actions").delete().eq("id", id);
    if (error) setError(error.message);
    else await load();
  };

  const toggleVisible = async (row: ActionRow) => {
    const { error } = await sb.from("actions").update({ visible: !row.visible }).eq("id", row.id);
    if (error) setError(error.message);
    else load();
  };

  const swap = async (i: number, direction: -1 | 1) => {
    const a = rows[i];
    const b = rows[i + direction];
    if (!a || !b) return;
    setError(null);
    const [errA, errB] = await Promise.all([
      sb.from("actions").update({ sort_order: b.sort_order }).eq("id", a.id),
      sb.from("actions").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]).then((r) => [r[0].error, r[1].error]);
    if (errA || errB) setError((errA ?? errB)!.message);
    else load();
  };

  return (
    <div>
      <PageHeader
        title="Acciones"
        subtitle="Tarjetas mostradas en la sección 'Acciones que realizamos'."
        action={
          <Button onClick={() => setEditing({ ...emptyAction })}>
            <Plus className="h-4 w-4" />
            Nueva acción
          </Button>
        }
      />

      {error && (
        <Card className="mb-4 border-rose-200 bg-rose-50 text-sm text-rose-700">{error}</Card>
      )}

      {loading ? (
        <EmptyState message="Cargando…" />
      ) : rows.length === 0 ? (
        <EmptyState message="Sin acciones todavía. Creá la primera con el botón de arriba." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((row, idx) => (
            <Card key={row.id} className="flex flex-col">
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-100">
                {row.image && (
                  <img src={row.image} alt={row.title} className="h-full w-full object-cover" />
                )}
                <span className="absolute left-2 top-2 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-deep-blue shadow-sm">
                  {renderIcon(row.icon, "h-5 w-5")}
                </span>
                {!row.visible && (
                  <span className="absolute right-2 top-2 rounded-full bg-slate-900/70 px-2 py-0.5 text-xs font-semibold text-white">
                    Oculto
                  </span>
                )}
              </div>
              <h3 className="mt-3 text-base font-bold text-slate-900">{row.title}</h3>
              <p className="mt-1 line-clamp-3 text-sm text-slate-600">{row.description}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <div className="flex rounded-lg border border-slate-200 bg-white">
                  <button
                    className="grid h-9 w-9 place-items-center text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                    disabled={idx === 0}
                    onClick={() => swap(idx, -1)}
                    title="Mover arriba"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    className="grid h-9 w-9 place-items-center border-l border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                    disabled={idx === rows.length - 1}
                    onClick={() => swap(idx, 1)}
                    title="Mover abajo"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
                <Button variant="outline" onClick={() => toggleVisible(row)} title={row.visible ? "Ocultar" : "Mostrar"}>
                  {row.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setEditing({ ...row })}>
                  <Pencil className="h-4 w-4" />
                  Editar
                </Button>
                <Button variant="danger" onClick={() => remove(row.id)} title="Eliminar">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {editing && (
        <ActionEditor
          value={editing}
          onChange={setEditing}
          onClose={() => setEditing(null)}
          onSave={() => save(editing)}
        />
      )}
    </div>
  );
}

function ActionEditor({
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
        className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-900">
            {value._new ? "Nueva acción" : "Editar acción"}
          </h2>
          <Button variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <Field label="Icono">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="mb-3 flex items-center gap-3">
                <span className="grid h-14 w-14 place-items-center rounded-xl bg-deep-blue text-white shadow-sm">
                  {renderIcon(value.icon, "h-7 w-7")}
                </span>
                <div className="text-sm text-slate-600">
                  <p className="font-semibold text-slate-800">
                    {ICON_OPTIONS.find((o) => o.name === value.icon)?.label ?? value.icon}
                  </p>
                  <p className="text-xs">Elegí el ícono que mejor represente esta acción.</p>
                </div>
              </div>
              <div className="grid max-h-56 grid-cols-7 gap-1 overflow-y-auto rounded-lg bg-white p-2 sm:grid-cols-10">
                {ICON_OPTIONS.map((opt) => {
                  const selected = value.icon === opt.name;
                  return (
                    <button
                      key={opt.name}
                      type="button"
                      onClick={() => onChange({ ...value, icon: opt.name })}
                      title={opt.label}
                      className={`grid h-10 place-items-center rounded-lg transition-colors ${
                        selected
                          ? "bg-deep-blue text-white shadow"
                          : "text-slate-600 hover:bg-turquoise/10"
                      }`}
                    >
                      <opt.Icon className="h-5 w-5" />
                    </button>
                  );
                })}
              </div>
            </div>
          </Field>

          <Field label="Título">
            <TextInput
              value={value.title ?? ""}
              onChange={(e) => onChange({ ...value, title: e.target.value })}
            />
          </Field>

          <Field label="Descripción">
            <TextArea
              rows={3}
              value={value.description ?? ""}
              onChange={(e) => onChange({ ...value, description: e.target.value })}
            />
          </Field>

          <Field
            label="URL de imagen"
            hint="Subí desde Galería o usá una ruta /galeria/galeria-XX.jpg"
          >
            <TextInput
              value={value.image ?? ""}
              onChange={(e) => onChange({ ...value, image: e.target.value })}
              placeholder="/galeria/galeria-05.jpg"
            />
          </Field>

          {value.image && (
            <div className="aspect-[16/9] overflow-hidden rounded-xl bg-slate-100">
              <img src={value.image} alt="preview" className="h-full w-full object-cover" />
            </div>
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
