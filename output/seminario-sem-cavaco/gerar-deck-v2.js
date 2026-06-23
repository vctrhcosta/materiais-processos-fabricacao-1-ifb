const pptxgen = require("pptxgenjs");
const path = require("path");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Victor Hugo da Silva Costa";
pres.title = "Processos sem remoção de cavaco na indústria de tintas e pigmentos";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg:      "FFFFFF",
  ink:     "18181B",  // zinc-900
  sub:     "52525B",  // zinc-600
  muted:   "A1A1AA",  // zinc-400
  rule:    "E4E4E7",  // zinc-200 — hairline
  accent:  "0D9488",  // teal-600
  bgFaint: "F4F4F5",  // zinc-100 — decorative bg text
};

const FONT = "Calibri";
const TOTAL = 12;
const ML = 0.50;   // left margin (inches)
const CW = 9.10;   // usable content width

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function num(slide, n) {
  slide.addText(`${String(n).padStart(2, "0")} / ${TOTAL}`, {
    x: 8.8, y: 0.17, w: 0.9, h: 0.22,
    fontFace: FONT, fontSize: 8, color: C.muted, align: "right",
  });
}

function sectionLabel(slide, text, y = 0.28) {
  slide.addShape(pres.ShapeType.rect, {
    x: ML, y: y + 0.02, w: 0.025, h: 0.18,
    fill: { color: C.accent }, line: { color: C.accent, width: 0 },
  });
  slide.addText(text.toUpperCase(), {
    x: ML + 0.07, y, w: CW - 0.07, h: 0.22,
    fontFace: FONT, fontSize: 9, color: C.accent,
  });
}

function slideTitle(slide, text, y = 0.55) {
  slide.addText(text, {
    x: ML, y, w: CW, h: 0.65,
    fontFace: FONT, fontSize: 26, bold: true, color: C.ink,
  });
}

function divider(slide, y = 1.24) {
  slide.addShape(pres.ShapeType.line, {
    x: ML, y, w: CW, h: 0,
    line: { color: C.rule, width: 0.75 },
  });
}

function callout(slide, text, y = 5.05) {
  slide.addShape(pres.ShapeType.rect, {
    x: ML, y, w: 0.025, h: 0.35,
    fill: { color: C.accent }, line: { color: C.accent, width: 0 },
  });
  slide.addText(text, {
    x: ML + 0.12, y: y + 0.01, w: CW - 0.12, h: 0.35,
    fontFace: FONT, fontSize: 10.5, italic: true, color: C.sub,
  });
}

function header(slide, labelText, titleText, n) {
  num(slide, n);
  sectionLabel(slide, labelText);
  slideTitle(slide, titleText);
  divider(slide);
}

function vdivider(slide, x, y, h) {
  slide.addShape(pres.ShapeType.line, {
    x, y, w: 0, h,
    line: { color: C.rule, width: 0.75 },
  });
}

function colLabel(slide, text, x, y, w) {
  slide.addText(text.toUpperCase(), {
    x, y, w, h: 0.25,
    fontFace: FONT, fontSize: 9, bold: true, color: C.accent,
  });
}

function cleanTable(slide, rows, x, y, w, colW) {
  const tableData = rows.map((row, ri) =>
    row.map(cell => ({
      text: cell,
      options: {
        bold: ri === 0,
        color: ri === 0 ? C.ink : C.sub,
        fontSize: 10.5,
        fontFace: FONT,
        fill: ri === 0 ? "F9F9F9" : "FFFFFF",
        border: { pt: 0.5, color: C.rule },
        valign: "middle",
        margin: [3, 6, 3, 6],
      },
    }))
  );
  const rowH = 0.38;
  slide.addTable(tableData, { x, y, w, h: rowH * rows.length, colW, rowH });
}

// ─── SLIDE 1 — CAPA ──────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  // Large faint bg text — typographic texture
  s.addText("SEM\nCAVACO", {
    x: 5.0, y: 0.15, w: 4.8, h: 5.3,
    fontFace: FONT, fontSize: 98, bold: true, color: C.bgFaint,
    align: "center", valign: "middle",
  });

  // Institution
  s.addText("IFB  ·  Tecnologia em Design de Produto", {
    x: ML, y: 0.38, w: 5.0, h: 0.26,
    fontFace: FONT, fontSize: 9, color: C.muted,
  });

  // Accent underline
  s.addShape(pres.ShapeType.line, {
    x: ML, y: 0.74, w: 1.5, h: 0,
    line: { color: C.accent, width: 1.5 },
  });

  // Title
  s.addText("Processos sem remoção\nde cavaco na indústria\nde tintas e pigmentos", {
    x: ML, y: 0.86, w: 4.9, h: 2.65,
    fontFace: FONT, fontSize: 30, bold: true, color: C.ink,
  });

  // Subtitle
  s.addText("Embalagens, pigmentos e revestimentos em pó", {
    x: ML, y: 3.62, w: 5.0, h: 0.38,
    fontFace: FONT, fontSize: 14, color: C.sub,
  });

  // Meta
  s.addText("Materiais e Processos de Fabricação II  —  2026/1", {
    x: ML, y: 4.36, w: 5.0, h: 0.26,
    fontFace: FONT, fontSize: 9.5, color: C.muted,
  });
  s.addText("Victor Hugo da Silva Costa", {
    x: ML, y: 4.62, w: 5.0, h: 0.26,
    fontFace: FONT, fontSize: 9.5, color: C.muted,
  });
  s.addText("Profª. Keila Sanches  ·  IFB — Campus Samambaia", {
    x: ML, y: 4.88, w: 5.0, h: 0.22,
    fontFace: FONT, fontSize: 9, color: C.muted,
  });
}

// ─── SLIDE 2 — PONTO DE PARTIDA ──────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  header(s, "Contextualização", "Ponto de partida", 2);

  const rows = [
    ["", "Seminário I", "Seminário II", "Seminário III"],
    ["Processos", "Usinagem convencional", "Usinagem não convencional", "Sem remoção de cavaco"],
    ["Relação com a tinta", "Indireta — fabrica os equipamentos", "Direta em alguns casos (PLAL, plasma)", "Direta — fabrica a tinta, o pigmento ou a embalagem"],
    ["Distância ao produto", "Alta", "Média", "Mínima ou zero"],
  ];
  cleanTable(s, rows, ML, 1.38, CW, [1.6, 2.3, 2.3, 2.9]);

  callout(s, "A cada seminário, chegamos mais perto do produto final. Este é o mais próximo.");
}

// ─── SLIDE 3 — DEFINIÇÃO E CLASSIFICAÇÃO ─────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  header(s, "Base conceitual", "Definição e classificação", 3);

  s.addText("Processos em que a forma final é obtida sem retirada de material com formação de cavaco sólido. O volume é conservado: o material é conformado, densificado, fundido ou unido.", {
    x: ML, y: 1.38, w: CW, h: 0.52,
    fontFace: FONT, fontSize: 12, color: C.sub,
  });

  const rows = [
    ["Grupo", "Processos"],
    ["Fundição", "Vazamento em molde por solidificação"],
    ["Conformação mecânica", "Laminação, trefilação, forjamento, estampagem, extrusão"],
    ["União", "Soldagem por fusão ou pressão"],
    ["Outros", "Injeção e sopro de polímeros, metalurgia do pó"],
  ];
  cleanTable(s, rows, ML, 2.0, CW, [2.8, 6.3]);

  callout(s, "Diferença central: a usinagem remove. Os processos sem cavaco redistribuem ou densificam.");
}

// ─── SLIDE 4 — HIPÓTESE CENTRAL ──────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  header(s, "Estrutura analítica", "Hipótese central — Duas camadas, dois papéis", 4);

  vdivider(s, 5.22, 1.36, 3.48);

  // Column A — Produto
  colLabel(s, "Camada de produto", ML, 1.38, 4.5);
  ["Extrusão em rosca dupla", "Metalurgia do pó"].forEach((item, i) => {
    s.addShape(pres.ShapeType.rect, {
      x: ML, y: 1.87 + i * 0.52, w: 0.025, h: 0.18,
      fill: { color: C.rule }, line: { color: C.rule, width: 0 },
    });
    s.addText(item, {
      x: ML + 0.12, y: 1.84 + i * 0.52, w: 4.5, h: 0.3,
      fontFace: FONT, fontSize: 12, color: C.ink,
    });
  });
  s.addText("Fabrica a tinta ou o pigmento", {
    x: ML, y: 3.52, w: 4.5, h: 0.28,
    fontFace: FONT, fontSize: 10.5, italic: true, color: C.accent,
  });
  s.addText("Parâmetros físico-químicos", {
    x: ML, y: 3.82, w: 4.5, h: 0.25,
    fontFace: FONT, fontSize: 10, color: C.muted,
  });

  // Column B — Embalagem
  colLabel(s, "Camada de embalagem", 5.42, 1.38, 4.2);
  ["Laminação a frio", "Estampagem", "Injeção de polímeros", "Sopro por extrusão"].forEach((item, i) => {
    s.addShape(pres.ShapeType.rect, {
      x: 5.42, y: 1.87 + i * 0.52, w: 0.025, h: 0.18,
      fill: { color: C.rule }, line: { color: C.rule, width: 0 },
    });
    s.addText(item, {
      x: 5.54, y: 1.84 + i * 0.52, w: 4.0, h: 0.3,
      fontFace: FONT, fontSize: 12, color: C.ink,
    });
  });
  s.addText("Fabrica o recipiente que contém a tinta", {
    x: 5.42, y: 3.52, w: 4.2, h: 0.28,
    fontFace: FONT, fontSize: 10.5, italic: true, color: C.accent,
  });
  s.addText("Parâmetros mecânicos e de barreira", {
    x: 5.42, y: 3.82, w: 4.2, h: 0.25,
    fontFace: FONT, fontSize: 10, color: C.muted,
  });

  callout(s, "A mesma família de processos atua em duas frentes distintas na cadeia.");
}

// ─── SLIDE 5 — EXTRUSÃO EM ROSCA DUPLA ───────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  header(s, "Camada de produto", "Extrusão em rosca dupla", 5);

  s.addText("O único produto da cadeia de tintas cuja fabricação é integralmente conformação mecânica — sem fase líquida, sem solvente, sem etapa química separada.", {
    x: ML, y: 1.38, w: CW, h: 0.48,
    fontFace: FONT, fontSize: 11.5, color: C.sub,
  });

  // Numbered flow steps — left column
  const steps = [
    "Pesagem e mistura seca  (resina + pigmento + agente de cura + aditivos)",
    "Extrusor dupla rosca co-rotante  ·  80–130°C  |  50–200 bar",
    "Fita resfriada  →  chips quebração",
    "Moagem (Alpine ACM)  →  D50: 35–45 μm",
    "Classificação por ciclone  →  pó final",
  ];
  steps.forEach((step, i) => {
    s.addText(`${i + 1}`, {
      x: ML, y: 1.97 + i * 0.53, w: 0.28, h: 0.35,
      fontFace: FONT, fontSize: 13, bold: true, color: C.accent,
      align: "center", valign: "middle",
    });
    s.addText(step, {
      x: ML + 0.36, y: 1.97 + i * 0.53, w: 4.22, h: 0.35,
      fontFace: FONT, fontSize: 10.5, color: C.ink, valign: "middle",
    });
  });

  vdivider(s, 5.22, 1.90, 2.72);

  // Masterbatch — right column
  colLabel(s, "Masterbatch de pigmentos", 5.42, 1.90, 4.2);
  s.addText("Concentrado 40–65% em peso em resina carreadora (PE/PP/EVA), produzido no mesmo tipo de equipamento a 190–250°C.", {
    x: 5.42, y: 2.22, w: 4.1, h: 0.72,
    fontFace: FONT, fontSize: 11, color: C.ink,
  });
  s.addText("É o masterbatch que define a cor dos baldes — não o fabricante da embalagem.", {
    x: 5.42, y: 3.02, w: 4.1, h: 0.58,
    fontFace: FONT, fontSize: 11, italic: true, color: C.sub,
  });
  s.addText("~15% do mercado global de tintas industriais  ·  Zero COV", {
    x: 5.42, y: 3.70, w: 4.1, h: 0.28,
    fontFace: FONT, fontSize: 9.5, color: C.muted,
  });

  callout(s, "O extrusor não processa uma formulação já pronta — ele é a própria formulação.");
}

// ─── SLIDE 6 — METALURGIA DO PÓ ──────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  header(s, "Camada de produto", "Metalurgia do pó", 6);

  s.addText("O processo que fabrica o próprio ingrediente da formulação.", {
    x: ML, y: 1.38, w: CW, h: 0.32,
    fontFace: FONT, fontSize: 12, bold: true, color: C.ink,
  });

  // Left — Flocos de alumínio
  colLabel(s, "Flocos de alumínio", ML, 1.80, 4.5);
  s.addText("1.  Atomização por gás inerte (N₂/Ar): alumínio líquido → pó esférico 5–150 μm\n2.  Moagem em bolas + ácido esteárico → flocos 0,1–0,5 μm espessura", {
    x: ML, y: 2.10, w: 4.5, h: 0.82,
    fontFace: FONT, fontSize: 11, color: C.ink,
  });
  const leafRows = [
    ["Tipo", "Orientação", "Função"],
    ["Leafing", "Paralela à superfície", "Barreira contínua → anticorrosão, até 600°C"],
    ["Non-leafing", "Aleatória", "Efeito metalizado → automotivo, decorativo"],
  ];
  cleanTable(s, leafRows, ML, 3.02, 4.5, [1.0, 1.4, 2.1]);

  vdivider(s, 5.22, 1.76, 2.56);

  // Right — Pó de zinco
  colLabel(s, "Pó de zinco", 5.42, 1.80, 4.2);
  s.addText("Destilação e condensação: zinco vaporizado a ~907°C → partículas esféricas 2–10 μm.", {
    x: 5.42, y: 2.10, w: 4.1, h: 0.55,
    fontFace: FONT, fontSize: 11, color: C.ink,
  });
  s.addText("Primers ricos em zinco: 65–95% Zn em volume no filme seco (SSPC Paint 20).", {
    x: 5.42, y: 2.72, w: 4.1, h: 0.55,
    fontFace: FONT, fontSize: 11, color: C.ink,
  });
  s.addText("Proteção catódica: o zinco oxida no lugar do aço.", {
    x: 5.42, y: 3.34, w: 4.1, h: 0.38,
    fontFace: FONT, fontSize: 11, color: C.ink,
  });

  callout(s, "A morfologia determina a função. Dois pigmentos idênticos em composição podem proteger ou decorar — dependendo de como se orientam.");
}

// ─── SLIDE 7 — LAMINAÇÃO E ESTAMPAGEM ────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  header(s, "Camada de embalagem — metálica", "Laminação e estampagem", 7);

  vdivider(s, 5.22, 1.34, 3.50);

  // Left — Laminação
  colLabel(s, "Laminação a frio → folha-de-flandres", ML, 1.38, 4.5);
  s.addText("Aço AISI 1006–1010 laminado até 0,14–0,49 mm\nEncruamento: resistência 370–460 MPa  |  Ra < 0,5 μm (adesão do verniz)\nRevestimento eletrolítico de estanho (1,1–11,2 g/m²): barreira + lubrificante\nCadeia no Brasil: ArcelorMittal / Usiminas → Colep Brasil, Metalflex → Sherwin-Williams, PPG, Coral, Suvinil", {
    x: ML, y: 1.70, w: 4.5, h: 1.68,
    fontFace: FONT, fontSize: 11, color: C.ink,
  });

  // Right — Estampagem
  colLabel(s, "Estampagem → lata de tinta", 5.42, 1.38, 4.2);
  const stampRows = [
    ["Operação", "O que faz"],
    ["Blanking", "Corta disco circular da tira"],
    ["Repuxo profundo (DRD)", "Forma corpo cilíndrico em 2–3 estágios"],
    ["DWI (aerossol)", "Estica a parede de 0,35 mm → 0,09–0,12 mm sem costura"],
    ["Flangeamento", "Borda para dupla costura (double seaming)"],
  ];
  cleanTable(s, stampRows, 5.42, 1.70, 4.2, [1.8, 2.4]);

  callout(s, "A costura é a única junta mecânica da lata. Precisa ser estanque para conter solventes voláteis e impedir skinning.");
}

// ─── SLIDE 8 — INJEÇÃO E SOPRO ────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  header(s, "Camada de embalagem — plástica", "Injeção e sopro", 8);

  colLabel(s, "Injeção → baldes e tampas  (60–65% do volume de embalagens de tinta no Brasil)", ML, 1.38, CW);
  const injRows = [
    ["Material", "Aplicação", "Por quê"],
    ["PP copolímero (PP-C)", "Baldes 3,6 L e 18 L", "pH 7–10 (tinta base água), resistência ao impacto, ciclo 15–25 s"],
    ["PEAD grau embalagem", "Galões solvente 1–5 L", "Resistência a aromáticos (tolueno, xileno) até 60°C"],
  ];
  cleanTable(s, injRows, ML, 1.70, CW, [2.1, 2.3, 4.7]);

  colLabel(s, "Sopro por extrusão (EBM) → galões e tambores sem emenda", ML, 2.78, CW);
  s.addText("Parison extrudado → molde fecha → ar comprimido 5–10 bar → expande contra o molde\nPEAD grau sopro: MFI 0,1–0,3 g/10 min (alta resistência ao sag do parison)\nCOEX 5 camadas: PEAD externo/interno + EVOH central → barreira 2–3 ordens de grandeza para acetato de etila e metanol\nTambores 60–200 L: aprovação UN para líquidos perigosos classe 3", {
    x: ML, y: 3.10, w: CW, h: 1.62,
    fontFace: FONT, fontSize: 11, color: C.ink,
  });

  callout(s, "Injeção define forma + tampas + estética. Sopro define estanqueidade + barreira química.");
}

// ─── SLIDE 9 — SÍNTESE COMPARATIVA ───────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  header(s, "Comparativo", "Síntese — A progressão dos três seminários", 9);

  const rows = [
    ["Seminário", "Processos", "Relação com o produto"],
    ["Usinagem Convencional", "Torneamento, fresamento, retificação", "Fabricam os equipamentos — não tocam a tinta"],
    ["Usinagem Não Convencional", "Laser, plasma, EDM", "Majoritariamente em equipamentos; algumas inserções diretas (PLAL, plasma de pigmentos)"],
    ["Sem Cavaco (este trabalho)", "Extrusão, metalurgia do pó, estampagem, injeção, sopro, laminação", "Fabricam diretamente a tinta, o pigmento ou a embalagem"],
  ];
  cleanTable(s, rows, ML, 1.38, CW, [2.3, 2.9, 3.9]);

  s.addText("Por quê essa diferença?", {
    x: ML, y: 3.42, w: CW, h: 0.30,
    fontFace: FONT, fontSize: 11, bold: true, color: C.ink,
  });
  s.addText("Processos com cavaco partem de peça sólida → produzem componentes e equipamentos. Processos sem cavaco partem de pó, fundido ou polímero fluido → resultado é o produto ou o recipiente. Essa natureza os aproxima dos processos químicos que são o núcleo da cadeia de tintas.", {
    x: ML, y: 3.78, w: CW, h: 0.92,
    fontFace: FONT, fontSize: 11, color: C.sub,
  });
}

// ─── SLIDE 10 — O CASO DA TINTA EM PÓ ───────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  header(s, "Análise de interface — slide-chave", "O caso da tinta em pó", 10);

  s.addText("O extrusor de rosca dupla faz as três coisas ao mesmo tempo:", {
    x: ML, y: 1.38, w: CW, h: 0.32,
    fontFace: FONT, fontSize: 12, color: C.sub,
  });

  const rows = [
    ["Função na produção de tinta líquida", "Equipamento específico", "Na tinta em pó"],
    ["Dispersão de pigmento", "Moinho de pérolas", "Extrusor"],
    ["Mistura de componentes", "Misturador de dois componentes", "Extrusor"],
    ["Conformação do produto final", "Estampagem (embalagem)", "Extrusor"],
  ];
  cleanTable(s, rows, ML, 1.78, CW, [3.3, 2.9, 2.9]);

  // Key insight — typographic emphasis
  s.addText("1 equipamento  ·  3 funções simultâneas", {
    x: ML, y: 3.52, w: CW, h: 0.42,
    fontFace: FONT, fontSize: 20, bold: true, color: C.accent,
  });
  s.addText("Um único equipamento substitui o moinho, o misturador e o conformador. O extrusor não processa uma formulação já pronta — ele é a própria formulação. Provavelmente o equipamento com maior densidade funcional por metro cúbico em toda a cadeia estudada nos três seminários.", {
    x: ML, y: 4.00, w: CW, h: 0.88,
    fontFace: FONT, fontSize: 11, color: C.sub,
  });
}

// ─── SLIDE 11 — CONCLUSÃO ─────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  header(s, "O que aprendemos", "Conclusão — 3 pontos", 11);

  const points = [
    {
      title: "Os processos sem cavaco chegam ao núcleo do produto.",
      body: "Extrusão fabrica a tinta em pó. Metalurgia do pó sintetiza os pigmentos metálicos. Laminação, estampagem, injeção e sopro fabricam cada embalagem que o usuário segura.",
    },
    {
      title: "Dois conjuntos de critérios, dois papéis distintos.",
      body: "Na camada de produto, os parâmetros são físico-químicos (morfologia, pureza, crosslinking). Na camada de embalagem, são mecânicos e regulatórios (estanqueidade, resistência química, testes UN).",
    },
    {
      title: "A indústria de tintas vista em três seminários.",
      body: "Usinagem convencional garante precisão dos equipamentos. Métodos não convencionais intervêm na síntese e preparação de superfícies. Processos sem cavaco fabricam a tinta, o pigmento e a embalagem.",
    },
  ];

  points.forEach((p, i) => {
    // Accent number box
    s.addShape(pres.ShapeType.rect, {
      x: ML, y: 1.38 + i * 1.16, w: 0.30, h: 0.30,
      fill: { color: C.accent }, line: { color: C.accent, width: 0 },
    });
    s.addText(`${i + 1}`, {
      x: ML, y: 1.38 + i * 1.16, w: 0.30, h: 0.30,
      fontFace: FONT, fontSize: 13, bold: true, color: "FFFFFF",
      align: "center", valign: "middle",
    });
    s.addText(p.title, {
      x: ML + 0.46, y: 1.38 + i * 1.16, w: CW - 0.46, h: 0.28,
      fontFace: FONT, fontSize: 12, bold: true, color: C.ink,
    });
    s.addText(p.body, {
      x: ML + 0.46, y: 1.70 + i * 1.16, w: CW - 0.46, h: 0.56,
      fontFace: FONT, fontSize: 11, color: C.sub,
    });
  });

  callout(s, "A fabricação mecânica e a química de tintas não são mundos separados. São a mesma cadeia.");
}

// ─── SLIDE 12 — REFERÊNCIAS ───────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  num(s, 12);

  s.addText("Referências", {
    x: ML, y: 0.38, w: CW, h: 0.55,
    fontFace: FONT, fontSize: 26, bold: true, color: C.ink,
  });
  divider(s, 0.97);

  const refs = [
    "GROOVER, M. P. Fundamentals of Modern Manufacturing. 5. ed. Wiley, 2013.",
    "KALPAKJIAN, S.; SCHMID, S. R. Manufacturing Engineering and Technology. 7. ed. Pearson, 2014.",
    "MISEV, T. A.; VAN DER LINDE, R. Powder coatings, the future technology. Progress in Organic Coatings, v. 34, 1998.",
    "SMITH, W. F. Foundations of Materials Science and Engineering. 3. ed. McGraw-Hill, 2002.",
    "HARE, C. H. Zinc-rich coatings. Journal of Protective Coatings and Linings, v. 17, n. 4, 2000.",
    "HANLON, J. F.; KELSEY, R. J.; FORCINIO, H. E. Handbook of Package Engineering. 3. ed. CRC Press, 1998.",
    "ABRAFATI. Relatório setorial 2024. São Paulo, 2024.",
    "SSPC Paint 20: Zinc-rich coating (Type I and Type II). Pittsburgh: SSPC, 2019.",
  ];

  refs.forEach((ref, i) => {
    s.addText(ref, {
      x: ML, y: 1.10 + i * 0.51,
      w: CW, h: 0.46,
      fontFace: FONT, fontSize: 10.5, color: C.sub,
      bullet: true,
    });
  });
}

// ─── WRITE FILE ───────────────────────────────────────────────────────────────
const outPath = path.join(__dirname, "seminario-sem-cavaco-v2.pptx");
pres.writeFile({ fileName: outPath })
  .then(() => console.log(`✓ Arquivo gerado: ${outPath}`))
  .catch(e => console.error(e));
