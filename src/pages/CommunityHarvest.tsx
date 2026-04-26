import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Sprout, Search, Filter } from "lucide-react";

interface HarvestEntry {
  id: string;
  county: string;
  coffee_variety: string;
  quantity_kg: number;
  price_per_kg: number;
  total_revenue: number;
  harvest_month: number;
  harvest_year: number;
  quality_grade: string;
  farmer_name: string;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function CommunityHarvest() {
  const [harvests, setHarvests] = useState<HarvestEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterMonth, setFilterMonth] = useState<number | "">("");
  const [filterYear, setFilterYear] = useState<number | "">("");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      let query = supabase
        .from("harvests")
        .select("id, county, coffee_variety, quantity_kg, price_per_kg, total_revenue, harvest_month, harvest_year, quality_grade, user_id")
        .order("harvest_year", { ascending: false })
        .order("harvest_month", { ascending: false });

      if (filterMonth !== "") query = query.eq("harvest_month", filterMonth);
      if (filterYear) query = query.eq("harvest_year", filterYear);

      const { data } = await query;
      if (!data) { setHarvests([]); setLoading(false); return; }

      // Fetch farmer names
      const userIds = [...new Set(data.map(h => h.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", userIds);

      const nameMap = new Map(profiles?.map(p => [p.user_id, p.full_name]) ?? []);

      setHarvests(data.map(h => ({
        id: h.id,
        county: h.county,
        coffee_variety: h.coffee_variety,
        quantity_kg: h.quantity_kg,
        price_per_kg: h.price_per_kg,
        total_revenue: h.total_revenue ?? 0,
        harvest_month: h.harvest_month,
        harvest_year: h.harvest_year,
        quality_grade: h.quality_grade ?? "",
        farmer_name: nameMap.get(h.user_id) || "Unknown Farmer",
      })));
      setLoading(false);
    };
    fetch();
  }, [filterMonth, filterYear]);

  const filtered = harvests.filter(h =>
    !search || h.county.toLowerCase().includes(search.toLowerCase()) ||
    h.coffee_variety.toLowerCase().includes(search.toLowerCase()) ||
    h.farmer_name.toLowerCase().includes(search.toLowerCase())
  );

  const totalKg = filtered.reduce((s, h) => s + Number(h.quantity_kg), 0);
  const totalRevenue = filtered.reduce((s, h) => s + Number(h.total_revenue), 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Community Harvest</h1>
          <p className="text-sm text-muted-foreground">View harvest records submitted by all farmers</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by county, variety, or farmer..."
              className="w-full rounded-lg border border-input bg-secondary/50 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filterMonth}
              onChange={e => setFilterMonth(e.target.value === "" ? "" : parseInt(e.target.value))}
              className="rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              <option value="">All months</option>
              {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
            <input
              type="number"
              min="2000"
              max="2100"
              placeholder="All years"
              value={filterYear}
              onChange={e => setFilterYear(e.target.value === "" ? "" : parseInt(e.target.value))}
              className="w-28 rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="glass-card flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary/10 p-2.5"><Sprout className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Total Records</p>
              <p className="text-lg font-bold text-foreground">{filtered.length}</p>
            </div>
          </div>
          <div className="glass-card flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary/10 p-2.5"><Sprout className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Total Production</p>
              <p className="text-lg font-bold text-foreground">{totalKg.toLocaleString()} kg</p>
            </div>
          </div>
          <div className="glass-card flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary/10 p-2.5"><Sprout className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Total Revenue</p>
              <p className="text-lg font-bold text-foreground">KES {totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 text-left text-xs text-muted-foreground">
                <th className="p-3">Farmer</th>
                <th className="p-3">Period</th>
                <th className="p-3">County</th>
                <th className="p-3">Variety</th>
                <th className="p-3">Qty (kg)</th>
                <th className="p-3">Price/kg</th>
                <th className="p-3">Revenue</th>
                <th className="p-3">Grade</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">No harvest records found for the selected period.</td></tr>
              ) : (
                filtered.map(h => (
                  <tr key={h.id} className="border-b border-border/30 hover:bg-secondary/30">
                    <td className="p-3 font-medium text-foreground">{h.farmer_name}</td>
                    <td className="p-3 text-foreground">{MONTHS[h.harvest_month - 1]} {h.harvest_year}</td>
                    <td className="p-3 text-foreground">{h.county}</td>
                    <td className="p-3 text-foreground">{h.coffee_variety}</td>
                    <td className="p-3 text-foreground">{Number(h.quantity_kg).toLocaleString()}</td>
                    <td className="p-3 text-foreground">KES {Number(h.price_per_kg).toLocaleString()}</td>
                    <td className="p-3 font-medium text-primary">KES {Number(h.total_revenue).toLocaleString()}</td>
                    <td className="p-3"><span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{h.quality_grade}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
