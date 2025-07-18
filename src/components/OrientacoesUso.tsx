import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ParamListBase } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

const OrientacoesDeUso = () => {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Orientações de Uso</Text>
        <Text style={styles.paragraph}>
          Navegue pelo menu à esquerda para começar a utilizar os recursos. {'\n'}
        </Text>
        <Text style={styles.paragraph}>
          Na tela inicial, arraste o dedo para baixo para manter os dados atualizados. {'\n'}
        </Text>
        <Text style={styles.paragraph}>
          Para adicionar um registro basta tocar no círculo com ícone de +. {'\n'}
        </Text>
        <Text style={styles.paragraph}>
          Para remover um registro deslize a caixa para à direita até o final. {'\n'}
        </Text>
        <Text style={styles.paragraph}>
          Para editar um registro deslize a caixa para à esquerda e clique no ícone de editar.
        </Text>
      </View>
        <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Início')} activeOpacity={0.7}>
          <Text style={styles.homeButtonText}>Voltar ao Início</Text>
        </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    marginTop: 25,
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#f5f5f5',
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '90%',
    maxWidth: 500,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#0f5d39',
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 24,
    color: '#333',
  },
  homeButton: {
    marginTop: 30,
    backgroundColor: '#0f5d39',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OrientacoesDeUso;