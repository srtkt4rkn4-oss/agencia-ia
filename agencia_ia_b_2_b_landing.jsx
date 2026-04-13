import { useMemo, useState } from "react";

const services = [
  {
    title: "Auditoría de microprocesos",
    text: "Identificamos tareas repetitivas, cuellos de botella y flujos internos con alto potencial de automatización mediante IA."
  },
  {
    title: "Diseño de soluciones",
    text: "Definimos el sistema adecuado: agentes de IA, automatizaciones, integraciones con CRM, ERP y flujos operativos medibles."
  },
  {
    title: "Implementación end-to-end",
    text: "Desarrollamos, probamos e integramos las soluciones en el negocio para que generen impacto real desde el inicio."
  },
  {
    title: "Optimización continua",
    text: "Monitorizamos resultados, reducimos errores y mejoramos el rendimiento para maximizar el retorno."
  }
];

const useCases = [
  "Clasificación y respuesta de emails",
  "Generación automática de propuestas y documentos",
  "Actualización de CRM y reporting interno",
  "Gestión documental y extracción de datos",
  "Soporte interno para equipos de operaciones",
  "Automatización de seguimiento comercial"
];

const steps = [
  {
    n: "01",
    title: "Diagnóstico",
    text: "Analizamos operaciones, detectamos microprocesos automatizables y priorizamos por impacto y facilidad de implantación."
  },
  {
    n: "02",
    title: "Diseño",
    text: "Definimos arquitectura, herramientas, integraciones y métricas de éxito para cada caso."
  },
  {
    n: "03",
    title: "Implementación",
    text: "Construimos la solución, la conectamos con tus sistemas y validamos su funcionamiento con tu equipo."
  },
  {
    n: "04",
    title: "Escalado",
    text: "Una vez probado el valor, ampliamos automatizaciones a otras áreas del negocio."
  }
];

const faqs = [
  {
    q: "¿Qué tipo de empresas pueden trabajar con LaAgencIA?",
    a: "Principalmente pymes y empresas de servicios, operaciones, administración o ventas que tengan tareas repetitivas y procesos internos susceptibles de automatización."
  },
  {
    q: "¿Hace falta tener una gran infraestructura tecnológica?",
    a: "No. Muchas automatizaciones se pueden implantar sobre herramientas que la empresa ya utiliza, como email, CRM, ERP, hojas de cálculo o gestores documentales."
  },
  {
    q: "¿Cómo priorizáis qué automatizar primero?",
    a: "Priorizamos por impacto económico, frecuencia del proceso, tiempo consumido por el equipo, riesgo de error y facilidad de implementación."
  }
];

const testimonials = [
  {
    quote: "Identificaron procesos que no veíamos y redujimos horas administrativas desde el primer mes.",
    author: "CEO · Empresa de servicios"
  },
  {
    quote: "Pasamos de tareas manuales dispersas a un flujo operativo mucho más limpio y escalable.",
    author: "Operations Manager · Pyme B2B"
  },
  {
    quote: "La diferencia fue que no nos vendieron IA genérica, sino soluciones conectadas a nuestra operativa real.",
    author: "Director Comercial · Consultora"
  }
];

const initialFormData = {
  nombre: "",
  empresa: "",
  email: "",
  mensaje: ""
};

export function validateLeadForm(formData) {
  const trimmed = {
    nombre: formData.nombre.trim(),
    empresa: formData.empresa.trim(),
    email: formData.email.trim(),
    mensaje: formData.mensaje.trim()
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

export const formValidationExamples = [
  {
    name: "rechaza formulario vacío",
    input: { nombre: "", empresa: "", email: "", mensaje: "" },
    expected: "Completa todos los campos antes de enviar la solicitud."
  },
  {
    name: "rechaza email inválido",
    input: { nombre: "Ana", empresa: "Acme", email: "ana", mensaje: "Necesito automatizar reporting" },
    expected: "Introduce un email profesional válido."
  },
  {
    name: "acepta formulario válido",
    input: { nombre: "Ana", empresa: "Acme", email: "ana@acme.com", mensaje: "Necesito automatizar reporting" },
    expected: ""
  }
];

function SectionTitle({ eyebrow, title, description }) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-lg text-slate-600">{description}</p> : null}
    </div>
  );
}

export default function LandingPage() {
  const [formData, setFormData] = useState(initialFormData);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const validationError = useMemo(() => validateLeadForm(formData), [formData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (status !== "idle") {
      setStatus("idle");
      setErrorMessage("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validationError) {
      setStatus("error");
      setErrorMessage(validationError);
      return;
    }

    setStatus("success");
    setErrorMessage("");
    setFormData(initialFormData);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="text-xl font-semibold tracking-tight">
            LaAgenc<span className="text-slate-500">IA</span>
          </div>
          <nav className="hidden gap-6 text-sm text-slate-600 md:flex">
            <a href="#servicios" className="hover:text-slate-900">Servicios</a>
            <a href="#metodo" className="hover:text-slate-900">Método</a>
            <a href="#faq" className="hover:text-slate-900">FAQ</a>
            <a href="#contacto" className="hover:text-slate-900">Contacto</a>
          </nav>
          <a href="#contacto" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">
            Hablar ahora
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm">
              LaAgencIA · Automatización inteligente para empresas
            </div>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              LaAgencIA convierte tareas repetitivas en sistemas automáticos que hacen crecer tu empresa.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Ayudamos a empresas a encontrar tareas repetitivas de alto coste operativo, diseñar soluciones a medida e implementarlas para ahorrar tiempo, reducir errores y escalar operaciones.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
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
            </div>
            <div className="mt-10 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-2xl font-semibold">-40%</p>
                <p className="mt-1 text-sm text-slate-600">Tiempo operativo en tareas repetitivas</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-2xl font-semibold">24/7</p>
                <p className="mt-1 text-sm text-slate-600">Automatizaciones activas y monitorizadas</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-2xl font-semibold">ROI</p>
                <p className="mt-1 text-sm text-slate-600">Priorización por impacto y viabilidad</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="servicios" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <SectionTitle
          eyebrow="Servicios"
          title="De la detección de oportunidades a la implementación real"
          description="No vendemos humo ni demos bonitas. Construimos automatizaciones que encajan en el flujo real de la empresa."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <div key={service.title} className="rounded-3xl border border-slate-200 p-8 shadow-sm">
              <h3 className="text-xl font-semibold">{service.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{service.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Casos de uso</p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Áreas donde la automatización con IA genera valor rápido</h2>
              <p className="mt-4 max-w-xl leading-7 text-slate-300">
                Empezamos por microprocesos concretos: tareas pequeñas, repetitivas y frecuentes donde la mejora se nota desde las primeras semanas.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {useCases.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm md:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item.author} className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-base leading-7 text-slate-700">“{item.quote}”</p>
              <p className="mt-4 text-sm font-medium text-slate-500">{item.author}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="metodo" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <SectionTitle
          eyebrow="Método"
          title="Un proceso claro para implantar IA sin fricción"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step) => (
            <div key={step.n} className="rounded-3xl border border-slate-200 p-8 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">{step.n}</p>
              <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm lg:p-12">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Propuesta de valor</p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Convertimos procesos invisibles en eficiencia medible</h2>
              <p className="mt-4 leading-7 text-slate-600">
                Muchas empresas no necesitan una gran transformación para empezar con IA. Necesitan detectar qué tareas exactas automatizar primero, con qué sistema y con qué retorno.
              </p>
            </div>
            <div className="grid gap-4">
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="font-semibold">Menos carga manual</p>
                <p className="mt-2 text-sm text-slate-600">Reducimos trabajo repetitivo para liberar tiempo del equipo.</p>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="font-semibold">Menos errores</p>
                <p className="mt-2 text-sm text-slate-600">Estandarizamos tareas y mejoramos la consistencia operativa.</p>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="font-semibold">Más escalabilidad</p>
                <p className="mt-2 text-sm text-slate-600">Preparamos el negocio para crecer sin ampliar estructura al mismo ritmo.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-7xl border-t border-slate-200 px-6 py-20 lg:px-8">
        <SectionTitle
          eyebrow="FAQ"
          title="Preguntas frecuentes"
        />
        <div className="mt-10 grid gap-4">
          {faqs.map((item) => (
            <div key={item.q} className="rounded-3xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold">{item.q}</h3>
              <p className="mt-3 leading-7 text-slate-600">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contacto" className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Contacto</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Solicita un diagnóstico inicial</h2>
            <p className="mt-4 text-lg text-slate-600">
              Revisamos tus procesos, detectamos oportunidades de automatización y te proponemos un plan de implementación claro.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 grid gap-6 md:grid-cols-2" noValidate>
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
                className="w-fit rounded-2xl bg-slate-900 px-6 py-3 text-sm font-medium text-white shadow-lg transition hover:-translate-y-px"
              >
                Enviar solicitud
              </button>
              {status === "error" ? (
                <p className="text-sm text-red-600">{errorMessage}</p>
              ) : null}
              {status === "success" ? (
                <p className="text-sm text-emerald-600">
                  Solicitud enviada. El siguiente paso sería conectar este formulario con email, CRM o base de datos.
                </p>
              ) : null}
            </div>
          </form>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-600 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="font-semibold text-slate-900">LaAgencIA</p>
            <p>Automatización inteligente para empresas.</p>
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
