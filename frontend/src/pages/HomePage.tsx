import { Card, SimpleGrid, Text, Title } from "@mantine/core";
import type { Pagina } from "../components/MenuLateral.tsx";

const atalhos: { pagina: Pagina; titulo: string }[] = [
  { pagina: "autores", titulo: "Autores" },
  { pagina: "livros", titulo: "Livros" },
  { pagina: "leitores", titulo: "Leitores" },
  { pagina: "emprestimos", titulo: "Empréstimos" },
];

type Props = { nome: string; onNavegar: (pagina: Pagina) => void };

export function HomePage({ nome, onNavegar }: Props) {
  return (
    <>
      <Title order={2} mb="lg">Bem-vindo, {nome}</Title>
      <SimpleGrid cols={2}>
        {atalhos.map((atalho) => (
          <Card key={atalho.pagina} withBorder style={{ cursor: "pointer" }} onClick={() => onNavegar(atalho.pagina)}>
            <Text fw={700}>{atalho.titulo}</Text>
          </Card>
        ))}
      </SimpleGrid>
    </>
  );
}
