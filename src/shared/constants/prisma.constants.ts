export const PRISMA_UNIQUE_ERROR = (type: string, field_name: string): string =>
  `There is a unique constraint violation, a new ${type} cannot be created with this ${field_name}`;

export const PRISMA_UNIQUE_ERROR_CODE = 'P2002';
export const PRISMA_NOT_EXIST_ERROR_CODE = 'P2025';
export const PRISMA_RAW_QUERY_ERROR_CODE = 'P2010';
