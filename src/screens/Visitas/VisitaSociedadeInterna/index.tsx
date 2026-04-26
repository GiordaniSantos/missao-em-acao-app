import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, TextInput, Text, ActivityIndicator } from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppSelector } from '~/store';
import AddModalSociedadeInterna from '~/components/AddModalSociedadeInterna';
import api from '~/services/api';
import ItemSociedadeInterna from '~/components/ItemSociedadeInterna';
import { showSweetAlert } from '~/components/sweetAlert';
import UpdateModalSociedadeInterna from '~/components/UpdateModalSociedadeInterna';
import { actions, fetchRelatorios } from '~/store/dashboard/dashboard-slice';
import { connect } from 'react-redux';
import { ShowAlertErroResponseApi } from '~/components/ShowAlertErrorResponseApi';

interface SociedadeInterna {
  id: string;
  nome: string;
  created_at: string;
  id_usuario: string | number;
}

interface NovaSociedadeInterna {
  nome: string;
  id_usuario: string | number;
}

interface SociedadeInternaProps {
  loadRelatorios: () => void;
}

function SociedadeInterna({ loadRelatorios }: SociedadeInternaProps) {
 
  const userId = useAppSelector((state: any) => state.auth.user.id as string | number);

  const [showModal, setShowModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [loadingItemBuscado, setLoadingItemBuscado] = useState(false);
  const [sociedadeInternaBuscada, setSociedadeInternaBuscada] = useState<SociedadeInterna | null>(null);
  const [sociedadeinternas, setSociedadeInternas] = useState<SociedadeInterna[]>([]);

  const loadSociedadesInternas = useCallback(async () => {
    try {
      const res = await api.get(`/sociedades-internas`);
      setSociedadeInternas(res.data.data);
    } catch (e: any) {
      ShowAlertErroResponseApi(e);
    }
  }, [])

  useEffect(() => {
    loadSociedadesInternas();
  }, [loadSociedadesInternas]);

  const updateSociedadeInterna = async (sociedadeinterna: SociedadeInterna) => {
    try {
      await api.put(`/sociedades-internas/${sociedadeinterna.id}?id_usuario=${userId}`, {
        nome: sociedadeinterna.nome,
        created_at: sociedadeinterna.created_at,
        id_usuario: userId,
      });

      showSweetAlert({
        title: 'Sucesso!',
        text: 'Visita à Sociedade Interna atualizada com sucesso!',
        showCancelButton: false,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Ok',
        onConfirm: () => { },
        onClose: () => { },
        type: 'success',
      });
      setShowModalEdit(false);
      loadSociedadesInternas();
      loadRelatorios();
    } catch (e: any) {
      ShowAlertErroResponseApi(e);
    }
  };

  const buscarSociedadeInterna = async (id: string) => {
    setLoadingItemBuscado(true);
    try {
      const res = await api.get(`/sociedades-internas/${id}`);
      setSociedadeInternaBuscada(res.data);
    } catch (e: any) {
      ShowAlertErroResponseApi(e);
      setSociedadeInternaBuscada(null);
    } finally {
      setLoadingItemBuscado(false);
    }
  };

  const abrirModalEdit = async (id: string) => {
    await buscarSociedadeInterna(id);
    setShowModalEdit(true);
  };

  const addSociedadeInterna = async (newSociedadeInterna: NovaSociedadeInterna) => {
    try {
      await api.post(`/sociedades-internas`, {
        nome: newSociedadeInterna.nome,
        id_usuario: newSociedadeInterna.id_usuario,
      });

      showSweetAlert({
        title: 'Sucesso!',
        text: 'Visita à Sociedade Interna adicionada com sucesso!',
        showCancelButton: false,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Ok',
        onConfirm: () => { },
        onClose: () => { },
        type: 'success',
      });
      setShowModal(false);
      loadSociedadesInternas();
      loadRelatorios();
    } catch (e: any) {
      ShowAlertErroResponseApi(e);
    }
  };

  const deleteSociedadeInterna = async (sociedadeinternaId: string) => {
    try {
      await api.delete(`/sociedades-internas/${sociedadeinternaId}`);
      showSweetAlert({
        title: 'Sucesso!',
        text: 'Visita à Sociedade Interna deletada com sucesso!',
        showCancelButton: false,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Ok',
        onConfirm: () => { },
        onClose: () => { },
        type: 'success',
      });
      loadSociedadesInternas();
      loadRelatorios();
    } catch (e: any) {
      ShowAlertErroResponseApi(e);
    }
  };

  return (
    <View style={styles.container}>
      <AddModalSociedadeInterna
        isVisible={showModal}
        tituloHeader={"Nova Visita à Sociedade Interna"}
        dataSelect={["UCP", "UPA", "UMP", "UPH", "SAF"]}
        onCancel={() => setShowModal(false)}
        onSave={addSociedadeInterna}
        userId={userId}
      />
      <UpdateModalSociedadeInterna
        isVisible={showModalEdit}
        loading={loadingItemBuscado}
        itemBuscado={sociedadeInternaBuscada}
        dataSelect={["UCP", "UPA", "UMP", "UPH", "SAF"]}
        tituloHeader={"Editar Visita à Sociedade Interna"}
        onCancel={() => setShowModalEdit(false)}
        onUpdate={updateSociedadeInterna}
      />
      <View style={styles.taskList}>
        <FlatList
          data={sociedadeinternas}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ItemSociedadeInterna {...item} openModal={abrirModalEdit} onDelete={deleteSociedadeInterna} />
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

export default connect(null, mapDispatchToProps)(SociedadeInterna);