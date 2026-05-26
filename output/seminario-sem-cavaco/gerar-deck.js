const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Victor Hugo da Silva Costa";
pres.title = "Processos sem remoção de cavaco na indústria de tintas e pigmentos";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  white:      "FFFFFF",
  bg:         "FFFFFF",
  titleDark:  "2D3748",
  titleLight: "4A5568",
  sub:        "718096",
  body:       "4A5568",
  muted:      "9AA3B2",
  border:     "CBD5E0",
  tableLine:  "E2E8F0",
  tableHead:  "4A5568",
  accent:     "667EEA",
  callout:    "F7FAFC",
  italic:     "718096",
};

const FONT = "Calibri";

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function addVerticalBar(slide, x, y, h) {
  const barColors = ["EBD8FF","C4B5FD","93C5FD","6EE7B7","86EFAC"];
  const segH = h / barColors.length;
  barColors.forEach((c, i) => {
    slide.addShape(pres.ShapeType.rect, {
      x, y: y + i * segH, w: 0.045, h: segH + 0.01,
      fill: { color: c }, line: { color: c, width: 0 },
    });
  });
}

function hRule(slide, x, y, w) {
  slide.addShape(pres.ShapeType.line, {
    x, y, w, h: 0,
    line: { color: C.tableLine, width: 0.75 },
  });
}

function card(slide, x, y, w, h, opts = {}) {
  slide.addShape(pres.ShapeType.rect, {
    x, y, w, h,
    fill: { color: opts.fill || C.white },
    line: { color: opts.border || C.border, width: 0.75 },
  });
}

function calloutItalic(slide, text, x, y, w) {
  slide.addText(text, {
    x, y, w, h: 0.45,
    fontFace: FONT, fontSize: 11, italic: true,
    color: C.italic, align: "right", valign: "bottom",
  });
}

function sectionLabel(slide, text) {
  slide.addText(text, {
    x: 0.55, y: 0.18, w: 9, h: 0.25,
    fontFace: FONT, fontSize: 10, color: C.sub,
  });
}

function slideTitle(slide, title) {
  slide.addText(title, {
    x: 0.55, y: 0.38, w: 8.6, h: 0.65,
    fontFace: FONT, fontSize: 28, color: C.titleLight,
    bold: false,
  });
}

function addSimpleTable(slide, rows, x, y, w, colW) {
  const headerRow = rows[0].map(cell => ({
    text: cell,
    options: { bold: true, color: C.tableHead, fontSize: 11, fontFace: FONT, fill: C.white },
  }));
  const bodyRows = rows.slice(1).map(row =>
    row.map(cell => ({
      text: cell,
      options: { color: C.body, fontSize: 11, fontFace: FONT, fill: C.white },
    }))
  );
  const h = 0.37 * rows.length;
  slide.addTable([headerRow, ...bodyRows], {
    x, y, w, h,
    colW,
    border: { pt: 0.5, color: C.tableLine },
    rowH: 0.37,
  });
}

// ─── SLIDE 1 — CAPA ──────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  // Gradient bar
  const barColors = ["EBD8FF","C4B5FD","93C5FD","6EE7B7","86EFAC"];
  const barH = 5.625 / barColors.length;
  barColors.forEach((c, i) => {
    s.addShape(pres.ShapeType.rect, {
      x: 5.4, y: i * barH, w: 0.045, h: barH + 0.02,
      fill: { color: c }, line: { color: c, width: 0 },
    });
  });

  s.addText("IFB  |  Tecnologia em Design de Produto", {
    x: 0.5, y: 0.3, w: 4.5, h: 0.35,
    fontFace: FONT, fontSize: 9, color: C.sub,
  });

  s.addText("Processos sem remoção\nde cavaco na indústria\nde tintas e pigmentos", {
    x: 0.5, y: 1.1, w: 4.7, h: 2.2,
    fontFace: FONT, fontSize: 30, bold: true, color: C.titleDark,
  });

  s.addText("Embalagens, pigmentos e revestimentos em pó", {
    x: 0.5, y: 3.35, w: 4.7, h: 0.45,
    fontFace: FONT, fontSize: 16, color: C.sub,
  });

  s.addText("Materiais e Processos de Fabricação II — 2026/1", {
    x: 0.5, y: 4.35, w: 4.7, h: 0.3,
    fontFace: FONT, fontSize: 10, color: C.muted,
  });
  s.addText("Victor Hugo da Silva Costa", {
    x: 0.5, y: 4.65, w: 4.7, h: 0.3,
    fontFace: FONT, fontSize: 10, color: C.muted,
  });
  s.addText("Profª. Keila Sanches  ·  IFB — Samambaia", {
    x: 0.5, y: 4.9, w: 4.7, h: 0.25,
    fontFace: FONT, fontSize: 9, color: C.muted,
  });

  // Right image placeholder
  s.addShape(pres.ShapeType.rect, {
    x: 5.6, y: 0.4, w: 4.0, h: 4.8,
    fill: { color: "F7F8FC" }, line: { color: C.tableLine, width: 0.5 },
  });
  s.addText("[Imagem: extrusor de rosca dupla\nou linha de estampagem de latas]", {
    x: 5.65, y: 2.1, w: 3.9, h: 0.9,
    fontFace: FONT, fontSize: 10, color: C.muted, align: "center", italic: true,
  });
}

// ─── SLIDE 2 — PONTO DE PARTIDA ──────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addVerticalBar(s, 5.35, 0.9, 3.8);

  sectionLabel(s, "Contextualização");
  slideTitle(s, "Ponto de partida");
  hRule(s, 0.55, 1.02, 9.1);

  const rows = [
    ["", "Seminário I", "Seminário II", "Seminário III"],
    ["Processos", "Usinagem convencional", "Usinagem não convencional", "Sem remoção de cavaco"],
    ["Relação com a tinta", "Indireta — fabrica os equipamentos", "Direta em alguns casos (PLAL, plasma)", "Direta — fabrica a tinta, o pigmento ou a embalagem"],
    ["Distância ao produto", "Alta", "Média", "Mínima ou zero"],
  ];
  addSimpleTable(s, rows, 0.55, 1.2, 9.1, [1.6, 2.3, 2.3, 2.9]);

  calloutItalic(s, "A cada seminário, chegamos mais perto do produto final. Este é o mais próximo.", 0.55, 4.9, 9.1);
}

// ─── SLIDE 3 — DEFINIÇÃO E CLASSIFICAÇÃO ─────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addVerticalBar(s, 5.35, 0.9, 3.8);

  sectionLabel(s, "Base conceitual");
  slideTitle(s, "Definição e classificação");
  hRule(s, 0.55, 1.02, 9.1);

  card(s, 0.55, 1.18, 9.1, 0.8);
  s.addText("Processos em que a forma final é obtida sem retirada de material com formação de cavaco sólido. O volume é conservado: o material é conformado, densificado, fundido ou unido.", {
    x: 0.75, y: 1.22, w: 8.7, h: 0.7,
    fontFace: FONT, fontSize: 12, color: C.body,
  });

  const rows = [
    ["Grupo", "Processos"],
    ["Fundição", "Vazamento em molde por solidificação"],
    ["Conformação mecânica", "Laminação, trefilação, forjamento, estampagem, extrusão"],
    ["União", "Soldagem por fusão ou pressão"],
    ["Outros", "Injeção e sopro de polímeros, metalurgia do pó"],
  ];
  addSimpleTable(s, rows, 0.55, 2.1, 9.1, [2.8, 6.3]);

  calloutItalic(s, "Diferença central: a usinagem remove. Os processos sem cavaco redistribuem ou densificam.", 0.55, 4.9, 9.1);
}

// ─── SLIDE 4 — HIPÓTESE CENTRAL ──────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  sectionLabel(s, "Estrutura analítica do seminário");
  slideTitle(s, "Hipótese central — Duas camadas, dois papéis");
  hRule(s, 0.55, 1.02, 9.1);

  card(s, 0.55, 1.18, 4.4, 3.5);
  card(s, 5.25, 1.18, 4.4, 3.5);

  s.addText("Camada de Produto", {
    x: 0.75, y: 1.3, w: 4.0, h: 0.35,
    fontFace: FONT, fontSize: 13, bold: true, color: C.titleLight,
  });
  ["Extrusão em rosca dupla", "Metalurgia do pó"].forEach((item, i) => {
    s.addText(item, {
      x: 0.85, y: 1.8 + i * 0.4, w: 3.8, h: 0.35,
      fontFace: FONT, fontSize: 12, color: C.body,
    });
  });
  s.addText("Fabrica a tinta ou o pigmento", {
    x: 0.75, y: 3.55, w: 4.0, h: 0.45,
    fontFace: FONT, fontSize: 11, bold: true, color: C.sub, italic: true,
  });
  s.addText("Parâmetros físico-químicos", {
    x: 0.75, y: 3.98, w: 4.0, h: 0.35,
    fontFace: FONT, fontSize: 11, color: C.muted,
  });

  s.addText("Camada de Embalagem", {
    x: 5.45, y: 1.3, w: 4.0, h: 0.35,
    fontFace: FONT, fontSize: 13, bold: true, color: C.titleLight,
  });
  ["Laminação a frio", "Estampagem", "Injeção de polímeros", "Sopro por extrusão"].forEach((item, i) => {
    s.addText(item, {
      x: 5.55, y: 1.8 + i * 0.4, w: 3.9, h: 0.35,
      fontFace: FONT, fontSize: 12, color: C.body,
    });
  });
  s.addText("Fabrica o recipiente que contém a tinta", {
    x: 5.45, y: 3.55, w: 4.0, h: 0.45,
    fontFace: FONT, fontSize: 11, bold: true, color: C.sub, italic: true,
  });
  s.addText("Parâmetros mecânicos e de barreira", {
    x: 5.45, y: 3.98, w: 4.0, h: 0.35,
    fontFace: FONT, fontSize: 11, color: C.muted,
  });

  calloutItalic(s, "A mesma família de processos atua em duas frentes distintas na cadeia.", 0.55, 5.1, 9.1);
}

// ─── SLIDE 5 — EXTRUSÃO EM ROSCA DUPLA ───────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addVerticalBar(s, 5.35, 0.9, 3.8);

  sectionLabel(s, "Camada de produto");
  slideTitle(s, "Extrusão em rosca dupla");
  hRule(s, 0.55, 1.02, 9.1);

  s.addText("O único produto da cadeia de tintas cuja fabricação é integralmente conformação mecânica. Sem fase líquida. Sem solvente. Sem etapa química separada.", {
    x: 0.55, y: 1.12, w: 9.1, h: 0.55,
    fontFace: FONT, fontSize: 12, color: C.body,
  });

  const steps = [
    "Pesagem e mistura seca  (resina + pigmento + agente de cura + aditivos)",
    "Extrusor dupla rosca co-rotante  80–130 °C  |  50–200 bar  |  cisalhamento intenso",
    "Fita resfriada  →  chips quebradiços",
    "Moagem (Alpine ACM)  →  D50: 35–45 μm",
    "Classificação por ciclone  →  pó final",
  ];
  steps.forEach((step, i) => {
    card(s, 0.55, 1.75 + i * 0.57, 4.5, 0.5);
    s.addText(step, {
      x: 0.65, y: 1.79 + i * 0.57, w: 4.3, h: 0.42,
      fontFace: FONT, fontSize: 10, color: C.body,
    });
  });

  card(s, 5.45, 1.75, 4.2, 2.0);
  s.addText("Masterbatch de pigmentos", {
    x: 5.6, y: 1.82, w: 3.9, h: 0.35,
    fontFace: FONT, fontSize: 12, bold: true, color: C.titleLight,
  });
  s.addText("Concentrado 40–65% em peso em resina carreadora (PE/PP/EVA), produzido no mesmo tipo de equipamento a 190–250 °C.\n\nÉ o masterbatch que define a cor dos baldes — não o fabricante da embalagem.", {
    x: 5.6, y: 2.18, w: 3.9, h: 1.4,
    fontFace: FONT, fontSize: 11, color: C.body,
  });

  calloutItalic(s, "~15% do mercado global de tintas industriais. Zero COV.", 5.45, 4.9, 4.2);
}

// ─── SLIDE 6 — METALURGIA DO PÓ ──────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addVerticalBar(s, 5.35, 0.9, 3.8);

  sectionLabel(s, "Camada de produto");
  slideTitle(s, "Metalurgia do pó");
  hRule(s, 0.55, 1.02, 9.1);

  s.addText("O processo que fabrica o próprio ingrediente da formulação.", {
    x: 0.55, y: 1.12, w: 9.1, h: 0.38,
    fontFace: FONT, fontSize: 12, bold: true, color: C.body,
  });

  s.addText("Flocos de alumínio — 2 estágios", {
    x: 0.55, y: 1.58, w: 4.5, h: 0.32,
    fontFace: FONT, fontSize: 12, bold: true, color: C.titleLight,
  });
  s.addText("1. Atomização por gás inerte (N₂/Ar): alumínio líquido → pó esférico 5–150 μm\n2. Moagem em bolas + ácido esteárico → flocos 0,1–0,5 μm espessura", {
    x: 0.55, y: 1.92, w: 4.5, h: 0.85,
    fontFace: FONT, fontSize: 11, color: C.body,
  });

  const leafRows = [
    ["Tipo", "Orientação", "Função"],
    ["Leafing", "Paralela à superfície", "Barreira contínua → anticorrosão, resistência ao calor (até 600 °C)"],
    ["Non-leafing", "Aleatória", "Efeito metalizado → automotivo, decorativo"],
  ];
  addSimpleTable(s, leafRows, 0.55, 2.88, 4.5, [1.0, 1.4, 2.1]);

  s.addText("Pó de zinco — destilação e condensação", {
    x: 5.35, y: 1.58, w: 4.3, h: 0.32,
    fontFace: FONT, fontSize: 12, bold: true, color: C.titleLight,
  });
  card(s, 5.35, 1.92, 4.3, 1.55);
  s.addText("Zinco vaporizado a ~907 °C → partículas esféricas 2–10 μm\n\nPrimers ricos em zinco: 65–95% Zn em volume no filme seco (SSPC Paint 20)\n\nProteção catódica: o zinco oxida no lugar do aço", {
    x: 5.5, y: 1.98, w: 4.0, h: 1.42,
    fontFace: FONT, fontSize: 11, color: C.body,
  });

  calloutItalic(s, "A morfologia determina a função. Dois pigmentos de alumínio idênticos em composição podem proteger ou decorar — dependendo de como se orientam.", 0.55, 4.9, 9.1);
}

// ─── SLIDE 7 — LAMINAÇÃO E ESTAMPAGEM ────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addVerticalBar(s, 5.35, 0.9, 3.8);

  sectionLabel(s, "Camada de embalagem (metálica)");
  slideTitle(s, "Laminação e estampagem");
  hRule(s, 0.55, 1.02, 9.1);

  s.addText("Laminação a frio → folha-de-flandres", {
    x: 0.55, y: 1.12, w: 4.5, h: 0.32,
    fontFace: FONT, fontSize: 12, bold: true, color: C.titleLight,
  });
  s.addText("Aço AISI 1006–1010 laminado até 0,14–0,49 mm\nEncruamento: resistência 370–460 MPa  |  Ra < 0,5 μm\nRevestimento eletrolítico de estanho (1,1–11,2 g/m²): barreira + lubrificante\nCadeia no Brasil: ArcelorMittal / Usiminas → Colep Brasil, Metalflex → Sherwin-Williams, PPG, Coral, Suvinil", {
    x: 0.55, y: 1.5, w: 4.5, h: 1.55,
    fontFace: FONT, fontSize: 11, color: C.body,
  });

  s.addText("Estampagem → lata de tinta", {
    x: 5.35, y: 1.12, w: 4.3, h: 0.32,
    fontFace: FONT, fontSize: 12, bold: true, color: C.titleLight,
  });
  const stampRows = [
    ["Operação", "O que faz"],
    ["Blanking", "Corta disco circular da tira"],
    ["Repuxo profundo (DRD)", "Forma corpo cilíndrico em 2–3 estágios"],
    ["DWI (aerossol)", "Estica a parede de 0,35 mm → 0,09–0,12 mm sem costura"],
    ["Flangeamento", "Borda para dupla costura (double seaming)"],
  ];
  addSimpleTable(s, stampRows, 5.35, 1.5, 4.3, [2.0, 2.3]);

  calloutItalic(s, "A costura é a única junta mecânica da lata. Precisa ser estanque para conter solventes voláteis e impedir skinning.", 0.55, 4.9, 9.1);
}

// ─── SLIDE 8 — INJEÇÃO E SOPRO ────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addVerticalBar(s, 5.35, 0.9, 3.8);

  sectionLabel(s, "Camada de embalagem (plástica)");
  slideTitle(s, "Injeção e sopro");
  hRule(s, 0.55, 1.02, 9.1);

  s.addText("Injeção → baldes e tampas  (60–65% do volume de embalagens de tinta no Brasil)", {
    x: 0.55, y: 1.12, w: 9.1, h: 0.32,
    fontFace: FONT, fontSize: 12, bold: true, color: C.titleLight,
  });
  const injRows = [
    ["Material", "Aplicação", "Por quê"],
    ["PP copolímero (PP-C)", "Baldes 3,6 L e 18 L", "pH 7–10 (tinta base água), resistência ao impacto, ciclo 15–25 s"],
    ["PEAD grau embalagem", "Galões solvente 1–5 L", "Resistência a aromáticos (tolueno, xileno) até 60 °C"],
  ];
  addSimpleTable(s, injRows, 0.55, 1.5, 9.1, [2.1, 2.3, 4.7]);

  s.addText("Sopro por extrusão (EBM) → galões e tambores sem emenda", {
    x: 0.55, y: 2.68, w: 9.1, h: 0.32,
    fontFace: FONT, fontSize: 12, bold: true, color: C.titleLight,
  });
  s.addText("Parison extrudado → molde fecha → ar comprimido 5–10 bar → expande contra o molde\nPEAD grau sopro: MFI 0,1–0,3 g/10 min (alta resistência ao sag do parison)\nCOEX 5 camadas: PEAD externo/interno + EVOH central → barreira 2–3 ordens de grandeza para acetato de etila e metanol\nTambores 60–200 L: aprovação UN para líquidos perigosos classe 3", {
    x: 0.55, y: 3.05, w: 9.1, h: 1.65,
    fontFace: FONT, fontSize: 11, color: C.body,
  });

  calloutItalic(s, "Injeção define forma + tampas + estética. Sopro define estanqueidade + barreira química.", 0.55, 4.9, 9.1);
}

// ─── SLIDE 9 — SÍNTESE COMPARATIVA ───────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addVerticalBar(s, 5.35, 0.9, 3.8);

  sectionLabel(s, "Comparativo");
  slideTitle(s, "Síntese — A progressão dos três seminários");
  hRule(s, 0.55, 1.02, 9.1);

  const rows = [
    ["Seminário", "Processos", "Relação com o produto"],
    ["Usinagem Convencional", "Torneamento, fresamento, retificação", "Fabricam os equipamentos — não tocam a tinta"],
    ["Usinagem Não Convencional", "Laser, plasma, EDM", "Majoritariamente em equipamentos; algumas inserções diretas (PLAL, plasma de pigmentos)"],
    ["Sem Cavaco (este trabalho)", "Extrusão, metalurgia do pó, estampagem, injeção, sopro, laminação", "Fabricam diretamente a tinta, o pigmento ou a embalagem"],
  ];
  addSimpleTable(s, rows, 0.55, 1.18, 9.1, [2.3, 2.9, 3.9]);

  card(s, 0.55, 3.45, 9.1, 1.2);
  s.addText("Por quê?", {
    x: 0.75, y: 3.52, w: 8.7, h: 0.28,
    fontFace: FONT, fontSize: 11, bold: true, color: C.titleLight,
  });
  s.addText("Processos com cavaco partem de peça sólida → produzem componentes e equipamentos. Processos sem cavaco partem de pó, fundido ou polímero fluido → resultado é o produto ou o recipiente. Essa natureza os aproxima dos processos químicos que são o núcleo da cadeia de tintas.", {
    x: 0.75, y: 3.82, w: 8.7, h: 0.72,
    fontFace: FONT, fontSize: 11, color: C.body,
  });
}

// ─── SLIDE 10 — O CASO DA TINTA EM PÓ ───────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addVerticalBar(s, 5.35, 0.9, 3.8);

  sectionLabel(s, "Análise de interface");
  slideTitle(s, "O caso da tinta em pó");
  hRule(s, 0.55, 1.02, 9.1);

  s.addText("O extrusor de rosca dupla faz as três coisas ao mesmo tempo:", {
    x: 0.55, y: 1.12, w: 9.1, h: 0.32,
    fontFace: FONT, fontSize: 12, bold: true, color: C.titleLight,
  });

  const rows = [
    ["Função na produção de tinta líquida", "Equipamento específico", "Na tinta em pó"],
    ["Dispersão de pigmento", "Moinho de pérolas", "Extrusor"],
    ["Mistura de componentes", "Misturador de dois componentes", "Extrusor"],
    ["Conformação do produto final", "Estampagem (embalagem)", "Extrusor"],
  ];
  addSimpleTable(s, rows, 0.55, 1.52, 9.1, [3.3, 2.9, 2.9]);

  card(s, 0.55, 3.35, 9.1, 1.2);
  s.addText("Um único equipamento substitui o moinho, o misturador e o conformador. O extrusor não processa uma formulação já pronta — ele é a própria formulação.\n\nProvavelmente o equipamento com maior densidade funcional por metro cúbico em toda a cadeia estudada nos três seminários.", {
    x: 0.75, y: 3.42, w: 8.7, h: 1.06,
    fontFace: FONT, fontSize: 11, color: C.body, italic: true,
  });
}

// ─── SLIDE 11 — CONCLUSÃO ─────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addVerticalBar(s, 5.35, 0.9, 3.8);

  sectionLabel(s, "O que aprendemos");
  slideTitle(s, "Conclusão — 3 pontos");
  hRule(s, 0.55, 1.02, 9.1);

  const points = [
    {
      n: "1",
      title: "Os processos sem cavaco chegam ao núcleo do produto.",
      body: "Extrusão fabrica a tinta em pó. Metalurgia do pó sintetiza os pigmentos metálicos. Laminação, estampagem, injeção e sopro fabricam cada embalagem que o usuário segura.",
    },
    {
      n: "2",
      title: "Dois conjuntos de critérios, dois papéis distintos.",
      body: "Na camada de produto, os parâmetros são físico-químicos (morfologia, pureza, crosslinking). Na camada de embalagem, são mecânicos e regulatórios (estanqueidade, resistência química, testes UN).",
    },
    {
      n: "3",
      title: "A indústria de tintas vista em três seminários.",
      body: "Usinagem convencional garante precisão dos equipamentos. Métodos não convencionais intervêm na síntese e preparação de superfícies. Processos sem cavaco fabricam a tinta, o pigmento e a embalagem.",
    },
  ];

  points.forEach((p, i) => {
    card(s, 0.55, 1.18 + i * 1.12, 9.1, 1.0);
    s.addText(p.n, {
      x: 0.72, y: 1.25 + i * 1.12, w: 0.38, h: 0.38,
      fontFace: FONT, fontSize: 16, bold: true, color: C.accent, align: "center",
    });
    s.addText(p.title, {
      x: 1.18, y: 1.25 + i * 1.12, w: 8.2, h: 0.28,
      fontFace: FONT, fontSize: 12, bold: true, color: C.titleLight,
    });
    s.addText(p.body, {
      x: 1.18, y: 1.55 + i * 1.12, w: 8.2, h: 0.52,
      fontFace: FONT, fontSize: 11, color: C.body,
    });
  });

  calloutItalic(s, "A fabricação mecânica e a química de tintas não são mundos separados. São a mesma cadeia.", 0.55, 5.1, 9.1);
}

// ─── SLIDE 12 — REFERÊNCIAS ───────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  s.addText("Referências", {
    x: 0.55, y: 0.4, w: 9.1, h: 0.6,
    fontFace: FONT, fontSize: 28, color: C.titleLight,
  });
  hRule(s, 0.55, 1.0, 9.1);

  const refs = [
    "GROOVER, M. P. Fundamentals of Modern Manufacturing. 5. ed. Wiley, 2013.",
    "KALPAKJIAN, S.; SCHMID, S. R. Manufacturing Engineering and Technology. 7. ed. Pearson, 2014.",
    "MISEV, T. A.; VAN DER LINDE, R. Powder coatings, the future technology. Progress in Organic Coatings, v. 34, 1998.",
    "SMITH, W. F. Foundations of Materials Science and Engineering. 3. ed. McGraw-Hill, 2002.",
    "HARE, C. H. Zinc-rich coatings: organic versus inorganic. Journal of Protective Coatings and Linings, v. 17, n. 4, 2000.",
    "HANLON, J. F.; KELSEY, R. J.; FORCINIO, H. E. Handbook of Package Engineering. 3. ed. CRC Press, 1998.",
    "ABRAFATI. Relatório setorial 2024. São Paulo, 2024.",
    "SSPC Paint 20: Zinc-rich coating (Type I — Inorganic and Type II — Organic). Pittsburgh: SSPC, 2019.",
  ];

  refs.forEach((ref, i) => {
    s.addText(ref, {
      x: 0.55, y: 1.12 + i * 0.53,
      w: 9.1, h: 0.48,
      fontFace: FONT, fontSize: 11, color: C.body,
      bullet: true,
    });
  });
}

// ─── WRITE FILE ───────────────────────────────────────────────────────────────
pres.writeFile({ fileName: "seminario-sem-cavaco.pptx" })
  .then(() => console.log("✓ Arquivo gerado: seminario-sem-cavaco.pptx"))
  .catch(e => console.error(e));
