import { createStackNavigator } from '@react-navigation/stack';
import Modal from '../screens/modal';
import DrawerNavigator from './drawer-navigator';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '~/store';
import { useEffect } from 'react';
import { actions, verifyUserLogged } from '~/store/auth/auth-slice';
import AuthRoutes from './auth.routes';

export type RootStackParamList = {
  DrawerNavigator: undefined;
  Modal: undefined;
  TabNavigator: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function RootStack() {
  const dispatch = useDispatch<AppDispatch>();
  const authData = useAppSelector((state) => state.auth);

  useEffect(() => {
    //dispatch(actions.logout());
    dispatch(verifyUserLogged());
  }, []);

  if(!authData.user?.id){
    return <AuthRoutes/>;
  }

  return (
    <Stack.Navigator initialRouteName="DrawerNavigator">
      <Stack.Screen
        name="DrawerNavigator"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Modal"
        component={Modal}
        options={{ presentation: 'modal', headerLeft: () => null }}
      />
    </Stack.Navigator>
  );
}
