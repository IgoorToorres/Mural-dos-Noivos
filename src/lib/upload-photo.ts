import { supabase } from '@/lib/supabase';

export async function uploadWeddingPhoto(file: File) {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const filename = `${crypto.randomUUID()}.${ext}`;
  const path = `wedding/${filename}`;

  const { error } = await supabase.storage
    .from('wedding-photos')
    .upload(path, file, {
      upsert: false,
      contentType: file.type,
      cacheControl: '3600',
    });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from('wedding-photos').getPublicUrl(path);

  return {
    path,
    publicUrl: data.publicUrl,
  };
}
