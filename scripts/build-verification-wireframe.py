"""Build the independent sequential-verification proposal for offline review."""
from pathlib import Path
import zipfile

root = Path(__file__).resolve().parents[1]
source = root / 'wireframe-verifikasi'
html = (source / 'index.html').read_text(encoding='utf-8')
for name in ['../wireframe/style.css', 'style.css']:
    html = html.replace(f'<link rel="stylesheet" href="{name}">', '<style>\n' + (source / name).read_text(encoding='utf-8') + '\n</style>')
for name in ['../wireframe/workbook.js', 'documents.js', 'documentation.js', 'app.js']:
    html = html.replace(f'<script src="{name}"></script>', '<script>\n' + (source / name).read_text(encoding='utf-8') + '\n</script>')
out = root / 'deliverables'
out.mkdir(exist_ok=True)
target = out / 'WIREFRAME-VERIFIKASI-BERTAHAP.html'
target.write_text(html, encoding='utf-8')
archive_path = out / 'MRO-Wireframe-Verifikasi-Bertahap.zip'
with zipfile.ZipFile(archive_path, 'w', zipfile.ZIP_DEFLATED) as archive:
    archive.write(target, target.name)
    archive.write(source / 'README.txt', 'PANDUAN-WIREFRAME.txt')
with zipfile.ZipFile(archive_path) as archive:
    assert archive.testzip() is None
assert '<script src=' not in html and '<link rel="stylesheet"' not in html
print('Built and verified sequential wireframe HTML/ZIP:', target.stat().st_size, 'bytes')
