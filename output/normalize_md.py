#!/usr/bin/env python3
"""
normalize_md.py — Normaliza markdown para ABNT NBR 14724/2024 (IFB)
Uso: python3 normalize_md.py input.md output.md
"""

import re
import sys
from pathlib import Path

# ─── Referências em formato ABNT NBR 6023 ─────────────────────────────────────
REFERENCIAS_ABNT = """ASSOCIAÇÃO BRASILEIRA DA INDÚSTRIA QUÍMICA. **ABIQUIM**: Associação Brasileira da Indústria Química. São Paulo, [2026]. Disponível em: www.abiquim.org.br. Acesso em: 9 mar. 2026.

ASSOCIAÇÃO BRASILEIRA DOS FABRICANTES DE TINTAS. **ABRAFATI**: anuário do setor de tintas 2025. São Paulo: ABRAFATI, 2025. Disponível em: www.abrafati.com.br. Acesso em: 9 mar. 2026.

BRITANNICA, The Editors of Encyclopaedia. **Paint**. In: BRITANNICA. Chicago: Encyclopædia Britannica, [2026]. Disponível em: www.britannica.com/technology/paint-chemical-coating. Acesso em: 9 mar. 2026.

CHEMEUROPE. **Paint**. In: CHEMEUROPE ENCYCLOPEDIA. [S. l.]: ChemEurope, [2026]. Disponível em: www.chemeurope.com/en/encyclopedia/Paint.html. Acesso em: 9 mar. 2026.

GRAND VIEW RESEARCH. **Paints and coatings market size, share & trends analysis report by technology, by application, by region, and segment forecasts, 2024–2030**. [S. l.]: Grand View Research, 2024.

INSTITUTO BRASILEIRO DE GEOGRAFIA E ESTATÍSTICA. **Pesquisa Industrial Anual — Empresa (PIA-Empresa)**: CNAE 20.21-5. Rio de Janeiro: IBGE, 2024. Disponível em: sidra.ibge.gov.br. Acesso em: 9 mar. 2026.

INSTITUTO BRASILEIRO DE GEOGRAFIA E ESTATÍSTICA. **Classificação Nacional de Atividades Econômicas — CNAE 2.0**. Rio de Janeiro: IBGE, [2024]. Disponível em: concla.ibge.gov.br. Acesso em: 9 mar. 2026.

MORDOR INTELLIGENCE. **Paints and coatings market size & share analysis — growth trends & forecasts (2026–2031)**. [S. l.]: Mordor Intelligence, 2026. Disponível em: www.mordorintelligence.com. Acesso em: 9 mar. 2026.
"""

class ABNTNormalizer:
    def __init__(self):
        self.quadro_count = 0
        self.tabela_count = 0
        self.issues = []  # Log of changes made

    def normalize(self, content: str) -> str:
        lines = content.split('\n')
        result = []
        i = 0

        # Skip title block (lines 1-5: title, subtitle, metadata)
        # We'll replace with proper pre-textual placeholder
        result.append(self._cover_placeholder())

        # Skip first 6 lines (# title, ## subtitle, blank, **Data:**, **Fontes:**, blank, ---)
        while i < len(lines) and not lines[i].startswith('## 1.'):
            i += 1

        while i < len(lines):
            line = lines[i]

            # ── Skip decorative horizontal rules ──────────────────────────────
            if re.match(r'^-{3,}\s*$', line):
                i += 1
                continue

            # ── Handle REFERÊNCIAS section (replace with ABNT format) ─────────
            if re.match(r'^## REFERÊNCIAS', line):
                result.append('\n# REFERÊNCIAS\n')
                result.append(REFERENCIAS_ABNT)
                # Skip original references block
                i += 1
                while i < len(lines) and not lines[i].startswith('## '):
                    i += 1
                continue

            # ── Headings ──────────────────────────────────────────────────────

            # H2 numbered primary section: "## N. TITLE" or "## N. TITLE: sub"
            m = re.match(r'^## (\d+)\.\s+(.+)', line)
            if m:
                num, title = m.group(1), m.group(2).strip()
                # Remove trailing colon from title if present
                title = re.sub(r':$', '', title).strip()
                result.append(f'\n# {num} {title.upper()}\n')
                self.issues.append(f'H1: seção primária "{num} {title[:40]}"')
                i += 1
                continue

            # H2 unnumbered (Referências, etc.) — already handled above
            m = re.match(r'^## ([A-ZÁÉÍÓÚÂÊÎÔÛÀÃÕ][^#\n]+)', line)
            if m:
                title = m.group(1).strip()
                result.append(f'\n# {title.upper()}\n')
                i += 1
                continue

            # H3 numbered secondary section: "### N.N Title"
            m = re.match(r'^### (\d+\.\d+)\s+(.+)', line)
            if m:
                num, title = m.group(1), m.group(2).strip()
                # Remove italics markers from title
                title = re.sub(r'[*_]', '', title)
                result.append(f'\n## {num} {title}\n')
                i += 1
                continue

            # H3 unnumbered secondary (e.g., "### Posicionamento do Brasil")
            m = re.match(r'^### (.+)', line)
            if m:
                title = m.group(1).strip()
                title = re.sub(r'[*_]', '', title)
                # Find the parent section number to assign sub-number
                result.append(f'\n## {title}\n')
                i += 1
                continue

            # H4 numbered tertiary: "#### N.N.N Title"
            m = re.match(r'^#### (\d+\.\d+\.\d+)\s+(.+)', line)
            if m:
                num, title = m.group(1), m.group(2).strip()
                title = re.sub(r'[*_]', '', title)
                result.append(f'\n### {num} {title}\n')
                i += 1
                continue

            # H4 unnumbered: convert to bold paragraph (not a formal section)
            m = re.match(r'^#### (.+)', line)
            if m:
                title = m.group(1).strip()
                title = re.sub(r'[*_]', '', title)
                result.append(f'\n**{title}**\n')
                i += 1
                continue

            # ── Blockquotes → inline text with note marker ────────────────────
            if line.startswith('> '):
                inner = line[2:].strip()
                inner = re.sub(r'\*\*(.+?)\*\*:', r'**\1**:', inner)
                result.append(f'\n{inner}\n')
                i += 1
                continue

            # ── Code blocks → Quadros ─────────────────────────────────────────
            if line.startswith('```'):
                code_lines = []
                lang = line[3:].strip()
                j = i + 1
                while j < len(lines) and not lines[j].startswith('```'):
                    code_lines.append(lines[j])
                    j += 1
                self.quadro_count += 1
                title = self._infer_context_title(lines, i)
                result.append(f'\n_{self._quadro_label()} — {title}_\n')
                result.append('```')
                result.extend(code_lines)
                result.append('```')
                result.append('\nFonte: elaborado pelo autor.\n')
                i = j + 1
                continue

            # ── Markdown tables → Quadros ou Tabelas ─────────────────────────
            if line.startswith('|') and i + 1 < len(lines) and re.match(r'^\|[\s\-:|]+\|', lines[i + 1]):
                table_lines = [line]
                j = i + 1
                while j < len(lines) and lines[j].startswith('|'):
                    table_lines.append(lines[j])
                    j += 1

                is_tabela = self._is_statistical_table(table_lines)
                title = self._infer_context_title(lines, i)

                if is_tabela:
                    self.tabela_count += 1
                    label = f'Tabela {self.tabela_count}'
                    source = 'Fonte: dados da pesquisa.'
                else:
                    self.quadro_count += 1
                    label = self._quadro_label()
                    source = 'Fonte: elaborado pelo autor.'

                result.append(f'\n_{label} — {title}_\n')
                result.extend(table_lines)
                result.append(f'\n{source}\n')
                i = j
                continue

            # ── Regular lines ─────────────────────────────────────────────────
            result.append(line)
            i += 1

        return '\n'.join(result)

    def _quadro_label(self) -> str:
        return f'Quadro {self.quadro_count}'

    def _is_statistical_table(self, table_lines: list) -> bool:
        """Determines if table contains statistical/numerical data (Tabela) or descriptive (Quadro)."""
        header = table_lines[0].lower() if table_lines else ''
        statistical_keywords = ['quantitativo', 'quantidade', 'frequência', 'porcentagem', '%', 'valor', 'total', 'média']
        # Check if most data cells are numeric
        data_rows = [r for r in table_lines if not re.match(r'^\|[\s\-:|]+\|', r)][1:]  # Skip header
        numeric_cells = 0
        total_cells = 0
        for row in data_rows[:5]:  # Sample first 5 rows
            cells = [c.strip() for c in row.strip().split('|')[1:-1]]
            for cell in cells:
                cell_clean = re.sub(r'[*_`]', '', cell)
                total_cells += 1
                if re.match(r'^[\d\.,\s%]+$', cell_clean) and cell_clean.strip():
                    numeric_cells += 1
        if total_cells > 0 and numeric_cells / total_cells > 0.4:
            return True
        return any(kw in header for kw in statistical_keywords)

    def _infer_context_title(self, lines: list, pos: int) -> str:
        """Infers title from preceding lines."""
        for k in range(pos - 1, max(0, pos - 6), -1):
            line = lines[k].strip()
            if not line:
                continue
            if re.match(r'^[-|`#]', line):
                continue
            # Clean markdown formatting
            clean = re.sub(r'[*_`#>]', '', line).strip()
            clean = re.sub(r'^\d+\.\d*\s+', '', clean)  # Remove leading numbers
            if clean and len(clean) > 5:
                return clean[:80]
        return 'Dados da pesquisa'

    def _cover_placeholder(self) -> str:
        return """\
<!-- ============================================================
     ELEMENTOS PRÉ-TEXTUAIS (NBR 14724/2024)
     Inserir antes da entrega:
     1. CAPA (obrigatória)
     2. FOLHA DE ROSTO (obrigatória)
     3. FICHA CATALOGRÁFICA — verso da folha de rosto (obrigatória)
     4. FOLHA DE APROVAÇÃO (obrigatória)
     5. RESUMO em língua vernácula — 150 a 500 palavras (obrigatório)
     6. ABSTRACT/RÉSUMÉ/RESUMEN (obrigatório)
     7. SUMÁRIO (obrigatório)
     ============================================================ -->

"""


def main():
    if len(sys.argv) < 3:
        print("Uso: python3 normalize_md.py input.md output.md")
        sys.exit(1)

    input_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2])

    if not input_path.exists():
        print(f"Erro: arquivo não encontrado: {input_path}")
        sys.exit(1)

    with open(input_path, 'r', encoding='utf-8') as f:
        content = f.read()

    normalizer = ABNTNormalizer()
    normalized = normalizer.normalize(content)

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(normalized)

    print(f"✓ Markdown normalizado: {output_path}")
    print(f"  Quadros numerados:  {normalizer.quadro_count}")
    print(f"  Tabelas numeradas:  {normalizer.tabela_count}")
    print(f"  Alterações: {len(normalizer.issues)}")


if __name__ == '__main__':
    main()
