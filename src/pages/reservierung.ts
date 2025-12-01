import type { APIRoute } from "astro";

export const prerender = false; // để POST hoạt động, không bị build static

export const POST: APIRoute = async ({ request }) => {
  try {
    const raw = await request.text();
    console.log("RAW BODY /reservierung:", raw);

    let body: any = {};
    try {
      body = raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.error("Reservierung: kein gültiges JSON:", raw);
      return new Response(
        JSON.stringify({ ok: false, message: "Ungültiger Request-Body." }),
        { status: 400 }
      );
    }

    const { name, email, phone, date, time, persons, notes } = body as {
      name?: string;
      email?: string;
      phone?: string;
      date?: string;
      time?: string;
      persons?: number;
      notes?: string;
    };

    if (!name || !phone || !date || !time) {
      return new Response(
        JSON.stringify({
          ok: false,
          message: "Name, Telefon, Datum oder Uhrzeit fehlt.",
        }),
        { status: 400 }
      );
    }

    const text = `
📅 *Neue Tischreservierung*

👤 *Name:* ${name}
📞 *Telefon:* ${phone}
📧 *E-Mail:* ${email || "-"}

📆 *Datum:* ${date}
⏰ *Uhrzeit:* ${time}
👥 *Personen:* ${persons || "-"}

📝 *Hinweise:*
${notes || "-"}

⏰ ${new Date().toLocaleString("de-DE")}
    `.trim();

    // dùng lại bot đặt món
    const TOKEN = "8035183296:AAHV8js4i7AH1EH3xpcTzgNyLtt4x9lcEbk";
    const CHAT_ID = "1903052624";

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text,
          parse_mode: "Markdown",
        }),
      }
    );

    if (!telegramRes.ok) {
      const errText = await telegramRes.text();
      console.error(
        "Telegram-Fehler (Reservierung):",
        telegramRes.status,
        telegramRes.statusText,
        errText
      );

      return new Response(
        JSON.stringify({
          ok: false,
          message: "Fehler bei Telegram.",
        }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("Fehler im /reservierung-Handler:", err);
    return new Response(
      JSON.stringify({ ok: false, message: "Serverfehler." }),
      { status: 500 }
    );
  }
};
