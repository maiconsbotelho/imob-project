import { supabase } from "./supabase";

export const BUCKET_NAME = "property-images";

export async function uploadPropertyImages(files: File[]): Promise<string[]> {
  const uploadPromises = files.map(async (file) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file);

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    return data.publicUrl;
  });

  return Promise.all(uploadPromises);
}

export async function deletePropertyImages(imageUrls: string[]) {
  const filesToRemove = imageUrls.map((url) => {
    const parts = url.split("/");
    return parts[parts.length - 1]; // Assumes filename is at the end
  });

  const { error } = await supabase.storage.from(BUCKET_NAME).remove(filesToRemove);

  if (error) {
    console.error("Error deleting files:", error);
    throw error;
  }
}
