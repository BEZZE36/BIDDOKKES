// VisitorCounter — Real-time website visit counter backed by Supabase
// On mount: increments the visit count via atomic RPC, then displays
// the total using the ReactBits-style rolling Counter animation.
// Uses Supabase Realtime to update count live across all connected devices.
"use client";
import { useEffect, useRef, useState } from "react";
import Counter from "./Counter";
import { supabase } from "../../lib/supabaseClient";

export default function VisitorCounter({ className = "", style = {} }) {
  const [count, setCount] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const incremented = useRef(false); // prevent double-count in StrictMode

  useEffect(() => {
    if (!supabase || incremented.current) return;
    incremented.current = true;

    async function track() {
      try {
        // Atomic increment via RPC — returns new total
        const { data, error } = await supabase.rpc("increment_visit_count");
        if (!error && typeof data === "number") {
          setCount(data);
          setLoaded(true);
          return;
        }
      } catch (_) {/* fall through to read-only fallback */}

      // Fallback: just read current count without incrementing
      try {
        const { data } = await supabase
          .from("site_stats")
          .select("total_visits")
          .eq("id", "global")
          .single();
        if (data?.total_visits) {
          setCount(Number(data.total_visits));
          setLoaded(true);
        }
      } catch (_) {}
    }

    track();

    // ── Supabase Realtime subscription ─────────────────────────────────
    // Listen for any UPDATE on site_stats row 'global' — this fires
    // whenever any other visitor increments the counter so all connected
    // devices see the new value without refreshing the page.
    const channel = supabase
      .channel("visitor_count_live")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "site_stats",
          filter: "id=eq.global",
        },
        (payload) => {
          const newCount = payload.new?.total_visits;
          if (typeof newCount === "number") {
            setCount(newCount);
            if (!loaded) setLoaded(true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
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
