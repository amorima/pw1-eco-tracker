/**
 * Base de Conhecimento do Projeto B.green
 * Documento de referência completo para o assistente virtual (chatbot)
 *
 * Este ficheiro contém toda a informação estruturada sobre o projeto,
 * funcionalidades, regras de negócio e terminologia do domínio.
 */

export const projectInfo = {
  // ========================================
  // 1. IDENTIFICAÇÃO DO PROJETO
  // ========================================
  project: {
    name: 'B.green Eco Tracker',
    tagline: 'Tracking sustentável para famílias',
    version: '1.0.0',
    description:
      'Aplicação web de monitorização e gamificação de hábitos sustentáveis para agregados familiares. Permite registar consumos energéticos, completar tarefas ecológicas e competir num ranking familiar enquanto se reduz a pegada de carbono doméstica.',
    targetAudience:
      'Famílias portuguesas com preocupações ambientais e interesse em reduzir consumos',
    mainProblem:
      'Dificuldade em medir e motivar comportamentos sustentáveis no dia-a-dia familiar, falta de visibilidade sobre o impacto ambiental individual e ausência de incentivos lúdicos para mudança de hábitos.',
  },

  // ========================================
  // 2. FUNCIONALIDADES PRINCIPAIS
  // ========================================
  features: {
    authentication: {
      title: 'Sistema de Autenticação',
      description: 'Registo e login de contas de utilizador (1 conta = 1 agregado familiar)',
      details: [
        'Registo com email e password',
        'Login persistente com validação',
        'Suporte para múltiplos perfis por conta (até 4 por defeito)',
        'Primeiro perfil é sempre Admin da conta',
      ],
      relatedFiles: [
        'src/views/LoginView.vue',
        'src/views/RegisterView.vue',
        'src/stores/userStore.js',
      ],
    },

    quickStart: {
      title: 'Configuração Inicial (Quick Start)',
      description: 'Wizard de setup para novos utilizadores na primeira utilização',
      details: [
        'Passo 1: Definir número máximo de perfis (2-6 utilizadores)',
        'Passo 2: Selecionar aparelhos domésticos existentes (ex: forno, frigorífico, ar condicionado)',
        'Passo 3: Escolher tarefas/atividades ecológicas disponíveis (ex: reciclar, usar transporte público)',
        'Passo 4: Criar perfil admin com nome e avatar',
        'Após conclusão, redireciona para seleção de perfil',
      ],
      relatedFiles: ['src/views/QuickStartView.vue', 'src/stores/userStore.js'],
    },

    profileManagement: {
      title: 'Gestão de Perfis',
      description: 'Sistema multi-perfil dentro de cada conta familiar',
      details: [
        'Cada conta pode ter 2-6 perfis (configurável no Quick Start)',
        'Primeiro perfil é Admin (acesso total)',
        'Perfis subsequentes são Standard (acesso limitado)',
        'Cada perfil tem: nome, idade, avatar, estatísticas individuais',
        'Perfis podem ter PIN de proteção (opcional)',
        'Ecrã de seleção de perfil ao entrar na aplicação',
        'Gamificação individual: pontos, nível, XP, streak, badges',
      ],
      relatedFiles: [
        'src/views/ProfileSelectionView.vue',
        'src/views/ProfileView.vue',
        'src/stores/userStore.js',
      ],
    },

    taskTracking: {
      title: 'Registo de Tarefas Ecológicas',
      description: 'Completar atividades sustentáveis e ganhar pontos',
      details: [
        'Lista de tarefas configuradas no Quick Start',
        'Cada tarefa tem: título, descrição, categoria, dificuldade',
        'Recompensas por tarefa: pontos + CO2 poupado',
        'Categorias: Energia, Mobilidade, Reciclagem, Água, Alimentação, Consumo',
        'Dificuldade: easy, medium, hard',
        'Frequência: daily, weekly',
        'Histórico de atividades completas por perfil',
        'Sistema de XP e nivelamento (100 XP = 1 nível)',
      ],
      relatedFiles: [
        'src/stores/tasksStore.js',
        'src/data/mockTasks.js',
        'src/components/TaskCard.vue',
      ],
    },

    applianceTracking: {
      title: 'Monitorização de Consumos Energéticos',
      description: 'Registar utilização de aparelhos e calcular impacto ambiental',
      details: [
        'Lista de aparelhos configurados no Quick Start',
        'Cada aparelho tem: nome, potência média (W), horas uso/dia, factor CO2/kWh',
        'Categorias: Cozinha, Lavandaria, Entretenimento, Climatização, Tecnologia, Limpeza',
        'Registo de horas de utilização por aparelho',
        'Cálculo automático: energia consumida (kWh) e CO2 emitido (kg)',
        'Histórico de consumos por perfil',
        'Dashboard de estatísticas agregadas',
      ],
      relatedFiles: [
        'src/stores/appliencesStore.js',
        'src/data/mockAppliances.js',
        'src/components/ConsumptionCard.vue',
      ],
    },

    leaderboard: {
      title: 'Ranking e Competição',
      description: 'Sistema de classificação para motivar comportamentos sustentáveis',
      details: [
        'Ranking Familiar: ordenação de perfis da mesma conta por pontos',
        'Ranking Global: top 50 perfis de todas as contas (desativado por defeito)',
        'Visualização de: posição, nome, avatar, pontos, CO2 poupado',
        'Atualização em tempo real ao completar tarefas',
      ],
      relatedFiles: ['src/views/LeaderboardView.vue', 'src/stores/userStore.js'],
    },

    rewards: {
      title: 'Sistema de Recompensas',
      description: 'Resgatar pontos por prémios definidos pela família',
      details: [
        'Admin define recompensas disponíveis (ex: "Jantar fora", "Ida ao cinema")',
        'Cada recompensa tem custo em pontos',
        'Perfis podem resgatar quando têm pontos suficientes',
        'Histórico de recompensas resgatadas',
        'Status: pending (aguarda aprovação do admin), approved, rejected',
        'Notificações para admin aprovar pedidos',
      ],
      relatedFiles: [
        'src/components/RewardCard.vue',
        'src/components/RewardRedeemedCard.vue',
        'src/stores/userStore.js',
      ],
    },

    adminDashboard: {
      title: 'Painel de Administração',
      description: 'Área exclusiva para perfis Admin gerirem a conta familiar',
      details: [
        'Gestão de recompensas: criar, editar, aprovar resgates',
        'Gestão de tarefas: adicionar/remover tarefas disponíveis',
        'Gestão de consumos: editar aparelhos configurados',
        'Estatísticas agregadas da família',
        'Gestão de utilizadores: ver todos os perfis',
        'Acesso protegido por route guard (requiresAdmin)',
      ],
      relatedFiles: ['src/views/AdminDashboardView.vue', 'src/router/index.js'],
    },

    chatbot: {
      title: 'Assistente Virtual (ChatBot)',
      description: 'Suporte inteligente via chat integrado com API externa (iaedu)',
      details: [
        'Widget flutuante no canto inferior direito',
        'Design responsivo: fullscreen em mobile, compacto em desktop',
        'Quick actions iniciais: ajuda geral, consumos, ranking, troubleshooting',
        'Integração com API iaedu para respostas contextualizadas',
        'Streaming de respostas em tempo real',
        'Indicador de estado de conexão (verde/vermelho)',
        'Contextualização automática: perfil ativo, tipo de conta, pontos, nível',
      ],
      relatedFiles: ['src/components/ChatBot.vue', 'vite.config.js', '.env'],
    },

    statistics: {
      title: 'Dashboard de Estatísticas',
      description: 'Visualização de métricas e KPIs ambientais',
      details: [
        'CO2 total poupado (individual e familiar)',
        'Energia consumida vs. poupada',
        'Progressão de pontos ao longo do tempo',
        'Comparação entre perfis',
        'Gráficos de evolução (em desenvolvimento)',
      ],
      relatedFiles: ['src/views/StatisticsView.vue', 'src/views/HomeScreenView.vue'],
    },
  },

  // ========================================
  // 3. TIPOS DE UTILIZADOR E PERMISSÕES
  // ========================================
  userTypes: {
    admin: {
      name: 'Perfil Administrador',
      description: 'Primeiro perfil criado numa conta, com privilégios totais',
      permissions: [
        'Acesso ao painel de administração',
        'Gerir recompensas (criar, editar, aprovar resgates)',
        'Gerir tarefas disponíveis',
        'Gerir aparelhos domésticos',
        'Ver estatísticas de todos os perfis',
        'Criar e eliminar outros perfis',
        'Todas as funcionalidades de perfil standard',
      ],
      identification: 'state.currentProfile.isAdmin === true',
      relatedCode: 'src/stores/userStore.js (getter: isAdmin)',
    },

    standardUser: {
      name: 'Perfil Standard',
      description: 'Perfis secundários criados pelo admin',
      permissions: [
        'Registar consumos energéticos',
        'Completar tarefas ecológicas',
        'Ver ranking familiar',
        'Resgatar recompensas (com aprovação)',
        'Ver estatísticas próprias',
        'Editar definições do próprio perfil (PIN, notificações)',
        'Usar assistente virtual (chatbot)',
      ],
      restrictions: [
        'Sem acesso ao painel admin',
        'Não pode gerir recompensas',
        'Não pode alterar configuração da conta',
        'Não pode eliminar perfis',
      ],
      identification: 'state.currentProfile.isAdmin === false',
    },

    guest: {
      name: 'Visitante (não autenticado)',
      description: 'Utilizadores que acedem à landing page sem login',
      permissions: [
        'Ver landing page informativa',
        'Aceder a páginas públicas: About Us, Contactos, FAQ',
        'Ver Política de Privacidade e Termos de Serviço',
        'Criar nova conta (Register)',
        'Fazer login em conta existente',
      ],
      restrictions: [
        'Sem acesso a funcionalidades da aplicação',
        'Redirecionado para /login ao tentar aceder áreas protegidas',
      ],
      identification: 'userStore.isLoggedIn === false',
    },
  },

  // ========================================
  // 4. GLOSSÁRIO E TERMINOLOGIA DO DOMÍNIO
  // ========================================
  glossary: {
    points: {
      term: 'Pontos',
      definition: 'Moeda virtual da aplicação, ganha ao completar tarefas ecológicas',
      usage: 'Usados para resgatar recompensas e competir no ranking',
      calculation: 'Cada tarefa atribui um valor fixo de pontos (ex: 5-20 pontos)',
      relatedTerms: ['XP', 'Recompensas', 'Ranking'],
    },

    xp: {
      term: 'XP (Experience Points)',
      definition: 'Pontos de experiência que determinam o nível do perfil',
      usage: 'Ganhos juntamente com pontos ao completar tarefas',
      calculation: '100 XP = 1 nível. Nível = Math.floor(XP / 100) + 1',
      relatedTerms: ['Nível', 'Pontos'],
    },

    level: {
      term: 'Nível',
      definition: 'Indicador de progressão e experiência do perfil',
      usage: 'Representação visual do empenho do utilizador',
      calculation: 'Calculado automaticamente com base no XP total',
      relatedTerms: ['XP'],
    },

    co2Saved: {
      term: 'CO2 Poupado',
      definition: 'Quantidade de dióxido de carbono (em kg) que se evitou emitir',
      usage: 'Métrica ambiental principal da aplicação',
      calculation:
        'Somado ao completar tarefas (cada tarefa tem valor fixo) ou ao reduzir consumos',
      unit: 'kg CO2',
      relatedTerms: ['Pegada de Carbono', 'Impacto Ambiental'],
    },

    streak: {
      term: 'Streak (Sequência)',
      definition: 'Número de dias consecutivos com atividade registada',
      usage: 'Incentiva consistência e criação de hábitos',
      calculation: 'Incrementado diariamente ao completar pelo menos uma tarefa',
      note: 'Funcionalidade em desenvolvimento',
    },

    badges: {
      term: 'Badges / Emblemas',
      definition: 'Conquistas especiais desbloqueadas por marcos específicos',
      usage: 'Reconhecimento de achievements (ex: "Early Adopter", "100 Tasks Completed")',
      examples: [
        'early_adopter: Primeiro perfil criado',
        'century: 100 tarefas completas',
        'eco_warrior: 50kg CO2 poupados',
      ],
      relatedTerms: ['Gamificação'],
    },

    profile: {
      term: 'Perfil',
      definition: 'Identidade individual dentro de uma conta familiar',
      usage: 'Cada membro da família tem o seu perfil para rastreio independente',
      structure:
        'id, name, age, avatar, isAdmin, points, co2Saved, level, xp, streak, settings, activityHistory, applianceUsage, rewardsRedeemed, badges',
      note: 'Uma conta pode ter 2-6 perfis',
    },

    account: {
      term: 'Conta / User Account',
      definition: 'Contentor que representa o agregado familiar',
      usage: 'Autenticação por email/password, contém múltiplos perfis',
      structure: 'id, email, password, maxProfiles, appliances[], tasks[], profiles[], createdAt',
      note: '1 conta = 1 família',
    },

    appliance: {
      term: 'Aparelho / Appliance',
      definition: 'Dispositivo doméstico consumidor de energia',
      usage: 'Registar horas de utilização para calcular impacto ambiental',
      properties: 'name, category, avgPowerConsumption (W), avgUsageHoursPerDay, co2PerKwh',
      examples: ['Frigorífico', 'Máquina de lavar', 'Ar condicionado'],
    },

    task: {
      term: 'Tarefa / Task',
      definition: 'Atividade ecológica que pode ser completada para ganhar pontos',
      usage: 'Sistema de gamificação central',
      properties: 'title, description, category, points, co2Saved, frequency, icon, difficulty',
      categories: ['Energia', 'Mobilidade', 'Reciclagem', 'Água', 'Alimentação', 'Consumo'],
      difficulty: ['easy', 'medium', 'hard'],
    },

    reward: {
      term: 'Recompensa / Reward',
      definition: 'Prémio definido pela família que pode ser resgatado com pontos',
      usage: 'Incentivo tangível para acumular pontos',
      structure: 'id, title, points (custo), description',
      examples: ['Jantar fora (120 pontos)', 'Escolher música no carro (20 pontos)'],
      workflow: 'Perfil resgata → Admin aprova/rejeita → Status atualizado',
    },

    kwh: {
      term: 'kWh (Kilowatt-hora)',
      definition: 'Unidade de medida de energia elétrica',
      usage: 'Calcular consumo energético dos aparelhos',
      calculation: 'kWh = (Potência_W × Horas_Uso) / 1000',
      example: 'Aparelho de 2000W usado 1h = 2 kWh',
    },

    co2PerKwh: {
      term: 'Factor de Emissão (kg CO2/kWh)',
      definition: 'Quantidade de CO2 emitida por cada kWh de energia consumida',
      usage: 'Converter consumo energético em impacto ambiental',
      portugalAverage: '0.233 kg CO2 por kWh (2023)',
      calculation: 'CO2_emitido = kWh_consumidos × factor_emissão',
    },

    quickStart: {
      term: 'Quick Start / Configuração Inicial',
      definition: 'Wizard de setup para novos utilizadores',
      usage: 'Executado apenas uma vez após registo',
      purpose: 'Configurar agregado familiar: número de perfis, aparelhos, tarefas',
      mandatory: true,
      relatedFiles: ['src/views/QuickStartView.vue'],
    },
  },

  // ========================================
  // 5. STACK TECNOLÓGICA
  // ========================================
  technologies: {
    frontend: {
      framework: 'Vue.js 3',
      apiStyle: 'Options API (data, methods, computed, watch, lifecycle hooks)',
      styling: 'Tailwind CSS + CSS Scoped nos componentes',
      routing: 'Vue Router 4 com navigation guards',
      stateManagement: 'Pinia (stores modulares)',
      buildTool: 'Vite 5',
      icons: 'Material Symbols Outlined (Google Fonts)',
    },

    backend: {
      status: 'Mock data (desenvolvimento)',
      dataSource: 'src/data/mockUsers.js, mockAppliances.js, mockTasks.js',
      persistence: 'LocalStorage (planeado)',
      futureAPI: 'REST API com autenticação JWT',
    },

    external: {
      chatbotAPI: 'iaedu Chatbot API (https://api.iaedu.pt)',
      endpoint: '/api/chatbot (proxy configurado no Vite)',
      authentication: 'x-api-key header',
      responseFormat: 'Server-Sent Events (streaming)',
    },

    tooling: {
      packageManager: 'npm',
      linting: 'ESLint',
      versionControl: 'Git / GitHub',
      deployment: 'Vite build → hosting estático',
    },
  },

  // ========================================
  // 6. REGRAS DE NEGÓCIO E LÓGICA
  // ========================================
  businessRules: {
    profiles: {
      maxProfiles: 'Configurável entre 2-6 no Quick Start (padrão: 4)',
      firstProfileIsAdmin: 'O primeiro perfil criado tem sempre isAdmin: true',
      uniqueNames: 'Não podem existir perfis com nomes duplicados na mesma conta',
      deleteRestriction: 'Não se pode eliminar o único perfil admin',
    },

    points: {
      earning: 'Pontos ganhos ao completar tarefas (valor fixo por tarefa)',
      spending: 'Pontos gastos ao resgatar recompensas',
      noNegative: 'Saldo de pontos nunca pode ser negativo',
    },

    levelUp: {
      formula: 'Nível = Math.floor(XP / 100) + 1',
      xpSource: 'XP ganho é igual aos pontos da tarefa completada',
      example: 'Tarefa de 15 pontos = +15 XP = progresso para próximo nível',
    },

    rewards: {
      minimumPoints: 'Perfil precisa ter pontos >= custo da recompensa',
      approval: 'Admin precisa aprovar resgates (status: pending → approved/rejected)',
      pointsDeduction: 'Pontos são deduzidos imediatamente ao resgatar',
    },

    routing: {
      authGuard: 'Rotas com meta.requiresLogin redirecionam para /login se não autenticado',
      adminGuard: 'Rotas com meta.requiresAdmin redirecionam para /home se não for admin',
      firstUseGuard: 'Utilizador autenticado sem perfis é forçado para /quick-start até completar',
    },

    co2Calculation: {
      appliances: 'CO2 = (Potência_W × Horas / 1000) × factor_co2_kwh',
      tasks: 'CO2 poupado é valor fixo definido por tarefa',
      aggregation: 'CO2 total do perfil é soma de todas as tarefas completas + impacto de consumos',
    },
  },

  // ========================================
  // 7. ESTRUTURA DE DADOS PRINCIPAIS
  // ========================================
  dataModels: {
    user: {
      description: 'Conta do agregado familiar',
      fields: {
        id: 'Number (timestamp)',
        email: 'String (único)',
        password: 'String (em produção: hash)',
        createdAt: 'ISO Date String',
        maxProfiles: 'Number (2-6)',
        appliances: 'Array<Number> (IDs dos aparelhos selecionados)',
        tasks: 'Array<Number> (IDs das tarefas disponíveis)',
        profiles: 'Array<Profile>',
      },
    },

    profile: {
      description: 'Perfil individual de membro da família',
      fields: {
        id: 'Number (timestamp)',
        name: 'String',
        age: 'Number | null',
        avatar: 'String (URL)',
        isAdmin: 'Boolean',
        createdAt: 'ISO Date String',
        points: 'Number',
        co2Saved: 'Number (kg)',
        level: 'Number',
        xp: 'Number',
        streak: 'Number',
        settings: 'Object { pin, notifications, defaultDevice, language, theme }',
        activityHistory: 'Array<Activity>',
        applianceUsage: 'Array<Usage>',
        rewardsRedeemed: 'Array<Redemption>',
        badges: 'Array<Badge>',
      },
    },

    task: {
      description: 'Atividade ecológica disponível',
      fields: {
        id: 'Number',
        title: 'String',
        description: 'String',
        category: 'String (Energia, Mobilidade, etc.)',
        points: 'Number',
        co2Saved: 'Number (kg)',
        frequency: 'String (daily, weekly)',
        icon: 'String (Material Symbol)',
        difficulty: 'String (easy, medium, hard)',
      },
    },

    appliance: {
      description: 'Aparelho doméstico consumidor de energia',
      fields: {
        id: 'Number',
        name: 'String',
        icon: 'String (Material Symbol)',
        category: 'String',
        avgPowerConsumption: 'Number (watts)',
        avgUsageHoursPerDay: 'Number',
        co2PerKwh: 'Number (0.233 para Portugal)',
      },
    },
  },

  // ========================================
  // 8. PERGUNTAS FREQUENTES (INTERNAS)
  // ========================================
  faq: {
    q1: {
      question: 'Como se calcula o CO2 poupado?',
      answer:
        'Há duas fontes: (1) Tarefas ecológicas têm valores fixos de CO2 poupado definidos por tarefa (ex: "Usar transporte público" poupa 2.3kg). (2) Aparelhos têm fórmula: CO2_emitido = (Potência_W × Horas_Uso / 1000) × 0.233 kg/kWh. O total do perfil é a soma de todas as poupanças.',
    },

    q2: {
      question: 'Qual a diferença entre pontos e XP?',
      answer:
        'Pontos são moeda que se pode gastar em recompensas. XP é experiência que só aumenta e determina o nível. Ao completar uma tarefa, o perfil ganha ambos (normalmente o mesmo valor).',
    },

    q3: {
      question: 'Como funciona o sistema de recompensas?',
      answer:
        'Admin cria recompensas com custo em pontos. Perfis standard podem resgatar se tiverem pontos suficientes. Pontos são deduzidos imediatamente, mas a recompensa fica "pending" até o admin aprovar no painel de administração.',
    },

    q4: {
      question: 'O que acontece no primeiro login?',
      answer:
        'Se o utilizador não tem perfis criados (isFirstUse === true), é redirecionado para /quick-start onde configura: número de perfis, aparelhos domésticos, tarefas disponíveis e cria o perfil admin. Só depois pode aceder à aplicação principal.',
    },

    q5: {
      question: 'Como se acede ao painel de admin?',
      answer:
        'Apenas perfis com isAdmin: true podem aceder a /admin. Há um navigation guard no router que verifica userStore.isAdmin. Perfis standard são redirecionados para /home se tentarem aceder.',
    },

    q6: {
      question: 'Os dados são persistidos?',
      answer:
        'Atualmente usa mock data em memória (src/data/mockUsers.js). Em produção, planeado usar LocalStorage ou backend REST API com base de dados real.',
    },

    q7: {
      question: 'Como funciona o chatbot?',
      answer:
        'Componente ChatBot.vue integrado com API iaedu. Envia contexto do utilizador (perfil ativo, pontos, nível) e recebe respostas em streaming. Usa proxy configurado no Vite para evitar CORS. Quick actions iniciais para tópicos comuns.',
    },

    q8: {
      question: 'Quais as categorias de tarefas disponíveis?',
      answer:
        'Energia (desligar luzes, standby), Mobilidade (transporte público, bicicleta), Reciclagem (separar plástico), Água (duches curtos), Alimentação (refeições vegetarianas), Consumo (sacos reutilizáveis).',
    },
  },

  // ========================================
  // 9. FLUXOS DE UTILIZADOR TÍPICOS
  // ========================================
  userFlows: {
    newUserJourney: [
      '1. Aceder à landing page (/) e clicar "Começar agora"',
      '2. Registar nova conta com email/password (/register)',
      '3. Login automático e redirecionamento para /quick-start',
      '4. Completar 4 passos do Quick Start (perfis, aparelhos, tarefas, admin)',
      '5. Redirecionamento para /profile-selection',
      '6. Selecionar perfil admin recém-criado',
      '7. Acesso a /home (dashboard principal)',
    ],

    returningUser: [
      '1. Aceder a /login',
      '2. Inserir credenciais',
      '3. Se tem perfil com defaultDevice, entra diretamente em /home',
      '4. Senão, redireciona para /profile-selection',
      '5. Escolher perfil e aceder ao dashboard',
    ],

    completeTask: [
      '1. Em /home, ver secção "Tarefas"',
      '2. Clicar numa TaskCard',
      '3. Confirmar conclusão da tarefa',
      '4. Sistema adiciona pontos + XP + CO2 ao perfil',
      '5. Verifica level-up automático',
      '6. Atualiza histórico de atividades',
      '7. Mostra notificação de sucesso',
    ],

    redeemReward: [
      '1. Perfil standard navega para secção de recompensas',
      '2. Vê recompensas disponíveis (criadas pelo admin)',
      '3. Clica em recompensa com pontos >= custo',
      '4. Confirma resgate → pontos deduzidos imediatamente',
      '5. Recompensa entra em status "pending"',
      '6. Admin recebe notificação',
      '7. Admin acede a /admin → "Gestão de recompensas"',
      '8. Aprova ou rejeita o pedido',
      '9. Status atualizado para "approved" ou "rejected"',
    ],

    adminCreateReward: [
      '1. Perfil admin acede a /admin',
      '2. Secção "Gestão de recompensas"',
      '3. Clica "Adicionar recompensa"',
      '4. Preenche: título, descrição, custo em pontos',
      '5. Submete formulário',
      '6. Recompensa fica disponível para todos os perfis resgatarem',
    ],
  },

  // ========================================
  // 10. CONTEXTO PARA O CHATBOT
  // ========================================
  chatbotContext: {
    purpose:
      'Fornecer suporte contextualizado aos utilizadores sobre funcionalidades, troubleshooting e informação ambiental',
    capabilities: [
      'Explicar como funcionam as funcionalidades (tarefas, consumos, recompensas)',
      'Ajudar com problemas técnicos comuns',
      'Fornecer dicas para maximizar pontos e poupanças de CO2',
      'Explicar estatísticas e métricas do perfil',
      'Orientar na navegação da aplicação',
    ],
    automaticContext: {
      activeProfile:
        'Nome, nível, pontos, CO2 poupado do perfil atualmente selecionado (userStore.currentProfile)',
      userType: 'Se é admin ou standard (userStore.isAdmin)',
      accountInfo: 'Email da conta, número de perfis, aparelhos e tarefas configurados',
    },
    quickActions: [
      'Preciso de ajuda (explicação geral)',
      'Qual foi o meu último consumo? (histórico)',
      'Qual é a minha posição no ranking? (leaderboard)',
      'Tenho um problema técnico (troubleshooting)',
    ],
    toneAndStyle:
      'Amigável, motivador, educacional. Usar linguagem acessível para famílias. Destacar impacto ambiental positivo. Incentivar comportamentos sustentáveis.',
  },

  // ========================================
  // 11. ROADMAP E FUNCIONALIDADES FUTURAS
  // ========================================
  roadmap: [
    'Integração com API backend real (substituir mock data)',
    'Persistência em LocalStorage / IndexedDB',
    'Sistema de notificações push para resgates e achievements',
    'Gráficos de estatísticas interativos (chart.js)',
    'Comparação com médias nacionais de consumo',
    'Integração com dispositivos IoT (smart plugs)',
    'Desafios semanais temáticos',
    'Partilha social de conquistas',
    'Modo offline com sincronização',
    'Suporte multilingue (EN, ES, FR)',
  ],

  // ========================================
  // 12. METADADOS E INFORMAÇÃO TÉCNICA
  // ========================================
  metadata: {
    createdAt: '2025-01-01',
    lastUpdated: '2025-01-01',
    maintainers: ['Equipa B.green'],
    repository: 'pw1-eco-tracker',
    documentation: 'README.md, Fichas Práticas ESMAD',
    license: 'Projeto académico',
    environment: {
      development: 'npm run dev (Vite dev server na porta 5173)',
      build: 'npm run build',
      preview: 'npm run preview',
    },
    envVariables: {
      VITE_CHATBOT_API_KEY: 'Chave de API do iaedu (sk-usr-...)',
      VITE_CHATBOT_API_ENDPOINT: 'Endpoint do proxy (/api/chatbot)',
      VITE_CHATBOT_CHANNEL_ID: 'ID do canal iaedu (cmjb...)',
    },
  },
}
