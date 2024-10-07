import React, {useEffect} from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import { CartProvider } from './context/CartContext';
import MainScreen from './screens/MainScreen';
import * as ScreenOrientation from 'expo-screen-orientation';
import PaymentScreen from './screens/PaymentScreen';
import PhoneNumberScreen from './screens/PhoneNumberScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import PaymentSuccessScreen from './screens/PaymentSuccessScreen';

const unlockScreenOrientation = async () => {
  await ScreenOrientation.unlockAsync();
};

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    unlockScreenOrientation();
  }, []);

  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="PhoneNumber" component={PhoneNumberScreen} />
          <Stack.Screen name="Payment" component={PaymentScreen} />
          <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}
