# AstraBook — continuidade técnica

## Checkpoint 01/10/2026 — testadores Alpha

A versão 4.9 do teste fechado Alpha está ativa. A lista adicional foi publicada
e recebeu uma conta corrigida pelo usuário, aceita pelo Console. As duas listas
selecionadas somam 12 contas cadastradas. Não há endereços de testadores no
repositório. Cadastro não equivale a adesão: conferir
no painel quantas pessoas aceitaram o teste pelo link
https://play.google.com/apps/testing/com.astrabook.app . São necessárias 12
adesões contínuas por 14 dias antes de solicitar produção. Contas já inscritas
no teste interno precisam sair dele para entrar no teste fechado.

Atualizado em 30/09/2026. O usuário autorizou preparar e enviar o aplicativo ao
Google Play. Começar por uma faixa de teste, preencher a ficha e as declarações
e só promover para produção depois de cumprir os requisitos indicados pelo
Console. Branch atual: `teste/preparacao-play-store`.

## Checkpoint 4.9 — candidato para o Google Play

`atualizacao_j.zip` prepara a versão `4.9`, versionCode `31`, pacote
`com.astrabook.app`. O cadastro por e-mail foi corrigido. O direito ao Astra Pro
não é mais enviado ao Firestore nem aceito de um campo gravável pelo usuário;
ele depende do Google Play Billing. A política e a exclusão de conta foram
alinhadas ao login por e-mail, atualmente o único login em nuvem disponível.

A bateria repetiu 38/38 seleções e todos os casos extras em 900 x 900 e
390 x 844. Sintaxe, modo de avaliação, ausência de anúncios, quiz, sons, tela
acesa, zoom, abas móveis e estante foram aprovados. Consulte `TESTE-4.9.md` e
`PLAY-STORE-LISTAGEM.md`. SHA-256 de `atualizacao_j.zip`:
`765AE19C7AB4E7BC655CCFCAE5EFFC000D0B5F66D77411DE12D71BA4B7C9984E`.

No Play Console, o app foi cadastrado como `AstraBook: Leitor de Livros`, pacote
`com.astrabook.app`, idioma pt-BR, tipo App e download grátis. A versão 31
(`4.9`) está ativa na faixa de teste interno com o nome
`AstraBook 4.9 — teste interno`. A lista tem quatro contas autorizadas; os
endereços não são armazenados no repositório. Link de participação:
https://play.google.com/apps/internaltest/4701329264092446848 . Cada testador
precisa abrir o link com a mesma Conta Google cadastrada, aceitar a participação
e então instalar pela Play Store. Este teste interno não substitui o teste
fechado de 12 participantes por 14 dias exigido pelo Console antes da produção.
Para o primeiro teste, manter sem anúncios; se anúncios forem adicionados antes
da produção, atualizar o código, a política e Segurança dos dados antes de
enviar a versão pública.

O build Android #36 terminou com sucesso no commit `c669e7d`:
https://github.com/castilhanodev/astra-book/actions/runs/36736630049 . O artifact
`astra-book-play-store` tem SHA-256
`E006D35E203167ED007FFDF1639EAC4BF57F94294ED8ADBCB77FB213FC6F9509`.
O APK tem SHA-256
`AA79803163A5ADC85EE2596DE068F7F153CDAF18138A9BE0A79450D8E0C7658D` e o AAB,
`88693320F63962E5B7FDEB4B08C5E7BBE38BB4112EBB90B19766C5F073876B06`.
Manifesto, certificado de upload e conteúdo web empacotado foram conferidos;
detalhes em `TESTE-4.9.md`.

Os materiais revisados da ficha estão em `play-store/v2/`. Eles usam as telas
reais de estante, dicionário e progresso. Capas e títulos comerciais foram
substituídos por exemplos fictícios, e o texto do livro atrás do dicionário foi
desfocado. A imagem de destaque e três capturas estão prontas para o Console.

## Checkpoint 4.8 — intervalo visual independente do WebView

O teste físico do APK 4.7 confirmou que a palavra individual estava correta,
mas selecionar ou marcar várias linhas produzia fragmentos espalhados. A imagem
de 30/09 mostrou as alças nos extremos corretos e palavras alternadas coloridas
entre eles. A causa é o `Range` do WebView seguir a ordem interna dos elementos
do PDF, que pode ser diferente da ordem visual.

`atualizacao_i.zip` prepara `4.8-selecao-visual-teste`, versionCode `30`. O app
agora agrupa as caixas reais por linha, ordena as palavras pela posição e usa a
mesma lista visual para desenhar a seleção, copiar e criar o destaque. Um teste
inverte propositalmente a ordem dos elementos antes do gesto: a seleção
arrastada e o modo marca-texto ainda retornaram o texto completo e nove linhas
contínuas em 900 × 900 e 390 × 844. Os 38/38 toques individuais e as demais
verificações da 4.7 continuam aprovados.

O tutorial foi reduzido ao essencial. A abertura agora dura aproximadamente
6,9 segundos e mostra dicas a cada 2,3 segundos. A reconstrução somente pelos
arquivos do repositório repetiu toda a bateria. Consulte `TESTE-4.8.md`.

SHA-256 de `atualizacao_i.zip`:
`C63453BDD6BCABEBF8EC9A3AF08FEE81A6305275C34D59EFCBC193FE12369399`.
O APK 4.8 foi gerado; ainda falta validá-lo no mesmo aparelho e livro. Não
publicar na Play Store, `main` ou site.

O build Android #35 concluiu com sucesso no commit `8b340f0`:
https://github.com/castilhanodev/astra-book/actions/runs/36727358743 . Artifact:
https://github.com/castilhanodev/astra-book/actions/runs/36727358743/artifacts/11102703111 .
O digest do artifact foi conferido:
`28BDF2C2EBD6C76D54366157AEC4751E2E873D9555AA2799C0A2D524E0CCFE98`.
O APK tem SHA-256
`F9A073669855395AFA7F0C09D79E2C9CEFEA2F0CA6C27A7EF828F8384D18B0C7`;
o AAB,
`3C14C06CBCB569B6CE98150F60F1677C3390EBD3F7A522BD2D4DABA5047DD81B`.
Conteúdo web e assinatura foram conferidos. Main, site e Play Store não foram
alterados. Próxima etapa: repetir no aparelho o gesto que falhou na 4.7.

## Checkpoint 4.7 — candidato para avaliação e correções móveis

`atualizacao_h.zip` prepara `4.7-candidato-play-teste`, versionCode `29`. O
login Google e anúncios foram retirados do pacote; o avaliador entra pelo botão
“Testar o aplicativo sem criar conta”, recebe um perfil local com todos os
recursos liberados e não inicia cobrança. Preços fixos e a promessa de mês
grátis foram removidos: os valores vêm da Play Store.

Além das correções de seleção, zoom, quiz, sons, animação, tela acesa e páginas
válidas, a interface móvel agora fecha abas inferiores ao arrastar o topo, usa
duas colunas alinhadas na estante e mantém o botão Próxima do quiz acima da
barra de navegação do Android. Os testes passaram em 900 × 900 e 390 × 844:
38/38 seleções em cada tamanho, seleção contínua, estatística de três minutos,
quiz e reação, botão seguro, gesto da aba, estante, som, tela acesa e limite de
zoom. Consulte `TESTE-4.7.md` e `AUDITORIA-PLAY-STORE-4.7.md`.

Esta branch é candidata a teste em aparelho. Não enviar o AAB à Play Store,
não atualizar a main e não publicar o site antes da autorização explícita.

O build Android #34 concluiu com sucesso no commit `79000b7`:
https://github.com/castilhanodev/astra-book/actions/runs/36715644873 . Artifact:
https://github.com/castilhanodev/astra-book/actions/runs/36715644873/artifacts/11096047690 .
O digest do artifact foi conferido após o download:
`F54CD7E4E795FD020EA531053218980C2FA2467F2CCD902A8336CD042252D107`.
O APK tem SHA-256
`FBBAFE09A85EC314E680203A49D2E7205DE8BD1FEA2076523F55E6A19C9E8ABE`;
o AAB,
`A76670F2998241CD238F1C8CF303CF20201E27E751DDA9869D42C5AEDDD8C561`.
O conteúdo web empacotado coincide com a reconstrução testada, e o certificado
de assinatura é o mesmo usado no APK 4.6. Nenhuma publicação foi realizada.

## Checkpoint 4.6 — seleção contínua, zoom, quiz e sons

`atualizacao_g.zip` prepara `4.6-selecao-zoom-quiz-teste`, versionCode `28`.
A ordem invisível das palavras de PDFs horizontais agora segue a posição visual,
o que corrige seleções multilinha espalhadas pela ordem interna do arquivo. A
pressão longa em margem vazia não vira a página. O zoom limita resolução e
pré-carregamento em aparelhos fracos. O dicionário permite 15 palavras, abre
sem tutorial próprio, o quiz ganhou reações com o Astra e o app recebeu sons
curtos desligáveis.

Os testes passaram em dois tamanhos: 38/38 palavras e quatro verificações
adicionais, incluindo extensão e seleção multilinha. Quiz, sons, limite de 15 e
zoom 4× abaixo de 8 milhões de pixels também passaram. O projeto reconstruído
somente dos ZIPs repetiu a bateria. SHA-256 da atualização:
`0F7DFE2F696397FF40BD883D5E5380C001422A1945D95F51135371CF7E6594B5`.
Detalhes e limitações estão em `TESTE-4.6.md`.

O build Android #33 concluiu com sucesso no commit `dbe16a5`:
https://github.com/castilhanodev/astra-book/actions/runs/36608205657 . Artifact:
https://github.com/castilhanodev/astra-book/actions/runs/36608205657/artifacts/11051774233 .
Manifesto e conteúdo do APK foram conferidos. O APK tem SHA-256
`00EBF4F2B387E1A697DFF6B68A0A4F1A3262DBC0EBEB7145007EB39558E3258D`.
Não houve publicação na Play Store, no site ou na `main`.

## Estado

Base auditada: main em `64927b236dd5ed9d601abe384fc3acbd3d322b39`, Android 4.3 / versionCode 24. O HTML e o patch reconstruídos seguindo o workflow são idênticos aos do APK 4.3 fornecido. O ZIP local d, versão 4.4 / 25, não estava no GitHub e não foi adotado: sua associação proporcional à quantidade de caracteres reproduziu a troca de uma palavra larga pela palavra estreita anterior.

A atualização e substitui essa associação por um mapa do Unicode dos glifos e das posições efetivamente desenhadas pelo PDF.js 3.11.174. Mantém a camada original quando a captura é incompleta. O app limpa a seleção anterior antes de tentar outra e acompanha a palavra inicial quando o intervalo selecionado é ajustado. Preserva tecnologias, funcionalidades e infraestrutura existentes.

Versão preparada para testes Android: `4.4-pdf-teste`, versionCode `26`, pacote `com.astrabook.app`. O ZIP é código de atualização, não é um APK instalável.

## Validação

- 456 pontos de geometria passaram em um PDF controlado de duas páginas, incluindo fontes incorporadas, itálico, acentos, texto girado, zoom, diferentes resoluções e substituição do canvas.
- 38 seleções por eventos de pressão longa passaram no aplicativo no navegador, com importação real do PDF, tanto no tamanho padrão quanto em viewport 390 × 844.
- Nos dois tamanhos passaram dois casos adicionais: o dicionário recebe a palavra selecionada e a pressão em margem vazia limpa a seleção anterior. O caso sintético que estende o intervalo de “desconcertado” para “Ele” agora retorna palavra vazia neste Chrome; a mesma divergência ocorre na base anterior. Validar pelas alças em Android físico antes de considerar esse caso aprovado.
- A primeira tentativa de integração não aguardava a introdução e exigia antecipadamente uma camada que é reconstruída no primeiro toque. O teste foi corrigido. Outro caso atingia a barra de destaque que cobria texto vertical; os casos independentes agora fecham a seleção anterior antes do toque.
- Eventos sintéticos e viewport móvel não substituem o WebView e o toque em Android físico. Ainda validar num celular/tablet e em livros reais. PDFs com texto convertido em curvas ou fontes/modos não cobertos podem usar a camada original; PDFs escaneados sem texto não ganharam OCR.
- O teste direto do remendo antigo só retornou fallback; não é uma comparação da taxa de acerto do aplicativo completo.

## Retomar em casa ou no escritório

Use Git e Python 3.10 ou mais recente. Na primeira máquina, clone `https://github.com/castilhanodev/astra-book`. Use a branch `teste/preparacao-play-store`, que inclui as etapas anteriores e a correção atual separadas da main. Numa cópia existente, execute `git status` e preserve alterações locais antes de mudar de branch. Faça `git fetch origin`, selecione a branch e sincronize com `git pull --ff-only` quando o trabalho local permitir. Não use reset destrutivo.

Na raiz do repositório:

```sh
python preparar_projeto.py --testes
python -m http.server 8765 --bind 127.0.0.1 --directory work/projeto
```

Abra `http://127.0.0.1:8765/testes/harness.html` e clique em Executar testes. Para a integração abra `http://127.0.0.1:8765/www/index-teste.html` e clique em Testar gesto mobile. A cópia de teste desativa a integração Firebase. O teste importa somente o PDF controlado e cria dados locais de teste; não usa uma conta real. Escolha `--destino work/outra-copia` para reconstruir sem sobrescrever uma pasta existente.

O código editável estará em `work/projeto/www/index.html` e `work/projeto/www/patch.js`. Os testes estão em `work/projeto/testes/`. A pasta work é ignorada pelo Git: empacote mudanças em uma atualização posterior na ordenação alfabética e registre testes e decisões antes de enviar. A atualização e contém remendo.js, patch/www/index.html, patch/android/app/build.gradle e os testes. A atualização f contém as melhorias atuais de `index.html` e o build.gradle da versão `4.5-melhorias-teste`, versionCode `27`. O fluxo herdado sobrescreve o remendo da raiz pelos ZIPs; editar somente aquele arquivo não basta.

## Build e publicação

O workflow Gerar app Android extrai projeto.zip, depois atualizacao*.zip em ordem alfabética, aplica patch/ e copia remendo.js para www/patch.js. Um push na main ou acionamento manual gera APK/AAB assinados no artifact `astra-book-play-store`. Não publica na Play Store. Nesta branch, um push por si só não gera o build.

O workflow Publicar páginas tem gatilhos separados e pode atualizar o site quando projeto.zip, hosting/** ou firebase-config.js mudam na main. Não alterar esses arquivos ou acionar esse workflow nesta fase. Site existente: https://castilhanodev.github.io/astra-book/ .

O build de teste desta correção foi concluído com sucesso: https://github.com/castilhanodev/astra-book/actions/runs/36481932859 . O artifact `astra-book-play-store` tem 37,2 MB e contém APK/AAB. Download: https://github.com/castilhanodev/astra-book/actions/runs/36481932859/artifacts/10997335319 . SHA-256 informado pelo GitHub e conferido depois do download: `ac25b4bdae1075bfa6fbffa3b3cfa024869590fbd8f8b203ba25144880a4dadd`. O APK extraído tem SHA-256 `0CE8F1AD1CB7D201A4C438E401899FEF619E66C4295199C70644618BDD421742`; o AAB, `430DEC2F5ACCB0EA69A0A5E4718DC4144EA23DF0EAB8506174DD9013780C6C0D`. O manifesto confirmou pacote `com.astrabook.app`, versão `4.4-pdf-teste`, versionCode `26`, minSdk `24` e targetSdk `36`. Os arquivos `index.html` e `patch.js` empacotados coincidem com os arquivos testados. Ainda não foi validado em aparelho Android.

Assinatura usa os Secrets existentes ASTRA_KEYSTORE_B64 e ASTRA_KEYSTORE_PASSWORD. Não incluir keystore, senhas ou tokens em código, ZIPs, documentação ou conversa. Nunca copiar o arquivo confidencial de assinatura fornecido pelo usuário.

## Forma de trabalho

O usuário alterna entre dois computadores. GitHub é a referência compartilhada; sessão do navegador, Downloads e caminhos locais não são transferidos automaticamente. Para uma nova tarefa, começar por `RETOMAR-EM-OUTRO-COMPUTADOR.md`, depois ler este arquivo e `AGENTS.md`.

Economia: GPT-5.6 Sol Médio para a continuidade normal; Luna Médio para tarefas pequenas; Sol Alto somente para bugs difíceis. Evitar Astra e recomendá-lo apenas se houver evidência concreta de que Sol não é suficiente. Ao sugerir uma TROCA, explique a razão e pare: “Quando mudar, me avise que eu continuo.” Aguarde confirmação antes de trabalhar. O usuário confirmou GPT-5.6 Sol nesta etapa.

Quando houver mudança de tarefa, avisar isso explicitamente e recomendar modelo/esforço antes de começar. Se a configuração atual servir, continuar; se recomendar troca, parar até o usuário confirmar.

## Play Console em 30/09/2026

As 11 tarefas iniciais do Play Console foram concluídas. A classificação da IARC
ficou em 14 anos no Brasil e Livre/3 anos nas demais regiões exibidas, com
`Compras no Aplicativo` como único elemento interativo. A faixa fechada `Alpha`
foi configurada para o Brasil com o AAB 4.9 e a lista existente de quatro
testadores. As 14 mudanças foram enviadas à Google Play, passaram pelas
verificações automáticas sem bloqueio e a versão ficou `Em análise`. O link da
faixa fechada é https://play.google.com/apps/testing/com.astrabook.app ; usá-lo
com as contas cadastradas depois que a revisão liberar a versão.

A produção continua bloqueada até pelo menos 12 contas aceitarem participar do
teste fechado e permanecerem nele durante 14 dias. Ainda faltam oito contas e a
aceitação de todos os participantes. Não registrar os endereços neste
repositório. Assim que a revisão liberar a faixa, copiar o link de participação
do teste fechado, diferente do link do teste interno, e encaminhá-lo aos
testadores por fora do repositório.

## Etapa 4.5 preparada

`atualizacao_f.zip` melhora a honestidade e a qualidade do dicionário local, usa as poses transparentes existentes do mascote em novas reações e reduz trabalho gráfico desnecessário durante a virada de página. Leia `AUDITORIA-DICIONARIO-MASCOTE-FLUIDEZ.md` para a implementação, testes, limitações, licenças e comparação de APIs. SHA-256 do ZIP: `B03B7954B2803159B6900A783E399D9B208EA9BEF36AEAEE87607F830C89A4A8`.

O build Android #32 da versão `4.5-melhorias-teste`, versionCode `27`, foi concluído com sucesso: https://github.com/castilhanodev/astra-book/actions/runs/36575071678 . Artifact: https://github.com/castilhanodev/astra-book/actions/runs/36575071678/artifacts/11037410830 . O manifesto e os hashes do conteúdo foram conferidos; detalhes em `BUILD-TESTE.md`. O build não publicou na Play Store nem atualizou o site.

Próxima etapa técnica: instalar o APK 4.7 no celular/tablet e validar seleção arrastada, zoom, quiz, sons, fluidez, fechamento das abas, estante móvel, botão Próxima e modo de avaliação, sem publicar na Play Store. O APK local verificado está em `outputs/AstraBook-4.7-candidato-play-teste.apk` no espaço de continuidade desta máquina; em outro computador, baixar o artifact #34.
