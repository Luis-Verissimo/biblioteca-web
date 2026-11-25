import { useState } from "react";
import { TelaDeEntrada } from "./components/TelaDeEntrada.tsx";
import { MenuLateral, type Pagina } from "./components/MenuLateral.tsx";
import { LoginPage } from "./pages/LoginPage.tsx";
import { CadastroPage } from "./pages/CadastroPage.tsx";
import { HomePage } from "./pages/HomePage.tsx";
import { AutoresPage } from "./pages/AutoresPage.tsx";
import { LivrosPage } from "./pages/LivrosPage.tsx";
import { LeitoresPage } from "./pages/LeitoresPage.tsx";
import { EmprestimosPage } from "./pages/EmprestimosPage.tsx";

function App() {
  const [nome, setNome] = useState<string | null>(null);
  const [telaDeEntrada, setTelaDeEntrada] = useState<"login" | "cadastro">("login");
  const [pagina, setPagina] = useState<Pagina>("home");

  if (nome === null) {
    return (
      <TelaDeEntrada>
        {telaDeEntrada === "login" ? (
          <LoginPage
            onIrParaCadastro={() => setTelaDeEntrada("cadastro")}
            onEntrar={(nomeDoUsuario) => {
              setNome(nomeDoUsuario);
              setPagina("home");
            }}
          />
        ) : (
          <CadastroPage onVoltarParaLogin={() => setTelaDeEntrada("login")} />
        )}
      </TelaDeEntrada>
    );
  }

  return (
    <MenuLateral nome={nome} paginaAtual={pagina} onNavegar={setPagina} onSair={() => setNome(null)}>
      {pagina === "home" && <HomePage nome={nome} onNavegar={setPagina} />}
      {pagina === "autores" && <AutoresPage />}
      {pagina === "livros" && <LivrosPage />}
      {pagina === "leitores" && <LeitoresPage />}
      {pagina === "emprestimos" && <EmprestimosPage />}
    </MenuLateral>
  );
}

export default App;
