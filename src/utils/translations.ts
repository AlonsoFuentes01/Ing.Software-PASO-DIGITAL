export interface TranslationDict {
  // Login Page
  loginTitle: string;
  loginSubtitle: string;
  loginDesc: string;
  loginRoleLabel: string;
  loginDriverRole: string;
  loginDriverRoleDesc: string;
  loginOfficerRole: string;
  loginOfficerRoleDesc: string;
  loginCredentialsHelp: string;
  loginBtnSubmit: string;
  loginBtnAutoDriver: string;
  loginBtnAutoOfficer: string;
  loginRunPlaceholder: string;
  loginPassPlaceholder: string;
  loginErrorInvalid: string;
  loginRUTRequired: string;
  loginPasswordRequired: string;

  // Header & Navigation
  govTitle: string;
  appTitle: string;
  controlLocation: string;
  dateLabel: string;
  tabExit: string;
  tabAdmission: string;
  tabConsultation: string;
  tabSupport: string;
  logoutBtn: string;
  loggedInAs: string;
  driverUser: string;
  officerUser: string;

  // General App Labels
  particular: string;
  diplomatic: string;
  extranjero: string;
  vigente: string;
  vencido: string;
  patente: string;
  conductor: string;
  marcaModelo: string;
  folio: string;
  pasoIngreso: string;
  fechaCruce: string;

  // Salida Temporal Tab
  exitTitle: string;
  exitDesc: string;
  exitFormTitle: string;
  exitRunConductor: string;
  exitRunHelp: string;
  exitPatenteCL: string;
  exitPatenteCLHelp: string;
  exitMarcaModelo: string;
  exitFechaRetorno: string;
  exitVencimientoPlazo: string;
  exitDiasPlazo: string;
  exitBtnRegister: string;
  exitBtnClear: string;
  exitSuccessTitle: string;
  exitSuccessDesc: string;
  exitSuccessBtn: string;
  exitReceiptTitle: string;
  exitReceiptSub: string;
  exitReceiptDisclaimer: string;
  exitReceiptValid: string;
  exitPrintBtn: string;
  exitDownloadBtn: string;
  exitPlaceholderTitle: string;
  exitPlaceholderDesc: string;

  // Admision Temporal Tab
  admTitle: string;
  admDesc: string;
  admFormTitle: string;
  admPatenteAR: string;
  admMarcaModelo: string;
  admDocArgentina: string;
  admDocArgentinaHelp: string;
  admFechaVencDoc: string;
  admRejectedTitle: string;
  admRejectedDesc: string;
  admBtnRegister: string;
  admSuccessTitle: string;
  admSuccessDesc: string;
  admSuccessBtn: string;
  admReceiptTitle: string;
  admReceiptSub: string;
  admPlaceholderTitle: string;
  admPlaceholderDesc: string;

  // Consulta Estado Tab
  conTitle: string;
  conDesc: string;
  conStatTotal: string;
  conStatActive: string;
  conStatExpired: string;
  conStatFlota: string;
  conSearchPlaceholder: string;
  conFilterOrigin: string;
  conFilterAll: string;
  conFilterChile: string;
  conFilterArg: string;
  conFilterStatus: string;
  conActiveFilters: string;
  conResetFilters: string;
  conTablePlate: string;
  conTableVeh: string;
  conTableDate: string;
  conTableExpiry: string;
  conTableStatus: string;
  conDetailTitle: string;
  conDetailFicha: string;
  conDetailFolio: string;
  conDetailDelete: string;
  conDetailClose: string;
  conPlaceholderTitle: string;
  conPlaceholderDesc: string;

  // Support / Ayuda Tab
  supTitle: string;
  supDesc: string;
  supFaqTitle: string;
  supFaqSubtitle: string;
  supChatTitle: string;
  supChatPlaceholder: string;
  supChatSend: string;
  supTicketTitle: string;
  supTicketSubtitle: string;
  supTicketName: string;
  supTicketEmail: string;
  supTicketTopic: string;
  supTicketDesc: string;
  supTicketBtn: string;
  supTicketSuccess: string;
  supTicketList: string;
  supTicketStatusOpen: string;
  supTicketStatusAnswered: string;
}

export const translations: { es: TranslationDict; en: TranslationDict } = {
  es: {
    // Login Page
    loginTitle: "Ingreso al Sistema PasoDigital",
    loginSubtitle: "Servicio Nacional de Aduanas",
    loginDesc: "Sistema integrado para el control de admisión temporal y salida de vehículos en el paso fronterizo Los Libertadores.",
    loginRoleLabel: "Seleccione su perfil de acceso para continuar",
    loginDriverRole: "Conductor / Particular",
    loginDriverRoleDesc: "RUT chileno. Registro de salida temporal y acceso a soporte de ayuda.",
    loginOfficerRole: "Funcionario de Aduana",
    loginOfficerRoleDesc: "Acceso total: Salidas, Admisión de vehículos extranjeros y Fiscalización.",
    loginCredentialsHelp: "Credenciales de Simulación Integrada",
    loginBtnSubmit: "Iniciar Sesión",
    loginBtnAutoDriver: "Acceso Rápido: Conductor",
    loginBtnAutoOfficer: "Acceso Rápido: Funcionario",
    loginRunPlaceholder: "Ej: 12.345.678-9 o funcionario@aduana.cl",
    loginPassPlaceholder: "Contraseña",
    loginErrorInvalid: "Credenciales inválidas. Use los accesos rápidos de simulación.",
    loginRUTRequired: "El RUN o usuario es requerido.",
    loginPasswordRequired: "La contraseña es requerida.",

    // Header & Navigation
    govTitle: "Gobierno de Chile",
    appTitle: "PasoDigital",
    controlLocation: "Los Libertadores",
    dateLabel: "Fecha y Hora del Sistema",
    tabExit: "Salida Temporal (CL)",
    tabAdmission: "Admisión Temporal (AR)",
    tabConsultation: "Panel de Fiscalización",
    tabSupport: "Soporte y Ayuda",
    logoutBtn: "Cerrar Sesión",
    loggedInAs: "Usuario conectado",
    driverUser: "Conductor Particular",
    officerUser: "Funcionario de Aduanas",

    // General App Labels
    particular: "Particular",
    diplomatic: "Diplomático",
    extranjero: "Extranjero",
    vigente: "Vigente",
    vencido: "Vencido",
    patente: "Patente",
    conductor: "Conductor",
    marcaModelo: "Marca / Modelo",
    folio: "Folio",
    pasoIngreso: "Paso de Ingreso",
    fechaCruce: "Fecha de Cruce",

    // Salida Temporal Tab
    exitTitle: "Registro de Salida Temporal de Vehículos Chilenos",
    exitDesc: "Módulo para conductores de vehículos particulares y diplomáticos chilenos que salen del territorio nacional hacia Argentina por el paso Los Libertadores. Emite el salvoconducto oficial de aduana.",
    exitFormTitle: "Declaración de Salida Temporal de Vehículo",
    exitRunConductor: "RUN / RUT del Conductor",
    exitRunHelp: "Debe coincidir con la cédula de identidad nacional chilena.",
    exitPatenteCL: "Patente del Vehículo Chileno",
    exitPatenteCLHelp: "Formato oficial chileno. Ej: ABCD12 o AB1234 o CD8821.",
    exitMarcaModelo: "Marca y Modelo del Vehículo",
    exitFechaRetorno: "Fecha Estimada de Retorno",
    exitVencimientoPlazo: "Fecha de Vencimiento del Plazo Legal",
    exitDiasPlazo: "Plazo Otorgado por Ley",
    exitBtnRegister: "Registrar Salida y Generar Salvoconducto",
    exitBtnClear: "Limpiar Formulario",
    exitSuccessTitle: "¡Registro de Salida Exitoso!",
    exitSuccessDesc: "Se ha registrado el cruce y emitido el documento de salida oficial. Su vehículo cuenta con un plazo legal de retorno al país.",
    exitSuccessBtn: "Registrar Otra Salida",
    exitReceiptTitle: "SALVOCONDUCTO ADUANERO DE SALIDA TEMPORAL",
    exitReceiptSub: "SERVICIO NACIONAL DE ADUANAS • REPUBLICA DE CHILE",
    exitReceiptDisclaimer: "Este salvoconducto autoriza la salida temporal del vehículo del territorio nacional chileno por el período legal estipulado. Al retornar, debe presentarlo ante el funcionario de aduanas.",
    exitReceiptValid: "Válido para circular en el extranjero",
    exitPrintBtn: "Imprimir Documento",
    exitDownloadBtn: "Guardar PDF",
    exitPlaceholderTitle: "Vista Previa de Salvoconducto",
    exitPlaceholderDesc: "Complete los datos del vehículo chileno a la izquierda y presione \"Registrar Salida\" para emitir la autorización oficial de viaje.",

    // Admision Temporal Tab
    admTitle: "Registro de Admisión Temporal (Aduana)",
    admDesc: "Módulo de uso exclusivo para funcionarios de aduana chilena. Permite procesar y autorizar la admisión temporal de vehículos particulares argentinos que ingresan al país por el paso fronterizo Los Libertadores.",
    admFormTitle: "Control de Admisión y Validación de Documentos",
    admPatenteAR: "Patente Vehículo Extranjero",
    admMarcaModelo: "Marca y Modelo del Vehículo",
    admDocArgentina: "N° de Documento de Aduana Argentina",
    admDocArgentinaHelp: "Comprobante de ingreso argentino (DGA).",
    admFechaVencDoc: "Fecha de Vencimiento de Documento Argentino",
    admRejectedTitle: "RECHAZO DE ADMISIÓN ADUANERA",
    admRejectedDesc: "El vehículo tiene la documentación argentina vencida. Por disposición legal chilena, se debe denegar el acceso por el complejo fronterizo.",
    admBtnRegister: "Registrar Cruce e Ingreso Temporal",
    admSuccessTitle: "¡Admisión Autorizada e Ingreso Registrado!",
    admSuccessDesc: "Se ha registrado el cruce oficial del vehículo extranjero. Se le ha otorgado una estadía temporal máxima de 90 días prorrogables.",
    admSuccessBtn: "Registrar Otro Ingreso",
    admReceiptTitle: "COMPROBANTE DE ADMISIÓN TEMPORAL EXTRANJERA",
    admReceiptSub: "ADUANA DE CHILE • ADMISIÓN DE VEHÍCULO TURISTA",
    admPlaceholderTitle: "Vista Previa de Comprobante",
    admPlaceholderDesc: "Ingrese los datos de admisión del vehículo argentino a la izquierda y presione \"Registrar Cruce\" para emitir el comprobante de autorización aduanera.",

    // Consulta Estado Tab
    conTitle: "Panel de Consulta de Estado",
    conDesc: "Módulo de fiscalización y búsqueda en tiempo real para funcionarios de la aduana de Chile. Permite monitorear plazos de estadía, alertas de vencimiento e historial de cruces.",
    conStatTotal: "Registros Totales",
    conStatActive: "Estadías Vigentes",
    conStatExpired: "Alertas Vencidas",
    conStatFlota: "Distribución de Flota",
    conSearchPlaceholder: "Buscar por patente, marca/modelo o Folio...",
    conFilterOrigin: "Origen",
    conFilterAll: "Todos",
    conFilterChile: "Chile (Salidas)",
    conFilterArg: "Argentina (Admisiones)",
    conFilterStatus: "Estado",
    conActiveFilters: "Filtros activos. Mostrando",
    conResetFilters: "Restablecer Filtros",
    conTablePlate: "Patente / Origen",
    conTableVeh: "Vehículo",
    conTableDate: "Fecha Cruce",
    conTableExpiry: "Vencimiento",
    conTableStatus: "Estado / Plazo",
    conDetailTitle: "Detalle del Registro",
    conDetailFicha: "Ficha de Control",
    conDetailFolio: "FOLIO REGISTRO",
    conDetailDelete: "Eliminar",
    conDetailClose: "Cerrar",
    conPlaceholderTitle: "Detalles de Fiscalización",
    conPlaceholderDesc: "Seleccione cualquier vehículo en la tabla de la izquierda para desplegar su ficha de control, plazos restantes y protocolo de aduanas.",

    // Support / Ayuda Tab
    supTitle: "Soporte de Ayuda e Información al Usuario",
    supDesc: "Acceda a la base de conocimientos, consulte dudas con nuestro Asistente de Aduana en tiempo real, o envíe una solicitud de ayuda directa a la mesa de soporte del Paso Los Libertadores.",
    supFaqTitle: "Preguntas Frecuentes (FAQs)",
    supFaqSubtitle: "Encuentre respuestas rápidas sobre los trámites oficiales del cruce fronterizo.",
    supChatTitle: "Asistente Virtual de Aduana (Ayuda 24/7)",
    supChatPlaceholder: "Escriba su consulta... (ej: ¿Cuáles son los requisitos de salida?)",
    supChatSend: "Enviar",
    supTicketTitle: "Enviar Solicitud de Ayuda / Soporte Técnico",
    supTicketSubtitle: "Cree un ticket si tiene inconvenientes con la validación de su RUT, patente, o requiere prórroga legal.",
    supTicketName: "Nombre Completo",
    supTicketEmail: "Correo Electrónico",
    supTicketTopic: "Motivo de la Solicitud",
    supTicketDesc: "Descripción del Problema",
    supTicketBtn: "Enviar Ticket a Soporte",
    supTicketSuccess: "¡Ticket enviado con éxito! Un analista de la Aduana del Paso Los Libertadores revisará su caso a la brevedad.",
    supTicketList: "Mis Solicitudes / Historial de Tickets",
    supTicketStatusOpen: "En Revisión",
    supTicketStatusAnswered: "Respondido"
  },
  en: {
    // Login Page
    loginTitle: "Access to PasoDigital System",
    loginSubtitle: "National Customs Service of Chile",
    loginDesc: "Integrated system for controlling temporary admission and vehicle exits at the Los Libertadores border crossing.",
    loginRoleLabel: "Select your access profile to continue",
    loginDriverRole: "Driver / Citizen",
    loginDriverRoleDesc: "Chilean RUT/ID. Register temporary vehicle exits and access user support guides.",
    loginOfficerRole: "Customs Officer",
    loginOfficerRoleDesc: "Full access: Exits, Admission of foreign vehicles, and Border Enforcement.",
    loginCredentialsHelp: "Integrated Simulation Credentials",
    loginBtnSubmit: "Sign In",
    loginBtnAutoDriver: "Quick Access: Driver",
    loginBtnAutoOfficer: "Quick Access: Customs Officer",
    loginRunPlaceholder: "E.g. 12.345.678-9 or officer@aduana.cl",
    loginPassPlaceholder: "Password",
    loginErrorInvalid: "Invalid credentials. Use the quick simulation access buttons.",
    loginRUTRequired: "RUT or username is required.",
    loginPasswordRequired: "Password is required.",

    // Header & Navigation
    govTitle: "Government of Chile",
    appTitle: "PasoDigital",
    controlLocation: "Los Libertadores",
    dateLabel: "System Date and Time",
    tabExit: "Temporary Exit (CL)",
    tabAdmission: "Temporary Admission (AR)",
    tabConsultation: "Enforcement Panel",
    tabSupport: "Support & Help",
    logoutBtn: "Log Out",
    loggedInAs: "Connected User",
    driverUser: "Private Driver",
    officerUser: "Customs Officer",

    // General App Labels
    particular: "Private",
    diplomatic: "Diplomatic",
    extranjero: "Foreign",
    vigente: "Valid",
    vencido: "Expired",
    patente: "License Plate",
    conductor: "Driver",
    marcaModelo: "Make / Model",
    folio: "Folio ID",
    pasoIngreso: "Port of Entry",
    fechaCruce: "Crossing Date",

    // Salida Temporal Tab
    exitTitle: "Temporary Exit Registry of Chilean Vehicles",
    exitDesc: "Module for drivers of private and diplomatic Chilean vehicles exiting the national territory to Argentina via Los Libertadores. Issues the official customs safe-conduct document.",
    exitFormTitle: "Temporary Vehicle Exit Declaration",
    exitRunConductor: "Driver's RUN / RUT ID",
    exitRunHelp: "Must match the Chilean national identity card.",
    exitPatenteCL: "Chilean Vehicle License Plate",
    exitPatenteCLHelp: "Official Chilean format. E.g., ABCD12, AB1234, or CD8821.",
    exitMarcaModelo: "Vehicle Make and Model",
    exitFechaRetorno: "Estimated Return Date",
    exitVencimientoPlazo: "Legal Expiry Date",
    exitDiasPlazo: "Legally Granted Stay",
    exitBtnRegister: "Register Exit & Issue Safe-Conduct",
    exitBtnClear: "Clear Form",
    exitSuccessTitle: "Exit Registered Successfully!",
    exitSuccessDesc: "The border crossing has been recorded and the official exit permit has been issued. Your vehicle has a legal deadline to return to Chile.",
    exitSuccessBtn: "Register Another Exit",
    exitReceiptTitle: "CUSTOMS SAFE-CONDUCT FOR TEMPORARY EXIT",
    exitReceiptSub: "NATIONAL CUSTOMS SERVICE • REPUBLIC OF CHILE",
    exitReceiptDisclaimer: "This safe-conduct authorizes the temporary exit of the vehicle from Chilean national territory for the stipulated legal period. Upon returning, you must present this to the customs officer.",
    exitReceiptValid: "Valid for driving abroad",
    exitPrintBtn: "Print Document",
    exitDownloadBtn: "Save PDF",
    exitPlaceholderTitle: "Safe-Conduct Preview",
    exitPlaceholderDesc: "Fill in the Chilean vehicle data on the left and click \"Register Exit\" to issue the official travel authorization.",

    // Admision Temporal Tab
    admTitle: "Temporary Admission Registry (Customs)",
    admDesc: "Module for exclusive use by Chilean customs officers. Allows processing and authorizing the temporary admission of Argentine private vehicles entering the country via the Los Libertadores border crossing.",
    admFormTitle: "Admission Control & Document Validation",
    admPatenteAR: "Foreign License Plate",
    admMarcaModelo: "Vehicle Make and Model",
    admDocArgentina: "Argentine Customs Document No.",
    admDocArgentinaHelp: "Argentine Customs entry voucher (DGA).",
    admFechaVencDoc: "Argentine Document Expiration Date",
    admRejectedTitle: "CUSTOMS ADMISSION REJECTED",
    admRejectedDesc: "The vehicle has an expired Argentine document. By Chilean legal order, entry through this border complex must be denied.",
    admBtnRegister: "Register Crossing & Temporary Entry",
    admSuccessTitle: "Admission Authorized & Entry Registered!",
    admSuccessDesc: "The official crossing of the foreign vehicle has been recorded. It has been granted a maximum temporary stay of 90 days (renewable).",
    admSuccessBtn: "Register Another Entry",
    admReceiptTitle: "TEMPORARY FOREIGN ADMISSION RECEIPT",
    admReceiptSub: "CHILE CUSTOMS • TOURIST VEHICLE ADMISSION",
    admPlaceholderTitle: "Admission Receipt Preview",
    admPlaceholderDesc: "Enter the admission data of the Argentine vehicle on the left and click \"Register Crossing\" to issue the customs authorization voucher.",

    // Consulta Estado Tab
    conTitle: "Status Query Panel",
    conDesc: "Real-time monitoring and search module for Chilean customs officers. Allows tracking stay durations, expiration alerts, and crossing history.",
    conStatTotal: "Total Records",
    conStatActive: "Active Stays",
    conStatExpired: "Expired Alerts",
    conStatFlota: "Fleet Distribution",
    conSearchPlaceholder: "Search by plate, make/model or Folio...",
    conFilterOrigin: "Origin",
    conFilterAll: "All",
    conFilterChile: "Chile (Exits)",
    conFilterArg: "Argentina (Admissions)",
    conFilterStatus: "Status",
    conActiveFilters: "Active filters. Showing",
    conResetFilters: "Reset Filters",
    conTablePlate: "Plate / Origin",
    conTableVeh: "Vehicle",
    conTableDate: "Crossing Date",
    conTableExpiry: "Expiry Date",
    conTableStatus: "Status / Days",
    conDetailTitle: "Record Details",
    conDetailFicha: "Control File",
    conDetailFolio: "REGISTRY FOLIO",
    conDetailDelete: "Delete",
    conDetailClose: "Close",
    conPlaceholderTitle: "Enforcement Details",
    conPlaceholderDesc: "Select any vehicle on the table to the left to display its control file, remaining stay duration, and customs protocol details.",

    // Support / Ayuda Tab
    supTitle: "User Help & Information Support Desk",
    supDesc: "Access the knowledge base, chat with our Customs Virtual Assistant in real-time, or submit a support request ticket directly to the Los Libertadores Border Complex help desk.",
    supFaqTitle: "Frequently Asked Questions (FAQs)",
    supFaqSubtitle: "Find quick answers regarding official border crossing procedures.",
    supChatTitle: "Virtual Customs Assistant (24/7 Help)",
    supChatPlaceholder: "Type your question... (e.g., What are the exit requirements?)",
    supChatSend: "Send",
    supTicketTitle: "Submit a Help Request / Technical Ticket",
    supTicketSubtitle: "Submit a support ticket if you have issues validating your RUT, license plate, or if you require a legal extension of stay.",
    supTicketName: "Full Name",
    supTicketEmail: "Email Address",
    supTicketTopic: "Reason for Request",
    supTicketDesc: "Description of Issue",
    supTicketBtn: "Submit Support Ticket",
    supTicketSuccess: "Ticket submitted successfully! A Customs analyst at the Los Libertadores Border Complex will review your case as soon as possible.",
    supTicketList: "My Tickets / Request History",
    supTicketStatusOpen: "In Review",
    supTicketStatusAnswered: "Answered"
  }
};
