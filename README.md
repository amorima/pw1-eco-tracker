# b.green 🌱 Eco Tracker

<p align="center">
  <img src="https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D" alt="Vue.js" />
  <img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/pinia-%23ffd859.svg?style=for-the-badge&logo=pinia&logoColor=black" alt="Pinia" />
</p>

> **Tracking sustentável para famílias modernas.**

Este projeto foi desenvolvido no âmbito da Unidade Curricular de **Programação Web I** da Licenciatura em **Tecnologias e Sistemas de Informação para a Web**.

---

## 🏫 Contexto Académico

**Instituição:**  
ESCOLA SUPERIOR DE MEDIA ARTES E DESIGN (ESMAD)  
POLITÉCNICO DO PORTO

**Docentes:**  
👨‍🏫 Prof. Ricardo Queirós  
👨‍🏫 Prof. Paulo Graça

**Equipa de Projeto:**

- **40240119** - António Manuel Cruz Barreto Amorim (Gestor de Projeto)
- **40240137** - Gabriel de Sousa Paiva
- **40230432** - Emanuel José Fernandes Gomes

---

## 💡 Sobre o Projeto

O **b.green** é uma aplicação web desenhada para ajudar agregados familiares a monitorizar e reduzir a sua pegada ecológica. Identificámos que muitas famílias querem ser mais sustentáveis, mas falta-lhes uma ferramenta que centralize consumos, tarefas e, acima de tudo, motivação.

A nossa solução combina **monitorização de energia** com **gamificação**. As famílias podem registar os seus eletrodomésticos, completar tarefas diárias (como reciclar ou poupar água) e competir de forma saudável através de um sistema de pontos, níveis e recompensas.

### Funcionalidades Principais

- **🏠 Gestão Familiar:** Uma conta única gere todo o agregado, com suporte para múltiplos perfis (Admin e Utilizadores Standard).
- **⚡ Monitorização de Consumos:** Registo de eletrodomésticos e cálculo automático de gastos energéticos e emissões de CO2.
- **✅ Tarefas & Gamificação:** Catálogo de atividades sustentáveis que geram XP e Pontos. Sistema de níveis, _streaks_ e _badges_.
- **🏆 Leaderboards & Recompensas:** Rankings familiares e troca de pontos por prémios reais definidos pela família (ex: "Escolher o filme de sábado").
- **🤖 Chatbot Inteligente:** Assistente virtual integrado (via API iaedu) para tirar dúvidas sobre sustentabilidade e sobre a app.
- **📊 Dashboard Administrativo:** Área exclusiva para o gestor da família configurar a casa, aprovar recompensas e ver estatísticas globais.

---

## 🛠️ Stack Tecnológica

Este projeto foi construído com uma arquitetura moderna baseada em componentes, focada na performance e na experiência de utilizador.

### Core

- **Vue.js 3:** A framework leciona em PW1 pela sua reatividade e ecossistema robusto.
- **Vite:** Build tool para um ambiente de desenvolvimento extremamente rápido.
- **Pinia:** Para a gestão de estado global (User Store, Tasks Store, etc.).
- **Vue Router 4:** Gestão de rotas e navegação, incluindo _Navigation Guards_ para proteger áreas de administração.

### UI & Estilo

- **Tailwind CSS:** Utility-first CSS para estilização rápida e responsiva.
- **Material Symbols:** Iconografia consistente da Google.
- **FontAwesome:** Iconografia complementar.
- **ApexCharts (vue3-apexcharts):** Para visualização de dados e gráficos de consumo.
- **Vuedraggable:** Para funcionalidades de _drag-and-drop_ no dashboard.

### Backend & Dados

- **JSON Server:** Simulação de uma REST API completa para desenvolvimento local (`db.json`).
- **LocalStorage:** Persistência de configurações de estado da UI.
- **b.green API (Custom):** API auxiliar desenvolvida por nós para lógica de negócio específica e futura integração real.
  - Repositório: https://github.com/amorima/b.green_api/

### Integrações Externas

- **IAEDU API:** Motor de inteligência artificial para o nosso Chatbot.
- **Unsplash Source:** Geração dinâmica de imagens para tarefas e recompensas.
- **Cloudinary:** Upload e gestão de imagens personalizadas pelos utilizadores.

---

## 🚀 Como Correr o Projeto

### Pré-requisitos

- Node.js (v18 ou superior recomendado)
- NPM

### Instalação

1.  **Clonar o repositório:**

    ```bash
    git clone https://github.com/seu-user/pw1-eco-tracker.git
    cd pw1-eco-tracker
    ```

2.  **Instalar dependências:**

    ```bash
    npm install
    ```

3.  **Configurar Variáveis de Ambiente:**
    Cria um ficheiro `.env` na raiz do projeto com as chaves necessárias (ex: Cloudinary, Chatbot):

    ```env
    VITE_CHATBOT_API_KEY=tua_chave_aqui
    VITE_CLOUDINARY_UPLOAD_PRESET=teu_preset
    VITE_CLOUDINARY_CLOUD_NAME=teu_cloud_name
    VITE_CARBON_API_KEY=tua_chave_aqui
    ```

4.  **Arrancar o Projeto:**
    Para iniciar o backend e o frontend simultaneamente com um único comando:
    ```bash
    npm run dev:all
    ```
    _(Alternativamente, podes correr `npm run server` e `npm run dev` em terminais separados)_

A aplicação ficará disponível em `http://localhost:5173`.

---

## 🧪 Testes e Qualidade

Para garantir a estabilidade e a qualidade do código deste projeto, utilizamos ferramentas de análise estática e testes unitários.

### Linting (ESLint)
Para verificar a conformidade do código com as regras de estilo definidas e detetar potenciais erros:
```bash
npm run lint
```

### Testes Unitários
Para executar a suite de testes unitários dos componentes e stores:
```bash
npm run test
```

---

## 📂 Estrutura do Projeto

Tentámos manter uma estrutura organizada e modular. Para visualizar a árvore de componentes e dependências, recomendamos o uso da extensão **Vue.js devtools** no browser.

```text
src/
├── assets/          # Imagens estáticas e estilos globais
├── components/      # Componentes reutilizáveis (Buttons, Cards, Modals)
│   ├── ChatBot.vue  # Lógica do assistente virtual
│   └── ...
├── data/            # Dados estáticos e mocks iniciais
├── router/          # Configuração de rotas e guards
├── services/        # Lógica de comunicação com APIs (ImageService, Cloudinary)
├── stores/          # Stores do Pinia (Lógica de negócio centralizada)
├── views/           # Páginas principais da aplicação
│   ├── AdminDashboardView.vue
│   ├── QuickStartView.vue
│   └── ...
└── App.vue          # Componente raiz
```

### Visualização da Estrutura (Addons Recomendados)

Para uma análise profunda da arquitetura do projeto, sugerimos as seguintes ferramentas que usámos durante o desenvolvimento:

1.  **Vue DevTools:** Essencial para ver a hierarquia de componentes e o estado do Pinia em tempo real.
2.  **Vite Bundle Visualizer:** Para analisar o tamanho dos _chunks_ e dependências.
    - Comando: `npx vite-bundle-visualizer`

---

## 🧠 Decisões de Design e Desafios

### 1. O "Quick Start" Wizard

Um dos maiores desafios foi criar um fluxo de entrada que não fosse aborrecido. Criámos o `QuickStartView.vue` para que, logo após o registo, o utilizador configure toda a "casa" (perfis, eletrodomésticos base, tarefas) em 4 passos simples. Isto garante que, ao chegar à _Home_, a app já tem dados relevantes.

### 2. Gestão de Estado com Pinia

Optámos pelo Pinia em vez de _props drilling_ excessivo. Como temos dados partilhados entre o Dashboard, o Perfil e o Chatbot (como o nível do utilizador ou os pontos), centralizar tudo na `userStore` facilitou imenso a reatividade da aplicação.

### 3. Sistema de Imagens Híbrido

Para evitar que a app parecesse "vazia", implementámos o `imageService.js`. Se o utilizador não carregar uma foto, o sistema vai buscar automaticamente um icon ao FontAwesome baseada na categoria da tarefa/aparelho.

---

## 🔮 Próximos Passos (Roadmap)

Se tivéssemos mais tempo ou para uma versão 2.0, gostaríamos de implementar:

- **Integração IoT:** Ler consumos reais de tomadas inteligentes em vez de inserção manual.
- **UI:** Melhorar alguns aspetos de UX/UI.

---

Feito com 💚 e muito código por António, Gabriel e Emanuel.

```

```
