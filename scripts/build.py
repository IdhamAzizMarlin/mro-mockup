"""Build portable client HTML from the local, editable prototype sources."""
from pathlib import Path
import zipfile

root = Path(__file__).resolve().parents[1]
html = (root / 'index.html').read_text(encoding='utf-8')
for name in ['base.css', 'mro-siviki.css', 'inspection.css', 'project-review.css']:
    html = html.replace(f'<link rel="stylesheet" href="assets/css/{name}">', '<style>\n' + (root / 'assets/css' / name).read_text(encoding='utf-8') + '\n</style>')
for name in ['inspection.js', 'review-state.js', 'project-review.js', 'app.js']:
    html = html.replace(f'<script src="assets/js/{name}"></script>', '<script>\n' + (root / 'assets/js' / name).read_text(encoding='utf-8') + '\n</script>')
out = root / 'deliverables'
out.mkdir(exist_ok=True)
(out / 'PROTOTYPE-MRO-SIVIKI.html').write_text(html, encoding='utf-8')
(out / 'PANDUAN-REVIEW.txt').write_bytes((root / 'PANDUAN-REVIEW.txt').read_bytes())
with zipfile.ZipFile(out / 'MRO-Siviki-Prototype.zip', 'w', zipfile.ZIP_DEFLATED) as archive:
    archive.write(out / 'PROTOTYPE-MRO-SIVIKI.html', 'PROTOTYPE-MRO-SIVIKI.html')
    archive.write(out / 'PANDUAN-REVIEW.txt', 'PANDUAN-REVIEW.txt')
with zipfile.ZipFile(out / 'MRO-Siviki-Prototype.zip') as archive:
    assert archive.testzip() is None
assert '<script src=' not in html and '<link rel="stylesheet"' not in html
print('Built and validated standalone HTML and ZIP:', len(html.encode('utf-8')), 'bytes')
