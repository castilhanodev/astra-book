# AstraBook — auditoria para Google Play (candidato 4.7)

Atualizada em 29/09/2026. Esta é uma revisão técnica de conformidade do código e
do fluxo de publicação. O aplicativo continua em testes; não houve publicação
na Play Store, no site nem na `main`.

## Resultado

O candidato 4.7 ainda não deve ir para produção. Ele já pode seguir para build e
teste fechado depois da validação no aparelho, mas há decisões cadastrais e de
conteúdo que precisam ser concluídas antes do envio para produção.

## Correções aplicadas nesta versão

- O login nativo com Google foi desativado e sua dependência Android removida.
  O acesso por e-mail continua disponível e há um botão claro para testar sem
  criar conta.
- Toda a implementação de anúncios foi retirada: SDK AdMob, identificador de
  demonstração, intersticial, vídeo premiado e textos que prometiam remoção de
  anúncios. Para este pacote, a resposta no Play Console deve ser **não contém
  anúncios**.
- A oferta do Astra Pro deixou de prometer “1 mês grátis” sem confirmação. A
  tela agora informa que preço e condições finais aparecem na Play Store antes
  da compra.
- `android:allowBackup` foi desligado para evitar que arquivos locais dos livros
  entrem no backup Android fora do fluxo descrito pelo aplicativo.
- O pacote mantém `targetSdk 36`, exigido para novos apps e atualizações desde
  31/08/2026, e usa `versionCode 29`.
- A conta pode ser excluída dentro do aplicativo e existe uma página web de
  exclusão, como exige a política para apps que permitem criar conta.
- O avaliador consegue entrar sem credenciais pelo botão “Testar o aplicativo
  sem criar conta”. Esse modo cria um perfil de avaliação, libera os recursos
  sujeitos a limite e não inicia compras. Isso deve ser descrito em **App
  access** no Play Console.
- Valores fixos de demonstração foram retirados dos planos. O aplicativo usa o
  preço retornado pela Play Store; se ele não estiver disponível, mostra “Ver
  preço na Play Store”.

## Pendências antes de produção

### 1. Responsável e política de privacidade

A política publicada ainda identifica Nicolas Machado Castilhano e o e-mail do
desenvolvimento anterior. Antes da produção, o responsável legal e o contato de
suporte precisam ser confirmados e atualizados no site, no aplicativo e na ficha
da loja. A política também menciona login Google, que foi removido deste pacote.

O formulário **Data safety** deve refletir o comportamento real: nome, e-mail,
perfil, dados de leitura, destaques, notas e palavras podem ser sincronizados
pelo Firebase quando a pessoa cria conta; os arquivos PDF/EPUB/TXT permanecem
locais. Compras são processadas pela Google Play e lembretes usam notificações
locais. A política e o formulário precisam dizer a mesma coisa.

Referências: [User data](https://support.google.com/googleplay/android-developer/answer/10144311?hl=en-GB) e [Account deletion](https://support.google.com/googleplay/android-developer/answer/13327111?hl=en).

### 2. Assinaturas

O código usa o sistema de cobrança da Google Play, que é a forma correta para
recursos digitais. Ainda é necessário conferir no Play Console se os produtos
`astra_pro_mensal`, `astra_pro_trimestral` e `astra_pro_anual` existem, estão
ativos, têm preços corretos e oferecem exatamente as condições mostradas. Não
deve ser anunciada avaliação gratuita até ela existir como oferta cadastrada.

Também deve ser testado comprar, restaurar, cancelar, expirar e trocar de plano.
O aplicativo já contém um caminho para gerenciar a assinatura na Play Store.
O modo de avaliação ignora os limites somente no perfil criado pelo botão de
teste e informa expressamente que nenhuma compra será iniciada.

Referências: [Payments](https://support.google.com/googleplay/android-developer/answer/9858738?hl=en) e [Subscriptions](https://support.google.com/googleplay/android-developer/answer/9900533?hl=en).

### 3. Público-alvo

O mascote, o quiz e as recompensas podem chamar a atenção de crianças, embora a
política atual diga que o app não é dirigido a menores de 13 anos. É necessário
escolher com precisão o público no Play Console. Se forem incluídas faixas
infantis, passam a valer as regras de Families, inclusive privacidade e
monetização específicas. Para o primeiro lançamento, a ficha da loja e o
público declarado devem corresponder ao uso realmente pretendido.

Referência: [Target audience and content](https://support.google.com/googleplay/android-developer/answer/9867159?hl=en).

### 4. Direitos autorais e licenças

O leitor não distribui livros; ele abre arquivos escolhidos pelo usuário e os
mantém no aparelho. A ficha da loja não deve sugerir que livros protegidos estão
incluídos, nem usar capas ou trechos de terceiros sem permissão.

O dicionário offline usa dados históricos do Dicionário Aberto e relações do
Onto.PT. Antes da produção, o aplicativo precisa exibir créditos e licenças das
bases, bibliotecas, fontes e demais recursos. Também deve ser guardada prova de
autoria ou licença comercial do mascote e das imagens usadas na loja. A política
do Google exige direitos sobre todo o conteúdo do app e da ficha.

Referência: [Intellectual property](https://support.google.com/googleplay/android-developer/answer/9888072?hl=en).

### 5. Cadastro e testes da conta de desenvolvedor

É preciso abrir o Play Console para confirmar o tipo e a data de criação da
conta, concluir App content, Data safety, público-alvo, classificação IARC,
política de privacidade e acesso do avaliador. Contas pessoais criadas depois de
13/11/2023 precisam de teste fechado com pelo menos 12 participantes inscritos
continuamente por 14 dias antes de solicitar acesso à produção.

Referências: [Testing requirements](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en), [Prepare your app for review](https://support.google.com/googleplay/android-developer/answer/9859455?hl=en) e [Content ratings](https://support.google.com/googleplay/android-developer/answer/9898843?hl=en).

### 6. Validação final no Android

Os testes automatizados passaram, mas ainda é obrigatório testar o APK em
celular e tablet reais: seleção longa em PDFs diferentes, zoom, viradas Médio e
3D, som, tela acesa, login por e-mail, exclusão de conta, compra de teste e
restauração. Só depois desse retorno o AAB deve ser enviado ao teste fechado.

## Teste fechado não publica o site

Enviar um AAB a uma faixa de teste interno ou fechado da Play Store não altera o
site do GitHub Pages e não libera o aplicativo ao público. O site só muda pelo
workflow separado de páginas do GitHub. É possível instalar o pacote nos
testadores, corrigir o código e enviar novos `versionCode` antes de criar uma
versão de produção.

## Dependências

`npm audit` encontrou três avisos moderados em `@capacitor/cli` → `xcode` →
`uuid`. Essa cadeia é ferramenta de desenvolvimento para gerar projetos iOS e
não é empacotada como código executado pelo aplicativo Android. Não há aviso
alto ou crítico. A correção automática indicada faria downgrade do Capacitor e
não foi aplicada sem um teste de compatibilidade.
