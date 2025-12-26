"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useProperties } from "@/contexts/PropertyContext";
import { uploadPropertyImages } from "@/lib/storage";
import { supabase } from "@/lib/supabase";
import { PropertyType } from "@/types/filters";
import { Property } from "@/types/property";
import { Loader2, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface PropertyFormProps {
  initialData?: Property;
  onSuccess: () => void;
  onCancel: () => void;
}

interface PropertyFormData extends Omit<Property, "id" | "code" | "createdAt" | "images"> {
  images: File[];
}

export function PropertyForm({ initialData, onSuccess, onCancel }: PropertyFormProps) {
  const { addProperty, updateProperty } = useProperties();
  const [isLoading, setIsLoading] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>(initialData?.images || []);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);

  useEffect(() => {
    async function fetchTypes() {
      const { data } = await supabase.from("property_types").select("*").eq("active", true).order("label");
      if (data) setPropertyTypes(data);
    }
    fetchTypes();
  }, []);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyFormData>({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      type: initialData?.type || "casa",
      status: initialData?.status || "venda",
      bedrooms: initialData?.bedrooms || 0,
      bathrooms: initialData?.bathrooms || 0,
      area: initialData?.area || 0,
      parking: initialData?.parking || 0,
      address: initialData?.address || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      featured: initialData?.featured || false,
      images: [],
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      const validFiles = files.filter((file) => {
        const isSizeValid = file.size <= 5 * 1024 * 1024; // 5MB limit
        if (!isSizeValid) {
          toast.error(`A imagem ${file.name} é muito grande. O tamanho máximo é 5MB.`);
        }
        return isSizeValid;
      });

      if (validFiles.length > 0) {
        setNewImages((prev) => [...prev, ...validFiles]);

        const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
        setImagePreviews((prev) => [...prev, ...newPreviews]);
      }
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      // Revoke URL to avoid memory leaks
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: PropertyFormData) => {
    try {
      setIsLoading(true);

      // Upload new images
      let uploadedImageUrls: string[] = [];
      if (newImages.length > 0) {
        uploadedImageUrls = await uploadPropertyImages(newImages);
      }

      const finalImages = [...existingImages, ...uploadedImageUrls];

      const propertyData = {
        ...data,
        price: Number(data.price),
        bedrooms: Number(data.bedrooms),
        bathrooms: Number(data.bathrooms),
        area: Number(data.area),
        parking: Number(data.parking),
        images: finalImages,
      };

      if (initialData) {
        await updateProperty(initialData.id, propertyData);
        toast.success("Imóvel atualizado com sucesso!");
      } else {
        await addProperty(propertyData);
        toast.success("Imóvel cadastrado com sucesso!");
      }

      onSuccess();
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.message || "Erro desconhecido ao salvar imóvel.";
      const errorDetails = error.details || "";
      toast.error(`Erro: ${errorMessage} ${errorDetails}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-h-[80vh] overflow-y-auto p-2">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Informações Básicas</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" {...register("title", { required: true })} placeholder="Ex: Casa Linda no Centro" />
            {errors.title && <span className="text-sm text-red-500">Campo obrigatório</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Preço (R$)</Label>
            <Input id="price" type="number" {...register("price", { required: true, min: 0 })} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea id="description" {...register("description", { required: true })} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casa">Casa</SelectItem>
                    <SelectItem value="apartamento">Apartamento</SelectItem>
                    <SelectItem value="terreno">Terreno</SelectItem>
                    <SelectItem value="sobrado">Sobrado</SelectItem>
                    <SelectItem value="sitio">Sítio</SelectItem>
                    <SelectItem value="chacara">Chácara</SelectItem>
                    <SelectItem value="comercial">Comercial</SelectItem>
                    <SelectItem value="rural">Rural</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="venda">Venda</SelectItem>
                    <SelectItem value="aluguel">Aluguel</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Detalhes</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bedrooms">Quartos</Label>
            <Input id="bedrooms" type="number" {...register("bedrooms", { min: 0 })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bathrooms">Banheiros</Label>
            <Input id="bathrooms" type="number" {...register("bathrooms", { min: 0 })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="parking">Vagas</Label>
            <Input id="parking" type="number" {...register("parking", { min: 0 })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="area">Área (m²)</Label>
            <Input id="area" type="number" {...register("area", { required: true, min: 0 })} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Localização</h3>

        <div className="space-y-2">
          <Label htmlFor="address">Endereço</Label>
          <Input id="address" {...register("address", { required: true })} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">Cidade</Label>
            <Input id="city" {...register("city", { required: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">Estado</Label>
            <Input id="state" {...register("state", { required: true })} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Mídia e Destaque</h3>

        <div className="space-y-2">
          <Label htmlFor="videoUrl">URL do Vídeo (YouTube)</Label>
          <Input id="videoUrl" {...register("videoUrl")} placeholder="https://www.youtube.com/watch?v=..." />
          <p className="text-xs text-gray-500">Cole o link completo do vídeo do YouTube.</p>
        </div>

        <div className="flex items-center space-x-2">
          <Controller
            name="featured"
            control={control}
            render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} id="featured" />}
          />
          <Label htmlFor="featured">Imóvel em Destaque</Label>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Imagens</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {existingImages.map((url, index) => (
            <div key={`existing-${index}`} className="relative group aspect-square">
              <img src={url} alt={`Existing ${index}`} className="w-full h-full object-cover rounded-lg" />
              <button
                type="button"
                onClick={() => removeExistingImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          {imagePreviews.map((url, index) => (
            <div key={`new-${index}`} className="relative group aspect-square">
              <img src={url} alt={`New ${index}`} className="w-full h-full object-cover rounded-lg" />
              <button
                type="button"
                onClick={() => removeNewImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <label className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors aspect-square">
            <Upload className="h-8 w-8 text-gray-400" />
            <span className="text-sm text-gray-500 mt-2">Adicionar</span>
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Salvar Alterações" : "Cadastrar Imóvel"}
        </Button>
      </div>
    </form>
  );
}
