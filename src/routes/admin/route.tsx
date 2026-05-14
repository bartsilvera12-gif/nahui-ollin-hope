import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Cross, Images, ListChecks, LayoutDashboard, LogOut, MessageSquareHeart } from "lucide-react";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const isLoginPage = pathname === "/admin/login";

  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(!isLoginPage);

  useEffect(() => {
    if (!supabaseConfigured) {
      setChecking(false);
      return;
    }
    const sb = getSupabase();
    let active = true;

    sb.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setChecking(false);
      if (!data.session && !isLoginPage) {
        navigate({ to: "/admin/login" });
      } else if (data.session && isLoginPage) {
        navigate({ to: "/admin" });
      }
    });

    const { data: sub } = sb.auth.onAuthStateChange((_event, sess) => {
      if (!active) return;
      setSession(sess);
      if (!sess && !isLoginPage) navigate({ to: "/admin/login" });
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [isLoginPage, navigate]);

  if (!supabaseConfigured) {
    return <ConfigError />;
  }

  if (checking) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 text-slate-500">
        Cargando panel…
      </div>
    );
  }

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Sidebar email={session?.user?.email ?? ""} />
      <main className="ml-0 px-4 py-6 md:ml-60 md:px-10 md:py-10">
        <Outlet />
      </main>
    </div>
  );
}

function Sidebar({ email }: { email: string }) {
  const links = [
    { to: "/admin", label: "Resumen", icon: LayoutDashboard, exact: true },
    { to: "/admin/stories", label: "Testimonios", icon: MessageSquareHeart },
    { to: "/admin/evangelization", label: "Evangelización", icon: Cross },
    { to: "/admin/actions", label: "Acciones", icon: ListChecks },
    { to: "/admin/gallery", label: "Galería", icon: Images },
  ];

  const signOut = async () => {
    await getSupabase().auth.signOut();
  };

  return (
    <aside className="fixed inset-x-0 top-0 z-30 flex items-center gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-3 md:inset-y-0 md:right-auto md:w-60 md:flex-col md:items-stretch md:gap-1 md:border-b-0 md:border-r md:px-4 md:py-6">
      <div className="hidden md:mb-6 md:block">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-turquoise">Nahui Ollin</p>
        <p className="text-lg font-bold text-slate-900">Panel admin</p>
      </div>
      <nav className="flex gap-1 md:flex-col">
        {links.map(({ to, label, icon: Icon, exact }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: exact ?? false }}
            className="flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 [&.active]:bg-deep-blue [&.active]:text-white"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-2 md:ml-0 md:mt-auto md:flex-col md:items-stretch md:gap-2 md:pt-6">
        {email && (
          <p className="hidden truncate text-xs text-slate-500 md:block" title={email}>
            {email}
          </p>
        )}
        <button
          onClick={signOut}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          <LogOut className="h-4 w-4" />
          Salir
        </button>
      </div>
    </aside>
  );
}

function ConfigError() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-6">
      <div className="max-w-lg rounded-2xl border border-rose-200 bg-white p-6 shadow-sm">
        <h1 className="text-lg font-bold text-rose-700">Supabase no está configurado</h1>
        <p className="mt-2 text-sm text-slate-600">
          Definí <code className="rounded bg-slate-100 px-1.5 py-0.5">VITE_SUPABASE_URL</code> y{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5">VITE_SUPABASE_ANON_KEY</code> en el
          archivo <code className="rounded bg-slate-100 px-1.5 py-0.5">.env</code> de la raíz del
          proyecto y reiniciá <code className="rounded bg-slate-100 px-1.5 py-0.5">npm run dev</code>.
        </p>
        <p className="mt-3 text-xs text-slate-500">
          Los valores se encuentran en Supabase Dashboard → Project Settings → API.
        </p>
      </div>
    </div>
  );
}
