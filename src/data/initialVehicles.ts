import { RegistroVehiculo } from '../types';

export const INITIAL_VEHICLES: RegistroVehiculo[] = [
  {
    id: 'S-2026-04192',
    patente: 'GK-LP-84',
    runConductor: '15.483.921-K',
    marcaModelo: 'Toyota RAV4',
    fechaSalida: '2026-05-10T09:30:00Z',
    fechaEstimadaRetorno: '2026-07-15T18:00:00Z',
    plazoDias: 180,
    fechaVencimiento: '2026-11-06T09:30:00Z',
    tipoVehiculo: 'Particular',
    origen: 'Chile',
    estado: 'Vigente'
  },
  {
    id: 'S-2026-05101',
    patente: 'CD-88-21',
    runConductor: '9.314.502-3',
    marcaModelo: 'Audi A6',
    fechaSalida: '2026-06-10T11:15:00Z',
    fechaEstimadaRetorno: '2026-08-10T10:00:00Z',
    plazoDias: 90,
    fechaVencimiento: '2026-09-08T11:15:00Z',
    tipoVehiculo: 'Diplomático',
    tipoPlacaDetalle: 'C.D.',
    origen: 'Chile',
    estado: 'Vigente'
  },
  {
    id: 'S-2026-01045',
    patente: 'PT-CD-45',
    runConductor: '18.254.912-4',
    marcaModelo: 'Volvo XC60',
    fechaSalida: '2026-02-10T08:00:00Z',
    fechaEstimadaRetorno: '2026-05-01T20:00:00Z',
    plazoDias: 90,
    fechaVencimiento: '2026-05-11T08:00:00Z',
    tipoVehiculo: 'Diplomático',
    tipoPlacaDetalle: 'C.D.',
    origen: 'Chile',
    estado: 'Vencido'
  },
  {
    id: 'S-2025-11094',
    patente: 'BX-RD-29',
    runConductor: '12.874.110-5',
    marcaModelo: 'Hyundai Accent',
    fechaSalida: '2025-11-15T14:20:00Z',
    fechaEstimadaRetorno: '2026-04-30T12:00:00Z',
    plazoDias: 180,
    fechaVencimiento: '2026-05-14T14:20:00Z',
    tipoVehiculo: 'Particular',
    origen: 'Chile',
    estado: 'Vencido'
  },
  {
    id: 'A-2026-06201',
    patente: 'AE123BB',
    documentoArgentina: 'AR-DGA-99214-X',
    fechaVencimientoDocArgentina: '2026-09-18T23:59:59Z',
    fechaIngreso: '2026-06-20T10:45:00Z',
    pasoFronterizo: 'Paso Los Libertadores',
    marcaModelo: 'Ford Focus',
    origen: 'Argentina',
    estado: 'Vigente',
    fechaVencimientoEstadia: '2026-09-18T23:59:59Z'
  },
  {
    id: 'A-2026-03155',
    patente: 'MNO-482',
    documentoArgentina: 'AR-DGA-88219-A',
    fechaVencimientoDocArgentina: '2026-06-13T23:59:59Z',
    fechaIngreso: '2026-03-15T16:10:00Z',
    pasoFronterizo: 'Paso Los Libertadores',
    marcaModelo: 'Renault Clio',
    origen: 'Argentina',
    estado: 'Vencido',
    fechaVencimientoEstadia: '2026-06-13T23:59:59Z'
  }
];
