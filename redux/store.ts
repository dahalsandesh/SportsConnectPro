import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { rootReducer, RootState } from "./store/reducers"
import { apiMiddlewares } from "./store/middleware"

// Create the store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/FLUSH',
          'persist/PURGE',
          'persist/REGISTER',
        ],
        ignoredActionPaths: ['payload.timestamp', 'meta.baseQueryMeta', 'meta.arg.originalArgs'],
        ignoredPaths: ['items.dates', 'meta.arg.originalArgs']
      }
    }).concat(apiMiddlewares),
  devTools: process.env.NODE_ENV !== 'production',
})

// Enable refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch)

export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
export type AppState = ReturnType<typeof rootReducer>

// Export the store and types
export { store }
