import {createStackNavigator} from "@react-navigation/stack";
import UserDetails from "../screens/UserDetails";
import HomeScreen from "../screens/HomeScreen";
import ChatScreen from "../screens/ChatScreen";
import {useContext} from "react";
import {AuthContext} from "../context/AuthContext";

const Stack = createStackNavigator();

const AppStack = () => {
  const {isFirstAuth} = useContext(AuthContext);

  return (
    <Stack.Navigator>
      {isFirstAuth && (
        <Stack.Screen name="userDetails" component={UserDetails} options={{headerShown: false}}/>
      )}
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
};

export default AppStack;
