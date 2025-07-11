import 'react-native-gesture-handler';
import { StoreWrapper } from '~/store/StoreWrapper';
import RootStack from './src/navigation';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const linking = {
  prefixes: ['exp://192.168.3.146:8081/--/missaoemacao'],
  config: {
    screens: {
      "Redefinir Senha": {
        path: 'modify-password/:token',
        parse: {
          token: (token:string) => token
        }
      }
    }
  }
}

export default function App() {
  return(
    <StoreWrapper>
      <NavigationContainer linking={linking}>
        <RootStack />
      </NavigationContainer>
    </StoreWrapper>
  );
}
