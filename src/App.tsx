import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, LogIn, Search, ShieldAlert, BookOpen, AlertCircle, RefreshCw, HelpCircle, FileText } from 'lucide-react';
import { RegistroVehiculo, SalidaVehiculo, AdmisionVehiculo } from './types';
import { INITIAL_VEHICLES } from './data/initialVehicles';
import Header from './components/Header';
import SalidaTemporal from './components/SalidaTemporal';
import AdmisionTemporal from './components/AdmisionTemporal';
import ConsultaEstado from './components/ConsultaEstado';
import Login from './components/Login';
import SoporteAyuda from './components/SoporteAyuda';
import ContactBar from './components/ContactBar';
import { translations } from './utils/translations';

export default function App() {
  // Authentication State
  const [user, setUser] = useState<{ name: string; role: 'conductor' | 'funcionario'; id: string } | null>(null);
  
  // Language State (defaulting to 'es')
  const [language, setLanguage] = useState<'es' | 'en'>('es');

  // Navigation State
  const [activeTab, setActiveTab] = useState<'salida' | 'admision' | 'consulta' | 'soporte'>('salida');

  // Database State
  const [vehicles, setVehicles] = useState<RegistroVehiculo[]>([]);

  // Load user session, language preference and vehicles database from LocalStorage
  useEffect(() => {
    // Load language
    const storedLang = localStorage.getItem('pasodigital_lang');
    if (storedLang === 'es' || storedLang === 'en') {
      setLanguage(storedLang);
    }

    // Load user session
    const storedUser = localStorage.getItem('pasodigital_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error loading session:', e);
      }
    }

    // Load vehicles
    const storedVehicles = localStorage.getItem('pasodigital_vehicles');
    if (storedVehicles) {
      try {
        setVehicles(JSON.parse(storedVehicles));
      } catch (e) {
        console.error('Error loading vehicles, resetting...', e);
        setVehicles(INITIAL_VEHICLES);
      }
    } else {
      setVehicles(INITIAL_VEHICLES);
      localStorage.setItem('pasodigital_vehicles', JSON.stringify(INITIAL_VEHICLES));
    }
  }, []);

  // Save to LocalStorage whenever vehicles state changes
  const saveVehicles = (newVehicles: RegistroVehiculo[]) => {
    setVehicles(newVehicles);
    localStorage.setItem('pasodigital_vehicles', JSON.stringify(newVehicles));
  };

  // Register exit or admission
  const handleRegisterVehicle = (newVehicle: RegistroVehiculo) => {
    // Add to the top of list
    const updated = [newVehicle, ...vehicles];
    saveVehicles(updated);
  };

  // Approve a driver's pre-registration
  const handleApprovePreRegistro = (id: string) => {
    const updated = vehicles.map((v) => {
      if (v.id === id && v.origen === 'Argentina' && v.isPreRegistro) {
        return {
          ...v,
          isPreRegistro: undefined, // Converts it into an official approved admission
        };
      }
      return v;
    });
    saveVehicles(updated);
  };

  // Delete a record
  const handleDeleteRecord = (id: string) => {
    const updated = vehicles.filter((v) => v.id !== id);
    saveVehicles(updated);
  };

  // Reset database back to default seed
  const handleResetDatabase = () => {
    saveVehicles(INITIAL_VEHICLES);
  };

  // Login handler
  const handleLoginSuccess = (authenticatedUser: { name: string; role: 'conductor' | 'funcionario'; id: string }) => {
    setUser(authenticatedUser);
    localStorage.setItem('pasodigital_user', JSON.stringify(authenticatedUser));
    
    // Redirect conductor to 'salida' or 'soporte'
    if (authenticatedUser.role === 'conductor') {
      setActiveTab('salida');
    } else {
      setActiveTab('consulta'); // Officers might prefer to land on the search / stats panel
    }
  };

  // Logout handler
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('pasodigital_user');
    setActiveTab('salida');
  };

  // Language setter wrapper
  const handleSetLanguage = (lang: 'es' | 'en') => {
    setLanguage(lang);
    localStorage.setItem('pasodigital_lang', lang);
  };

  // Get active translation dictionary
  const t = translations[language];

  // Render Login view if user is not authenticated
  if (!user) {
    return (
      <Login 
        language={language} 
        setLanguage={handleSetLanguage} 
        t={t} 
        onLoginSuccess={handleLoginSuccess} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-[#003399]/10 selection:text-[#003399]" id="pasodigital-root">
      
      {/* Official Government Header */}
      <Header 
        language={language} 
        setLanguage={handleSetLanguage} 
        user={user} 
        onLogout={handleLogout} 
        t={t} 
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
        
        {/* Role & Screen Navigation Bar in Geometric Balance style */}
        <div className="bg-white border-2 border-slate-900 rounded-sm shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] p-1.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 select-none animate-fadeIn" id="tabs-navigation">
          
          {/* Label Helper */}
          <div className="px-3 py-2 bg-slate-900 text-white rounded-none font-mono text-[10px] font-bold uppercase tracking-widest text-center sm:text-left shrink-0">
            {language === 'es' ? 'Módulos del Sistema' : 'System Modules'}
          </div>

          <div className="flex flex-wrap flex-1 gap-1">
            
            {/* Pantalla 1: Salida Conductor - Visible to BOTH roles */}
            <button
              type="button"
              id="tab-salida-conductor"
              onClick={() => setActiveTab('salida')}
              className={`flex-1 min-w-[130px] px-3.5 py-2.5 rounded-none text-xs font-bold font-display uppercase tracking-wider transition-all flex items-center justify-center gap-2 border-2 ${
                activeTab === 'salida'
                  ? 'bg-[#003399] text-white border-slate-950 shadow-inner'
                  : 'text-slate-600 border-transparent hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <div className="text-left leading-tight">
                <span className="block text-[8px] opacity-75 font-mono uppercase font-bold tracking-wider">
                  {language === 'es' ? 'Salida' : 'Exit'}
                </span>
                <span className="block">{t.tabExit}</span>
              </div>
            </button>

            {/* Pantalla 2: Admisión / Ingresar desde Argentina - Visible to BOTH roles */}
            <button
              type="button"
              id="tab-admision-aduana"
              onClick={() => setActiveTab('admision')}
              className={`flex-1 min-w-[130px] px-3.5 py-2.5 rounded-none text-xs font-bold font-display uppercase tracking-wider transition-all flex items-center justify-center gap-2 border-2 ${
                activeTab === 'admision'
                  ? 'bg-[#C8102E] text-white border-slate-950 shadow-inner'
                  : 'text-slate-600 border-transparent hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <LogIn className="w-4 h-4 shrink-0" />
              <div className="text-left leading-tight">
                <span className="block text-[8px] opacity-75 font-mono uppercase font-bold tracking-wider">
                  {user.role === 'funcionario' 
                    ? (language === 'es' ? 'Control' : 'Admissions') 
                    : (language === 'es' ? 'Ingreso AR' : 'Entry AR')}
                </span>
                <span className="block">
                  {user.role === 'funcionario' 
                    ? t.tabAdmission 
                    : (language === 'es' ? 'Ingresar desde AR' : 'Enter from AR')}
                </span>
              </div>
            </button>

            {/* Pantalla 3: Consulta Estado / Fiscalización - Visible to BOTH roles */}
            <button
              type="button"
              id="tab-consulta-estado"
              onClick={() => setActiveTab('consulta')}
              className={`flex-1 min-w-[130px] px-3.5 py-2.5 rounded-none text-xs font-bold font-display uppercase tracking-wider transition-all flex items-center justify-center gap-2 border-2 ${
                activeTab === 'consulta'
                  ? 'bg-slate-900 text-white border-slate-950 shadow-inner'
                  : 'text-slate-600 border-transparent hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Search className="w-4 h-4 shrink-0" />
              <div className="text-left leading-tight">
                <span className="block text-[8px] opacity-75 font-mono uppercase font-bold tracking-wider">
                  {user.role === 'funcionario' 
                    ? (language === 'es' ? 'Aduana' : 'Enforcement') 
                    : (language === 'es' ? 'Consulta' : 'Status Query')}
                </span>
                <span className="block">
                  {user.role === 'funcionario' 
                    ? t.tabConsultation 
                    : (language === 'es' ? 'Consultar Estado' : 'Check Status')}
                </span>
              </div>
            </button>

            {/* Pantalla 4: Soporte y Ayuda - Visible to BOTH roles */}
            <button
              type="button"
              id="tab-soporte-ayuda"
              onClick={() => setActiveTab('soporte')}
              className={`flex-1 min-w-[130px] px-3.5 py-2.5 rounded-none text-xs font-bold font-display uppercase tracking-wider transition-all flex items-center justify-center gap-2 border-2 ${
                activeTab === 'soporte'
                  ? 'bg-amber-600 text-white border-slate-950 shadow-inner'
                  : 'text-slate-600 border-transparent hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <HelpCircle className="w-4 h-4 shrink-0" />
              <div className="text-left leading-tight">
                <span className="block text-[8px] opacity-75 font-mono uppercase font-bold tracking-wider">
                  {language === 'es' ? 'Mesa de Ayuda' : 'Help Desk'}
                </span>
                <span className="block">{t.tabSupport}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Warning / Informational context strip - Geometric Balance style */}
        <div className="bg-slate-50 border-l-4 border-[#003399] p-4 rounded-none border border-slate-300 shadow-sm flex items-start gap-3 text-xs text-slate-800">
          <ShieldAlert className="w-5 h-5 text-[#003399] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-display font-bold text-slate-900 uppercase tracking-wide block mb-0.5">
              {language === 'es' ? 'Complejo Fronterizo Integrado Los Libertadores:' : 'Los Libertadores Integrated Border Crossing:'}
            </strong> 
            {language === 'es' 
              ? 'Toda la información registrada en esta plataforma local se sincroniza automáticamente con el sistema de control binacional chileno-argentino. Respete las fechas de vencimiento para evitar multas.' 
              : 'All information recorded on this local platform is automatically synchronized with the Chilean-Argentine binational control system. Observe expiry dates to prevent penalties.'}
          </div>
        </div>

        {/* Dynamic Tab Panel Content with Framer Motion Layout Transition */}
        <div className="relative" id="main-content-display">
          <AnimatePresence mode="wait">
            
            {activeTab === 'salida' && (
              <motion.div
                key="salida-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                <SalidaTemporal onRegister={handleRegisterVehicle} t={t} language={language} />
              </motion.div>
            )}

            {activeTab === 'admision' && (
              <motion.div
                key="admision-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                <AdmisionTemporal 
                  onRegister={handleRegisterVehicle} 
                  t={t} 
                  language={language} 
                  userRole={user.role}
                />
              </motion.div>
            )}

            {activeTab === 'consulta' && (
              <motion.div
                key="consulta-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                <ConsultaEstado 
                  vehicles={vehicles} 
                  onDeleteRecord={user.role === 'funcionario' ? handleDeleteRecord : undefined}
                  onResetDatabase={user.role === 'funcionario' ? handleResetDatabase : undefined}
                  onApprovePreRegistro={user.role === 'funcionario' ? handleApprovePreRegistro : undefined}
                  t={t}
                  language={language}
                  userRole={user.role}
                />
              </motion.div>
            )}

            {activeTab === 'soporte' && (
              <motion.div
                key="soporte-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                <SoporteAyuda language={language} t={t} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Contact Bar with Official Customs Contacts */}
        <ContactBar language={language} />
      </main>

      {/* Official Gov Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 px-4 text-center text-xs select-none mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 100 100" className="w-6 h-6 text-slate-400">
              <path d="M 10,20 L 50,10 L 90,20 L 90,50 C 90,75 50,95 50,95 C 50,95 10,75 10,50 Z" fill="currentColor" />
            </svg>
            <span className="font-extrabold uppercase text-[10px] tracking-wider text-slate-300">
              {t.govTitle} - Servicio Nacional de Aduanas
            </span>
          </div>
          <div className="text-[10px]">
            © {new Date().getFullYear()} {language === 'es' ? 'Aduanas Chile. Complejo Fronterizo Los Libertadores, Los Andes, Valparaíso.' : 'Customs of Chile. Los Libertadores Border Complex, Los Andes, Valparaíso.'}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            PasoDigital v4.12 • {language === 'es' ? 'Entorno de Simulación Integrado' : 'Integrated Simulation Environment'}
          </div>
        </div>
      </footer>
    </div>
  );
}
