import { PrismaClient, Method, Status } from "@prisma/client";
import { NextResponse } from "next/server";
// import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const {
      company,
      position,
      date,
      method,
      status,
      usuarioId,
      link,
    }: {
      company: string;
      position: string;
      date: string;
      method: Method;
      status: Status;
      usuarioId: number;
      link: string;
    } = data;

    if (!company || !position || !date || !usuarioId || !link) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }
    const user = await prisma.usuario.findUnique({
      where: { id: usuarioId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const formatedDate = date.split("T")[0];

    const methodUpperCase = method.toUpperCase() as Method;
    const statusUpperCase = status.toUpperCase() as Status;

    const newJob = await prisma.jobapply
      .create({
        data: {
          company,
          date: formatedDate,
          position,
          method: methodUpperCase,
          status: statusUpperCase,
          usuarioId,
          link,
        },
      })
      .catch((err) => {
        console.error("Erro no Prisma:", err);
        throw err;
      });
    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error("Erro ao adicionar vaga:", error);
    return NextResponse.json(
      { error: "Erro ao adicionar vaga" },
      { status: 500 }
    );
  }
}
