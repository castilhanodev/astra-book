# Discord da comunidade AstraBook

Este pacote prepara um servidor de comunidade separado do aplicativo. Ele cria
cargos, categorias e canais, mas não envia livros e não guarda credenciais.

## O que será criado

- recepção, regras, anúncios e guia do aplicativo;
- chat geral, apresentações, clube de leitura e recomendações;
- suporte, bugs, sugestões e pedidos de livros;
- biblioteca oficial organizada por gênero e bloqueada para publicação comum;
- área de autores e obras da comunidade com envio restrito a autores verificados;
- área privada de curadoria, moderação e análise de conteúdo;
- cargos de administração, moderação, curadoria, autor verificado e interesses.

Leia `estrutura-servidor.md` antes de executar. Os textos para copiar nos canais
estão em `mensagens-prontas.md`.

## Regra essencial sobre livros

Publique somente arquivos que estejam em domínio público, tenham licença que
permita redistribuição, pertençam ao próprio autor ou tenham autorização escrita
do titular. Não publique cópias comerciais encontradas na internet. Um servidor
privado continua sujeito a direitos autorais e às regras do Discord.

## Preparação segura

1. Crie o servidor manualmente no Discord com o nome `AstraBook | Comunidade`.
2. No Discord Developer Portal, crie uma aplicação e adicione um bot.
3. Convide o bot **somente para esse servidor** com permissão para gerenciar
   canais e cargos. Evite conceder `Administrador`.
4. Copie o ID do servidor usando o Modo Desenvolvedor do Discord.
5. Guarde o token do bot em uma variável de ambiente. Nunca coloque o token no
   script, no GitHub, numa mensagem ou num arquivo compartilhado.

No PowerShell, somente durante a sessão atual:

```powershell
$env:DISCORD_BOT_TOKEN = "TOKEN_CONFIGURADO_FORA_DO_GITHUB"
$env:DISCORD_GUILD_ID = "ID_DO_SERVIDOR"
```

O exemplo acima mostra o nome das variáveis; não substitua os valores em um
arquivo que será enviado ao GitHub.

## Conferir sem modificar o Discord

Requer Node.js 20 ou mais recente:

```powershell
node .\criar-servidor.mjs
```

Sem `--apply`, o script apenas mostra o plano. Esta é a forma recomendada para a
primeira execução.

## Criar a estrutura

Depois de revisar o plano:

```powershell
node .\criar-servidor.mjs --apply
```

O script reaproveita cargos, categorias e canais que já tenham exatamente o
mesmo nome. Isso reduz duplicações se ele for executado novamente.

## Acabamento manual recomendado

1. Ative **Comunidade** nas configurações do servidor.
2. Configure o Onboarding para a pessoa escolher interesses como Romance,
   Fantasia, Mangá e Não ficção.
3. Copie os textos de `mensagens-prontas.md` para os canais correspondentes.
4. Fixe as regras, o guia da biblioteca e o formulário de envio de obras.
5. Entregue o cargo `Astra • Curadoria` apenas a pessoas de confiança.
6. Entregue `Autor(a) verificado(a)` somente depois de conferir autoria, licença
   ou autorização.
7. Teste tudo com uma conta comum antes de divulgar o convite.

O Onboarding permite que novos membros escolham cargos e canais. As permissões
por categoria deixam a biblioteca oficial visível, mas impedem que membros
comuns enviem mensagens ou arquivos nela.

