import { showSweetAlert } from "~/components/sweetAlert";
import api from "~/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { hideSplashScreen } from "~/services/hideSplashScreen";

interface User {
    id?: bigint;
    name?: string;
    email: string;
    password: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
}

const initialState: AuthState = {
    user: {
        name: "",
        email: "",
        password: ""
    },
    token: "",
    isLoading: false
}

function logout(state: AuthState) {
    state.user = initialState.user;
    state.token = initialState.token;
    state.isLoading = false;
    AsyncStorage.clear()
}

export const loginUser = createAsyncThunk(
    'auth/login',
    async (userData: { user: User }) => {
        try {
            const { user } = userData;

            const res = await api.post(
                '/login',
                {
                    email: user.email,
                    password: user.password
                }  
            );  
          
            if(res.data.user){
                api.defaults.headers.Authorization = `Bearer ${res.data.token}`
                api.defaults.params = { id_usuario: res.data.user.id }
                await AsyncStorage.setItem('@MEAuth:user', JSON.stringify(res.data.user))
                await AsyncStorage.setItem('@MEAuth:token', res.data.token)

                return { user: res.data.user, token: res.data.token };
            }
        } catch (error:any) {
            const errorMessage = error.response && error.response.data && error.response.data.message ? error.response.data.message : 'Ocorreu um erro inesperado.';

            showSweetAlert({
                title: 'Erro',
                text: errorMessage,
                showCancelButton: false,
                cancelButtonText: 'Cancel',
                confirmButtonText: 'Ok',
                onConfirm: () => {},
                onClose: () => {},
                type: 'danger',
            });
        }
    }
);

export const createUser = createAsyncThunk(
    'auth/createUser',
    async (userData: { user: User }, { dispatch, rejectWithValue }) => {
        try {
            const { user } = userData;

            await api.post(
                '/signup',
                {
                    name: user.name,
                    email: user.email,
                    password: user.password,
                }
            );

            showSweetAlert({
                title: 'Sucesso!',
                text: 'Usuário criado e logado com sucesso!',
                showCancelButton: false,
                cancelButtonText: 'Cancel',
                confirmButtonText: 'Ok',
                onConfirm: () => { },
                onClose: () => { },
                type: 'success',
            });
            dispatch(loginUser({ user }));
            return;
        
        } catch (error: any) {
            const errorMessage = error.response && error.response.data && error.response.data.message ? error.response.data.message : 'Ocorreu um erro inesperado ao criar o usuário.';

            showSweetAlert({
                title: 'Erro',
                text: errorMessage,
                showCancelButton: false,
                cancelButtonText: 'Cancel',
                confirmButtonText: 'Ok',
                onConfirm: () => { },
                onClose: () => { },
                type: 'danger',
            });
            return rejectWithValue(errorMessage);
        }
    }
);

export const verifyUserLogged = createAsyncThunk(
    'auth/verifyUserLogged',
    async (_, { rejectWithValue }) => {
        try {
            const token = await AsyncStorage.getItem('@MEAuth:token');
            const userString = await AsyncStorage.getItem('@MEAuth:user');
            
            if (token && userString) {
                const user: User = JSON.parse(userString);
                api.defaults.headers.Authorization = `Bearer ${token}`
                api.defaults.params = { id_usuario: user.id }
                return { user: user, token };
            }
            return null;
            
        } catch (error) {
            return rejectWithValue('Failed to verify user');
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ user: User; token: string } | undefined>) => {
                if(action.payload){
                    state.user = action.payload.user;
                    state.token = action.payload.token;
                }
                state.isLoading = false;
            })
            .addCase(loginUser.rejected, (state) => {
                state.isLoading = false;
            })
            // Casos para createUser
            .addCase(createUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createUser.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(createUser.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(verifyUserLogged.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(verifyUserLogged.fulfilled, (state, action: PayloadAction<{ user: User; token: string } | null>) => {
                if (action.payload) {
                    state.user = action.payload.user;
                    state.token = action.payload.token;
                }else{
                    hideSplashScreen();
                }
                state.isLoading = false;    
            })
            .addCase(verifyUserLogged.rejected, (state) => {
                state.isLoading = false;
            });
    }
})

export const { reducer: authReducer, actions } = authSlice;