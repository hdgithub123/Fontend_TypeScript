import { combineReducers, configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

import userReducer from '../features/userSlice';
import headerReducer from '../features/headerSlice';

// ⚙️ Cấu hình persist cho riêng slice 'user'
const userPersistConfig = {
  key: 'user', // 👈 key lưu trong localStorage
  storage,     // 👈 sử dụng localStorage (mặc định)
};

const headerPersistConfig = {
  key: 'header',
  storage
};


// ✅ Kết hợp reducer
const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer), // chỉ user được persist
  header: persistReducer(headerPersistConfig, headerReducer), // header được persist
  //header: headerReducer, // nếu muốn header không được persist
});

// 🧩 Tạo store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// 🗝️ Tạo persistor để dùng trong <PersistGate>
export const persistor = persistStore(store);
// 🧠 Kiểu cho TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
