import React, { useState } from 'react';
import { Image, Text, StyleSheet, View, TouchableOpacity, StatusBar, ActivityIndicator, ImageSourcePropType } from 'react-native';
import { AxiosError } from 'axios';
import api from '~/services/api';
import AuthInput from '../../components/AuthInput'; 
import { showSweetAlert } from '../../components/sweetAlert';

const image: ImageSourcePropType = require('../../../assets/imgs/logo-menu.png');

function RequestPassword() {
    const [email, setEmail] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const solicitarRedefinicao = async () => {
        setIsLoading(true);
        try {
            await api.post(`/password/reset`, {
                email: email,
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
            setEmail('');
        } catch (e: any) {
            const error = e as AxiosError<{ message: string }>;
            showSweetAlert({
                title: 'Erro',
                text: error.response?.data?.message || 'Ocorreu um erro inesperado.',
                showCancelButton: false,
                cancelButtonText: 'Cancel',
                confirmButtonText: 'Ok',
                onConfirm: () => {},
                onClose: () => {},
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const isValidForm = email.includes('@');

    return (
        <View style={styles.background}>
            <StatusBar backgroundColor="#0f5d39" barStyle="light-content" />
            <Image source={image} style={styles.logo} />
            <View style={styles.formContainer}>
                <AuthInput
                    icon='at'
                    placeholder='E-mail'
                    value={email}
                    style={styles.input}
                    onChangeText={setEmail}
                />

                <TouchableOpacity
                    onPress={solicitarRedefinicao}
                    disabled={!isValidForm || isLoading}
                >
                    <View style={[styles.button, (!isValidForm || isLoading) ? styles.buttonDisabled : {}]}>
                        {isLoading ? <ActivityIndicator size="small" color="#fff" style={styles.activityIndicator} /> : null}
                        <Text style={styles.buttonText}>
                            {isLoading ? 'Enviando link para redefinição' : 'Enviar link para redefinição'}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    logo: {
        width: 190,
        height: 190,
        marginBottom: -15,
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
});

export default RequestPassword;