"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Trophy,
  Medal,
  Timer,
  Flag,
  Users,
  BarChart3,
  Search,
  Crown,
  Gauge,
  ArrowLeft,
  User,
  ChevronRight,
  ShieldCheck,
  Camera,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

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

const categoryColors: Record<string, string> = {
  Base: "bg-sky-50 text-sky-700 border-sky-200",
  Graduados: "bg-amber-50 text-amber-700 border-amber-200",
  Elite: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
};

const competitionLabels: Record<string, string> = {
  T1: "1º Turno",
  T2: "2º Turno",
  T3: "3º Turno",
  GERAL: "Geral",
};

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

function buildPilotEvolution(leader: RankingItem | undefined) {
  if (!leader) return [];
  const p = leader.pontos;
  return [
    { etapa: "Início", pontos: Math.round(p * 0.35) },
    { etapa: "Meio", pontos: Math.round(p * 0.7) },
    { etapa: "Atual", pontos: p },
  ];
}

function buildCategoryLeaderChart(data: RankingData) {
  return Object.keys(data).map((category) => {
    const categoryItems = data[category] || [];
    const orderedCompetitions = ["T1", "T2", "T3", "GERAL"];

    const availableCompetitions = orderedCompetitions.filter((competition) =>
      hasCompetitionData(
        categoryItems.filter((item) => item.competicao === competition)
      )
    );

    const currentCompetition =
      availableCompetitions[availableCompetitions.length - 1] || "T1";

    const leader = sortRanking(
      categoryItems.filter(
        (item) => item.competicao === currentCompetition && item.pontos > 0
      )
    )[0];

    return {
      categoria: category,
      pontos: leader?.pontos || 0,
    };
  });
}

function buildSelectedPilotEvolution(selectedPilot: RankingItem | null) {
  if (!selectedPilot) return [];

  const p = selectedPilot.pontos;
  return [
    { etapa: "Início", pontos: Math.round(p * 0.35) },
    { etapa: "Meio", pontos: Math.round(p * 0.7) },
    { etapa: "Atual", pontos: p },
  ];
}

function normalizePilotName(name?: string) {
  if (!name) return "-";

  return name
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getPilotNameParts(name?: string) {
  const normalized = normalizePilotName(name);

  if (!normalized || normalized === "-") {
    return { firstName: "-", lastName: "" };
  }

  const parts = normalized.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };

  return {
    firstName: parts[0],
    lastName: parts[parts.length - 1],
  };
}

function getPilotFirstAndLastName(name?: string) {
  const { firstName, lastName } = getPilotNameParts(name);
  return lastName ? `${firstName} ${lastName}` : firstName;
}

function getPilotDisplayName(name?: string) {
  return normalizePilotName(name);
}

function getPilotWarName(pilot?: RankingItem | null) {
  const nomeGuerra = normalizePilotName(pilot?.nomeGuerra);
  if (!nomeGuerra || nomeGuerra === "-") return "";
  return nomeGuerra;
}

function getPilotHighlightName(name?: string) {
  const normalized = normalizePilotName(name);
  return normalized === "-" ? "-" : normalized.toUpperCase();
}

function getPilotPhotoPath(pilot?: RankingItem | null) {
  if (!pilot?.pilotoId) return null;
  return `/pilotos/${pilot.pilotoId}.jpg`;
}

function CompactStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent = false,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <Card
      className={`rounded-[20px] border shadow-none ${
        accent
          ? "border-yellow-300/80 bg-yellow-50/70"
          : "border-black/5 bg-white"
      }`}
    >
      <CardContent className="p-3.5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            {title}
          </p>
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-2xl ${
              accent ? "bg-yellow-100" : "bg-zinc-100"
            }`}
          >
            <Icon
              className={`h-3.5 w-3.5 ${
                accent ? "text-yellow-700" : "text-zinc-600"
              }`}
            />
          </div>
        </div>

        <p className="text-[22px] font-bold leading-none tracking-tight text-zinc-950">
          {value}
        </p>

        <p className="mt-1.5 text-xs leading-snug text-zinc-500">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

function HighlightCard({
  title,
  icon: Icon,
  children,
  accent = false,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <Card
      className={`h-[178px] rounded-[22px] border shadow-none ${
        accent
          ? "border-yellow-300 bg-yellow-50/75"
          : "border-black/5 bg-white"
      }`}
    >
      <CardContent className="flex h-full flex-col px-4 pb-4 pt-1">
        <div className="mb-0 flex items-start justify-between gap-2">
          <p className="w-full text-center text-[12px] font-semibold uppercase tracking-[0.18em] leading-none text-zinc-500">
            {title}
          </p>
          <div
            className={`-mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-xl ${
              accent ? "bg-yellow-100" : "bg-zinc-100"
            }`}
          >
            <Icon
              className={`h-3 w-3 ${
                accent ? "text-yellow-700" : "text-zinc-600"
              }`}
            />
          </div>
        </div>

        <div className="flex-1 pt-0.5">{children}</div>
      </CardContent>
    </Card>
  );
}

function PilotPhotoSlot({
  pilot,
  alt,
}: {
  pilot?: RankingItem | null;
  alt: string;
}) {
  const src = getPilotPhotoPath(pilot);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const showImage = !!src && !hasError;

  return (
    <div className="h-full w-full bg-zinc-50">
      {showImage ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100">
              <Camera className="h-5 w-5 text-zinc-500" />
            </div>
            <p className="text-[11px] font-medium text-zinc-500">
              Espaço reservado
            </p>
            <p className="mt-1 text-[11px] font-medium text-zinc-500">
              para foto 1:1
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CasernaKartAppModerno() {
  const [rankingData, setRankingData] = useState<RankingData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("Base");
  const [competition, setCompetition] = useState("T1");
  const [search, setSearch] = useState("");
  const [selectedPilot, setSelectedPilot] = useState<RankingItem | null>(null);
  const [activeTab, setActiveTab] = useState("classificacao");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/ranking", { cache: "no-store" });
        const json = await response.json();

        if (!response.ok) {
          throw new Error(json?.error || "Erro ao carregar os dados.");
        }

        setRankingData(json.data || {});

        const cats = json.categories || [];
        if (cats.length > 0) {
          setCategory((prev) => (cats.includes(prev) ? prev : cats[0]));
        }
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Erro desconhecido.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const categories = useMemo(() => Object.keys(rankingData), [rankingData]);

  const availableCompetitions = useMemo(() => {
    const categoryItems = rankingData[category] || [];
    const orderedCompetitions = ["T1", "T2", "T3", "GERAL"];

    return orderedCompetitions.filter((comp) =>
      hasCompetitionData(
        categoryItems.filter((item) => item.competicao === comp)
      )
    );
  }, [rankingData, category]);

  useEffect(() => {
    if (availableCompetitions.length === 0) return;

    setCompetition((prev) =>
      availableCompetitions.includes(prev) ? prev : availableCompetitions[0]
    );
  }, [availableCompetitions]);

  useEffect(() => {
    setSelectedPilot(null);
  }, [category, competition]);

  const filteredRanking = useMemo(() => {
    const list = (rankingData[category] || []).filter(
      (item) => item.competicao === competition && item.pontos > 0
    );

    const sorted = sortRanking(list);

    return sorted.filter((item) =>
      normalizePilotName(item.piloto)
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [rankingData, category, competition, search]);

  const leader = filteredRanking[0];
  const leaderEvolution = useMemo(() => buildPilotEvolution(leader), [leader]);
  const selectedPilotEvolution = useMemo(
    () => buildSelectedPilotEvolution(selectedPilot),
    [selectedPilot]
  );
  const chartData = useMemo(
    () => buildCategoryLeaderChart(rankingData),
    [rankingData]
  );
  const leaderName = useMemo(() => getPilotNameParts(leader?.piloto), [leader]);

  function handleSelectPilot(pilot: RankingItem) {
    setSelectedPilot(pilot);
    setActiveTab("piloto");
  }

  function handleBackToRanking() {
    setActiveTab("classificacao");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] text-zinc-950">
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="text-center">
            <p className="text-xl font-semibold tracking-tight">
              Carregando campeonato...
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Preparando classificação oficial
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] text-zinc-950">
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="max-w-md rounded-3xl border border-red-300 bg-white p-6 text-center shadow-sm">
            <p className="text-2xl font-semibold tracking-tight">Erro</p>
            <p className="mt-2 text-zinc-600">{error}</p>
            <p className="mt-4 text-sm text-zinc-500">
              Abra <strong>/api/ranking</strong> no navegador para testar.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans text-zinc-950 antialiased">
      <div className="mx-auto max-w-md px-4 pb-20 pt-4">
        <header className="sticky top-0 z-20 mb-4 rounded-[24px] border border-black/5 bg-white/95 px-4 py-4 shadow-sm backdrop-blur-xl">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <div className="relative h-9 w-28 shrink-0 overflow-hidden">
                <Image
                  src="/kartLogo.png"
                  alt="Kart Racing"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>

              <div className="min-w-0 pt-0.5">
                <div className="flex flex-col items-center">
                  <h1 className="text-[19px] font-black uppercase italic leading-none tracking-tight text-zinc-950">
                    CLASSIFICAÇÃO
                  </h1>
                  <h2 className="mt-1 text-[19px] font-black uppercase italic leading-none tracking-tight text-zinc-950">
                    OFICIAL
                  </h2>
                </div>
              </div>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-yellow-50">
              <ShieldCheck className="h-4 w-4 text-yellow-700" />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="overflow-x-auto">
              <div className="flex gap-2 pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`whitespace-nowrap rounded-2xl border px-3 py-2 text-xs font-semibold transition ${
                      category === cat
                        ? "border-yellow-300 bg-yellow-50 text-yellow-800"
                        : "border-black/5 bg-zinc-50 text-zinc-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="flex gap-2 pb-1">
                {availableCompetitions.map((comp) => (
                  <button
                    key={comp}
                    onClick={() => setCompetition(comp)}
                    className={`whitespace-nowrap rounded-2xl border px-3 py-2 text-xs font-semibold transition ${
                      competition === comp
                        ? "border-yellow-300 bg-yellow-50 text-yellow-800"
                        : "border-black/5 bg-zinc-50 text-zinc-700"
                    }`}
                  >
                    {competitionLabels[comp] || comp}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        <section className="rounded-[24px] border border-black/5 bg-white px-4 py-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-zinc-700">
              <span className="font-bold text-zinc-950">PILOTO DESTAQUE</span>
              <span className="text-zinc-500">
                {" "}
                - líder da categoria e campeonato selecionado
              </span>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-yellow-50">
              <Trophy className="h-4 w-4 text-yellow-700" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <HighlightCard title="Líder" icon={Crown} accent>
              <div className="flex h-full flex-col items-center justify-center pt-0 text-center">
                <div>
                  <p className="text-[28px] font-bold leading-none tracking-tight text-zinc-950">
                    {leaderName.firstName.toUpperCase()}
                  </p>
                  <p className="mt-1 text-[20px] font-semibold leading-none tracking-tight text-zinc-800">
                    {leaderName.lastName ? leaderName.lastName.toUpperCase() : ""}
                  </p>
                </div>

                <p className="mt-5 text-sm text-zinc-500">
                  {leader?.pontos || 0} pontos
                </p>
              </div>
            </HighlightCard>

            <HighlightCard title="Vitórias" icon={Medal}>
              <div className="flex h-full flex-col items-center justify-center pt-0 text-center">
                <p className="text-[42px] font-bold leading-none tracking-tight text-zinc-950">
                  {leader?.vitorias || 0}
                </p>
                <p className="mt-3 text-sm text-zinc-500">
                  vitórias nesta classificação
                </p>
              </div>
            </HighlightCard>

            <Card className="h-[176px] overflow-hidden rounded-[22px] border border-black/5 shadow-none">
              <CardContent className="h-full p-0">
                <PilotPhotoSlot
                  pilot={leader}
                  alt={getPilotHighlightName(leader?.piloto)}
                />
              </CardContent>
            </Card>

            <HighlightCard title="Pódios" icon={Medal}>
              <div className="flex h-full flex-col items-center justify-center pt-0 text-center">
                <p className="text-[42px] font-bold leading-none tracking-tight text-zinc-950">
                  {leader?.podios || 0}
                </p>
                <p className="mt-3 text-sm text-zinc-500">
                  pódios nesta classificação
                </p>
              </div>
            </HighlightCard>
          </div>
        </section>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-5">
          <TabsList className="grid w-full grid-cols-3 rounded-2xl border border-black/5 bg-white p-1 shadow-sm">
            <TabsTrigger
              value="classificacao"
              className="rounded-xl text-zinc-700 data-[state=active]:bg-zinc-100 data-[state=active]:text-zinc-950"
            >
              Classificação
            </TabsTrigger>
            <TabsTrigger
              value="piloto"
              className="rounded-xl text-zinc-700 data-[state=active]:bg-zinc-100 data-[state=active]:text-zinc-950"
            >
              Piloto
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="rounded-xl text-zinc-700 data-[state=active]:bg-zinc-100 data-[state=active]:text-zinc-950"
            >
              Stats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="classificacao" className="space-y-4 pt-4">
            <Card className="rounded-[22px] border-black/5 bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar piloto"
                    className="h-11 rounded-2xl border-black/5 bg-white pl-9 text-zinc-950 placeholder:text-zinc-400"
                  />
                </div>
              </CardContent>
            </Card>

            <section className="space-y-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  Classificação geral
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  Categoria e campeonato selecionados
                </p>
              </div>

              <Card className="overflow-hidden rounded-[22px] border-black/5 bg-white shadow-sm">
                <CardContent className="p-0">
                  <div className="max-h-[520px] overflow-y-auto">
                    <table className="w-full table-fixed">
                      <colgroup>
                        <col className="w-[46px]" />
                        <col />
                        <col className="w-[34px]" />
                        <col className="w-[34px]" />
                        <col className="w-[34px]" />
                        <col className="w-[38px]" />
                        <col className="w-[46px]" />
                      </colgroup>

                      <thead className="sticky top-0 z-10">
                        <tr className="border-b border-black/5 bg-zinc-50/95 text-[10px] font-semibold uppercase tracking-[0.10em] text-zinc-500 backdrop-blur">
                          <th className="px-0.5 py-3 text-center whitespace-nowrap">
                            Pos.
                          </th>
                          <th className="px-2 py-3 text-left whitespace-nowrap">
                            Piloto
                          </th>
                          <th className="px-0.5 py-3 text-center whitespace-nowrap">
                            Pts
                          </th>
                          <th className="px-0.5 py-3 text-center whitespace-nowrap">
                            Vit
                          </th>
                          <th className="px-0.5 py-3 text-center whitespace-nowrap">
                            Pol
                          </th>
                          <th className="px-0.5 py-3 text-center whitespace-nowrap">
                            VMR
                          </th>
                          <th className="px-0.5 py-3 text-center whitespace-nowrap">
                            Pódios
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredRanking.map((item, index) => {
                          const nomeLinha1 = getPilotFirstAndLastName(item.piloto);
                          const nomeLinha2 = getPilotWarName(item);

                          return (
                            <tr
                              key={`${category}-${competition}-table-${item.pos}-${item.piloto}`}
                              className={`transition hover:bg-zinc-50 ${
                                index % 2 === 0 ? "bg-white" : "bg-zinc-50/50"
                              }`}
                            >
                              <td className="px-0.5 py-3 text-center align-middle">
                                <button
                                  type="button"
                                  onClick={() => handleSelectPilot(item)}
                                  className="mx-auto flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold"
                                >
                                  <span
                                    className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                                      item.pos === 1
                                        ? "bg-yellow-400 text-black"
                                        : "bg-zinc-100 text-zinc-800"
                                    }`}
                                  >
                                    {item.pos}
                                  </span>
                                </button>
                              </td>

                              <td className="min-w-0 px-2 py-3 align-middle">
                                <button
                                  type="button"
                                  onClick={() => handleSelectPilot(item)}
                                  className="block w-full text-left"
                                >
                                  <span className="block leading-tight text-zinc-950">
                                    <span className="block text-[12px] font-bold tracking-tight">
                                      {nomeLinha1}
                                    </span>

                                    {nomeLinha2 ? (
                                      <span className="mt-1 block text-[10px] font-medium text-zinc-500">
                                        {nomeLinha2}
                                      </span>
                                    ) : null}
                                  </span>
                                </button>
                              </td>

                              <td className="px-0.5 py-3 text-center align-middle text-[12px] font-semibold text-zinc-950">
                                {item.pontos}
                              </td>
                              <td className="px-0.5 py-3 text-center align-middle text-[12px] font-semibold text-zinc-950">
                                {item.vitorias}
                              </td>
                              <td className="px-0.5 py-3 text-center align-middle text-[12px] font-semibold text-zinc-950">
                                {item.poles}
                              </td>
                              <td className="px-0.5 py-3 text-center align-middle text-[12px] font-semibold text-zinc-950">
                                {item.mv}
                              </td>
                              <td className="px-0.5 py-3 text-center align-middle text-[12px] font-semibold text-zinc-950">
                                {item.podios}
                              </td>
                            </tr>
                          );
                        })}

                        {filteredRanking.length === 0 && (
                          <tr>
                            <td
                              colSpan={7}
                              className="px-4 py-6 text-center text-sm text-zinc-500"
                            >
                              Nenhum piloto com pontos encontrado.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </section>
          </TabsContent>

          <TabsContent value="piloto" className="space-y-4 pt-4">
            {!selectedPilot ? (
              <Card className="rounded-[22px] border-black/5 bg-white shadow-sm">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-zinc-100">
                    <User className="h-7 w-7 text-zinc-500" />
                  </div>
                  <p className="mt-4 text-base font-semibold text-zinc-950">
                    Nenhum piloto selecionado
                  </p>
                  <p className="mt-2 text-sm text-zinc-500">
                    Toque em um piloto na classificação para abrir o perfil.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                <Card className="overflow-hidden rounded-[22px] border-black/5 bg-white shadow-sm">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-[120px_1fr] gap-0">
                      <div className="h-[140px]">
                        <PilotPhotoSlot
                          pilot={selectedPilot}
                          alt={getPilotDisplayName(selectedPilot.piloto)}
                        />
                      </div>

                      <div className="flex flex-col justify-between p-4">
                        <div className="flex items-start justify-between gap-3">
                          <button
                            type="button"
                            onClick={handleBackToRanking}
                            className="flex items-center gap-2 rounded-2xl border border-black/5 bg-zinc-50 px-3 py-2 text-sm text-zinc-800 transition hover:bg-zinc-100"
                          >
                            <ArrowLeft className="h-4 w-4" />
                            Voltar
                          </button>

                          <Badge
                            variant="outline"
                            className={
                              categoryColors[category] || "border-black/10 text-zinc-700"
                            }
                          >
                            {category}
                          </Badge>
                        </div>

                        <div>
                          <p className="truncate text-xl font-bold tracking-tight text-zinc-950">
                            {getPilotDisplayName(selectedPilot.piloto)}
                          </p>
                          {getPilotWarName(selectedPilot) ? (
                            <p className="mt-1 text-sm text-zinc-500">
                              {getPilotWarName(selectedPilot)}
                            </p>
                          ) : null}
                          <p className="mt-1 text-sm text-zinc-500">
                            {competitionLabels[competition] || competition}
                          </p>
                        </div>

                        <div className="flex items-end justify-between gap-3">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                              Pontuação
                            </p>
                            <p className="mt-1 text-[28px] font-bold leading-none tracking-tight text-yellow-700">
                              {selectedPilot.pontos} pts
                            </p>
                          </div>

                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-yellow-50">
                            <Trophy className="h-4 w-4 text-yellow-700" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-3">
                  <CompactStatCard
                    title="Posição"
                    value={selectedPilot.pos}
                    subtitle="na classificação"
                    icon={Crown}
                    accent
                  />
                  <CompactStatCard
                    title="Vitórias"
                    value={selectedPilot.vitorias}
                    subtitle="até agora"
                    icon={Medal}
                  />
                  <CompactStatCard
                    title="Poles"
                    value={selectedPilot.poles}
                    subtitle="qualify"
                    icon={Flag}
                  />
                  <CompactStatCard
                    title="VMR"
                    value={selectedPilot.mv}
                    subtitle="voltas rápidas"
                    icon={Timer}
                  />
                  <CompactStatCard
                    title="Pódios"
                    value={selectedPilot.podios}
                    subtitle="na classificação"
                    icon={Medal}
                  />
                  <CompactStatCard
                    title="Participações"
                    value={selectedPilot.participacoes}
                    subtitle="corridas válidas"
                    icon={Users}
                  />
                  <CompactStatCard
                    title="ADV"
                    value={selectedPilot.adv}
                    subtitle="advertências"
                    icon={Gauge}
                  />
                  <CompactStatCard
                    title="Descarte"
                    value={selectedPilot.descarte}
                    subtitle="campeonato"
                    icon={Gauge}
                  />
                </div>

                <Card className="rounded-[22px] border-black/5 bg-white shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-zinc-950">
                      Evolução do piloto
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedPilotEvolution}>
                        <CartesianGrid
                          stroke="rgba(15,23,42,0.08)"
                          strokeDasharray="3 3"
                        />
                        <XAxis dataKey="etapa" stroke="#71717a" />
                        <YAxis stroke="#71717a" />
                        <Tooltip
                          contentStyle={{
                            background: "#ffffff",
                            border: "1px solid rgba(15,23,42,0.08)",
                            borderRadius: 16,
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="pontos"
                          stroke="#d97706"
                          strokeWidth={3}
                          dot={{ r: 4, fill: "#d97706" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats" className="space-y-4 pt-4">
            <Card className="rounded-[22px] border-black/5 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-zinc-950">
                  <BarChart3 className="h-5 w-5 text-yellow-700" />
                  Líder atual por categoria
                </CardTitle>
              </CardHeader>

              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid
                      stroke="rgba(15,23,42,0.08)"
                      strokeDasharray="3 3"
                    />
                    <XAxis dataKey="categoria" stroke="#71717a" />
                    <YAxis stroke="#71717a" />
                    <Tooltip
                      contentStyle={{
                        background: "#ffffff",
                        border: "1px solid rgba(15,23,42,0.08)",
                        borderRadius: 16,
                      }}
                    />
                    <Bar dataKey="pontos" fill="#facc15" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="rounded-[22px] border-black/5 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-zinc-950">
                  <ChevronRight className="h-4 w-4 text-yellow-700" />
                  Evolução do líder atual
                </CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={leaderEvolution}>
                    <CartesianGrid
                      stroke="rgba(15,23,42,0.08)"
                      strokeDasharray="3 3"
                    />
                    <XAxis dataKey="etapa" stroke="#71717a" />
                    <YAxis stroke="#71717a" />
                    <Tooltip
                      contentStyle={{
                        background: "#ffffff",
                        border: "1px solid rgba(15,23,42,0.08)",
                        borderRadius: 16,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="pontos"
                      stroke="#d97706"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#d97706" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
