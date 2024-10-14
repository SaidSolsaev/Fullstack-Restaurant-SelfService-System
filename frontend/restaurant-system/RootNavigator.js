import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { createStackNavigator } from "@react-navigation/stack";
import MainScreen from "./screens/MainScreen";
import LoginScreen from "./screens/LoginScreen";
import LoadingScreen from "./screens/LoadingScreen";

const Stack = createStackNavigator();

function RootNavigator() {
    const {isLoggedIn, isLoading} = useContext(AuthContext);

    if (isLoading){
        return(
            <Stack.Screen 
                name="Loading" 
                component={() => <LoadingScreen />} 
            />
        )
    }

    return (
        <Stack.Navigator>
            {isLoggedIn ? (
                <Stack.Screen 
                    name="MainScreen"
                    component={MainScreen}
                    options={{headerShown: false}}
                />
            ) : (
                <Stack.Screen
                    name="LoginScreen"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
            )}
        </Stack.Navigator>
    )
}

export default RootNavigator;