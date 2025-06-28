import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 

interface AuthInputProps extends TextInputProps {
    icon: keyof typeof FontAwesome.glyphMap;
    style?: object;
}

function AuthInput(props: AuthInputProps) {
    const { icon, style, ...restProps } = props;

    return (
        <View style={[styles.container, style]}>
            <FontAwesome name={icon} size={20} style={styles.icon} />
            <TextInput {...restProps} style={styles.input} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 40,
        backgroundColor: '#EEE',
        borderWidth: 0.5,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    icon: {
        color: '#333',
        marginLeft: 20,
    },
    input: {
        flex: 1,
        marginLeft: 20,
    },
});

export default AuthInput;