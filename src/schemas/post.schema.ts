import { z } from 'zod';

export const createPostSchema = z.object({
  name: z.string().min(1, 'Nome Obrigatório').max(80, 'Nome muito longo'),
  message: z
    .string()
    .min(1, 'Mensagem Obrigatória')
    .max(500, 'Mensagem muito longa'),
  imagePath: z.string().url('URL da imagem inválida').optional().nullable(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
