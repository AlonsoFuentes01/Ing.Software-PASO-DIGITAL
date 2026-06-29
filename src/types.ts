export type VehicleType = 'Particular' | 'Diplomático' | 'Extranjero';

export interface SalidaVehiculo {
  id: string; // Folio
  patente: string;
  runConductor: string;
  marcaModelo: string;
  fechaSalida: string; // ISO date
  fechaEstimadaRetorno: string; // ISO date
  plazoDias: number; // 90 or 180
  fechaVencimiento: string; // ISO date
  tipoVehiculo: VehicleType;
  tipoPlacaDetalle?: string; // CD, CC, OI, PAT
  origen: 'Chile';
  estado: 'Vigente' | 'Vencido';
}

export interface AdmisionVehiculo {
  id: string; // Folio
  patente: string;
  documentoArgentina: string;
  fechaVencimientoDocArgentina: string;
  fechaIngreso: string; // ISO date
  pasoFronterizo: string; // Los Libertadores
  marcaModelo: string;
  origen: 'Argentina';
  estado: 'Vigente' | 'Vencido';
  fechaVencimientoEstadia: string; // ISO date (usually 90 days for tourist/admission by default)
  isPreRegistro?: boolean;
}

export type RegistroVehiculo = SalidaVehiculo | AdmisionVehiculo;
