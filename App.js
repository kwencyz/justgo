// In App.js in a new project

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import Geocoder from 'react-native-geocoding';
import ForgetPassword from './screens/ForgetPassword';
import LoginScreen from './screens/LoginScreen';
import PassengerMenu from './screens/PassengerMenu';
import SignupScreen from './screens/SignupScreen';

Geocoder.init('AIzaSyCeZnCGy1kggLJnYpVBjrms39JD9SBjlQ0');

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Dashboard" component={PassengerMenu} />
        <Stack.Screen name="ForgetPass" component={ForgetPassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;