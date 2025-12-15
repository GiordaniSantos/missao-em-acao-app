import React from 'react';
import { Image, Text, StyleSheet, View, TouchableOpacity, StatusBar, ActivityIndicator, ImageSourcePropType } from 'react-native';
import { useDispatch } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AuthInput from '~/components/AuthInput';
import { loginUser } from '~/store/auth/auth-slice';
import { AppDispatch, useAppSelector } from '~/store';
import { AuthStackParamList } from '~/navigation/auth.routes';
import SweetAlert from '~/components/sweetAlert';

const image: ImageSourcePropType = require('../../../assets/imgs/nova-logo.png');

interface RootState {
    auth: {
        isLoading: boolean;
    };
}

interface LoginFormData {
    email: string;
    password: string;
}

interface LoginProps {
    navigation: StackNavigationProp<AuthStackParamList, 'Entrar'>;
}

const loginSchema = yup.object().shape({
    email: yup.string().required('E-mail é obrigatório').email('E-mail inválido'),
    password: yup.string().required('Senha é obrigatória').min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

function Login({ navigation }: LoginProps) {

    const { control, handleSubmit, formState: { errors, isValid, isSubmitting } } = useForm<LoginFormData>({
        mode: 'onChange',
        resolver: yupResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const isLoading = useAppSelector((state: RootState) => state.auth.isLoading);
    const dispatch = useDispatch<AppDispatch>();

    const handleSignIn = async (data: LoginFormData) => {
        const userData = {
            user: {
                email: data.email,
                password: data.password
            }
        };
        await dispatch(loginUser(userData));
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
                <TouchableOpacity onPress={handleSubmit(handleSignIn)} disabled={!isValid || isSubmitting || isLoading} >
                    <View style={[styles.button, (!isValid || isSubmitting || isLoading) ? { backgroundColor: '#AAA' } : {}]}>
                        {isLoading || isSubmitting ? (
                            <ActivityIndicator size="small" color="#fff" style={styles.activityIndicator} />
                        ) : null}
                        <Text style={styles.buttonText}>
                            {isLoading || isSubmitting ? 'Entrando' : 'Entrar'}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate('Registre-se')}>
                <Text style={styles.buttonText}>
                    Ainda não possui conta?
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Redefinição de Senha')}>
                <Text style={styles.buttonText}>
                    Esqueceu sua senha?
                </Text>
            </TouchableOpacity>
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
    icon: {
        fontSize: 20,
        color: '#333',
        marginRight: 10,
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
    activityIndicator: {
        marginLeft: -20,
        marginRight: 15,
    },
    registerLink: {
        padding: 10,
        marginTop: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 0,
        marginLeft: 10,
    }
});

export default Login;