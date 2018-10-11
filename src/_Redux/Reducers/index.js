import Usuario from "./usuario";
import Alerta from "./alerta";
import MainContent from "./mainContent";
import Notificaciones from "./notificaciones";

import { combineReducers } from "redux";

const rootReducer = combineReducers({
  Usuario,
  Alerta,
  MainContent,
  Notificaciones
});

export default rootReducer;
