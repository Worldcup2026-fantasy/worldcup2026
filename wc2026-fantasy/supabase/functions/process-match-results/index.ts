// supabase/functions/process-match-results/index.ts
// Deploy: supabase functions deploy process-match-results
// Trigger: HTTP POST from API-Football webhook or a cron calling the API
//
// Required secrets (supabase secrets set KEY=value):
//   API_FOOTBALL_KEY   — your api-football.com v3 key
//   SUPABASE_URL       — auto-injected
//   SUPABASE_SERVICE_ROLE_KEY — auto-injected

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 1. Find the active gameweek
    const { data: gw } = await supabase
      .from("gameweeks")
      .select("id, number")
      .eq("is_active", true)
      .single();

    if (!gw) return new Response(JSON.stringify({ error: "No active gameweek" }), { status: 400 });

    // 2. Fetch match stats from API-Football
    //    World Cup 2026 league id = 1 (update when confirmed by API-Football)
    const apiKey = Deno.env.get("API_FOOTBALL_KEY")!;
    const fixturesRes = await fetch(
      `https://v3.football.api-sports.io/fixtures?league=1&season=2026&round=Group+Stage+-+${gw.number}`,
      { headers: { "x-apisports-key": apiKey } }
    );
    const fixturesJson = await fixturesRes.json();
    const fixtures = fixturesJson.response ?? [];

    // 3. For each finished fixture, upsert player stats into points_log
    const upserts: any[] = [];

    for (const fixture of fixtures) {
      if (fixture.fixture.status.short !== "FT") continue; // skip non-finished

      const fixtureId = fixture.fixture.id;
      const statsRes = await fetch(
        `https://v3.football.api-sports.io/fixtures/players?fixture=${fixtureId}`,
        { headers: { "x-apisports-key": apiKey } }
      );
      const statsJson = await statsRes.json();

      for (const team of statsJson.response ?? []) {
        const isCleanSheet =
          (team.team.id === fixture.teams.home.id && fixture.goals.away === 0) ||
          (team.team.id === fixture.teams.away.id && fixture.goals.home === 0);

        for (const { player, statistics } of team.players) {
          const s = statistics[0];
          const min = s?.games?.minutes ?? 0;
          if (min === 0) continue;

          const goals   = s?.goals?.total ?? 0;
          const assists = s?.goals?.assists ?? 0;
          const yellow  = (s?.cards?.yellow ?? 0) > 0;
          const red     = (s?.cards?.red ?? 0) > 0;

          // Compute points (mirror scoring.ts logic)
          let pts = min >= 60 ? 2 : 1;
          // Goals — position from our DB
          const { data: dbPlayer } = await supabase
            .from("players")
            .select("pos")
            .eq("id", player.id)   // API player id must match our player id
            .maybeSingle();

          if (dbPlayer) {
            const gPts = { GK: 10, DEF: 8, MID: 6, FWD: 5 }[dbPlayer.pos as string] ?? 5;
            pts += goals * gPts + assists * 4;
            if (isCleanSheet && min >= 60) {
              pts += { GK: 6, DEF: 4, MID: 1, FWD: 0 }[dbPlayer.pos as string] ?? 0;
            }
          }
          if (yellow) pts -= 1;
          if (red)    pts -= 3;

          upserts.push({
            player_id:   player.id,
            gameweek_id: gw.id,
            goals,
            assists,
            clean_sheet: isCleanSheet && min >= 60,
            yellow_card: yellow,
            red_card:    red,
            points:      pts,
          });
        }
      }
    }

    if (upserts.length > 0) {
      await supabase
        .from("points_log")
        .upsert(upserts, { onConflict: "player_id,gameweek_id" });
    }

    // 4. Update total_points on players table
    await supabase.rpc("refresh_player_total_points");

    return new Response(
      JSON.stringify({ processed: upserts.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
