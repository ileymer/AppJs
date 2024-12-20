import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const App = () => {
  const [isTranslationEnabled, setIsTranslationEnabled] = useState(false);

  const lines = [
    { original: 'This is the first line.', translation: 'Это первая строка.' },
    { original: 'Here is another line.', translation: 'Вот еще одна строка.' },
    { original: 'The final line.', translation: 'Последняя строка.' },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setIsTranslationEnabled(!isTranslationEnabled)}
      >
        <Text style={styles.buttonText}>
          {isTranslationEnabled ? 'Отключить перевод' : 'Включить перевод'}
        </Text>
      </TouchableOpacity>
      <ScrollView style={styles.scrollView}>
        {lines.map((line, index) => (
          <View key={index} style={styles.lineContainer}>
            <View style={styles.textBox}>
              <Text style={styles.text}>{line.original}</Text>
            </View>
            {isTranslationEnabled && (
              <View style={styles.textBox}>
                <Text style={styles.text}>{line.translation}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  toggleButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  lineContainer: {
    marginBottom: 16,
  },
  textBox: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
  },
});

export default App;
