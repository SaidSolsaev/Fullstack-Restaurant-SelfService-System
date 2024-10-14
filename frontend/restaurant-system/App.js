import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import RootNavigator from './RootNavigator';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    const lockOrientation = async () => {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    };

    lockOrientation();
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        
        <StatusBar hidden={true} />
        
        <RootNavigator />
      
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    padding: 0
  },
});
