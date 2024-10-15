import { StyleSheet, View } from 'react-native';
import OrderScreen from './screens/OrderScreen';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    const lockOrientation = async () => {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    };

    lockOrientation();
  }, []);

  return (
    <View style={styles.container}>
      <OrderScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
