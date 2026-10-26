"""Export the static showcase under a GitHub Pages project subpath."""
import argparse
from pathlib import Path
import re

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--base-path', required=True, help='/your-repository-name/')
parser.add_argument('--output', default='docs')
args = parser.parse_args()
base = '/' + args.base_path.strip('/') + '/'
if not re.fullmatch(r'/[A-Za-z0-9_.-]+/', base):
    parser.error('Use one repository name, for example /symba-website-portfolio/.')
root = Path(__file__).resolve().parents[1]
output = (root / args.output).resolve()
if output == root or root not in output.parents:
    parser.error('Output must be a new subdirectory of the repository.')
# Fixed public directories only: never traverse configuration or upload trees.
files = [p for p in root.glob('*.html')]
for folder in ['fa', 'css', 'js', 'data']:
    files += [p for p in (root / folder).rglob('*') if p.is_file()]
# Prefix root paths, including escaped HTML strings inside JavaScript.
pattern = re.compile(r'''(?P<q>["'])(?P<path>/(?!/)(?:fa(?:/|["'])|css/|js/|data/|about\.html|contact\.html|gallery\.html|[?#]|(?=["'])))''')
for source in files:
    text = source.read_text(encoding='utf-8')
    text = pattern.sub(lambda m: m['q'] + base + m['path'][1:], text)
    # Persian folder base URLs are included in the same root-path conversion.
    target = output / source.relative_to(root)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(text, encoding='utf-8')
(output / '.nojekyll').write_text('', encoding='utf-8')
print('Exported static portfolio to', output.name)
