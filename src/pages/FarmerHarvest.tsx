import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Edit2, Sprout, TrendingUp, DollarSign, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Harvest {
  id: string;
  county: string;
  coffee_variety: string;
  quantity_kg: number;
  price_per_kg: number;
  total_revenue: number;
  harvest_month: number;
  harvest_year: number;
  quality_grade: string;
  notes: string;
  created_at: string;
}

const COUNTIES = [
  "Nyeri", "Kirinyaga", "Murang'a", "Kiambu", "Meru", "Embu",
  "Machakos", "Nakuru", "Kericho", "Nandi", "Bungoma", "Kisii",
];
const VARIETIES = ["Arabica", "Robusta", "SL28", "SL34", "Ruiru 11", "Batian", "K7"];
const GRADES = ["AA", "AB", "A", "B", "C", "PB", "TT", "T"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function FarmerHarvest() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    county: "Nyeri",
    coffee_variety: "Arabica",
    quantity_kg: "",
    price_per_kg: "",
    harvest_month: new Date().getMonth() + 1,
    harvest_year: new Date().getFullYear(),
    quality_grade: "AA",
    notes: "",
  });

  const fetchHarvests = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("harvests")
      .select("*")
      .eq("user_id", user.id)
      .order("harvest_year", { ascending: false })
      .order("harvest_month", { ascending: false });
    if (!error && data) setHarvests(data as Harvest[]);
    setLoading(false);
  };

  useEffect(() => { fetchHarvests(); }, [user]);

  const resetForm = () => {
    setForm({ county: "Nyeri", coffee_variety: "Arabica", quantity_kg: "", price_per_kg: "", harvest_month: new Date().getMonth() + 1, harvest_year: new Date().getFullYear(), quality_grade: "AA", notes: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const payload = {
      user_id: user.id,
      county: form.county,
      coffee_variety: form.coffee_variety,
      quantity_kg: parseFloat(form.quantity_kg) || 0,
      price_per_kg: parseFloat(form.price_per_kg) || 0,
      harvest_month: form.harvest_month,
      harvest_year: form.harvest_year,
      quality_grade: form.quality_grade,
      notes: form.notes,
    };

    if (editingId) {
      const { error } = await supabase.from("harvests").update(payload).eq("id", editingId);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Updated", description: "Harvest record updated successfully" });
    } else {
      const { error } = await supabase.from("harvests").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Added", description: "Harvest record added successfully" });
    }
    resetForm();
    fetchHarvests();
  };

  const handleEdit = (h: Harvest) => {
    setForm({
      county: h.county,
      coffee_variety: h.coffee_variety,
      quantity_kg: String(h.quantity_kg),
      price_per_kg: String(h.price_per_kg),
      harvest_month: h.harvest_month,
      harvest_year: h.harvest_year,
      quality_grade: h.quality_grade,
      notes: h.notes || "",
    });
    setEditingId(h.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("harvests").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Deleted", description: "Harvest record removed" });
    fetchHarvests();
  };

  const totalKg = harvests.reduce((s, h) => s + Number(h.quantity_kg), 0);
  const totalRevenue = harvests.reduce((s, h) => s + Number(h.total_revenue), 0);
  const avgPrice = harvests.length > 0 ? totalRevenue / totalKg : 0;

  if (profile?.role !== "farmer") {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <Sprout className="h-12 w-12 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Farmer Access Only</h2>
          <p className="text-sm text-muted-foreground">This page is available to farmer accounts. Please sign up as a farmer to record harvests.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Farmer's Harvest</h1>
            <p className="text-sm text-muted-foreground">Record and track your coffee production</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(!showForm); }}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-all"
          >
            <Plus className="h-4 w-4" />
            Add Harvest
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="glass-card flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary/10 p-2.5"><Package className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Total Production</p>
              <p className="text-lg font-bold text-foreground">{totalKg.toLocaleString()} kg</p>
              <p className="text-xs text-muted-foreground">{(totalKg / 1000).toFixed(2)} tonnes</p>
            </div>
          </div>
          <div className="glass-card flex items-center gap-4 p-4">
            <div className="rounded-lg bg-accent/20 p-2.5"><DollarSign className="h-5 w-5 text-accent-foreground" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Total Revenue</p>
              <p className="text-lg font-bold text-foreground">KES {totalRevenue.toLocaleString()}</p>
            </div>
          </div>
          <div className="glass-card flex items-center gap-4 p-4">
            <div className="rounded-lg bg-secondary p-2.5"><TrendingUp className="h-5 w-5 text-foreground" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Avg Price/kg</p>
              <p className="text-lg font-bold text-foreground">KES {avgPrice.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="glass-card p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">{editingId ? "Edit" : "New"} Harvest Record</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">County</label>
                <select value={form.county} onChange={e => setForm(f => ({ ...f, county: e.target.value }))} className="w-full rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none">
                  {COUNTIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Coffee Variety</label>
                <select value={form.coffee_variety} onChange={e => setForm(f => ({ ...f, coffee_variety: e.target.value }))} className="w-full rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none">
                  {VARIETIES.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Quantity (kg)</label>
                <input type="number" step="0.01" min="0" required value={form.quantity_kg} onChange={e => setForm(f => ({ ...f, quantity_kg: e.target.value }))} placeholder="e.g. 500" className="w-full rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Price per kg (KES)</label>
                <input type="number" step="0.01" min="0" required value={form.price_per_kg} onChange={e => setForm(f => ({ ...f, price_per_kg: e.target.value }))} placeholder="e.g. 120" className="w-full rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Month</label>
                <select value={form.harvest_month} onChange={e => setForm(f => ({ ...f, harvest_month: parseInt(e.target.value) }))} className="w-full rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none">
                  {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Year</label>
                <input type="number" min="2000" max="2100" required value={form.harvest_year} onChange={e => setForm(f => ({ ...f, harvest_year: parseInt(e.target.value) }))} className="w-full rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Quality Grade</label>
                <select value={form.quality_grade} onChange={e => setForm(f => ({ ...f, quality_grade: e.target.value }))} className="w-full rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none">
                  {GRADES.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Notes</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} placeholder="Any additional details..." className="w-full rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none" />
              </div>
              <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-3">
                <button type="submit" className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
                  {editingId ? "Update" : "Save"} Record
                </button>
                <button type="button" onClick={resetForm} className="rounded-lg border border-border px-6 py-2 text-sm text-muted-foreground hover:bg-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 text-left text-xs text-muted-foreground">
                <th className="p-3">Period</th>
                <th className="p-3">County</th>
                <th className="p-3">Variety</th>
                <th className="p-3">Qty (kg)</th>
                <th className="p-3">Price/kg</th>
                <th className="p-3">Revenue</th>
                <th className="p-3">Grade</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
              ) : harvests.length === 0 ? (
                <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">No harvest records yet. Click "Add Harvest" to get started.</td></tr>
              ) : (
                harvests.map(h => (
                  <tr key={h.id} className="border-b border-border/30 hover:bg-secondary/30">
                    <td className="p-3 font-medium text-foreground">{MONTHS[h.harvest_month - 1]} {h.harvest_year}</td>
                    <td className="p-3 text-foreground">{h.county}</td>
                    <td className="p-3 text-foreground">{h.coffee_variety}</td>
                    <td className="p-3 text-foreground">{Number(h.quantity_kg).toLocaleString()}</td>
                    <td className="p-3 text-foreground">KES {Number(h.price_per_kg).toLocaleString()}</td>
                    <td className="p-3 font-medium text-primary">KES {Number(h.total_revenue).toLocaleString()}</td>
                    <td className="p-3"><span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{h.quality_grade}</span></td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <button onClick={() => handleEdit(h)} className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"><Edit2 className="h-3.5 w-3.5" /></button>
                        <button onClick={() => handleDelete(h.id)} className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
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
