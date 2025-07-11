import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '~/store';
import { useEffect, useState } from 'react';
import { verifyUserLogged } from '~/store/auth/auth-slice';
import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo'; // Importe NetInfo e NetInfoState
import NoInternet from '~/components/NoInternet';

export default function RootStack() {
  const dispatch = useDispatch<AppDispatch>();
  const authData = useAppSelector((state) => state.auth);

  const [connState, setConnState] = useState<NetInfoState | null>(null);

  useEffect(() => {
    dispatch(verifyUserLogged());

    NetInfo.fetch().then(state => {
      setConnState(state);
    });

    const unsubscribe = NetInfo.addEventListener(state => {
      setConnState(state);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (connState && !connState.isConnected) {
    return <NoInternet />;
  }

  if(!authData.user?.id){
    return <AuthRoutes/>;
  }

  return (
    <AppRoutes/>
  );
}
