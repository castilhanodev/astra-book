# Retomar o AstraBook em outro computador

Este arquivo substitui a necessidade de acessar a conversa anterior. O estado
técnico, as decisões e os testes ficam nesta branch do GitHub.

## Início rápido

1. Abra `https://github.com/castilhanodev/astra-book`.
2. Selecione a branch `teste/selecao-pdf`.
3. Abra uma nova tarefa no Codex associada ao repositório.
4. Envie ao Codex o texto abaixo.

```text
Continue o desenvolvimento do AstraBook pelo repositório
https://github.com/castilhanodev/astra-book, branch teste/selecao-pdf.
Antes de alterar qualquer coisa, leia AGENTS.md, CONTINUIDADE.md,
BUILD-TESTE.md e RETOMAR-EM-OUTRO-COMPUTADOR.md. Preserve a main, o site e a
Play Store: o aplicativo ainda está em testes. O próximo passo é acompanhar
meus testes do APK 4.4-pdf-teste em um aparelho Android, registrar os problemas
que eu relatar, reproduzi-los e corrigir a branch de teste. Cuide sozinho das
operações rotineiras no GitHub. Nunca publique senhas, tokens ou keystores.
```

## Estado transferido

- Repositório: `castilhanodev/astra-book`.
- Branch de trabalho: `teste/selecao-pdf`.
- Base auditada: `main` em `64927b236dd5ed9d601abe384fc3acbd3d322b39`.
- Correção principal: commit `4e98c41a61960504e26187d1c198a61038acf2c1`.
- Versão Android de teste: `4.4-pdf-teste`, versionCode `26`, pacote
  `com.astrabook.app`.
- Build aprovado: `https://github.com/castilhanodev/astra-book/actions/runs/36481932859`.
- APK/AAB: artifact `astra-book-play-store` do build acima.
- Download do artifact:
  `https://github.com/castilhanodev/astra-book/actions/runs/36481932859/artifacts/10997335319`.
- SHA-256 do ZIP informado pelo GitHub e conferido depois do download:
  `ac25b4bdae1075bfa6fbffa3b3cfa024869590fbd8f8b203ba25144880a4dadd`.
- SHA-256 do APK extraído:
  `0CE8F1AD1CB7D201A4C438E401899FEF619E66C4295199C70644618BDD421742`.
- SHA-256 do AAB extraído:
  `430DEC2F5ACCB0EA69A0A5E4718DC4144EA23DF0EAB8506174DD9013780C6C0D`.

O manifesto e o conteúdo do APK foram conferidos. `index.html` e `patch.js`
empacotados são idênticos aos arquivos que passaram nos testes locais. O build
não publicou o aplicativo na Play Store e não alterou o site.

## Testes já realizados

- 456/456 verificações de geometria passaram.
- 38/38 seleções integradas por pressão longa passaram em dois tamanhos de
  tela simulados.
- Em ambos passaram consulta da palavra no dicionário, limpeza da seleção ao
  tocar em área vazia e atualização da palavra ao ajustar o intervalo.
- Ainda falta validar toque real no WebView Android e livros reais do usuário.

## Teste que o usuário deve fazer no aparelho

1. Instalar o APK `4.4-pdf-teste` obtido no artifact.
2. Importar PDFs reais no aplicativo.
3. Segurar palavras curtas, longas, acentuadas e palavras muito próximas.
4. Abrir o dicionário e conferir se ele recebeu a palavra marcada.
5. Repetir após zoom, rolagem e mudança de página.
6. Se ocorrer erro, registrar livro, página, palavra pretendida, palavra
   selecionada e as ações realizadas antes do erro. Uma captura de tela ajuda,
   mas não é obrigatória.

## Regras de segurança e publicação

As credenciais de assinatura ficam nos GitHub Actions Secrets. Seus valores não
podem ser recuperados pela interface e nunca devem entrar em commits,
documentação ou conversa. O ZIP confidencial enviado pelo usuário permanece
fora do repositório.

O usuário autorizou que as credenciais necessárias ao projeto sejam mantidas
nessa área protegida do GitHub. Já foram confirmados pelos nomes os Secrets
`ASTRA_KEYSTORE_B64` e `ASTRA_KEYSTORE_PASSWORD`; não revelar, substituir ou
remover seus valores sem necessidade técnica. Novas credenciais devem ser
criadas como Secrets com o menor acesso necessário, jamais como arquivos do
repositório.

O aplicativo está em fase de testes. Não publicar na Play Store, não atualizar
o site e não substituir produção sem pedido explícito do usuário. Limpeza e
correções normais na branch de teste estão autorizadas.

## Documentos de referência

- `CONTINUIDADE.md`: investigação, solução, limitações e comandos de teste.
- `BUILD-TESTE.md`: build Android e artifact.
- `AGENTS.md`: regras permanentes de continuidade e preferências do usuário.
- `preparar_projeto.py`: reconstrução portátil do projeto e testes.

Esses arquivos são a fonte de continuidade entre computadores. Pastas locais,
Downloads e a sessão anterior do Codex não são necessários para retomar.
