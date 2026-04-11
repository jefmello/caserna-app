import { z } from "zod";

/**
 * Schema Zod para uma linha do CSV de ranking.
 * Valida que todos os campos obrigatórios estão presentes
 * e que os campos numéricos são números válidos.
 */
export const rankingRowSchema = z.object({
  pos: z.number().int().min(0),
  pilotoId: z.string(),
  piloto: z.string().min(1, "Nome do piloto é obrigatório"),
  nomeGuerra: z.string(),
  pontos: z.number().finite(),
  adv: z.number().finite(),
  participacoes: z.number().int().min(0),
  vitorias: z.number().int().min(0),
  poles: z.number().int().min(0),
  mv: z.number().int().min(0),
  podios: z.number().int().min(0),
  descarte: z.number().finite(),
  categoriaAtual: z.string().min(1, "Categoria atual é obrigatória"),
  competicao: z.string().min(1, "Competição é obrigatória"),
  categoria: z.string().min(1, "Categoria é obrigatória"),
});

/**
 * Schema Zod para uma linha do CSV de pilotos (mapa de nomes).
 */
export const pilotosMapEntrySchema = z.object({
  pilotoId: z.string(),
  nomeGuerra: z.string().min(1, "Nome de guerra é obrigatório"),
});

/**
 * Valida um item de ranking com Zod.
 * Retorna o item validado ou null + log de erro.
 */
export function validateRankingItem(
  raw: unknown,
  lineNumber: number
): { item: z.infer<typeof rankingRowSchema>; error: null } | { item: null; error: string } {
  const result = rankingRowSchema.safeParse(raw);

  if (result.success) {
    return { item: result.data, error: null };
  }

  const errorMessages = result.error.issues
    .map((e) => `${e.path.join(".")}: ${e.message}`)
    .join("; ");

  return {
    item: null,
    error: `Linha ${lineNumber}: ${errorMessages}`,
  };
}

/**
 * Acumulador de erros de validação para logging.
 */
export type ValidationErrors = {
  totalValidated: number;
  totalRejected: number;
  errors: string[];
};

/**
 * Adiciona resultado ao acumulador de erros.
 */
export function recordValidationResult(
  accumulator: ValidationErrors,
  result: { item: unknown; error: string | null }
) {
  accumulator.totalValidated++;

  if (result.error) {
    accumulator.totalRejected++;
    accumulator.errors.push(result.error);
  }
}
