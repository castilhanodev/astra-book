# AstraBook 4.7 — candidato de teste

Versão Android preparada: `4.7-candidato-play-teste`, `versionCode 29`, pacote
`com.astrabook.app`. Continua sendo uma versão de teste.

## Mudanças

- seleção arrastada em PDF tolera os espaços entre linhas e eventos de toque
  agrupados pelo WebView;
- quiz abre em tela inteira e mantém feedback visual e sonoro;
- áudio é desbloqueado na primeira interação e ganhou botão de teste;
- viradas Médio e 3D usam transformações aceleradas e evitam recortes caros a
  cada quadro;
- abertura dura cerca de 4,6 segundos, mostra dicas rotativas do plano e uma
  animação de entrada espacial;
- opção para manter a tela ligada durante a leitura, ativa por padrão;
- página só entra nas estatísticas depois de três minutos e uma única vez por
  livro/página; novas conquistas usam 10, 100 e 1.000 páginas válidas;
- login Google e anúncios foram retirados desta versão;
- acesso de teste sem conta permanece disponível;
- o acesso de avaliação cria um perfil próprio, libera livros, dicionário,
  destaques, temas e perfis sem iniciar compra ou simular assinatura;
- preços de assinatura deixam de usar valores fixos de demonstração e passam a
  vir da Play Store;
- abas inferiores de perfil, dicionário e menus podem ser fechadas arrastando
  uma área maior no topo, inclusive no Android;
- a estante móvel usa duas colunas estáveis e o cartão de importação fica
  alinhado com as capas;
- o botão Próxima do quiz sobe para uma área segura, acima da navegação do
  celular;
- backup automático do Android foi desativado.

## Testes locais

Nos viewports 900 × 900 e 390 × 844:

- 38/38 pressões longas selecionaram a palavra esperada;
- seleção direta, dicionário, limpeza em margem vazia e intervalo visual entre
  várias linhas passaram;
- o gesto completo de segurar e arrastar por várias linhas produziu intervalo
  contínuo;
- uma página com 181 segundos contou uma vez; repetir a virada na mesma página
  não aumentou o total;
- quiz ocupou pelo menos 95% da tela e mostrou reação;
- o botão Próxima permaneceu visível e clicável acima da área reservada à
  navegação móvel;
- o arraste de 130 px no topo fechou a aba de perfil;
- o cartão de importação permaneceu dentro da grade e não criou rolagem
  horizontal;
- opções de som, teste de som e tela acesa foram encontradas;
- botão Google não apareceu, o acesso local apareceu e o módulo de anúncios não
  existe no aplicativo;
- zoom 4× ficou abaixo de 8 milhões de pixels em perfil de aparelho fraco.

O `npm ci` e o `npx cap sync android` concluíram. A sincronização encontrou
somente App, Local Notifications e Play Billing; não encontrou AdMob nem o
plugin de autenticação Google.

Ainda falta validar o APK em um Android físico antes de enviar o AAB à faixa de
teste da Play Store.

## Pacote portátil

A atualização reconstruída e testada é `atualizacao_h.zip`. SHA-256:
`1C817A87D7D59A6CC5F5169C6D61E37E06C006A0BA82F84BF081F5FAE9B9D541`.

