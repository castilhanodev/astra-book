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
