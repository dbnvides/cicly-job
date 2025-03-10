import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "@/hook/hashpassword";

const prisma = new PrismaClient();

// Rota GET - Buscar usuários
export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany();
    return NextResponse.json(usuarios, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar usuários" },
      { status: 500 }
    );
  }
}

// Rota POST - Criar usuário
export async function POST(req: Request) {
  try {
    const { nome, email, password } = await req.json();

    if (!nome || !email || !password) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    await prisma.usuario.create({
      data: { nome, email, password: hashedPassword },
    });

    return NextResponse.json({ nome, email }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao criar usuário" },
      { status: 500 }
    );
  }
}
