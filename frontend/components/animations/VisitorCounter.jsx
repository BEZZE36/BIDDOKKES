// VisitorCounter — Real-time website visit counter backed by Supabase
// On mount: increments the visit count via atomic RPC, then displays
// the total using the ReactBits-style rolling Counter animation.
// Uses Supabase Realtime + polling fallback for cross-device live updates.
"use client";
import { useEffect, useRef, useState } from "react";
import Counter from "./Counter";
import { supabase } from "../../lib/supabaseClient";

const POLL_INTERVAL_MS = 15_000; // fallback poll every 15s

async function fetchCount() {
  const { data } = await supabase
    .from("site_stats")
    .select("total_visits")
    .eq("id", "global")
    .single();
  // BIGINT dari Postgres bisa datang sebagai string — selalu konversi
  return data?.total_visits != null ? Number(data.total_visits) : null;
}

export default function VisitorCounter({ className = "", style = {} }) {
  const [count, setCount] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const incremented = useRef(false); // prevent double-count in StrictMode

  useEffect(() => {
    if (!supabase) return;

    // ── Increment + initial load ─────────────────────────────────────
    if (!incremented.current) {
      incremented.current = true;

      (async () => {
        try {
          // Atomic increment via RPC — returns new total
          const { data, error } = await supabase.rpc("increment_visit_count");
          if (!error && data != null) {
            setCount(Number(data)); // BIGINT → Number
            setLoaded(true);
            return;
          }
        } catch (_) { /* fall through */ }

        // Fallback: read without incrementing
        const n = await fetchCount();
        if (n !== null) {
          setCount(n);
          setLoaded(true);
        }
      })();
    }

    // ── Supabase Realtime subscription ──────────────────────────────
    // Listens for UPDATE on site_stats 'global' row.
    // NOTE: Supabase sends BIGINT columns as strings — always use Number()
    const channel = supabase
      .channel("visitor_count_live")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "site_stats",
        },
        (payload) => {
          const raw = payload.new?.total_visits;
          if (raw != null) {
            const n = Number(raw); // fix: BIGINT comes as string from wire
            if (!isNaN(n)) {
              setCount(n);
              setLoaded(true);
            }
          }
        }
      )
      .subscribe();

    // ── Polling fallback ─────────────────────────────────────────────
    // Catches cases where Realtime ws is blocked (firewall, free-plan limits)
    const poll = setInterval(async () => {
      const n = await fetchCount();
      if (n !== null) {
        setCount(n);
        setLoaded(true);
      }
    }, POLL_INTERVAL_MS);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(poll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!loaded) return null;

  return (
    <div className={className} style={style}>
      <Counter
        value={count}
        fontSize={36}
        textColor="#D9A441"
        fontWeight="800"
        gap={2}
        horizontalPadding={0}
        counterStyle={{ fontFamily: "var(--font-mono)" }}
      />
    </div>
  );
}
