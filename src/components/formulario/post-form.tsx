'use client';
import { CreatePostInput, createPostSchema } from '@/schemas/post.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2, MessageCircleHeartIcon, User } from 'lucide-react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { useEffect, useMemo, useState } from 'react';
import { uploadWeddingPhoto } from '@/lib/upload-photo';
import { toast } from 'sonner';
import { PhotoPicker } from '../photo-picker/photo-picker';
import Image from 'next/image';

export const PostForm = () => {
  const [file, setFile] = useState<File | null>(null);

  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file]
  );

  //cleanup do preview
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const form = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      name: '',
      message: '',
      imagePath: null,
    },
  });

  const onSubmit = async (data: CreatePostInput) => {
    try {
      let imagePath: string | null = null;

      if (file) {
        const uploaded = await uploadWeddingPhoto(file);
        imagePath = uploaded.publicUrl;
      }

      const payload: CreatePostInput = { ...data, imagePath };

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || 'Erro ao salvar no banco');
      }

      toast.success('Foto Enviada e dados salvos');
      form.reset();
      setFile(null);
    } catch (error: any) {
      toast.error(error?.message || 'Erro ao enviar foto');
    }
  };

  return (
    <section className="min-h-dvh bg-cream-50">
      {/* IMAGEM FIXA NO FUNDO */}
      <div className="fixed inset-x-0 top-0 z-0 h-[58vh] min-h-95 w-full overflow-hidden bg-background-secondary">
        <Image
          src="/Natan-Bia.jpeg"
          alt="Foto do casal"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* ESPAÇADOR PARA MANTER O FLUXO */}
      <div className="h-[58vh] min-h-95 w-full" />

      {/* CARD DO FORM SOBREPOSTO */}
      <div className="relative z-10 -mt-16 px-4 pb-14 sm:-mt-20 rounded-4xl bg-accent-cream">
        <div className="px-6 pb-6 pt-7">
          <div className="mb-5">
            <h1 className="text-title text-content-primary">
              Deixe sua mensagem e foto para os noivos
            </h1>
            <p className="mt-1 text-paragraph-medium text-content-secondary">
              Compartilhe uma lembrança especial para alegrar o mural de
              recordações.
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              {/* FOTO */}
              <div className="rounded-2xl border border-border-primary bg-background-secondary p-4">
                <PhotoPicker
                  previewUrl={previewUrl}
                  onPick={(file) => setFile(file)}
                  onClear={() => setFile(null)}
                  disabled={form.formState.isSubmitting}
                />
                {/* <p className="mt-2 text-paragraph-small text-content-tertiary">
                  Dica: fotos bem iluminadas ficam lindas no mural.
                </p> */}
              </div>

              {/* NOME */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-label-medium text-content-primary">
                      Seu nome
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User
                          className="absolute left-3 top-1/2 -translate-y-1/2 transform text-content-brand"
                          size={20}
                        />
                        <Input
                          placeholder="Digite seu nome"
                          className="h-12 pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* MENSAGEM */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-label-medium text-content-primary">
                      Mensagem para o casal
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MessageCircleHeartIcon
                          className="absolute left-3 top-5 -translate-y-1/2 transform text-content-brand"
                          size={20}
                        />
                        <Textarea
                          placeholder="Escreva algo especial..."
                          className="min-h-40 resize-y pl-10"
                          {...field}
                        />
                        <p className="ml-1 mt-1 text-paragraph-small text-content-tertiary">
                          Apenas o casal consegue ver a sua mensagem.
                        </p>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* AÇÃO */}
              <div className="flex flex-col gap-3">
                <p className="text-paragraph-small text-content-tertiary">
                  Ao enviar, você autoriza o uso da foto no mural do casamento.
                </p>

                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="h-12 w-full rounded-xl bg-accent-primary text-white"
                >
                  {form.formState.isSubmitting && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  Enviar lembrança
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
};
