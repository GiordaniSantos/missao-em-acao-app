import React, { useState, JSX } from 'react';
import { Image, Text, StyleSheet, View, TouchableOpacity, StatusBar, ActivityIndicator, ImageSourcePropType } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../../services/api';
import AuthInput from '../../components/AuthInput';
import SweetAlert, { showSweetAlert } from '../../components/sweetAlert';
import { AxiosError } from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '~/navigation/auth.routes';

const image: ImageSourcePropType = require('../../../assets/imgs/nova-logo.png');

interface ModifyPasswordFormData {
    newPassword: string;
    confirmPassword: string;
}

interface ModifyPasswordProps {
    route: RouteProp<AuthStackParamList, 'Redefinir Senha'>;
    navigation: StackNavigationProp<AuthStackParamList, 'Redefinir Senha'>;
}

const modifyPasswordSchema = yup.object().shape({
    newPassword: yup.string().required('Nova Senha é obrigatória').min(6, 'A nova senha deve ter pelo menos 6 caracteres'),
    confirmPassword: yup.string().required('Confirmação de Senha é obrigatória').oneOf([yup.ref('newPassword')], 'As senhas não coincidem'),
});

function ModifyPassword({ route, navigation }: ModifyPasswordProps): JSX.Element {
    const { token } = route.params;

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { control, handleSubmit, formState: { errors, isValid, isSubmitting } } = useForm<ModifyPasswordFormData>({
        mode: 'onChange',
        resolver: yupResolver(modifyPasswordSchema),
        defaultValues: {
            newPassword: '',
            confirmPassword: ''
        }
    });

    const redefinirSenha = async (data: ModifyPasswordFormData) => {
        setIsLoading(true);
        try {
            await api.post(`/password/reset/${token}`, {
                password: data.newPassword,
                password_confirmation: data.confirmPassword
            });

            showSweetAlert({
                title: 'Sucesso!',
                text: 'Senha redefinida com sucesso!',
                showCancelButton: false,
                cancelButtonText: 'Cancel',
                confirmButtonText: 'Logar',
                onConfirm: () => {navigation.navigate('Entrar')},
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
                onConfirm: () => {},
                onClose: () => {},
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
                    name="newPassword"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AuthInput
                            icon="lock"
                            placeholder="Nova Senha"
                            value={value}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            secureTextEntry={true}
                            style={styles.input}
                        />
                    )}
                />
                {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword.message}</Text>}
                <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AuthInput
                            icon="lock"
                            placeholder="Confirmar Nova Senha"
                            value={value}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            secureTextEntry={true}
                            style={styles.input}
                        />
                    )}
                />
                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}
                <TouchableOpacity onPress={handleSubmit(redefinirSenha)} disabled={!isValid || isSubmitting || isLoading} >
                    <View style={[styles.button, (!isValid || isSubmitting || isLoading) ? { backgroundColor: '#AAA' } : {}]}>
                        {isLoading || isSubmitting ? (
                            <ActivityIndicator size="small" color="#fff" style={styles.activityIndicator} />
                        ) : null}
                        <Text style={styles.buttonText}>
                            {isLoading || isSubmitting ? 'Redefinindo Senha' : 'Redefinir Senha'}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    logo: {
        width: 340,
        height: 190,
        marginBottom: 10,
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
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 0,
        marginLeft: 10,
    },
});

export default ModifyPassword;