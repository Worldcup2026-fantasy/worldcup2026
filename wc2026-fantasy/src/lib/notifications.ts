/**
 * Notification helpers — called from Supabase Edge Functions, not client code.
 * Resend is used for transactional email. Add RESEND_API_KEY to your
 * Supabase project secrets: supabase secrets set RESEND_API_KEY=re_xxx
 */

export interface DeadlineEmailPayload {
  to: string;
  teamName: string;
  gameweekLabel: string;
  deadline: string;        // ISO string
  minutesUntil: number;
}

export async function sendDeadlineReminder(payload: DeadlineEmailPayload) {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) throw new Error("RESEND_API_KEY not set");

  const deadlineLocal = new Date(payload.deadline).toLocaleString("en-GB", {
    weekday: "short", day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit", timeZoneName: "short",
  });

  const html = `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;">
      <h2 style="color:#185FA5;margin-bottom:8px;">⏰ Deadline reminder</h2>
      <p style="color:#444;font-size:15px;">
        Hi <strong>${payload.teamName}</strong> — your squad for
        <strong>${payload.gameweekLabel}</strong> locks in
        <strong>${payload.minutesUntil < 60
          ? `${payload.minutesUntil} minutes`
          : `${Math.round(payload.minutesUntil / 60)} hours`
        }</strong>.
      </p>
      <p style="color:#888;font-size:13px;">Deadline: ${deadlineLocal}</p>
      <a href="${Deno.env.get("NEXT_PUBLIC_APP_URL") ?? "https://wc2026.fantasy"}/squad"
         style="display:inline-block;background:#185FA5;color:white;padding:10px 20px;
                border-radius:8px;text-decoration:none;font-weight:500;margin-top:16px;">
        Make your changes →
      </a>
      <p style="color:#bbb;font-size:11px;margin-top:24px;">
        WC2026 Fantasy · You're receiving this because you have an account.
      </p>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from:    "WC2026 Fantasy <noreply@wc2026.fantasy>",
      to:      [payload.to],
      subject: `⏰ Squad locks in ${payload.minutesUntil < 60 ? `${payload.minutesUntil}m` : `${Math.round(payload.minutesUntil / 60)}h`} — ${payload.gameweekLabel}`,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend error: ${err}`);
  }
}
