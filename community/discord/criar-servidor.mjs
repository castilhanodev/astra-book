#!/usr/bin/env node

/**
 * Cria a estrutura inicial do Discord AstraBook.
 *
 * Segurança:
 * - simulação por padrão; somente --apply modifica o servidor;
 * - token e ID vêm de variáveis de ambiente;
 * - não exclui nem renomeia nada;
 * - reaproveita itens que já tenham o mesmo nome.
 *
 * Requer Node.js 20+.
 */

const APPLY = process.argv.includes("--apply");
const TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID = process.env.DISCORD_GUILD_ID;
const API = "https://discord.com/api/v10";

const P = {
  VIEW_CHANNEL: 1n << 10n,
  SEND_MESSAGES: 1n << 11n,
  MANAGE_MESSAGES: 1n << 13n,
  ATTACH_FILES: 1n << 15n,
  READ_MESSAGE_HISTORY: 1n << 16n,
  KICK_MEMBERS: 1n << 1n,
  BAN_MEMBERS: 1n << 2n,
  MANAGE_CHANNELS: 1n << 4n,
  ADD_REACTIONS: 1n << 6n,
  MANAGE_ROLES: 1n << 28n,
  MODERATE_MEMBERS: 1n << 40n,
};

const sum = (...values) => values.reduce((result, value) => result | value, 0n);
const bits = value => value.toString();

const roles = [
  {
    name: "Astra • Administração",
    color: 0x65e6cc,
    permissions: bits(sum(P.MANAGE_CHANNELS, P.MANAGE_MESSAGES, P.MANAGE_ROLES,
      P.KICK_MEMBERS, P.BAN_MEMBERS, P.MODERATE_MEMBERS,
      P.VIEW_CHANNEL, P.SEND_MESSAGES, P.READ_MESSAGE_HISTORY, P.ATTACH_FILES)),
  },
  {
    name: "Astra • Moderação",
    color: 0x5aa7ff,
    permissions: bits(sum(P.MANAGE_MESSAGES, P.KICK_MEMBERS, P.MODERATE_MEMBERS,
      P.VIEW_CHANNEL, P.SEND_MESSAGES, P.READ_MESSAGE_HISTORY, P.ATTACH_FILES)),
  },
  {
    name: "Astra • Curadoria",
    color: 0xb388ff,
    permissions: bits(sum(P.MANAGE_MESSAGES, P.VIEW_CHANNEL, P.SEND_MESSAGES,
      P.READ_MESSAGE_HISTORY, P.ATTACH_FILES)),
  },
  {
    name: "Autor(a) verificado(a)",
    color: 0xffb65a,
    permissions: bits(sum(P.VIEW_CHANNEL, P.SEND_MESSAGES,
      P.READ_MESSAGE_HISTORY, P.ATTACH_FILES, P.ADD_REACTIONS)),
  },
  { name: "Leitor(a)", color: 0xe9eef8, permissions: "0" },
  { name: "Romance", color: 0xff85ad, permissions: "0" },
  { name: "Fantasia", color: 0x9b7bff, permissions: "0" },
  { name: "Mistério", color: 0x65758b, permissions: "0" },
  { name: "Mangá", color: 0xff7b68, permissions: "0" },
  { name: "Clássicos", color: 0xd5aa61, permissions: "0" },
  { name: "Não ficção", color: 0x62c58e, permissions: "0" },
];

const categories = [
  {
    name: "🚀 COMECE AQUI",
    mode: "readOnly",
    channels: [
      ["boas-vindas", "Comece aqui e conheça a comunidade AstraBook."],
      ["regras", "Regras da comunidade, convivência e direitos autorais."],
      ["anuncios", "Novidades oficiais, versões e eventos do AstraBook."],
      ["como-usar-o-astrabook", "Dicas de importação, leitura e recursos do aplicativo."],
      ["direitos-e-remocao", "Política de conteúdo e pedidos de análise ou remoção."],
    ],
  },
  {
    name: "🌌 COMUNIDADE",
    mode: "public",
    channels: [
      ["chat-geral", "Converse sobre leitura, tecnologia e o universo AstraBook."],
      ["apresentacoes", "Conte quem você é e o que gosta de ler."],
      ["clube-de-leitura", "Leituras coletivas, encontros e discussões."],
      ["recomendacoes", "Recomende livros e fontes oficiais, sem cópias não autorizadas."],
    ],
    voice: ["Sala de leitura"],
  },
  {
    name: "🛟 AJUDA E IDEIAS",
    mode: "public",
    channels: [
      ["suporte-do-app", "Ajuda para instalar e usar o AstraBook."],
      ["relatar-bugs", "Informe aparelho, versão e passos para reproduzir o problema."],
      ["feedback-e-sugestoes", "Sugestões para melhorar o aplicativo e a comunidade."],
      ["pedidos-de-livros", "Peça à curadoria para procurar uma fonte legal da obra."],
    ],
  },
  {
    name: "📚 BIBLIOTECA OFICIAL",
    mode: "library",
    channels: [
      ["guia-da-biblioteca", "Como encontrar obras e como a curadoria verifica direitos."],
      ["romance", "Romances em domínio público, autorizados ou licenciados."],
      ["fantasia", "Fantasia em domínio público, autorizada ou licenciada."],
      ["misterio-e-suspense", "Mistério e suspense com distribuição autorizada."],
      ["manga-e-quadrinhos", "Mangás e quadrinhos próprios ou licenciados."],
      ["classicos-dominio-publico", "Clássicos conferidos pela curadoria."],
      ["nao-ficcao", "Ensaios, estudos e não ficção com fonte legal."],
    ],
  },
  {
    name: "✍️ AUTORES E COMUNIDADE",
    mode: "authors",
    channels: [
      ["como-publicar-sua-obra", "Orientações para autores enviarem obras próprias."],
      ["obras-da-comunidade", "Publicações de autores verificados."],
      ["divulgacao-de-autores", "Conheça autores e lançamentos autorizados."],
    ],
  },
  {
    name: "🛰️ EQUIPE ASTRA",
    mode: "staff",
    channels: [
      ["equipe-geral", "Coordenação privada da comunidade."],
      ["fila-de-curadoria", "Análise de autoria, licença e autorização."],
      ["registro-de-moderacao", "Registro interno de ações da moderação."],
      ["denuncias-de-conteudo", "Análise privada de denúncias e pedidos de remoção."],
    ],
  },
];

function plan() {
  console.log("Plano do servidor AstraBook\n");
  console.log(`Cargos (${roles.length}):`);
  for (const role of roles) console.log(`  - ${role.name}`);
  console.log(`\nCategorias (${categories.length}):`);
  for (const category of categories) {
    console.log(`  - ${category.name}`);
    for (const [name] of category.channels) console.log(`      # ${name}`);
    for (const name of category.voice ?? []) console.log(`      🔊 ${name}`);
  }
  console.log("\nModo simulação: nenhuma alteração foi enviada ao Discord.");
  console.log("Revise o plano e execute novamente com --apply para criar.");
}

async function discord(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bot ${TOKEN}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (response.status === 429) {
    const body = await response.json();
    await new Promise(resolve => setTimeout(resolve, Math.ceil(body.retry_after * 1000)));
    return discord(path, options);
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Discord ${response.status} em ${path}: ${body}`);
  }

  return response.status === 204 ? null : response.json();
}

function overwrites(mode, ids) {
  const allowRead = bits(sum(P.VIEW_CHANNEL, P.READ_MESSAGE_HISTORY, P.ADD_REACTIONS));
  const allowWrite = bits(sum(P.VIEW_CHANNEL, P.READ_MESSAGE_HISTORY,
    P.SEND_MESSAGES, P.ATTACH_FILES, P.ADD_REACTIONS));
  const denyWrite = bits(sum(P.SEND_MESSAGES, P.ATTACH_FILES));

  if (mode === "public") return [];

  if (mode === "staff") {
    return [
      { id: ids.everyone, type: 0, allow: "0", deny: bits(P.VIEW_CHANNEL) },
      { id: ids.admin, type: 0, allow: allowWrite, deny: "0" },
      { id: ids.moderator, type: 0, allow: allowWrite, deny: "0" },
      { id: ids.curator, type: 0, allow: allowWrite, deny: "0" },
    ];
  }

  const result = [
    { id: ids.everyone, type: 0, allow: allowRead, deny: denyWrite },
    { id: ids.admin, type: 0, allow: allowWrite, deny: "0" },
    { id: ids.moderator, type: 0, allow: allowWrite, deny: "0" },
    { id: ids.curator, type: 0, allow: allowWrite, deny: "0" },
  ];

  if (mode === "authors") {
    result.push({ id: ids.author, type: 0, allow: allowWrite, deny: "0" });
  }
  return result;
}

async function apply() {
  if (!TOKEN || !GUILD_ID) {
    throw new Error("Defina DISCORD_BOT_TOKEN e DISCORD_GUILD_ID antes de usar --apply.");
  }

  const guild = await discord(`/guilds/${GUILD_ID}`);
  console.log(`Servidor encontrado: ${guild.name}`);

  let existingRoles = await discord(`/guilds/${GUILD_ID}/roles`);
  const roleByName = new Map(existingRoles.map(role => [role.name, role]));

  for (const definition of roles) {
    if (roleByName.has(definition.name)) {
      console.log(`Cargo existente: ${definition.name}`);
      continue;
    }
    const created = await discord(`/guilds/${GUILD_ID}/roles`, {
      method: "POST",
      body: JSON.stringify({ ...definition, hoist: false, mentionable: false }),
    });
    roleByName.set(created.name, created);
    console.log(`Cargo criado: ${created.name}`);
  }

  const ids = {
    everyone: GUILD_ID,
    admin: roleByName.get("Astra • Administração").id,
    moderator: roleByName.get("Astra • Moderação").id,
    curator: roleByName.get("Astra • Curadoria").id,
    author: roleByName.get("Autor(a) verificado(a)").id,
  };

  let existingChannels = await discord(`/guilds/${GUILD_ID}/channels`);
  const categoryByName = new Map(
    existingChannels.filter(channel => channel.type === 4).map(channel => [channel.name, channel]),
  );

  for (const category of categories) {
    let parent = categoryByName.get(category.name);
    if (!parent) {
      parent = await discord(`/guilds/${GUILD_ID}/channels`, {
        method: "POST",
        body: JSON.stringify({
          name: category.name,
          type: 4,
          permission_overwrites: overwrites(category.mode, ids),
        }),
      });
      categoryByName.set(category.name, parent);
      existingChannels.push(parent);
      console.log(`Categoria criada: ${category.name}`);
    } else {
      console.log(`Categoria existente: ${category.name}`);
    }

    for (const [name, topic] of category.channels) {
      const existing = existingChannels.find(channel =>
        channel.parent_id === parent.id && channel.name === name && channel.type === 0);
      if (existing) {
        console.log(`Canal existente: #${name}`);
        continue;
      }
      const created = await discord(`/guilds/${GUILD_ID}/channels`, {
        method: "POST",
        body: JSON.stringify({
          name,
          topic,
          type: 0,
          parent_id: parent.id,
          permission_overwrites: overwrites(category.mode, ids),
        }),
      });
      existingChannels.push(created);
      console.log(`Canal criado: #${name}`);
    }

    for (const name of category.voice ?? []) {
      const existing = existingChannels.find(channel =>
        channel.parent_id === parent.id && channel.name === name && channel.type === 2);
      if (existing) {
        console.log(`Canal de voz existente: ${name}`);
        continue;
      }
      const created = await discord(`/guilds/${GUILD_ID}/channels`, {
        method: "POST",
        body: JSON.stringify({ name, type: 2, parent_id: parent.id }),
      });
      existingChannels.push(created);
      console.log(`Canal de voz criado: ${name}`);
    }
  }

  console.log("\nEstrutura criada. Revise cargos e permissões com uma conta comum.");
  console.log("Depois ative Comunidade e configure o Onboarding manualmente.");
}

if (!APPLY) {
  plan();
} else {
  apply().catch(error => {
    console.error(`\nFalha: ${error.message}`);
    process.exitCode = 1;
  });
}

