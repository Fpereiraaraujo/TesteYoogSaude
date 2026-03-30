================================================================================
YOOGSAUDE - SISTEMA INTEGRADO DE GESTAO DE ATENDIMENTO
VISAO GERAL

O YoogSaude e uma plataforma Full-Stack projetada para a modernizacao do fluxo
de atendimento hospitalar. O sistema gerencia o ciclo de vida completo de um
paciente na fila de espera, desde o registro inicial ate a finalizacao do
procedimento, garantindo integridade de dados e alta performance.

ARQUITETURA DO PROJETO (ESTRUTURA DE PASTAS)

O ecossistema e dividido em dois modulos independentes:

/mini-crm-backend  -> Servidor de API REST e Regras de Negocio.
/mini-crm-frontend -> Interface do Usuario (SPA) e Logica de Apresentacao.

STACK TECNOLOGICA (ESPECIFICACOES SENIOR)

BACKEND:

Node.js & TypeScript (Seguranca de tipos no lado do servidor).

Zod (Validacao de contratos de dados e esquemas de entrada/saida).

Arquitetura baseada em Controller/Service para separacao de responsabilidades.

FRONTEND:

React 18 & Vite (Tooling de alta performance).

Tailwind CSS & Shadcn/UI (Design System focado em acessibilidade/a11y).

React Hook Form (Gestao performatica de estados de formulario).

Vitest & React Testing Library (QA via testes unitarios e de integracao).

DECISOES TECNICAS E BOAS PRATICAS

NORMALIZACAO DE ESTADOS (CASE SENSITIVE):
O sistema utiliza um contrato estrito de strings em MAIUSCULO para os status
de atendimento (WAITING, IN_PROGRESS, FINISHED). Isso evita conflitos entre
o Backend (Zod/Banco de Dados) e o Frontend (StatusBadge/Actions).

PROGRAMACAO DEFENSIVA:
Os componentes de UI possuem logica de "fallback". O StatusBadge, por exemplo,
e capaz de processar estados inesperados sem interromper a execucao da
aplicacao, garantindo um ambiente "crash-free".

ACESSIBILIDADE (a11y):
Todos os controles de formulario e botoes possuem atributos ARIA (aria-label)
e IDs vinculados, garantindo que o sistema seja operavel por tecnologias
assistivas e facilmente identificado por scripts de automacao de testes.

COMO EXECUTAR O ECOSSISTEMA

A) BACKEND:

Acesse a pasta: cd mini-crm-backend

Instale: npm install

Inicie: npm run dev

B) FRONTEND:

Acesse a pasta: cd mini-crm-frontend

Instale: npm install

Inicie: npm run dev

C) TESTES:

Na pasta do frontend, execute: npm test

FLUXO DE ATENDIMENTO (BUSINESS LOGIC)

AGUARDANDO (WAITING): O paciente esta na fila. Acao disponivel: "ATENDER".

EM ABERTO (IN_PROGRESS): O paciente esta em consulta. Acao: "FINALIZAR".

FINALIZADO (FINISHED): O ciclo esta concluido. Status: "Atendido".

SOBRE O AUTOR
