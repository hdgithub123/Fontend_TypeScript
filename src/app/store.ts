import { combineReducers, configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

import userReducer from '../features/userSlice';
import headerReducer from '../features/headerSlice';

// Cấu hình redux-persist
const userPersistConfig = {
  key: 'user',       // key để lưu vào localStorage
  storage,           // loại storage (mặc định là localStorage)
  whitelist: ['user'] // chỉ lưu slice 'user'
};


const rootReducer = combineReducers({
  user: userReducer,
  header: headerReducer,
});

const persistedReducer = persistReducer(userPersistConfig, rootReducer);


// Tạo store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});


export const persistor = persistStore(store);

// Kiểu cho TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

