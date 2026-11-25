import { useEffect, useState } from "react";
import { Alert, Button, Group, Modal, Paper, Stack, Table, TextInput, Title } from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { autorSchema, type Autor } from "@biblioteca/shared/autor";
import { criarAutor, editarAutor, listarAutores, removerAutor } from "../services/api.ts";
import { errosDaApi, errosDoZod, type ErrosDosCampos } from "../services/erros.ts";

export function AutoresPage() {
  const [autores, setAutores] = useState<Autor[]>([]);
  const [busca, setBusca] = useState("");
  const [erroDaLista, setErroDaLista] = useState("");

  const [emEdicao, setEmEdicao] = useState<Autor | "novo" | null>(null);
  const [nome, setNome] = useState("");
  const [nacionalidade, setNacionalidade] = useState("");
  const [erro, setErro] = useState("");
  const [erros, setErros] = useState<ErrosDosCampos>({});

  async function carregar() {
    try {
      setAutores(await listarAutores());
    } catch (e) {
      setErroDaLista(errosDaApi(e).mensagem);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function abrirModal(autor: Autor | "novo") {
    setEmEdicao(autor);
    setNome(autor === "novo" ? "" : autor.nome);
    setNacionalidade(autor === "novo" ? "" : autor.nacionalidade);
    setErro("");
    setErros({});
  }

  async function salvar() {
    setErro("");
    setErros({});

    const validacao = autorSchema.safeParse({ nome, nacionalidade });
    if (!validacao.success) {
      setErros(errosDoZod(validacao.error));
      return;
    }

    try {
      if (emEdicao === "novo") await criarAutor(validacao.data);
      else if (emEdicao) await editarAutor(emEdicao.id, validacao.data);
      setEmEdicao(null);
      carregar();
    } catch (e) {
      const { mensagem, campos } = errosDaApi(e);
      setErro(mensagem);
      setErros(campos);
    }
  }

  async function remover(autor: Autor) {
    if (!window.confirm(`Remover o autor "${autor.nome}"? Os livros dele também serão removidos.`)) return;
    try {
      await removerAutor(autor.id);
      carregar();
    } catch (e) {
      setErroDaLista(errosDaApi(e).mensagem);
    }
  }

  const autoresFiltrados = autores.filter((autor) =>
    autor.nome.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <>
      <Group justify="space-between" mb="lg">
        <Title order={1}>Autores</Title>
        <Button leftSection={<IconPlus size={18} />} onClick={() => abrirModal("novo")}>Novo autor</Button>
      </Group>

      {erroDaLista && <Alert color="red" mb="md">{erroDaLista}</Alert>}

      <TextInput placeholder="Buscar por nome" leftSection={<IconSearch size={18} />} mb="md"
        value={busca} onChange={(e) => setBusca(e.target.value)} />

      <Paper withBorder>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nome</Table.Th>
              <Table.Th>Nacionalidade</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {autoresFiltrados.map((autor) => (
              <Table.Tr key={autor.id}>
                <Table.Td>{autor.nome}</Table.Td>
                <Table.Td>{autor.nacionalidade}</Table.Td>
                <Table.Td>
                  <Group gap="xs" justify="flex-end">
                    <Button size="xs" variant="light" onClick={() => abrirModal(autor)}>Editar</Button>
                    <Button size="xs" variant="light" color="red" onClick={() => remover(autor)}>Remover</Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>

      <Modal opened={emEdicao !== null} onClose={() => setEmEdicao(null)}
        title={emEdicao === "novo" ? "Novo autor" : "Editar autor"}>
        <form onSubmit={(e) => { e.preventDefault(); salvar(); }}>
          <Stack>
            {erro && <Alert color="red">{erro}</Alert>}
            <TextInput label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} error={erros.nome} />
            <TextInput label="Nacionalidade" value={nacionalidade}
              onChange={(e) => setNacionalidade(e.target.value)} error={erros.nacionalidade} />
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
