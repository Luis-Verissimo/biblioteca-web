import { useEffect, useState } from "react";
import { Alert, Button, Group, Modal, NativeSelect, Paper, Stack, Table, TextInput, Title } from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { livroSchema, type Livro } from "@biblioteca/shared/livro";
import type { Autor } from "@biblioteca/shared/autor";
import { criarLivro, editarLivro, listarAutores, listarLivros, removerLivro } from "../services/api.ts";
import { errosDaApi, errosDoZod, type ErrosDosCampos } from "../services/erros.ts";

export function LivrosPage() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [autores, setAutores] = useState<Autor[]>([]);
  const [busca, setBusca] = useState("");
  const [erroDaLista, setErroDaLista] = useState("");

  const [emEdicao, setEmEdicao] = useState<Livro | "novo" | null>(null);
  const [titulo, setTitulo] = useState("");
  const [isbn, setIsbn] = useState("");
  const [ano, setAno] = useState("");
  const [autorId, setAutorId] = useState("");
  const [erro, setErro] = useState("");
  const [erros, setErros] = useState<ErrosDosCampos>({});

  async function carregar() {
    try {
      setLivros(await listarLivros());
      setAutores(await listarAutores());
    } catch (e) {
      setErroDaLista(errosDaApi(e).mensagem);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function abrirModal(livro: Livro | "novo") {
    setEmEdicao(livro);
    setTitulo(livro === "novo" ? "" : livro.titulo);
    setIsbn(livro === "novo" ? "" : livro.isbn);
    setAno(livro === "novo" ? "" : String(livro.ano));
    setAutorId(livro === "novo" ? "" : String(livro.autorId));
    setErro("");
    setErros({});
  }

  async function salvar() {
    setErro("");
    setErros({});

    const livro = {
      titulo,
      isbn,
      ano: ano === "" ? undefined : Number(ano),
      autorId: autorId === "" ? undefined : Number(autorId),
    };

    const validacao = livroSchema.safeParse(livro);
    if (!validacao.success) {
      setErros(errosDoZod(validacao.error));
      return;
    }

    try {
      if (emEdicao === "novo") await criarLivro(validacao.data);
      else if (emEdicao) await editarLivro(emEdicao.id, validacao.data);
      setEmEdicao(null);
      carregar();
    } catch (e) {
      const { mensagem, campos } = errosDaApi(e);
      setErro(mensagem);
      setErros(campos);
    }
  }

  async function remover(livro: Livro) {
    if (!window.confirm(`Remover o livro "${livro.titulo}"?`)) return;
    try {
      await removerLivro(livro.id);
      carregar();
    } catch (e) {
      setErroDaLista(errosDaApi(e).mensagem);
    }
  }

  const texto = busca.toLowerCase();
  const livrosFiltrados = livros.filter(
    (livro) => livro.titulo.toLowerCase().includes(texto) || livro.autor.nome.toLowerCase().includes(texto),
  );

  return (
    <>
      <Group justify="space-between" mb="lg">
        <Title order={1}>Livros</Title>
        <Button leftSection={<IconPlus size={18} />} onClick={() => abrirModal("novo")}>Novo livro</Button>
      </Group>

      {erroDaLista && <Alert color="red" mb="md">{erroDaLista}</Alert>}

      <TextInput placeholder="Buscar por título ou autor" leftSection={<IconSearch size={18} />} mb="md"
        value={busca} onChange={(e) => setBusca(e.target.value)} />

      <Paper withBorder>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Título</Table.Th>
              <Table.Th>Autor</Table.Th>
              <Table.Th>Ano</Table.Th>
              <Table.Th>ISBN</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {livrosFiltrados.map((livro) => (
              <Table.Tr key={livro.id}>
                <Table.Td>{livro.titulo}</Table.Td>
                <Table.Td>{livro.autor.nome}</Table.Td>
                <Table.Td>{livro.ano}</Table.Td>
                <Table.Td>{livro.isbn}</Table.Td>
                <Table.Td>
                  <Group gap="xs" justify="flex-end" wrap="nowrap">
                    <Button size="xs" variant="light" onClick={() => abrirModal(livro)}>Editar</Button>
                    <Button size="xs" variant="light" color="red" onClick={() => remover(livro)}>Remover</Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>

      <Modal opened={emEdicao !== null} onClose={() => setEmEdicao(null)}
        title={emEdicao === "novo" ? "Novo livro" : "Editar livro"}>
        <form onSubmit={(e) => { e.preventDefault(); salvar(); }}>
          <Stack>
            {erro && <Alert color="red">{erro}</Alert>}
            <TextInput label="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} error={erros.titulo} />
            <TextInput label="ISBN" placeholder="13 números" value={isbn}
              onChange={(e) => setIsbn(e.target.value)} error={erros.isbn} />
            <TextInput label="Ano" value={ano} onChange={(e) => setAno(e.target.value)} error={erros.ano} />
            <NativeSelect
              label="Autor"
              value={autorId}
              onChange={(e) => setAutorId(e.target.value)}
              error={erros.autorId}
              data={[
                { label: "Selecione o autor", value: "" },
                ...autores.map((autor) => ({ label: autor.nome, value: String(autor.id) })),
              ]}
            />
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
