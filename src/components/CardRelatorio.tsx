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
        <View style={[styles.card, styles.elevation, { borderLeftColor: iconColor }]}>
            <TouchableOpacity onPress={onPress} activeOpacity={0.4} disabled={!onPress}>
                <View style={styles.cardBody}>
                    <View style={styles.itens}>
                        <View>
                            <Text style={[styles.titleVisita, { color: iconColor }]}>{title}</Text>
                            <Text style={styles.numeroVisita}>
                                {value} {isVisita ? 'visitas' : ''}
                            </Text>
                        </View>
                        <View>
                            <FontAwesome5 size={30} style={styles.iconVisita} name={iconName} />
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
        backgroundColor: '#fff',
        borderTopColor: '#e3e6f0',
        borderBottomColor: '#e3e6f0',
        borderRightColor: '#e3e6f0',
        borderWidth: 1,
        marginVertical: 8,
        marginHorizontal: 10,
        borderLeftWidth: 4,
        flex: 1,
        borderRadius: 5,
        overflow: 'hidden',
    },
    cardBody: {
        padding: 20,
    },
    itens: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleVisita: {
        fontSize: 11,
        fontWeight: '700',
    },
    numeroVisita: {
        color: '#5a5c69',
        fontWeight: '700',
        fontSize: 20,
    },
    iconVisita: {
        color: '#dddfeb',
        fontWeight: '900',
        fontSize: 30,
    },
});

export default CardRelatorio;