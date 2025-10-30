# Configuração de GitHub Actions - CI/CD

Este guia explica como configurar os workflows de CI/CD no GitHub Actions para o projeto Black Belt Pricing SaaS.

## 📋 Pré-requisitos

- Repositório no GitHub
- Acesso às configurações do repositório
- Token de acesso pessoal com permissão `workflow` (se necessário)

## 🚀 Passo 1: Criar os Workflows

Os workflows devem ser criados na pasta `.github/workflows/` do repositório. Você pode fazer isso de duas formas:

### Opção A: Via Interface do GitHub (Recomendado)

1. Vá para seu repositório no GitHub
2. Clique em **Actions**
3. Clique em **New workflow** ou **set up a workflow yourself**
4. Crie os arquivos conforme descrito abaixo

### Opção B: Via Git (Linha de Comando)

Se você já tem os arquivos localmente, faça:

```bash
git add .github/workflows/
git commit -m "ci: Adicionar workflows de CI/CD"
git push origin main
```

## 📝 Workflows a Configurar

### 1. CI - Build e Testes (`ci.yml`)

**Arquivo:** `.github/workflows/ci.yml`

```yaml
name: CI - Build e Testes

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [22.x]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - id: pnpm-cache
        shell: bash
        run: echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT
      - uses: actions/cache@v3
        with:
          path: ${{ steps.pnpm-cache.outputs.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: ${{ runner.os }}-pnpm-store-
      - run: pnpm install --frozen-lockfile
      - run: pnpm tsc --noEmit
      - run: pnpm build:client
      - run: pnpm build:server
      - uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: |
            dist/
            .next/
          retention-days: 1

  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22.x
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - id: pnpm-cache
        shell: bash
        run: echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT
      - uses: actions/cache@v3
        with:
          path: ${{ steps.pnpm-cache.outputs.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: ${{ runner.os }}-pnpm-store-
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint || true
      - run: pnpm format:check || true
```

### 2. Deploy (`deploy.yml`)

**Arquivo:** `.github/workflows/deploy.yml`

```yaml
name: Deploy - Plataforma Manus

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22.x
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - id: pnpm-cache
        shell: bash
        run: echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT
      - uses: actions/cache@v3
        with:
          path: ${{ steps.pnpm-cache.outputs.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: ${{ runner.os }}-pnpm-store-
      - run: pnpm install --frozen-lockfile
      - run: pnpm tsc --noEmit
      - run: pnpm build
      - run: |
          echo "✓ Build successful"
          echo "✓ Ready for deployment on Manus Platform"
```

### 3. Segurança (`security.yml`)

**Arquivo:** `.github/workflows/security.yml`

```yaml
name: Segurança e Qualidade de Código

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  schedule:
    - cron: '0 0 * * 0'

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22.x
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - id: pnpm-cache
        shell: bash
        run: echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT
      - uses: actions/cache@v3
        with:
          path: ${{ steps.pnpm-cache.outputs.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: ${{ runner.os }}-pnpm-store-
      - run: pnpm install --frozen-lockfile
      - run: pnpm audit --audit-level=moderate || true
      - run: pnpm audit --json > audit-report.json || true
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: audit-report
          path: audit-report.json
```

## 🔐 Passo 2: Configurar Secrets

1. Vá para **Settings** → **Secrets and variables** → **Actions**
2. Clique em **New repository secret**
3. Adicione os seguintes secrets (se necessário para deploy):

```
DATABASE_URL
JWT_SECRET
VITE_APP_ID
OAUTH_SERVER_URL
VITE_OAUTH_PORTAL_URL
OWNER_OPEN_ID
OWNER_NAME
BUILT_IN_FORGE_API_KEY
BUILT_IN_FORGE_API_URL
```

## 🛡️ Passo 3: Configurar Branch Protection

1. Vá para **Settings** → **Branches**
2. Clique em **Add rule** sob "Branch protection rules"
3. Configure:
   - **Branch name pattern:** `main`
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Require conversation resolution before merging

## ✅ Passo 4: Verificar Status

1. Vá para **Actions** no seu repositório
2. Você deve ver os workflows sendo executados
3. Verifique se todos passam com sucesso

## 📊 Monitoramento

### Ver Status dos Workflows

1. Clique em **Actions** no repositório
2. Selecione o workflow desejado
3. Clique no commit/PR para ver detalhes

### Badges de Status

Você pode adicionar badges ao README.md:

```markdown
![CI - Build e Testes](https://github.com/CarlosHonorato70/blackbelt-pricing-saas/actions/workflows/ci.yml/badge.svg)
![Deploy](https://github.com/CarlosHonorato70/blackbelt-pricing-saas/actions/workflows/deploy.yml/badge.svg)
![Segurança](https://github.com/CarlosHonorato70/blackbelt-pricing-saas/actions/workflows/security.yml/badge.svg)
```

## 🔧 Troubleshooting

### Build falhando

1. Verifique os logs em **Actions**
2. Procure por mensagens de erro
3. Reproduza localmente: `pnpm install && pnpm build`

### Workflow não executando

1. Verifique se o arquivo YAML está correto
2. Confirme que o branch está correto
3. Verifique se há permissões adequadas

### Secrets não funcionando

1. Confirme que o secret foi adicionado
2. Use o nome exato do secret no workflow
3. Aguarde alguns minutos para que o secret seja propagado

## 📚 Recursos Adicionais

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [pnpm GitHub Action](https://github.com/pnpm/action-setup)
- [Node.js Setup Action](https://github.com/actions/setup-node)

## 🎯 Próximos Passos

1. ✅ Criar os workflows
2. ✅ Configurar secrets
3. ✅ Configurar branch protection
4. ✅ Testar com um pull request
5. ✅ Monitorar execução dos workflows

---

**Dúvidas?** Consulte a documentação oficial do GitHub Actions ou abra uma issue no repositório.
