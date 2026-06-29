import React from 'react';
import { Mail, Phone, MessageSquare, Clock, ShieldAlert } from 'lucide-react';

interface ContactBarProps {
  language: 'es' | 'en';
}

export default function ContactBar({ language }: ContactBarProps) {
  const isEs = language === 'es';

  const text = {
    title: isEs ? 'Canales de Asistencia y Contacto Oficial' : 'Official Assistance & Contact Channels',
    subtitle: isEs 
      ? 'Hable directo con la administración de Aduana del Complejo Los Libertadores' 
      : 'Connect directly with the Customs administration at the Los Libertadores Border Complex',
    whatsappLabel: isEs ? 'WhatsApp de Ayuda' : 'WhatsApp Support',
    whatsappAction: isEs ? 'Iniciar chat inmediato' : 'Start instant chat',
    emailLabel: isEs ? 'Correo Institucional' : 'Institutional Email',
    emailAction: isEs ? 'Enviar solicitud' : 'Send request',
    phoneLabel: isEs ? 'Teléfono de Atención' : 'Helpline Telephone',
    phoneAction: isEs ? 'Llamar a control fronterizo' : 'Call border control',
    hoursTitle: isEs ? 'Horarios de Atención Telefónica' : 'Telephone Support Hours',
    hoursDesc: isEs 
      ? 'Lunes a Domingo — 24 horas continuas (Temporada Estival) / 08:00 a 20:00 (Temporada Invernal).' 
      : 'Monday to Sunday — 24 hours continuous (Summer Season) / 08:00 to 20:00 (Winter Season).',
    disclaimer: isEs
      ? 'Atención oficial operada por la Mesa de Ayuda de la Dirección Regional de Aduanas Metropolitana y Valparaíso.'
      : 'Official service operated by the Help Desk of the Metropolitan and Valparaíso Regional Customs Directorate.'
  };

  return (
    <div 
      className="w-full bg-white border-4 border-slate-900 p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] relative overflow-hidden font-sans my-8" 
      id="customs-contact-channels"
    >
      {/* Decorative colored strip to match Gov aesthetics */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#003399] via-white to-[#D52B1E]" />

      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 pt-2">
        
        {/* Left Side: Header & info */}
        <div className="max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-800 text-[10px] font-mono font-bold uppercase px-2.5 py-1 border-2 border-rose-900">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{isEs ? 'ASISTENCIA EN LINEA' : 'ONLINE ASSISTANCE'}</span>
          </div>
          <h3 className="text-base md:text-lg font-black text-slate-900 uppercase tracking-tight">
            {text.title}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            {text.subtitle}
          </p>
        </div>

        {/* Right Side / Bottom: Core Contact Methods (Cards in bento style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
          
          {/* WhatsApp Card */}
          <a
            href="https://wa.me/56987654321"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between p-4 bg-emerald-50 hover:bg-emerald-100 border-2 border-slate-900 transition-all rounded-none shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]"
            id="contact-whatsapp"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-500 text-white border-2 border-slate-900 shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] font-mono font-black text-emerald-800 uppercase tracking-wider">
                  {text.whatsappLabel}
                </span>
                <span className="block text-sm font-extrabold text-slate-950 font-mono mt-0.5">
                  +56 9 8765 4321
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 underline mt-3 block group-hover:text-emerald-900">
              {text.whatsappAction} →
            </span>
          </a>

          {/* Email Card */}
          <a
            href="mailto:soporte.libertadores@aduana.cl"
            className="group flex flex-col justify-between p-4 bg-blue-50 hover:bg-blue-100 border-2 border-slate-900 transition-all rounded-none shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]"
            id="contact-email"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-600 text-white border-2 border-slate-900 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] font-mono font-black text-blue-800 uppercase tracking-wider">
                  {text.emailLabel}
                </span>
                <span className="block text-xs font-extrabold text-slate-950 font-mono mt-1 break-all">
                  soporte.libertadores@aduana.cl
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-blue-700 underline mt-3 block group-hover:text-blue-900">
              {text.emailAction} →
            </span>
          </a>

          {/* Telephone Card */}
          <a
            href="tel:+56342491000"
            className="group flex flex-col justify-between p-4 bg-red-50 hover:bg-red-100 border-2 border-slate-900 transition-all rounded-none shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]"
            id="contact-phone"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#C8102E] text-white border-2 border-slate-900 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] font-mono font-black text-red-800 uppercase tracking-wider">
                  {text.phoneLabel}
                </span>
                <span className="block text-sm font-extrabold text-slate-950 font-mono mt-0.5">
                  +56 34 249 1000
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-red-700 underline mt-3 block group-hover:text-red-900">
              {text.phoneAction} →
            </span>
          </a>

        </div>

      </div>

      {/* Bottom status & operational info bar */}
      <div className="mt-6 pt-4 border-t-2 border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[11px] text-slate-500 font-sans">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#003399] shrink-0" />
          <span>
            <strong>{text.hoursTitle}:</strong> {text.hoursDesc}
          </span>
        </div>
        <div className="text-[10px] font-mono text-slate-400 max-w-sm md:text-right">
          {text.disclaimer}
        </div>
      </div>
    </div>
  );
}
