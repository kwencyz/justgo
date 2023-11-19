// In App.js in a new project

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Geocoder from 'react-native-geocoding';
import ForgetPassword from './screens/ForgetPassword';
import HistoryScreen from './screens/HistoryScreen';
import LoginScreen from './screens/LoginScreen';
import PassengerMenu from './screens/PassengerMenu';
import ScreenTemplate from './screens/ScreenTemplate';
import SignupScreen from './screens/SignupScreen';
import WalletScreen from './screens/WalletScreen';

Geocoder.init('AIzaSyCeZnCGy1kggLJnYpVBjrms39JD9SBjlQ0');

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{
      tabBarShowLabel: false, tabBarActiveTintColor: 'white', tabBarInactiveTintColor: 'white',
      tabBarStyle: {
        position: 'absolute',
        bottom: 25,
        left: 10,
        right: 10,
        elevation: 0,
        backgroundColor: 'maroon',
        borderRadius: 15,
        height: 60,
        ...styles.shadow
      }
    }}>
      <Tab.Screen name="Home" component={PassengerMenu} options={{
        tabBarIcon: ({ focused }) => (
          <View style={{ alignItems: 'center', justifyContent: 'center', }}>
            <Image
              source={require('./assets/icon/home.png')}
              resizeMode='contain'
              style={{
                width: 25,
                height: 25,
                tintColor: focused ? 'white' : '#808080'
              }}
            />
            <Text style={{ color: focused ? 'white' : '#808080', fontSize: 12, top: 5, }}>HOME</Text>
          </View>
        ),
        headerShown: false,
      }}
      />

      <Tab.Screen name="Wallet" component={WalletScreen} options={{
        tabBarIcon: ({ focused }) => (
          <View style={{ alignItems: 'center', justifyContent: 'center', }}>
            <Image
              source={require('./assets/icon/wallet.png')}
              resizeMode='contain'
              style={{
                width: 25,
                height: 25,
                tintColor: focused ? 'white' : '#808080'
              }}
            />
            <Text style={{ color: focused ? 'white' : '#808080', top: 5, fontSize: 12 }}>WALLET</Text>
          </View>
        ),
        headerShown: false,
      }} />

      <Tab.Screen name="History" component={HistoryScreen} options={{
        tabBarIcon: ({ focused }) => (
          <View style={{ alignItems: 'center', justifyContent: 'center', }}>
            <Image
              source={require('./assets/icon/history.png')}
              resizeMode='contain'
              style={{
                width: 25,
                height: 25,
                tintColor: focused ? 'white' : '#808080'
              }}
            />
            <Text style={{ color: focused ? 'white' : '#808080', top: 5, fontSize: 12 }}>HISTORY</Text>
          </View>
        ),
        headerShown: false,
      }} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Dashboard" component={TabNavigator} />
        <Stack.Screen name="ForgetPass" component={ForgetPassword} />
        <Stack.Screen name="ScreenTemplate" component={ScreenTemplate} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  }
})