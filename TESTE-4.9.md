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
