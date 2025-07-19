import React from 'react';
import { Image, Text, StyleSheet, View, TouchableOpacity, StatusBar, ActivityIndicator, ImageSourcePropType } from 'react-native';
import { useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AuthInput from '../../components/AuthInput';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppDispatch, useAppSelector } from '~/store';
import { createUser } from '~/store/auth/auth-slice';
import { AuthStackParamList } from '~/navigation/auth.routes';
import SweetAlert from '~/components/sweetAlert';

const image: ImageSourcePropType = require('../../../assets/imgs/logo-menu.png');
interface AuthState {
    auth: {
        isLoading: boolean;
    };
}

interface RegisterFormData {
    name: string;
    email: string;
    password: string;
}

interface RegisterProps {
    navigation: StackNavigationProp<AuthStackParamList, 'Redefinição de Senha'>;
}

const registerSchema = yup.object().shape({
    name: yup.string().required('Nome é obrigatório').min(3, 'O nome deve ter pelo menos 3 caracteres'),
    email: yup.string().required('E-mail é obrigatório').email('E-mail inválido'),
    password: yup.string().required('Senha é obrigatória').min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

function Register({ navigation }: RegisterProps): React.JSX.Element {

    const { control, handleSubmit, formState: { errors, isValid, isSubmitting } } = useForm<RegisterFormData>({
        mode: 'onChange',
        resolver: yupResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    });

    const isLoading = useAppSelector((state: AuthState) => state.auth.isLoading);
    const dispatch = useDispatch<AppDispatch>();

    const cadastrarUsuario = async (data: RegisterFormData) => {
        const userData = {
            user: {
                name: data.name,
                email: data.email,
                password: data.password
            }
        };
        await dispatch(createUser(userData));
    };

    return (
        <View style={styles.background}>
            <SweetAlert />
            <StatusBar backgroundColor="#0f5d39" barStyle="light-content" />
            <Image source={image} style={styles.logo} />
            <View style={styles.formContainer}>
                <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AuthInput
                            icon='user'
                            placeholder='Nome'
                            value={value}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            style={styles.input}
                        />
                    )}
                />
                {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
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
                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AuthInput
                            icon='lock'
                            placeholder='Senha'
                            value={value}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            secureTextEntry={true}
                            style={styles.input}
                        />
                    )}
                />
                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
                <TouchableOpacity onPress={handleSubmit(cadastrarUsuario)} disabled={!isValid || isSubmitting || isLoading}>
                    <View style={[styles.button, (!isValid || isSubmitting || isLoading) ? { backgroundColor: '#AAA' } : {}]}>
                        {isSubmitting ? (
                            <ActivityIndicator size="small" color="#fff" style={styles.activityIndicator} />
                        ) : null}
                        <Text style={styles.buttonText}>
                            {isSubmitting ? 'Registrando' : 'Registrar'}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Entrar')}>
                <Text style={styles.buttonText}>
                    Já possui conta?
                </Text>
            </TouchableOpacity>
        </View>
    );
}

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
    buttonText: {
        color: '#FFF',
        fontSize: 20,
    },
    loginButton: {
        padding: 10,
        marginTop: 20,
    },
    activityIndicator: {
        marginLeft: -20,
        marginRight: 15,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 0,
        marginLeft: 10,
    }
});

export default Register;