import React, { useState } from 'react';
import { Image, Text, StyleSheet, View, TouchableOpacity, StatusBar, ActivityIndicator, ImageSourcePropType } from 'react-native';
import { useDispatch } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import AuthInput from '~/components/AuthInput';
import { loginUser } from '~/store/auth/auth-slice';
import { AppDispatch, useAppSelector } from '~/store';
import { AuthStackParamList } from '~/navigation/auth.routes';
import SweetAlert from '~/components/sweetAlert';

const image: ImageSourcePropType = require('../../../assets/imgs/logo-menu.png');

interface RootState {
    auth: {
        isLoading: boolean;
    };
}

interface LoginProps {
    navigation: StackNavigationProp<AuthStackParamList, 'Entrar'>;
}

const initialState = {
    email: '',
    password: ''
};

function Login({ navigation }: LoginProps) {
    const [email, setEmail] = useState<string>(initialState.email);
    const [password, setPassword] = useState<string>(initialState.password);

    const isLoading = useAppSelector((state : RootState) => state.auth.isLoading);

    const dispatch = useDispatch<AppDispatch>();

    const handleSignIn = async () => {
        const userData = {
            user: {
                email: email,
                password: password
            }
        };
        await dispatch(loginUser(userData));
    };

    const validations = [
        email && email.includes('@'),
        password && password.length >= 6,
    ];
    const validForm = validations.reduce((total, current) => total && current, true);

    return (
        <View style={styles.background}>
            <SweetAlert />
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
                <AuthInput
                    icon='lock'
                    placeholder='Senha'
                    value={password}
                    secureTextEntry={true}
                    style={styles.input}
                    onChangeText={setPassword}
                />
                <TouchableOpacity onPress={handleSignIn} disabled={!validForm}>
                    <View style={[styles.button, validForm ? {} : { backgroundColor: '#AAA' }]}>
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#fff" style={styles.activityIndicator} />
                        ) : null}
                        <Text style={styles.buttonText}>
                            {isLoading ? 'Entrando' : 'Entrar'}
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
});

export default Login;