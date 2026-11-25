# Biblioteca

Vídeo: LINK_DO_VIDEO

## Integrante

| Nome | RGM | O que fez |
|---|---|---|
| Luís Gabriel Werlang Veríssimo Leite | 42584973 | Projeto todo (banco, API, frontend e vídeo) |

## Tema

Sistema de biblioteca: cadastro de autores, livros, leitores e empréstimos.

Tabelas:

- autores: nome, nacionalidade
- livros: título, isbn (único), ano, autorId → autores
- leitores: nome, email (único), telefone
- emprestimos: data do empréstimo, data de devolução, livroId → livros, leitorId → leitores
- usuarios: nome, email (único), senha. Usada só para o login.

## Como rodar

Precisa do Node e do Docker.

1. Instalar as dependências:
   ```
   npm install
   ```
2. Subir o banco:
   ```
   docker compose up -d
   ```
3. Criar o arquivo `api/.env` copiando o `api/.env.example`.
4. Rodar as migrations e o seed:
   ```
   cd api
   npx prisma migrate dev
   npx prisma db seed
   cd ..
   ```
5. Subir a API (http://localhost:3000, Swagger em http://localhost:3000/docs):
   ```
   npm run dev -w api
   ```
6. Em outro terminal, subir o frontend (http://localhost:5173):
   ```
   npm run dev -w frontend
   ```

## Login

- Email: professor@biblioteca.com
- Senha: senha1234
