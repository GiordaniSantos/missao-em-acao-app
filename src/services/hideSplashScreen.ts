import * as SplashScreen from 'expo-splash-screen';

export const hideSplashScreen = async () => {
    await SplashScreen.preventAutoHideAsync();
    await SplashScreen.hideAsync();
};