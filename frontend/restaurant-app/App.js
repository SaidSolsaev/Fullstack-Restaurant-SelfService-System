import React, {useEffect, useState} from 'react';
import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import { CartProvider } from './context/CartContext';
import MainScreen from './screens/MainScreen';
import * as ScreenOrientation from 'expo-screen-orientation';
import PaymentScreen from './screens/PaymentScreen';
import PhoneNumberScreen from './screens/PhoneNumberScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import PaymentSuccessScreen from './screens/PaymentSuccessScreen';
import PaymentProcessingScreen from './screens/PaymentProcessingScreen';
import PaymentFailed from './screens/PaymentFailed';
import { StatusBar } from 'react-native';
import Header from './components/Header';
import DeviceLogin from './screens/DeviceLogin';
import * as SecureStore from 'expo-secure-store';
import { getToken } from './services/api/getRestaurantInfo';


const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ['exp://', 'myapp://'],
  config: {
    screens: {
      Home: '/',
      Main: 'main',
      Checkout: 'checkout',
      PhoneNumber: 'phonenumber',
      Payment: 'payment',
      PaymentSuccess: 'payment-success',
      PaymentProcessing: 'payment-processing',
      PaymentFail: 'payment-fail'
    }
  }
}

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
  }, [])

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
    <CartProvider>
      <NavigationContainer linking={linking}>
        <StatusBar hidden={true} />
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: "#FFEBCD",
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerShadowVisible: false,
            headerLeft: () => <Header />,
            title: "",
          }}
        >
          {!isAuthenticated ? (
            
            <Stack.Screen 
              name="DeviceLogin"
              options={{headerShown: false}}
            >
                {() => <DeviceLogin onLoginSuccess={handleLoginSuccess} />}
            </Stack.Screen>
            
          ): (
            <>
              <Stack.Screen 
                name="Home" 
                component={HomeScreen} 
                options={{ headerShown: false }}
              />
              
              <Stack.Screen 
                name="Main" 
                component={MainScreen} 
                options={{ headerShown: true}} 
              />
              
              <Stack.Screen 
                name="Checkout" 
                component={CheckoutScreen} 
                options={{ headerShown: true }}
              />

              <Stack.Screen 
                name="PhoneNumber" 
                component={PhoneNumberScreen} 
                options={{ headerShown: true }}
              />

              <Stack.Screen 
                name="Payment" 
                component={PaymentScreen} 
                options={{ headerShown: true }}
              />
              
              <Stack.Screen 
                name="PaymentSuccess" 
                component={PaymentSuccessScreen} 
                options={{ headerShown: false }}
              />
              
              <Stack.Screen 
                name="PaymentProcessing" 
                component={PaymentProcessingScreen} 
                options={{ headerShown: false }} 
              />
              
              <Stack.Screen 
                name='PaymentFail' 
                component={PaymentFailed} 
                options={{ headerShown: false }}
              />
            </>
          )}

        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}
