import React, { useState, useMemo } from 'react';
import { Shield, FileText, CheckCircle, AlertOctagon, Calendar, Car, HelpCircle, RefreshCw, Printer, Download, MapPin, Globe } from 'lucide-react';
import { AdmisionVehiculo } from '../types';
import { formatPatente, generateFolio, SYSTEM_BASE_DATE } from '../utils/helpers';
import QRGenerator from './QRGenerator';
import { TranslationDict } from '../utils/translations';

interface AdmisionTemporalProps {
  onRegister: (vehiculo: AdmisionVehiculo) => void;
  t?: TranslationDict;
  language?: 'es' | 'en';
  userRole?: 'conductor' | 'funcionario';
}

export default function AdmisionTemporal({ onRegister, t, language = 'es', userRole = 'funcionario' }: AdmisionTemporalProps) {
  // Form State
  const [patente, setPatente] = useState('');
  const [documento, setDocumento] = useState('');
  const [fechaVencDoc, setFechaVencDoc] = useState('');
  const [marcaModelo, setMarcaModelo] = useState('');
  
  // Feedback States
  const [comprobante, setComprobante] = useState<AdmisionVehiculo | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [rejectedMessage, setRejectedMessage] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  // Expiry Checker for the Argentine Document
  const checkDocStatus = useMemo(() => {
    if (!fechaVencDoc) return null;
    
    const docDate = new Date(fechaVencDoc);
    const systemDate = new Date(SYSTEM_BASE_DATE);
    
    // Clear hours for day-only comparison
    const docDay = new Date(docDate.getFullYear(), docDate.getMonth(), docDate.getDate());
    const systemDay = new Date(systemDate.getFullYear(), systemDate.getMonth(), systemDate.getDate());
    
    const isExpired = docDay < systemDay;
    return { isExpired, text: isExpired ? 'Vencido' : 'Vigente' };
  }, [fechaVencDoc]);

  // Handlers
  const handlePatenteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatente(formatPatente(e.target.value));
    if (errors.patente) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.patente;
        return copy;
      });
    }
  };

  const handleTextChange = (value: string, field: string) => {
    if (field === 'documento') setDocumento(value);
    if (field === 'fechaVencDoc') setFechaVencDoc(value);
    if (field === 'marcaModelo') setMarcaModelo(value);

    // Clear specific error
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
    
    // Clear dynamic rejection message if they are modifying date
    if (field === 'fechaVencDoc') {
      setRejectedMessage(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    // Patente Validation
    if (!patente.trim()) {
      newErrors.patente = 'La patente argentina es obligatoria.';
    }

    // Document Validation
    if (!documento.trim()) {
      newErrors.documento = 'El número de documento de la aduana argentina es obligatorio.';
    }

    // Date Validation
    if (!fechaVencDoc) {
      newErrors.fechaVencDoc = 'La fecha de vencimiento del documento es obligatoria.';
    }

    // Brand/Model Validation
    if (!marcaModelo.trim()) {
      newErrors.marcaModelo = 'La marca y modelo del vehículo son obligatorios.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Perform Expiry Check
    if (checkDocStatus && checkDocStatus.isExpired) {
      setRejectedMessage('Documento vencido — no se autoriza el ingreso');
      return;
    }

    // Success: Create admission
    const folio = generateFolio('A');
    const baseDate = new Date(SYSTEM_BASE_DATE);
    
    // Default stay (estadía) is 90 days from today
    const stayExpiry = new Date(baseDate);
    stayExpiry.setDate(stayExpiry.getDate() + 90);

    const nuevoRegistro: AdmisionVehiculo = {
      id: folio,
      patente: patente.toUpperCase(),
      documentoArgentina: documento.toUpperCase().trim(),
      fechaVencimientoDocArgentina: new Date(fechaVencDoc).toISOString(),
      fechaIngreso: SYSTEM_BASE_DATE,
      pasoFronterizo: 'Paso Los Libertadores',
      marcaModelo: marcaModelo.trim(),
      origen: 'Argentina',
      estado: 'Vigente',
      fechaVencimientoEstadia: stayExpiry.toISOString(),
      isPreRegistro: userRole === 'conductor' ? true : undefined,
    };

    onRegister(nuevoRegistro);
    setComprobante(nuevoRegistro);
    setRejectedMessage(null);
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
      alert('Imprimiendo comprobante oficial de Admisión Temporal de Vehículo Extranjero. Folio: ' + comprobante?.id);
    }, 1500);
  };

  const handleReset = () => {
    setPatente('');
    setDocumento('');
    setFechaVencDoc('');
    setMarcaModelo('');
    setErrors({});
    setComprobante(null);
    setRejectedMessage(null);
  };

  return (
    <div className="space-y-6" id="admision-temporal-container">
      {/* Title Card */}
      <div className="bg-[#C8102E] text-white rounded-none p-6 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
        <h3 className="text-xl font-bold font-display uppercase tracking-wider flex items-center gap-2">
          <Globe className="text-white w-6 h-6 shrink-0" />
          {userRole === 'conductor' 
            ? (language === 'es' ? 'Pre-Registro de Admisión Temporal (Ingreso a Chile)' : 'Temporary Admission Pre-Registration (Entry to Chile)')
            : (t ? t.admTitle : 'Registro de Admisión Temporal (Aduana)')}
        </h3>
        <p className="text-red-100 text-xs mt-1.5 max-w-3xl font-sans font-medium">
          {userRole === 'conductor'
            ? (language === 'es' 
                ? 'Portal autogestionado para conductores de vehículos con patente argentina que ingresarán al territorio nacional de Chile por el Paso Los Libertadores. Pre-declare sus datos para agilizar el trámite en frontera.' 
                : 'Self-managed portal for drivers of Argentine-plated vehicles entering Chile through the Los Libertadores Border Crossing. Pre-declare your details to speed up frontier control.')
            : (t ? t.admDesc : 'Módulo de uso exclusivo para funcionarios de aduana chilena. Permite procesar y autorizar la admisión temporal de vehículos particulares argentinos que ingresan al país por el paso fronterizo Los Libertadores.')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7 bg-white p-6 border-2 border-slate-900 rounded-none shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
          {!comprobante ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h4 className="text-base font-bold font-display uppercase tracking-wider text-slate-900 border-b-2 border-slate-100 pb-2 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#C8102E]" />
                {userRole === 'conductor' 
                  ? (language === 'es' ? 'Declaración de Pre-Ingreso' : 'Pre-Entry Declaration') 
                  : (language === 'es' ? 'Control de Admisión y Validación' : 'Admission Control & Validation')}
              </h4>

              {/* Argentine Plate (Patente) */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Patente Vehículo Extranjero</span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-[#003399] font-mono">
                    🇦🇷 Patente Argentina
                  </span>
                </label>
                <div className="relative rounded-none shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Car className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="input-patente-extranjera"
                    className={`block w-full pl-10 pr-3 py-2.5 border-2 rounded-none text-sm font-mono uppercase bg-slate-50 focus:bg-white focus:ring-0 focus:outline-none transition-colors ${
                      errors.patente 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-slate-800 focus:border-[#C8102E]'
                    }`}
                    placeholder="Ej: AA123BB o AAA123"
                    value={patente}
                    onChange={handlePatenteChange}
                  />
                </div>
                {/* Ayuda contextual */}
                <p className="text-[11px] text-slate-500 font-sans flex items-start gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <span>Código de patente del país de origen (letras y números). Ej: AA123BB para formato nuevo argentino.</span>
                </p>
                {errors.patente && (
                  <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-1">
                    <AlertOctagon className="w-3.5 h-3.5 shrink-0" /> {errors.patente}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Brand and Model */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Marca y Modelo
                  </label>
                  <input
                    type="text"
                    id="input-marca-modelo-extranjero"
                    className={`block w-full px-3 py-2.5 border-2 rounded-none text-sm bg-slate-50 focus:bg-white focus:ring-0 focus:outline-none transition-colors ${
                      errors.marcaModelo 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-slate-800 focus:border-[#C8102E]'
                    }`}
                    placeholder="Ej: Ford Focus"
                    value={marcaModelo}
                    onChange={(e) => handleTextChange(e.target.value, 'marcaModelo')}
                  />
                  {/* Ayuda contextual */}
                  <p className="text-[11px] text-slate-500 font-sans flex items-start gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                    <span>Marca y modelo del vehículo extranjero.</span>
                  </p>
                  {errors.marcaModelo && (
                    <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-1">
                      <AlertOctagon className="w-3.5 h-3.5 shrink-0" /> {errors.marcaModelo}
                    </p>
                  )}
                </div>

                {/* Border crossing (Read only visual) */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Paso de Ingreso (Fijado)
                  </label>
                  <div className="relative rounded-none shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <MapPin className="w-4 h-4 text-slate-500" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2.5 border-2 border-slate-300 rounded-none text-sm bg-slate-100 text-slate-600 font-bold"
                      value="Paso Los Libertadores"
                      disabled
                      readOnly
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Oficina de Control Fronterizo Los Libertadores, Chile.
                  </p>
                </div>
              </div>

              {/* Argentine Customs Document Number */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  N° de Documento de Aduana Argentina
                </label>
                <div className="relative rounded-none shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="input-documento"
                    className={`block w-full pl-10 pr-3 py-2.5 border-2 rounded-none text-sm bg-slate-50 focus:bg-white focus:ring-0 focus:outline-none transition-colors ${
                      errors.documento 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-slate-800 focus:border-[#C8102E]'
                    }`}
                    placeholder="Ej: AR-DGA-99214-X"
                    value={documento}
                    onChange={(e) => handleTextChange(e.target.value, 'documento')}
                  />
                </div>
                {/* Ayuda contextual */}
                <p className="text-[11px] text-slate-500 font-sans flex items-start gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <span>Código o folio del documento de salida emitido por la Dirección General de Aduanas (DGA) de Argentina.</span>
                </p>
                {errors.documento && (
                  <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-1">
                    <AlertOctagon className="w-3.5 h-3.5 shrink-0" /> {errors.documento}
                  </p>
                )}
              </div>

              {/* Argentine Document Expiration Date */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Fecha de Vencimiento de Documento Argentino</span>
                  {checkDocStatus && (
                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-none border-2 ${checkDocStatus.isExpired ? 'bg-rose-100 text-rose-700 border-rose-400' : 'bg-emerald-100 text-emerald-700 border-emerald-400'}`}>
                      {checkDocStatus.text}
                    </span>
                  )}
                </label>
                <div className="relative rounded-none shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    id="input-vencimiento-doc"
                    className={`block w-full pl-10 pr-3 py-2.5 border-2 rounded-none text-sm bg-slate-50 focus:bg-white focus:ring-0 focus:outline-none transition-colors ${
                      errors.fechaVencDoc 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-slate-800 focus:border-[#C8102E]'
                    }`}
                    value={fechaVencDoc}
                    onChange={(e) => handleTextChange(e.target.value, 'fechaVencDoc')}
                  />
                </div>
                {/* Ayuda contextual */}
                <p className="text-[11px] text-slate-500 font-sans flex items-start gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <span>
                    Fecha límite declarada en el papel de aduana argentina. Si la fecha es anterior al día de hoy (<strong>25/06/2026</strong>), el sistema bloqueará el ingreso.
                  </span>
                </p>
                {errors.fechaVencDoc && (
                  <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-1">
                    <AlertOctagon className="w-3.5 h-3.5 shrink-0" /> {errors.fechaVencDoc}
                  </p>
                )}
              </div>

              {/* Extreme block error for expired documents (As requested: "Documento vencido — no se autoriza el ingreso") */}
              {rejectedMessage && (
                <div className="bg-rose-50 border-2 border-rose-600 text-rose-800 p-5 rounded-none flex items-start gap-3 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] animate-shake">
                  <AlertOctagon className="w-8 h-8 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-extrabold text-sm font-display uppercase tracking-wider text-rose-950">RECHAZO DE ADMISIÓN ADUANERA</h5>
                    <p className="text-sm font-black mt-1 text-rose-900 font-display uppercase" id="rejected-message-alert">
                      {rejectedMessage}
                    </p>
                    <p className="text-xs mt-1 text-rose-700 font-sans leading-relaxed">
                      El vehículo con patente {patente || '...'} tiene la documentación argentina vencida. Por disposición legal chilena, se debe denegar el acceso por el complejo fronterizo.
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  id="btn-confirmar-admision"
                  className="flex-1 bg-[#C8102E] hover:bg-red-800 text-white font-bold font-display uppercase tracking-wider py-3 px-4 rounded-none border-2 border-slate-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <CheckCircle className="w-5 h-5" /> 
                  {userRole === 'conductor'
                    ? (language === 'es' ? 'Generar Solicitud de Pre-Registro' : 'Generate Pre-Registration Request')
                    : (language === 'es' ? 'Registrar Cruce e Ingreso Temporal' : 'Register Crossing & Entry')}
                </button>
                <button
                  type="button"
                  id="btn-limpiar-admision"
                  onClick={handleReset}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-4 rounded-none border-2 border-slate-800 transition-all text-sm flex items-center justify-center"
                  title="Limpiar Formulario"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </form>
          ) : (
            /* Admission success screen */
            <div className="text-center py-8 space-y-4">
              <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-none border-2 border-emerald-500">
                <CheckCircle className="w-12 h-12" />
              </div>
              <div>
                <h4 className="text-lg font-bold font-display uppercase tracking-wider text-slate-900">
                  {userRole === 'conductor'
                    ? (language === 'es' ? '¡Pre-Registro de Ingreso Exitoso!' : 'Pre-Entry Registration Successful!')
                    : (language === 'es' ? '¡Admisión Autorizada e Ingreso Registrado!' : 'Admission Authorized & Entry Registered!')}
                </h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto mt-1 font-sans">
                  {userRole === 'conductor'
                    ? (language === 'es' 
                        ? 'Su solicitud de admisión temporal ha sido registrada con éxito en el sistema local. Presente el código QR adjunto a la derecha al personal de la Aduana de Chile en el Paso Los Libertadores para validar y oficializar su ingreso.' 
                        : 'Your temporary admission request has been successfully recorded in the local system. Present the QR code on the right to the Chilean Customs officer at the Los Libertadores Border Complex to validate and finalize your entry.')
                    : (language === 'es'
                        ? 'Se ha registrado el cruce oficial del vehículo extranjero. Se le ha otorgado una estadía temporal máxima de 90 días prorrogables.'
                        : 'The official crossing of the foreign vehicle has been recorded. It has been granted a maximum temporary stay of 90 days (renewable).')}
                </p>
              </div>
              <button
                type="button"
                id="btn-nueva-admision"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-[#C8102E] font-bold font-display uppercase tracking-wider px-5 py-3 rounded-none border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all text-xs"
              >
                <RefreshCw className="w-4 h-4" /> 
                {userRole === 'conductor'
                  ? (language === 'es' ? 'Crear Otra Solicitud de Pre-Ingreso' : 'Create Another Pre-Entry Request')
                  : (language === 'es' ? 'Registrar Otro Ingreso' : 'Register Another Entry')}
              </button>
            </div>
          )}
        </div>

        {/* Receipt Visual Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-50 p-4 border-2 border-slate-300 rounded-none select-none">
            <h4 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-widest text-center mb-3">
              Vista Previa de Comprobante de Admisión
            </h4>

            {comprobante ? (
              /* High fidelity Chilean customs receipt for Admission */
              <div 
                className="bg-white border-2 border-slate-900 rounded-none p-6 relative overflow-hidden shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]" 
                id="receipt-print-area-admision"
              >
                {/* Government Ribbon */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#003399] via-white to-[#D52B1E]"></div>
                
                {/* Header */}
                <div className="flex justify-between items-start pt-2 border-b border-dashed border-slate-200 pb-3">
                  <div className="flex gap-2 items-center">
                    {/* Double flag indicator representing binational crossing */}
                    <div className="flex gap-1">
                      <span className="text-lg">🇦🇷</span>
                      <span className="text-lg">🇨🇱</span>
                    </div>
                    <div>
                      <span className="block text-[8px] font-mono uppercase tracking-widest text-slate-400">Paso Fronterizo</span>
                      <span className="block text-[10px] font-extrabold text-slate-800 uppercase tracking-tight">LOS LIBERTADORES</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-rose-50 text-[#C8102E] text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-rose-100">
                      {comprobante.isPreRegistro ? 'SOLICITUD:' : 'FOLIO:'} {comprobante.id}
                    </span>
                    {comprobante.isPreRegistro ? (
                      <span className="block text-[8px] text-amber-600 font-bold font-mono mt-1">⚡ PRE-REGISTRO DE INGRESO</span>
                    ) : (
                      <span className="block text-[8px] text-emerald-600 font-bold font-mono mt-1">✓ INGRESO AUTORIZADO</span>
                    )}
                  </div>
                </div>

                {/* Subtitle */}
                <div className="my-4 text-center">
                  <h5 className="text-xs font-extrabold text-[#0f2d59] tracking-wider uppercase">
                    {comprobante.isPreRegistro ? 'SOLICITUD DE ADMISIÓN TEMPORAL' : 'COMPROBANTE DE ADMISIÓN TEMPORAL'}
                  </h5>
                  <p className="text-[9px] text-slate-500 font-medium uppercase font-mono">
                    {comprobante.isPreRegistro ? 'PRE-DECLARACIÓN DE INGRESO DE VEHÍCULO EXTRANJERO' : 'INGRESO DE VEHÍCULO EXTRANJERO (ACUERDO INTERNACIONAL)'}
                  </p>
                </div>

                {/* Details Table */}
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 space-y-2.5 text-xs">
                  <div className="grid grid-cols-2 gap-x-2 border-b border-slate-100 pb-1.5">
                    <div>
                      <span className="block text-[9px] text-slate-400 font-mono uppercase">Patente Extranjera</span>
                      <span className="font-mono font-extrabold text-slate-800 text-sm">{comprobante.patente}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-400 font-mono uppercase">País de Origen</span>
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        Argentina 🇦🇷
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-2 border-b border-slate-100 pb-1.5">
                    <div>
                      <span className="block text-[9px] text-slate-400 font-mono uppercase">Marca / Modelo</span>
                      <span className="font-medium text-slate-800 truncate">{comprobante.marcaModelo}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-400 font-mono uppercase">Paso Fronterizo</span>
                      <span className="font-medium text-slate-800">{comprobante.pasoFronterizo}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-2 border-b border-slate-100 pb-1.5">
                    <div>
                      <span className="block text-[9px] text-slate-400 font-mono uppercase">Doc. Aduana Argentina</span>
                      <span className="font-mono font-bold text-slate-700 truncate block max-w-[120px]">{comprobante.documentoArgentina}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-400 font-mono uppercase">Vence Doc. Origen</span>
                      <span className="font-medium text-slate-800">
                        {new Date(comprobante.fechaVencimientoDocArgentina).toLocaleDateString('es-CL')}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-2">
                    <div>
                      <span className="block text-[9px] text-slate-400 font-mono uppercase">
                        {comprobante.isPreRegistro ? 'Fecha Registro Online' : 'Fecha y Hora Cruce'}
                      </span>
                      <span className="font-medium text-slate-800">
                        {new Date(comprobante.fechaIngreso).toLocaleDateString('es-CL')} 19:41
                      </span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-500 font-mono uppercase font-bold">Vence Estadía en Chile</span>
                      <span className="font-extrabold text-[#003399]">
                        {new Date(comprobante.fechaVencimientoEstadia).toLocaleDateString('es-CL')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* QR Section */}
                <div className="my-5 flex flex-col items-center justify-center gap-2">
                  <QRGenerator value={`PASODIGITAL-CHILE-ADMITIR:${comprobante.id}|PAT:${comprobante.patente}|DOC:${comprobante.documentoArgentina}|ESTADIA_VENCE:${comprobante.fechaVencimientoEstadia}|PRE:${comprobante.isPreRegistro ? 'SI' : 'NO'}`} size={130} />
                  <span className="text-[8px] font-mono text-slate-400 text-center uppercase tracking-widest">
                    {comprobante.isPreRegistro ? 'Código de Pre-Registro Aduanero' : 'Código de Control de Ingreso y Estadía'}
                  </span>
                </div>

                {/* Official Stamps Footer */}
                <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-[8px] text-slate-400">
                  <div className="flex flex-col items-center border border-slate-200 rounded px-2 py-1 bg-slate-50 w-[45%] text-center">
                    <span className="font-mono text-slate-500">ADUANAS CHILE - CONTROL</span>
                    {comprobante.isPreRegistro ? (
                      <span className="text-[7px] text-amber-700 font-bold mt-1 uppercase">⚠ REQUERIR VALIDACIÓN</span>
                    ) : (
                      <span className="text-[7px] text-sky-700 font-bold mt-1">✓ INGRESO REGISTRADO</span>
                    )}
                  </div>
                  <div className="w-[50%] text-right font-mono text-[7px] leading-tight text-slate-400">
                    SNA Los Libertadores • {comprobante.isPreRegistro ? 'Trámite Digital de Pre-Ingreso' : 'Cruce de Admisión Temporal habilitado'} • ID: ADM-{comprobante.id.split('-').pop()}
                  </div>
                </div>
              </div>
            ) : (
              /* Empty state placeholder representing ticket */
              <div className="bg-white border-2 border-dashed border-slate-400 rounded-none p-8 flex flex-col items-center justify-center text-center h-80 text-slate-400">
                <FileText className="w-12 h-12 text-slate-300 mb-2 stroke-[1.5]" />
                <p className="text-xs font-bold font-display uppercase tracking-wider text-slate-600">
                  {userRole === 'conductor' ? 'Sin Pre-Registro Creado' : 'Sin Datos de Ingreso'}
                </p>
                <p className="text-[11px] max-w-xs mt-1 text-slate-500 font-sans leading-relaxed">
                  {userRole === 'conductor'
                    ? (language === 'es'
                        ? 'Complete el formulario de pre-registro de vehículo argentino a la izquierda para generar su comprobante digital y código QR.'
                        : 'Complete the Argentine vehicle pre-registration form on the left to generate your digital voucher and QR code.')
                    : (language === 'es'
                        ? 'Ingrese los datos de admisión del vehículo argentino a la izquierda y presione "Registrar Cruce" para emitir el comprobante de autorización aduanera.'
                        : 'Enter the Argentine vehicle admission details on the left and click "Register Crossing" to issue the customs authorization voucher.')}
                </p>
              </div>
            )}
          </div>

          {comprobante && (
            <div className="flex gap-3">
              <button
                type="button"
                id="btn-imprimir-comprobante-adm"
                onClick={handlePrint}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold font-display uppercase tracking-widest py-2.5 px-3 rounded-none border-2 border-slate-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] text-xs transition-all flex items-center justify-center gap-1.5"
              >
                {isPrinting ? (
                  <span>Generando Impresión...</span>
                ) : (
                  <><Printer className="w-4 h-4" /> Imprimir Autorización</>
                )}
              </button>
              <button
                type="button"
                id="btn-descargar-pdf-adm"
                onClick={handlePrint}
                className="bg-white hover:bg-slate-50 text-slate-700 font-bold font-display uppercase tracking-widest py-2.5 px-3 rounded-none border-2 border-slate-800 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] text-xs transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Guardar PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
