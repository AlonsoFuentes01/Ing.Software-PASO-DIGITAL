import React, { useState } from 'react';
import { Shield, User, Lock, ArrowRight, CheckCircle2, Globe } from 'lucide-react';
import { TranslationDict } from '../utils/translations';
import ContactBar from './ContactBar';

interface LoginProps {
  onLoginSuccess: (user: { name: string; role: 'conductor' | 'funcionario'; id: string }) => void;
  language: 'es' | 'en';
  setLanguage: (lang: 'es' | 'en') => void;
  t: TranslationDict;
}

export default function Login({ onLoginSuccess, language, setLanguage, t }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError(t.loginRUTRequired);
      return;
    }
    
    const lowerUser = username.toLowerCase().trim();
    
    // Simple mock logic
    if (lowerUser.includes('funcionario') || lowerUser === 'admin' || lowerUser === '11.111.111-1') {
      onLoginSuccess({
        name: 'Roberto Valenzuela',
        role: 'funcionario',
        id: 'F-9921'
      });
    } else {
      // Treat as driver
      onLoginSuccess({
        name: 'Conductor Particular',
        role: 'conductor',
        id: username.trim()
      });
    }
  };

  const loginAsDriver = () => {
    setUsername('15.483.921-K');
    setPassword('******');
    setTimeout(() => {
      onLoginSuccess({
        name: 'Carlos Mendoza',
        role: 'conductor',
        id: '15.483.921-K'
      });
    }, 100);
  };

  const loginAsOfficer = () => {
    setUsername('funcionario@aduana.cl');
    setPassword('******');
    setTimeout(() => {
      onLoginSuccess({
        name: 'Roberto Valenzuela',
        role: 'funcionario',
        id: 'F-9921'
      });
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-100 font-sans antialiased text-slate-900 selection:bg-red-200">
      
      {/* Language Bar */}
      <div className="w-full max-w-7xl mx-auto px-4 pt-4 flex justify-between items-center">
        <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] text-xs font-mono font-bold uppercase">
          <Globe className="w-4 h-4 text-[#003399]" />
          <span>{language === 'es' ? 'Simulador de Paso Fronterizo' : 'Border Crossing Simulator'}</span>
        </div>
        
        {/* Language selector badge style */}
        <div className="flex border-2 border-slate-900 bg-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] overflow-hidden">
          <button
            type="button"
            onClick={() => setLanguage('es')}
            className={`px-3 py-1 text-xs font-bold uppercase transition-all ${
              language === 'es' ? 'bg-[#003399] text-white' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            ESP
          </button>
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 text-xs font-bold uppercase transition-all ${
              language === 'en' ? 'bg-[#003399] text-white' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            ENG
          </button>
        </div>
      </div>

      {/* Main card */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white border-4 border-slate-900 p-8 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] relative overflow-hidden">
          
          {/* Government Ribbon */}
          <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#003399] via-white to-[#D52B1E]"></div>

          {/* Header */}
          <div className="text-center pt-4 mb-6">
            <div className="inline-flex flex-col bg-white text-[#003399] p-2 rounded-xs border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] items-center justify-center w-16 h-16 shrink-0 font-bold leading-none text-center text-[10px] mb-4">
              ADUANA
              <span className="text-[#D52B1E] font-black tracking-tight">CHILE</span>
            </div>
            <h1 className="text-xl font-black uppercase tracking-tight text-slate-900 font-display">
              {t.loginTitle}
            </h1>
            <p className="text-xs font-mono font-bold text-slate-500 uppercase mt-1">
              {t.loginSubtitle}
            </p>
          </div>

          <p className="text-xs text-slate-600 text-center font-sans mb-6 leading-relaxed">
            {t.loginDesc}
          </p>

          {/* Role Access Selectors (Quick Access Badges) */}
          <div className="mb-6 space-y-3 bg-slate-50 p-4 border-2 border-slate-900">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider text-center border-b border-slate-200 pb-2">
              {t.loginRoleLabel}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Conductor Button */}
              <button
                type="button"
                onClick={loginAsDriver}
                className="group flex flex-col justify-between text-left p-3 bg-white hover:bg-blue-50 border-2 border-slate-900 hover:border-[#003399] transition-all duration-150 rounded-none shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
              >
                <div>
                  <span className="text-xs font-extrabold text-[#003399] group-hover:text-blue-700 flex items-center gap-1">
                    👤 {t.loginDriverRole}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                    {t.loginDriverRoleDesc}
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#003399] mt-2 block group-hover:underline">
                  {language === 'es' ? 'Acceso rápido →' : 'Quick access →'}
                </span>
              </button>

              {/* Funcionario Button */}
              <button
                type="button"
                onClick={loginAsOfficer}
                className="group flex flex-col justify-between text-left p-3 bg-white hover:bg-red-50 border-2 border-slate-900 hover:border-[#C8102E] transition-all duration-150 rounded-none shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
              >
                <div>
                  <span className="text-xs font-extrabold text-[#C8102E] group-hover:text-red-700 flex items-center gap-1">
                    🛡️ {t.loginOfficerRole}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                    {t.loginOfficerRoleDesc}
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#C8102E] mt-2 block group-hover:underline">
                  {language === 'es' ? 'Acceso rápido →' : 'Quick access →'}
                </span>
              </button>
            </div>
          </div>

          {/* Regular login form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-rose-50 border-2 border-rose-500 p-3 text-xs text-rose-800 font-bold font-mono">
                ⚠ {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {language === 'es' ? 'RUN Conductor o Correo de Funcionario' : 'Driver RUN ID or Officer Email'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  placeholder={t.loginRunPlaceholder}
                  className="block w-full pl-10 pr-3 py-2.5 border-2 border-slate-800 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-0 focus:border-[#003399] font-mono transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t.loginPassPlaceholder}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 border-2 border-slate-800 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-0 focus:border-[#003399] font-mono transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#003399] hover:bg-blue-800 text-white font-bold font-display uppercase tracking-wider py-3 px-4 border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all flex items-center justify-center gap-2 text-sm"
            >
              {t.loginBtnSubmit} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>

      {/* Contact Bar with Official Customs Contacts */}
      <div className="w-full max-w-7xl mx-auto px-4 mt-4">
        <ContactBar language={language} />
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 px-4 text-center text-xs select-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 100 100" className="w-6 h-6 text-slate-500">
              <path d="M 10,20 L 50,10 L 90,20 L 90,50 C 90,75 50,95 50,95 C 50,95 10,75 10,50 Z" fill="currentColor" />
            </svg>
            <span className="font-bold uppercase text-[9px] tracking-wider text-slate-300">
              Servicio Nacional de Aduanas - Gobierno de Chile
            </span>
          </div>
          <div className="text-[9px] text-slate-500 font-mono">
            PasoDigital v4.12 • {language === 'es' ? 'Simulación Integrada' : 'Integrated Simulation Environment'}
          </div>
        </div>
      </footer>
    </div>
  );
}
