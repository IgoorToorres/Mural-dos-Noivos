import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: Params) {
  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });

    if (!post) {
      return NextResponse.json(
        { message: 'Post não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao buscar post' },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const { id } = await params;

    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Post excluído com sucesso' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);

    // Caso comum: tentar deletar um id que não existe
    if (error?.code === 'P2025') {
      return NextResponse.json(
        { message: 'Post não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Erro ao excluir post' },
      { status: 500 }
    );
  }
}
