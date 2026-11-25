import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  await prisma.emprestimo.deleteMany();
  await prisma.livro.deleteMany();
  await prisma.autor.deleteMany();
  await prisma.leitor.deleteMany();
  await prisma.usuario.deleteMany();

  await prisma.usuario.create({
    data: {
      nome: "Professor",
      email: "professor@biblioteca.com",
      senha: await bcrypt.hash("senha1234", 10),
    },
  });

  const machado = await prisma.autor.create({ data: { nome: "Machado de Assis", nacionalidade: "Brasileira" } });
  const clarice = await prisma.autor.create({ data: { nome: "Clarice Lispector", nacionalidade: "Brasileira" } });
  const orwell = await prisma.autor.create({ data: { nome: "George Orwell", nacionalidade: "Britânica" } });

  const domCasmurro = await prisma.livro.create({
    data: { titulo: "Dom Casmurro", isbn: "9788535910663", ano: 1899, autorId: machado.id },
  });
  const memorias = await prisma.livro.create({
    data: { titulo: "Memórias Póstumas de Brás Cubas", isbn: "9788594318602", ano: 1881, autorId: machado.id },
  });
  const estrela = await prisma.livro.create({
    data: { titulo: "A Hora da Estrela", isbn: "9788532508126", ano: 1977, autorId: clarice.id },
  });
  const livro1984 = await prisma.livro.create({
    data: { titulo: "1984", isbn: "9788535914849", ano: 1949, autorId: orwell.id },
  });

  const ana = await prisma.leitor.create({ data: { nome: "Ana Souza", email: "ana@email.com", telefone: "11999998888" } });
  const bruno = await prisma.leitor.create({ data: { nome: "Bruno Lima", email: "bruno@email.com", telefone: "11988887777" } });
  const carla = await prisma.leitor.create({ data: { nome: "Carla Mendes", email: "carla@email.com", telefone: "11977776666" } });

  await prisma.emprestimo.createMany({
    data: [
      { dataEmprestimo: "01/11/2026", dataDevolucao: "15/11/2026", livroId: domCasmurro.id, leitorId: ana.id },
      { dataEmprestimo: "05/11/2026", dataDevolucao: "19/11/2026", livroId: livro1984.id, leitorId: bruno.id },
      { dataEmprestimo: "10/11/2026", dataDevolucao: "24/11/2026", livroId: estrela.id, leitorId: carla.id },
      { dataEmprestimo: "12/11/2026", dataDevolucao: "26/11/2026", livroId: memorias.id, leitorId: ana.id },
    ],
  });

  console.log("Seed concluído!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
