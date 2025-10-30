# Configuração de Proteção de Branch

Este documento descreve as regras recomendadas para proteção da branch `main`.

## Passos para Configurar

1. Vá para **Settings** → **Branches**
2. Clique em **Add rule** sob "Branch protection rules"
3. Configure os seguintes parâmetros:

### Branch name pattern
```
main
```

### Require a pull request before merging
- ✅ Require pull request reviews before merging
  - Required number of reviews: **1**
  - ✅ Dismiss stale pull request approvals when new commits are pushed
  - ✅ Require review from code owners

### Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Require status checks to pass before merging
  - Selecione os seguintes checks:
    - `CI - Build e Testes / build`
    - `CI - Build e Testes / lint`
    - `Segurança e Qualidade de Código / security`
    - `Segurança e Qualidade de Código / code-quality`

### Require conversation resolution before merging
- ✅ Require all conversations on code to be resolved before merging

### Require signed commits
- ✅ Require commits to be signed

### Include administrators
- ✅ Include administrators (Aplicar as mesmas regras aos administradores)

### Restrict who can push to matching branches
- Deixar vazio (permitir push apenas via pull requests)

## Resultado

Com essas configurações:
- ✅ Toda mudança na `main` passa por pull request
- ✅ Testes e linting devem passar
- ✅ Análise de segurança é executada
- ✅ Revisão de código é obrigatória
- ✅ Commits devem ser assinados
- ✅ Conversas devem ser resolvidas

## Workflow Recomendado

1. Criar uma branch de feature: `git checkout -b feature/nome-da-feature`
2. Fazer commits e push
3. Abrir um Pull Request
4. Aguardar CI/CD passar
5. Solicitar revisão de código
6. Após aprovação, fazer merge
7. Branch será automaticamente deletada

## CI/CD Workflows

### CI (Continuous Integration)
- **Trigger:** Push em `main` ou `develop`, Pull Requests
- **Ações:**
  - Build da aplicação
  - Testes TypeScript
  - Linting
  - Análise de código

### Deploy
- **Trigger:** Push em `main`
- **Ações:**
  - Build completo
  - Validação
  - Notificação de deploy pronto

### Segurança
- **Trigger:** Push em `main`/`develop`, Pull Requests, Semanal
- **Ações:**
  - Audit de dependências
  - Verificação de vulnerabilidades
  - Análise de qualidade de código

## Variáveis de Ambiente (Secrets)

Para configurar secrets no GitHub:

1. Vá para **Settings** → **Secrets and variables** → **Actions**
2. Clique em **New repository secret**
3. Adicione os seguintes secrets:

```
DATABASE_URL=mysql://...
JWT_SECRET=...
VITE_APP_ID=...
OAUTH_SERVER_URL=...
VITE_OAUTH_PORTAL_URL=...
OWNER_OPEN_ID=...
OWNER_NAME=...
BUILT_IN_FORGE_API_KEY=...
BUILT_IN_FORGE_API_URL=...
```

## Monitoramento

- Verificar o status dos workflows em **Actions**
- Revisar relatórios de segurança em **Security** → **Dependabot alerts**
- Analisar code scanning em **Security** → **Code scanning**

## Troubleshooting

### Build falhando
1. Verificar logs em **Actions** → **CI - Build e Testes**
2. Reproduzir localmente: `pnpm install && pnpm build`
3. Verificar se há conflitos de dependências

### Deploy não funcionando
1. Verificar logs do workflow **Deploy**
2. Confirmar que todos os secrets estão configurados
3. Verificar permissões de push

### Testes falhando
1. Executar localmente: `pnpm test`
2. Verificar se há mudanças não commitadas
3. Atualizar snapshots se necessário: `pnpm test -- -u`
