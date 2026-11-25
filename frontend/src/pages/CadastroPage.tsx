import { useState } from "react";
import { Alert, Anchor, Box, Button, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { cadastroUsuarioSchema } from "@biblioteca/shared/usuario";
import { cadastrarUsuario } from "../services/api.ts";
import { errosDaApi, errosDoZod, type ErrosDosCampos } from "../services/erros.ts";

type Props = { onVoltarParaLogin: () => void };

export function CadastroPage({ onVoltarParaLogin }: Props) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [erros, setErros] = useState<ErrosDosCampos>({});
  const [carregando, setCarregando] = useState(false);

  async function cadastrar() {
    setErro("");
    setSucesso("");
    setErros({});

    const validacao = cadastroUsuarioSchema.safeParse({ nome, email, senha });
    if (!validacao.success) {
      setErros(errosDoZod(validacao.error));
      return;
    }

    setCarregando(true);
    try {
      await cadastrarUsuario(validacao.data);
      setSucesso("Conta criada! Agora é só entrar.");
      setNome("");
      setEmail("");
      setSenha("");
    } catch (e) {
      const { mensagem, campos } = errosDaApi(e);
      setErro(mensagem);
      setErros(campos);
    }
    setCarregando(false);
  }

  return (
    <Box>
      <Title order={4}>Criar conta</Title>
      <Text c="dimmed" mb="xl">Preencha seus dados para acessar o sistema</Text>

      <form onSubmit={(evento) => { evento.preventDefault(); cadastrar(); }}>
        <Stack>
          {erro && <Alert color="red">{erro}</Alert>}
          {sucesso && <Alert color="green">{sucesso}</Alert>}
          <TextInput label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} error={erros.nome} />
          <TextInput label="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} error={erros.email} />
          <PasswordInput label="Senha" description="Mínimo de 8 caracteres" value={senha}
            onChange={(e) => setSenha(e.target.value)} error={erros.senha} />
          <Button type="submit" loading={carregando}>Cadastrar</Button>
          <Text size="sm" ta="center">
            Já tem conta?{" "}
            <Anchor component="button" type="button" onClick={onVoltarParaLogin}>Entrar</Anchor>
          </Text>
        </Stack>
      </form>
    </Box>
  );
}
