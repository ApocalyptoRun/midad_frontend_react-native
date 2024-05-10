import { createStackNavigator } from "@react-navigation/stack";
import WelcomeSreen from "../screens/WelcomeSreen";
import PhoneNumber from "../screens/PhoneNumber";
import OTPVerification from "../screens/OTPVerification";

const Stack = createStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator initialRouteName='Welcome'>
            <Stack.Screen name="Welcome" component={WelcomeSreen} options={{headerShown: false}}/>
            <Stack.Screen name="PhoneNumber" component={PhoneNumber} options={{headerShown: false}}/>
            <Stack.Screen name="OTPVerification" component={OTPVerification} options={{headerShown: false}}/>
        </Stack.Navigator>
    )
}

export default AuthStack;