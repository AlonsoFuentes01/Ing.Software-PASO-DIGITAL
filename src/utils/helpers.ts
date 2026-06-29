/**
 * Helper functions for Chilean RUN validation, Plate formatting, and Date calculations.
 */

// Format RUN as 12.345.678-9
export function formatRun(value: string): string {
  // Remove anything that is not a number or K/k
  const clean = value.replace(/[^0-9kK]/g, '');
  if (clean.length === 0) return '';
  
  const dv = clean.slice(-1).toUpperCase();
  const rest = clean.slice(0, -1);
  
  if (rest.length === 0) return dv;
  
  // Format the rest with dots
  const formattedRest = rest
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
  return `${formattedRest}-${dv}`;
}

// Validate Chilean RUN (Modulo 11)
export function validateRun(runStr: string): boolean {
  const clean = runStr.replace(/[^0-9kK]/g, '');
  if (clean.length < 8) return false;
  
  const dv = clean.slice(-1).toUpperCase();
  const num = parseInt(clean.slice(0, -1), 10);
  if (isNaN(num)) return false;
  
  let sum = 0;
  let mul = 2;
  let tempNum = num;
  
  while (tempNum > 0) {
    sum += (tempNum % 10) * mul;
    tempNum = Math.floor(tempNum / 10);
    mul = mul === 7 ? 2 : mul + 1;
  }
  
  const res = 11 - (sum % 11);
  let computedDv = '';
  if (res === 11) computedDv = '0';
  else if (res === 10) computedDv = 'K';
  else computedDv = res.toString();
  
  return computedDv === dv;
}

// Format plate (Patente) to uppercase and clean up
export function formatPatente(value: string): string {
  // Clean special characters but keep letters, numbers, hyphens, dots, and spaces
  return value.toUpperCase().trim();
}

/**
 * Detects if a plate corresponds to a Chilean Diplomatic vehicle.
 * In Chile, diplomatic plates typically contain prefixes or combinations like:
 * - C.D. (Cuerpo Diplomático)
 * - CC (Cuerpo Consular)
 * - O.I. / OI (Organismo Internacional)
 * - P.A.T. (Patente de Internación Temporal / Admisión Temporal)
 */
export function detectDiplomatic(patente: string): { isDiplomatic: boolean; type: string } {
  const clean = patente.replace(/[^A-Z]/gi, '').toUpperCase();
  
  if (clean.includes('CD')) {
    return { isDiplomatic: true, type: 'C.D. (Cuerpo Diplomático)' };
  }
  if (clean.includes('CC')) {
    return { isDiplomatic: true, type: 'C.C. (Cuerpo Consular)' };
  }
  if (clean.includes('OI')) {
    return { isDiplomatic: true, type: 'O.I. (Organismo Internacional)' };
  }
  if (clean.includes('PAT')) {
    return { isDiplomatic: true, type: 'P.A.T. (Patente de Internación Temporal)' };
  }
  
  // Also check literal prefixes with dot notation
  const upperPat = patente.toUpperCase();
  if (upperPat.includes('C.D.') || upperPat.includes('CD')) {
    return { isDiplomatic: true, type: 'C.D. (Cuerpo Diplomático)' };
  }
  if (upperPat.includes('C.C.') || upperPat.includes('CC')) {
    return { isDiplomatic: true, type: 'C.C. (Cuerpo Consular)' };
  }
  if (upperPat.includes('O.I.') || upperPat.includes('OI')) {
    return { isDiplomatic: true, type: 'O.I. (Organismo Internacional)' };
  }
  if (upperPat.includes('P.A.T.') || upperPat.includes('PAT')) {
    return { isDiplomatic: true, type: 'P.A.T. (Patente de Internación Temporal)' };
  }
  
  return { isDiplomatic: false, type: '' };
}

// System baseline date
export const SYSTEM_BASE_DATE = '2026-06-25T19:41:07-07:00';

// Calculate days remaining from system base date
export function getDaysRemaining(expiryDateStr: string): number {
  const expiry = new Date(expiryDateStr);
  const base = new Date(SYSTEM_BASE_DATE);
  
  // Reset hours to compare pure days
  const expiryDay = new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate());
  const baseDay = new Date(base.getFullYear(), base.getMonth(), base.getDate());
  
  const diffTime = expiryDay.getTime() - baseDay.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

// Generate an official-looking Folio
export function generateFolio(prefix: 'S' | 'A'): string {
  const year = new Date(SYSTEM_BASE_DATE).getFullYear();
  const randomNum = Math.floor(10000 + Math.random() * 90000); // 5 digit random
  return `${prefix}-${year}-${randomNum}`;
}
