import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, Instagram, MapPin, Send, CheckCircle2 } from "lucide-react";
import { contactInfo } from "@/data/site";
import { SectionTitle } from "./SectionTitle";

export function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: connect to Supabase / email service later.
    setSent(true);
    setForm({ name: "", email: "", phone: "", message: "" });
    setTimeout(() => setSent(false), 6000);
  };

  const inputCls =
    "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-turquoise focus:border-turquoise transition";

  return (
    <section id="contacto" className="py-20 md:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionTitle
          eyebrow="Contacto"
          title="Hablemos"
          subtitle="Escribinos para sumarte como voluntario, donar o conocer más sobre nuestras jornadas."
        />

        <div className="mt-14 grid lg:grid-cols-3 gap-6">
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 bg-card rounded-3xl border border-border shadow-soft p-6 md:p-10"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-semibold text-foreground">Nombre</span>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`${inputCls} mt-2`} placeholder="Tu nombre" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-foreground">Email</span>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={`${inputCls} mt-2`} placeholder="tu@email.com" />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-semibold text-foreground">Teléfono</span>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={`${inputCls} mt-2`} placeholder="+595 ..." />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-semibold text-foreground">Mensaje</span>
                <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${inputCls} mt-2 resize-none`} placeholder="Contanos cómo querés colaborar..." />
              </label>
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-heart px-6 py-3.5 text-sm font-semibold text-white shadow-soft hover:scale-105 hover:brightness-110 transition-all"
            >
              <Send className="h-4 w-4" /> Enviar mensaje
            </button>

            {sent && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 flex items-center gap-3 rounded-xl bg-turquoise/10 border border-turquoise/30 px-4 py-3 text-sm text-deep-blue"
              >
                <CheckCircle2 className="h-5 w-5 text-turquoise" />
                Gracias por escribirnos. Pronto nos pondremos en contacto.
              </motion.div>
            )}
          </motion.form>

          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-gradient-brand rounded-3xl shadow-soft p-6 md:p-8 text-white space-y-5"
          >
            <h3 className="text-xl font-bold">Información de contacto</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0"><Phone className="h-5 w-5" /></div>
                <div><p className="font-semibold">WhatsApp</p><p className="text-white/80">{contactInfo.whatsapp}</p></div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0"><Mail className="h-5 w-5" /></div>
                <div><p className="font-semibold">Email</p><p className="text-white/80">{contactInfo.email}</p></div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0"><Instagram className="h-5 w-5" /></div>
                <div><p className="font-semibold">Instagram</p><p className="text-white/80">{contactInfo.instagram}</p></div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0"><MapPin className="h-5 w-5" /></div>
                <div><p className="font-semibold">Ubicación</p><p className="text-white/80">{contactInfo.location}</p></div>
              </li>
            </ul>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
