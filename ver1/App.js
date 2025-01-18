import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';


import MainScreen from './MainScreen';
import SettingsScreen from './SettingsScreen';



const Stack = createStackNavigator();

export default function App() {
  const checkFirstLaunch = async () => {
    const savedFontSize = await AsyncStorage.getItem('fontSize');
    if (savedFontSize === null) {
      // Это первый запуск, установите значения по умолчанию
      console.log('Первый запуск');
      await AsyncStorage.setItem('fontSize', '32');
      await AsyncStorage.setItem('translate', false);
      await AsyncStorage.setItem('readMode', 1);


    } else {
      console.log('Не первый запуск');
      //await AsyncStorage.clear(); // Очистка всех данных
    }
  };

  checkFirstLaunch();


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainScreen">
        <Stack.Screen name="MainScreen" component={MainScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ title: 'Настройки' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
