"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase";
import { PriceRange } from "@/types/filters";
import { Loader2, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminPriceRanges() {
  const [ranges, setRanges] = useState<PriceRange[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form state
  const [newLabel, setNewLabel] = useState("");
  const [newMin, setNewMin] = useState("");
  const [newMax, setNewMax] = useState("");
  const [adding, setAdding] = useState(false);

  const fetchRanges = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("price_ranges").select("*").order("min_price");

      if (error) throw error;
      setRanges(data || []);
    } catch (error) {
      console.error("Error fetching price ranges:", error);
      toast.error("Erro ao carregar faixas de preço");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanges();
  }, []);

  const toggleRange = async (range: PriceRange, checked: boolean) => {
    // Optimistic update
    setRanges((prev) => prev.map((r) => (r.id === range.id ? { ...r, active: checked } : r)));

    try {
      const { error } = await supabase
        .from("price_ranges")
        .upsert(
          {
            id: range.id,
            label: range.label,
            value: range.value,
            min_price: range.min_price,
            max_price: range.max_price,
            active: checked,
          },
          { onConflict: "id" }
        );

      if (error) throw error;
    } catch (error: any) {
      console.error("Error toggling range:", error);
      toast.error("Erro ao atualizar faixa de preço");
      // Revert
      setRanges((prev) => prev.map((r) => (r.id === range.id ? { ...r, active: !checked } : r)));
    }
  };

  const handleAddRange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    try {
      setAdding(true);
      const label = newLabel.trim();
      const min = newMin ? parseFloat(newMin) : null;
      const max = newMax ? parseFloat(newMax) : null;
      
      // Generate value/slug
      const value = `range-${Date.now()}`; // Use timestamp for uniqueness or generate from min/max

      const { data, error } = await supabase
        .from("price_ranges")
        .insert([{ label, value, min_price: min, max_price: max, active: true }])
        .select()
        .single();

      if (error) throw error;

      setRanges([...ranges, data].sort((a, b) => (a.min_price || 0) - (b.min_price || 0)));
      setNewLabel("");
      setNewMin("");
      setNewMax("");
      toast.success("Faixa de preço adicionada");
    } catch (error) {
      console.error("Error adding range:", error);
      toast.error("Erro ao adicionar faixa de preço");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteRange = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja remover esta faixa de preço?")) return;
    try {
      const { error } = await supabase.from("price_ranges").delete().eq("id", id);
      if (error) throw error;
      setRanges(ranges.filter((r) => r.id !== id));
      toast.success("Faixa removida");
    } catch (error) {
      console.error("Error deleting range", error);
      toast.error("Erro ao remover faixa");
    }
  };
  
  // Helper to format currency for display
  const formatCurrency = (val: number | null) => {
    if (val === null) return "∞";
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  }

  const filteredRanges = ranges.filter((range) => range.label.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerenciar Faixas de Preço</h1>
          <p className="text-gray-600">Configure as faixas de preço disponíveis no filtro</p>
        </div>
      </div>

      {/* Add Range Form */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Adicionar Nova Faixa</h3>
        <form onSubmit={handleAddRange} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Rótulo</label>
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Ex: Até R$ 500k"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mínimo (R$)</label>
            <input
              type="number"
              value={newMin}
              onChange={(e) => setNewMin(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Máximo (R$)</label>
            <input
              type="number"
              value={newMax}
              onChange={(e) => setNewMax(e.target.value)}
              placeholder="Vazio = Sem limite"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={adding || !newLabel.trim()}
            className="md:col-span-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
          >
            {adding ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
            Adicionar Faixa
          </button>
        </form>
      </div>

      {/* Ranges List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-4">
           {/* No bulk action for now for ranges as it is less common */}
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar faixa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none text-gray-700"
          />
        </div>

        {loading ? (
          <div className="p-8 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredRanges.map((range) => (
              <div key={range.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <Checkbox
                    id={`range-${range.id}`}
                    checked={!!range.active}
                    onCheckedChange={(checked) => toggleRange(range, checked as boolean)}
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 z-10"
                  />
                  <div className="flex flex-col">
                    <label htmlFor={`range-${range.id}`} className="font-medium text-gray-700 cursor-pointer select-none">
                        {range.label}
                    </label>
                    <span className="text-sm text-gray-500">
                        Min: {formatCurrency(range.min_price)} - Max: {formatCurrency(range.max_price)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteRange(range.id)}
                  className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                  title="Remover faixa"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}

            {filteredRanges.length === 0 && (
              <div className="p-8 text-center text-gray-500">Nenhuma faixa encontrada</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
