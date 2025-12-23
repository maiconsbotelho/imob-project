"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Property } from "../types/property";

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

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("properties").select("*").order("createdAt", { ascending: false });

      if (error) throw error;
      if (data) setProperties(data as Property[]);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const addProperty = async (property: Omit<Property, "id" | "createdAt">) => {
    try {
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
      const { error } = await supabase.from("properties").update(updatedProperty).eq("id", id);

      if (error) throw error;

      setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedProperty } : p)));
    } catch (error) {
      console.error("Error updating property:", error);
      throw error;
    }
  };

  const deleteProperty = async (id: string) => {
    try {
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
