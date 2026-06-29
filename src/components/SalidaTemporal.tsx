import React, { useState, useMemo } from 'react';
import { Shield, FileText, CheckCircle, AlertCircle, Calendar, CreditCard, Car, RefreshCw, Printer, Download, HelpCircle } from 'lucide-react';
import { SalidaVehiculo } from '../types';
import { formatRun, validateRun, formatPatente, detectDiplomatic, generateFolio, SYSTEM_BASE_DATE } from '../utils/helpers';
import QRGenerator from './QRGenerator';
import { TranslationDict } from '../utils/translations';

interface SalidaTemporalProps {
  onRegister: (vehiculo: SalidaVehiculo) => void;
  t?: TranslationDict;
  language?: 'es' | 'en';
}

export default function SalidaTemporal({ onRegister, t, language = 'es' }: SalidaTemporalProps) {
  // Form State
  const [run, setRun] = useState('');
  const [patente, setPatente] = useState('');
  const [marcaModelo, setMarcaModelo] = useState('');
  const [fechaRetorno, setFechaRetorno] = useState('');
  
  // Feedback States
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [comprobante, setComprobante] = useState<SalidaVehiculo | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  // Dynamic Detections
  const runValido = useMemo(() => {
    if (!run) return null;
    return validateRun(run);
  }, [run]);

  const diplomaticCheck = useMemo(() => {
    if (!patente) return { isDiplomatic: false, type: '' };
    return detectDiplomatic(patente);
  }, [patente]);

  // Expiry configuration based on vehicle type
  const plazoDias = diplomaticCheck.isDiplomatic ? 90 : 180;
  
  // Expiration Date calculation (from base date)
  const fechaVencimientoObj = useMemo(() => {
    const base = new Date(SYSTEM_BASE_DATE);
    base.setDate(base.getDate() + plazoDias);
    return base;
  }, [plazoDias]);

  const fechaVencimientoFormateada = useMemo(() => {
    return fechaVencimientoObj.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }, [fechaVencimientoObj]);

  // Handlers
  const handleRunChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRun(e.target.value);
    setRun(formatted);
    if (errors.run) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.run;
        return copy;
      });
    }
  };

  const handlePatenteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPatente(e.target.value);
    setPatente(formatted);
    if (errors.patente) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.patente;
        return copy;
      });
    }
  };

  const handleTextChange = (value: string, field: string) => {
    if (field === 'marcaModelo') setMarcaModelo(value);
    if (field === 'fechaRetorno') setFechaRetorno(value);
    
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    // RUN Validation
    if (!run) {
      newErrors.run = 'El RUN del conductor es obligatorio.';
    } else if (!validateRun(run)) {
      newErrors.run = 'El RUN ingresado no es válido (ej: 12.345.678-9).';
    }

    // Patente Validation
    if (!patente) {
      newErrors.patente = 'La patente del vehículo es obligatoria.';
    } else if (patente.length < 5) {
      newErrors.patente = 'Ingrese una patente válida (mínimo 5 caracteres).';
    }

    // Brand/Model Validation
    if (!marcaModelo.trim()) {
      newErrors.marcaModelo = 'La marca y modelo del vehículo son obligatorios.';
    }

    // Return Date Validation
    if (!fechaRetorno) {
      newErrors.fechaRetorno = 'La fecha estimada de retorno es obligatoria.';
    } else {
      const selectedDate = new Date(fechaRetorno);
      const baseDate = new Date(SYSTEM_BASE_DATE);
      
      if (selectedDate <= baseDate) {
        newErrors.fechaRetorno = 'La fecha de retorno debe ser posterior a la fecha actual (25/06/2026).';
      } else {
        const diffTime = selectedDate.getTime() - baseDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > plazoDias) {
          newErrors.fechaRetorno = `El plazo estimado de retorno supera el límite legal de ${plazoDias} días para este tipo de vehículo.`;
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Success! Generate Registration
    const folio = generateFolio('S');
    const nuevoRegistro: SalidaVehiculo = {
      id: folio,
      patente: patente.toUpperCase(),
      runConductor: run,
      marcaModelo: marcaModelo.trim(),
      fechaSalida: SYSTEM_BASE_DATE,
      fechaEstimadaRetorno: new Date(fechaRetorno).toISOString(),
      plazoDias,
      fechaVencimiento: fechaVencimientoObj.toISOString(),
      tipoVehiculo: diplomaticCheck.isDiplomatic ? 'Diplomático' : 'Particular',
      tipoPlacaDetalle: diplomaticCheck.isDiplomatic ? diplomaticCheck.type : undefined,
      origen: 'Chile',
      estado: 'Vigente'
    };

    onRegister(nuevoRegistro);
    setComprobante(nuevoRegistro);
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
      alert('Imprimiendo comprobante oficial de Aduanas. Folio: ' + comprobante?.id);
    }, 1500);
  };

  const handleReset = () => {
    setRun('');
    setPatente('');
    setMarcaModelo('');
    setFechaRetorno('');
    setErrors({});
    setComprobante(null);
  };

  return (
    <div className="space-y-6" id="salida-temporal-container">
      {/* Title Card */}
      <div className="bg-[#003399] text-white rounded-none p-6 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
        <h3 className="text-xl font-bold font-display uppercase tracking-wider flex items-center gap-2">
          <Car className="text-[#D52B1E] w-6 h-6 shrink-0" />
          {t ? t.exitTitle : 'Registro de Salida Temporal de Vehículo'}
        </h3>
        <p className="text-blue-100 text-xs mt-1.5 max-w-3xl font-sans">
          {t ? t.exitDesc : 'Portal autogestionado para conductores de vehículos con patente chilena que salen temporalmente del territorio nacional hacia Argentina por el Paso Los Libertadores.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7 bg-white p-6 border-2 border-slate-900 rounded-none shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
          {!comprobante ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h4 className="text-base font-bold font-display uppercase tracking-wider text-slate-900 border-b-2 border-slate-100 pb-2 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#003399]" />
                Datos de la Declaración Jurada
              </h4>

              {/* RUN Input */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>RUN del Conductor</span>
                  {runValido !== null && (
                    <span className={`text-[10px] font-mono font-bold flex items-center gap-1 ${runValido ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {runValido ? (
                        <><CheckCircle className="w-3.5 h-3.5" /> RUN Válido</>
                      ) : (
                        <><AlertCircle className="w-3.5 h-3.5" /> RUN No Válido</>
                      )}
                    </span>
                  )}
                </label>
                <div className="relative rounded-none shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="input-run"
                    className={`block w-full pl-10 pr-3 py-2.5 border-2 rounded-none text-sm bg-slate-50 focus:bg-white focus:ring-0 focus:outline-none transition-colors ${
                      errors.run 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-slate-800 focus:border-[#003399]'
                    }`}
                    placeholder="12.345.678-9"
                    value={run}
                    onChange={handleRunChange}
                  />
                </div>
                {/* Ayuda contextual */}
                <p className="text-[11px] text-slate-500 font-sans flex items-start gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <span>Ingrese RUN chileno con puntos y guion. Ej: 12.345.678-9. El sistema lo valida en tiempo real.</span>
                </p>
                {errors.run && (
                  <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.run}
                  </p>
                )}
              </div>

              {/* Patente Input */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Patente del Vehículo (Chile)</span>
                  {patente && (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-none text-white font-bold ${diplomaticCheck.isDiplomatic ? 'bg-[#D52B1E]' : 'bg-[#003399]'}`}>
                      {diplomaticCheck.isDiplomatic ? 'DIPLOMÁTICA' : 'PARTICULAR'}
                    </span>
                  )}
                </label>
                <div className="relative rounded-none shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Car className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="input-patente"
                    className={`block w-full pl-10 pr-3 py-2.5 border-2 rounded-none text-sm font-mono uppercase bg-slate-50 focus:bg-white focus:ring-0 focus:outline-none transition-colors ${
                      errors.patente 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-slate-800 focus:border-[#003399]'
                    }`}
                    placeholder="ABCD-12 o AB-1234"
                    maxLength={10}
                    value={patente}
                    onChange={handlePatenteChange}
                  />
                </div>
                {/* Ayuda contextual */}
                <p className="text-[11px] text-slate-500 font-sans flex items-start gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <span>
                    Letras y números sin puntos. Si incluye <strong>CD, CC, OI o PAT</strong>, se aplica plazo de <strong>90 días</strong> (Diplomático). Particular recibe <strong>180 días</strong>.
                  </span>
                </p>
                {errors.patente && (
                  <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.patente}
                  </p>
                )}
              </div>

              {/* Marca y Modelo */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Marca y Modelo
                </label>
                <input
                  type="text"
                  id="input-marca-modelo"
                  className={`block w-full px-3 py-2.5 border-2 rounded-none text-sm bg-slate-50 focus:bg-white focus:ring-0 focus:outline-none transition-colors ${
                    errors.marcaModelo 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-slate-800 focus:border-[#003399]'
                  }`}
                  placeholder="Ej: Subaru Forester 2.0"
                  value={marcaModelo}
                  onChange={(e) => handleTextChange(e.target.value, 'marcaModelo')}
                />
                {/* Ayuda contextual */}
                <p className="text-[11px] text-slate-500 font-sans flex items-start gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <span>Escriba la marca del fabricante seguida del modelo comercial del vehículo.</span>
                </p>
                {errors.marcaModelo && (
                  <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.marcaModelo}
                  </p>
                )}
              </div>

              {/* Fecha Estimada de Retorno */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Fecha Estimada de Retorno
                </label>
                <div className="relative rounded-none shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    id="input-fecha-retorno"
                    className={`block w-full pl-10 pr-3 py-2.5 border-2 rounded-none text-sm bg-slate-50 focus:bg-white focus:ring-0 focus:outline-none transition-colors ${
                      errors.fechaRetorno 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-slate-800 focus:border-[#003399]'
                    }`}
                    min="2026-06-26"
                    value={fechaRetorno}
                    onChange={(e) => handleTextChange(e.target.value, 'fechaRetorno')}
                  />
                </div>
                {/* Ayuda contextual */}
                <p className="text-[11px] text-slate-500 font-sans flex items-start gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <span>
                    Debe ser posterior a hoy (25/06/2026) y tener un rango máximo de reingreso de{' '}
                    <strong>{plazoDias} días</strong> (Plazo máximo oficial).
                  </span>
                </p>
                {errors.fechaRetorno && (
                  <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.fechaRetorno}
                  </p>
                )}
              </div>

              {/* Auto-detected Expiry Notice Panel */}
              <div className="bg-slate-50 p-4 border-2 border-slate-800 rounded-none space-y-2">
                <h5 className="text-xs font-bold font-display uppercase tracking-widest text-slate-900 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-[#003399]" />
                  Vigencia Legal Determinada por Aduanas
                </h5>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[9px] text-slate-500 font-mono font-bold uppercase">Plazo Máximo Autorizado</span>
                    <span className="text-lg font-black font-display text-[#003399]">{plazoDias} días corridos</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-slate-500 font-mono font-bold uppercase">Fecha de Vencimiento</span>
                    <span className="text-lg font-black font-display text-slate-900">{fechaVencimientoFormateada}</span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 font-mono border-t border-slate-200 pt-1 mt-1">
                  * Determinado automáticamente por tipo de patente según normativa del Servicio Nacional de Aduanas.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  id="btn-confirmar-salida"
                  className="flex-1 bg-[#003399] hover:bg-blue-800 text-white font-bold font-display uppercase tracking-wider py-3 px-4 rounded-none border-2 border-slate-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <CheckCircle className="w-5 h-5" /> Confirmar Salida y Generar Comprobante
                </button>
                <button
                  type="button"
                  id="btn-limpiar-salida"
                  onClick={handleReset}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-4 rounded-none border-2 border-slate-800 transition-all text-sm flex items-center justify-center"
                  title="Limpiar Formulario"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </form>
          ) : (
            /* Simple flow showing success message and button to register another */
            <div className="text-center py-8 space-y-4">
              <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-none border-2 border-emerald-500">
                <CheckCircle className="w-12 h-12" />
              </div>
              <div>
                <h4 className="text-lg font-bold font-display uppercase tracking-wider text-slate-900">¡Registro Guardado Exitosamente!</h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto mt-1 font-sans">
                  La salida temporal del vehículo ha sido procesada. En el costado derecho puede visualizar e imprimir su comprobante oficial.
                </p>
              </div>
              <button
                type="button"
                id="btn-nuevo-registro-salida"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-[#003399] font-bold font-display uppercase tracking-wider px-5 py-3 rounded-none border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all text-xs"
              >
                <RefreshCw className="w-4 h-4" /> Registrar Otra Salida
              </button>
            </div>
          )}
        </div>

        {/* Receipt Visual Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-50 p-4 border-2 border-slate-300 rounded-none select-none">
            <h4 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-widest text-center mb-3">
              Vista Previa de Comprobante Oficial
            </h4>

            {comprobante ? (
              /* High fidelity Chilean customs receipt */
              <div 
                className="bg-white border-2 border-slate-900 rounded-none p-6 relative overflow-hidden shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]" 
                id="receipt-print-area"
              >
                {/* Government Ribbon */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#003399] via-white to-[#D52B1E]"></div>
                
                {/* Header */}
                <div className="flex justify-between items-start pt-2 border-b border-dashed border-slate-200 pb-3">
                  <div className="flex gap-2 items-center">
                    <svg viewBox="0 0 100 100" className="w-8 h-8 text-[#003399]">
                      <path d="M 10,20 L 50,10 L 90,20 L 90,50 C 90,75 50,95 50,95 C 50,95 10,75 10,50 Z" fill="currentColor" />
                      <path d="M 50,10 L 90,20 L 90,50 C 90,75 50,95 50,95 Z" fill="#C8102E" />
                      <polygon points="50,30 55,42 67,42 58,50 61,63 50,55 39,63 42,50 33,42 45,42" fill="#FFFFFF" />
                    </svg>
                    <div>
                      <span className="block text-[8px] font-mono uppercase tracking-widest text-slate-400">Chile</span>
                      <span className="block text-[10px] font-extrabold text-slate-800 uppercase tracking-tight">ADUANAS DE CHILE</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-blue-50 text-[#003399] text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-blue-100">
                      FOLIO: {comprobante.id}
                    </span>
                    <span className="block text-[8px] text-slate-400 font-mono mt-1">Paso Los Libertadores</span>
                  </div>
                </div>

                {/* Subtitle */}
                <div className="my-4 text-center">
                  <h5 className="text-xs font-extrabold text-slate-800 tracking-wider uppercase">
                    COMPROBANTE DE SALIDA TEMPORAL
                  </h5>
                  <p className="text-[9px] text-slate-500 font-medium uppercase font-mono">
                    SISTEMA PASODIGITAL • DECRETO SUPREMO N° 522
                  </p>
                </div>

                {/* Details Table */}
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 space-y-2.5 text-xs">
                  <div className="grid grid-cols-2 gap-x-2 border-b border-slate-100 pb-1.5">
                    <div>
                      <span className="block text-[9px] text-slate-400 font-mono uppercase">Patente del Vehículo</span>
                      <span className="font-mono font-extrabold text-slate-800 text-sm">{comprobante.patente}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-400 font-mono uppercase">Tipo de Placa</span>
                      <span className="font-semibold text-slate-800 flex items-center gap-0.5">
                        {comprobante.tipoVehiculo}
                        {comprobante.tipoPlacaDetalle && <span className="text-[9px] font-bold text-red-500">({comprobante.tipoPlacaDetalle})</span>}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-2 border-b border-slate-100 pb-1.5">
                    <div>
                      <span className="block text-[9px] text-slate-400 font-mono uppercase">RUN Conductor</span>
                      <span className="font-medium text-slate-800">{comprobante.runConductor}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-400 font-mono uppercase">Marca / Modelo</span>
                      <span className="font-medium text-slate-800 truncate">{comprobante.marcaModelo}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-2 border-b border-slate-100 pb-1.5">
                    <div>
                      <span className="block text-[9px] text-slate-400 font-mono uppercase">Fecha de Salida</span>
                      <span className="font-medium text-slate-800">
                        {new Date(comprobante.fechaSalida).toLocaleDateString('es-CL')} 19:41
                      </span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-400 font-mono uppercase">Plazo de Retorno</span>
                      <span className="font-bold text-[#003399]">{comprobante.plazoDias} Días Corridos</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-2">
                    <div>
                      <span className="block text-[9px] text-slate-400 font-mono uppercase">Estimado de Retorno</span>
                      <span className="font-medium text-slate-800">
                        {new Date(comprobante.fechaEstimadaRetorno).toLocaleDateString('es-CL')}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-red-500 font-mono uppercase font-bold">Vencimiento Improrrogable</span>
                      <span className="font-extrabold text-red-600">
                        {new Date(comprobante.fechaVencimiento).toLocaleDateString('es-CL')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* QR Section */}
                <div className="my-5 flex flex-col items-center justify-center gap-2">
                  <QRGenerator value={`PASODIGITAL-CHILE-SALIDA:${comprobante.id}|PAT:${comprobante.patente}|RUN:${comprobante.runConductor}|VENCE:${comprobante.fechaVencimiento}`} size={130} />
                  <span className="text-[8px] font-mono text-slate-400 text-center uppercase tracking-widest">
                    Escanear en control aduanero de reingreso
                  </span>
                </div>

                {/* Official Stamps Footer */}
                <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-[8px] text-slate-400">
                  <div className="flex flex-col items-center border border-slate-200 rounded px-2 py-1 bg-slate-50 w-[45%] text-center">
                    <span className="font-mono text-slate-500">DIRECCIÓN NACIONAL DE ADUANAS</span>
                    <span className="text-[7px] text-emerald-600 font-bold mt-1">✓ FIRMADO ELECTRÓNICAMENTE</span>
                  </div>
                  <div className="w-[50%] text-right font-mono text-[7px] leading-tight text-slate-400">
                    SNA Chile Los Libertadores • Código de validación único: PD- {comprobante.id.split('-').pop()}
                  </div>
                </div>
              </div>
            ) : (
              /* Empty state placeholder representing ticket */
              <div className="bg-white border-2 border-dashed border-slate-400 rounded-none p-8 flex flex-col items-center justify-center text-center h-80 text-slate-400">
                <FileText className="w-12 h-12 text-slate-300 mb-2 stroke-[1.5]" />
                <p className="text-xs font-bold font-display uppercase tracking-wider text-slate-600">Sin Datos Registrados</p>
                <p className="text-[11px] max-w-xs mt-1 text-slate-500 font-sans leading-relaxed">
                  Complete los datos de la declaración a la izquierda y presione "Confirmar Salida" para emitir el comprobante digital con código QR.
                </p>
              </div>
            )}
          </div>

          {comprobante && (
            <div className="flex gap-3">
              <button
                type="button"
                id="btn-imprimir-comprobante"
                onClick={handlePrint}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold font-display uppercase tracking-widest py-2.5 px-3 rounded-none border-2 border-slate-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] text-xs transition-all flex items-center justify-center gap-1.5"
              >
                {isPrinting ? (
                  <span>Generando Impresión...</span>
                ) : (
                  <><Printer className="w-4 h-4" /> Imprimir Comprobante</>
                )}
              </button>
              <button
                type="button"
                id="btn-descargar-pdf"
                onClick={handlePrint}
                className="bg-white hover:bg-slate-50 text-slate-700 font-bold font-display uppercase tracking-widest py-2.5 px-3 rounded-none border-2 border-slate-800 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] text-xs transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Descargar PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
