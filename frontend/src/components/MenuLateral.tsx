import type { ReactNode } from "react";
import { AppShell, Button, NavLink, Stack, Text, Title } from "@mantine/core";

export type Pagina = "home" | "autores" | "livros" | "leitores" | "emprestimos";

const itensDoMenu: { pagina: Pagina; rotulo: string }[] = [
  { pagina: "home", rotulo: "Início" },
  { pagina: "autores", rotulo: "Autores" },
  { pagina: "livros", rotulo: "Livros" },
  { pagina: "leitores", rotulo: "Leitores" },
  { pagina: "emprestimos", rotulo: "Empréstimos" },
];

type Props = {
  nome: string;
  paginaAtual: Pagina;
  onNavegar: (pagina: Pagina) => void;
  onSair: () => void;
  children: ReactNode;
};

export function MenuLateral({ nome, paginaAtual, onNavegar, onSair, children }: Props) {
  return (
    <AppShell navbar={{ width: 220, breakpoint: 0 }} padding="xl">
      <AppShell.Navbar p="md">
        <Title order={3} mb="lg">Biblioteca</Title>
        <Stack gap={4} style={{ flex: 1 }}>
          {itensDoMenu.map((item) => (
            <NavLink
              key={item.pagina}
              label={item.rotulo}
              active={paginaAtual === item.pagina}
              onClick={() => onNavegar(item.pagina)}
            />
          ))}
        </Stack>
        <Text size="sm" mb="xs">{nome}</Text>
        <Button variant="light" color="red" onClick={onSair}>Sair</Button>
      </AppShell.Navbar>

      <AppShell.Main bg="gray.0">{children}</AppShell.Main>
    </AppShell>
  );
}
