import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ActivityIndicator, View } from "react-native";
import { COLORS } from "../constants/themes";
import { NavigationContainer } from "@react-navigation/native";
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";

const AppNav = () => {
    const { isLoading, userToken } = useContext(AuthContext);
  
    if (isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size={"large"} color={COLORS.cornflowerBlue} />
        </View>
      );
    }
  
    return (
      <NavigationContainer>
        {userToken !== null ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    );
  };


export default AppNav;