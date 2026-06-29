import React, { useState, useEffect } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Send, MessageSquare, Ticket, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { TranslationDict } from '../utils/translations';

interface SoporteAyudaProps {
  language: 'es' | 'en';
  t: TranslationDict;
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

interface SupportTicket {
  id: string;
  name: string;
  email: string;
  topic: string;
  desc: string;
  status: 'Open' | 'Answered';
  date: string;
  reply?: string;
}

export default function SoporteAyuda({ language, t }: SoporteAyudaProps) {
  // Accordion state
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);

  // Chat state
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: language === 'es' 
        ? '¡Hola! Soy el Asistente Virtual del Paso Los Libertadores. ¿En qué puedo ayudarte hoy con el trámite de Salida o Admisión Temporal de tu vehículo?' 
        : 'Hello! I am the Los Libertadores Virtual Assistant. How can I help you today with your temporary vehicle exit or admission procedure?',
      timestamp: '19:41'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Ticket Form state
  const [ticketName, setTicketName] = useState('');
  const [ticketEmail, setTicketEmail] = useState('');
  const [ticketTopic, setTicketTopic] = useState('Prórroga de Plazo / Stay Extension');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState(false);

  // Tickets Database state (persisted locally)
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('pasodigital_tickets');
    if (stored) {
      try {
        setTickets(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Seed initial mock tickets
      const initial: SupportTicket[] = [
        {
          id: 'TK-1082',
          name: 'Claudio Garrido',
          email: 'claudio@gmail.com',
          topic: 'Prórroga de Plazo / Stay Extension',
          desc: 'Necesito solicitar una prórroga por motivos de fuerza mayor. Mi vehículo argentino tiene plazo hasta la próxima semana pero me encuentro hospitalizado.',
          status: 'Answered',
          date: '2026-06-20',
          reply: 'Estimado Claudio, se ha pre-aprobado su prórroga médica de admisión por 30 días adicionales. Favor presentarse con el certificado médico correspondiente en la oficina aduanera de Los Andes.'
        }
      ];
      setTickets(initial);
      localStorage.setItem('pasodigital_tickets', JSON.stringify(initial));
    }
  }, []);

  // Sync tickets to localStorage
  const saveTickets = (updated: SupportTicket[]) => {
    setTickets(updated);
    localStorage.setItem('pasodigital_tickets', JSON.stringify(updated));
  };

  const faqs = [
    {
      id: 1,
      q_es: "¿Cuál es el plazo máximo autorizado para la salida temporal de un vehículo chileno?",
      q_en: "What is the maximum authorized period for the temporary exit of a Chilean vehicle?",
      a_es: "Por ley general, el plazo máximo para que un vehículo particular chileno permanezca fuera del territorio nacional es de 180 días. En el caso de vehículos diplomáticos, este plazo se reduce a 90 días, salvo autorizaciones especiales.",
      a_en: "By general law, the maximum period for a Chilean private vehicle to remain outside the national territory is 180 days. For diplomatic vehicles, this period is reduced to 90 days, unless special authorizations apply."
    },
    {
      id: 2,
      q_es: "¿Qué ocurre si mi vehículo extranjero excede el plazo de permanencia en Chile?",
      q_en: "What happens if my foreign vehicle exceeds the stay limit in Chile?",
      a_es: "Si un vehículo extranjero excede el plazo legal otorgado (admisión temporal de 90 días), incurre en una infracción aduanera. El vehículo queda retenido legalmente en el panel de fiscalización como 'Vencido' y se aplican multas proporcionales por cada día de retraso antes de permitir su salida del país.",
      a_en: "If a foreign vehicle exceeds the legally granted period (temporary admission of 90 days), it commits a customs violation. The vehicle is legally flagged in the enforcement panel as 'Expired' and proportional fines apply for each day of overstay before its departure is permitted."
    },
    {
      id: 3,
      q_es: "¿Cuáles son los requisitos de documentación para ingresar a Chile con patente argentina?",
      q_en: "What are the documentation requirements to enter Chile with an Argentine plate?",
      a_es: "Debe presentar la cédula verde o azul del vehículo, seguro obligatorio internacional (SOAPEX o seguro Mercosur), documento nacional de identidad argentino, y el Comprobante de Admisión emitido por la aduana argentina (DGA). Todos los documentos deben estar vigentes.",
      a_en: "You must present the vehicle's green or blue card, international compulsory insurance (SOAPEX or Mercosur insurance), Argentine national ID, and the Admission Voucher issued by the Argentine customs (DGA). All documents must be current and valid."
    },
    {
      id: 4,
      q_es: "¿Cómo puedo solicitar una prórroga de mi estadía en Chile?",
      q_en: "How can I request an extension of my stay in Chile?",
      a_es: "Las solicitudes de prórrogas deben realizarse de forma presencial o a través del canal de soporte oficial, presentando la justificación correspondiente (caso fortuito, razones de salud o fuerza mayor acreditada) antes del vencimiento del plazo original de 90 días.",
      a_en: "Extension requests must be submitted in person or via the official support channel, presenting the appropriate justification (accidental circumstances, health reasons, or proven force majeure) before the expiration of the original 90-day period."
    }
  ];

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: chatInput,
      timestamp: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    // Simulated customs virtual assistant intelligence logic
    setTimeout(() => {
      let replyText = '';
      const query = userMsg.text.toLowerCase();

      if (language === 'es') {
        if (query.includes('plazo') || query.includes('dias') || query.includes('días')) {
          replyText = 'El plazo legal general para vehículos chilenos que salen temporalmente es de 180 días (90 para diplomáticos). Para vehículos extranjeros (argentinos) que ingresan, la admisión es de 90 días prorrogables.';
        } else if (query.includes('vencido') || query.includes('vence') || query.includes('vencimiento') || query.includes('multa')) {
          replyText = 'Si el plazo de admisión temporal de un vehículo expira, el sistema de aduanas emitirá una alerta de rechazo. Esto prohíbe el tránsito del vehículo y puede generar multas administrativas equivalentes a un porcentaje de los impuestos de internación.';
        } else if (query.includes('requisito') || query.includes('documento') || query.includes('papel')) {
          replyText = 'Para vehículos chilenos requieres: RUT del conductor, patente registrada y padrón. Para vehículos argentinos requieres: Cédula verde/azul, seguro Mercosur, DNI del propietario y el documento DGA vigente.';
        } else if (query.includes('hora') || query.includes('horario') || query.includes('abierto') || query.includes('clima')) {
          replyText = 'El Paso Fronterizo Los Libertadores opera las 24 horas durante el período estival (verano). En invierno, el horario está sujeto a las condiciones climáticas y acumulación de nieve. Recomendamos revisar las cuentas oficiales de la aduana antes de viajar.';
        } else {
          replyText = 'Entiendo su consulta. Los Libertadores cuenta con un estricto protocolo de fiscalización. Si tiene dudas puntuales sobre una patente, puede utilizar nuestro Panel de Consulta de Estado o registrar un ticket de soporte a la derecha.';
        }
      } else {
        if (query.includes('deadline') || query.includes('days') || query.includes('period') || query.includes('time')) {
          replyText = 'The general legal period for Chilean vehicles exiting temporarily is 180 days (90 for diplomats). For foreign (Argentine) vehicles entering Chile, the admission limit is 90 renewable days.';
        } else if (query.includes('expired') || query.includes('expiry') || query.includes('fine') || query.includes('penalty')) {
          replyText = 'If the temporary admission period of a vehicle expires, the customs system will trigger an enforcement alert. This prohibits the vehicle from circulating and can lead to administrative fines.';
        } else if (query.includes('requirement') || query.includes('document') || query.includes('paper')) {
          replyText = 'For Chilean vehicles, you need: driver RUT ID, registered license plate, and logbook. For Argentine vehicles: green/blue card, Mercosur insurance, owner ID card, and valid Argentine Customs (DGA) documentation.';
        } else if (query.includes('hour') || query.includes('open') || query.includes('time') || query.includes('weather')) {
          replyText = 'The Los Libertadores Border Crossing operates 24 hours a day during the summer. In winter, hours are highly dependent on snow and weather conditions. Please check official customs accounts before departing.';
        } else {
          replyText = 'I understand your query. Los Libertadores runs on strict digital inspection protocols. If you have specific questions about a plate, please use our Enforcement Panel or register a support ticket to the right.';
        }
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 900);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketName || !ticketEmail || !ticketDesc) return;

    const newTicket: SupportTicket = {
      id: `TK-${Math.floor(1000 + Math.random() * 9000)}`,
      name: ticketName,
      email: ticketEmail,
      topic: ticketTopic,
      desc: ticketDesc,
      status: 'Open',
      date: new Date().toISOString().split('T')[0]
    };

    const updated = [newTicket, ...tickets];
    saveTickets(updated);

    setTicketName('');
    setTicketEmail('');
    setTicketDesc('');
    setTicketSuccess(true);

    setTimeout(() => {
      setTicketSuccess(false);
    }, 5000);
  };

  return (
    <div className="space-y-6" id="soporte-ayuda-container">
      
      {/* Title Card */}
      <div className="bg-slate-900 text-white rounded-none p-6 border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
        <h3 className="text-xl font-bold font-display uppercase tracking-wider flex items-center gap-2">
          <HelpCircle className="text-red-500 w-6 h-6 shrink-0" />
          {t.supTitle}
        </h3>
        <p className="text-slate-300 text-xs mt-1.5 max-w-3xl font-sans">
          {t.supDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* FAQs & Chatbot Column */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* FAQ Accordion block */}
          <div className="bg-white p-6 border-2 border-slate-900 rounded-none shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <h4 className="text-sm font-bold font-display uppercase tracking-wider text-slate-900 border-b-2 border-slate-100 pb-2.5 mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#003399]" />
              {t.supFaqTitle}
            </h4>
            <p className="text-xs text-slate-500 mb-4 font-sans leading-relaxed">
              {t.supFaqSubtitle}
            </p>

            <div className="space-y-3">
              {faqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                const question = language === 'es' ? faq.q_es : faq.q_en;
                const answer = language === 'es' ? faq.a_es : faq.a_en;

                return (
                  <div key={faq.id} className="border-2 border-slate-800 rounded-none overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                      className="w-full flex items-center justify-between p-3.5 text-left font-bold text-xs bg-slate-50 hover:bg-slate-100 transition-colors focus:outline-none"
                    >
                      <span className="text-slate-900 font-sans">{question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 shrink-0 text-[#003399]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 shrink-0 text-slate-500" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="p-4 bg-white border-t border-slate-200 text-xs text-slate-600 font-sans leading-relaxed">
                        {answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Virtual Assistant chatbot block */}
          <div className="bg-white border-2 border-slate-900 rounded-none shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] overflow-hidden flex flex-col h-[400px]">
            {/* Bot Header */}
            <div className="bg-[#003399] p-3 text-white border-b-2 border-slate-900 flex items-center gap-2 shrink-0">
              <MessageSquare className="w-5 h-5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider font-display">{t.supChatTitle}</h4>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[9px] font-bold text-blue-100 font-mono">ONLINE • BOT ADUANAS</span>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs font-sans">
              {messages.map((msg) => {
                const isBot = msg.sender === 'bot';
                return (
                  <div key={msg.id} className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[85%] p-3 border-2 border-slate-900 rounded-none shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] ${
                      isBot ? 'bg-white text-slate-800' : 'bg-[#E1F5FE] text-slate-900'
                    }`}>
                      <p className="leading-relaxed">{msg.text}</p>
                      <span className="block text-[8px] text-slate-400 font-mono mt-1 text-right">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="p-3 bg-white border-2 border-slate-900 rounded-none shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat input form */}
            <form onSubmit={handleSendChat} className="p-3 bg-white border-t-2 border-slate-900 flex gap-2 shrink-0">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={t.supChatPlaceholder}
                className="flex-1 border-2 border-slate-800 px-3 py-2 text-xs font-sans focus:outline-none focus:border-[#003399] bg-slate-50"
              />
              <button
                type="submit"
                className="bg-[#003399] hover:bg-blue-800 text-white font-bold px-4 py-2 border-2 border-slate-950 text-xs font-display uppercase tracking-widest transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Ticket Submission and Ticket Log Column */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Submit ticket form */}
          <div className="bg-white p-6 border-2 border-slate-900 rounded-none shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <h4 className="text-sm font-bold font-display uppercase tracking-wider text-slate-900 border-b-2 border-slate-100 pb-2.5 mb-4 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-[#C8102E]" />
              {t.supTicketTitle}
            </h4>
            <p className="text-[11px] text-slate-500 mb-4 font-sans leading-relaxed">
              {t.supTicketSubtitle}
            </p>

            {ticketSuccess && (
              <div className="mb-4 bg-emerald-50 border-2 border-emerald-500 p-3 text-xs text-emerald-800 font-bold font-sans">
                ✓ {t.supTicketSuccess}
              </div>
            )}

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t.supTicketName}
                </label>
                <input
                  type="text"
                  required
                  value={ticketName}
                  onChange={(e) => setTicketName(e.target.value)}
                  placeholder="Ej: Claudio Garrido"
                  className="block w-full px-3 py-2 border-2 border-slate-800 focus:outline-none focus:border-[#003399] bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t.supTicketEmail}
                </label>
                <input
                  type="email"
                  required
                  value={ticketEmail}
                  onChange={(e) => setTicketEmail(e.target.value)}
                  placeholder="Ej: claudio@gmail.com"
                  className="block w-full px-3 py-2 border-2 border-slate-800 focus:outline-none focus:border-[#003399] bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t.supTicketTopic}
                </label>
                <select
                  value={ticketTopic}
                  onChange={(e) => setTicketTopic(e.target.value)}
                  className="block w-full px-3 py-2 border-2 border-slate-800 focus:outline-none focus:border-[#003399] bg-slate-50"
                >
                  <option value="Prórroga de Plazo / Stay Extension">Prórroga de Plazo / Stay Extension</option>
                  <option value="Error de Validación de Patente / License Plate Validation Error">Error de Validación de Patente / License Plate Validation Error</option>
                  <option value="Problemas de RUT o Documentación / RUT or ID Document Issues">Problemas de RUT o Documentación / RUT or ID Document Issues</option>
                  <option value="Consulta sobre Cierre de Paso / Border Closure Inquiry">Consulta sobre Cierre de Paso / Border Closure Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t.supTicketDesc}
                </label>
                <textarea
                  required
                  rows={4}
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  placeholder="Escriba aquí los detalles..."
                  className="block w-full px-3 py-2 border-2 border-slate-800 focus:outline-none focus:border-[#003399] bg-slate-50 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#C8102E] hover:bg-red-800 text-white font-bold font-display uppercase tracking-widest py-2.5 px-4 border-2 border-slate-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all flex items-center justify-center gap-2"
              >
                {t.supTicketBtn}
              </button>
            </form>
          </div>

          {/* Ticket List Log */}
          <div className="bg-white p-6 border-2 border-slate-900 rounded-none shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <h4 className="text-sm font-bold font-display uppercase tracking-wider text-slate-900 border-b-2 border-slate-100 pb-2.5 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-700" />
              {t.supTicketList}
            </h4>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {tickets.length === 0 ? (
                <p className="text-xs text-slate-400 font-sans italic text-center py-4">
                  {language === 'es' ? 'No tiene tickets de soporte registrados.' : 'You have no registered support tickets.'}
                </p>
              ) : (
                tickets.map((tkt) => (
                  <div key={tkt.id} className="border-2 border-slate-800 p-4 bg-slate-50 relative">
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="font-mono text-[10px] font-black text-[#003399]">
                        {tkt.id}
                      </span>
                      <span className={`px-2 py-0.5 text-[8px] font-mono font-bold uppercase border-2 ${
                        tkt.status === 'Answered' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-500' 
                          : 'bg-amber-50 text-amber-700 border-amber-500'
                      }`}>
                        {tkt.status === 'Answered' ? t.supTicketStatusAnswered : t.supTicketStatusOpen}
                      </span>
                    </div>

                    <h5 className="font-bold text-xs text-slate-900 font-sans mb-1">{tkt.topic}</h5>
                    <p className="text-[10px] text-slate-600 font-sans mb-2 leading-relaxed">{tkt.desc}</p>
                    <span className="block text-[8px] text-slate-400 font-mono mb-2">{tkt.date}</span>

                    {tkt.reply && (
                      <div className="mt-3 bg-white p-3 border-l-4 border-emerald-500 text-[10px] text-slate-700 font-sans leading-relaxed">
                        <strong className="text-emerald-700 block font-bold mb-1">✓ RESPUESTA ADUANA:</strong>
                        {tkt.reply}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
