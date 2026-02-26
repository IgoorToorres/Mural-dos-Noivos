'use client';
import { Button } from '@/components/ui/button';
import { deletePostById } from '@/lib/posts';
import { toast } from 'sonner';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type DeleteButtonProps = {
  postId: string;
};

export default function DeleteButton({ postId }: DeleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const ok = confirm('Tem certeza que deseja excluir esta recordação?');
    if (!ok) return;

    try {
      setLoading(true);

      const res = await deletePostById(postId);
      toast.success(res.message ?? 'Post excluído com sucesso');

      router.push('/recordacoes');
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message ?? 'Erro ao excluir o post. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="mt-4 bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}Excluir
    </Button>
  );
}
