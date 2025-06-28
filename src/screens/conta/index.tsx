import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, Button, TouchableOpacity, TouchableWithoutFeedback, Pressable, ScrollView} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AppDispatch, useAppSelector } from '~/store';
import { actions } from '~/store/auth/auth-slice';
import api from '../../services/api';
import { useDispatch } from 'react-redux';
import { showSweetAlert } from '~/components/sweetAlert';
import { ShowAlertErroResponseApi } from '~/components/ShowAlertErrorResponseApi';

interface FormData {
    name: string;
    email: string;
    senha?: string | undefined;
    confirmarSenha?: string | undefined;
}

const schema = yup.object().shape({
    name: yup.string().required('O nome é obrigatório'),
    email: yup.string().email('Email inválido').required('O email é obrigatório'),
    senha: yup.string().transform((value) => (value === '' ? undefined : value)).optional(),
    confirmarSenha: yup.string().transform((value) => (value === '' ? undefined : value)).optional().when('senha', {
        is: (senha: string | undefined) => senha && senha.length > 0,
        then: (schema) =>
            schema.required('Confirme sua senha').oneOf([yup.ref('senha')], 'As senhas não coincidem'),
        }
    ),
});

function Conta(){
    const dispatch = useDispatch<AppDispatch>();
    const user = useAppSelector((state) => state.auth.user);

    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState<'update' | 'delete' | ''>('');

    const { control, handleSubmit, setValue, formState: { errors }, reset } = useForm<FormData>({
        resolver: yupResolver(schema as any),
            defaultValues: {
            name: user?.name,
            email: user?.email,
            senha: '',
            confirmarSenha: '',
        },
    });

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await api.get(`/user/${user?.id}`);
                setValue('name', res.data.name);
                setValue('email', res.data.email);
            } catch (error: any) {
                ShowAlertErroResponseApi(error);
            }
        };
        getUser();
    }, []);

    const updateUser = async (data: FormData) => {
        try {
            const updatePayload: { name: string; email: string; password?: string; password_confirmation?: string } = {
                name: data.name,
                email: data.email,
            };

            if (data.senha) {
                updatePayload.password = data.senha;
                updatePayload.password_confirmation = data.confirmarSenha;
            }

            await api.put(`/user/${user?.id}`, updatePayload);
            
            showSweetAlert({
                title: 'Sucesso!',
                text: 'Conta atualizada com sucesso!',
                showCancelButton: false,
                cancelButtonText: 'Cancel',
                confirmButtonText: 'Ok',
                onConfirm: () => { },
                onClose: () => { },
                type: 'success',
            });

            reset({ ...data, senha: '', confirmarSenha: '' });
        } catch (error: any) {
            ShowAlertErroResponseApi(error);
        }
    };

    const deleteUser = async () => {
        try {
            await api.delete(`/user/${user?.id}`);
            showSweetAlert({
                title: 'Sucesso!',
                text: 'Conta deletada com sucesso!',
                showCancelButton: false,
                cancelButtonText: 'Cancel',
                confirmButtonText: 'Ok',
                onConfirm: () => { },
                onClose: () => { },
                type: 'success',
            });
            setTimeout(() => {
                dispatch(actions.logout());
            }, 2000);
        } catch (error: any) {
            ShowAlertErroResponseApi(error);
        }
    };

    const handlePressUpdate = () => {
        setModalContent('update');
        setShowModal(true);
    };

    const handleConfirmUpdate = handleSubmit(async (data) => {
        await updateUser(data);
        setShowModal(false);
    });

    const handleConfirmDelete = async () => {
        await deleteUser();
        setShowModal(false);
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.label}>Nome</Text>
                <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                        style={styles.input}
                        placeholder="Digite seu nome"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        />
                    )}
                />
                {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

                <Text style={styles.label}>Email</Text>
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                        style={styles.input}
                        placeholder="Digite seu email"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        />
                    )}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

                <Text style={styles.label}>Senha</Text>
                <Controller
                    control={control}
                    name="senha"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                        style={styles.input}
                        placeholder="Deixe em branco para manter a atual"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        secureTextEntry={true}
                        />
                    )}
                />
                {errors.senha && <Text style={styles.errorText}>{errors.senha.message}</Text>}

                <Text style={[styles.label, { width: 128 }]}>Confirmar Senha</Text>
                <Controller
                    control={control}
                    name="confirmarSenha"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                        style={styles.input}
                        placeholder="Confirme sua nova senha"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        secureTextEntry={true}
                        />
                    )}
                />
                {errors.confirmarSenha && (
                    <Text style={styles.errorText}>{errors.confirmarSenha.message}</Text>
                )}

                <View style={styles.buttonSave}>
                    <Button title="Atualizar Conta" color={'#0f5d39'} onPress={handlePressUpdate} />
                </View>

                <Modal visible={showModal} animationType="fade" transparent={true} onRequestClose={() => {
                    setShowModal(false);
                }}>
                    <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setShowModal(false)}>
                        <View style={styles.centeredView}>
                            <TouchableWithoutFeedback>
                                {modalContent === 'update' ? (
                                    <View style={styles.modalView}>
                                        <Text style={styles.modalText}>Atualização de Conta!</Text>
                                        <View>
                                            <Text>
                                                Importante utilizar um email existente e funcional para caso você precise
                                                recuperar a sua senha. {'\n'}
                                                {'\n'}
                                                Utilize senhas fortes para manter sua conta segura. {'\n'}
                                                {'\n'}
                                            </Text>
                                            <View style={styles.fixToText}>
                                                <Pressable style={[styles.button, { backgroundColor: '#015b41' }]} onPress={handleConfirmUpdate}>
                                                    <Text style={styles.textButton}>Atualizar</Text>
                                                </Pressable>
                                                <Pressable style={[styles.button, { backgroundColor: '#6e7881' }]} onPress={handleCancel}>
                                                    <Text style={styles.textButton}>Cancelar</Text>
                                                </Pressable>
                                            </View>
                                        </View>
                                    </View>
                                ) : (
                                    <View style={styles.modalView}>
                                        <Text style={styles.modalText}>Você tem certeza que deseja excluir sua conta?</Text>
                                        <View>
                                            <Text>
                                                Todos os dados vinculados à sua conta serão deletados! {'\n'}
                                                {'\n'}
                                            </Text>
                                            <View style={styles.fixToText}>
                                                <Pressable style={[styles.button, { backgroundColor: '#015b41', paddingLeft: 20, paddingRight: 20 }]} onPress={handleConfirmDelete}>
                                                    <Text style={styles.textButton}>Sim</Text>
                                                </Pressable>
                                                <Pressable style={[styles.button, { backgroundColor: '#6e7881', paddingLeft: 20, paddingRight: 20 }]} onPress={handleCancel}>
                                                    <Text style={styles.textButton}>Não</Text>
                                                </Pressable>
                                            </View>
                                        </View>
                                    </View>
                                )}
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </ScrollView>
            <TouchableOpacity style={styles.deleteButton} onPress={() => {
                setModalContent('delete');
                setShowModal(true);
            }} activeOpacity={0.7}>
                <FontAwesome5 name="trash" size={20} color={'#fff'} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fc',
  },
  deleteButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgb(221, 51, 51)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: -10,
    marginLeft: 10,
    backgroundColor: '#f8f9fc',
    width: 50,
    textAlign: 'center',
    zIndex: 1,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    marginTop: -15,
    marginBottom: 10,
    marginLeft: 10,
    fontSize: 12,
  },
  buttonSave: {
    marginTop: 15,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 4,
    elevation: 2,
  },
  textButton: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.25,
    color: 'white',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 35,
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginTop: -10,
    marginBottom: 25,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Conta;