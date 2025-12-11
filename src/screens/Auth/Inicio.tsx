import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, StatusBar, Image, ImageSourcePropType } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

const image: ImageSourcePropType = require('../../../assets/imgs/nova-logo.png');

type RootStackParamList = {
    'Entrar': undefined;
    'Registre-se': undefined;
};

interface InicioProps {
    navigation: StackNavigationProp<RootStackParamList>;
}

function Inicio({ navigation }: InicioProps): React.JSX.Element {
    return (
        <View style={styles.mainContainer}>
            <StatusBar backgroundColor="#0f5d39" barStyle="light-content" />
            <Image source={image} style={styles.logo} />
            <View style={styles.formContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('Entrar')}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>
                            Entrar
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Registre-se')}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>
                            Registre-se
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0f5d39',
    },
    logo: {
        width: 340,
        height: 190,
        marginBottom: 2,
    },
    title: {
        color: '#FFF',
        fontSize: 26,
        fontWeight: 'bold',
        borderRadius: 8,
        marginBottom: 20,
        zIndex: 1,
    },
    formContainer: {
        padding: 15,
        width: '90%',
        borderRadius: 10,
    },
    button: {
        backgroundColor: '#FFF',
        marginTop: 20,
        padding: 10,
        alignItems: 'center',
        borderRadius: 7,
        marginBottom: -5,
    },
    buttonText: {
        color: '#0f5d39',
        fontSize: 20,
    },
    elevation: {
        elevation: 18,
        shadowColor: '#3a3b45',
        shadowOffset: { width: 0, height: 9 },
        shadowOpacity: 0.48,
        shadowRadius: 11.95,
    },
});

export default Inicio;