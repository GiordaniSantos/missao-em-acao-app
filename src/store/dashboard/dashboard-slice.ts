import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "~/services/api";
import { showSweetAlert } from "~/components/sweetAlert";

interface DashboardState {
    visitaCrente: number;
    visitaNaoCrente: number;
    visitaPresidio: number;
    visitaEnfermo: number;
    visitaHospital: number;
    visitaEscola: number;
    batismosInfantis: number;
    batismosProfissoes: number;
    bencoesNupciais: number;
    santasCeias: number;
    estudos: number;
    sermoes: number;
    estudosBiblicos: number;
    discipulados: number;
    comungante: number;
    naoComungante: number;
    loading: boolean;
    refresh: boolean;
    membresias: any;
    mes: number;
    ano: number;
}

const initialState: DashboardState = {
    visitaCrente: 0,
    visitaNaoCrente: 0,
    visitaPresidio: 0,
    visitaEnfermo: 0,
    visitaHospital: 0,
    visitaEscola: 0,
    batismosInfantis: 0,
    batismosProfissoes: 0,
    bencoesNupciais: 0,
    santasCeias: 0,
    estudos: 0,
    sermoes: 0,
    estudosBiblicos: 0,
    discipulados: 0,
    comungante: 0,
    naoComungante: 0,
    loading: true,
    refresh: false,
    membresias: {},
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear(),
};


export const fetchRelatorios = createAsyncThunk(
    'dashboard/fetchRelatorios',
    async ({ mes = initialState.mes, ano = initialState.ano }: { mes?: number, ano?: number } = {}, { dispatch, rejectWithValue }) => {
        try {
            const response = await api.get(`/dashboard?mes=${mes}&ano=${ano}`);
 
            return {
                ...response.data,
                mes: mes,
                ano: ano
            };
        } catch (error: any) {

            const errorMessage = error.response && error.response.data && error.response.data.message ? error.response.data.message : 'Ocorreu um erro ao buscar os relatórios.';
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
            return rejectWithValue(errorMessage);
        }
    }
);

// Cria o slice do Redux
const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        toggleRefresh: (state) => {
            state.refresh = !state.refresh;
        },
        resetParamsToDefault: (state) => {
            state.mes = new Date().getMonth() + 1;
            state.ano = new Date().getFullYear();
        },
        setMesAno: (state, action) => {
            state.mes = action.payload.mes;
            state.ano = action.payload.ano;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRelatorios.pending, (state) => {
                state.loading = true;
                state.refresh = true;
            })
            .addCase(fetchRelatorios.fulfilled, (state, action) => {
                state.loading = false;
                state.refresh = false;
                Object.assign(state, action.payload);
                state.mes = action.payload.mes;
                state.ano = action.payload.ano;
            })
            .addCase(fetchRelatorios.rejected, (state, action) => {
                state.loading = false;
                state.refresh = false;
            });
    }
});

export const { reducer: dashboardReducer, actions } = dashboardSlice;