import { useState } from "react";
import { Alert, Anchor, Box, Button, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { loginSchema } from "@biblioteca/shared/usuario";
import { login } from "../services/api.ts";
import { errosDaApi, errosDoZod, type ErrosDosCampos } from "../services/erros.ts";

type Props = {
  onIrParaCadastro: () => void;
  onEntrar: (nome: string) => void;
};

export function LoginPage({ onEntrar, onIrParaCadastro }: Props) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [erros, setErros] = useState<ErrosDosCampos>({});
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    setErro("");
    setErros({});

    const validacao = loginSchema.safeParse({ email, senha });
    if (!validacao.success) {
      setErros(errosDoZod(validacao.error));
      return;
    }

    setCarregando(true);
    try {
      const usuario = await login(validacao.data);
      onEntrar(usuario.nome);
    } catch (e) {
      const { mensagem, campos } = errosDaApi(e);
      setErro(mensagem);
      setErros(campos);
    }
    setCarregando(false);
  }

  return (
    <Box>
      <Title order={4}>Entrar</Title>
      <Text c="dimmed" mb="xl">Acesse com seu e-mail e senha</Text>

      <form onSubmit={(evento) => { evento.preventDefault(); entrar(); }}>
        <Stack>
          {erro && <Alert color="red">{erro}</Alert>}
          <TextInput label="E-mail" placeholder="voce@email.com" value={email}
            onChange={(evento) => setEmail(evento.target.value)} error={erros.email} />
          <PasswordInput label="Senha" placeholder="Sua senha" value={senha}
            onChange={(evento) => setSenha(evento.target.value)} error={erros.senha} />
          <Button type="submit" loading={carregando}>Entrar</Button>
          <Text size="sm" ta="center">
            Ainda não tem conta?{" "}
            <Anchor component="button" type="button" onClick={onIrParaCadastro}>Cadastre-se</Anchor>
          </Text>
        </Stack>
      </form>
    </Box>
  );
}
