import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import api from '../services/api';
import { showSweetAlert } from './sweetAlert';
import { ShowAlertErroResponseApi } from './ShowAlertErrorResponseApi';
import { actions, fetchRelatorios } from '~/store/dashboard/dashboard-slice';
import { connect } from 'react-redux';
import UpdateModal from './UpdateModal';

interface ItemData {
    id: string | number;
    [key: string]: any;
}

interface ItemBuscado {
    id: string;
    nome: string;
    created_at: Date;
}

interface GenericScreenProps {
    apiPath: string;
    itemName: string;
    renderItemComponent: React.ComponentType<any>;
    itemComponentProps?: { [key: string]: any };
    modalTitle: string;
    withNomeOnModal?: boolean;
    loadRelatorios: () => void;
    placeHolderCampoNome?: string;
    FlatListProps?: { [key: string]: any };
}

function GenericScreen({ apiPath, itemName, renderItemComponent: ItemComponent, itemComponentProps, modalTitle, withNomeOnModal = true, loadRelatorios, placeHolderCampoNome, FlatListProps }: GenericScreenProps) {
    const [items, setItems] = useState<ItemData[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [loadingItemBuscado, setLoadingItemBuscado] = useState(false);
    const [itemBuscado, setItemBuscado] = useState<ItemBuscado | null>(null);
    const [loading, setLoading] = useState(true);

    const loadItems = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get(`/${apiPath}`);
            setItems(res.data.data || []);
        } catch (e: any) {
            ShowAlertErroResponseApi(e);
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, [apiPath]);

    useEffect(() => {
        loadItems();
    }, [loadItems]);

    const addItem = useCallback(async () => {
        try {
            await api.post(`/${apiPath}`);

            showSweetAlert({
                title: 'Sucesso!',
                text: `${itemName} adicionado com Sucesso`,
                showCancelButton: false,
                cancelButtonText: 'Cancel',
                confirmButtonText: 'Ok',
                onConfirm: () => { },
                onClose: () => { },
                type: 'success',
            });
                        
            await loadItems();
            loadRelatorios();
        } catch (e: any) {
            ShowAlertErroResponseApi(e);
        }
    }, [apiPath, itemName, loadItems]);

    const updateItem = useCallback(async (itemToUpdate: ItemData) => {
        try {
            const payload: any = { ...itemToUpdate };
            if (itemToUpdate.date) {
                payload.created_at = itemToUpdate.date;
                delete payload.date;
            }

            const { id, ...dataToSend } = payload;
            await api.put(`/${apiPath}/${id}`, dataToSend);

            showSweetAlert({
                title: 'Sucesso!',
                text: `${itemName} atualizado com Sucesso`,
                showCancelButton: false,
                cancelButtonText: 'Cancel',
                confirmButtonText: 'Ok',
                onConfirm: () => { },
                onClose: () => { },
                type: 'success',
            });
            setShowModal(false);
            await loadItems();
            loadRelatorios();
        } catch (e: any) {
            ShowAlertErroResponseApi(e);
        }
    }, [apiPath, itemName, loadItems]);

    const deleteItem = useCallback(async (itemId: string | number) => {
        try {
            await api.delete(`/${apiPath}/${itemId}`);

            showSweetAlert({
                title: 'Sucesso!',
                text: `${itemName} deletado com Sucesso`,
                showCancelButton: false,
                cancelButtonText: 'Cancel',
                confirmButtonText: 'Ok',
                onConfirm: () => { },
                onClose: () => { },
                type: 'success',
            });
            await loadItems();
            loadRelatorios();
        } catch (e: any) {
            ShowAlertErroResponseApi(e);
        }
    }, [apiPath, itemName, loadItems]);

    const fetchItem = useCallback(async (id: string | number) => {
        setLoadingItemBuscado(true);
        try {
            const res = await api.get(`/${apiPath}/${id}`);
            setItemBuscado(res.data);
        } catch (e: any) {
            ShowAlertErroResponseApi(e);
            setItemBuscado(null);
        } finally {
            setLoadingItemBuscado(false);
        }
    }, [apiPath]);

    const openEditModal = useCallback(async (id: string | number) => {
        await fetchItem(id);
        setShowModal(true);
    }, [fetchItem]);

    return (
        <View style={styles.container}>
            {itemBuscado && (
                <UpdateModal
                    isVisible={showModal}
                    loading={loadingItemBuscado}
                    withNome={withNomeOnModal}
                    itemBuscado={itemBuscado}
                    tituloHeader={modalTitle}
                    placeHolderCampoNome={placeHolderCampoNome}
                    onCancel={() => setShowModal(false)}
                    onUpdate={updateItem}
                />
            )}
            <View style={styles.taskList}>
                <FlatList
                    data={items}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={({ item }) => (
                        <ItemComponent
                            {...item}
                            {...itemComponentProps}
                            openModal={() => openEditModal(item.id)}
                            onDelete={() => deleteItem(item.id)}
                        />
                    )}
                    {...FlatListProps}
                />
            </View>
            <TouchableOpacity style={styles.addButton} onPress={addItem} activeOpacity={0.7}>
                <FontAwesome name='plus' size={20} color={'#FFF'} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fc',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fc',
    },
    taskList: {
        flex: 1,
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
        alignItems: 'center'
    },
    emptyList: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyListText: {
        fontSize: 16,
        color: '#666',
    }
});

const mapDispatchToProps = (dispatch: any) => {
    return {
        loadRelatorios: () => {
            dispatch(fetchRelatorios({}));
            actions.resetParamsToDefault();
        }
    };
};

export default connect(null, mapDispatchToProps)(GenericScreen);