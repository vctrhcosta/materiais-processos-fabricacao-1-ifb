#!/usr/bin/env python3
"""
fix_normalized.py — Aplica correções pós-revisão dos agentes ABNT (2ª rodada)
Corrige violações CRÍTICAS e ALTAS identificadas na primeira rodada de validação.
Uso: python3 fix_normalized.py input_normalized.md output_fixed.md
"""

import re
import sys
from pathlib import Path

# ── Títulos descritivos corretos para cada Quadro (corrige inferência automática) ─
QUADRO_TITLES = {
    1:  "Indicadores de posicionamento do Brasil na indústria de tintas (2025)",
    2:  "Estrutura da cadeia produtiva da indústria de tintas e pigmentos",
    3:  "Tipos de resinas (ligantes) utilizados na formulação de tintas: características e aplicações típicas",
    4:  "Pigmentos inorgânicos: matéria-prima de origem e processo de fabricação",
    5:  "Pigmentos orgânicos: classes, exemplos de compostos e processos de síntese",
    6:  "Pigmentos funcionais especiais: tipo, função e aplicações industriais",
    7:  "Solventes e veículos utilizados em tintas: categoria, base química e uso típico",
    8:  "Cargas minerais (*extenders*): origem mineral e função na formulação de tintas",
    9:  "Classes de aditivos para tintas, funções e exemplos de uso",
    10: "Arquitetura do sistema de pintura automotiva OEM (multicamadas)",
    11: "Sistemas de pintura naval: camadas, tipos de tinta e funções principais",
    12: "Fluxograma geral do processo industrial de fabricação de tintas",
    13: "Equipamentos críticos na produção de tintas: função e nichos de aplicação",
    14: "Mapa de nichos industriais: resina principal, pigmentos, solvente e processo crítico",
    15: "Distribuição geográfica da produção de tintas no Brasil por região",
    16: "Segmentação do mercado brasileiro de tintas por volume — estimativa",
    17: "Principais fornecedores de matérias-primas para a indústria de tintas no Brasil",
    18: "Códigos CNAE 2.0 relacionados à fabricação de tintas, pigmentos e produtos afins",
    19: "Nichos de alta oportunidade para a indústria de tintas no Brasil e justificativas",
}

# ── Citações in-text para dados factuais rastreáveis ─────────────────────────────
# (padrão: trecho do texto original → versão com citação ABNT)
INLINE_CITATIONS = [
    # Grand View Research
    (r'USD 211,28 bilhões em 2024\b',
     'USD 211,28 bilhões em 2024 (GRAND VIEW RESEARCH, 2024)'),
    (r'USD 280,19 bilhões até 2030\b',
     'USD 280,19 bilhões até 2030 (GRAND VIEW RESEARCH, 2024)'),
    (r'\(CAGR de 5,0%\)',
     '(CAGR de 5,0%) (GRAND VIEW RESEARCH, 2024)'),
    (r'Ásia-Pacífico detém 35% do mercado global\b',
     'Ásia-Pacífico detém 35% do mercado global (GRAND VIEW RESEARCH, 2024)'),
    # ABRAFATI
    (r'\*\*2,005 bilhões de litros\*\*',
     '**2,005 bilhões de litros** (ABRAFATI, 2025)'),
    (r'\*\*4º maior produtor\*\*',
     '**4º maior produtor** (ABRAFATI, 2025)'),
    (r'Os 10 maiores fabricantes respondem por \*\*75% das vendas\*\*',
     'Os 10 maiores fabricantes respondem por **75% das vendas** (ABRAFATI, 2025)'),
    (r'\*\*90% das tintas imobiliárias\*\*',
     '**90% das tintas imobiliárias** (ABRAFATI, 2025)'),
    (r'Os \*\*10 maiores fabricantes\*\* respondem por 75% das vendas',
     'Os **10 maiores fabricantes** respondem por 75% das vendas (ABRAFATI, 2025)'),
    # Mordor Intelligence
    (r'Resinas acrílicas respondem por ~35,78% do mercado global\b',
     'Resinas acrílicas respondem por ~35,78% do mercado global (MORDOR INTELLIGENCE, 2026)'),
    (r'Sistemas base água já controlam mais de 50% do mercado em volume\b',
     'Sistemas base água já controlam mais de 50% do mercado em volume (MORDOR INTELLIGENCE, 2026)'),
    (r'mais de 50% do mercado global.*impulsionados por regulamentações ambientais\b',
     None),  # complex, skip
]

# ── Expressões estrangeiras que exigem itálico (NBR 14724 + Manual IFB) ─────────
FOREIGN_TERMS_ITALIC = [
    # Termos definitivamente estrangeiros no contexto técnico
    'water-borne', 'waterborne',
    'bead mill', 'bead mills',
    'let-down',
    'in-can',
    'dry-film',
    'self-healing',
    'biofouling',
    'tin-free',
    'feedstock',
    'color matching',
    'high solids',
    'antifouling',
    'anti-incrustante',  # Portuguese, skip
    'wash primer', 'Wash primer',
    'tie-coat',
    'refinish', 'Refinish',
    'clear coat', 'Clear coat',
    'base coat', 'Base coat',
    'base water',
    'coil coating', 'Coil coating',
    'powder coating', 'powder coatings',
    'Powder coating', 'Powder coatings',
    'E-coat', 'e-coat',
    'antifouling', 'anti-fouling',
    'topcoat', 'Topcoat', 'top coat',
    'cataforese',  # Portuguese technical term (skip)
    'surfacer', 'Surfacer',
    'primer surfacer',
    'HALS',
    'color matching',
    'degassing',
    'furnace',
    'chip',
    'flake',
    'shutdown',
]

# Termos que NÃO devem receber itálico (já incorporados ao português técnico)
NO_ITALIC = {
    'primer', 'primers', 'spray', 'offshore', 'diesel', 'laser',
    'chip', 'flake', 'furnace', 'surfacer', 'HALS', 'degassing',
    'MES', 'ERP', 'OEM',
}

# Apenas estes termos definitivamente estrangeiros recebem itálico:
DEFINITE_FOREIGN = [
    'water-borne', 'bead mill', 'let-down', 'in-can', 'dry-film',
    'self-healing', 'biofouling', 'tin-free', 'color matching', 'high solids',
    'refinish', 'clear coat', 'base coat', 'coil coating', 'powder coating',
    'powder coatings', 'E-coat', 'e-coat', 'topcoat', 'top coat',
    'water-borne', 'antifouling', 'wash primer', 'tie-coat', 'base water',
]


def fix_quadro_labels(content: str) -> str:
    """Corrige rótulos de Quadros:
    - Remove itálico (underscores) dos rótulos: _Quadro N — Título_ → Quadro N — Título
    - Substitui títulos por versões descritivas corretas
    """
    quadro_num = [0]  # mutable counter

    def replace_quadro_label(m):
        quadro_num[0] += 1
        n = quadro_num[0]
        title = QUADRO_TITLES.get(n, f"Dados da pesquisa (Quadro {n})")
        return f'Quadro {n} — {title}'

    # Replace _Quadro N — ..._ patterns (italic underscores)
    content = re.sub(
        r'_Quadro \d+ — [^_\n]+_',
        replace_quadro_label,
        content
    )
    return content


def fix_uppercase_headings(content: str) -> str:
    """Corrige seções secundárias em MAIÚSCULAS para caixa baixa (NBR 6024).
    Seções secundárias (##) devem ter apenas a primeira letra maiúscula.
    """
    def fix_h2_case(m):
        prefix = m.group(1)  # "## N.N "
        text = m.group(2)    # the title text

        # Se estiver em MAIÚSCULAS completas, converter para title case
        if text == text.upper() and len(text) > 3:
            # Convert to sentence case (first letter uppercase, rest lowercase)
            # Preserve numbers and abbreviations
            words = text.split()
            result_words = []
            for i, word in enumerate(words):
                # Keep words that are abbreviations (all uppercase, ≤4 chars like TCC, IFB)
                if re.match(r'^[A-Z]{2,4}$', word) and i > 0:
                    result_words.append(word)
                elif re.match(r'^\d', word):
                    result_words.append(word)
                elif i == 0:
                    result_words.append(word.capitalize())
                else:
                    result_words.append(word.lower())
            return prefix + ' '.join(result_words)
        return m.group(0)

    # Fix ## N.N UPPERCASE TITLE
    content = re.sub(
        r'(^## \d+\.\d+\s+)([A-ZÁÉÍÓÚÂÊÎÔÛÃÕ][^\n]+)',
        fix_h2_case,
        content,
        flags=re.MULTILINE
    )
    return content


def add_section_numbers(content: str) -> str:
    """Adiciona números a seções secundárias sem indicativo (viola NBR 6024)."""
    # "## Posicionamento do Brasil no Cenário Global" → "## 1.1 Posicionamento..."
    content = re.sub(
        r'^## Posicionamento do Brasil no Cenário Global\b',
        '## 1.1 Posicionamento do Brasil no Cenário Global',
        content,
        flags=re.MULTILINE
    )
    # "## Nichos de Alta Oportunidade no Brasil" → "## 10.1 Nichos..."
    content = re.sub(
        r'^## Nichos de Alta Oportunidade no Brasil\b',
        '## 10.1 Nichos de Alta Oportunidade no Brasil',
        content,
        flags=re.MULTILINE
    )
    return content


def apply_foreign_italic(content: str) -> str:
    """Aplica itálico a expressões estrangeiras não incorporadas ao português."""
    for term in DEFINITE_FOREIGN:
        # Only apply if not already italicized
        # Avoid replacing inside code blocks, headers, already-italic text
        # Simple approach: replace term if not between * markers
        pattern = r'(?<!\*)\b' + re.escape(term) + r'\b(?!\*)'
        replacement = f'*{term}*'
        content = re.sub(pattern, replacement, content)
    return content


def add_inline_citations(content: str) -> str:
    """Adiciona citações (AUTOR, ANO) para dados factuais rastreáveis."""
    for pattern, replacement in INLINE_CITATIONS:
        if replacement is None:
            continue
        # Only replace first occurrence (most natural)
        content = re.sub(pattern, replacement, content, count=1)
    return content


def add_quadro_text_references(content: str) -> str:
    """Adiciona referência ao Quadro N no parágrafo que o precede."""
    lines = content.split('\n')
    result = []
    i = 0

    while i < len(lines):
        line = lines[i]
        # Check if next non-empty line is a Quadro label
        next_quadro = None
        for j in range(i + 1, min(i + 4, len(lines))):
            m = re.match(r'^Quadro (\d+) — ', lines[j])
            if m:
                next_quadro = int(m.group(1))
                break
            if lines[j].strip():
                break

        if next_quadro and line.strip() and not line.startswith('#') and not line.startswith('|') and not line.startswith('```') and not line.startswith('Quadro') and not line.startswith('Fonte:') and not line.startswith('Tabela'):
            # Add quadro reference to end of paragraph if not already there
            if f'Quadro {next_quadro}' not in line and f'(Quadro' not in line:
                line = line.rstrip()
                if line.endswith('.') or line.endswith(':'):
                    line = line[:-1] + f' (ver Quadro {next_quadro})' + line[-1]
                else:
                    line = line + f' (ver Quadro {next_quadro}).'

        result.append(line)
        i += 1

    return '\n'.join(result)


def fix_references(content: str) -> str:
    """Corrige problemas nas referências:
    - Adiciona https:// às URLs que não têm protocolo
    - Corrige formato da referência Britannica
    """
    # Add https:// to URLs without protocol
    content = re.sub(
        r'Disponível em: (?!https?://)www\.',
        'Disponível em: https://www.',
        content
    )
    return content


def fix_pretextual_placeholder(content: str) -> str:
    """Substitui o bloco de comentário HTML por um placeholder estruturado."""
    old_placeholder = r'<!-- =+\s+ELEMENTOS PRÉ-TEXTUAIS.*?-->\s*'

    new_placeholder = """\
---
# ELEMENTOS PRÉ-TEXTUAIS — PREENCHER ANTES DA ENTREGA (NBR 14724/2024)

> **CAPA** (Obrigatório)
> - Logotipo da instituição
> - Nome da instituição: Instituto Federal de Educação, Ciência e Tecnologia de Brasília — IFB
> - *Campus*: [informar campus]
> - Curso: [informar nome do curso]
> - Nome do(a) autor(a): [NOME COMPLETO EM MAIÚSCULAS]
> - Título: [TÍTULO DO TRABALHO EM MAIÚSCULAS]
> - Subtítulo (se houver): [subtítulo em caixa baixa]
> - Local (cidade/UF): Brasília/DF
> - Ano de entrega: [AAAA]

> **FOLHA DE ROSTO** (Obrigatório) — *NBR 14724/2024*
> - Nome do(a) autor(a): [NOME COMPLETO]
> - Título do trabalho: [TÍTULO]
> - Natureza do trabalho: [Monografia/Dissertação/Tese] apresentada ao [Curso] do [Campus] do Instituto Federal de Brasília como requisito parcial para obtenção do título de [titulação]. (Recuo 8 cm da margem esquerda)
> - Orientador(a): [Prof./Profª. titulação Nome Sobrenome]
> - Local (cidade/UF): Brasília/DF
> - Ano: [AAAA]

> **FICHA CATALOGRÁFICA** (Obrigatório) — verso da folha de rosto, retângulo 7,5 × 12,5 cm
> Elaborada por bibliotecário(a) com CRB. Solicitar à Biblioteca do IFB.

> **FOLHA DE APROVAÇÃO** (Obrigatório)
> Incluir após defesa: data de aprovação, nomes, titulações e assinaturas dos membros da banca.

> **RESUMO** (Obrigatório — 150 a 500 palavras)
>
> [Parágrafo único com: objetivos, metodologia, resultados e conclusões. Verbo na 3ª pessoa do singular.]
>
> **Palavras-chave:** [palavra 1]; [palavra 2]; [palavra 3]; [palavra 4]; [palavra 5].

> **ABSTRACT** (Obrigatório — 150 to 500 words)
>
> [Same content as Resumo, in English.]
>
> **Keywords:** [keyword 1]; [keyword 2]; [keyword 3]; [keyword 4]; [keyword 5].

> **LISTA DE QUADROS** (Obrigatório — há 19 Quadros neste trabalho)
> Quadro 1 — Indicadores de posicionamento do Brasil na indústria de tintas (2025) .......... p. [XX]
> [...demais quadros na ordem de aparição no texto]

> **SUMÁRIO** (Obrigatório)
> 1 CONTEXTUALIZAÇÃO: O SETOR NA INDÚSTRIA DE TRANSFORMAÇÃO BRASILEIRA ......... p. [XX]
> 1.1 Posicionamento do Brasil no Cenário Global ......... p. [XX]
> 2 ESTRUTURA DA CADEIA PRODUTIVA ......... p. [XX]
> [...demais seções]
> REFERÊNCIAS ......... p. [XX]

---

"""

    content = re.sub(old_placeholder, new_placeholder, content, flags=re.DOTALL)
    return content


def main():
    if len(sys.argv) < 3:
        print("Uso: python3 fix_normalized.py input.md output.md")
        sys.exit(1)

    input_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2])

    with open(input_path, 'r', encoding='utf-8') as f:
        content = f.read()

    print("Aplicando correções pós-agentes...")

    # 1. Corrigir rótulos de Quadros (remover itálico + títulos descritivos)
    content = fix_quadro_labels(content)
    print("  ✓ Rótulos de Quadros corrigidos (títulos descritivos, sem itálico)")

    # 2. Corrigir seções secundárias em MAIÚSCULAS → caixa baixa
    content = fix_uppercase_headings(content)
    print("  ✓ Seções secundárias: MAIÚSCULAS → caixa baixa")

    # 3. Adicionar números a seções sem indicativo
    content = add_section_numbers(content)
    print("  ✓ Indicativos numéricos adicionados (1.1, 10.1)")

    # 4. Aplicar itálico a expressões estrangeiras
    content = apply_foreign_italic(content)
    print("  ✓ Expressões estrangeiras em itálico")

    # 5. Adicionar citações in-text para dados factuais
    content = add_inline_citations(content)
    print("  ✓ Citações in-text (AUTOR, ANO) para dados rastreáveis")

    # 6. Adicionar referências de Quadros no texto
    content = add_quadro_text_references(content)
    print("  ✓ Referências a Quadros adicionadas nos parágrafos precedentes")

    # 7. Corrigir URLs das referências
    content = fix_references(content)
    print("  ✓ URLs das referências corrigidas (https://)")

    # 8. Substituir placeholder pré-textual por estrutura detalhada
    content = fix_pretextual_placeholder(content)
    print("  ✓ Placeholder pré-textual expandido com estrutura ABNT completa")

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"\n✓ Arquivo corrigido: {output_path}")


if __name__ == '__main__':
    main()
