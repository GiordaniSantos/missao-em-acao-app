import { createStackNavigator } from '@react-navigation/stack';
import Inicio from '~/screens/auth/inicio';
import Login from '~/screens/auth/login';
import Register from '~/screens/auth/register';
import RequestPassword from '~/screens/auth/requestPassword';
import ModifyPassword from '~/screens/auth/modifyPassword';

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