import React from "react";

import {AuthProvider} from "./src/context/AuthContext";
import AppNav from "./src/navigation/AppNav";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <AppNav />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
