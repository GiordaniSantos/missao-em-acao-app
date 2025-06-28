import { Provider } from "react-redux";
import { store } from ".";
import { ReactNode } from "react";

interface StoreWrapperProps {
    children: ReactNode;
}

export function StoreWrapper({ children } : StoreWrapperProps){
    return <Provider store={store}>{children}</Provider>
}