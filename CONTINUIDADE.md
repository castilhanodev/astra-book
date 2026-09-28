# AstraBook — correção de seleção em PDF

Atualizado em 28/09/2026. Projeto em testes: não publicar na Play Store nem atualizar site/produção sem pedido explícito do usuário.

## Estado

Base auditada: main em `64927b236dd5ed9d601abe384fc3acbd3d322b39`, Android 4.3 / versionCode 24. O HTML e o patch reconstruídos seguindo o workflow são idênticos aos do APK 4.3 fornecido. O ZIP local d, versão 4.4 / 25, não estava no GitHub e não foi adotado: sua associação proporcional à quantidade de caracteres reproduziu a troca de uma palavra larga pela palavra estreita anterior.

A atualização e substitui essa associação por um mapa do Unicode dos glifos e das posições efetivamente desenhadas pelo PDF.js 3.11.174. Mantém a camada original quando a captura é incompleta. O app limpa a seleção anterior antes de tentar outra e acompanha a palavra inicial quando o intervalo selecionado é ajustado. Preserva tecnologias, funcionalidades e infraestrutura existentes.

Versão preparada para testes Android: `4.4-pdf-teste`, versionCode `26`, pacote `com.astrabook.app`. O ZIP é código de atualização, não é um APK instalável.

## Validação

- 456 pontos de geometria passaram em um PDF controlado de duas páginas, incluindo fontes incorporadas, itálico, acentos, texto girado, zoom, diferentes resoluções e substituição do canvas.
- 38 seleções por eventos de pressão longa passaram no aplicativo no navegador, com importação real do PDF, tanto no tamanho padrão quanto em viewport 390 × 844.
- Nos dois tamanhos passaram os três casos adicionais: dicionário recebe a palavra selecionada; pressão em margem vazia limpa a seleção; ajuste do intervalo atualiza a palavra consultada.
- A primeira tentativa de integração não aguardava a introdução e exigia antecipadamente uma camada que é reconstruída no primeiro toque. O teste foi corrigido. Outro caso atingia a barra de destaque que cobria texto vertical; os casos independentes agora fecham a seleção anterior antes do toque.
- Eventos sintéticos e viewport móvel não substituem o WebView e o toque em Android físico. Ainda validar num celular/tablet e em livros reais. PDFs com texto convertido em curvas ou fontes/modos não cobertos podem usar a camada original; PDFs escaneados sem texto não ganharam OCR.
- O teste direto do remendo antigo só retornou fallback; não é uma comparação da taxa de acerto do aplicativo completo.

## Retomar em casa ou no escritório

Use Git e Python 3.10 ou mais recente. Na primeira máquina, clone `https://github.com/castilhanodev/astra-book`. Use a branch `teste/selecao-pdf`, onde esta correção fica separada da main. Numa cópia existente, execute `git status` e preserve alterações locais antes de mudar de branch. Faça `git fetch origin`, selecione a branch e sincronize com `git pull --ff-only` quando o trabalho local permitir. Não use reset destrutivo.

Na raiz do repositório:

```sh
python preparar_projeto.py --testes
python -m http.server 8765 --bind 127.0.0.1 --directory work/projeto
```

Abra `http://127.0.0.1:8765/testes/harness.html` e clique em Executar testes. Para a integração abra `http://127.0.0.1:8765/www/index-teste.html` e clique em Testar gesto mobile. A cópia de teste desativa a integração Firebase. O teste importa somente o PDF controlado e cria dados locais de teste; não usa uma conta real. Escolha `--destino work/outra-copia` para reconstruir sem sobrescrever uma pasta existente.

O código editável estará em `work/projeto/www/index.html` e `work/projeto/www/patch.js`. Os testes estão em `work/projeto/testes/`. A pasta work é ignorada pelo Git: empacote mudanças em uma atualização posterior na ordenação alfabética e registre testes e decisões antes de enviar. A atualização e contém remendo.js, patch/www/index.html, patch/android/app/build.gradle e os testes. O fluxo herdado sobrescreve o remendo da raiz pelos ZIPs; editar somente aquele arquivo não basta.

## Build e publicação

O workflow Gerar app Android extrai projeto.zip, depois atualizacao*.zip em ordem alfabética, aplica patch/ e copia remendo.js para www/patch.js. Um push na main ou acionamento manual gera APK/AAB assinados no artifact `astra-book-play-store`. Não publica na Play Store. Nesta branch, um push por si só não gera o build.

O workflow Publicar páginas tem gatilhos separados e pode atualizar o site quando projeto.zip, hosting/** ou firebase-config.js mudam na main. Não alterar esses arquivos ou acionar esse workflow nesta fase. Site existente: https://castilhanodev.github.io/astra-book/ .

Último build da base consultado: https://github.com/castilhanodev/astra-book/actions/runs/36410912208 . Não confundir seu artifact com esta correção. Nenhum APK novo foi validado em aparelho até este registro.

Assinatura usa os Secrets existentes ASTRA_KEYSTORE_B64 e ASTRA_KEYSTORE_PASSWORD. Não incluir keystore, senhas ou tokens em código, ZIPs, documentação ou conversa. Nunca copiar o arquivo confidencial de assinatura fornecido pelo usuário.

## Forma de trabalho

O usuário alterna entre dois computadores. GitHub é a referência compartilhada; sessão do navegador, Downloads e caminhos locais não são transferidos automaticamente. Leia este arquivo e AGENTS.md antes de continuar.

Economia: Sol Médio/Alto para manutenção; Luna Médio para tarefas pequenas; Astra Alto para investigação difícil. Ao sugerir uma TROCA, explique a razão e pare: “Quando mudar, me avise que eu continuo.” Aguarde confirmação antes de trabalhar. O usuário confirmou Sol nesta etapa.

Próxima etapa técnica: gerar APK de teste desta branch pelo workflow Android e validar pressão longa, seleção e dicionário em celular/tablet com livros reais, sem publicar na Play Store.
