import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface CardRelatorioProps {
    title: string;
    isVisita?: boolean;
    value: number;
    iconName: string;
    iconColor: string;
    onPress?: () => void;
}

function CardRelatorio({
    title,
    isVisita = false,
    value,
    iconName,
    iconColor,
    onPress
}: CardRelatorioProps) {
    return (
        <View style={[styles.card, styles.elevation]}>
            <TouchableOpacity onPress={onPress} activeOpacity={0.4} disabled={!onPress}>
                <View style={styles.cardBody}>
                    <View style={styles.itens}>
                        <View style={[styles.iconArea, { backgroundColor: iconColor + '20' }]}>
                            <FontAwesome5 name={iconName} size={24} color={iconColor} />
                        </View>
                        <View>
                            <Text style={[styles.titleVisita]}>{title}</Text>
                            <Text style={styles.numeroVisita}>
                                {value} 
                                {isVisita && (
                                    <Text style={styles.labelVisita}> visitas</Text>
                                )}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    elevation: {
        elevation: 18,
        shadowColor: 'rgba(58,59,69, 0.4)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    card: {
        height: 90,
        backgroundColor: '#FFF',
        borderColor: '#e3e6f0',
        borderWidth: 1,
        marginVertical: 4,
        marginHorizontal: 6,
        flex: 1,
        borderRadius: 10,
        overflow: 'hidden',
    },
    cardBody: {
        padding: 20,
    },
    itens: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconArea: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    infoArea: {
        flex: 1,
    },
    titleVisita: {
        fontSize: 11,
        color: '#5a5c69',
        fontWeight: '600',
    },
    numeroVisita: {
        fontSize: 20,
        color: '#5a5c69',
        fontWeight: '700',
        marginTop: 2,
    },
    labelVisita: {
        fontSize: 14,
        color: '#888',
        fontWeight: 'normal',
    },
});

export default CardRelatorio;