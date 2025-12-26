"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase";
import { PropertyType } from "@/types/filters";
import { Home, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminPropertyTypes() {
  const [types, setTypes] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newTypeLabel, setNewTypeLabel] = useState("");
  const [adding, setAdding] = useState(false);

  const fetchTypes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("property_types").select("*").order("label");

      if (error) throw error;
      setTypes(data || []);
    } catch (error) {
      console.error("Error fetching property types:", error);
      toast.error("Erro ao carregar tipos de imóveis");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const toggleType = async (type: PropertyType, checked: boolean) => {
    // Optimistic update
    setTypes((prev) => prev.map((t) => (t.id === type.id ? { ...t, active: checked } : t)));

    try {
      const { error } = await supabase
        .from("property_types")
        .upsert({ id: type.id, label: type.label, value: type.value, active: checked }, { onConflict: "id" });

      if (error) throw error;
    } catch (error: any) {
      console.error("Error toggling type:", error);
      toast.error("Erro ao atualizar tipo");
      // Revert optimistic update
      setTypes((prev) => prev.map((t) => (t.id === type.id ? { ...t, active: !checked } : t)));
    }
  };

  const handleAddType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeLabel.trim()) return;

    try {
      setAdding(true);
      const label = newTypeLabel.trim();
      // Simple slug generation: lowercase, remove accents, replace spaces with hyphens
      const value = label
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-");

      const { data, error } = await supabase
        .from("property_types")
        .insert([{ label, value, active: true }])
        .select()
        .single();

      if (error) throw error;

      setTypes([...types, data].sort((a, b) => a.label.localeCompare(b.label)));
      setNewTypeLabel("");
      toast.success("Tipo adicionado com sucesso");
    } catch (error) {
      console.error("Error adding type:", error);
      toast.error("Erro ao adicionar tipo. Verifique se já existe.");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteType = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja remover este tipo?")) return;
    try {
      const { error } = await supabase.from("property_types").delete().eq("id", id);
      if (error) throw error;
      setTypes(types.filter((t) => t.id !== id));
      toast.success("Tipo removido");
    } catch (error) {
      console.error("Error deleting type", error);
      toast.error("Erro ao remover tipo");
    }
  };

  const toggleAllTypes = async (checked: boolean) => {
     // Optimistic update
     setTypes(types.map((t) => ({ ...t, active: checked })));

     try {
       const updates = types.map((type) => ({
         id: type.id,
         label: type.label,
         value: type.value,
         active: checked,
       }));
 
       const { error } = await supabase.from("property_types").upsert(updates, { onConflict: "id" });
 
       if (error) throw error;
 
       toast.success(checked ? "Todos os tipos ativados" : "Todos os tipos desativados");
     } catch (error) {
       console.error("Error toggling all types:", error);
       toast.error("Erro ao atualizar tipos");
       fetchTypes();
     }
  };

  const areAllChecked = types.length > 0 && types.every((t) => t.active);
  const filteredTypes = types.filter((type) => type.label.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerenciar Tipos de Imóveis</h1>
          <p className="text-gray-600">Configure os tipos de imóveis disponíveis no filtro</p>
        </div>
      </div>

      {/* Add Type Form */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Adicionar Novo Tipo</h3>
        <form onSubmit={handleAddType} className="flex gap-4">
          <input
            type="text"
            value={newTypeLabel}
            onChange={(e) => setNewTypeLabel(e.target.value)}
            placeholder="Nome do tipo (ex: Galpão)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={adding || !newTypeLabel.trim()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
          >
            {adding ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
            Adicionar
          </button>
        </form>
      </div>

      {/* Types List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-4">
          <Checkbox
            checked={areAllChecked}
            onCheckedChange={(checked) => toggleAllTypes(checked as boolean)}
            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
          />
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar tipo..."
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
            {filteredTypes.map((type) => (
              <div key={type.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <Checkbox
                    id={`type-${type.id}`}
                    checked={!!type.active}
                    onCheckedChange={(checked) => toggleType(type, checked as boolean)}
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 z-10"
                  />
                  <label htmlFor={`type-${type.id}`} className="font-medium text-gray-700 cursor-pointer select-none">
                    {type.label}
                  </label>
                </div>
                <button
                  onClick={() => handleDeleteType(type.id)}
                  className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                  title="Remover tipo"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}

            {filteredTypes.length === 0 && (
              <div className="p-8 text-center text-gray-500">Nenhum tipo encontrado</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
