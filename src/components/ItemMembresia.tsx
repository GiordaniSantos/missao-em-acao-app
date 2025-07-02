import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from '@expo/vector-icons/FontAwesome';
import IconCheck from '@expo/vector-icons/MaterialCommunityIcons';

interface ItemMembresiaProps {
  id: string;
  nome: string;
  quantidade: number;
  textoPosQtd: string;
  created_at?: string;
  openModal: (id: string) => void;
  onDelete: (id: string) => void;
}

const ItemMembresia: React.FC<ItemMembresiaProps> = (props) => {
  const getRightContent = () => {
    return (
      <TouchableOpacity style={styles.right} onPress={() => props.openModal && props.openModal(props.id)}>
        <Icon name='edit' size={30} color='#FFF' />
      </TouchableOpacity>
    );
  };

  const getLeftContent = () => {
    return (
      <View style={styles.left}>
        <Icon name='trash' size={20} color='#FFF' style={styles.excludeIcon} />
        <Text style={styles.excludeText}>Excluir</Text>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Swipeable
        renderRightActions={getRightContent}
        renderLeftActions={getLeftContent}
        onSwipeableLeftOpen={() => props.onDelete && props.onDelete(props.id)}
      >
        <View style={styles.container}>
          <View style={styles.checkContainer}>
            <View style={styles.done}>
              <IconCheck name='account-multiple-check' size={20} color='#FFF' />
            </View>
          </View>
          <View>
            <Text style={styles.desc}>{props.nome}: {props.quantidade} {props.textoPosQtd}</Text>
            {props.created_at && <Text style={styles.date}>{props.created_at}</Text>}
          </View>
        </View>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
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
  },
  checkContainer: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  done: {
    height: 30,
    width: 30,
    borderRadius: 33,
    backgroundColor: '#4D7031',
    alignItems: 'center',
    justifyContent: 'center'
  },
  desc: {
    color: '#222',
    fontSize: 15,
  },
  date: {
    color: '#555',
    fontSize: 12,
  },
  right: {
    backgroundColor: '#4D7031',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    marginTop: 10,
    marginLeft: -13,
    marginRight: 10
  },
  left: {
    flex: 1,
    backgroundColor: 'red',
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'center'
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

export default ItemMembresia;
