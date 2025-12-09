import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ParamListBase } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

const Sobre = () => {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Sobre o Missão em Ação</Text>
        <Text style={styles.paragraph}>
            O Missão em Ação é o aplicativo pensado pela{' '}
            <Text style={styles.boldText}>SECRETARIA DE MISSÕES DO PRESBITÉRIO VALE DOS SINOS - RS (PRVS)</Text>
            , para Missionários do Plano Missionário Cooperativo (PMC), pastores, presbíteros e missionários em geral, oferecendo uma maneira prática, segura e organizada de prestar contas e acompanhar o trabalho missionário e pastoral.{'\n'}
        </Text>
        <Text style={styles.paragraph}>
        Gerencie de maneira prática o seu trabalho missionário e pastoral. Você pode registrar atividades, monitorar seu campo de trabalho e organizar dados essenciais tanto para missões em locais pioneiros, quanto para igrejas já bem estabelecidas. Tudo na palma da sua mão, com praticidade e eficiência. {'\n'}
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
  boldText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333'
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
    textAlign: 'justify'
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

export default Sobre;