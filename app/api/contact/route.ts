import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";
import { Resend } from "resend";

// ── Env check (runs at module load time in Node.js) ──────────────────────────
const REQUIRED_ENV = ["NOTION_API_KEY", "NOTION_DATABASE_ID", "RESEND_API_KEY"] as const;
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

// ── Rate limiting (in-memory, per-process) ───────────────────────────────────
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

interface RateLimitEntry {
  count: number;
  firstRequest: number;
}

const ipMap = new Map<string, RateLimitEntry>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipMap.get(ip);

  if (!entry || now - entry.firstRequest > RATE_LIMIT_WINDOW_MS) {
    ipMap.set(ip, { count: 1, firstRequest: now });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count += 1;
  return true;
}

// ── Input sanitization ───────────────────────────────────────────────────────
function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, "").replace(/&[a-z]+;/gi, " ");
}

function sanitize(value: string, maxLength: number): string {
  return stripHtml(value).trim().slice(0, maxLength);
}

// ── Email regex ──────────────────────────────────────────────────────────────
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── Handler ──────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  // Method is already POST — extra safety: reject non-POST via the route convention
  // Content-Type check
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      { error: "Content-Type debe ser application/json" },
      { status: 415 }
    );
  }

  // IP rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes, inténtalo más tarde" },
      { status: 429 }
    );
  }

  // Parse body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de la solicitud inválido" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Cuerpo de la solicitud inválido" }, { status: 400 });
  }

  const raw = body as Record<string, unknown>;

  // Sanitize inputs
  const nombre = sanitize(String(raw.nombre ?? ""), 100);
  const empresa = sanitize(String(raw.empresa ?? ""), 100);
  const email = sanitize(String(raw.email ?? ""), 200);
  const mensaje = sanitize(String(raw.mensaje ?? ""), 2000);

  // Server-side validation
  if (!nombre || !empresa || !email || !mensaje) {
    return NextResponse.json(
      { error: "Completa todos los campos antes de enviar la solicitud." },
      { status: 400 }
    );
  }

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { error: "Introduce un email profesional válido." },
      { status: 400 }
    );
  }

  try {
    // ── Save to Notion ────────────────────────────────────────────────────────
    const notion = new Client({ auth: process.env.NOTION_API_KEY });

    await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_ID! },
      properties: {
        ID: {
          title: [{ text: { content: `LEAD-${Date.now()}` } }],
        },
        Nombre: {
          rich_text: [{ text: { content: nombre } }],
        },
        Empresa: {
          rich_text: [{ text: { content: empresa } }],
        },
        Email: {
          email: email,
        },
        Mensaje: {
          rich_text: [{ text: { content: mensaje } }],
        },
        Fecha: {
          date: { start: new Date().toISOString() },
        },
      },
    });

    // ── Send email via Resend ─────────────────────────────────────────────────
    const resend = new Resend(process.env.RESEND_API_KEY);

    console.log("[contact/route] Enviando email a gonzalo.benito@me.com...");
    const emailResult = await resend.emails.send({
      from: "AgencIA <onboarding@resend.dev>",
      to: "srtkt4rkn4@privaterelay.appleid.com",
      subject: `Nuevo lead: ${nombre} de ${empresa}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
          <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 24px;">Nuevo lead recibido</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600; width: 120px;">Nombre</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">${nombre}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600;">Empresa</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">${empresa}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                <a href="mailto:${email}" style="color: #0f172a;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; font-weight: 600; vertical-align: top;">Mensaje</td>
              <td style="padding: 12px 0; white-space: pre-wrap;">${mensaje}</td>
            </tr>
          </table>
          <p style="margin-top: 32px; font-size: 12px; color: #94a3b8;">
            Recibido el ${new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid" })}
          </p>
        </div>
      `,
    });
    console.log("[contact/route] Email enviado. Resend response:", emailResult);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    // Log only on server, never expose to client
    console.error("[contact/route] Error procesando lead:", err);
    return NextResponse.json(
      { error: "Error interno del servidor. Inténtalo de nuevo." },
      { status: 500 }
    );
  }
}

// Reject any method other than POST
export async function GET() {
  return NextResponse.json({ error: "Método no permitido" }, { status: 405 });
}
export async function PUT() {
  return NextResponse.json({ error: "Método no permitido" }, { status: 405 });
}
export async function DELETE() {
  return NextResponse.json({ error: "Método no permitido" }, { status: 405 });
}
export async function PATCH() {
  return NextResponse.json({ error: "Método no permitido" }, { status: 405 });
}
