import { StyleSheet, Text, View } from 'react-native';
import MainScreen from './screens/MainScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import LoginScreen from './screens/LoginScreen';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect } from 'react';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    const lockOrientation = async () => {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    };

    lockOrientation();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='MainScreen'>
        
        {/* <Stack.Screen 
          name='LoginScreen'
          component={LoginScreen}
          options={{headerShown: false}}
        /> */}

        <Stack.Screen
          name="MainScreen"
          component={MainScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    padding: 0
  },
});
