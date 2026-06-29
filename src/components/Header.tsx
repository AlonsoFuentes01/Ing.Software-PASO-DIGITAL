import React from 'react';
import { Shield, Clock, MapPin, LogOut, User, Globe } from 'lucide-react';
import { SYSTEM_BASE_DATE } from '../utils/helpers';
import { TranslationDict } from '../utils/translations';

interface HeaderProps {
  language: 'es' | 'en';
  setLanguage: (lang: 'es' | 'en') => void;
  user: { name: string; role: 'conductor' | 'funcionario'; id: string } | null;
  onLogout: () => void;
  t: TranslationDict;
}

export default function Header({ language, setLanguage, user, onLogout, t }: HeaderProps) {
  // Format current system base date elegantly
  const formattedDate = new Date(SYSTEM_BASE_DATE).toLocaleDateString(
    language === 'es' ? 'es-CL' : 'en-US',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    }
  );

  return (
    <header className="bg-[#003399] border-b-4 border-[#D52B1E] text-white shadow-md select-none flex flex-col" id="main-header">
      
      {/* Mini top utility bar for profile & language toggles */}
      <div className="bg-[#002266] py-2 px-4 md:px-8 border-b border-blue-900 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* User profile details */}
        {user ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#D52B1E] flex items-center justify-center text-white font-bold text-[10px]">
              {user.role === 'funcionario' ? '🛡️' : '👤'}
            </div>
            <span className="font-sans font-medium text-blue-100">
              {t.loggedInAs}: <strong className="text-white font-bold">{user.name}</strong> 
              <span className="mx-1.5 text-blue-400">|</span>
              <span className="font-mono text-[10px] bg-blue-900 px-1.5 py-0.5 border border-blue-700 font-bold uppercase rounded-xs">
                {user.role === 'funcionario' ? t.officerUser : t.driverUser}
              </span>
            </span>
          </div>
        ) : (
          <div className="text-blue-300 font-mono text-[10px]">
            {language === 'es' ? 'ESCUELA NACIONAL DE ADUANAS • SIMULADOR' : 'NATIONAL CUSTOMS SCHOOL • SIMULATOR'}
          </div>
        )}

        {/* Right tools: Language selector and Logout button */}
        <div className="flex items-center gap-4">
          
          {/* Language selector toggle */}
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-blue-300 shrink-0" />
            <div className="flex border border-blue-700 rounded-xs overflow-hidden bg-blue-950">
              <button
                type="button"
                onClick={() => setLanguage('es')}
                className={`px-2 py-0.5 text-[10px] font-bold uppercase transition-all ${
                  language === 'es' ? 'bg-[#D52B1E] text-white' : 'text-blue-300 hover:text-white'
                }`}
              >
                ESP
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 text-[10px] font-bold uppercase transition-all ${
                  language === 'en' ? 'bg-[#D52B1E] text-white' : 'text-blue-300 hover:text-white'
                }`}
              >
                ENG
              </button>
            </div>
          </div>

          {user && (
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1 bg-red-600/90 hover:bg-red-700 text-white px-2.5 py-1 text-[11px] font-bold uppercase border border-red-500 rounded-xs transition-colors cursor-pointer"
            >
              <LogOut className="w-3 h-3 shrink-0" />
              <span>{t.logoutBtn}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main header banner */}
      <div className="py-4 px-4 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Government Logo Representation */}
        <div className="flex items-center gap-3">
          {/* Logo Icon representation of Chile Shield */}
          <div className="flex flex-col bg-white text-[#003399] p-1 rounded-xs border border-slate-200 shadow-xs items-center justify-center w-12 h-12 shrink-0 font-bold leading-none text-center text-[9px]">
            ADUANA
            <span className="text-[#D52B1E] font-black">CHILE</span>
          </div>
          
          <div className="leading-tight">
            <div className="text-[10px] tracking-widest font-mono text-blue-200 font-bold uppercase">
              {t.govTitle}
            </div>
            <h1 className="text-base font-black font-sans text-white tracking-tight uppercase">
              {t.appTitle}
            </h1>
            <p className="text-[10px] text-blue-200 font-bold font-sans uppercase tracking-wider">
              {language === 'es' ? 'Control Los Libertadores' : 'Los Libertadores Checkpoint'}
            </p>
          </div>
        </div>

        {/* Center application name */}
        <div className="flex items-center gap-2 md:justify-center">
          <span className="bg-[#D52B1E] text-white text-[10px] font-bold tracking-widest px-2.5 py-0.5 rounded-xs uppercase shrink-0">
            SNA CHILE
          </span>
          <h2 className="text-sm md:text-base font-bold font-sans tracking-tight text-white flex items-center gap-1.5 uppercase">
            {language === 'es' ? 'Salida y Admisión Temporal' : 'Temporary Exit & Admission'}
          </h2>
        </div>

        {/* Right Details (Paso & Date) */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-blue-100 md:text-right md:justify-end font-mono">
          <div className="flex items-center gap-1.5 bg-blue-900/40 px-2.5 py-1 rounded-md border border-blue-700/50">
            <MapPin className="w-4 h-4 text-[#D52B1E] shrink-0" />
            <span>{t.controlLocation}</span>
          </div>
          <div className="hidden sm:block text-blue-400">|</div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-300 shrink-0" />
            <span className="text-[10px]">{formattedDate}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
