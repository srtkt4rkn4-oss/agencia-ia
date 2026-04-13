"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { motion, useScroll, useInView, AnimatePresence } from "framer-motion";
import FadeInWhenVisible from "./FadeInWhenVisible";

// ── Data ─────────────────────────────────────────────────────────────────────

const services = [
  {
    title: "Auditoría de microprocesos",
    text: "Identificamos tareas repetitivas, cuellos de botella y flujos internos con alto potencial de automatización mediante IA.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 4.65 4.65a7.5 7.5 0 0 0 11.99 11.99Z" />
      </svg>
    ),
  },
  {
    title: "Diseño de soluciones",
    text: "Definimos el sistema adecuado: agentes de IA, automatizaciones, integraciones con CRM, ERP y flujos operativos medibles.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
      </svg>
    ),
  },
  {
    title: "Implementación end-to-end",
    text: "Desarrollamos, probamos e integramos las soluciones en el negocio para que generen impacto real desde el inicio.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
      </svg>
    ),
  },
  {
    title: "Optimización continua",
    text: "Monitorizamos resultados, reducimos errores y mejoramos el rendimiento para maximizar el retorno.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
      </svg>
    ),
  },
];

const useCases = [
  "Clasificación y respuesta de emails",
  "Generación automática de propuestas y documentos",
  "Actualización de CRM y reporting interno",
  "Gestión documental y extracción de datos",
  "Soporte interno para equipos de operaciones",
  "Automatización de seguimiento comercial",
];

const metrics = [
  {
    value: "-40%",
    description: "Reducción media de tiempo en tareas operativas repetitivas",
  },
  {
    value: "3 semanas",
    description: "Hasta tener el primer proceso automatizado funcionando",
  },
  {
    value: "x3",
    description: "Más capacidad operativa sin aumentar el equipo",
  },
];

const steps = [
  {
    n: "01",
    title: "Diagnóstico",
    text: "Analizamos operaciones, detectamos microprocesos automatizables y priorizamos por impacto y facilidad de implantación.",
  },
  {
    n: "02",
    title: "Diseño",
    text: "Definimos arquitectura, herramientas, integraciones y métricas de éxito para cada caso.",
  },
  {
    n: "03",
    title: "Implementación",
    text: "Construimos la solución, la conectamos con tus sistemas y validamos su funcionamiento con tu equipo.",
  },
  {
    n: "04",
    title: "Escalado",
    text: "Una vez probado el valor, ampliamos automatizaciones a otras áreas del negocio.",
  },
];

const faqs = [
  {
    q: "¿Qué tipo de empresas pueden trabajar con AgencIA?",
    a: "Principalmente pymes y empresas de servicios, operaciones, administración o ventas que tengan tareas repetitivas y procesos internos susceptibles de automatización.",
  },
  {
    q: "¿Hace falta tener una gran infraestructura tecnológica?",
    a: "No. Muchas automatizaciones se pueden implantar sobre herramientas que la empresa ya utiliza, como email, CRM, ERP, hojas de cálculo o gestores documentales.",
  },
  {
    q: "¿Cómo priorizáis qué automatizar primero?",
    a: "Priorizamos por impacto económico, frecuencia del proceso, tiempo consumido por el equipo, riesgo de error y facilidad de implementación.",
  },
];

const initialFormData = {
  nombre: "",
  empresa: "",
  email: "",
  mensaje: "",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function validateLeadForm(formData: typeof initialFormData) {
  const trimmed = {
    nombre: formData.nombre.trim(),
    empresa: formData.empresa.trim(),
    email: formData.email.trim(),
    mensaje: formData.mensaje.trim(),
  };

  if (!trimmed.nombre || !trimmed.empresa || !trimmed.email || !trimmed.mensaje) {
    return "Completa todos los campos antes de enviar la solicitud.";
  }

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.email);
  if (!isValidEmail) {
    return "Introduce un email profesional válido.";
  }

  return "";
}

function SectionTitle({
  eyebrow,
  title,
  description,
  light = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  light?: boolean;
}) {
  return (
    <div className="max-w-2xl">
      <p className={`text-sm font-semibold uppercase tracking-[0.2em] ${light ? "text-slate-400" : "text-slate-500"}`}>
        {eyebrow}
      </p>
      <h2 className={`mt-3 text-3xl font-semibold sm:text-4xl ${light ? "text-white" : ""}`}>
        {title}
      </h2>
      {description ? (
        <p className={`mt-4 text-lg ${light ? "text-slate-300" : "text-slate-600"}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

// ── Stagger animation helpers ─────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

function StaggerGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  );
}

function StaggerCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={cardVariants}>
      {children}
    </motion.div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [formData, setFormData] = useState(initialFormData);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const validationError = useMemo(() => validateLeadForm(formData), [formData]);

  // Nav scroll effect
  const { scrollY } = useScroll();
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const unsub = scrollY.on("change", (y) => setNavScrolled(y > 10));
    return unsub;
  }, [scrollY]);

  // Active section detection
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const sectionIds = ["servicios", "metodo", "faq", "contacto"];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-64px 0px -40% 0px", threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status !== "idle") {
      setStatus("idle");
      setErrorMessage("");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validationError) {
      setStatus("error");
      setErrorMessage(validationError);
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error ?? "Ha ocurrido un error. Inténtalo de nuevo.");
        return;
      }

      setStatus("success");
      setFormData(initialFormData);
    } catch {
      setStatus("error");
      setErrorMessage("Ha ocurrido un error de red. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* ── NAV ── */}
      <motion.header
        className="sticky top-0 z-50"
        animate={{
          backgroundColor: navScrolled ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0)",
          borderBottomColor: navScrolled ? "rgba(226,232,240,0.8)" : "rgba(226,232,240,0)",
          backdropFilter: navScrolled ? "blur(12px)" : "blur(0px)",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{ borderBottomWidth: 1, borderBottomStyle: "solid" }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="text-xl font-semibold tracking-tight">
            Agenc<span className="text-slate-500">IA</span>
          </div>
          <nav className="hidden gap-6 text-sm md:flex">
            {(
              [
                { id: "servicios", label: "Servicios" },
                { id: "metodo",    label: "Método" },
                { id: "faq",       label: "FAQ" },
                { id: "contacto",  label: "Contacto" },
              ] as const
            ).map(({ id, label }) => {
              const isActive = activeSection === id;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  className={`relative py-1 transition-colors duration-200 ${
                    isActive ? "text-slate-900" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {label}
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-slate-900" />
                  )}
                </a>
              );
            })}
          </nav>
          <a
            href="#contacto"
            className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Hablar ahora
          </a>
        </div>
      </motion.header>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />
        <div className="relative mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
          <div className="max-w-4xl">
            <motion.div
              className="mb-6 inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0 }}
            >
              AgencIA · Automatización inteligente para empresas
            </motion.div>

            <motion.h1
              className="max-w-4xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            >
              AgencIA convierte tareas repetitivas en sistemas{" "}
              <span className="text-blue-600">automáticos</span> que hacen
              crecer tu empresa.
            </motion.h1>

            <motion.p
              className="mt-6 max-w-2xl text-lg leading-8 text-slate-600"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
            >
              Ayudamos a empresas a encontrar tareas repetitivas de alto coste
              operativo, diseñar soluciones a medida e implementarlas para
              ahorrar tiempo, reducir errores y escalar operaciones.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.45 }}
            >
              <a
                href="#contacto"
                className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-medium text-white shadow-lg transition hover:-translate-y-px"
              >
                Solicitar diagnóstico
              </a>
              <a
                href="#servicios"
                className="rounded-2xl border border-slate-300 px-6 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
              >
                Ver servicios
              </a>
            </motion.div>

            <motion.div
              className="mt-10 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.6 }}
            >
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-2xl font-semibold">-40%</p>
                <p className="mt-1 text-sm text-slate-600">
                  Tiempo operativo en tareas repetitivas
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-2xl font-semibold">24/7</p>
                <p className="mt-1 text-sm text-slate-600">
                  Automatizaciones activas y monitorizadas
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-2xl font-semibold">4 sem.</p>
                <p className="mt-1 text-sm text-slate-600">
                  Hasta ver el primer resultado medible en tu negocio
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SERVICIOS ── */}
      <section id="servicios" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <FadeInWhenVisible>
          <SectionTitle
            eyebrow="Servicios"
            title="De la detección de oportunidades a la implementación real"
            description="No vendemos humo ni demos bonitas. Construimos automatizaciones que encajan en el flujo real de la empresa."
          />
        </FadeInWhenVisible>
        <StaggerGrid className="mt-12 grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <StaggerCard
              key={service.title}
              className="rounded-3xl border border-slate-200 p-8 shadow-sm"
            >
              <div className="text-slate-400">{service.icon}</div>
              <h3 className="mt-4 text-xl font-semibold">{service.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{service.text}</p>
            </StaggerCard>
          ))}
        </StaggerGrid>
      </section>

      {/* ── CASOS DE USO ── */}
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <FadeInWhenVisible>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                Casos de uso
              </p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
                Áreas donde la automatización con IA genera valor rápido
              </h2>
              <p className="mt-4 max-w-xl leading-7 text-slate-300">
                Empezamos por microprocesos concretos: tareas pequeñas,
                repetitivas y frecuentes donde la mejora se nota desde las
                primeras semanas.
              </p>
            </FadeInWhenVisible>
            <StaggerGrid className="grid gap-4 sm:grid-cols-2">
              {useCases.map((item) => (
                <StaggerCard
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <p className="font-medium">{item}</p>
                </StaggerCard>
              ))}
            </StaggerGrid>
          </div>
        </div>
      </section>

      {/* ── MÉTRICAS ── */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <StaggerGrid className="grid gap-6 md:grid-cols-3">
          {metrics.map((item) => (
            <StaggerCard
              key={item.value}
              className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <p className="text-4xl font-bold tracking-tight">{item.value}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
            </StaggerCard>
          ))}
        </StaggerGrid>
      </section>

      {/* ── MÉTODO ── */}
      <section id="metodo" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <FadeInWhenVisible>
          <SectionTitle
            eyebrow="Método"
            title="Un proceso claro para implantar IA sin fricción"
          />
        </FadeInWhenVisible>
        <StaggerGrid className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step) => (
            <StaggerCard
              key={step.n}
              className="rounded-3xl border border-slate-200 p-8 shadow-sm"
            >
              <p className="text-sm font-semibold text-slate-500">{step.n}</p>
              <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{step.text}</p>
            </StaggerCard>
          ))}
        </StaggerGrid>
      </section>

      {/* ── PROPUESTA DE VALOR ── */}
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <FadeInWhenVisible>
          <div className="rounded-[2rem] bg-slate-950 p-8 shadow-sm lg:p-12">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <SectionTitle
                  eyebrow="Propuesta de valor"
                  title="Convertimos procesos invisibles en eficiencia medible"
                  description="Muchas empresas no necesitan una gran transformación para empezar con IA. Necesitan detectar qué tareas exactas automatizar primero, con qué sistema y con qué retorno."
                  light
                />
              </div>
              <StaggerGrid className="grid gap-4">
                <StaggerCard className="rounded-2xl bg-white/10 p-5">
                  <p className="font-semibold text-white">Menos carga manual</p>
                  <p className="mt-2 text-sm text-slate-300">
                    Reducimos trabajo repetitivo para liberar tiempo del equipo.
                  </p>
                </StaggerCard>
                <StaggerCard className="rounded-2xl bg-white/10 p-5">
                  <p className="font-semibold text-white">Menos errores</p>
                  <p className="mt-2 text-sm text-slate-300">
                    Estandarizamos tareas y mejoramos la consistencia operativa.
                  </p>
                </StaggerCard>
                <StaggerCard className="rounded-2xl bg-white/10 p-5">
                  <p className="font-semibold text-white">Más escalabilidad</p>
                  <p className="mt-2 text-sm text-slate-300">
                    Preparamos el negocio para crecer sin ampliar estructura al
                    mismo ritmo.
                  </p>
                </StaggerCard>
              </StaggerGrid>
            </div>
          </div>
        </FadeInWhenVisible>
      </section>

      {/* ── FAQ ── */}
      <section
        id="faq"
        className="mx-auto max-w-7xl border-t border-slate-200 px-6 py-20 lg:px-8"
      >
        <FadeInWhenVisible>
          <SectionTitle eyebrow="FAQ" title="Preguntas frecuentes" />
        </FadeInWhenVisible>
        <FadeInWhenVisible delay={0.1}>
          <div className="mt-10 grid gap-3">
            {faqs.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={item.q}
                  className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="flex w-full items-center justify-between px-6 py-5 text-left"
                  >
                    <span className="text-base font-semibold">{item.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="ml-4 shrink-0 text-slate-400"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <p className="px-6 pb-5 leading-7 text-slate-600">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </FadeInWhenVisible>
      </section>

      {/* ── CONTACTO ── */}
      <section id="contacto" className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <FadeInWhenVisible>
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Contacto
              </p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
                Solicita un diagnóstico inicial
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Revisamos tus procesos, detectamos oportunidades de
                automatización y te proponemos un plan de implementación claro.
              </p>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.15}>
            <form
              onSubmit={handleSubmit}
              className="mt-10 grid gap-6 md:grid-cols-2"
              noValidate
            >
              <input
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none ring-0"
                placeholder="Nombre"
              />
              <input
                name="empresa"
                value={formData.empresa}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none ring-0"
                placeholder="Empresa"
              />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none ring-0 md:col-span-2"
                placeholder="Email profesional"
              />
              <textarea
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                className="min-h-[140px] rounded-2xl border border-slate-300 px-4 py-3 outline-none ring-0 md:col-span-2"
                placeholder="Cuéntanos qué área o proceso quieres mejorar"
              />
              <div className="flex flex-col gap-3 md:col-span-2">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-fit rounded-2xl bg-slate-900 px-6 py-3 text-sm font-medium text-white shadow-lg transition hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                >
                  {status === "loading" ? "Enviando..." : "Enviar solicitud"}
                </button>
                {status === "error" ? (
                  <p className="text-sm text-red-600">{errorMessage}</p>
                ) : null}
                {status === "success" ? (
                  <p className="text-sm text-emerald-600">
                    Solicitud recibida, te contactamos en menos de 48h
                  </p>
                ) : null}
                <p className="text-xs text-slate-400">
                  Tus datos se usan únicamente para contactarte. No los
                  compartimos con terceros.
                </p>
              </div>
            </form>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="bg-slate-950">
        <FadeInWhenVisible>
          <div className="mx-auto max-w-7xl px-6 py-24 text-center lg:px-8">
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              ¿Listo para automatizar tu empresa?
            </h2>
            <p className="mt-4 text-lg text-slate-300">
              El diagnóstico inicial es gratuito y sin compromiso.
            </p>
            <a
              href="#contacto"
              className="mt-10 inline-block rounded-2xl bg-white px-8 py-4 text-sm font-semibold text-slate-900 shadow-lg transition hover:-translate-y-px"
            >
              Solicitar diagnóstico
            </a>
          </div>
        </FadeInWhenVisible>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 text-sm text-slate-600 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="font-semibold text-slate-900">AgencIA</p>
            <p>Automatización inteligente para empresas.</p>
            <div className="mt-2 flex flex-col gap-1">
              <a
                href="mailto:hola@agencia-ia.com"
                className="hover:text-slate-900"
              >
                hola@agencia-ia.com
              </a>
              <a
                href="#"
                className="hover:text-slate-900"
              >
                LinkedIn
              </a>
            </div>
          </div>
          <div className="flex gap-6">
            <a href="#servicios" className="hover:text-slate-900">Servicios</a>
            <a href="#faq" className="hover:text-slate-900">FAQ</a>
            <a href="#contacto" className="hover:text-slate-900">Contacto</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
