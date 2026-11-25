import { useEffect, useState } from "react";
import { Alert, Button, Group, Modal, Paper, Stack, Table, TextInput, Title } from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { leitorSchema, type Leitor } from "@biblioteca/shared/leitor";
import { criarLeitor, editarLeitor, listarLeitores, removerLeitor } from "../services/api.ts";
import { errosDaApi, errosDoZod, type ErrosDosCampos } from "../services/erros.ts";

export function LeitoresPage() {
  const [leitores, setLeitores] = useState<Leitor[]>([]);
  const [busca, setBusca] = useState("");
  const [erroDaLista, setErroDaLista] = useState("");

  const [emEdicao, setEmEdicao] = useState<Leitor | "novo" | null>(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erro, setErro] = useState("");
  const [erros, setErros] = useState<ErrosDosCampos>({});

  async function carregar() {
    try {
      setLeitores(await listarLeitores());
    } catch (e) {
      setErroDaLista(errosDaApi(e).mensagem);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function abrirModal(leitor: Leitor | "novo") {
    setEmEdicao(leitor);
    setNome(leitor === "novo" ? "" : leitor.nome);
    setEmail(leitor === "novo" ? "" : leitor.email);
    setTelefone(leitor === "novo" ? "" : leitor.telefone);
    setErro("");
    setErros({});
  }

  async function salvar() {
    setErro("");
    setErros({});

    const validacao = leitorSchema.safeParse({ nome, email, telefone });
    if (!validacao.success) {
      setErros(errosDoZod(validacao.error));
      return;
    }

    try {
      if (emEdicao === "novo") await criarLeitor(validacao.data);
      else if (emEdicao) await editarLeitor(emEdicao.id, validacao.data);
      setEmEdicao(null);
      carregar();
    } catch (e) {
      const { mensagem, campos } = errosDaApi(e);
      setErro(mensagem);
      setErros(campos);
    }
  }

  async function remover(leitor: Leitor) {
    if (!window.confirm(`Remover o leitor "${leitor.nome}"?`)) return;
    try {
      await removerLeitor(leitor.id);
      carregar();
    } catch (e) {
      setErroDaLista(errosDaApi(e).mensagem);
    }
  }

  const texto = busca.toLowerCase();
  const leitoresFiltrados = leitores.filter(
    (leitor) => leitor.nome.toLowerCase().includes(texto) || leitor.email.toLowerCase().includes(texto),
  );

  return (
    <>
      <Group justify="space-between" mb="lg">
        <Title order={1}>Leitores</Title>
        <Button leftSection={<IconPlus size={18} />} onClick={() => abrirModal("novo")}>Novo leitor</Button>
      </Group>

      {erroDaLista && <Alert color="red" mb="md">{erroDaLista}</Alert>}

      <TextInput placeholder="Buscar por nome ou e-mail" leftSection={<IconSearch size={18} />} mb="md"
        value={busca} onChange={(e) => setBusca(e.target.value)} />

      <Paper withBorder>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nome</Table.Th>
              <Table.Th>E-mail</Table.Th>
              <Table.Th>Telefone</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {leitoresFiltrados.map((leitor) => (
              <Table.Tr key={leitor.id}>
                <Table.Td>{leitor.nome}</Table.Td>
                <Table.Td>{leitor.email}</Table.Td>
                <Table.Td>{leitor.telefone}</Table.Td>
                <Table.Td>
                  <Group gap="xs" justify="flex-end">
                    <Button size="xs" variant="light" onClick={() => abrirModal(leitor)}>Editar</Button>
                    <Button size="xs" variant="light" color="red" onClick={() => remover(leitor)}>Remover</Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>

      <Modal opened={emEdicao !== null} onClose={() => setEmEdicao(null)}
        title={emEdicao === "novo" ? "Novo leitor" : "Editar leitor"}>
        <form onSubmit={(e) => { e.preventDefault(); salvar(); }}>
          <Stack>
            {erro && <Alert color="red">{erro}</Alert>}
            <TextInput label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} error={erros.nome} />
            <TextInput label="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} error={erros.email} />
            <TextInput label="Telefone" placeholder="Somente números, com DDD" value={telefone}
              onChange={(e) => setTelefone(e.target.value)} error={erros.telefone} />
            <Group justify="flex-end">
              <Button variant="default" onClick={() => setEmEdicao(null)}>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
