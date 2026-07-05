"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import MaintenanceBanner from "./animations/MaintenanceBanner";

export default function MaintenanceWrapper({ children }) {
  const [maintenanceData, setMaintenanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchStatus() {
      const { data } = await supabase
        .from("pengaturan_sistem")
        .select("*")
        .eq("id", 1)
        .single();
      if (data) setMaintenanceData(data);
    }

    async function checkMaintenance() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      // Check initially
      await fetchStatus();
      setLoading(false);

      // Subscribe to real-time changes
      const channel = supabase
        .channel('system_settings_changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'pengaturan_sistem',
            filter: 'id=eq.1'
          },
          (payload) => {
            setMaintenanceData(payload.new);
          }
        )
        .subscribe();

      // Fallback Polling every 3 seconds just in case Realtime isn't enabled in DB
      const interval = setInterval(fetchStatus, 3000);

      return () => {
        supabase.removeChannel(channel);
        clearInterval(interval);
      };
    }

    checkMaintenance();
  }, []);



  // Show a blank dark screen while checking (prevents flashing content)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060A11]">
        <div className="w-8 h-8 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
      </div>
    );
  }

  const isTargetingAdmin = pathname.startsWith("/ad22ae3762ff4bd9af5fad5ab1709e83d457f75f224b1a509afd0440c52da0a6e7f90d4091ff575184ed1919864024dc4eb9965088d8e1bf728aec0584b84ba6") || pathname.startsWith("/login");
  const isTargetingPublic = 
    pathname === "/" || 
    pathname.startsWith("/berita") || 
    pathname.startsWith("/galeri") || 
    pathname.startsWith("/kontak") || 
    pathname.startsWith("/layanan");

  if (isTargetingAdmin && maintenanceData?.is_maintenance_admin) {
    return <MaintenanceBanner data={maintenanceData} target="admin" />;
  }

  if (isTargetingPublic && maintenanceData?.is_maintenance_public) {
    return <MaintenanceBanner data={maintenanceData} target="public" />;
  }

  return <>{children}</>;
}
