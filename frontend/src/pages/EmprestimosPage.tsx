import { useEffect, useState } from "react";
import { Alert, Button, Group, Modal, NativeSelect, Paper, Stack, Table, TextInput, Title } from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { emprestimoSchema, type Emprestimo } from "@biblioteca/shared/emprestimo";
import type { Livro } from "@biblioteca/shared/livro";
import type { Leitor } from "@biblioteca/shared/leitor";
import {
  criarEmprestimo,
  editarEmprestimo,
  listarEmprestimos,
  listarLeitores,
  listarLivros,
  removerEmprestimo,
} from "../services/api.ts";
import { errosDaApi, errosDoZod, type ErrosDosCampos } from "../services/erros.ts";

export function EmprestimosPage() {
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
  const [livros, setLivros] = useState<Livro[]>([]);
  const [leitores, setLeitores] = useState<Leitor[]>([]);
  const [busca, setBusca] = useState("");
  const [erroDaLista, setErroDaLista] = useState("");

  const [emEdicao, setEmEdicao] = useState<Emprestimo | "novo" | null>(null);
  const [livroId, setLivroId] = useState("");
  const [leitorId, setLeitorId] = useState("");
  const [dataEmprestimo, setDataEmprestimo] = useState("");
  const [dataDevolucao, setDataDevolucao] = useState("");
  const [erro, setErro] = useState("");
  const [erros, setErros] = useState<ErrosDosCampos>({});

  async function carregar() {
    try {
      setEmprestimos(await listarEmprestimos());
      setLivros(await listarLivros());
      setLeitores(await listarLeitores());
    } catch (e) {
      setErroDaLista(errosDaApi(e).mensagem);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function abrirModal(emprestimo: Emprestimo | "novo") {
    const novo = emprestimo === "novo";
    setEmEdicao(emprestimo);
    setLivroId(novo ? "" : String(emprestimo.livroId));
    setLeitorId(novo ? "" : String(emprestimo.leitorId));
    setDataEmprestimo(novo ? "" : emprestimo.dataEmprestimo);
    setDataDevolucao(novo ? "" : emprestimo.dataDevolucao);
    setErro("");
    setErros({});
  }

  async function salvar() {
    setErro("");
    setErros({});

    const emprestimo = {
      livroId: livroId === "" ? undefined : Number(livroId),
      leitorId: leitorId === "" ? undefined : Number(leitorId),
      dataEmprestimo,
      dataDevolucao,
    };

    const validacao = emprestimoSchema.safeParse(emprestimo);
    if (!validacao.success) {
      setErros(errosDoZod(validacao.error));
      return;
    }

    try {
      if (emEdicao === "novo") await criarEmprestimo(validacao.data);
      else if (emEdicao) await editarEmprestimo(emEdicao.id, validacao.data);
      setEmEdicao(null);
      carregar();
    } catch (e) {
      const { mensagem, campos } = errosDaApi(e);
      setErro(mensagem);
      setErros(campos);
    }
  }

  async function remover(emprestimo: Emprestimo) {
    if (!window.confirm(`Remover o empréstimo de "${emprestimo.livro.titulo}" para ${emprestimo.leitor.nome}?`)) return;
    try {
      await removerEmprestimo(emprestimo.id);
      carregar();
    } catch (e) {
      setErroDaLista(errosDaApi(e).mensagem);
    }
  }

  const texto = busca.toLowerCase();
  const emprestimosFiltrados = emprestimos.filter(
    (emprestimo) =>
      emprestimo.livro.titulo.toLowerCase().includes(texto) ||
      emprestimo.leitor.nome.toLowerCase().includes(texto),
  );

  return (
    <>
      <Group justify="space-between" mb="lg">
        <Title order={1}>Empréstimos</Title>
        <Button leftSection={<IconPlus size={18} />} onClick={() => abrirModal("novo")}>Novo empréstimo</Button>
      </Group>

      {erroDaLista && <Alert color="red" mb="md">{erroDaLista}</Alert>}

      <TextInput placeholder="Buscar por livro ou leitor" leftSection={<IconSearch size={18} />} mb="md"
        value={busca} onChange={(e) => setBusca(e.target.value)} />

      <Paper withBorder>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Livro</Table.Th>
              <Table.Th>Leitor</Table.Th>
              <Table.Th>Empréstimo</Table.Th>
              <Table.Th>Devolução</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {emprestimosFiltrados.map((emprestimo) => (
              <Table.Tr key={emprestimo.id}>
                <Table.Td>{emprestimo.livro.titulo}</Table.Td>
                <Table.Td>{emprestimo.leitor.nome}</Table.Td>
                <Table.Td>{emprestimo.dataEmprestimo}</Table.Td>
                <Table.Td>{emprestimo.dataDevolucao}</Table.Td>
                <Table.Td>
                  <Group gap="xs" justify="flex-end" wrap="nowrap">
                    <Button size="xs" variant="light" onClick={() => abrirModal(emprestimo)}>Editar</Button>
                    <Button size="xs" variant="light" color="red" onClick={() => remover(emprestimo)}>Remover</Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>

      <Modal opened={emEdicao !== null} onClose={() => setEmEdicao(null)}
        title={emEdicao === "novo" ? "Novo empréstimo" : "Editar empréstimo"}>
        <form onSubmit={(e) => { e.preventDefault(); salvar(); }}>
          <Stack>
            {erro && <Alert color="red">{erro}</Alert>}
            <NativeSelect
              label="Livro"
              value={livroId}
              onChange={(e) => setLivroId(e.target.value)}
              error={erros.livroId}
              data={[
                { label: "Selecione o livro", value: "" },
                ...livros.map((livro) => ({ label: livro.titulo, value: String(livro.id) })),
              ]}
            />
            <NativeSelect
              label="Leitor"
              value={leitorId}
              onChange={(e) => setLeitorId(e.target.value)}
              error={erros.leitorId}
              data={[
                { label: "Selecione o leitor", value: "" },
                ...leitores.map((leitor) => ({ label: leitor.nome, value: String(leitor.id) })),
              ]}
            />
            <TextInput label="Data do empréstimo" placeholder="DD/MM/AAAA" value={dataEmprestimo}
              onChange={(e) => setDataEmprestimo(e.target.value)} error={erros.dataEmprestimo} />
            <TextInput label="Data de devolução" placeholder="DD/MM/AAAA" value={dataDevolucao}
              onChange={(e) => setDataDevolucao(e.target.value)} error={erros.dataDevolucao} />
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
