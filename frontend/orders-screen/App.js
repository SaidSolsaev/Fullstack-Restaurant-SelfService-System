import { StyleSheet, View } from 'react-native';
import OrderScreen from './screens/OrderScreen';


export default function App() {
  
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
