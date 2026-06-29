import React, { useState, useMemo } from 'react';
import { Search, ShieldAlert, CheckCircle, Clock, Filter, AlertTriangle, FileText, Info, Trash2, RotateCcw, Car } from 'lucide-react';
import { RegistroVehiculo } from '../types';
import { getDaysRemaining, SYSTEM_BASE_DATE } from '../utils/helpers';
import { TranslationDict } from '../utils/translations';

interface ConsultaEstadoProps {
  vehicles: RegistroVehiculo[];
  onDeleteRecord?: (id: string) => void;
  onResetDatabase?: () => void;
  onApprovePreRegistro?: (id: string) => void;
  t?: TranslationDict;
  language?: 'es' | 'en';
  userRole?: 'conductor' | 'funcionario';
}

export default function ConsultaEstado({ 
  vehicles, 
  onDeleteRecord, 
  onResetDatabase, 
  onApprovePreRegistro,
  t, 
  language = 'es',
  userRole = 'funcionario'
}: ConsultaEstadoProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOrigen, setFilterOrigen] = useState<'All' | 'Chile' | 'Argentina'>('All');
  const [filterEstado, setFilterEstado] = useState<'All' | 'Vigente' | 'Vencido'>('All');
  const [selectedVehicle, setSelectedVehicle] = useState<RegistroVehiculo | null>(null);

  // Sync selected vehicle with the latest from the array to reflect live edits/approvals
  const currentSelected = useMemo(() => {
    if (!selectedVehicle) return null;
    return vehicles.find((v) => v.id === selectedVehicle.id) || null;
  }, [selectedVehicle, vehicles]);

  // Normalization helper for fuzzy plate matching
  const normalizePlate = (plate: string) => {
    return plate.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  };

  // Filter & Search Logic
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      // Fuzzy Search match on plate or model or ID
      const matchSearch = 
        normalizePlate(v.patente).includes(normalizePlate(searchTerm)) ||
        v.marcaModelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchOrigen = filterOrigen === 'All' || v.origen === filterOrigen;
      
      // Calculate real-time status relative to system date
      let isExpired = false;
      if (v.origen === 'Chile') {
        const days = getDaysRemaining(v.fechaVencimiento);
        isExpired = days < 0;
      } else {
        const days = getDaysRemaining(v.fechaVencimientoEstadia);
        isExpired = days < 0;
      }
      
      const computedEstado = isExpired ? 'Vencido' : 'Vigente';
      const matchEstado = filterEstado === 'All' || computedEstado === filterEstado;

      return matchSearch && matchOrigen && matchEstado;
    });
  }, [vehicles, searchTerm, filterOrigen, filterEstado]);

  // Statistics
  const stats = useMemo(() => {
    let total = vehicles.length;
    let vigentes = 0;
    let vencidos = 0;
    let particulares = 0;
    let diplomaticos = 0;
    let extranjeros = 0;

    vehicles.forEach((v) => {
      // Calculate status
      let isExpired = false;
      if (v.origen === 'Chile') {
        const days = getDaysRemaining(v.fechaVencimiento);
        isExpired = days < 0;
        if (v.tipoVehiculo === 'Diplomático') diplomaticos++;
        else particulares++;
      } else {
        const days = getDaysRemaining(v.fechaVencimientoEstadia);
        isExpired = days < 0;
        extranjeros++;
      }

      if (isExpired) vencidos++;
      else vigentes++;
    });

    return { total, vigentes, vencidos, particulares, diplomaticos, extranjeros };
  }, [vehicles]);

  return (
    <div className="space-y-6" id="consulta-estado-container">
      {/* Title Card */}
      <div className="bg-slate-900 text-white rounded-none p-6 border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
        <h3 className="text-xl font-bold font-display uppercase tracking-wider flex items-center gap-2">
          <Search className="text-blue-500 w-6 h-6 shrink-0" />
          {t ? t.conTitle : 'Panel de Consulta de Estado'}
        </h3>
        <p className="text-slate-300 text-xs mt-1.5 max-w-3xl font-sans">
          {t ? t.conDesc : 'Módulo de fiscalización y búsqueda en tiempo real para funcionarios de la aduana de Chile. Permite monitorear plazos de estadía, alertas de vencimiento e historial de cruces.'}
        </p>
      </div>

      {/* Stats Dashboard Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Card */}
        <div className="bg-white p-4 rounded-none border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between">
          <span className="text-[9px] font-bold font-mono text-slate-500 uppercase tracking-widest block">Registros Totales</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black font-display text-slate-900">{stats.total}</span>
            <span className="text-xs text-slate-500 font-mono">unids</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-2 border-t border-slate-100 pt-1.5">
            Chilenos y Argentinos
          </div>
        </div>

        {/* Vigentes Card */}
        <div className="bg-white p-4 rounded-none border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between">
          <span className="text-[9px] font-bold font-mono text-slate-500 uppercase tracking-widest block">Estadías Vigentes</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black font-display text-emerald-600">{stats.vigentes}</span>
            <span className="text-[10px] text-emerald-600 font-bold font-mono">en plazo</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-2 border-t border-slate-100 pt-1.5">
            Autorizados para circular
          </div>
        </div>

        {/* Vencidos Card */}
        <div className="bg-white p-4 rounded-none border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between">
          <span className="text-[9px] font-bold font-mono text-slate-500 uppercase tracking-widest block">Alertas Vencidas</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black font-display text-[#C8102E]">{stats.vencidos}</span>
            <span className="text-[10px] text-red-600 font-bold font-mono">expirado</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-2 border-t border-slate-100 pt-1.5">
            Infracciones potenciales
          </div>
        </div>

        {/* Type distribution summary */}
        <div className="bg-white p-4 rounded-none border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between">
          <span className="text-[9px] font-bold font-mono text-slate-500 uppercase tracking-widest block">Distribución de Flota</span>
          <div className="space-y-1.5 mt-2 text-[11px] font-semibold text-slate-700 font-sans">
            <div className="flex justify-between border-b border-slate-100 pb-0.5">
              <span>CL Particular:</span>
              <span className="font-bold text-slate-900 font-mono">{stats.particulares}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-0.5">
              <span>CL Diplomático:</span>
              <span className="font-bold text-slate-900 font-mono">{stats.diplomaticos}</span>
            </div>
            <div className="flex justify-between">
              <span>AR Temporal:</span>
              <span className="font-bold text-slate-900 font-mono">{stats.extranjeros}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white p-5 border-2 border-slate-900 rounded-none shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              id="search-input-patente"
              className="block w-full pl-10 pr-3 py-2.5 border-2 border-slate-800 rounded-none text-sm bg-slate-50 focus:bg-white focus:ring-0 focus:border-[#003399] focus:outline-none transition-colors"
              placeholder="Buscar por patente, marca/modelo o Folio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter options */}
          <div className="flex flex-wrap gap-2 text-xs">
            {/* Origin filter */}
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-none border-2 border-slate-800">
              <span className="text-[9px] font-bold text-slate-500 px-1.5 uppercase font-mono">Origen</span>
              <button
                type="button"
                id="filter-origen-all"
                onClick={() => setFilterOrigen('All')}
                className={`px-2.5 py-1 rounded-none font-bold font-display uppercase tracking-wider ${filterOrigen === 'All' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
              >
                Todos
              </button>
              <button
                type="button"
                id="filter-origen-chile"
                onClick={() => setFilterOrigen('Chile')}
                className={`px-2.5 py-1 rounded-none font-bold font-display uppercase tracking-wider ${filterOrigen === 'Chile' ? 'bg-[#003399] text-white' : 'text-slate-600 hover:bg-slate-200'}`}
              >
                CL
              </button>
              <button
                type="button"
                id="filter-origen-argentina"
                onClick={() => setFilterOrigen('Argentina')}
                className={`px-2.5 py-1 rounded-none font-bold font-display uppercase tracking-wider ${filterOrigen === 'Argentina' ? 'bg-[#C8102E] text-white' : 'text-slate-600 hover:bg-slate-200'}`}
              >
                AR
              </button>
            </div>

            {/* Status filter */}
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-none border-2 border-slate-800">
              <span className="text-[9px] font-bold text-slate-500 px-1.5 uppercase font-mono">Estado</span>
              <button
                type="button"
                id="filter-estado-all"
                onClick={() => setFilterEstado('All')}
                className={`px-2.5 py-1 rounded-none font-bold font-display uppercase tracking-wider ${filterEstado === 'All' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
              >
                Todos
              </button>
              <button
                type="button"
                id="filter-estado-vigente"
                onClick={() => setFilterEstado('Vigente')}
                className={`px-2.5 py-1 rounded-none font-bold font-display uppercase tracking-wider ${filterEstado === 'Vigente' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
              >
                Vigente
              </button>
              <button
                type="button"
                id="filter-estado-vencido"
                onClick={() => setFilterEstado('Vencido')}
                className={`px-2.5 py-1 rounded-none font-bold font-display uppercase tracking-wider ${filterEstado === 'Vencido' ? 'bg-rose-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
              >
                Vencido
              </button>
            </div>
          </div>
        </div>

        {/* Clear filters button if active */}
        {(searchTerm || filterOrigen !== 'All' || filterEstado !== 'All') && (
          <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-none border-2 border-slate-200 text-xs font-mono">
            <span className="text-slate-700">
              Filtros activos. Mostrando <strong>{filteredVehicles.length}</strong> de {vehicles.length} registros.
            </span>
            <button
              type="button"
              id="btn-restaurar-filtros"
              onClick={() => {
                setSearchTerm('');
                setFilterOrigen('All');
                setFilterEstado('All');
              }}
              className="text-[#003399] hover:text-blue-800 font-bold uppercase tracking-wider"
            >
              [Restablecer Filtros]
            </button>
          </div>
        )}
      </div>

      {/* Main content grid (Table list + Selected details panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table List Column */}
        <div className="lg:col-span-8 bg-white border-2 border-slate-900 rounded-none shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" id="vehicles-data-table">
              <thead>
                <tr className="bg-slate-100 border-b-2 border-slate-900 text-[9px] font-mono font-bold text-slate-700 uppercase tracking-widest">
                  <th className="py-3.5 px-4">Patente / Origen</th>
                  <th className="py-3.5 px-4">Vehículo</th>
                  <th className="py-3.5 px-4">Fecha Cruce</th>
                  <th className="py-3.5 px-4 text-center">Días Restantes</th>
                  <th className="py-3.5 px-4 text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredVehicles.length > 0 ? (
                  filteredVehicles.map((v) => {
                    // Compute days remaining
                    const expiryDate = v.origen === 'Chile' ? v.fechaVencimiento : v.fechaVencimientoEstadia;
                    const daysRemaining = getDaysRemaining(expiryDate);
                    const isExpired = daysRemaining < 0;
                    const isPre = v.origen === 'Argentina' && v.isPreRegistro;

                    return (
                      <tr
                        key={v.id}
                        id={`row-${v.patente}`}
                        className={`hover:bg-slate-50 transition-colors cursor-pointer ${currentSelected?.id === v.id ? 'bg-blue-50/50 font-medium' : ''}`}
                        onClick={() => setSelectedVehicle(v)}
                      >
                        {/* Patente and Flag */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-base shrink-0" title={v.origen}>
                              {v.origen === 'Chile' ? '🇨🇱' : '🇦🇷'}
                            </span>
                            <div>
                              <span className="font-mono font-black text-slate-800 text-sm tracking-wide block">
                                {v.patente}
                              </span>
                              <span className="text-[9px] text-slate-400 font-mono">
                                {isPre ? 'Pre-Registro' : `Folio: ${v.id}`}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Vehicle details */}
                        <td className="py-3 px-4">
                          <span className="font-semibold block text-slate-800">{v.marcaModelo}</span>
                          <span className={`text-[10px] font-medium ${v.origen === 'Chile' && v.tipoVehiculo === 'Diplomático' ? 'text-red-600 font-bold' : 'text-slate-500'}`}>
                            {v.origen === 'Chile' 
                              ? `Salida - ${v.tipoVehiculo}` 
                              : isPre 
                                ? `Pre-Registro AR -> CL`
                                : `Admisión - Extranjero`
                            }
                          </span>
                        </td>

                        {/* Cruce date */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 text-slate-600">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>
                              {v.origen === 'Chile' 
                                ? new Date(v.fechaSalida).toLocaleDateString('es-CL') 
                                : new Date(v.fechaIngreso).toLocaleDateString('es-CL')
                              }
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            {isPre ? 'Validez Estimada' : `Vence: ${new Date(expiryDate).toLocaleDateString('es-CL')}`}
                          </span>
                        </td>

                        {/* Days Remaining with numeric/color value */}
                        <td className="py-3 px-4 text-center font-mono">
                          {isPre ? (
                            <span className="text-amber-800 font-bold bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200 text-[10px] uppercase tracking-wider">
                              En Espera
                            </span>
                          ) : isExpired ? (
                            <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded">
                              {daysRemaining} días (Vencido)
                            </span>
                          ) : (
                            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                              {daysRemaining} días
                            </span>
                          )}
                        </td>

                        {/* Status Label with red/green indicator */}
                        <td className="py-3 px-4 text-right">
                          {isPre ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-700 border border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                              Pre-Registro
                            </span>
                          ) : (
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                              isExpired 
                                ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                                : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${isExpired ? 'bg-rose-600' : 'bg-emerald-600'}`}></span>
                              {isExpired ? 'Vencido' : 'Vigente'}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 px-4 text-center text-slate-400">
                      <ShieldAlert className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
                      <p className="font-bold text-slate-500 uppercase">No se encontraron resultados</p>
                      <p className="text-xs text-slate-400 mt-1">Pruebe ajustando el término de búsqueda o cambiando los filtros.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer controls for admin reset */}
          <div className="bg-slate-50 border-t border-slate-100 p-3.5 flex justify-between items-center">
            <span className="text-[10px] text-slate-400 font-mono">
              Base de Datos Localizada • Fecha de referencia de cálculo: 25/06/2026
            </span>
            
            {onResetDatabase && (
              <button
                type="button"
                id="btn-restaurar-base"
                onClick={() => {
                  if (confirm('¿Está seguro de que desea restablecer la base de datos a los valores iniciales? Se borrarán los nuevos registros de esta sesión.')) {
                    onResetDatabase();
                    setSelectedVehicle(null);
                  }
                }}
                className="inline-flex items-center gap-1 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors px-2 py-1 rounded border border-slate-200 text-[10px] font-bold"
                title="Restablecer base de datos inicial"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Restablecer Demo
              </button>
            )}
          </div>
        </div>

        {/* Selected Details Column */}
        <div className="lg:col-span-4">
          {currentSelected ? (
            <div className="bg-white rounded-none border-2 border-slate-900 p-5 space-y-4 relative overflow-hidden shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] animate-fadeIn">
              {/* Colored tag based on status */}
              {(() => {
                const expiryDate = currentSelected.origen === 'Chile' ? currentSelected.fechaVencimiento : currentSelected.fechaVencimientoEstadia;
                const daysRemaining = getDaysRemaining(expiryDate);
                const isExpired = daysRemaining < 0;
                const isPre = currentSelected.origen === 'Argentina' && currentSelected.isPreRegistro;

                return (
                  <>
                    <div className={`absolute top-0 left-0 right-0 h-2 ${isPre ? 'bg-amber-500' : isExpired ? 'bg-[#C8102E]' : 'bg-[#003399]'}`}></div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Ficha de Control</span>
                      <span className={`px-2 py-0.5 rounded-none border text-[9px] font-mono font-bold uppercase ${
                        isPre 
                          ? 'bg-amber-50 text-amber-700 border-amber-500 animate-pulse' 
                          : isExpired 
                            ? 'bg-rose-50 text-[#C8102E] border-[#C8102E]' 
                            : 'bg-emerald-50 text-emerald-700 border-emerald-500'
                      }`}>
                        {isPre ? 'Pre-Registro' : isExpired ? 'Vencido' : 'Vigente'}
                      </span>
                    </div>

                    <div className="text-center pb-3 border-b-2 border-slate-200">
                      <span className="text-3xl font-black font-mono tracking-widest text-slate-900 block uppercase">
                        {currentSelected.patente}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono font-bold block mt-0.5">
                        {isPre ? 'SOLICITUD DE INGRESO' : `FOLIO REGISTRO: ${currentSelected.id}`}
                      </span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-medium">Procedencia</span>
                        <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                          {currentSelected.origen === 'Chile' ? '🇨🇱 Chile (Vehículo Nacional)' : '🇦🇷 Argentina (Vehículo Extranjero)'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-medium">Marca/Modelo</span>
                          <span className="font-bold text-slate-800 truncate block mt-0.5">{currentSelected.marcaModelo}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-medium">Clasificación</span>
                          <span className="font-bold text-slate-800 block mt-0.5">
                            {currentSelected.origen === 'Chile' 
                              ? currentSelected.tipoVehiculo 
                              : isPre 
                                ? 'Pre-Registro Online' 
                                : 'Admisión Temporal'}
                          </span>
                        </div>
                      </div>

                      {currentSelected.origen === 'Chile' ? (
                        <>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-medium">RUN Conductor</span>
                              <span className="font-semibold text-slate-800 block mt-0.5">{currentSelected.runConductor}</span>
                            </div>
                            <div>
                              <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-medium">Plazo de Retorno</span>
                              <span className="font-semibold text-[#003399] block mt-0.5">{currentSelected.plazoDias} Días</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-medium">Fecha de Salida</span>
                              <span className="font-medium text-slate-700 block mt-0.5">
                                {new Date(currentSelected.fechaSalida).toLocaleDateString('es-CL')} 19:41
                              </span>
                            </div>
                            <div>
                              <span className="block text-[10px] text-red-500 uppercase tracking-wider font-bold">Límite Retorno</span>
                              <span className="font-extrabold text-red-600 block mt-0.5">
                                {new Date(currentSelected.fechaVencimiento).toLocaleDateString('es-CL')}
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-medium">N° Doc. Argentino</span>
                              <span className="font-semibold text-slate-800 block mt-0.5 truncate" title={currentSelected.documentoArgentina}>
                                {currentSelected.documentoArgentina}
                              </span>
                            </div>
                            <div>
                              <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-medium">Vence Doc. Orig.</span>
                              <span className="font-semibold text-slate-800 block mt-0.5">
                                {new Date(currentSelected.fechaVencimientoDocArgentina).toLocaleDateString('es-CL')}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-medium">
                                {isPre ? 'Declaración Online' : 'Fecha de Ingreso'}
                              </span>
                              <span className="font-medium text-slate-700 block mt-0.5">
                                {new Date(currentSelected.fechaIngreso).toLocaleDateString('es-CL')} 19:41
                              </span>
                            </div>
                            <div>
                              <span className="block text-[10px] text-[#003399] uppercase tracking-wider font-bold">
                                {isPre ? 'Estadía Estimada' : 'Límite Estadía'}
                              </span>
                              <span className="font-extrabold text-slate-800 block mt-0.5">
                                {new Date(currentSelected.fechaVencimientoEstadia).toLocaleDateString('es-CL')}
                              </span>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Expiration warning block */}
                      {isPre ? (
                        <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 text-amber-900 flex gap-2 items-start mt-2">
                          <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
                          <div>
                            <span className="font-extrabold block text-xs uppercase tracking-tight text-amber-950">Pre-Registro Pendiente de Control</span>
                            <p className="text-[11px] mt-0.5 text-amber-800 font-sans leading-relaxed">
                              El conductor pre-declaró su ingreso desde Argentina. {userRole === 'funcionario' 
                                ? 'Por favor valide el documento de aduanas físico y apruebe el cruce oficial.' 
                                : 'Debe presentar este registro ante la Aduana de Chile al llegar al complejo Los Libertadores.'}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className={`p-3 rounded-lg border flex gap-2 items-start mt-2 ${isExpired ? 'bg-rose-50 border-rose-100 text-rose-800' : 'bg-emerald-50 border-emerald-100 text-emerald-800'}`}>
                          {isExpired ? (
                            <>
                              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-extrabold block text-xs">ATENCIÓN: VEHÍCULO VENCIDO</span>
                                <p className="text-[11px] mt-0.5 text-rose-600">
                                  Supera el plazo legal por <strong>{Math.abs(daysRemaining)} días</strong>. Corresponde aplicar multa de internación temporal y retener documentación de reingreso.
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-extrabold block text-xs">VIGENCIA ACTIVA</span>
                                <p className="text-[11px] mt-0.5 text-emerald-600">
                                  Vehículo en situación regular. Le restan <strong>{daysRemaining} días</strong> para cumplir con la regularización fronteriza.
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions Panel */}
                    <div className="pt-3 border-t border-slate-200 space-y-2">
                      {isPre && onApprovePreRegistro && userRole === 'funcionario' && (
                        <button
                          type="button"
                          id="btn-aprobar-pre-registro"
                          onClick={() => {
                            if (confirm(`¿Confirma validar y aprobar el ingreso temporal oficial para el vehículo argentino con patente ${currentSelected.patente}?`)) {
                              onApprovePreRegistro(currentSelected.id);
                            }
                          }}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-display uppercase tracking-wider py-2.5 px-4 rounded-none border-2 border-slate-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] text-xs transition-all flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle className="w-4 h-4" /> Aprobar Admisión Oficial
                        </button>
                      )}
                      
                      <div className="flex gap-2">
                        {onDeleteRecord && (
                          <button
                            type="button"
                            id="btn-eliminar-registro"
                            onClick={() => {
                              if (confirm(`¿Está seguro de eliminar de forma permanente el registro para la patente ${currentSelected.patente}? Esta acción no se puede deshacer.`)) {
                                onDeleteRecord(currentSelected.id);
                                setSelectedVehicle(null);
                              }
                            }}
                            className="flex-1 border-2 border-rose-500 hover:bg-rose-50 text-rose-600 font-bold font-display uppercase tracking-wide py-2 px-3 rounded-none text-[10px] transition-all flex items-center justify-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Eliminar
                          </button>
                        )}
                        <button
                          type="button"
                          id="btn-cerrar-detalle"
                          onClick={() => setSelectedVehicle(null)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 border-2 border-slate-800 font-bold font-display uppercase tracking-wide py-2 px-3 rounded-none text-[10px] transition-all flex items-center justify-center"
                        >
                          Cerrar
                        </button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          ) : (
            /* Selected details placeholder */
            <div className="bg-slate-50 border-2 border-dashed border-slate-400 rounded-none p-6 text-center text-slate-400 h-80 flex flex-col items-center justify-center select-none">
              <Car className="w-12 h-12 text-slate-300 mb-2 stroke-[1.5]" />
              <p className="text-xs font-bold font-display uppercase tracking-wider text-slate-600">Detalles de Fiscalización</p>
              <p className="text-[11px] max-w-xs mt-1 text-slate-500 font-sans leading-relaxed">
                Seleccione cualquier vehículo en la tabla de la izquierda para desplegar su ficha de control, plazos restantes y protocolo de aduanas.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
