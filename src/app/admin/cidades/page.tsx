"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase";
import { City } from "@/types/city";
import { Loader2, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminCities() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCityName, setNewCityName] = useState("");
  const [adding, setAdding] = useState(false);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("cities")
        .select("*")
        .order("name");

      if (error) throw error;
      setCities(data || []);
    } catch (error) {
      console.error("Error fetching cities:", error);
      toast.error("Erro ao carregar cidades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const toggleCity = async (city: City, checked: boolean) => {
    // Optimistic update
    setCities((prev) =>
      prev.map((c) => (c.id === city.id ? { ...c, active: checked } : c))
    );

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.error("Session error:", sessionError);
        throw new Error("Usuário não autenticado ou sessão expirada");
      }

      const { error } = await supabase.from("cities").upsert(
        {
          id: city.id,
          name: city.name,
          state: city.state,
          active: checked,
        },
        { onConflict: "id" }
      );

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error("Error toggling city:", error);
      toast.error(error.message || "Erro ao atualizar cidade");
      // Revert optimistic update on error
      setCities((prev) =>
        prev.map((c) => (c.id === city.id ? { ...c, active: !checked } : c))
      );
    }
  };

  const handleAddCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCityName.trim()) return;

    try {
      setAdding(true);
      const { data, error } = await supabase
        .from("cities")
        .insert([{ name: newCityName.trim(), state: "RS", active: true }])
        .select()
        .single();

      if (error) throw error;

      setCities([...cities, data].sort((a, b) => a.name.localeCompare(b.name)));
      setNewCityName("");
      toast.success("Cidade adicionada com sucesso");
    } catch (error) {
      console.error("Error adding city:", error);
      toast.error("Erro ao adicionar cidade");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteCity = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja remover esta cidade?")) return;
    try {
      const { error } = await supabase.from("cities").delete().eq("id", id);
      if (error) throw error;
      setCities(cities.filter((c) => c.id !== id));
      toast.success("Cidade removida");
    } catch (error) {
      console.error("Error deleting city", error);
      toast.error("Erro ao remover cidade");
    }
  };

  const toggleAllCities = async (checked: boolean) => {
    // Optimistic update
    setCities(cities.map((c) => ({ ...c, active: checked })));

    try {
      const updates = cities.map((city) => ({
        id: city.id,
        name: city.name,
        state: city.state,
        active: checked,
      }));

      // We need to update each one individually or create a bulk update function in Supabase
      // For simplicity and to ensure RLS policies, we'll iterate for now, but in production a bulk RPC is better.
      // Or we can use `upsert` if we include all required fields.

      const { error } = await supabase
        .from("cities")
        .upsert(updates, { onConflict: "id" });

      if (error) throw error;

      toast.success(
        checked ? "Todas as cidades ativadas" : "Todas as cidades desativadas"
      );
    } catch (error) {
      console.error("Error toggling all cities:", error);
      toast.error("Erro ao atualizar cidades");
      // Revert optimistic update
      // We would ideally need to revert to previous state, but for bulk action simple fetch is easier
      fetchCities();
    }
  };

  const areAllChecked = cities.length > 0 && cities.every((c) => c.active);

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto max-w-4xl pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gerenciar Cidades
          </h1>
          <p className="text-gray-600">
            Configure as cidades disponíveis no filtro de busca
          </p>
        </div>
      </div>

      {/* Add City Form */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Adicionar Nova Cidade</h3>
        <form
          onSubmit={handleAddCity}
          className="flex flex-col sm:flex-row gap-4"
        >
          <input
            type="text"
            value={newCityName}
            onChange={(e) => setNewCityName(e.target.value)}
            placeholder="Nome da cidade (ex: Gramado)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={adding || !newCityName.trim()}
            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
          >
            {adding ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Plus className="h-5 w-5" />
            )}
            Adicionar
          </button>
        </form>
      </div>

      {/* Cities List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-4">
          <Checkbox
            checked={areAllChecked}
            onCheckedChange={(checked) => toggleAllCities(checked as boolean)}
            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
          />
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar cidade..."
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
            {filteredCities.map((city) => (
              <div
                key={city.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Checkbox
                    id={`city-${city.id}`}
                    checked={!!city.active}
                    onCheckedChange={(checked) =>
                      toggleCity(city, checked as boolean)
                    }
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 z-10"
                  />
                  <label
                    htmlFor={`city-${city.id}`}
                    className="font-medium text-gray-700 cursor-pointer select-none"
                  >
                    {city.name} - {city.state}
                  </label>
                </div>
                <button
                  onClick={() => handleDeleteCity(city.id)}
                  className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                  title="Remover cidade"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}

            {filteredCities.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                Nenhuma cidade encontrada
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
