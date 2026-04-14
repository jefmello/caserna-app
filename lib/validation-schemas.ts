/**
 * Acumulador de erros de validação para logging.
 */
export type ValidationErrors = {
  totalValidated: number;
  totalRejected: number;
  errors: string[];
};
