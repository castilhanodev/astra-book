# APK de teste 4.5 pronto — 29/09/2026

O build Android #32 terminou com sucesso para o commit
`7f00d6d2cabe623e84bdc095854f3fbb9350042a` da branch
`teste/dicionario-mascote-fluidez`.

- Build: https://github.com/castilhanodev/astra-book/actions/runs/36575071678
- Pacote: https://github.com/castilhanodev/astra-book/actions/runs/36575071678/artifacts/11037410830
- Artifact: `astra-book-play-store`, 37,2 MB, contendo APK e AAB.
- SHA-256 do artifact informado pelo GitHub e conferido após o download:
  `EF3FF9A1888ABFAAA6C08D493302882A9EADD1B67509CD88A59739F63B5F0659`.
- SHA-256 do APK:
  `D01F31A7923C7DD6596B0E8086ED461D73825FA1C5B69EAB32805C6BF708C76D`.
- SHA-256 do AAB:
  `12320E8BB1B43B52FDDA91D89EB97773E1C3612915F8251F9637533E75AB8F28`.
- Manifesto: pacote `com.astrabook.app`, versão `4.5-melhorias-teste`,
  versionCode `27`, minSdk `24`, targetSdk `36`.

O `index.html` e o `patch.js` dentro do APK têm os mesmos hashes dos arquivos
reconstruídos e testados localmente. O workflow usou os Secrets de assinatura e
concluiu a etapa `validateSigningRelease`.

O AAB não foi publicado. O nome do artifact é herdado do workflow e não
significa publicação na Play Store. `main`, o site e a produção não foram
alterados.

## Testar no Android

1. Baixe o artifact e extraia `apk/release/app-release.apk` ou use a cópia
   entregue como `AstraBook-4.5-melhorias-teste.apk`.
2. Importe PDFs reais e segure palavras curtas, longas e acentuadas.
3. Confira se o dicionário recebe a palavra marcada e se as definições e
   sugestões fazem sentido.
4. Ajuste a seleção pelas duas alças. Esse é o caso que ainda divergiu no teste
   sintético do Chrome.
5. Teste zoom, mudança de página, os três modos de virada e o carregamento com
   o mascote.
6. Se algo falhar, registre livro, página, palavra, modo de virada e ações feitas
   antes do problema.

O workflow apresentou avisos de atualização das Actions e da futura mudança de
`ubuntu-latest`. Eles não impediram o build e devem ser tratados numa manutenção
separada.

## Build anterior

A versão 4.4 da correção inicial de seleção permanece no build #31:
https://github.com/castilhanodev/astra-book/actions/runs/36481932859 .
