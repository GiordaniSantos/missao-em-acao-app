import React, { useState } from 'react';
import { Image, Text, StyleSheet, View, TouchableOpacity, StatusBar, ActivityIndicator, ImageSourcePropType } from 'react-native';
import { AxiosError } from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '~/services/api';
import AuthInput from '../../components/AuthInput';
import SweetAlert, { showSweetAlert } from '../../components/sweetAlert';

const image: ImageSourcePropType = require('../../../assets/imgs/nova-logo.png');

interface RequestPasswordFormData {
    email: string;
}

const requestPasswordSchema = yup.object().shape({
    email: yup.string().required('E-mail é obrigatório').email('E-mail inválido'),
});

function RequestPassword() {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { control, handleSubmit, formState: { errors, isValid, isSubmitting } } = useForm<RequestPasswordFormData>({
        mode: 'onChange',
        resolver: yupResolver(requestPasswordSchema),
        defaultValues: {
            email: ''
        }
    });

    const solicitarRedefinicao = async (data: RequestPasswordFormData) => {
        setIsLoading(true);
        try {
            await api.post(`/password/reset`, {
                email: data.email,
            });

            showSweetAlert({
                title: 'Sucesso!',
                text: 'Email enviado com sucesso! Siga as instruções do email.',
                showCancelButton: false,
                cancelButtonText: 'Cancel',
                confirmButtonText: 'Ok',
                onConfirm: () => { },
                onClose: () => { },
                type: 'success',
            });
        } catch (e: any) {
            const error = e as AxiosError<{ message: string }>;
            showSweetAlert({
                title: 'Erro',
                text: error.response?.data?.message || 'Ocorreu um erro inesperado.',
                showCancelButton: false,
                cancelButtonText: 'Cancel',
                confirmButtonText: 'Ok',
                onConfirm: () => { },
                onClose: () => { },
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.background}>
            <SweetAlert />
            <StatusBar backgroundColor="#0f5d39" barStyle="light-content" />
            <Image source={image} style={styles.logo} />
            <View style={styles.formContainer}>
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AuthInput
                            icon='at'
                            placeholder='E-mail'
                            value={value}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            style={styles.input}
                        />
                    )}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
                <TouchableOpacity onPress={handleSubmit(solicitarRedefinicao)} disabled={!isValid || isSubmitting || isLoading} >
                    <View style={[styles.button, (!isValid || isSubmitting || isLoading) ? styles.buttonDisabled : {}]}>
                        {isLoading || isSubmitting ? <ActivityIndicator size="small" color="#fff" style={styles.activityIndicator} /> : null}
                        <Text style={styles.buttonText}>
                            {isLoading || isSubmitting ? 'Enviando link para redefinição' : 'Enviar link para redefinição'}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    logo: {
        width: 300,
        height: 150,
        marginBottom: 10,
    },
    background: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f5d39',
    },
    formContainer: {
        backgroundColor: '#fff',
        padding: 20,
        width: '90%',
        borderRadius: 10,
    },
    input: {
        marginTop: 10,
        backgroundColor: '#FFF',
    },
    button: {
        backgroundColor: '#015b41',
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 7,
    },
    buttonDisabled: {
        backgroundColor: '#AAA',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 20,
    },
    activityIndicator: {
        marginLeft: -10,
        marginRight: 5,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 0,
        marginLeft: 10,
    }
});

export default RequestPassword;