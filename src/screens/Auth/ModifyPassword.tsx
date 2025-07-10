import React, { JSX, useState } from 'react';
import { Image, Text, StyleSheet, View, TouchableOpacity, StatusBar, ActivityIndicator, ImageSourcePropType } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import api from '../../services/api';
import AuthInput from '../../components/AuthInput';
import SweetAlert, { showSweetAlert } from '../../components/sweetAlert';
import { AxiosError } from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '~/navigation/auth.routes';

const image: ImageSourcePropType = require('../../../assets/imgs/logo-menu.png');

interface ModifyPasswordProps {
    route: RouteProp<AuthStackParamList, 'Redefinir Senha'>;
    navigation: StackNavigationProp<AuthStackParamList, 'Redefinir Senha'>;
}

function ModifyPassword({ route, navigation }: ModifyPasswordProps): JSX.Element {
    const { token } = route.params;

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const redefinirSenha = async () => {
        setIsLoading(true);
        try {
            await api.post(`/password/reset/${token}`, {
                password: newPassword,
                password_confirmation: confirmPassword
            });

            showSweetAlert({
                title: 'Sucesso!',
                text: 'Senha redefinida com sucesso!',
                showCancelButton: false,
                cancelButtonText: 'Cancel',
                confirmButtonText: 'Ok',
                onConfirm: () => { },
                onClose: () => { },
                type: 'success',
            });
            navigation.navigate('Entrar');
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

    const validations = [
        newPassword.length >= 6,
        confirmPassword === newPassword
    ];

    const validForm = validations.every(isValid => isValid);

    return (
        <View style={styles.background}>
            <SweetAlert />
            <StatusBar backgroundColor="#0f5d39" barStyle="light-content" />
            <Image source={image} style={styles.logo} />
            <View style={styles.formContainer}>
                <AuthInput
                    icon="lock"
                    placeholder="Nova Senha"
                    value={newPassword}
                    secureTextEntry={true}
                    style={styles.input}
                    onChangeText={setNewPassword}
                />

                <AuthInput
                    icon="lock"
                    placeholder="Confirmar Nova Senha"
                    value={confirmPassword}
                    secureTextEntry={true}
                    style={styles.input}
                    onChangeText={setConfirmPassword}
                />
                <TouchableOpacity onPress={redefinirSenha} disabled={!validForm || isLoading}>
                    <View style={[styles.button, (!validForm || isLoading) ? { backgroundColor: '#AAA' } : {}]}>
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#fff" style={styles.activityIndicator} />
                        ) : null}
                        <Text style={styles.buttonText}>
                            {isLoading ? 'Redefinindo Senha' : 'Redefinir Senha'}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    logo: {
        width: 190,
        height: 190,
        marginBottom: -15,
        resizeMode: 'contain',
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
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    input: {
        marginTop: 10,
        backgroundColor: '#FFF'
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
    buttonText: {
        color: '#FFF',
        fontSize: 20
    },
    activityIndicator: {
        marginLeft: -20,
        marginRight: 15
    },
});

export default ModifyPassword;