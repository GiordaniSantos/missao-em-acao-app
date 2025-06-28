import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from './auth/auth-slice';
import { dashboardReducer } from "./dashboard/dashboard-slice";
import { TypedUseSelectorHook, useSelector } from "react-redux";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        dashboard: dashboardReducer
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;