import { z } from "zod";

/**
 * Acumulador de erros de validação para logging.
 */
export type ValidationErrors = {
  totalValidated: number;
  totalRejected: number;
  errors: string[];
};

/**
 * Schema oficial de RankingItem (item de classificação de piloto).
 * Usado em boundary da API e para validar dados externos (CSV).
 */
export const rankingItemSchema = z.object({
  pos: z.number().int().nonnegative(),
  pilotoId: z.string(),
  piloto: z.string().min(1),
  nomeGuerra: z.string(),
  pontos: z.number().nonnegative(),
  adv: z.number().nonnegative(),
  participacoes: z.number().int().nonnegative(),
  vitorias: z.number().int().nonnegative(),
  poles: z.number().int().nonnegative(),
  mv: z.number().int().nonnegative(),
  podios: z.number().int().nonnegative(),
  descarte: z.number().nonnegative(),
  categoriaAtual: z.string(),
  competicao: z.string(),
  categoria: z.string(),
});

export type RankingItemValidated = z.infer<typeof rankingItemSchema>;

/**
 * Schema de filtros de ranking (categoria + competição).
 */
export const categorySchema = z.enum(["Base", "Graduados", "Elite"]);
export const competitionSchema = z.enum(["T1", "T2", "T3", "GERAL"]);

export type ValidCategory = z.infer<typeof categorySchema>;
export type ValidCompetition = z.infer<typeof competitionSchema>;

/**
 * Schema do seletor de comparação de pilotos (duelos, midia).
 * Garante que os dois pilotos são distintos e não-vazios.
 */
export const pilotDuelSchema = z
  .object({
    comparePilotAId: z.string().min(1, "Selecione o piloto A"),
    comparePilotBId: z.string().min(1, "Selecione o piloto B"),
  })
  .refine((data) => data.comparePilotAId !== data.comparePilotBId, {
    message: "Selecione dois pilotos diferentes",
    path: ["comparePilotBId"],
  });

export type PilotDuelInput = z.infer<typeof pilotDuelSchema>;

/**
 * Schema de URL params (pilotos?pilotId=...).
 */
export const pilotIdParamSchema = z.string().min(1).max(100);

/**
 * Helper para safe-parse de arrays com agregação de erros.
 */
export function validateRankingList(
  list: unknown[],
  context = "ranking"
): { valid: RankingItemValidated[]; errors: string[] } {
  const valid: RankingItemValidated[] = [];
  const errors: string[] = [];

  for (let i = 0; i < list.length; i++) {
    const parsed = rankingItemSchema.safeParse(list[i]);
    if (parsed.success) {
      valid.push(parsed.data);
    } else {
      errors.push(`[${context}:${i}] ${parsed.error.issues.map((e) => e.message).join(", ")}`);
    }
  }

  return { valid, errors };
}
