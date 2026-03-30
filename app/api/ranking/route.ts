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

type RankingData = Record<string, RankingItem[]>;

type PilotosMaps = {
  byId: Record<string, string>;
  byName: Record<string, string>;
};

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

function findHeaderRowIndex(
  lines: string[],
  separator: string,
  requiredColumns: string[]
) {
  for (let i = 0; i < lines.length; i++) {
    const cols = parseDelimitedLine(lines[i], separator).map((c) =>
      normalizeText(c)
    );

    const hasAll = requiredColumns.every((name) =>
      cols.includes(normalizeText(name))
    );

    if (hasAll) return i;
  }

  return -1;
}

function findHeaderIndex(headers: string[], possibleNames: string[]) {
  for (const name of possibleNames) {
    const normalized = normalizeText(name);
    const index = headers.indexOf(normalized);
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

function parsePilotosCsv(text: string) {
  const rawLines = text.split(/\r?\n/).map((line) => line.trim());
  const nonEmptyLines = rawLines.filter(Boolean);

  if (nonEmptyLines.length < 2) {
    return {
      maps: { byId: {}, byName: {} } as PilotosMaps,
      debug: {
        reason: "Poucas linhas no CSV de pilotos.",
        firstLines: nonEmptyLines.slice(0, 10),
      },
    };
  }

  const separator = detectSeparator(nonEmptyLines[0]);
  const headerRowIndex = findHeaderRowIndex(nonEmptyLines, separator, [
    "piloto id",
  ]);

  if (headerRowIndex === -1) {
    return {
      maps: { byId: {}, byName: {} } as PilotosMaps,
      debug: {
        reason: "Cabeçalho da aba PILOTOS não encontrado.",
        separator,
        firstLines: nonEmptyLines.slice(0, 15),
      },
    };
  }

  const headers = parseDelimitedLine(nonEmptyLines[headerRowIndex], separator).map(
    (h) => normalizeText(h)
  );

  const idxPilotoId = findHeaderIndex(headers, ["piloto id", "id piloto", "id"]);
  const idxPilotoNome = findHeaderIndex(headers, [
    "piloto",
    "nome",
    "nome piloto",
    "piloto nome",
  ]);

  // Coluna I fixa = índice 8
  const idxNomeGuerra = 8;

  const byId: Record<string, string> = {};
  const byName: Record<string, string> = {};

  for (let i = headerRowIndex + 1; i < nonEmptyLines.length; i++) {
    const cols = parseDelimitedLine(nonEmptyLines[i], separator);

    const pilotoId = idxPilotoId >= 0 ? (cols[idxPilotoId] || "").trim() : "";
    const pilotoNome =
      idxPilotoNome >= 0 ? normalizeName(cols[idxPilotoNome] || "") : "";
    const pilotoNomeKey =
      idxPilotoNome >= 0 ? normalizeText(cols[idxPilotoNome] || "") : "";

    const nomeGuerra =
      idxNomeGuerra >= 0 ? normalizeName(cols[idxNomeGuerra] || "") : "";

    if (pilotoId && nomeGuerra) {
      byId[pilotoId] = nomeGuerra;
    }

    if (pilotoNome && pilotoNomeKey && nomeGuerra) {
      byName[pilotoNomeKey] = nomeGuerra;
    }
  }

  return {
    maps: { byId, byName },
    debug: {
      separator,
      headerRowIndex,
      headers,
      idxPilotoId,
      idxPilotoNome,
      idxNomeGuerra,
      totalPorId: Object.keys(byId).length,
      totalPorNome: Object.keys(byName).length,
      sampleById: Object.entries(byId).slice(0, 10),
      sampleByName: Object.entries(byName).slice(0, 10),
    },
  };
}

function parseRankingCsv(text: string, pilotosMaps: PilotosMaps) {
  const rawLines = text.split(/\r?\n/).map((line) => line.trim());
  const nonEmptyLines = rawLines.filter(Boolean);

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
  const headerRowIndex = findHeaderRowIndex(nonEmptyLines, separator, [
    "categoria",
    "piloto",
    "pontos",
  ]);

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

  const headers = parseDelimitedLine(nonEmptyLines[headerRowIndex], separator).map(
    (h) => normalizeText(h)
  );

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
  let matchedByName = 0;
  let withoutNomeGuerra = 0;

  for (let i = headerRowIndex + 1; i < nonEmptyLines.length; i++) {
    const cols = parseDelimitedLine(nonEmptyLines[i], separator);
    totalRows++;

    const pilotoOriginal = idxPiloto >= 0 ? (cols[idxPiloto] || "").trim() : "";
    const piloto = normalizeName(pilotoOriginal);
    const pilotoKey = normalizeText(pilotoOriginal);

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

    let nomeGuerra = "";
    if (pilotoId && pilotosMaps.byId[pilotoId]) {
      nomeGuerra = pilotosMaps.byId[pilotoId];
      matchedById++;
    } else if (pilotoKey && pilotosMaps.byName[pilotoKey]) {
      nomeGuerra = pilotosMaps.byName[pilotoKey];
      matchedByName++;
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

    if (!grouped[categoria]) grouped[categoria] = [];
    grouped[categoria].push(item);
    acceptedRows++;
  }

  Object.keys(grouped).forEach((category) => {
    grouped[category] = sortRanking(grouped[category]);
  });

  return {
    grouped,
    debug: {
      separator,
      headerRowIndex,
      headers,
      totalRows,
      acceptedRows,
      ignoredEmptyPilot,
      matchedById,
      matchedByName,
      withoutNomeGuerra,
      categoriesFound: Object.keys(grouped),
      competitionsByCategory: Object.fromEntries(
        Object.entries(grouped).map(([category, items]) => [
          category,
          [...new Set(items.map((item) => item.competicao))],
        ])
      ),
      sampleNomeGuerra: Object.values(grouped)
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

    return NextResponse.json({
      categories: Object.keys(rankingParsed.grouped),
      data: rankingParsed.grouped,
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
