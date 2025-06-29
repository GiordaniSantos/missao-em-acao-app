import { createStackNavigator } from '@react-navigation/stack';
import Inicio from '~/screens/Auth/Inicio';
import Login from '~/screens/Auth/Login';
import Register from '~/screens/Auth/Register';
import RequestPassword from '~/screens/Auth/RequestPassword';
import ModifyPassword from '~/screens/Auth/ModifyPassword';

export type AuthStackParamList = {
  'Início': undefined;
  'Entrar': undefined;
  'Redefinição de Senha': undefined;
  'Registre-se': undefined;
  'Redefinir Senha': { token: string };
};

const AuthStack = createStackNavigator<AuthStackParamList>();

const AuthRoutes = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name='Início' component={Inicio} options={{ headerShown: false }} />
      <AuthStack.Screen name='Entrar' component={Login} />
      <AuthStack.Screen name='Registre-se' component={Register} />
      <AuthStack.Screen name='Redefinição de Senha' component={RequestPassword} />
      <AuthStack.Screen name='Redefinir Senha' component={ModifyPassword} />
    </AuthStack.Navigator>
  );
};

export default AuthRoutes;