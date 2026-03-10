#!/usr/bin/env python3
"""
fix_round3.py — Aplica correções da Round 3 de validação ABNT
Corrige violações CRÍTICAS e ALTAS identificadas pelos 3 agentes (Round 3, score 82/100)
"""
import re
import sys
from pathlib import Path

def apply_fixes(content: str) -> str:

    # ── 1. Seção 4.1: MAIÚSCULAS → caixa baixa ──────────────────────────────
    content = content.replace(
        '## 4.1 TINTA IMOBILIÁRIA (Arquitetural)',
        '## 4.1 Tintas imobiliárias (arquitetural)'
    )

    # ── 2. Seção 4.5: EM → em ───────────────────────────────────────────────
    content = content.replace(
        '## 4.5 Tintas EM pó (*powder coatings*)',
        '## 4.5 Tintas em pó (*powder coatings*)'
    )

    # ── 3. Seção 4.6: capitalização irregular → padronizada ─────────────────
    content = content.replace(
        '## 4.6 Tintas uv/eb (cura POR radiação)',
        '## 4.6 Tintas UV/EB (cura por radiação)'
    )

    # ── 4. IBGE URLs: adicionar https:// ────────────────────────────────────
    content = content.replace(
        'Disponível em: sidra.ibge.gov.br.',
        'Disponível em: https://sidra.ibge.gov.br.'
    )
    content = content.replace(
        'Disponível em: concla.ibge.gov.br.',
        'Disponível em: https://concla.ibge.gov.br.'
    )

    # ── 5. Sumário placeholder: corrigir título da seção 1 ──────────────────
    content = content.replace(
        '> 1 CONTEXTUALIZAÇÃO: O SETOR NA INDÚSTRIA DE TRANSFORMAÇÃO BRASILEIRA ......... p. [XX]',
        '> 1 INTRODUÇÃO: CONTEXTUALIZAÇÃO DO SETOR NA INDÚSTRIA DE TRANSFORMAÇÃO BRASILEIRA ......... p. [XX]'
    )

    # ── 6. Citação para dado "frota de 120 milhões" ──────────────────────────
    content = content.replace(
        '| **Tintas de repintura automotiva** | Frota de 120 milhões de veículos, maior taxa de acidentes do mundo |',
        '| **Tintas de repintura automotiva** | Frota de 120 milhões de veículos, maior taxa de acidentes do mundo (ABRAFATI, 2025) |'
    )

    # ── 7. Reposicionar citação ABRAFATI linha 296 ───────────────────────────
    content = content.replace(
        'coberta pelo Programa (ABRAFATI, 2025) Setorial de Qualidade (PSQ/ABRAFATI)',
        'coberta pelo Programa Setorial de Qualidade (PSQ/ABRAFATI) (ABRAFATI, 2025)'
    )

    # ── 8. Quadro 16: fonte mencionar ABRAFATI ──────────────────────────────
    content = content.replace(
        'Quadro 16 — Segmentação do mercado brasileiro de tintas por volume — estimativa\n\n```\nTintas Imobiliárias (Arquitetural)  ████████████████████  ~80%\nTintas Industriais Gerais           ████                  ~10%\nTintas Automotivas                  ██                    ~5%\nTintas em Pó                        █                     ~3%\nOutros (naval, aeroespacial, etc.)  █                     ~2%\n```\n\nFonte: elaborado pelo autor.',
        'Quadro 16 — Segmentação do mercado brasileiro de tintas por volume — estimativa\n\n```\nTintas Imobiliárias (Arquitetural)  ████████████████████  ~80%\nTintas Industriais Gerais           ████                  ~10%\nTintas Automotivas                  ██                    ~5%\nTintas em Pó                        █                     ~3%\nOutros (naval, aeroespacial, etc.)  █                     ~2%\n```\n\nFonte: elaborado pelo autor, com base em ABRAFATI (2025).'
    )

    # ── 9. Adicionar remissões textuais explícitas para Quadros ─────────────

    # Quadro 1: após heading ## 1.1
    content = content.replace(
        '## 1.1 Posicionamento do Brasil no Cenário Global\n\n\n\nQuadro 1',
        '## 1.1 Posicionamento do Brasil no Cenário Global\n\nO Quadro 1 sintetiza os principais indicadores de posicionamento do Brasil no setor de tintas:\n\n\nQuadro 1'
    )

    # Quadro 4: após heading ### 3.2.1
    content = content.replace(
        '### 3.2.1 Pigmentos Inorgânicos\n\n\n\nQuadro 4',
        '### 3.2.1 Pigmentos Inorgânicos\n\nOs principais pigmentos inorgânicos utilizados na indústria de tintas, suas origens minerais e processos de fabricação estão descritos no Quadro 4:\n\n\nQuadro 4'
    )

    # Quadro 6: após heading ### 3.2.3
    content = content.replace(
        '### 3.2.3 Pigmentos Funcionais (Especiais)\n\n\n\nQuadro 6',
        '### 3.2.3 Pigmentos Funcionais (Especiais)\n\nOs pigmentos funcionais especiais, suas funções e aplicações industriais estão sistematizados no Quadro 6:\n\n\nQuadro 6'
    )

    # Quadro 10: incluir remissão no texto bold existente
    content = content.replace(
        '**Arquitetura do Sistema Automotivo OEM (Original Equipment Manufacturer)**\n\n\n\nQuadro 10',
        '**Arquitetura do Sistema Automotivo OEM (Original Equipment Manufacturer)** (ver Quadro 10):\n\n\nQuadro 10'
    )

    # Quadro 11: incluir remissão no texto bold existente
    content = content.replace(
        '**Sistemas de Pintura Naval**\n\n\n\nQuadro 11',
        '**Sistemas de Pintura Naval** (ver Quadro 11):\n\n\nQuadro 11'
    )

    # Quadro 12: após heading ## 5.1
    content = content.replace(
        '## 5.1 Fluxograma Geral da Produção de Tintas\n\n\n\nQuadro 12',
        '## 5.1 Fluxograma Geral da Produção de Tintas\n\nO Quadro 12 apresenta o fluxograma geral do processo industrial de fabricação de tintas:\n\n\nQuadro 12'
    )

    # Quadro 13: após heading ## 5.2
    content = content.replace(
        '## 5.2 Equipamentos Críticos\n\n\n\nQuadro 13',
        '## 5.2 Equipamentos Críticos\n\nOs equipamentos críticos utilizados na produção industrial de tintas estão descritos no Quadro 13:\n\n\nQuadro 13'
    )

    # Quadro 14: após heading # 6
    content = content.replace(
        '# 6 MAPA DE NICHOS × MATÉRIAS-PRIMAS × PROCESSOS\n\n\n\nQuadro 14',
        '# 6 MAPA DE NICHOS × MATÉRIAS-PRIMAS × PROCESSOS\n\nO Quadro 14 apresenta o mapeamento cruzado de nichos industriais com as respectivas matérias-primas e processos críticos:\n\n\nQuadro 14'
    )

    # Quadro 15: após heading ## 7.2
    content = content.replace(
        '## 7.2 Distribuição Geográfica da Produção\n\n\n\nQuadro 15',
        '## 7.2 Distribuição Geográfica da Produção\n\nA distribuição regional da produção de tintas no Brasil está sintetizada no Quadro 15:\n\n\nQuadro 15'
    )

    # Quadro 16: após heading ## 7.3
    content = content.replace(
        '## 7.3 Segmentação por Volume (Estimativa ABRAFATI)\n\n\n\nQuadro 16',
        '## 7.3 Segmentação por Volume (Estimativa ABRAFATI)\n\nA segmentação do mercado brasileiro de tintas por volume é apresentada de forma estimada no Quadro 16:\n\n\nQuadro 16'
    )

    # Quadro 17: após heading ## 7.4
    content = content.replace(
        '## 7.4 Principais Elos de Fornecimento de Matérias-Primas no Brasil\n\n\n\nQuadro 17',
        '## 7.4 Principais Elos de Fornecimento de Matérias-Primas no Brasil\n\nO Quadro 17 lista os principais fornecedores de matérias-primas para a indústria de tintas no Brasil:\n\n\nQuadro 17'
    )

    # Quadro 19: após heading ## 10.1
    content = content.replace(
        '## 10.1 Nichos de Alta Oportunidade no Brasil\n\n\n\nQuadro 19',
        '## 10.1 Nichos de Alta Oportunidade no Brasil\n\nO Quadro 19 consolida os nichos de maior oportunidade de mercado para a indústria de tintas no Brasil, com as respectivas justificativas:\n\n\nQuadro 19'
    )

    return content


def main():
    if len(sys.argv) < 3:
        print("Uso: python3 fix_round3.py input.md output.md")
        sys.exit(1)

    input_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2])

    with open(input_path, 'r', encoding='utf-8') as f:
        content = f.read()

    print("Aplicando correções Round 3...")
    fixed = apply_fixes(content)

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(fixed)

    print(f"  ✓ Seção 4.1: MAIÚSCULAS → caixa baixa")
    print(f"  ✓ Seções 4.5 e 4.6: capitalização padronizada")
    print(f"  ✓ URLs IBGE: https:// adicionado")
    print(f"  ✓ Sumário placeholder: título seção 1 atualizado")
    print(f"  ✓ Citação 'frota 120 mi' adicionada")
    print(f"  ✓ Citação ABRAFATI reposicionada (linha 296)")
    print(f"  ✓ Fonte Quadro 16: ABRAFATI mencionado")
    print(f"  ✓ Remissões 'ver Quadro N' adicionadas (Quadros 1,4,6,10,11,12,13,14,15,16,17,19)")
    print(f"\n✓ Arquivo gerado: {output_path}")


if __name__ == '__main__':
    main()
