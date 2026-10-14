# Monetização antes do lançamento — AstraBook

Estado conferido em 14/10/2026. Este roteiro prepara a monetização sem alterar
o APK 4.9 da Alpha, ativar anúncios ou iniciar cobranças.

## Situação confirmada

- O Play Console ainda pede **criar perfil para pagamentos/conta do comerciante**.
  Por isso, a página de assinaturas está indisponível. A criação exige os dados
  legais e financeiros corretos do titular; não guardar esses dados no GitHub.
  Ao abrir o fluxo, o Google ofereceu um perfil pessoal preexistente e a opção
  de criar outro. Nenhum foi selecionado ou vinculado. Confirmar o titular legal
  e os dados desse perfil antes de associá-lo à conta de desenvolvedor.
- O download do app foi definido como grátis. A receita planejada é uma
  assinatura opcional para recursos digitais, não uma taxa pelo download.
- A versão de teste está sem anúncios ativos. O projeto reconstruído ainda
  contém uma referência gerada a `capacitor-community-admob` em
  `android/app/capacitor.build.gradle`, mas não foi encontrada chamada de
  anúncio no `www/index.html`. Antes de distribuir anúncios, revisar o pacote
  final e as declarações do Console, além do código-fonte.
- O código cadastra os IDs `astra_pro_mensal`, `astra_pro_trimestral` e
  `astra_pro_anual` no `cordova-plugin-purchase`. A liberação Pro é gravada no
  armazenamento local após o callback `verified` ou a consulta `owned`.
  Não há neste fluxo verificação própria no servidor com o Google Play
  Developer API nem sincronização confiável do direito Pro entre aparelhos.
- O perfil de avaliação libera os recursos sem pagamento. A Alpha deve manter
  esse comportamento enquanto o teste atual é concluído.

## Etapas que podem avançar agora

1. Definir a oferta real do Astra Pro: recursos exatos, periodicidades,
   preços, países, regras de teste gratuito e política de cancelamento. Não
   anunciar mês grátis até existir uma oferta correspondente no Play Console.
2. Preparar o perfil para pagamentos na conta certa, com nome legal, endereço,
   dados fiscais e bancários fornecidos pelo titular diretamente ao Google.
   A vinculação ao perfil de desenvolvedor merece revisão antes da confirmação.
3. Depois de habilitada a página de assinaturas, criar os produtos e planos-base
   com os IDs efetivamente consultados pelo aplicativo. Conferir se o modelo de
   produtos/planos-base do Console corresponde ao que o plugin consulta;
   preços e descrição precisam ser idênticos aos exibidos no app.
4. Antes de oferecer compra real, verificar no servidor o token de compra com
   o Google Play Developer API e conceder/revogar o direito Pro por conta.
   Testar compra, restauração em outro aparelho, renovação, cancelamento,
   expiração, reembolso e falha de pagamento. Usar contas marcadas como
   **testadores de licença** para compras de teste sem cobrança real. Estar na
   faixa Alpha, sozinho, não impede cobrança real.
5. Atualizar a ficha e as declarações do Play Console conforme a versão que
   realmente será enviada. Revisar acesso para avaliadores, política de
   privacidade, Segurança dos dados e direitos sobre conteúdo e imagens.

## Anúncios: preparação sem ativação

O usuário demonstrou preferência por uma leitura sem interrupções. Se optar por
anúncios, começar por uma experiência discreta fora da página de leitura,
como na estante; definir frequência e opção sem anúncios para assinantes antes
de implementar. Anúncio premiado só deve liberar um benefício descrito com
clareza, sem pressionar o usuário a assistir.

Para ativar AdMob futuramente: criar/configurar o app no AdMob, verificar o
domínio e `app-ads.txt`, usar IDs e unidades reais em configuração segura,
testar com anúncios de teste, revisar consentimento e dados coletados pelo SDK,
e atualizar a declaração **Contém anúncios**, Segurança dos dados e política
de privacidade antes de enviar o APK/AAB que efetivamente exiba anúncios.
A revisão de prontidão do AdMob depende de um app publicado/listado em loja
compatível; não contar com receita de anúncios no primeiro dia.

## Ordem de lançamento recomendada

Concluir os 12 testadores por 14 dias e corrigir os problemas relatados;
validar compra e direito Pro com testadores de licença; solicitar acesso à
produção; publicar uma versão sem anúncios se a integração de anúncios ainda
não estiver aprovada. Anúncios podem entrar numa atualização posterior após
teste e revisão das declarações. Nenhum passo acima publica produção por si.

Referências oficiais:

- [Perfil para pagamentos](https://support.google.com/googleplay/android-developer/answer/7161426)
- [Preparação do Google Play Billing](https://developer.android.com/google/play/billing/getting-ready)
- [Teste de compras e testadores de licença](https://developer.android.com/google/play/billing/test)
- [Política de pagamentos](https://support.google.com/googleplay/android-developer/answer/9858738)
- [Declaração de anúncios no Play Console](https://support.google.com/googleplay/android-developer/answer/9859455)
- [Prontidão do app no AdMob](https://support.google.com/admob/answer/10564477)
- [Verificação de `app-ads.txt`](https://support.google.com/admob/answer/9989980)
