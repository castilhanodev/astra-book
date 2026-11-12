# Astra Book — passagem para o proximo chat

Atualizado em 11/11/2026. Repositorio: `https://github.com/castilhanodev/astra-book`, branch `main`.

## O que e o aplicativo

Leitor Android de PDF, EPUB e TXT, feito com Capacitor. Ha login, biblioteca e perfis, limites do plano gratis, tela do Astra Pro e integracao de anuncios. O usuario pretende publicar pela Google Play. Os tres planos desejados sao mensal, trimestral e anual, com uma oferta de um mes gratis seguida de cobranca recorrente, se configurada e apresentada pela propria Play Store.

## Como este repositorio monta o aplicativo

O projeto base esta em `projeto.zip`. Os arquivos `atualizacao*.zip` sao aplicados em ordem pelo workflow `.github/workflows/build.yml`. A pasta `patch/` e a camada final de alteracoes: o workflow a copia por cima do projeto montado. `remendo.js` vira `www/patch.js`. Para alterar uma tela ou configuracao que precise aparecer no proximo build, modifique o arquivo correspondente em `patch/` ou altere o fluxo de montagem; editar apenas uma pasta local montada nao muda o GitHub.

O workflow instala as dependencias, gera as pontes nativas de compras e anuncios, sincroniza o Android, configura a versao 5.0 (codigo 32) depois da sincronizacao, gera AAB e APK assinados e publica ambos como artefatos da execucao no GitHub Actions. A assinatura usa segredos configurados no GitHub; nunca coloque chaves ou senhas em commits, documentos ou no chat.

## Estado do codigo no GitHub

- A interface principal e os limites gratis estao em `patch/www/index.html`: tres importacoes de PDF, dez consultas de dicionario e vinte destaques por perfil. Anuncios premiados oferecem mais creditos. A quantidade e os textos precisam ser conferidos no aplicativo antes de publicar.
- `patch/www/ads-config.js` tem IDs publicos de AdMob, `enabled: true` e `test: true`. Assim, o build do GitHub permanece em modo de anuncios de teste. `patch/scripts/ads-bridge.js` integra o plugin nativo.
- `patch/www/billing-config.js` declara os produtos `astra_pro_mensal`, `astra_pro_trimestral` e `astra_pro_anual`, mas mantem `enabled: false` e `validatorUrl: ''`. Portanto, a compra real ainda nao esta habilitada. A interface e a integracao inicial estao em `patch/www/index.html` e `patch/scripts/purchase-bridge.js`.
- O fluxo de compra espera um validador HTTPS para conferir o recibo com a Google Play. O repositorio nao contem esse servico. Nao ative a cobranca apenas mudando `enabled`: antes e necessario validar o recibo no servidor, vincular a compra a conta, conferir expirar/cancelar/restaurar e testar no dispositivo instalado pela Play Store. O estado Pro no aplicativo e guardado localmente; isso, sozinho, nao e uma protecao suficiente contra alteracao local.
- O workflow de build esta em `.github/workflows/build.yml`. Os artefatos aparecem em **Actions > Gerar app Android > execucao > Artifacts**. Um AAB/APK gerado nao e uma publicacao automatica na Play Store.

## Estado de publicacao observado

Na ultima verificacao da Play Console em 11/11/2026, os requisitos do teste fechado estavam concluidos e a opcao **Solicitar a producao** estava disponivel. Isso nao significa que o acesso a producao foi concedido. Reabrir a Play Console para confirmar o estado atual e, quando apropriado, enviar ou acompanhar a solicitacao. Nao afirmar que o app ja pode ser lancado apenas pelo tempo decorrido.

Os produtos de assinatura, a oferta de teste gratis, a analise do AdMob, os formularios da loja e as compras reais precisam de verificacao atual nos respectivos consoles. Nao presumir que estados antigos ainda sao validos.

## Diferenca importante no computador local

As pastas locais `current/`, `source/` e `update_*` nao sao acompanhadas pelo Git. Em 11/11/2026, `current/www/ads-config.js` tinha `test: false`, enquanto `patch/www/ads-config.js`, usado pelo GitHub Actions, tinha `test: true`. Nao copiar essa diferenca para o patch sem validar a integracao de anuncios e a aprovacao de producao. Essas pastas podem conter arquivos gerados ou dados sensiveis; revisar antes de qualquer envio.

## Proximos passos recomendados

1. Confirmar no Play Console o acesso a producao e a situacao dos tres produtos e de suas ofertas de um mes gratis.
2. Implementar e implantar a validacao de compras pelo servidor usando a API da Google Play, sem expor credenciais no app ou no repositorio. Proteger a vinculacao entre compra e conta e a atualizacao de direitos.
3. Testar em um Android com a versao instalada pela Play Store: login, logout, importacao, limites, anuncios premiados, compra, restauracao, cancelamento e expiracao.
4. Conferir o AdMob e so trocar anuncios de teste pelos reais quando a conta e o app estiverem prontos para producao.
5. Fazer um novo build e conferir o AAB final e a listagem da loja antes da publicacao.

## Como continuar

Abra este repositorio na branch `main`, leia este arquivo e inspecione `patch/` e `.github/workflows/build.yml`. Trabalhe em uma branch ou checkout separado, confira `git status` antes de cada commit e evite incluir `current/`, `source/`, `update_*` ou segredos por acidente. Para ver o estado atual dos servicos, abra Play Console e AdMob; o codigo nao substitui a verificacao desses paineis.

