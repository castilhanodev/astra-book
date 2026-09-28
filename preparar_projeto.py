"""Reconstroi o projeto usando a mesma ordem do workflow, sem usar credenciais.
Python 3.10+. Execute da copia do repositorio, em qualquer computador.
"""
import argparse
import json
import shutil
import stat
import subprocess
import zipfile
from pathlib import Path

root = Path(__file__).resolve().parent
parser = argparse.ArgumentParser()
parser.add_argument('--destino', default='work/projeto', help='Pasta NOVA dentro deste repositorio')
parser.add_argument('--testes', action='store_true', help='Cria pagina local de teste com Firebase desativado')
args = parser.parse_args()
destination = (root / args.destino).resolve()
if not destination.is_relative_to(root) or destination == root:
    raise SystemExit('O destino precisa ser uma subpasta do repositorio.')
if destination.exists():
    raise SystemExit('Destino existente: preserve suas alteracoes e escolha --destino work/outro-nome.')
if not (root/'projeto.zip').is_file():
    raise SystemExit('Execute este arquivo na raiz de uma copia completa do repositorio.')
destination.mkdir(parents=True)
# The workflow also starts with the root remendo before extracting updates.
if (root/'remendo.js').is_file():
    shutil.copy2(root/'remendo.js', destination/'remendo.js')
archives = [root/'projeto.zip', *sorted(root.glob('atualizacao*.zip'), key=lambda p:p.name)]
for archive in archives:
    with zipfile.ZipFile(archive) as z:
        for entry in z.infolist():
            target = (destination/entry.filename).resolve()
            if not target.is_relative_to(destination) or stat.S_ISLNK(entry.external_attr >> 16):
                raise SystemExit(f'Entrada de ZIP insegura em {archive.name}')
            if entry.is_dir():
                target.mkdir(parents=True,exist_ok=True)
            else:
                target.parent.mkdir(parents=True,exist_ok=True)
                with z.open(entry) as src, target.open('wb') as dst:
                    shutil.copyfileobj(src,dst)
patch = destination/'patch'
if patch.is_dir():
    shutil.copytree(patch,destination,dirs_exist_ok=True)
if (destination/'remendo.js').is_file():
    shutil.copy2(destination/'remendo.js',destination/'www/patch.js')
# Same firebase-config copy as cap-sync step; no credentials are printed.
shutil.copy2(destination/'firebase-config.js',destination/'www/firebase-config.js')
if args.testes:
    html=(destination/'www/index.html').read_text(encoding='utf8')
    html=html.replace('<script src="firebase-config.js"></script>',
                      '<script>window.ASTRA_FIREBASE=null;window.__semTutorial=true;</script>')
    anchor='\n})();\n</script>\n\n<script>'
    if html.count(anchor)!=1:
        raise SystemExit('O fechamento do app mudou; revise a integracao do teste.')
    test=(destination/'testes/integration-test.js').read_text(encoding='utf8')
    html=html.replace(anchor,'\n'+test+anchor)
    (destination/'www/index-teste.html').write_text(html,encoding='utf8')
try:
    commit=subprocess.check_output(['git','-C',str(root),'rev-parse','HEAD'],text=True).strip()
except (FileNotFoundError,subprocess.CalledProcessError):
    commit='copia sem historico Git'
(destination/'ORIGEM.json').write_text(json.dumps({'commit':commit,'arquivos':[p.name for p in archives]},indent=2),encoding='utf8')
print(f'Projeto preparado em: {destination}')
print('Os arquivos extraidos nao sao sincronizados automaticamente: registre as alteracoes no repositorio.')
if args.testes:
    print(f'Inicie: python -m http.server 8765 --bind 127.0.0.1 --directory "{destination}"')
    print('Geometria: http://127.0.0.1:8765/testes/harness.html')
    print('App e gesto: http://127.0.0.1:8765/www/index-teste.html')
