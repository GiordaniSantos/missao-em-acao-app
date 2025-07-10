import React, { useState, useEffect, Component } from 'react';
import { useDispatch } from 'react-redux';
import { Text, View, StyleSheet, StatusBar, Modal, TouchableOpacity, Image, TouchableWithoutFeedback, Linking, ImageSourcePropType } from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome5';
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation, ParamListBase, useIsFocused } from '@react-navigation/native';
import Membresia from '~/screens/Membresia';
import RelatorioMensal from '~/screens/Relatorio/RelatorioMensal';
import VisitaCrente from '~/screens/Visitas/VisitaCrente';
import VisitaNaoCrente from '~/screens/Visitas/VisitaNaoCrente';
import VisitaPresidio from '~/screens/Visitas/VisitaPresidio';
import VisitaEnfermo from '~/screens/Visitas/VisitaEnfermo';
import VisitaHospital from '~/screens/Visitas/VisitaHospital';
import VisitaEscola from '~/screens/Visitas/VisitaEscola';
import BatismoInfantil from '~/screens/AtoPastoral/BatismoInfantil';
import BatismoProfissao from '~/screens/AtoPastoral/BatismoProfissao';
import BencaoNupcial from '~/screens/AtoPastoral/BencaoNupcial';
import SantaCeia from '~/screens/AtoPastoral/SantaCeia';
import Estudo from '~/screens/Ministracao/Estudo';
import Sermao from '~/screens/Ministracao/Sermao';
import EstudoBiblico from '~/screens/Ministracao/EstudoBiblico';
import RelatorioAnual from '~/screens/Relatorio/RelatorioAnual';
import Discipulado from '~/screens/Ministracao/Discipulado';
import Conta from '~/screens/Conta';

const image: ImageSourcePropType = require('../../assets/imgs/logo-menu.png');

import { AppDispatch } from '~/store';
import { actions } from '~/store/auth/auth-slice';
import SweetAlert from '~/components/sweetAlert';

interface Route {
  name: string;
  component: React.ComponentType<any>;
}

interface DrawerItemConfig {
  name: string;
  labelStyle?: object;
  style?: object;
  icon: string;
}

const routes: Route[] = [
  { name: 'Início', component: RelatorioMensal },
  { name: 'Relatório Anual', component: RelatorioAnual },
  { name: 'Frequência aos Domingos', component: Membresia },
  { name: 'Estudos', component: Estudo },
  { name: 'Sermões', component: Sermao },
  { name: 'Estudos Biblicos', component: EstudoBiblico },
  { name: 'Discipulados', component: Discipulado },
  { name: 'Batismos Infantis', component: BatismoInfantil },
  { name: 'Batismos e Profissões de Fé', component: BatismoProfissao },
  { name: 'Benções Nupciais', component: BencaoNupcial },
  { name: 'Santas Ceias', component: SantaCeia },
  { name: 'Visitas aos Crentes', component: VisitaCrente },
  { name: 'Visitas aos Não Crentes', component: VisitaNaoCrente },
  { name: 'Visitas aos Presídios', component: VisitaPresidio },
  { name: 'Visitas aos Enfermos', component: VisitaEnfermo },
  { name: 'Visitas aos Hospitais', component: VisitaHospital },
  { name: 'Visitas às Escolas', component: VisitaEscola },
  { name: 'Conta', component: Conta },
];

const routesDrawerItem: DrawerItemConfig[] = [
  { name: 'Início', labelStyle: { marginLeft: 4 }, icon: 'home' },
  { name: 'Relatório Anual', labelStyle: { marginLeft: 4 }, icon: 'chart-bar' },
  { name: 'Frequência aos Domingos', labelStyle: { marginLeft: 4 }, icon: 'calendar-check' },
];

const routesMinistracaoDrawerItem: DrawerItemConfig[] = [
  { name: 'Estudos', labelStyle: { marginLeft: 5 }, style: { marginTop:5, marginLeft: 10, marginRight: 10, marginBottom: 5 }, icon: 'book' },
  { name: 'Sermões', labelStyle: { marginLeft: 5 }, style: { marginLeft: 10, marginRight: 10, marginBottom: 5 }, icon: 'user-tie' },
  { name: 'Estudos Biblicos', labelStyle: { marginLeft: 5 }, style: { marginLeft: 10, marginRight: 10, marginBottom: 5 }, icon: 'bible' },
  { name: 'Discipulados', labelStyle: { marginLeft: 5 }, style: { marginLeft: 10, marginRight: 10, marginBottom: 5 }, icon: 'people-arrows' },
];

const routesAtoPastoralDrawerItem: DrawerItemConfig[] = [
  { name: 'Batismos Infantis', labelStyle: { marginLeft: 5 }, style: { marginTop:5, marginLeft: 10, marginRight: 10, marginBottom: 5 }, icon: 'child' },
  { name: 'Batismos e Profissões de Fé', labelStyle: { marginLeft: 5 }, style: { marginLeft: 10, marginRight: 10, marginBottom: 5 }, icon: 'praying-hands' },
  { name: 'Benções Nupciais', labelStyle: { marginLeft: 5 }, style: { marginLeft: 10, marginRight: 10, marginBottom: 5 }, icon: 'hand-holding-heart' },
  { name: 'Santas Ceias', labelStyle: { marginLeft: 5 }, style: { marginLeft: 10, marginRight: 10, marginBottom: 5 }, icon: 'wine-glass-alt' },
];

const routesVisitacaoDrawerItem: DrawerItemConfig[] = [
  { name: 'Visitas aos Crentes', labelStyle: { marginLeft: 5 }, style: { marginTop:5, marginLeft: 10, marginRight: 10, marginBottom: 5 }, icon: 'cross' },
  { name: 'Visitas aos Não Crentes', labelStyle: { marginLeft: 5 }, style: { marginLeft: 10, marginRight: 10, marginBottom: 5 }, icon: 'heart-broken' },
  { name: 'Visitas aos Presídios', labelStyle: { marginLeft: 5 }, style: { marginLeft: 10, marginRight: 10, marginBottom: 5 }, icon: 'user-lock' },
  { name: 'Visitas aos Enfermos', labelStyle: { marginLeft: 5 }, style: { marginLeft: 10, marginRight: 10, marginBottom: 5 }, icon: 'syringe' },
  { name: 'Visitas aos Hospitais', labelStyle: { marginLeft: 5 }, style: { marginLeft: 10, marginRight: 10, marginBottom: 5 }, icon: 'hospital' },
  { name: 'Visitas às Escolas', labelStyle: { marginLeft: 5 }, style: { marginLeft: 10, marginRight: 10, marginBottom: 5 }, icon: 'school' },
];

const routeExpansionMap: { [key: string]: { showVisitacao: boolean; showAtoPastoral: boolean; showPregacao: boolean } } = {
  'Visitas aos Crentes': { showVisitacao: true, showAtoPastoral: false, showPregacao: false },
  'Visitas aos Não Crentes': { showVisitacao: true, showAtoPastoral: false, showPregacao: false },
  'Visitas aos Presídios': { showVisitacao: true, showAtoPastoral: false, showPregacao: false },
  'Visitas aos Enfermos': { showVisitacao: true, showAtoPastoral: false, showPregacao: false },
  'Visitas aos Hospitais': { showVisitacao: true, showAtoPastoral: false, showPregacao: false },
  'Visitas às Escolas': { showVisitacao: true, showAtoPastoral: false, showPregacao: false },
  'Estudos': { showAtoPastoral: true, showPregacao: false, showVisitacao: false },
  'Sermões': { showAtoPastoral: true, showPregacao: false, showVisitacao: false },
  'Estudos Biblicos': { showAtoPastoral: true, showPregacao: false, showVisitacao: false },
  'Discipulados': { showAtoPastoral: true, showPregacao: false, showVisitacao: false },
  'Batismos Infantis': { showPregacao: true, showAtoPastoral: false, showVisitacao: false },
  'Batismos e Profissões de Fé': { showPregacao: true, showAtoPastoral: false, showVisitacao: false },
  'Benções Nupciais': { showPregacao: true, showAtoPastoral: false, showVisitacao: false },
  'Santas Ceias': { showPregacao: true, showAtoPastoral: false, showVisitacao: false },
  'Início': { showPregacao: false, showAtoPastoral: false, showVisitacao: false },
  'Relatório Anual': { showPregacao: false, showAtoPastoral: false, showVisitacao: false },
  'Frequência aos Domingos': { showPregacao: false, showAtoPastoral: false, showVisitacao: false },
  'Conta': { showPregacao: false, showAtoPastoral: false, showVisitacao: false },
};

const getActiveRouteState = (routes: any[], index: number, name: string): boolean => {
  return routes[index]?.name?.trim().toLowerCase() === name.trim().toLowerCase();
};

interface CustomDrawerContentProps extends DrawerContentComponentProps{}

const CustomDrawerContent: React.FC<CustomDrawerContentProps> = (props) => {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();
  const dispatch = useDispatch<AppDispatch>();
  const isFocused = useIsFocused();

  const [isShowAtoPastoral, setShowAtoPastoral] = useState(false);
  const [isShowPregacao, setShowPregacao] = useState(false);
  const [isShowVisitacao, setShowVisitacao] = useState(false);

  useEffect(() => {
    if (isFocused && props.state.routes[props.state.index]) {
      const currentRouteName = props.state.routes[props.state.index].name;
      const routeConfig = routeExpansionMap[currentRouteName];
      if (routeConfig) {
        setShowVisitacao(routeConfig.showVisitacao);
        setShowAtoPastoral(routeConfig.showAtoPastoral);
        setShowPregacao(routeConfig.showPregacao);
      }
    }
  }, [props.state.routes, props.state.index, isFocused]);

  return (
    <DrawerContentScrollView {...props}>
      <StatusBar translucent backgroundColor="rgba(0, 0, 0, 0.24)" animated />
      <SweetAlert />
      <View style={styles.container}>
        <View style={styles.userArea}>
          <Image source={image} style={styles.user} />
          <Text style={styles.title}>Missão em Ação</Text>
        </View>
        <View style={styles.containerMenus}>
          {routesDrawerItem.map((route, index) => (
            <DrawerItem
              label={route.name}
              key={index}
              activeBackgroundColor='#0f5d39'
              activeTintColor='#fff'
              labelStyle={route.labelStyle}
              style={{marginBottom: 2}}
              focused={getActiveRouteState(props.state.routes, props.state.index, route.name)}
              icon={({ color }) => (
                <Icon size={21} name={route.icon as any} style={{ color: color }} />
              )}
              onPress={() => navigation.navigate(route.name)}
            />
          ))}

          {isShowAtoPastoral && <View style={styles.separator} />}
          <DrawerItem
            label="Ministração"
            labelStyle={{ marginLeft: 7 }}
            activeBackgroundColor='#0f5d39'
            activeTintColor='#fff'
            focused={getActiveRouteState(props.state.routes, props.state.index, 'Ministração')}
            icon={({ color }) => (
              <Icon size={23} name={isShowAtoPastoral ? 'angle-up' : 'angle-down'} style={{ color: color, marginLeft: 2 }} />
            )}
            onPress={() => setShowAtoPastoral(!isShowAtoPastoral)}
          />
          {isShowAtoPastoral && (
            <View>
              {routesMinistracaoDrawerItem.map((route, index) => (
                <DrawerItem
                  label={route.name}
                  key={index}
                  activeBackgroundColor='#0f5d39'
                  activeTintColor='#fff'
                  labelStyle={route.labelStyle}
                  style={route.style}
                  focused={getActiveRouteState(props.state.routes, props.state.index, route.name)}
                  icon={({ color }) => (
                    <Icon size={21} name={route.icon as any} style={{ color: color }} />
                  )}
                  onPress={() => navigation.navigate(route.name)}
                />
              ))}
            </View>
          )}

          {(isShowAtoPastoral || isShowPregacao) && <View style={styles.separator} />}
          <DrawerItem
            label="Ato Pastoral"
            labelStyle={{ marginLeft: 7 }}
            activeBackgroundColor='#0f5d39'
            activeTintColor='#fff'
            focused={getActiveRouteState(props.state.routes, props.state.index, 'Ato Pastoral')}
            icon={({ color }) => (
              <Icon size={23} name={isShowPregacao ? 'angle-up' : 'angle-down'} style={{ color: color, marginLeft: 2 }} />
            )}
            onPress={() => setShowPregacao(!isShowPregacao)}
          />
          {isShowPregacao && (
            <View>
              {routesAtoPastoralDrawerItem.map((route, index) => (
                <DrawerItem
                  label={route.name}
                  key={index}
                  activeBackgroundColor='#0f5d39'
                  activeTintColor='#fff'
                  labelStyle={route.labelStyle}
                  style={route.style}
                  focused={getActiveRouteState(props.state.routes, props.state.index, route.name)}
                  icon={({ color }) => (
                    <Icon size={21} name={route.icon as any} style={{ color: color }} />
                  )}
                  onPress={() => navigation.navigate(route.name)}
                />
              ))}
            </View>
          )}

          {(isShowPregacao || isShowVisitacao) && <View style={styles.separator} />}
          <DrawerItem
            label="Visitação"
            labelStyle={{ marginLeft: 7 }}
            activeBackgroundColor='#0f5d39'
            activeTintColor='#fff'
            focused={getActiveRouteState(props.state.routes, props.state.index, 'Visitação')}
            icon={({ color }) => (
              <Icon size={23} name={isShowVisitacao ? 'angle-up' : 'angle-down'} style={{ color: color, marginLeft: 2 }} />
            )}
            onPress={() => setShowVisitacao(!isShowVisitacao)}
          />
          {isShowVisitacao && (
            <View>
              {routesVisitacaoDrawerItem.map((route, index) => (
                <DrawerItem
                  label={route.name}
                  key={index}
                  activeBackgroundColor='#0f5d39'
                  activeTintColor='#fff'
                  labelStyle={route.labelStyle}
                  style={route.style}
                  focused={getActiveRouteState(props.state.routes, props.state.index, route.name)}
                  icon={({ color }) => (
                    <Icon size={21} name={route.icon as any} style={{ color: color }} />
                  )}
                  onPress={() => navigation.navigate(route.name)}
                />
              ))}
            </View>
          )}
          {isShowVisitacao && <View style={styles.separator} />}

          <DrawerItem
            label="Conta"
            activeBackgroundColor='#0f5d39'
            activeTintColor='#fff'
            labelStyle={{ marginLeft: 7 }}
            style={{marginBottom: 2}} 
            focused={getActiveRouteState(props.state.routes, props.state.index, 'Conta')}
            icon={({ color }) => (
              <Icon size={21} name={'user-circle'} style={{ color: color }} />
            )}
            onPress={() => navigation.navigate("Conta")}
          />
          <DrawerItem
            label="Sair"
            labelStyle={{ marginLeft: 7 }}
            icon={({ color }) => <Icon size={21} name={'sign-out-alt'} style={{ color: color }} />}
            onPress={() => dispatch(actions.logout())}
          />
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

const Drawer = createDrawerNavigator();

interface AppRoutesState {
  isModalVisible: boolean;
}

export default class AppRoutes extends Component<{}, AppRoutesState> {
  state = {
    isModalVisible: false,
  };

  toggleModal = () => {
    this.setState(prevState => ({ isModalVisible: !prevState.isModalVisible }));
  };

  render() {
    return (
      <Drawer.Navigator
        screenOptions={{
          drawerActiveBackgroundColor: '#0f5d39',
          drawerActiveTintColor: '#fff',
          headerStyle: {
            backgroundColor: '#0f5d39',
          },
          headerTintColor: '#FFF',
          headerTitleStyle: {
            fontSize: 16,
            color: '#fff',
          },
          headerRight: () => (
            <View style={{ marginRight: 10 }}>
              <TouchableOpacity onPress={this.toggleModal} activeOpacity={0.1}>
                <Icon size={24} style={{ color: '#FFF' }} name={'question-circle'} />
              </TouchableOpacity>
              <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.isModalVisible}
                onRequestClose={() => this.toggleModal()}
              >
                <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => this.toggleModal()}>
                  <View style={styles.centeredView}>
                    <TouchableWithoutFeedback>
                      <View style={styles.modalView}>
                        <Text style={styles.modalText}>Orientações de Uso</Text>
                        <View>
                          <Text>
                            Navegue pelo menu à esquerda para começar a utilizar os recursos. {'\n'}{'\n'}
                            Na tela inicial, arraste o dedo para baixo para manter os dados atualizados. {'\n'}{'\n'}
                            Para adicionar um registro basta tocar no círculo com ícone de +. {'\n'}{'\n'}
                            Para remover um registro deslize a caixa para à direita até o final. {'\n'}{'\n'}
                            Para editar um registro deslize a caixa para à esquerda e clique no ícone de editar.
                          </Text>
                        </View>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </TouchableOpacity>
              </Modal>
            </View>
          ),
        }}
        initialRouteName="Início"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        {routes.map((route, index) => (
          <Drawer.Screen
            key={index}
            name={route.name}
            component={route.component}
            options={{
              drawerItemStyle: {
                height: 0,
              },
            }}
          />
        ))}
      </Drawer.Navigator>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: -15,
    marginRight: -15,
  },
  containerMenus: {
    marginLeft: 15,
    marginRight: 15
  },
  userArea: {
    marginTop: -500,
    paddingTop: 500,
    paddingBottom: 5,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    backgroundColor: '#0f5d39',
  },
  user: {
    width: 120,
    height: 120,
  },
  title: {
    marginTop: -18,
    marginBottom: 15,
    fontSize: 18,
    letterSpacing: 1,
    fontWeight: 'bold',
    color: '#FFF',
  },
  separator: {
    borderTopColor: '#cfcfcf',
    borderTopWidth: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
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