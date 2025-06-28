import { showSweetAlert } from "./sweetAlert";

export function ShowAlertErroResponseApi(error:any){
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