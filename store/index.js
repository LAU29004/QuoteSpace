import { configureStore, combineReducers } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer, persistStore } from "redux-persist";
import favorites from "./favoritesSlice";

const rootReducer = combineReducers({ favorites });

const persisted = persistReducer(
  { key: "root", storage: AsyncStorage, whitelist: ["favorites"] },
  rootReducer
);

export const store = configureStore({
  reducer: persisted,
  middleware: (gDM) => gDM({ serializableCheck: false }),
});
export const persistor = persistStore(store);
