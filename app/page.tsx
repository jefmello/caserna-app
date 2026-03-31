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
  Camera,
  Sparkles,
  Star,
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

function getPilotWarNameDisplay(pilot?: RankingItem | null) {
  const nomeGuerra = getPilotWarName(pilot);
  return nomeGuerra ? `"${nomeGuerra}"` : "";
}

function getPilotHighlightName(name?: string) {
  const normalized = normalizePilotName(name);
  return normalized === "-" ? "-" : normalized.toUpperCase();
}

function getPilotPhotoPath(pilot?: RankingItem | null) {
  if (!pilot?.pilotoId) return null;
  return `/pilotos/${pilot.pilotoId}.jpg`;
}

function getTop6RowStyles(position: number) {
  switch (position) {
    case 1:
      return {
        row: "border-l-[5px] border-l-yellow-500 bg-gradient-to-r from-yellow-100 via-yellow-50 to-white shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]",
        badge: "bg-yellow-400 text-black",
        points: "text-yellow-700",
        name: "text-zinc-950",
        chip: "border-yellow-300 bg-yellow-100 text-yellow-800",
        ring: "ring-1 ring-yellow-200/70",
      };
    case 2:
      return {
        row: "border-l-[5px] border-l-zinc-400 bg-gradient-to-r from-zinc-100 via-zinc-50 to-white",
        badge: "bg-zinc-300 text-zinc-900",
        points: "text-zinc-800",
        name: "text-zinc-950",
        chip: "border-zinc-300 bg-white text-zinc-700",
        ring: "",
      };
    case 3:
      return {
        row: "border-l-[5px] border-l-amber-700 bg-gradient-to-r from-amber-50 via-amber-50/80 to-white",
        badge: "bg-amber-600 text-white",
        points: "text-amber-800",
        name: "text-zinc-950",
        chip: "border-amber-200 bg-white text-amber-800",
        ring: "",
      };
    case 4:
      return {
        row: "border-l-[5px] border-l-sky-500 bg-gradient-to-r from-sky-50 via-sky-50/70 to-white",
        badge: "bg-sky-500 text-white",
        points: "text-sky-700",
        name: "text-zinc-950",
        chip: "border-sky-200 bg-white text-sky-800",
        ring: "",
      };
    case 5:
      return {
        row: "border-l-[5px] border-l-violet-500 bg-gradient-to-r from-violet-50 via-violet-50/70 to-white",
        badge: "bg-violet-500 text-white",
        points: "text-violet-700",
        name: "text-zinc-950",
        chip: "border-violet-200 bg-white text-violet-800",
        ring: "",
      };
    case 6:
      return {
        row: "border-l-[5px] border-l-emerald-500 bg-gradient-to-r from-emerald-50 via-emerald-50/70 to-white",
        badge: "bg-emerald-500 text-white",
        points: "text-emerald-700",
        name: "text-zinc-950",
        chip: "border-emerald-200 bg-white text-emerald-800",
        ring: "",
      };
    default:
      return {
        row: "",
        badge: "bg-zinc-100 text-zinc-800",
        points: "text-zinc-950",
        name: "text-zinc-950",
        chip: "border-yellow-200 bg-yellow-50 text-yellow-800",
        ring: "",
      };
  }
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
      className={`h-[182px] rounded-[22px] border shadow-none ${
        accent
          ? "border-yellow-300 bg-gradient-to-b from-yellow-50 to-white"
          : "border-black/5 bg-white"
      }`}
    >
      <CardContent className="flex h-full flex-col px-4 pb-4 pt-2">
        <div className="mb-1 flex items-start justify-between gap-2">
          <p
            className={`w-full text-center text-[11px] font-bold uppercase tracking-[0.18em] leading-none ${
              accent ? "text-yellow-800" : "text-zinc-500"
            }`}
          >
            {title}
          </p>

          <div
            className={`-mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-xl ${
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

        <div
          className={`mb-1 h-px w-full ${
            accent ? "bg-yellow-200/80" : "bg-zinc-100"
          }`}
        />

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
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-zinc-50 to-zinc-100">
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
              <Camera className="h-5 w-5 text-zinc-500" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
              Espaço foto
            </p>
            <p className="mt-1 text-[10px] font-medium text-zinc-500">
              piloto 1:1
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function RankingTable({
  items,
  offset = 0,
  onSelectPilot,
  topBlock = false,
}: {
  items: RankingItem[];
  offset?: number;
  onSelectPilot: (pilot: RankingItem) => void;
  topBlock?: boolean;
}) {
  return (
    <table className="w-full table-fixed">
      <colgroup>
        <col className="w-[50px]" />
        <col />
        <col className="w-[40px]" />
        <col className="w-[40px]" />
        <col className="w-[40px]" />
        <col className="w-[42px]" />
        <col className="w-[42px]" />
      </colgroup>

      <thead className="sticky top-0 z-10">
        <tr className="border-b border-black/5 bg-zinc-50/95 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500 backdrop-blur">
          <th className="px-1 py-3 text-center whitespace-nowrap">Pos</th>
          <th className="px-2 py-3 text-left whitespace-nowrap">Piloto</th>
          <th className="px-1 py-3 text-center whitespace-nowrap">Pts</th>
          <th className="px-1 py-3 text-center whitespace-nowrap">Vit</th>
          <th className="px-1 py-3 text-center whitespace-nowrap">Pol</th>
          <th className="px-1 py-3 text-center whitespace-nowrap">VMR</th>
          <th className="px-1 py-3 text-center whitespace-nowrap">PDS</th>
        </tr>
      </thead>

      <tbody>
        {items.map((item, localIndex) => {
          const globalIndex = offset + localIndex;
          const position = globalIndex + 1;
          const isTop6 = position <= 6;
          const isLeader = position === 1;
          const styles = getTop6RowStyles(position);
          const nomeLinha1 = getPilotFirstAndLastName(item.piloto);
          const nomeLinha2 = getPilotWarNameDisplay(item);

          return (
            <tr
              key={`row-${item.pilotoId}-${item.competicao}-${position}`}
              className={`group transition-transform duration-150 ${
                isTop6
                  ? styles.row
                  : `${globalIndex % 2 === 0 ? "bg-white" : "bg-zinc-50/50"} hover:bg-zinc-50`
              }`}
            >
              <td
                className={`px-1 text-center align-middle ${
                  isLeader ? "py-4" : "py-3"
                } ${isTop6 ? styles.ring : ""}`}
                onClick={() => onSelectPilot(item)}
              >
                <button
                  type="button"
                  className="mx-auto flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold transition active:scale-95"
                >
                  <span
                    className={`relative flex h-8 w-8 items-center justify-center rounded-xl shadow-sm ${styles.badge}`}
                  >
                    {isLeader ? (
                      <Star className="absolute -right-1 -top-1 h-3.5 w-3.5 fill-yellow-300 text-yellow-600" />
                    ) : null}
                    {position}
                  </span>
                </button>
              </td>

              <td
                className={`min-w-0 px-2 align-middle ${
                  isLeader ? "py-4" : "py-3"
                } ${isTop6 ? styles.ring : ""}`}
              >
                <button
                  type="button"
                  onClick={() => onSelectPilot(item)}
                  className="block w-full text-left transition active:scale-[0.99]"
                >
                  <div className="flex items-center gap-2">
                    {isLeader ? (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-100">
                        <Trophy className="h-4 w-4 text-yellow-700" />
                      </div>
                    ) : isTop6 ? (
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/80 shadow-sm">
                        <Sparkles className="h-3.5 w-3.5 text-zinc-500" />
                      </div>
                    ) : null}

                    <div className="min-w-0 flex-1">
                      <span
                        className={`block truncate tracking-tight ${styles.name} ${
                          isLeader ? "text-[14px] font-extrabold" : "text-[13px] font-bold"
                        }`}
                      >
                        {nomeLinha1}
                      </span>

                      <div className="mt-1 flex items-center gap-1.5">
                        {nomeLinha2 ? (
                          <span
                            className={`inline-flex max-w-full rounded-full border px-2 py-0.5 text-[10px] font-semibold italic tracking-[0.02em] ${styles.chip}`}
                          >
                            {nomeLinha2}
                          </span>
                        ) : null}

                        {isLeader ? (
                          <span className="inline-flex rounded-full border border-yellow-300 bg-yellow-200/70 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.08em] text-yellow-900">
                            Líder
                          </span>
                        ) : null}

                        {topBlock && position === 6 ? (
                          <span className="inline-flex rounded-full border border-emerald-300 bg-emerald-100 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.08em] text-emerald-800">
                            Top 6
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </button>
              </td>

              <td
                className={`px-1 text-center align-middle text-[12px] font-extrabold ${
                  isTop6 ? styles.points : "text-zinc-950"
                } ${isLeader ? "py-4" : "py-3"} ${isTop6 ? styles.ring : ""}`}
                onClick={() => onSelectPilot(item)}
              >
                <button
                  type="button"
                  onClick={() => onSelectPilot(item)}
                  className="w-full transition active:scale-95"
                >
                  {item.pontos}
                </button>
              </td>

              <td
                className={`px-1 text-center align-middle text-[12px] font-semibold text-zinc-950 ${
                  isLeader ? "py-4" : "py-3"
                } ${isTop6 ? styles.ring : ""}`}
                onClick={() => onSelectPilot(item)}
              >
                <button
                  type="button"
                  onClick={() => onSelectPilot(item)}
                  className="w-full transition active:scale-95"
                >
                  {item.vitorias}
                </button>
              </td>

              <td
                className={`px-1 text-center align-middle text-[12px] font-semibold text-zinc-950 ${
                  isLeader ? "py-4" : "py-3"
                } ${isTop6 ? styles.ring : ""}`}
                onClick={() => onSelectPilot(item)}
              >
                <button
                  type="button"
                  onClick={() => onSelectPilot(item)}
                  className="w-full transition active:scale-95"
                >
                  {item.poles}
                </button>
              </td>

              <td
                className={`px-1 text-center align-middle text-[12px] font-semibold text-zinc-950 ${
                  isLeader ? "py-4" : "py-3"
                } ${isTop6 ? styles.ring : ""}`}
                onClick={() => onSelectPilot(item)}
              >
                <button
                  type="button"
                  onClick={() => onSelectPilot(item)}
                  className="w-full transition active:scale-95"
                >
                  {item.mv}
                </button>
              </td>

              <td
                className={`px-1 text-center align-middle text-[12px] font-semibold text-zinc-950 ${
                  isLeader ? "py-4" : "py-3"
                } ${isTop6 ? styles.ring : ""}`}
                onClick={() => onSelectPilot(item)}
              >
                <button
                  type="button"
                  onClick={() => onSelectPilot(item)}
                  className="w-full transition active:scale-95"
                >
                  {item.podios}
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
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

  const top6Ranking = filteredRanking.slice(0, 6);
  const remainingRanking = filteredRanking.slice(6);

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
        <header className="sticky top-0 z-20 mb-4 overflow-hidden rounded-[24px] border border-black/5 bg-white shadow-sm">
          <div className="relative h-[80px] w-full">
            <Image
              src="/banner-topo.png"
              alt="Classificação Oficial"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-2 px-3 pb-3 pt-2">
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
          <div className="mb-4 rounded-[20px] border border-yellow-200/70 bg-gradient-to-b from-yellow-50 to-white px-4 py-4">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-yellow-100 shadow-sm">
                <Trophy className="h-5 w-5 text-yellow-700" />
              </div>

              <p className="text-[20px] font-extrabold uppercase tracking-[0.16em] text-zinc-950">
                PILOTO DESTAQUE
              </p>

              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                líder da categoria e campeonato selecionado
              </p>

              <div className="mt-3 h-px w-24 bg-gradient-to-r from-transparent via-yellow-400/70 to-transparent" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <HighlightCard title="Líder" icon={Crown} accent>
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="flex min-h-[74px] flex-col items-center justify-center">
                  <p className="text-[30px] font-extrabold leading-none tracking-tight text-zinc-950">
                    {leaderName.firstName.toUpperCase()}
                  </p>
                  <p className="mt-1 text-[20px] font-semibold leading-none tracking-tight text-zinc-800">
                    {leaderName.lastName ? leaderName.lastName.toUpperCase() : ""}
                  </p>
                </div>

                <div className="mt-3 inline-flex rounded-full border border-yellow-200 bg-yellow-100/70 px-3 py-1">
                  <p className="text-[12px] font-bold text-yellow-800">
                    {leader?.pontos || 0} pontos
                  </p>
                </div>
              </div>
            </HighlightCard>

            <HighlightCard title="Vitórias" icon={Medal}>
              <div className="flex h-full flex-col items-center justify-center text-center">
                <p className="text-[44px] font-extrabold leading-none tracking-tight text-zinc-950">
                  {leader?.vitorias || 0}
                </p>
                <p className="mt-3 max-w-[120px] text-[12px] leading-snug text-zinc-500">
                  vitórias nesta classificação
                </p>
              </div>
            </HighlightCard>

            <Card className="h-[182px] overflow-hidden rounded-[22px] border border-black/5 shadow-none">
              <CardContent className="h-full p-0">
                <div className="relative h-full w-full overflow-hidden">
                  <PilotPhotoSlot
                    pilot={leader}
                    alt={getPilotHighlightName(leader?.piloto)}
                  />

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent" />

                  <div className="absolute inset-x-0 bottom-2 px-3 text-center">
                    <p className="truncate text-[11px] font-bold uppercase tracking-[0.10em] text-white">
                      {getPilotHighlightName(leader?.piloto)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <HighlightCard title="Pódios" icon={Medal}>
              <div className="flex h-full flex-col items-center justify-center text-center">
                <p className="text-[44px] font-extrabold leading-none tracking-tight text-zinc-950">
                  {leader?.podios || 0}
                </p>
                <p className="mt-3 max-w-[120px] text-[12px] leading-snug text-zinc-500">
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
              <div className="rounded-[20px] border border-black/5 bg-white px-4 py-3 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                      Classificação geral
                    </p>
                    <p className="mt-1 text-sm font-medium text-zinc-800">
                      Categoria e campeonato selecionados
                    </p>
                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-yellow-200 bg-gradient-to-r from-yellow-50 to-yellow-100 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-yellow-800 shadow-sm">
                    <Sparkles className="h-3.5 w-3.5" />
                    Top 6 oficial
                  </div>
                </div>
              </div>

              <Card className="overflow-hidden rounded-[22px] border-black/5 bg-white shadow-sm">
                <CardContent className="p-0">
                  <div className="max-h-[620px] overflow-y-auto">
                    {top6Ranking.length > 0 && (
                      <div>
                        <div className="sticky top-0 z-20 border-b border-yellow-200 bg-gradient-to-r from-yellow-50 via-white to-yellow-50 px-4 py-2">
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-yellow-800">
                              Bloco Top 6
                            </p>
                            <div className="inline-flex items-center gap-1 rounded-full border border-yellow-200 bg-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-yellow-700">
                              <Trophy className="h-3 w-3" />
                              Destaque oficial
                            </div>
                          </div>
                        </div>

                        <RankingTable
                          items={top6Ranking}
                          offset={0}
                          onSelectPilot={handleSelectPilot}
                          topBlock
                        />
                      </div>
                    )}

                    {remainingRanking.length > 0 && (
                      <div className="border-t-4 border-zinc-100">
                        <div className="sticky top-[41px] z-10 border-b border-zinc-200 bg-zinc-50 px-4 py-2">
                          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-zinc-500">
                            Demais pilotos
                          </p>
                        </div>

                        <RankingTable
                          items={remainingRanking}
                          offset={6}
                          onSelectPilot={handleSelectPilot}
                        />
                      </div>
                    )}

                    {filteredRanking.length === 0 && (
                      <div className="px-4 py-8 text-center text-sm text-zinc-500">
                        Nenhum piloto com pontos encontrado.
                      </div>
                    )}
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

                          {getPilotWarNameDisplay(selectedPilot) ? (
                            <div className="mt-2">
                              <span className="inline-flex rounded-full border border-yellow-200 bg-yellow-50 px-2.5 py-1 text-[11px] font-semibold italic text-yellow-800">
                                {getPilotWarNameDisplay(selectedPilot)}
                              </span>
                            </div>
                          ) : null}

                          <p className="mt-2 text-sm text-zinc-500">
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
