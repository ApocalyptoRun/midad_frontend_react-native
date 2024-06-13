import React from "react";

import {AuthProvider} from "./src/context/AuthContext";
import AppNav from "./src/navigation/AppNav";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {Provider as ReduxProvider} from "react-redux";
import { store } from "./src/redux/store";

export default function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ReduxProvider store={store}>
        <AuthProvider>
          <AppNav />
        </AuthProvider>
      </ReduxProvider>
    </GestureHandlerRootView>
  );
}
