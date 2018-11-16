import { ENTIDADES_SET } from "@Redux/Constants/index";

const initialState = {
  entidades: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ENTIDADES_SET: {
      return { ...state, entidades: action.payload };
    }
    default:
      return state;
  }
};
export default reducer;
