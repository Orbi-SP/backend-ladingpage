# backend-ladingpage
Código que Backend contendo os códigos de cadastro de usuário e login

## Autenticação das rotas de runs

O `POST /auth` retorna um JWT válido por uma hora:

```json
{
  "token": "eyJ...",
  "profile": { "id": "uuid", "username": "jogador", "email": "..." }
}
```

Configure `JWT_SECRET` como variável de ambiente da Lambda. Em cada chamada para
`/runs`, envie o token no header:

```http
Authorization: Bearer eyJ...
```

O middleware protege `POST /runs`, `GET /runs/ranking` e
`GET /runs/user/:userId`. Para criar uma run, o `user_id` do corpo é ignorado e
substituído pelo usuário autenticado no token.
