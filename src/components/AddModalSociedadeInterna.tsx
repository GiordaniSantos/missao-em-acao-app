import React, { useEffect } from 'react';
import { Modal, View, StyleSheet, TouchableWithoutFeedback, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Dropdown } from 'react-native-element-dropdown';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

interface NovaSociedadeInterna {
    nome: string;
    id_usuario: string | number;
}

interface AddModalSociedadeInternaProps {
    isVisible: boolean;
    onCancel: () => void;
    onSave: (data: NovaSociedadeInterna) => void;
    tituloHeader: string;
    dataSelect: string[];
    userId: string | number;
}

const formSchema = yup.object().shape({
    nome: yup.string().required('O nome é obrigatório.'),
});

type FormData = yup.InferType<typeof formSchema>;

function AddModalSociedadeInterna({ isVisible, onCancel, onSave, tituloHeader, dataSelect, userId,}: AddModalSociedadeInternaProps) {

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(formSchema),
        defaultValues: {
            nome: '',
        },
    });

    const onSubmit = (data: FormData) => {
        const novaSociedadeInterna: NovaSociedadeInterna = {
            nome: data.nome,
            id_usuario: userId,
        };

        if (onSave) {
            onSave(novaSociedadeInterna);
        }
        reset();
    };

    useEffect(() => {
        if (isVisible) {
        reset({
            nome: '',
        });
        }
    }, [isVisible, reset]);

    return (
        <Modal transparent={true} visible={isVisible} onRequestClose={onCancel} animationType='fade'>
            <TouchableWithoutFeedback onPress={onCancel}>
                <View style={styles.background}></View>
            </TouchableWithoutFeedback>
            <View style={styles.container}>
                <Text style={styles.header}>{tituloHeader}</Text>

                <Controller
                    control={control}
                    name="nome"
                    render={({ field: { onChange, value } }) => (
                        <Dropdown
                            style={[styles.input, errors.nome && styles.inputError]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            data={dataSelect.map(item => ({ label: item, value: item }))}
                            labelField="label"
                            valueField="value"
                            placeholder="Selecione uma Opção"
                            value={value}
                            onChange={item => {
                                onChange(item.value);
                            }}
                        />
                    )}
                />
                {errors.nome && <Text style={styles.errorText}>{errors.nome.message}</Text>}

                <View style={styles.buttons}>
                    <TouchableOpacity onPress={onCancel}>
                        <Text style={styles.button}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSubmit(onSubmit)}>
                        <Text style={styles.button}>Salvar</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableWithoutFeedback onPress={onCancel}>
                <View style={styles.background}></View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    container: {
        backgroundColor: '#FFF',
        overflow: 'hidden',
    },
    header: {
        backgroundColor: '#0f5d39',
        color: '#FFF',
        textAlign: 'center',
        padding: 15,
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 10,
    },
    button: {
        margin: 10,
        marginRight: 20,
        color: '#0f5d39',
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        height: 50,
        margin: 15,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E3E3E3',
        borderRadius: 6,
        paddingHorizontal: 10,
    },
    inputError: {
        borderColor: '#dc3545',
    },
    errorText: {
        color: '#dc3545',
        marginLeft: 15,
        marginTop: -10,
        marginBottom: 5,
        fontSize: 12,
    },
    placeholderStyle: {
        fontSize: 16,
        color: '#A9A9A9',
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#333',
    },
    date: {
        fontSize: 20,
        marginLeft: 15,
    },
});

export default AddModalSociedadeInterna;