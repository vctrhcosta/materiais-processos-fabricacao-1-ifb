#!/usr/bin/env python3
"""
fix_round4.py — Aplica correções da Round 4 de validação ABNT
Problema principal: seções secundárias (##) em Title Case → sentence case (NBR 6024)
Também: estrangeirismos em subtítulos de subseções e citação repetida
"""
import re
import sys
from pathlib import Path


# ── Mapeamento direto: ## e ### com Title Case → sentence case ──────────────
HEADING_FIXES = [
    # Seções secundárias (##)
    ('## 1.1 Posicionamento do Brasil no Cenário Global',
     '## 1.1 Posicionamento do Brasil no cenário global'),
    ('## 3.1 Ligantes (Resinas) — O Formador do Filme',
     '## 3.1 Ligantes (resinas) — o formador do filme'),
    ('## 3.2 Pigmentos — Cor, Opacidade e Função',
     '## 3.2 Pigmentos — cor, opacidade e função'),
    ('## 3.3 Solventes e Veículos — O Meio de Aplicação',
     '## 3.3 Solventes e veículos — o meio de aplicação'),
    ('## 3.4 Cargas Minerais (Extenders) — Volume e Reologia',
     '## 3.4 Cargas minerais (*extenders*) — volume e reologia'),
    ('## 3.5 Aditivos — Engenharia de Performance',
     '## 3.5 Aditivos — engenharia de performance'),
    ('## 5.1 Fluxograma Geral da Produção de Tintas',
     '## 5.1 Fluxograma geral da produção de tintas'),
    ('## 5.2 Equipamentos Críticos',
     '## 5.2 Equipamentos críticos'),
    ('## 5.3 Processo de Fabricação do Principal Pigmento: TiO₂',
     '## 5.3 Processo de fabricação do principal pigmento: TiO₂'),
    ('## 7.1 Estrutura de Mercado',
     '## 7.1 Estrutura de mercado'),
    ('## 7.2 Distribuição Geográfica da Produção',
     '## 7.2 Distribuição geográfica da produção'),
    ('## 7.3 Segmentação por Volume (Estimativa ABRAFATI)',
     '## 7.3 Segmentação por volume (estimativa ABRAFATI)'),
    ('## 7.4 Principais Elos de Fornecimento de Matérias-Primas no Brasil',
     '## 7.4 Principais elos de fornecimento de matérias-primas no Brasil'),
    ('## 8.1 Transição para Sistemas Base Água',
     '## 8.1 Transição para sistemas base água'),
    ('## 8.2 Tintas de Alto Teor de Sólidos (High Solids)',
     '## 8.2 Tintas de alto teor de sólidos (*high solids*)'),
    ('## 8.3 Nanotecnologia Aplicada',
     '## 8.3 Nanotecnologia aplicada'),
    ('## 8.4 Matérias-Primas de Base Renovável',
     '## 8.4 Matérias-primas de base renovável'),
    ('## 8.5 Economia Circular',
     '## 8.5 Economia circular'),
    ('## 8.6 Digitalização da Produção',
     '## 8.6 Digitalização da produção'),
    ('## 10.1 Nichos de Alta Oportunidade no Brasil',
     '## 10.1 Nichos de alta oportunidade no Brasil'),

    # Seções terciárias (###) — sentence case + estrangeirismos
    ('### 3.2.1 Pigmentos Inorgânicos',
     '### 3.2.1 Pigmentos inorgânicos'),
    ('### 3.2.2 Pigmentos Orgânicos',
     '### 3.2.2 Pigmentos orgânicos'),
    ('### 3.2.3 Pigmentos Funcionais (Especiais)',
     '### 3.2.3 Pigmentos funcionais (especiais)'),
    ('### 4.1.1 Tintas Látex / Base Água',
     '### 4.1.1 Tintas látex / base água'),
    ('### 4.1.2 Esmaltes Sintéticos (Base Solvente)',
     '### 4.1.2 Esmaltes sintéticos (base solvente)'),
    ('### 4.1.3 Texturas e Revestimentos Decorativos',
     '### 4.1.3 Texturas e revestimentos decorativos'),
    ('### 4.2.1 Anticorrosivas e Primers',
     '### 4.2.1 Anticorrosivas e primers'),
    ('### 4.2.2 Tintas de Piso e Pisos Industriais',
     '### 4.2.2 Tintas de piso e pisos industriais'),
    ('### 4.2.3 Tintas Intumescentes (Proteção Passiva ao Fogo)',
     '### 4.2.3 Tintas intumescentes (proteção passiva ao fogo)'),
    ('### 4.3.2 Tintas Base Coat Automotivas',
     '### 4.3.2 Tintas *base coat* automotivas'),
    ('### 4.3.3 Verniz Clear Coat',
     '### 4.3.3 Verniz *clear coat*'),
    ('### 4.3.4 Tintas de Repintura Automotiva (Refinish)',
     '### 4.3.4 Tintas de repintura automotiva (*refinish*)'),
    ('### 4.7.1 Tintas de Alta Temperatura',
     '### 4.7.1 Tintas de alta temperatura'),
    ('### 4.7.2 Tintas para Embalagens Metálicas (Can Coatings)',
     '### 4.7.2 Tintas para embalagens metálicas (*can coatings*)'),
    ('### 4.7.3 Tintas Eletroestáticas para Bobinas (Coil Coatings)',
     '### 4.7.3 Tintas eletroestáticas para bobinas (*coil coatings*)'),
    ('### 4.7.4 Tintas Imunomarcantes e de Segurança',
     '### 4.7.4 Tintas imunomarcantes e de segurança'),
    ('### 4.7.5 Tintas Anticorrosivas para Petróleo & Gás',
     '### 4.7.5 Tintas anticorrosivas para petróleo & gás'),
]


def fix_grand_view_citation(content: str) -> str:
    """Consolida as 4 citações repetidas (GRAND VIEW RESEARCH, 2024) em uma única ao final."""
    old = (
        'O mercado global de tintas e revestimentos foi avaliado em **USD 211,28 bilhões em 2024 '
        '(GRAND VIEW RESEARCH, 2024)**, com projeção de atingir **USD 280,19 bilhões até 2030 '
        '(GRAND VIEW RESEARCH, 2024)** (CAGR de 5,0%) (GRAND VIEW RESEARCH, 2024). A Ásia-Pacífico '
        'detém 35% do mercado global (GRAND VIEW RESEARCH, 2024),'
    )
    new = (
        'O mercado global de tintas e revestimentos foi avaliado em **USD 211,28 bilhões em 2024**, '
        'com projeção de atingir **USD 280,19 bilhões até 2030** (CAGR de 5,0%). A Ásia-Pacífico '
        'detém 35% do mercado global (GRAND VIEW RESEARCH, 2024),'
    )
    return content.replace(old, new)


def fix_topcoat_italic(content: str) -> str:
    """Corrige **Topcoat** (negrito puro) para ***topcoat*** (negrito+itálico) em tabelas."""
    # Na tabela do Quadro 11, linha "| **Topcoat** | ..."
    content = content.replace(
        '| **Topcoat** | Poliuretano alifático',
        '| ***Topcoat*** | Poliuretano alifático'
    )
    return content


def apply_heading_fixes(content: str) -> str:
    for old, new in HEADING_FIXES:
        content = content.replace(old, new)
    return content


def main():
    if len(sys.argv) < 3:
        print("Uso: python3 fix_round4.py input.md output.md")
        sys.exit(1)

    input_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2])

    with open(input_path, 'r', encoding='utf-8') as f:
        content = f.read()

    print("Aplicando correções Round 4...")

    content = apply_heading_fixes(content)
    print("  ✓ Títulos ## e ### convertidos para sentence case (NBR 6024)")

    content = fix_grand_view_citation(content)
    print("  ✓ Citações (GRAND VIEW RESEARCH, 2024) consolidadas — uma única ao final do parágrafo")

    content = fix_topcoat_italic(content)
    print("  ✓ *topcoat* corrigido para negrito+itálico na tabela do Quadro 11")

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"\n✓ Arquivo gerado: {output_path}")


if __name__ == '__main__':
    main()
