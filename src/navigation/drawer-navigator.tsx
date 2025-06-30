import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StackScreenProps } from '@react-navigation/stack';

import { RootStackParamList } from '.';
import RelatorioAnual from '~/screens/Relatorio/RelatorioAnual';
import Conta from '~/screens/Conta';
import visitaCrente from '~/screens/Visitas/VisitaCrente';
import VisitaNaoCrente from '~/screens/Visitas/VisitaNaoCrente';

type Props = StackScreenProps<RootStackParamList, 'DrawerNavigator'>;

const Drawer = createDrawerNavigator();

export default function DrawerNavigator({ navigation }: Props) {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="Relatório Anual"
        component={RelatorioAnual}
        options={{
          drawerIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Conta"
        component={Conta}
        options={{
          drawerIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Visita ao Crente"
        component={visitaCrente}
        options={{
          drawerIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Visita ao Não Crente"
        component={VisitaNaoCrente}
        options={{
          drawerIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
