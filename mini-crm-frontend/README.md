======================================================================
YOOG SAÚDE - MINI CRM (MONOREPO)
DESAFIO TÉCNICO NÍVEL SÊNIOR
======================================================================

Este projeto consiste em um ecossistema completo (Back e Front) para 
gestão de triagem hospitalar, focado em alta coesão, baixo acoplamento 
e experiência de usuário premium.

======================================================================
ESTRUTURA DO PROJETO
======================================================================
/mini-crm-backend  -> API Node.js com Clean Architecture (Hexagonal)
/mini-crm-frontend -> Dashboard React com shadcn/ui e TanStack Query

======================================================================
DESTAQUES TÉCNICOS (SENIORIDADE)
======================================================================

BACKEND:
- Arquitetura Hexagonal (Ports & Adapters): Domínio 100% isolado.
- Domínio Rico: Regras de negócio protegidas dentro da entidade.
- Testes Unitários: Uso de In-Memory Repositories (sem dependência de DB).
- Testes de Integração: Fluxo completo validado com Supertest.
- Paginação Nativa: Proteção de memória e performance no banco.

FRONTEND:
- State Management: TanStack Query (React Query) para cache e sync.
- Design System: shadcn/ui (Radix UI + Tailwind) para acessibilidade.
- Componentização: Divisão clara entre Presentation e Container components.
- UX: Feedback via Toasts assíncronos e estados de Skeleton/Loading.
- Type Safety: TypeScript compartilhado entre camadas de API e UI.

======================================================================
COMO EXECUTAR
======================================================================

1. REQUISITOS:
   - Docker e Node.js v18+ instalados.

2. BACKEND:
   - Entre em /mini-crm-backend
   - Rode: docker compose up -d
   - Rode: npx prisma migrate dev
   - Rode: npm run dev
   - Docs: http://localhost:3333/docs (Swagger)

3. FRONTEND:
   - Entre em /mini-crm-frontend
   - Rode: npm install
   - Rode: npm run dev
   - URL: http://localhost:5173

4. TESTES:
   - Em /mini-crm-backend, rode: npm run test

======================================================================
TRADE-OFFS E DECISÕES
======================================================================
- Optei pelo shadcn/ui pela facilidade de customização sem o overhead 
  de bibliotecas de componentes tradicionais.
- A mutação de criação de atendimento no frontend orquestra duas 
  chamadas (Paciente + Atendimento) para garantir fluidez na UX, 
  embora em um sistema maior isso pudesse ser um endpoint único (BFF).
- O backend utiliza tratamento de erro global para garantir que 
  mensagens de validação do Zod cheguem limpas ao frontend.
======================================================================