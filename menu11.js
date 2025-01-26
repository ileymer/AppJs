

import React from 'react';
import { View, Text, StyleSheet,Image, Switch, ScrollView, TouchableOpacity, SafeAreaView, Button } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import MenuSelect from './MenuSelect';


function HomeScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Home Screen</Text>
      </View>
    );
  }

  const jsonData =  require('./assets/ruName.json');
  
  function SettingsScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ScrollView style={styles.container}>
      {jsonData.map((item) => (
        <TouchableOpacity
        key={item.id}
        style={styles.button}
        onPress={() => console.log(`Нажата: ${item.id}`)}
      >
        <Text style={styles.textNameSura}>{item.id + ". " + item.transliteration}</Text>
      </TouchableOpacity>
      ))}
    </ScrollView>
      </View>
    );
  }


const Tab = createMaterialTopTabNavigator();

export default function MainNavigator() {

  return (
      <Tab.Navigator>
        <Tab.Screen name="Jo" component={SettingsScreen} />
        <Tab.Screen name="Ko" component={MenuSelect} />

      </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white', // Фон приложения
  },

    container: {
      flex: 1,
      padding: 10,
      width: '100%', // Ширина кнопки — 90% от ширины экрана

      backgroundColor: '#f5f5f5',
    },

    button: {
        width: '100%', // Ширина кнопки — 90% от ширины экрана
        backgroundColor: 'grey',
        paddingVertical: 15,
        marginVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
      },
      textNameSura:
      {
        fontSize: 20,
        width: '100%',
        textAlign: 'left', // Выравнивание текста по правому краю


      },
      
});
