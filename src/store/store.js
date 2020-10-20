// store.js
import React, { createContext, useReducer } from "react";

const initialState = {
  data: [],
  basemap: "topo",
  searchArea: null,
  visibleFootprints: [],
  visibleImagery: [],
  imageryLoading: false,
  modal: true,
  quicklookModal: false,
  quicklook: null,
  baseURL: "https://ikonos.euspaceimaging.com",
};
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "SET_DATA":
        return { ...state, data: action.data };
      case "SET_BASEMAP":
        return { ...state, basemap: action.data };
      case "SET_SEARCH_AREA":
        return { ...state, searchArea: action.data };
      case "SET_VISIBLE_FOOTPRINTS":
        return { ...state, visibleFootprints: action.data };
      case "SET_VISIBLE_IMAGERY":
        return { ...state, visibleImagery: action.data };
      case "SET_SPINNER":
        return { ...state, imageryLoading: action.data };
      case "SET_MODAL":
        return { ...state, modal: action.data };
      case "SET_QUICKLOOK_MODAL":
        return { ...state, quicklookModal: action.data };
      case "SET_QUICKLOOK":
        return { ...state, quicklook: action.data };
      default:
        throw new Error();
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
