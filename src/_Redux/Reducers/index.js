import Usuario from "./usuario";
import Alerta from "./alerta";
import Notificaciones from "./notificaciones";
import Entidades from "./entidades";
import Drawer from "./drawer";

import { combineReducers } from "redux";

const rootReducer = combineReducers({
  Usuario,
  Alerta,
  Entidades,
  Notificaciones,
  Drawer
});

export default rootReducer;
