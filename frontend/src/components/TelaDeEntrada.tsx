import type { ReactNode } from "react";
import { Center, Paper, Title } from "@mantine/core";

export function TelaDeEntrada({ children }: { children: ReactNode }) {
  return (
    <Center mih="100vh" bg="gray.1">
      <Paper withBorder shadow="sm" p="xl" w={400}>
        <Title order={2} ta="center" mb="lg">Biblioteca</Title>
        {children}
      </Paper>
    </Center>
  );
}
