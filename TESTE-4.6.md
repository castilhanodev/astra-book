# AstraBook 4.6 — seleção, zoom, quiz e sons

Atualizado em 29/09/2026. Branch `teste/selecao-zoom-quiz`. O aplicativo segue
em testes; esta etapa não publica na Play Store, não altera o site e não muda a
`main`.

## Alterações

- A camada invisível do PDF agora ordena páginas horizontais pela posição
  visual: linhas de cima para baixo e palavras da esquerda para a direita. Isso
  corrige o intervalo espalhado por palavras sem relação quando a ordem interna
  de desenho do PDF difere da ordem de leitura.
- Pressionar por alguns instantes uma margem vazia limpa a seleção, mas não vira
  a página por engano.
- Em aparelhos com até 4 GB de memória ou 4 núcleos, o PDF limita o canvas a 8
  milhões de pixels, adia a renderização em alta resolução durante o gesto e não
  prepara páginas vizinhas durante zoom. Nos demais aparelhos, o teto é 14
  milhões de pixels.
- O plano grátis passa de 10 para 15 consultas diferentes ao dicionário.
- O dicionário abre sem a sequência própria de instruções. No tutorial geral,
  somente “Traga os seus livros” espera 3 segundos; os demais passos podem ser
  avançados imediatamente.
- O quiz mostra o Astra em cada pergunta, barra de progresso, reação visual
  verde/vermelha, mensagem clara de acerto/erro e animação do mascote.
- Foram adicionados efeitos sonoros leves gerados pelo próprio aparelho para a
  abertura cósmica, virada de página e respostas do quiz. Eles não usam músicas
  nem arquivos de terceiros e podem ser desligados em Aparência e leitura.

## Versão e pacote

`atualizacao_g.zip` prepara `4.6-selecao-zoom-quiz-teste`, versionCode `28`,
pacote `com.astrabook.app`. SHA-256:
`0F7DFE2F696397FF40BD883D5E5380C001422A1945D95F51135371CF7E6594B5`.

O ZIP contém `remendo.js`, `patch/www/index.html`, o `build.gradle` e testes
portáteis. O projeto reconstruído pelo `preparar_projeto.py` produziu
`index.html` e `patch.js` idênticos, por SHA-256, aos arquivos testados.

## Validação local

- Sintaxe aprovada nos dois scripts inline e no remendo.
- 38/38 pressões longas acertaram a palavra em 900 × 900 e 390 × 844.
- Nos dois tamanhos passaram: dicionário com a palavra correta, margem vazia,
  extensão de “desconcertado” para “Ele” e seleção de várias linhas na ordem
  visual completa.
- A seleção multilinha gerou nove faixas em 900 × 900 e oito em 390 × 844, sem
  palavras visualmente espalhadas fora do intervalo.
- O quiz abriu com mascote e progresso e mostrou reação após uma resposta.
- O botão de sons desligou, ligou e preservou a configuração.
- O limite exposto pelo aplicativo foi 15 palavras.
- Com zoom 4× no perfil simulado de aparelho fraco, o canvas ficou em 5.038.848
  pixels na tela grande e 1.825.200 pixels na tela móvel, ambos abaixo do teto
  de 8 milhões.
- A mesma bateria passou no projeto reconstruído exclusivamente dos arquivos do
  repositório, comprovando a portabilidade do teste.

## Limites do teste

Chrome com toque simulado não substitui o Android WebView. Validar no tablet do
usuário com o PDF real, principalmente arrastar de uma palavra até outra em
várias linhas, zoom por pinça e fluidez. PDFs escaneados sem camada de texto
continuam sem seleção; páginas com texto vertical ou orientação incomum mantêm
a ordem original para evitar uma reordenação incorreta.

O próximo passo automatizado é gerar o APK/AAB pelo workflow manual da branch e
conferir manifesto e hashes. O APK é apenas para teste. Publicar na Play Store
continua dependendo de pedido explícito do usuário.
