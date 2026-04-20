// ============================================================
// LINK PERSONALIZADO PARA O FORMULÁRIO
// ============================================================
// Esta rota cria um link amigável para o formulário de recordações.
// Acesse via: seusite.com/convite
//
// Para alterar o caminho personalizado:
//   1. Renomeie a pasta `convite` para o nome que quiser
//      Ex: `rsvp`, `foto`, `mensagem`, `participar`, etc.
//   2. Ou adicione múltiplos aliases criando mais pastas como esta
//
// Para alterar o destino do redirecionamento:
//   Mude o valor de `DESTINO` abaixo
// ============================================================

import { redirect } from 'next/navigation';

// Destino do redirecionamento — altere aqui se necessário
const DESTINO = '/formulario';

// Opcional: você pode passar parâmetros extras para o formulário
// Ex: `/formulario?origem=convite&evento=casamento`
// const DESTINO = '/formulario?origem=convite';

export default function ConvitePage() {
  redirect(DESTINO);
}

// ============================================================
// METADADOS DA PÁGINA (visíveis ao compartilhar o link)
// Personalize o título e descrição que aparecem no WhatsApp,
// Instagram, etc. quando alguém compartilha este link.
// ============================================================

export const metadata = {
  // Título exibido na aba do navegador e no preview do link
  title: 'Deixe sua mensagem para o casal',

  // Descrição exibida no preview ao compartilhar
  description: 'Registre sua recordação especial do nosso casamento ❤️',

  // Open Graph: controla a prévia ao compartilhar em redes sociais
  openGraph: {
    title: 'Deixe sua mensagem — Casamento',
    description: 'Registre sua recordação especial do nosso casamento ❤️',

    images: ['/Natan-Bia.jpeg'],
  },
};
