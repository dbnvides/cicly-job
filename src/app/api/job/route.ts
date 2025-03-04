import { PrismaClient, Method, Status } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const jobs = await prisma.jobapply.findMany();
    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar vagas" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const {
      company,
      position,
      date,
      method,
      status,
    }: {
      company: string;
      position: string;
      date: Date;
      method: Method;
      status: Status;
    } = await req.json();

    if (!company || !position || !date) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    const newJob = await prisma.jobapply.create({
      data: { company, date, position, method, status },
    });

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao adicionar vaga" },
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
      date: Date;
      method: Method;
      status: Status;
    } = await req.json();

    if (!company || !position || !date) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    const updatedJob = await prisma.jobapply.update({
      where: { id },
      data: { company, position, date, method, status },
    });

    return NextResponse.json(updatedJob, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar a vaga" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

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
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao deletar a aplicação de emprego." },
      { status: 500 }
    );
  }
}
