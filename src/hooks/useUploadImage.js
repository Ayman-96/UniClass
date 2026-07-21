import { supabase } from "../supabase";

export async function uploadCommentImage(file, bucket, userId) {
  const ext = file?.name.split(".").pop();
  const path = `${userId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket) // 'post-comment-images' or 'announcement-comment-images'
    .upload(path, file, { upsert: false });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);

  return publicUrl;
}
