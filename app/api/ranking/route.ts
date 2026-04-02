import { NextResponse } from "next/server";

const CSV_RANKING =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQfg1DPMuv2HVxhnx61PiF6tiowSwJl2baHvPXGaSzB9x7BF_ASJgxtqU2qRfUdgf0dRemQNnVGYNfh/pub?gid=214006946&single=true&output=csv";

const CSV_PILOTOS =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQfg1DPMuv2HVxhnx61PiF6tiowSwJl2baHvPXGaSzB9x7BF_ASJgxtqU2qRfUdgf0dRemQNnVGYNfh/pub?gid=482963932&single=true&output=csv";

type RankingItem = {
  pos: number;
  pilotoId: string;
  piloto: string;
  nomeGuerra: string;
  pontos: number;
  adv: number;
  participacoes: number;
  vitorias: number;
  poles: number;
  mv: number;
  podios: number;
  descarte: number;
  categoriaAtual: string;
  competicao: string;
  categoria: string;
};

type RankingByCompetition = Record<string, RankingItem[]>;
type RankingData = Record<string, RankingByCompetition>;

type RankingMetaPilot = {
  pos: number;
  pilotoId: string;
  piloto: string;
  nomeGuerra: string;
  pontos: number;
  adv: number;
  participacoes: number;
  vitorias: number;
  poles: number;
  mv: number;
  podios: number;
  descarte: number;
};

type RankingCompetitionMeta = {
  summary: {
    totalPilots: number;
    leaderPoints: number;
    vicePoints: number;
    leaderAdvantage: number;
    top6CutPoints: number;
    avgPoints: number;
    totalVictories: number;
    totalPodiums: number;
  };
  radar: {
    hottestPilot: RankingMetaPilot | null;
    hottestLabel: string;
    podiumPressure: number;
    titleHeat: string;
  };
  titleFight: {
    label: string;
    tone: string;
  };
  bestEfficiencyPilot: RankingMetaPilot | null;
};

type RankingMetaData = Record<string, Record<string, RankingCompetitionMeta>>;

type PilotosMaps = {
  byId: Record<string, string>;
  byFullName: Record<string, string>;
  byFirstLast: Record<string, string>;
};

const ORDERED_CATEGORIES = ["Base", "Graduados", "Elite"];
const ORDERED_COMPETITIONS = ["T1", "T2", "T3", "GERAL"];

function normalizeText(value: string) {
  return (value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function normalizeName(value: string) {
  if (!value) return "";

  return value
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getFirstLastName(value: string) {
  const normalized = normalizeName(value);
  if (!normalized) return "";

  const parts = normalized.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0];

  return `${parts[0]} ${parts[parts.length - 1]}`;
}

function normalizeCategory(value: string) {
  const v = normalizeText(value);

  if (v === "base") return "Base";
  if (v === "graduados") return "Graduados";
  if (v === "elite") return "Elite";

  return value?.trim() || "Base";
}

function normalizeCompetition(value: string) {
  const raw = (value || "").trim().toUpperCase();
  const v = normalizeText(value).toUpperCase();

  if (v === "T1") return "T1";
  if (v === "T2") return "T2";
  if (v === "T3") return "T3";
  if (v === "GERAL") return "GERAL";

  return raw;
}

function toNumber(value: string) {
  if (!value) return 0;

  const cleaned = value.replace(/\./g, "").replace(",", ".").trim();
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : 0;
}

function detectSeparator(line: string) {
  const commaCount = (line.match(/,/g) || []).length;
  const semicolonCount = (line.match(/;/g) || []).length;
  const tabCount = (line.match(/\t/g) || []).length;

  if (tabCount > commaCount && tabCount > semicolonCount) return "\t";
  if (semicolonCount > commaCount) return ";";
  return ",";
}

function parseDelimitedLine(line: string, separator: string) {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === separator && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

function findHeaderIndex(headers: string[], possibleNames: string[]) {
  for (const name of possibleNames) {
    const normalized = normalizeText(name);
    const index = headers.findIndex((header) => header === normalized);
    if (index !== -1) return index;
  }

  return -1;
}

function sortRanking(list: RankingItem[]) {
  return [...list].sort((a, b) => {
    if (b.pontos !== a.pontos) return b.pontos - a.pontos;
    if (a.adv !== b.adv) return a.adv - b.adv;
    if (b.participacoes !== a.participacoes) {
      return b.participacoes - a.participacoes;
    }
    if (b.vitorias !== a.vitorias) return b.vitorias - a.vitorias;
    if (b.poles !== a.poles) return b.poles - a.poles;
    if (b.mv !== a.mv) return b.mv - a.mv;
    if (b.podios !== a.podios) return b.podios - a.podios;
    return a.pos - b.pos;
  });
}

function hasCompetitionData(list: RankingItem[]) {
  return list.some(
    (item) =>
      item.pontos > 0 ||
      item.adv > 0 ||
      item.participacoes > 0 ||
      item.vitorias > 0 ||
      item.poles > 0 ||
      item.mv > 0 ||
      item.podios > 0 ||
      item.descarte > 0
  );
}

function createEmptyCompetitionMap(): RankingByCompetition {
  return {
    T1: [],
    T2: [],
    T3: [],
    GERAL: [],
  };
}

function parsePilotosCsv(text: string) {
  const rawLines = text.split(/\r?\n/).map((line) => line.trimEnd());
  const nonEmptyLines = rawLines.filter((line) => line.trim().length > 0);

  if (nonEmptyLines.length < 4) {
    return {
      maps: { byId: {}, byFullName: {}, byFirstLast: {} } as PilotosMaps,
      debug: {
        reason: "Poucas linhas no CSV de pilotos.",
        firstLines: nonEmptyLines.slice(0, 10),
      },
    };
  }

  const separator = detectSeparator(nonEmptyLines[0]);
  const parsedRows = nonEmptyLines.map((line) => parseDelimitedLine(line, separator));

  const headerRowIndex = 2;
  const headers = (parsedRows[headerRowIndex] || []).map((h) => normalizeText(h));

  const idxPilotoId = findHeaderIndex(headers, ["piloto id", "id piloto", "id"]);
  const idxPilotoNome = findHeaderIndex(headers, [
    "piloto",
    "nome",
    "nome piloto",
    "piloto nome",
    "nome completo",
  ]);

  const idxNomeGuerra = 8;

  const byId: Record<string, string> = {};
  const byFullName: Record<string, string> = {};
  const byFirstLast: Record<string, string> = {};

  for (let i = headerRowIndex + 1; i < parsedRows.length; i++) {
    const cols = parsedRows[i];
    if (!cols || cols.every((col) => !(col || "").trim())) continue;

    const pilotoId = idxPilotoId >= 0 ? (cols[idxPilotoId] || "").trim() : "";
    const pilotoNomeRaw = idxPilotoNome >= 0 ? cols[idxPilotoNome] || "" : "";
    const pilotoNomeKey = normalizeText(pilotoNomeRaw);
    const pilotoFirstLastKey = normalizeText(getFirstLastName(pilotoNomeRaw));
    const nomeGuerra = normalizeName(cols[idxNomeGuerra] || "");

    if (!nomeGuerra) continue;

    if (pilotoId) {
      byId[pilotoId] = nomeGuerra;
    }

    if (pilotoNomeKey) {
      byFullName[pilotoNomeKey] = nomeGuerra;
    }

    if (pilotoFirstLastKey) {
      byFirstLast[pilotoFirstLastKey] = nomeGuerra;
    }
  }

  return {
    maps: { byId, byFullName, byFirstLast },
    debug: {
      separator,
      headerRowIndex,
      headers,
      idxPilotoId,
      idxPilotoNome,
      idxNomeGuerra,
      totalById: Object.keys(byId).length,
      totalByFullName: Object.keys(byFullName).length,
      totalByFirstLast: Object.keys(byFirstLast).length,
      sampleById: Object.entries(byId).slice(0, 10),
      sampleByFullName: Object.entries(byFullName).slice(0, 10),
      sampleByFirstLast: Object.entries(byFirstLast).slice(0, 10),
    },
  };
}

function parseRankingCsv(text: string, pilotosMaps: PilotosMaps) {
  const rawLines = text.split(/\r?\n/).map((line) => line.trimEnd());
  const nonEmptyLines = rawLines.filter((line) => line.trim().length > 0);

  if (nonEmptyLines.length < 2) {
    return {
      grouped: {} as RankingData,
      debug: {
        reason: "Poucas linhas no CSV de ranking.",
        firstLines: nonEmptyLines.slice(0, 10),
      },
    };
  }

  const separator = detectSeparator(nonEmptyLines[0]);
  const parsedRows = nonEmptyLines.map((line) => parseDelimitedLine(line, separator));

  let headerRowIndex = -1;
  for (let i = 0; i < parsedRows.length; i++) {
    const row = parsedRows[i].map((c) => normalizeText(c));
    if (row.includes("categoria") && row.includes("piloto") && row.includes("pontos")) {
      headerRowIndex = i;
      break;
    }
  }

  if (headerRowIndex === -1) {
    return {
      grouped: {} as RankingData,
      debug: {
        reason: "Cabeçalho do ranking não encontrado.",
        separator,
        firstLines: nonEmptyLines.slice(0, 15),
      },
    };
  }

  const headers = parsedRows[headerRowIndex].map((h) => normalizeText(h));

  const idxCategoria = findHeaderIndex(headers, ["categoria"]);
  const idxCompeticao = findHeaderIndex(headers, ["competicao", "competição"]);
  const idxPosicao = findHeaderIndex(headers, ["posicao", "posição", "pos"]);
  const idxPilotoId = findHeaderIndex(headers, ["piloto id", "id piloto"]);
  const idxPiloto = findHeaderIndex(headers, ["piloto"]);
  const idxPontos = findHeaderIndex(headers, ["pontos", "pts"]);
  const idxAdv = findHeaderIndex(headers, ["adv", "advertencias", "advertências"]);
  const idxParticipacoes = findHeaderIndex(headers, [
    "participacoes",
    "participações",
    "participacao",
    "participação",
  ]);
  const idxVitorias = findHeaderIndex(headers, ["vitorias", "vitórias"]);
  const idxPoles = findHeaderIndex(headers, ["poles", "pole", "pol"]);
  const idxMv = findHeaderIndex(headers, [
    "melhores voltas",
    "melhor volta",
    "mv",
    "vmr",
  ]);
  const idxPodios = findHeaderIndex(headers, [
    "podios",
    "pódios",
    "podio",
    "pódio",
  ]);
  const idxDescarte = findHeaderIndex(headers, ["descarte"]);
  const idxCategoriaAtual = findHeaderIndex(headers, [
    "categoria atual",
    "cat atual",
  ]);

  const grouped: RankingData = {};
  let totalRows = 0;
  let acceptedRows = 0;
  let ignoredEmptyPilot = 0;
  let matchedById = 0;
  let matchedByFullName = 0;
  let matchedByFirstLast = 0;
  let withoutNomeGuerra = 0;

  for (let i = headerRowIndex + 1; i < parsedRows.length; i++) {
    const cols = parsedRows[i];
    totalRows++;

    const pilotoOriginal = idxPiloto >= 0 ? (cols[idxPiloto] || "").trim() : "";
    const piloto = normalizeName(pilotoOriginal);
    const pilotoKey = normalizeText(pilotoOriginal);
    const pilotoFirstLastKey = normalizeText(getFirstLastName(pilotoOriginal));

    if (!piloto) {
      ignoredEmptyPilot++;
      continue;
    }

    const pilotoId = idxPilotoId >= 0 ? (cols[idxPilotoId] || "").trim() : "";
    const categoriaOriginal = idxCategoria >= 0 ? cols[idxCategoria] || "" : "";
    const competicaoOriginal = idxCompeticao >= 0 ? cols[idxCompeticao] || "" : "";
    const categoriaAtualOriginal =
      idxCategoriaAtual >= 0
        ? cols[idxCategoriaAtual] || categoriaOriginal
        : categoriaOriginal;

    const categoria = normalizeCategory(categoriaOriginal);
    const competicao = normalizeCompetition(competicaoOriginal);

    if (!ORDERED_CATEGORIES.includes(categoria)) continue;
    if (!ORDERED_COMPETITIONS.includes(competicao)) continue;

    let nomeGuerra = "";

    if (pilotoId && pilotosMaps.byId[pilotoId]) {
      nomeGuerra = pilotosMaps.byId[pilotoId];
      matchedById++;
    } else if (pilotoKey && pilotosMaps.byFullName[pilotoKey]) {
      nomeGuerra = pilotosMaps.byFullName[pilotoKey];
      matchedByFullName++;
    } else if (pilotoFirstLastKey && pilotosMaps.byFirstLast[pilotoFirstLastKey]) {
      nomeGuerra = pilotosMaps.byFirstLast[pilotoFirstLastKey];
      matchedByFirstLast++;
    } else {
      withoutNomeGuerra++;
    }

    const item: RankingItem = {
      pos: idxPosicao >= 0 ? toNumber(cols[idxPosicao]) : 0,
      pilotoId,
      piloto,
      nomeGuerra,
      pontos: idxPontos >= 0 ? toNumber(cols[idxPontos]) : 0,
      adv: idxAdv >= 0 ? toNumber(cols[idxAdv]) : 0,
      participacoes:
        idxParticipacoes >= 0 ? toNumber(cols[idxParticipacoes]) : 0,
      vitorias: idxVitorias >= 0 ? toNumber(cols[idxVitorias]) : 0,
      poles: idxPoles >= 0 ? toNumber(cols[idxPoles]) : 0,
      mv: idxMv >= 0 ? toNumber(cols[idxMv]) : 0,
      podios: idxPodios >= 0 ? toNumber(cols[idxPodios]) : 0,
      descarte: idxDescarte >= 0 ? toNumber(cols[idxDescarte]) : 0,
      categoriaAtual: normalizeCategory(categoriaAtualOriginal),
      competicao,
      categoria,
    };

    if (!grouped[categoria]) {
      grouped[categoria] = createEmptyCompetitionMap();
    }

    grouped[categoria][competicao].push(item);
    acceptedRows++;
  }

  const orderedGrouped: RankingData = {};

  for (const category of ORDERED_CATEGORIES) {
    const competitions = grouped[category];
    if (!competitions) continue;

    const orderedCompetitions: RankingByCompetition = {};

    for (const competition of ORDERED_COMPETITIONS) {
      const list = competitions[competition] || [];
      const sorted = sortRanking(list);
      if (hasCompetitionData(sorted)) {
        orderedCompetitions[competition] = sorted;
      }
    }

    if (Object.keys(orderedCompetitions).length > 0) {
      orderedGrouped[category] = orderedCompetitions;
    }
  }

  return {
    grouped: orderedGrouped,
    debug: {
      separator,
      headerRowIndex,
      headers,
      totalRows,
      acceptedRows,
      ignoredEmptyPilot,
      matchedById,
      matchedByFullName,
      matchedByFirstLast,
      withoutNomeGuerra,
      categoriesFound: Object.keys(orderedGrouped),
      competitionsByCategory: Object.fromEntries(
        Object.entries(orderedGrouped).map(([category, competitions]) => [
          category,
          Object.keys(competitions),
        ])
      ),
      sampleNomeGuerra: Object.values(orderedGrouped)
        .flatMap((competitions) => Object.values(competitions))
        .flat()
        .filter((item) => !!item.nomeGuerra)
        .slice(0, 10)
        .map((item) => ({
          pilotoId: item.pilotoId,
          piloto: item.piloto,
          nomeGuerra: item.nomeGuerra,
        })),
    },
  };
}


function toMetaPilot(item: RankingItem | null | undefined): RankingMetaPilot | null {
  if (!item) return null;

  return {
    pos: item.pos,
    pilotoId: item.pilotoId,
    piloto: item.piloto,
    nomeGuerra: item.nomeGuerra,
    pontos: item.pontos,
    adv: item.adv,
    participacoes: item.participacoes,
    vitorias: item.vitorias,
    poles: item.poles,
    mv: item.mv,
    podios: item.podios,
    descarte: item.descarte,
  };
}

function getTitleFightStatus(top3: RankingItem[]) {
  if (!top3 || top3.length < 2) {
    return {
      label: "SEM DISPUTA",
      tone: "border-zinc-200 bg-zinc-100 text-zinc-600",
    };
  }

  const leader = top3[0];
  const second = top3[1];
  const diff = leader.pontos - second.pontos;

  if (diff <= 3) {
    return {
      label: "BRIGA ACIRRADA",
      tone: "border-emerald-300 bg-emerald-100 text-emerald-800",
    };
  }

  if (diff <= 8) {
    return {
      label: "DISPUTA CONTROLADA",
      tone: "border-yellow-300 bg-yellow-100 text-yellow-800",
    };
  }

  return {
    label: "LIDERANÇA ISOLADA",
    tone: "border-zinc-300 bg-zinc-100 text-zinc-700",
  };
}

function buildCompetitionMeta(list: RankingItem[]): RankingCompetitionMeta {
  const filtered = list.filter((item) => item.pontos > 0);
  const totalPilots = filtered.length;
  const leaderPoints = filtered[0]?.pontos || 0;
  const vicePoints = filtered[1]?.pontos || 0;
  const top6CutPoints =
    totalPilots >= 6
      ? filtered[5]?.pontos || 0
      : filtered[totalPilots - 1]?.pontos || 0;

  const totalPoints = filtered.reduce((sum, item) => sum + item.pontos, 0);
  const avgPoints = totalPilots > 0 ? totalPoints / totalPilots : 0;
  const totalVictories = filtered.reduce((sum, item) => sum + item.vitorias, 0);
  const totalPodiums = filtered.reduce((sum, item) => sum + item.podios, 0);

  let hottestPilot: RankingItem | null = null;
  let hottestLabel = "Sem leitura";
  let podiumPressure = 0;
  let titleHeat = "Sem disputa";

  if (filtered.length > 0) {
    hottestPilot =
      [...filtered].sort((a, b) => {
        const aScore = a.vitorias * 4 + a.poles * 2 + a.mv * 2 + a.podios;
        const bScore = b.vitorias * 4 + b.poles * 2 + b.mv * 2 + b.podios;
        if (bScore !== aScore) return bScore - aScore;
        return b.pontos - a.pontos;
      })[0] || null;

    podiumPressure =
      filtered.length >= 6
        ? Math.max((filtered[2]?.pontos || 0) - (filtered[5]?.pontos || 0), 0)
        : Math.max((filtered[0]?.pontos || 0) - (filtered[filtered.length - 1]?.pontos || 0), 0);

    const titleDiff = Math.max((filtered[0]?.pontos || 0) - (filtered[1]?.pontos || 0), 0);

    if (filtered.length < 2) {
      titleHeat = "Sem disputa";
    } else if (titleDiff <= 3) {
      titleHeat = "Briga acirrada";
    } else if (titleDiff <= 8) {
      titleHeat = "Controle parcial";
    } else {
      titleHeat = "Liderança isolada";
    }

    hottestLabel = "Momento forte";
    if ((hottestPilot?.vitorias || 0) >= 3) {
      hottestLabel = "Ataque dominante";
    } else if ((hottestPilot?.podios || 0) >= 4) {
      hottestLabel = "Consistência premium";
    } else if ((hottestPilot?.poles || 0) >= 2 || (hottestPilot?.mv || 0) >= 2) {
      hottestLabel = "Velocidade em alta";
    }
  }

  const eligible = filtered.filter((item) => item.participacoes > 0);
  const bestEfficiencyPilot =
    eligible.length > 0
      ? [...eligible].sort((a, b) => {
          const aEfficiency = a.pontos / Math.max(a.participacoes, 1);
          const bEfficiency = b.pontos / Math.max(b.participacoes, 1);
          if (bEfficiency !== aEfficiency) return bEfficiency - aEfficiency;
          return b.pontos - a.pontos;
        })[0]
      : null;

  return {
    summary: {
      totalPilots,
      leaderPoints,
      vicePoints,
      leaderAdvantage: Math.max(leaderPoints - vicePoints, 0),
      top6CutPoints,
      avgPoints,
      totalVictories,
      totalPodiums,
    },
    radar: {
      hottestPilot: toMetaPilot(hottestPilot),
      hottestLabel,
      podiumPressure,
      titleHeat,
    },
    titleFight: getTitleFightStatus(filtered.slice(0, 3)),
    bestEfficiencyPilot: toMetaPilot(bestEfficiencyPilot),
  };
}

function buildRankingMeta(grouped: RankingData): RankingMetaData {
  const meta: RankingMetaData = {};

  for (const [category, competitions] of Object.entries(grouped)) {
    meta[category] = {};

    for (const [competition, list] of Object.entries(competitions)) {
      meta[category][competition] = buildCompetitionMeta(list || []);
    }
  }

  return meta;
}


export async function GET() {
  try {
    const [rankingResponse, pilotosResponse] = await Promise.all([
      fetch(CSV_RANKING, {
        cache: "no-store",
        redirect: "follow",
      }),
      fetch(CSV_PILOTOS, {
        cache: "no-store",
        redirect: "follow",
      }),
    ]);

    if (!rankingResponse.ok) {
      return NextResponse.json(
        {
          error: "Não foi possível carregar a planilha de ranking.",
          status: rankingResponse.status,
          statusText: rankingResponse.statusText,
        },
        { status: 500 }
      );
    }

    if (!pilotosResponse.ok) {
      return NextResponse.json(
        {
          error: "Não foi possível carregar a planilha de pilotos.",
          status: pilotosResponse.status,
          statusText: pilotosResponse.statusText,
        },
        { status: 500 }
      );
    }

    const [rankingText, pilotosText] = await Promise.all([
      rankingResponse.text(),
      pilotosResponse.text(),
    ]);

    const pilotosParsed = parsePilotosCsv(pilotosText);
    const rankingParsed = parseRankingCsv(rankingText, pilotosParsed.maps);

    const rankingMeta = buildRankingMeta(rankingParsed.grouped);

    return NextResponse.json({
      categories: Object.keys(rankingParsed.grouped),
      data: rankingParsed.grouped,
      meta: rankingMeta,
      debug: {
        pilotos: pilotosParsed.debug,
        ranking: rankingParsed.debug,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro ao buscar dados da planilha.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
