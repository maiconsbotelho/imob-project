"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { mockProperties } from "../data/mockProperties";
import { supabase } from "../lib/supabase";
import { Property } from "../types/property";
import { useAuth } from "./AuthContext";

interface PropertyContextType {
  properties: Property[];
  loading: boolean;
  addProperty: (property: Omit<Property, "id" | "createdAt">) => Promise<void>;
  updateProperty: (id: string, property: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  getPropertyById: (id: string) => Property | undefined;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("properties").select("*").order("createdAt", { ascending: false });

      if (error) {
        console.warn("Supabase fetch error, falling back to mock data:", error.message);
        setProperties(mockProperties);
      } else if (data && data.length > 0) {
        setProperties(data as Property[]);
      } else {
        setProperties(mockProperties);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      setProperties(mockProperties);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const addProperty = async (property: Omit<Property, "id" | "createdAt">) => {
    try {
      if (!session) {
        throw new Error("Usuário não autenticado. Faça login para adicionar imóveis.");
      }

      // Ensure the client has the correct session
      await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      });

      const { data, error } = await supabase.from("properties").insert([property]).select().single();

      if (error) throw error;
      if (data) {
        setProperties((prev) => [data as Property, ...prev]);
      }
    } catch (error) {
      console.error("Error adding property:", error);
      throw error;
    }
  };

  const updateProperty = async (id: string, updatedProperty: Partial<Property>) => {
    try {
      if (!session) {
        throw new Error("Usuário não autenticado. Faça login para editar imóveis.");
      }

      console.log("Updating property:", id, "with session user:", session.user.id);

      // Ensure the client has the correct session
      const { error: authError } = await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      });

      if (authError) {
        console.warn("Error setting session on Supabase client:", authError);
      }

      // Workaround for CORS/PATCH issues: Use Upsert (POST) instead of Update (PATCH)
      // First fetch the existing data to ensure we don't lose any fields
      const { data: existingData, error: fetchError } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) {
        console.error("Error fetching existing property for update:", fetchError);
        throw fetchError;
      }

      const mergedData = {
        ...existingData,
        ...updatedProperty,
        id, // Ensure ID is present for upsert
      };

      console.log("Upserting property with data:", mergedData);

      const { data, error } = await supabase.from("properties").upsert(mergedData).select().single();

      if (error) {
        console.error("Supabase upsert error:", error);
        throw error;
      }

      // Update local state
      if (data) {
        setProperties((prev) => prev.map((p) => (p.id === id ? (data as Property) : p)));
      } else {
        setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedProperty } : p)));
      }
    } catch (error) {
      console.error("Error updating property:", error);
      throw error;
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      if (!session) {
        throw new Error("Usuário não autenticado. Faça login para excluir imóveis.");
      }

      // Ensure the client has the correct session
      await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      });

      const { error } = await supabase.from("properties").delete().eq("id", id);

      if (error) throw error;

      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting property:", error);
      throw error;
    }
  };

  const getPropertyById = (id: string) => {
    return properties.find((p) => p.id === id);
  };

  return (
    <PropertyContext.Provider
      value={{
        properties,
        loading,
        addProperty,
        updateProperty,
        deleteProperty,
        getPropertyById,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperties() {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error("useProperties must be used within a PropertyProvider");
  }
  return context;
}
