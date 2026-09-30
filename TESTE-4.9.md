# AstraBook 4.9 — candidato para o Google Play

Versão Android `4.9`, `versionCode 31`, pacote `com.astrabook.app`.

## Correções finais

- Corrigido o cadastro por e-mail, que usava uma variável inexistente ao salvar
  a opção de perfil logo após criar a conta.
- A assinatura Pro deixou de ser enviada ao Firestore ou restaurada a partir de
  um campo gravável pelo usuário. O direito ao Pro agora depende da compra e da
  propriedade informadas pelo Google Play Billing no aparelho.
- A política de privacidade não descreve mais login Google, que está desativado.
- A página web de exclusão foi alinhada ao único método de conta disponível,
  e-mail e senha.
- O workflow de páginas passa a reconstruir também as atualizações do projeto,
  para publicar a política e a página de exclusão da mesma versão do app.

## Validação

- Sintaxe aprovada em 2 scripts inline.
- Em viewports 900 x 900 e 390 x 844: 38/38 seleções individuais aprovadas.
- Seleção de várias linhas, cópia e marca-texto contínuos aprovados mesmo com a
  ordem dos elementos do PDF propositalmente embaralhada.
- Dicionário, pressão em margem vazia, estatística de três minutos, quiz, sons,
  tela acesa, limite de zoom, fechamento das abas e estante móvel aprovados.
- Modo de avaliação sem conta, ausência de anúncios e login Google desativado
  confirmados pela bateria automatizada.

Antes da produção pública, ainda é preciso concluir a ficha no Play Console,
validar o AAB assinado, configurar os produtos de assinatura e cumprir o teste
fechado exigido pela conta, quando aplicável.

## Teste interno no Google Play

A versão 31 (`4.9`) foi enviada e está ativa na faixa de teste interno como
`AstraBook 4.9 — teste interno`. A lista contém quatro contas autorizadas, sem
armazenar os endereços neste repositório. Os testadores participam por:
https://play.google.com/apps/internaltest/4701329264092446848 .

O testador deve abrir esse link usando a mesma Conta Google cadastrada, aceitar
a participação e usar o botão da Play Store para instalar. A faixa interna é
adequada para validar o pacote e distribuir rapidamente aos aparelhos, mas não
conta como o teste fechado de 12 participantes por 14 dias que o Console exige
antes de liberar produção nesta conta.

## Build Android #36

O workflow terminou com sucesso no commit `c669e7d`. Execução:
https://github.com/castilhanodev/astra-book/actions/runs/36736630049 .

- Artifact `astra-book-play-store`: SHA-256
  `E006D35E203167ED007FFDF1639EAC4BF57F94294ED8ADBCB77FB213FC6F9509`.
- APK: SHA-256
  `AA79803163A5ADC85EE2596DE068F7F153CDAF18138A9BE0A79450D8E0C7658D`.
- AAB: SHA-256
  `88693320F63962E5B7FDEB4B08C5E7BBE38BB4112EBB90B19766C5F073876B06`.
- Manifesto do APK: pacote `com.astrabook.app`, `versionCode 31`,
  `versionName 4.9`, `minSdk 24` e `targetSdk 36`.
- Certificado de upload SHA-256:
  `464FE4EFE945359566AE09683E949953FF828AC5EB96C6E840DAA0D8FD1C8284`.

Os hashes de `index.html`, `patch.js`, `firebase.js` e `firebase-config.js` no
APK e no AAB coincidem com a reconstrução submetida aos testes.

## Configuração do Play Console em 30/09/2026

As onze tarefas iniciais do Play Console foram concluídas. Foram salvos a
política de privacidade, o acesso para revisão sem login obrigatório, a
declaração de ausência de anúncios, público-alvo, Segurança dos dados,
declarações de app governamental, recursos financeiros, saúde e ID de
publicidade, além da categoria `Livros e referências`, contato público e a
página de detalhes do app.

A página usa o nome `AstraBook: Leitor de Livros`, cinco imagens de telefone,
ícone e recurso gráfico. Os recursos visuais foram declarados como criados ou
editados com auxílio de IA. A declaração de Segurança dos dados informa coleta
opcional de dados de conta e atividade quando o usuário escolhe criar uma conta,
sem compartilhamento com terceiros, com criptografia em trânsito e solicitação
de exclusão pela página publicada no site.

A classificação indicativa da IARC foi preenchida com autorização para usar o
contato informado. O resultado mostra 14 anos no Brasil e Livre/3 anos nas
demais regiões exibidas; o único elemento interativo indicado é `Compras no
Aplicativo`, correspondente ao Astra Pro presente no pacote.

A faixa fechada `Alpha` foi configurada para o Brasil com o AAB 4.9, a lista de
quatro testadores existente e as notas `AstraBook 4.9 — teste fechado`. As 14
mudanças foram enviadas à Google Play. As verificações automáticas terminaram
sem bloqueio e a versão passou ao estado `Em análise`. O link da faixa fechada é
https://play.google.com/apps/testing/com.astrabook.app . Usá-lo apenas com as
contas cadastradas e depois que a revisão liberar a versão. A
produção continua bloqueada até pelo menos 12 contas aceitarem participar do
teste fechado e permanecerem nele durante 14 dias; portanto, ainda faltam oito
contas e a aceitação de todos os participantes. Não armazenar endereços de
testadores neste repositório.
