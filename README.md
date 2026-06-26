# Ing.Software-PASO-DIGITAL
Repositorio para la tercera prueba

1: En la primera version se subio una version prototipo de la interfaz de salida del pais hacia argentina
Promp:Crea una app web para el sistema PasoDigital del Servicio Nacional de Aduanas de Chile (SNA), enfocada en la salida y admisión temporal de vehículos en el paso fronterizo Los Libertadores.
Pantalla 1 — Registro de salida temporal (conductor): el conductor ingresa su RUN, patente del vehículo, marca/modelo y fecha estimada de retorno. El sistema detecta automáticamente si la patente corresponde a un vehículo diplomático (placas C.D., CC, O.I., P.A.T.) y fija el plazo en 90 días; para vehículos particulares fija 180 días. Al confirmar, genera un comprobante con código QR que muestra patente, plazo de vigencia y fecha de vencimiento.
Pantalla 2 — Registro de admisión temporal desde Argentina (funcionario de aduana): el funcionario ingresa la patente del vehículo extranjero y el número del documento emitido por la aduana argentina. El sistema valida que el documento no esté vencido, registra el cruce con fecha, hora y paso fronterizo, y emite un comprobante. Si el documento está vencido, muestra el mensaje "Documento vencido — no se autoriza el ingreso".
Pantalla 3 — Panel de consulta de estado (funcionario de aduana): el funcionario busca cualquier vehículo por patente y ve: tipo de vehículo, fecha de salida, plazo de vigencia, días restantes y estado con indicador visual en verde para "Vigente" y rojo para "Vencido".**
Usa colores institucionales del SNA (azul ,rojo y blanco), textos en español, diseño simple e intuitivo con ayudas contextuales en cada campo

2: En la segunda versión se agrego un inicio de sesión, un cambio de idioma para facilitar el uso de la api para usuarios extranjeros, y un sistema de atención al cliente
Promp: Agrega una interfaz de inicio de sesión, tambien un soporte de ayuda al usuario y una opción de cambio de idioma a ingles
