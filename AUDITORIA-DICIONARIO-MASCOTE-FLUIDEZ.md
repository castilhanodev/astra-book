# AstraBook — dicionário, mascote e fluidez

Atualizado em 29/09/2026. O aplicativo permanece em testes. Esta etapa não
publica na Play Store, não altera o site e não muda a `main`.

## Alterações preparadas

A branch `teste/dicionario-mascote-fluidez` contém `atualizacao_f.zip`, que é
aplicada depois da atualização da seleção em PDF. Ela prepara a versão Android
`4.5-melhorias-teste`, versionCode `27`.

- O dicionário mostra primeiro uma definição real. Sinônimos deixaram de ser
  apresentados como “significado em palavras simples”.
- As sugestões são identificadas como sugestões e o aplicativo avisa que elas
  podem não preservar o sentido em todo contexto.
- O filtro prioriza termos com frequência conhecida e confirmação pela
  definição ou por mais de uma relação da base. Isso reduz entradas raras,
  concatenadas e grupos amplos demais.
- O Astra usa as imagens transparentes já existentes no aplicativo. Ele reage
  no tutorial, aparece enquanto uma página é preparada e comemora conquistas.
  As animações usam transformações leves e respeitam `prefers-reduced-motion`.
- A virada de página mantém a otimização gráfica durante a animação final. No
  modo de deslizar, a sombra de borda usa uma camada pequena com mudança de
  opacidade, em vez de recalcular a sombra da página inteira a cada movimento.

O vídeo e o JPEG enviados pelo usuário foram analisados. O JPEG tem fundo
quadriculado incorporado e o vídeo reutiliza as mesmas seis poses. O projeto já
possui essas seis poses como PNGs transparentes (`acenando`, `apontando`,
`comemorando`, `joia`, `livro` e `lupa`), portanto não foi necessário adicionar
um vídeo pesado nem gerar outro desenho nesta etapa.

## Testes locais

- Sintaxe aprovada nos dois scripts inline do aplicativo.
- O projeto reconstruído pelo mesmo processo do workflow contém exatamente o
  `index.html` testado.
- 38/38 pressões longas selecionaram a palavra esperada nos viewports 900 × 900
  e 390 × 844.
- Nos dois tamanhos, o dicionário recebeu a palavra selecionada e a pressão em
  área vazia removeu a seleção anterior.
- O caso “feliz” apresentou a definição “Próspero; afortunado: um ano feliz.” e
  reduziu as sugestões principais para “afortunado” e “próspero”.
- O carregamento com o mascote e o CSS das reações do tutorial foram validados.
- Um teste sintético que estende a seleção de “desconcertado” para “Ele” está
  retornando palavra vazia no Chrome desta máquina, tanto na base anterior
  quanto nesta versão. As seleções diretas continuam 38/38. O ajuste pelas
  alças precisa ser conferido em Android físico; não considerar esse caso
  aprovado até lá.
- Uma comparação sintética com limitação de CPU não mediu regressão de quadros.
  Ela não comprova melhora no WebView Android; a verificação final depende do
  aparelho.

SHA-256 de `atualizacao_f.zip`:
`B03B7954B2803159B6900A783E399D9B208EA9BEF36AEAEE87607F830C89A4A8`.

## Por que o dicionário atual falha

As definições offline vêm do Dicionário Aberto, baseado em uma obra histórica
de 1913. A linguagem pode ser antiga e mais próxima do português europeu. Os
sinônimos foram agregados automaticamente de vários recursos. A própria
documentação acadêmica do Onto.PT informa que um recurso automático não é 100%
confiável. A reclamação do usuário sobre significados antigos e sinônimos sem
relação com a frase é compatível com a estrutura encontrada.

O repositório citava licenças apenas num comentário de código. Antes da versão
de produção, deve existir uma tela ou arquivo de créditos com as versões exatas
das fontes, seus avisos e licenças. Não basta escrever apenas “fontes livres”.

## Opções para a próxima versão

Não é necessário comprar uma API antes de testar. A sequência recomendada é:

1. Validar esta correção local em PDFs reais.
2. Testar o sandbox da Oxford e a avaliação da Lexicala com um conjunto de
   palavras reais que hoje falham.
3. Comparar qualidade, latência, direito de uso comercial e regras de cache.
4. Contratar somente depois de confirmar por escrito que a consulta é permitida
   dentro de um leitor de livros.

A Lexicala é o candidato pago de menor entrada pública: informa planos a partir
de US$ 20/mês, português do Brasil e de Portugal, definições, sinônimos e
morfologia. Seus termos restringem cache local e pedem consentimento prévio
para produtos que sejam dicionários independentes. O AstraBook usa o recurso
como parte auxiliar do leitor, mas essa interpretação deve ser confirmada pela
fornecedora.

A Oxford Languages oferece português, definições, tesauro, flexões e exemplos,
com sandbox de 500 chamadas. O preço comercial exige contato. É a opção a
comparar quando a prioridade for curadoria e atualização contemporânea.

Uma solução apenas aberta pode combinar Wiktionary, Onto.PT e OpenWordNet-PT,
mas exige curadoria própria, atribuição e cumprimento de licenças
compartilha-igual quando aplicáveis. OpenThesaurus.de não resolve português e
Datamuse não oferece vocabulário em português.

Se uma API for adotada, a chave deve ficar num backend (por exemplo, Cloud
Function) e nos Secrets do deploy, nunca dentro do APK. O aplicativo deve enviar
o menor contexto possível. Se uma frase do livro for transmitida, isso precisa
ser explicado na política de privacidade e na declaração de segurança de dados
da Play Store.

## Referências verificadas

- [Política de propriedade intelectual do Google Play](https://support.google.com/googleplay/android-developer/answer/9888072?hl=en)
- [Política de dados do usuário do Google Play](https://support.google.com/googleplay/android-developer/answer/10144311?hl=en)
- [Dicionário Aberto](https://dicionario-aberto.net/)
- [Onto.PT — downloads e licença](https://ontopt.dei.uc.pt/index.php?sec=downloads)
- [Artigo do Onto.PT sobre a construção automática](https://aclanthology.org/W14-0103.pdf)
- [Licenças dos dicionários LibreOffice pt_PT](https://github.com/LibreOffice/dictionaries/blob/master/pt_PT/LICENSES.txt)
- [Diretrizes de aplicativos Wikimedia](https://foundation.wikimedia.org/wiki/Legal%3AWikimedia_Developer_App_Guidelines)
- [Oxford Languages API](https://languages.oup.com/products/api/)
- [Lexicala — planos e termos](https://api.lexicala.com/sign-up/)
- [Lexicala — documentação](https://api.lexicala.com/documentation/)

