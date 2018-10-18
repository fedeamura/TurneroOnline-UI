var Config = {
  BASE_URL: "/TurneroOnline",
  // WS_TURNERO: "http://localhost:30002", //WS Local
  // WS_TURNERO: "http://localhost:30001", //Bridge
  WS_TURNERO: "https://servicios2.cordoba.gov.ar/WSTurneroOnline_Bridge", //WS Produccion Internet
  // WS_TURNERO: "https://srv-app04.cordoba.local/WSTurneroOnline", //WS Produccion Intranet
  WS_CORDOBA_GEO: "https://servicios2.cordoba.gov.ar/CordobaGeoApi",
  URL_LOGIN:
    "https://servicios2.cordoba.gov.ar/VecinoVirtualUtils_Internet/Acceder?subtitulo=Turnero&url=http%3A%2F%2Flocalhost%3A3000%2F%23%2F",
  // URL_LOGIN: "https://srv-dev04/VecinoVirtualUtils/Test/#/Login/QWERTTREWQ",
  URL_CORDOBA_FILES: "https://servicios2.cordoba.gov.ar/CordobaFiles"
};

module.exports = Config;
