import { PrismaClient } from "@prisma/client";
import { Method, Status } from "@/types/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "usuarioId é obrigatório" },
      { status: 400 }
    );
  }

  try {
    const jobs = await prisma.jobapply.findMany({
      where: { usuarioId: Number(id) },
    });

    return NextResponse.json(jobs ?? [], { status: 200 });
  } catch {
    console.error("Erro ao buscar vagas");
    return NextResponse.json(
      { error: "Erro ao buscar vagas" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const {
      id,
      company,
      position,
      date,
      method,
      status,
    }: {
      id: number;
      company: string;
      position: string;
      date: string;
      method: Method;
      status: Status;
    } = await req.json();

    if (!company || !position || !date) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }
    const formatedDate = date.split("T")[0];

    const updatedJob = await prisma.jobapply.update({
      where: { id },
      data: {
        company,
        position,
        date: formatedDate,
        method,
        status,
      },
    });

    return NextResponse.json(updatedJob, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Erro ao atualizar a vaga" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "O ID é obrigatório para deletar." },
        { status: 400 }
      );
    }
    await prisma.jobapply.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { message: "Registro deletado com sucesso!" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Erro ao deletar a aplicação de emprego." },
      { status: 500 }
    );
  }
}
