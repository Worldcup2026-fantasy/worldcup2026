// supabase/functions/send-deadline-reminders/index.ts
// Deploy:  supabase functions deploy send-deadline-reminders
// Schedule via Supabase cron (Dashboard → Database → pg_cron):
//   select cron.schedule('deadline-reminders', '0 * * * *',
//     $$select net.http_post('https://<ref>.functions.supabase.co/send-deadline-reminders',
//       '{}', 'application/json', ARRAY[('Authorization','Bearer <anon-key>')::http_header])$$);
//
// Required secrets:
//   RESEND_API_KEY, NEXT_PUBLIC_APP_URL

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sendDeadlineReminder } from "../../src/lib/notifications.ts";

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Find gameweeks whose deadline is 2 hours from now (±5 min window)
  const now    = new Date();
  const in2h   = new Date(now.getTime() + 2 * 3_600_000);
  const window = 5 * 60_000;

  const { data: gameweeks } = await supabase
    .from("gameweeks")
    .select("id, number, label, deadline")
    .gte("deadline", new Date(in2h.getTime() - window).toISOString())
    .lte("deadline", new Date(in2h.getTime() + window).toISOString());

  if (!gameweeks?.length) {
    return new Response(JSON.stringify({ sent: 0, reason: "no upcoming deadline" }));
  }

  let sent = 0;

  for (const gw of gameweeks) {
    // Get all users with a squad
    const { data: squads } = await supabase
      .from("squads")
      .select("user_id, team_name");

    for (const squad of squads ?? []) {
      // Get the user's email from auth.users (service role required)
      const { data: { user } } = await supabase.auth.admin.getUserById(squad.user_id);
      if (!user?.email) continue;

      const minutesUntil = Math.round(
        (new Date(gw.deadline).getTime() - Date.now()) / 60_000
      );

      try {
        await sendDeadlineReminder({
          to:             user.email,
          teamName:       squad.team_name ?? "Your team",
          gameweekLabel:  gw.label,
          deadline:       gw.deadline,
          minutesUntil,
        });
        sent++;
      } catch (e) {
        console.error(`Failed to email ${user.email}:`, e);
      }
    }
  }

  return new Response(JSON.stringify({ sent }));
});
