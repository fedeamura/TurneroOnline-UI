import { USUARIO_LOGIN, USUARIO_CERRAR_SESION } from "@Redux/Constants/index";

const initialState = {
  usuario: undefined
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case USUARIO_LOGIN: {
      localStorage.setItem("usuario", JSON.stringify(action.payload));
      return { ...state, usuario: action.payload };
    }
    case USUARIO_CERRAR_SESION: {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      return { ...state, usuario: undefined };
    }
    default:
      return state;
  }
};
export default reducer;
