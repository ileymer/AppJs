import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

// Главный экран
const MainScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Главный экран</Text>
      <Button title="Открыть настройки" onPress={() => navigation.navigate('Settings')} />
    </View>
  );
};

// Экран настроек
const SettingsScreen = () => {
  const [fontSize, setFontSize] = useState(16);
  const [translationEnabled, setTranslationEnabled] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Настройки</Text>
      <View style={styles.setting}>
        <Text style={styles.label}>Размер шрифта: {fontSize}</Text>
        <Button title="Увеличить шрифт" onPress={() => setFontSize(fontSize + 1)} />
        <Button title="Уменьшить шрифт" onPress={() => setFontSize(fontSize - 1)} />
      </View>
      <View style={styles.setting}>
        <Text style={styles.label}>Перевод: {translationEnabled ? 'Включен' : 'Выключен'}</Text>
        <Button
          title={translationEnabled ? 'Выключить перевод' : 'Включить перевод'}
          onPress={() => setTranslationEnabled(!translationEnabled)}
        />
      </View>
    </View>
  );
};

// Навигация приложения
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={MainScreen} options={{ title: 'Главная' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Настройки' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  setting: {
    marginBottom: 24,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default App;
