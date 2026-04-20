import type { Metadata } from 'next';
import { PostForm } from '@/components/formulario';

export const metadata: Metadata = {
  title: 'Deixe sua mensagem para o casal',
  description: 'Registre sua recordação especial do nosso casamento ❤️',
  openGraph: {
    title: 'Deixe sua mensagem para o casal',
    description: 'Registre sua recordação especial do nosso casamento ❤️',
    images: ['/Natan-Bia.jpeg'],
  },
};

export default function Formulario() {
  return <PostForm />;
}
