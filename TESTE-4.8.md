# AstraBook 4.8 — seleção visual no Android

Versão Android preparada: `4.8-selecao-visual-teste`, `versionCode 30`, pacote
`com.astrabook.app`. Continua sendo uma versão de teste.

## Defeito confirmado no aparelho

O APK 4.7 reconhecia corretamente a palavra tocada, mas uma seleção longa podia
colorir e copiar palavras espalhadas pela página. A captura de 30/09 mostrou as
alças no início e no fim esperados, enquanto o intervalo continha fragmentos
alternados de muitas linhas.

A causa é a diferença entre a ordem visual do PDF e a ordem dos elementos
invisíveis usados pelo WebView. O navegador forma um `Range` pela ordem interna
desses elementos. Alguns livros desenham partes da mesma linha fora da ordem de
leitura, por isso copiar e destacar herdavam um intervalo descontínuo.

## Correção 4.8

- o Astra passa a agrupar as caixas reais das palavras por linha e ordená-las
  pela posição na página;
- seleção arrastada, alças, cópia e marca-texto usam a mesma lista visual entre
  a primeira e a última palavra;
- o intervalo não depende mais da ordem interna dos nós do PDF no Android;
- seleção de uma palavra e envio ao dicionário continuam usando o mapa de glifos;
- a tela de abertura dura aproximadamente 6,9 segundos, troca a dica a cada 2,3
  segundos e inclui dicas de leitura, backup, tela acesa e recursos Pro;
- o tutorial da estante mantém apresentação, importação e backup; foram retiradas
  explicações óbvias de estante, abas, ordenação, caderno e estatísticas;
- o tutorial do leitor mantém virada, marca-texto e zoom; foram retiradas as
  etapas de dicionário, marcador, sumário e barra de páginas.

## Testes locais

Nos viewports 900 × 900 e 390 × 844:

- 38/38 pressões longas selecionaram a palavra esperada;
- dicionário recebeu a palavra correta e pressão em margem vazia limpou a
  seleção anterior;
- a ordem dos elementos invisíveis foi invertida propositalmente antes do teste;
- mesmo com essa ordem embaralhada, a seleção por várias linhas devolveu todo o
  texto na ordem visual;
- o gesto completo de segurar e arrastar produziu o mesmo intervalo contínuo;
- com o modo marca-texto ligado, o gesto guardou o texto completo e nove faixas
  contínuas, uma por linha visual;
- zoom, quiz, sons, tela acesa, estatísticas, fechamento de abas, estante móvel,
  acesso de avaliação e ausência de Google/ anúncios continuaram aprovados.

O projeto foi reconstruído somente de `projeto.zip` e das atualizações do
repositório. Os arquivos `index.html` e `patch.js` reconstruídos coincidem por
SHA-256 com os arquivos testados, e a bateria completa passou novamente.

## Pacote portátil

A atualização é `atualizacao_i.zip`. SHA-256:
`C63453BDD6BCABEBF8EC9A3AF08FEE81A6305275C34D59EFCBC193FE12369399`.

Ainda é necessário instalar o novo APK em Android físico e repetir o gesto no
mesmo livro da captura. Não enviar o AAB à Play Store antes dessa validação e da
autorização explícita do usuário.

## Build Android verificado

O build manual #35 concluiu com sucesso no commit
`8b340f00086e79d0740568f970ca1320e0f71fbf`:
https://github.com/castilhanodev/astra-book/actions/runs/36727358743 .

Artifact `astra-book-play-store`:
https://github.com/castilhanodev/astra-book/actions/runs/36727358743/artifacts/11102703111 .
SHA-256 do ZIP informado pelo GitHub e conferido depois do download:
`28BDF2C2EBD6C76D54366157AEC4751E2E873D9555AA2799C0A2D524E0CCFE98`.

- APK: `AstraBook-4.8-selecao-visual-teste.apk`, 15.428.711 bytes, SHA-256
  `F9A073669855395AFA7F0C09D79E2C9CEFEA2F0CA6C27A7EF828F8384D18B0C7`;
- AAB: `AstraBook-4.8-selecao-visual-teste.aab`, 15.204.653 bytes, SHA-256
  `3C14C06CBCB569B6CE98150F60F1677C3390EBD3F7A522BD2D4DABA5047DD81B`.

Os arquivos web dentro do APK coincidem por SHA-256 com a reconstrução testada.
O APK usa assinatura v2 e o mesmo certificado de upload das versões 4.6 e 4.7;
SHA-256 do certificado:
`464FE4EFE945359566AE09683E949953FF828AC5EB96C6E840DAA0D8FD1C8284`.
Não há plugin de AdMob nem autenticação Google no pacote. O build não publicou
na Play Store, na `main` ou no site.
