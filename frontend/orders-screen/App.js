import { StyleSheet, View } from 'react-native';
import OrderScreen from './screens/OrderScreen';
import * as ScreenOrientation from 'expo-screen-orientation';
import React, { useEffect, useState } from 'react';
import LoginScreen from './screens/LoginScreen';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAutentication = async () => {
      const token = await getToken('deviceToken');

      if (token ){
        setIsAuthenticated(true)
      }
    };

    checkAutentication();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  }

  useEffect(() => {
    const lockOrientation = async () => {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    };

    lockOrientation();
  }, []);

  return (
    <View style={styles.container}>
      {!isAuthenticated ? (
        <LoginScreen onLoginSuccess={handleLoginSuccess}/>
      ): (
        <OrderScreen />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
