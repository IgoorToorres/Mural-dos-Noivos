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
import { MessageCircleHeartIcon, User } from 'lucide-react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

export const PostForm = () => {
  const form = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      name: '',
      message: '',
      // imagePath: null,
    },
  });

  const onSubmit = (data: CreatePostInput) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <FormField
          control={form.control}
          name={'name'}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-label-medium-size text-content-primary">
                Insira seu Nome:
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 transform text-content-brand"
                    size={20}
                  />
                  <Input placeholder="Seu nome" className="pl-10" {...field} />
                </div>
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={'message'}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-label-medium-size text-content-primary">
                Deixe uma mensagem ao casal
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <MessageCircleHeartIcon
                    className="absolute left-3 top-5.5 -translate-y-1/2 transform text-content-brand"
                    size={20}
                  />
                  <Textarea
                    placeholder="Sua mensagem..."
                    className="pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <Button variant={'outline'} className="bg-accent-primary text-white">
          Enviar
        </Button>
      </form>
    </Form>
  );
};
