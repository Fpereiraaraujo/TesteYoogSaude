Compreendido. Aqui está o conteúdo estruturado em formato de texto simples (.txt) para o seu README principal. Você pode copiar este bloco, colar em um arquivo de texto e salvar como README.txt na raiz do seu projeto.

SISTEMA YOOGSAUDE - GERENCIAMENTO DE ATENDIMENTO
ESTRUTURA DO PROJETO
Este ecossistema foi desenvolvido com uma arquitetura desacoplada em duas frentes principais:

[./mini-crm-backend]

API REST desenvolvida em Node.js e TypeScript.

Responsável pela persistência e máquina de estados dos atendimentos.

Validação de contratos de dados via Zod.

[./mini-crm-frontend]

Interface SPA (Single Page Application) em React 18 e Vite.

Focada em alta performance, acessibilidade e design responsivo (Tailwind CSS).

Cobertura de testes unitários e integração com Vitest.

ESPECIFICACOES TECNICAS SENIOR
CONSISTENCIA DE DADOS (CASE SENSITIVITY)
O sistema utiliza um contrato rigoroso de estados em MAIUSCULO (WAITING, IN_PROGRESS, FINISHED).
Isso garante a integridade entre o Banco de Dados, as regras de negocio do Backend e a
renderizacao de componentes no Frontend.

ACESSIBILIDADE E TESTABILIDADE
Todos os componentes de formulario utilizam relacoes explicitas de ID e htmlFor.
Botoes de acao possuem aria-labels para permitir que leitores de tela e a suite
de testes (React Testing Library) identifiquem as funcoes de exclusao e edicao.

PROGRAMACAO DEFENSIVA
Componentes de UI, como o StatusBadge, implementam logica de "fallback". Caso a API
retorne um valor inesperado, o sistema nao sofre "crash", exibindo um estado
padrao de seguranca.

COMO EXECUTAR O PROJETO (PASSO A PASSO)
REQUISITOS:

Node.js instalado.

Gerenciador de pacotes npm ou yarn.

BACKEND:

Navegue ate a pasta /mini-crm-backend.

Execute: npm install

Execute: npm run dev

FRONTEND:

Navegue ate a pasta /mini-crm-frontend.

Execute: npm install

Execute: npm run dev

TESTES:

Dentro da pasta /mini-crm-frontend.

Execute: npm test

FLUXO DE ESTADOS (BUSINESS LOGIC)
O fluxo de atendimento obedece a seguinte sequencia:

WAITING (Aguardando) -> Disponibiliza acao "ATENDER".

IN_PROGRESS (Em Aberto) -> Disponibiliza acao "FINALIZAR".

FINISHED (Finalizado) -> Status de leitura: "Atendido".
