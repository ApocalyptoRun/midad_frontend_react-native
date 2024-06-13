import {createStackNavigator} from "@react-navigation/stack";
import { DrawerContent, createDrawerNavigator } from '@react-navigation/drawer';
import UserDetails from "../screens/UserDetails";
import HomeScreen from "../screens/HomeScreen";
import ChatScreen from "../screens/ChatScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Fragment, useContext, useEffect, useRef, useState} from "react";
import {ActivityIndicator, Text, View} from "react-native";
import {COLORS} from "../constants/themes";
import {AuthContext} from "../context/AuthContext";
import VideoCallScreen from "../screens/VideoCallScreen";
import { NavigationContainer } from "@react-navigation/native";
import ProfileScreen from "../screens/ProfileScreen";
import CustomDrawer from "../components/CustomDrawer";
import Ionicons from "react-native-vector-icons/Ionicons";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const AppStack = () => {
  return (
      <Drawer.Navigator initialRouteName="Home" 
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false, 
        drawerLabelStyle: {marginLeft: -25, fontSize:15},
        drawerActiveBackgroundColor: COLORS.cornflowerBlue,
        drawerActiveTintColor: '#fff'
      }}
      >
        <Drawer.Screen name="Home" component={HomeStack} options={{
          drawerIcon: ({color}) => (
            <Ionicons name="home-outline" size={22} color={color} />
          )
        }}/>
        
        <Drawer.Screen name="Profile" component={ProfileScreen} options={{
            drawerIcon: ({color}) => (
              <Ionicons name="person-outline" size={22} color={color} />
            )
        }}/>
      </Drawer.Navigator>
  ); 
};

const HomeStack = () => {
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
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
};


export default AppStack;
