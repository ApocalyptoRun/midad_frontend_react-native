import {createStackNavigator} from "@react-navigation/stack";
import UserDetails from "../screens/UserDetails";
import HomeScreen from "../screens/HomeScreen";
import ChatScreen from "../screens/ChatScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Fragment, useContext, useEffect, useRef, useState} from "react";
import {ActivityIndicator, Text, View} from "react-native";
import {COLORS} from "../constants/themes";
import {AuthContext} from "../context/AuthContext";

const Stack = createStackNavigator();

const AppStack = () => {
  const {isFirstAuth, checkExistingUser} = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await checkExistingUser();
      } catch (error) {
        console.error("Error checking existing user:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [checkExistingUser]);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
        <ActivityIndicator size={"large"} color={COLORS.cornflowerBlue} />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {isFirstAuth !== null && isFirstAuth ? (
        <Stack.Screen
          name="UserDetails"
          component={UserDetails}
          options={{ headerShown: false }}
        />
      ) : null}

      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
};

export default AppStack;
