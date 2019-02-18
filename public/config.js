const DEPLOY = 1;
const TEST = 2;
const LOCAL = 3;
const ENTORNO = DEPLOY;
// const ENTORNO =LOCAL;

//WS Turnero
const URL_WS_TURNERO_LOCAL = "http://localhost:30001";
const URL_WS_TURNERO_TEST = "https://srv-dev04.cordoba.local/WSTurneroOnline_Bridge";
const URL_WS_TURNERO_DEPLOY = "https://servicios2.cordoba.gov.ar/WSTurneroOnline_Bridge";
let URL_WS_TURNERO = URL_WS_TURNERO_DEPLOY;

//Url Login
const URL_LOGIN_LOCAL = "https://servicios2.cordoba.gov.ar/VecinoVirtual/Login/#/Login/TurneroOnlineLocal";
const URL_LOGIN_TEST = "https://servicios2.cordoba.gov.ar/VecinoVirtual/Login/#/Login/TurneroOnlineTest";
const URL_LOGIN_DEPLOY = "https://servicios2.cordoba.gov.ar/VecinoVirtual/Login/#/Login/TurneroOnline";
let URL_LOGIN = URL_LOGIN_DEPLOY;

//Segun el entorno, cargo las variables
switch (ENTORNO) {
  case DEPLOY:
    {
      URL_WS_TURNERO = URL_WS_TURNERO_DEPLOY;
      URL_LOGIN = URL_LOGIN_DEPLOY;
    }
    break;

  case TEST:
    {
      URL_WS_TURNERO = URL_WS_TURNERO_TEST;
      URL_LOGIN = URL_LOGIN_TEST;
    }
    break;

  case LOCAL:
    {
      URL_WS_TURNERO = URL_WS_TURNERO_LOCAL;
      URL_LOGIN = URL_LOGIN_LOCAL;
    }
    break;
}
// URL_WS_TURNERO = "http://localhost:30001";
// URL_WS_TURNERO = "https://srv-dev04.cordoba.local/WSTurneroOnline";

var Config = {
  BASE_URL: "/TurneroOnline",
  WS_TURNERO: URL_WS_TURNERO,
  WS_CORDOBA_GEO: "https://servicios2.cordoba.gov.ar/CordobaGeoApi",
  URL_LOGIN: URL_LOGIN,
  URL_CORDOBA_FILES: "https://servicios2.cordoba.gov.ar/CordobaFiles",
  IDENTIFICADOR_FOTO_DEFAULT_MALE:
    "f_qdag0f9irgka9xj2l6mbll69gxmhlghezkmkj2mykg1pj0uuhwogqiqfic_c327l9gmyk9tutz1fuq0rc3_z2byq5gcg2j5tjpqcn6jid4x2rlv2nsaa2it7s64d7m2k4h7e_xegt2w8p79uvk4jj42a7uvrcfm1cn8jpq31o4raxvsv8ktwtsa_q6iqbxeop56c_zee",
  IDENTIFICADOR_FOTO_DEFAULT_FEMALE:
    "f_zq38nzky73iwxm6fz4m812vx68ggr28xgokqfwx7zf9ws7rd6_s7mn985gcqtehf6vpicq_chqiv3_e9rdlsjal4pmw_uhnu9318riap_p07eoe5cd_q4z65kw304ataczwaihsic6t4lo0bh18qi81k86x6qlv_7z5q2ew6w1n8gbu772sdcd3e8mcnuw31ku8wtkkd",
  URL_MI_PERFIL: "https://servicios2.cordoba.gov.ar/VecinoVirtual/Utils/MiPerfil",
  GOOGLE_STATIC_MAP_KEY: "AIzaSyCKFQtmXhN0YwgjLDQhuwZpwrWZjH5xJcY",
  NOMBRE_SISTEMA: "Turnero Online"
};

module.exports = Config;
