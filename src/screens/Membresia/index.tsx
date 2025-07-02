import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, TextInput, Text, ActivityIndicator } from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppSelector } from '~/store';
import AddModalMembresia from '~/components/AddModalMembresia';
import api from '../../services/api';
import ItemMembresia from '~/components/ItemMembresia';
import { showSweetAlert } from '~/components/sweetAlert';
import UpdateModalMembresia from '~/components/UpdateModalMembresia';
import { actions, fetchRelatorios } from '~/store/dashboard/dashboard-slice';
import { connect } from 'react-redux';
import { ShowAlertErroResponseApi } from '~/components/ShowAlertErrorResponseApi';

interface Membro {
  id: string;
  nome: string;
  quantidade: number;
  created_at: string;
  id_usuario: string | number;
}

interface ComunganteFormFields {
  comunganteQtd: string;
}

interface NaoComunganteFormFields {
  naoComunganteQtd: string;
}

interface NovaMembresia {
  nome: string;
  quantidade: number;
  id_usuario: string | number;
}

const comunganteSchema = yup.object().shape({
  comunganteQtd: yup.string()
    .required('A quantidade de comungantes é obrigatória.')
    .test('is-numeric', 'A quantidade deve ser um número válido.', value => {
      return !isNaN(Number(value));
    })
    .test('is-positive', 'A quantidade deve ser maior ou igual a zero.', value => {
      return Number(value) >= 0;
    }),
});

const naoComunganteSchema = yup.object().shape({
  naoComunganteQtd: yup.string()
    .required('A quantidade de não comungantes é obrigatória.')
    .test('is-numeric', 'A quantidade deve ser um número válido.', value => {
      return !isNaN(Number(value));
    })
    .test('is-positive', 'A quantidade deve ser maior ou igual a zero.', value => {
      return Number(value) >= 0;
    }),
});

interface MembresiaProps {
  loadRelatorios: () => void;
}

function Membresia({ loadRelatorios }: MembresiaProps) {
 
  const userId = useAppSelector((state: any) => state.auth.user.id as string | number);

  const [showModal, setShowModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [loadingItemBuscado, setLoadingItemBuscado] = useState(false);
  const [comunganteId, setComunganteId] = useState<string | null>(null);
  const [naoComunganteId, setNaoComunganteId] = useState<string | null>(null);
  const [membresiaBuscado, setMembresiaBuscado] = useState<Membro | null>(null);
  const [membros, setMembros] = useState<Membro[]>([]);

  const { control: comunganteControl, handleSubmit: handleComunganteSubmit, setValue: setComunganteValue, formState: { errors: comunganteErrors }} = useForm<ComunganteFormFields>({
    resolver: yupResolver(comunganteSchema),
    defaultValues: { comunganteQtd: '0' },
  });

  const { control: naoComunganteControl, handleSubmit: handleNaoComunganteSubmit, setValue: setNaoComunganteValue, formState: { errors: naoComunganteErrors } } = useForm<NaoComunganteFormFields>({
    resolver: yupResolver(naoComunganteSchema),
    defaultValues: { naoComunganteQtd: '0' },
  });

  const loadComungante = useCallback(async () => {
    try {
      const res = await api.get(`/comungante`);
      if (res.data) {
        setComunganteValue('comunganteQtd', res.data.quantidade.toString());
        setComunganteId(res.data.id);
      }
    } catch (e: any) {
       ShowAlertErroResponseApi(e);
    }
  }, [setComunganteValue]);

  const loadNaoComungante = useCallback(async () => {
    try {
      const res = await api.get(`/nao-comungante`);
      if (res.data) {
        setNaoComunganteValue('naoComunganteQtd', res.data.quantidade.toString());
        setNaoComunganteId(res.data.id);
      }
    } catch (e: any) {
      ShowAlertErroResponseApi(e);
    }
  }, [setNaoComunganteValue]);

  const loadMembros = useCallback(async () => {
    try {
      const res = await api.get(`/membresia`);
      setMembros(res.data.data);
    } catch (e: any) {
      ShowAlertErroResponseApi(e);
    }
  }, [])

  useEffect(() => {
    loadMembros();
    loadComungante();
    loadNaoComungante();
  }, [loadMembros, loadComungante, loadNaoComungante]);

  const updateComungante = async (quantidade: number) => {
    try {
      await api.put(`/comungante/${comunganteId}?id_usuario=${userId}`, {
        id_usuario: userId,
        quantidade: quantidade,
      });

      showSweetAlert({
        title: 'Sucesso!',
        text: 'Comungantes atualizados com sucesso!',
        showCancelButton: false,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Ok',
        onConfirm: () => { },
        onClose: () => { },
        type: 'success',
      });
      loadComungante();
      loadRelatorios();
    } catch (e: any) {
      ShowAlertErroResponseApi(e);
    }
  };

  const addComungante = async (quantidade: number) => {
    try {
      await api.post(`/comungante`, {
        id_usuario: userId,
        quantidade: quantidade,
      });

      showSweetAlert({
        title: 'Sucesso!',
        text: 'Comungantes adicionados com sucesso!',
        showCancelButton: false,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Ok',
        onConfirm: () => { },
        onClose: () => { },
        type: 'success',
      });
      loadComungante();
      loadRelatorios();
    } catch (e: any) {
      ShowAlertErroResponseApi(e);
    }
  };

  const updateOrCreateComungante = async (data: ComunganteFormFields) => {
    const quantidade = Number(data.comunganteQtd);
    if (comunganteId) {
      await updateComungante(quantidade);
    } else {
      await addComungante(quantidade);
    }
  };

  const updateNaoComungante = async (quantidade: number) => {
    try {
      await api.put(`/nao-comungante/${naoComunganteId}?id_usuario=${userId}`, {
        id_usuario: userId,
        quantidade: quantidade,
      });

      showSweetAlert({
        title: 'Sucesso!',
        text: 'Não comungantes atualizados com sucesso!',
        showCancelButton: false,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Ok',
        onConfirm: () => { },
        onClose: () => { },
        type: 'success',
      });
      loadNaoComungante();
      loadRelatorios();
    } catch (e: any) {
      ShowAlertErroResponseApi(e);
    }
  };

  const addNaoComungante = async (quantidade: number) => {
    try {
      await api.post(`/nao-comungante`, {
        id_usuario: userId,
        quantidade: quantidade,
      });

      showSweetAlert({
        title: 'Sucesso!',
        text: 'Não comungantes adicionados com sucesso!',
        showCancelButton: false,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Ok',
        onConfirm: () => { },
        onClose: () => { },
        type: 'success',
      });
      loadNaoComungante();
      loadRelatorios();
    } catch (e: any) {
      ShowAlertErroResponseApi(e);
    }
  };

  const updateOrCreateNaoComungante = async (data: NaoComunganteFormFields) => {
    const quantidade = Number(data.naoComunganteQtd);
    if (naoComunganteId) {
      await updateNaoComungante(quantidade);
    } else {
      await addNaoComungante(quantidade);
    }
  };

  const updateMembresia = async (membresia: Membro) => {
    try {
      await api.put(`/membresia/${membresia.id}?id_usuario=${userId}`, {
        nome: membresia.nome,
        quantidade: membresia.quantidade,
        created_at: membresia.created_at,
        id_usuario: userId,
      });

      showSweetAlert({
        title: 'Sucesso!',
        text: 'Membresia atualizada com sucesso!',
        showCancelButton: false,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Ok',
        onConfirm: () => { },
        onClose: () => { },
        type: 'success',
      });
      setShowModalEdit(false);
      loadMembros();
      loadRelatorios();
    } catch (e: any) {
      ShowAlertErroResponseApi(e);
    }
  };

  const buscarMembresia = async (id: string) => {
    setLoadingItemBuscado(true);
    try {
      const res = await api.get(`/membresia/${id}`);
      setMembresiaBuscado(res.data);
    } catch (e: any) {
      ShowAlertErroResponseApi(e);
      setMembresiaBuscado(null);
    } finally {
      setLoadingItemBuscado(false);
    }
  };

  const abrirModalEdit = async (id: string) => {
    await buscarMembresia(id);
    setShowModalEdit(true);
  };

  const addMembresia = async (newMembro: NovaMembresia) => {
    try {
      await api.post(`/membresia`, {
        nome: newMembro.nome,
        quantidade: newMembro.quantidade,
        id_usuario: newMembro.id_usuario,
      });

      showSweetAlert({
        title: 'Sucesso!',
        text: 'Membresia adicionada com sucesso!',
        showCancelButton: false,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Ok',
        onConfirm: () => { },
        onClose: () => { },
        type: 'success',
      });
      setShowModal(false);
      loadMembros();
      loadRelatorios();
    } catch (e: any) {
      ShowAlertErroResponseApi(e);
    }
  };

  const deleteMembresia = async (membroId: string) => {
    try {
      await api.delete(`/membresia/${membroId}`);
      showSweetAlert({
        title: 'Sucesso!',
        text: 'Membresia deletada com sucesso!',
        showCancelButton: false,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Ok',
        onConfirm: () => { },
        onClose: () => { },
        type: 'success',
      });
      loadMembros();
      loadRelatorios();
    } catch (e: any) {
      ShowAlertErroResponseApi(e);
    }
  };

  return (
    <View style={styles.container}>
      <AddModalMembresia
        isVisible={showModal}
        tituloHeader={"Nova membresia"}
        dataSelect={["Primeiro Domingo", "Segundo Domingo", "Terceiro Domingo", "Quarto Domingo"]}
        onCancel={() => setShowModal(false)}
        onSave={addMembresia}
        userId={userId}
      />
      <UpdateModalMembresia
        isVisible={showModalEdit}
        loading={loadingItemBuscado}
        itemBuscado={membresiaBuscado}
        dataSelect={["Primeiro Domingo", "Segundo Domingo", "Terceiro Domingo", "Quarto Domingo"]}
        tituloHeader={"Editar Membresia"}
        onCancel={() => setShowModalEdit(false)}
        onUpdate={updateMembresia}
      />
      <View style={styles.containerInputs}>
        <View style={styles.inputSection}>
          <Text style={styles.label}>Comungantes</Text>
          <Controller
            control={comunganteControl}
            name="comunganteQtd"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, comunganteErrors.comunganteQtd && styles.inputError]}
                keyboardType="numeric"
                placeholder="Digite a quantidade"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {comunganteErrors.comunganteQtd && (
            <Text style={styles.errorText}>{comunganteErrors.comunganteQtd.message}</Text>
          )}
          <TouchableOpacity onPress={handleComunganteSubmit(updateOrCreateComungante)} style={styles.appButtonContainer}>
            <Text style={styles.appButtonText}>Atualizar Comungante</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputSection}>
          <Text style={styles.label}>Não Comungantes</Text>
          <Controller
            control={naoComunganteControl}
            name="naoComunganteQtd"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, naoComunganteErrors.naoComunganteQtd && styles.inputError]}
                keyboardType="numeric"
                placeholder="Digite a quantidade"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {naoComunganteErrors.naoComunganteQtd && (
            <Text style={styles.errorText}>{naoComunganteErrors.naoComunganteQtd.message}</Text>
          )}
          <TouchableOpacity onPress={handleNaoComunganteSubmit(updateOrCreateNaoComungante)} style={styles.appButtonContainer}>
            <Text style={styles.appButtonText}>Atualizar Não Comungante</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.taskList}>
        <FlatList
          data={membros}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ItemMembresia {...item} openModal={abrirModalEdit} textoPosQtd={"membros"} onDelete={deleteMembresia} />
          )}
        />
      </View>
      <TouchableOpacity style={styles.addButton} onPress={() => setShowModal(true)} activeOpacity={0.7}>
        <Icon name='plus' size={20} color={'#FFF'} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#0f5d39",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  appButtonText: {
    fontSize: 13,
    color: "#fff",
    fontWeight: "bold",
    textAlign: 'center',
    textTransform: "uppercase",
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fc',
  },
  containerInputs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  inputSection: {
    flex: 1,
    marginHorizontal: 5,
  },
  taskList: {
    flex: 1,
    marginBottom: 20,
    paddingHorizontal: 7,
  },
  label: {
    fontSize: 15,
    marginBottom: 5,
    marginLeft: 5,
    backgroundColor: '#f8f9fc',
    alignSelf: 'flex-start',
    paddingHorizontal: 5,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 5,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#dc3545',
  },
  errorText: {
    color: '#dc3545',
    marginLeft: 5,
    marginBottom: 5,
    fontSize: 12,
  },
  addButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0f5d39',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    loadRelatorios: () => {
      dispatch(fetchRelatorios({}));
      actions.resetParamsToDefault();
    }
  };
};

export default connect(null, mapDispatchToProps)(Membresia);