# APK de teste pronto — 28/09/2026

O build Android #31 terminou com sucesso para o commit `4e98c41a61960504e26187d1c198a61038acf2c1` da branch `teste/selecao-pdf`.

- Build: https://github.com/castilhanodev/astra-book/actions/runs/36481932859
- Pacote: https://github.com/castilhanodev/astra-book/actions/runs/36481932859/artifacts/10997335319
- Artifact: `astra-book-play-store`, 37,2 MB, contendo APK e AAB conforme o workflow.
- SHA-256 informado pelo GitHub: `ac25b4bdae1075bfa6fbffa3b3cfa024869590fbd8f8b203ba25144880a4dadd`.
- Versão configurada: `4.4-pdf-teste`, versionCode `26`.

Baixe o ZIP em Artifacts e extraia o APK para testar no Android. O AAB é destinado à Play Store, mas não foi publicado. O nome do artifact não significa publicação. `main` e o site não foram alterados.

Ainda falta validar num celular/tablet real: importar um livro PDF, segurar palavras diferentes, consultar o dicionário, testar zoom, mudança de página e ajuste da seleção. Os testes locais passaram conforme `CONTINUIDADE.md`.

O workflow apresentou avisos de depreciação das Actions e de futura mudança da imagem `ubuntu-latest`. Eles não impediram este build e devem ser tratados depois, separadamente desta correção.
