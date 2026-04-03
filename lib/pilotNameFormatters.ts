import type { RankingItem } from "@/types/ranking";

/**
 * Normaliza o nome do piloto: trim, lowercase, title case
 * @param name - Nome bruto do piloto
 * @returns Nome normalizado ou "-" se vazio
 */
export function normalizePilotName(name?: string): string {
  if (!name) return "-";

  return name
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/**
 * Extrai primeira e última parte do nome normalizado
 * @param name - Nome do piloto
 * @returns Objeto com firstName e lastName
 */
export function getPilotNameParts(name?: string): { firstName: string; lastName: string } {
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

/**
 * Retorna primeiro e último nome ou apenas o primeiro
 * @param name - Nome do piloto
 * @returns Nome formatado
 */
export function getPilotFirstAndLastName(name?: string): string {
  const { firstName, lastName } = getPilotNameParts(name);
  return lastName ? `${firstName} ${lastName}` : firstName;
}

/**
 * Extrai e retorna o nome de guerra normalizado
 * @param pilot - Item do ranking
 * @returns Nome de guerra ou string vazia
 */
export function getPilotWarName(pilot?: RankingItem | null): string {
  const nomeGuerra = normalizePilotName(pilot?.nomeGuerra);
  if (!nomeGuerra || nomeGuerra === "-") return "";
  return nomeGuerra;
}

/**
 * Retorna o nome de guerra entre aspas para display
 * @param pilot - Item do ranking
 * @returns Nome de guerra entre aspas ou string vazia
 */
export function getPilotWarNameDisplay(pilot?: RankingItem | null): string {
  const nomeGuerra = getPilotWarName(pilot);
  return nomeGuerra ? `"${nomeGuerra}"` : "";
}

/**
 * Retorna nome em uppercase
 * @param name - Nome do piloto
 * @returns Nome em uppercase ou "-"
 */
export function getPilotHighlightName(name?: string): string {
  const normalized = normalizePilotName(name);
  return normalized === "-" ? "-" : normalized.toUpperCase();
}

/**
 * Retorna caminho para foto do piloto
 * @param pilot - Item do ranking
 * @returns Caminho relativo ou null
 */
export function getPilotPhotoPath(pilot?: RankingItem | null): string | null {
  if (!pilot?.pilotoId) return null;
  return `/pilotos/${pilot.pilotoId}.jpg`;
}