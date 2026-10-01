# AstraBook 4.10 — correção de cadastro e entrada (candidato)

O código do app é montado a partir de `projeto.zip` e `atualizacao*.zip` na
ordem do workflow. A correção está em `atualizacao_k.zip`; mantém o pacote
`com.astrabook.app` e sobe `versionCode` para 32. A branch
`teste/correcao-login` não publica na Play Store nem no site.

## Diagnóstico em 01/10/2026

- As contas não ficam no GitHub. O Firebase Authentication do projeto
  `astra-book` guarda a identidade; o Firestore guarda os metadados de leitura;
  os PDFs e EPUBs importados ficam no aparelho.
- O método e-mail/senha está ativado no Firebase. O Console mostrava seis
  contas: três por e-mail e três antigas somente pelo Google. A versão 4.9
  desativou o botão Google; essas contas antigas não podem entrar digitando
  e-mail e uma senha que não cadastraram.
- Na versão 4.9, o botão Entrar esperava que o observador de sessão abrisse o
  perfil. Se o login fosse bem-sucedido sem nova notificação de mudança de
  usuário, o botão ficava desativado na tela de login.
- O cadastro tratava falhas posteriores de perfil, verificação de e-mail ou
  Firestore como falha de criação da conta, embora o Firebase Authentication
  já pudesse tê-la criado. Isso explicava parte dos relatos de “não salvou”.

## Alteração

O sucesso do cadastro e do login agora abre o perfil diretamente, com uma
proteção para não abrir duas vezes quando o observador também notifica. Falhas
em dados auxiliares do cadastro não apagam o estado da conta criada. Erros ao
abrir o perfil reativam o botão e mostram uma mensagem para tentar novamente.

## Validação e próximo passo

O teste `testes/auth-regression.cjs` usa Firebase simulado e verifica login sem
novo evento de sessão, cadastro com falha de metadados e restauração de sessão
após reabrir o app. Não cria contas reais.
O pacote reconstruído passou na checagem de sintaxe e na bateria de regressão
em 900 × 900 e 390 × 844 (38/38 seleções, sem falhas, em cada tamanho). Ainda é necessário testar
em um aparelho com uma conta de e-mail existente, fechar e reabrir o app, sair
e entrar de novo e conferir sincronização. Não limpe os dados nem desinstale
o app dos testadores antes de verificar o que permanece apenas no aparelho.

O teste fechado atual permanece na versão 4.9 até que uma nova versão seja
enviada explicitamente à faixa Alpha. A atualização pelo Google Play, mantendo
o mesmo identificador e assinatura do app, normalmente preserva os dados
locais; limpar dados ou desinstalar pode apagar livros importados que não
estejam armazenados na nuvem.
