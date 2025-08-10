import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import { testsApi } from './testsSlice';
import authReducer from './authSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

const rootReducer = combineReducers({
  auth: authReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
  [testsApi.reducerPath]: testsApi.reducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state, not API cache
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware, testsApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
