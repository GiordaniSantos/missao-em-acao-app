import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'; 


interface GenericItemProps {
  id: string;
  created_at: string;
  icon: 'atoPastoral' | string;
  openModal: (id: string) => void;
  onDelete?: (id: string) => void;
  textoAntesHora: string;
  nome?: string;
  textoNome?: string;
}


function GenericItem(props: GenericItemProps) {
  const { id, created_at, icon, openModal, onDelete, textoAntesHora, nome, textoNome } = props;

  const resultadoData = created_at.split(' ');
  const datePart = resultadoData[0];
  const timePart = resultadoData[1];

  const nameIcon = icon === 'atoPastoral' ? 'check' : 'user-check';

  const getRightContent = () => {
    return (
      <TouchableOpacity style={styles.right} onPress={() => openModal(id)}>
        <FontAwesome name='edit' size={30} color='#FFF' />
      </TouchableOpacity>
    );
  };

  const getLeftContent = () => {
    return (
      <View style={styles.left}>
        <FontAwesome name='trash' size={20} color='#FFF' style={styles.excludeIcon} />
        <Text style={styles.excludeText}>Excluir</Text>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Swipeable renderRightActions={getRightContent} renderLeftActions={getLeftContent}  onSwipeableLeftOpen={() => onDelete && onDelete(id)}>
        <View style={styles.container}>
          <View style={styles.cheackContainer}>
            <View style={styles.done}>
              <FontAwesome5 name={nameIcon} size={17} color='#FFF' />
            </View>
          </View>
          <View>
            <Text style={styles.desc}>
              {textoAntesHora} {datePart}
            </Text>
            <Text style={styles.date}>às {timePart}h</Text>
            <View style={{ flexDirection: 'row', flexGrow: 1 }}>
              {nome && (
                <Text numberOfLines={7} style={styles.date}>
                  {textoNome ? textoNome : 'Visitado: '} {nome}
                </Text>
              )}
            </View>
          </View>
        </View>
      </Swipeable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginLeft: 10,
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderTopColor: '#e3e6f0',
    borderBottomColor: '#e3e6f0',
    borderRightColor: '#e3e6f0',
    borderLeftColor: '#e3e6f0',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cheackContainer: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pending: {
    height: 25,
    width: 25,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#555',
  },
  done: {
    height: 30,
    width: 30,
    borderRadius: 33,
    backgroundColor: '#4D7031',
    alignItems: 'center',
    justifyContent: 'center',
  },
  desc: {
    color: '#222',
    fontSize: 15,
  },
  date: {
    color: '#555',
    fontSize: 12,
    flex: 1,
  },
  right: {
    backgroundColor: '#4D7031',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    marginTop: 10,
    marginLeft: -13,
    marginRight: 10,
  },
  left: {
    flex: 1,
    backgroundColor: 'red',
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  excludeText: {
    color: '#FFF',
    fontSize: 20,
    margin: 10,
  },
  excludeIcon: {
    marginLeft: 10,
  },
});

export default GenericItem;