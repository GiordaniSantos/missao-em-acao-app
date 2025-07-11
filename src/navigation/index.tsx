import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '~/store';
import { useEffect } from 'react';
import { verifyUserLogged } from '~/store/auth/auth-slice';
import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

export default function RootStack() {
  const dispatch = useDispatch<AppDispatch>();
  const authData = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(verifyUserLogged());
  }, []);

  if(!authData.user?.id){
    return <AuthRoutes/>;
  }

  return (
    <AppRoutes/>
  );
}
