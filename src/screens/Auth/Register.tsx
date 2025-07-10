import React, { useState } from 'react';
import { Image, Text, StyleSheet, View, TouchableOpacity, StatusBar, ActivityIndicator, ImageSourcePropType } from 'react-native';
import { useDispatch } from 'react-redux';
import AuthInput from '../../components/AuthInput';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppDispatch, useAppSelector } from '~/store';
import { createUser } from '~/store/auth/auth-slice';
import { AuthStackParamList } from '~/navigation/auth.routes';
import SweetAlert from '~/components/sweetAlert';

const image: ImageSourcePropType = require('../../../assets/imgs/logo-menu.png');

interface RegisterState {
    name: string;
    email: string;
    password: string;
}

interface AuthState {
    auth: {
        isLoading: boolean;
    };
}

interface RegisterProps {
    navigation: StackNavigationProp<AuthStackParamList, 'Redefinição de Senha'>;
}

const initialState: RegisterState = {
    name: '',
    email: '',
    password: ''
};

function Register({ navigation }: RegisterProps): React.JSX.Element {
    const [formData, setFormData] = useState<RegisterState>(initialState);

    const isLoading = useAppSelector((state : AuthState) => state.auth.isLoading);

    const dispatch = useDispatch<AppDispatch>();

    const { name, email, password } = formData;

    const cadastrarUsuario = async () => {
         const userData = {
            user: {
                name: name,
                email: email,
                password: password
            }
        };
        await dispatch(createUser(userData));
    };

    const validations = [
        email && email.includes('@'),
        password && password.length >= 6,
        name && name.trim().length >= 3,
    ];
    const validForm = validations.reduce((total, current) => total && current, true);

    return (
        <View style={styles.background}>
            <SweetAlert />
            <StatusBar backgroundColor="#0f5d39" barStyle="light-content" />
            <Image source={image} style={styles.logo} />
            <View style={styles.formContainer}>
                <AuthInput
                    icon='user'
                    placeholder='Nome'
                    value={name}
                    style={styles.input}
                    onChangeText={textName => setFormData({ ...formData, name: textName })}
                />
                <AuthInput
                    icon='at'
                    placeholder='E-mail'
                    value={email}
                    style={styles.input}
                    onChangeText={textEmail => setFormData({ ...formData, email: textEmail })}
                />
                <AuthInput
                    icon='lock'
                    placeholder='Senha'
                    value={password}
                    secureTextEntry={true}
                    style={styles.input}
                    onChangeText={textSenha => setFormData({ ...formData, password: textSenha })}
                />
                <TouchableOpacity onPress={cadastrarUsuario} disabled={!validForm || isLoading}>
                    <View style={[styles.button, validForm && !isLoading ? {} : { backgroundColor: '#AAA' }]}>
                        {isLoading ? <ActivityIndicator size="small" color="#fff" style={styles.activityIndicator} /> : null}
                        <Text style={styles.buttonText}>
                            {isLoading ? 'Registrando' : 'Registrar'}
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
});

export default Register;