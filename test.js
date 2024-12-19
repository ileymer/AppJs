import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Button } from 'react-native';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import audioFiles from "./audioFiles"; // Импорт аудиофайлов
import { Asset } from 'expo-asset';

//import fileData from './assets/audioFiles.json'; // JSON с файлами

// Импорт JSON из assets
const bookData = require('./assets/Quran.json');
const bookPages = require('./assets/PagesQuran.json');

const App = () => {
  const [currentPage, setCurrentPage] = useState(1); // Текущая страница
  const [currentKey, setCurrentKey] = useState("1"); // Текущая глава
  const [activeIndex, setActiveIndex] = useState(null); // Индекс активного прямоугольника
  const [audio, setAudio] = useState(null); // Аудиоплеер
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const [sound, setSound] = useState(null); // Состояние для хранения текущего звука

  let lenPageSura = 1;
  let beginningSura = false;
  const arraySuraIndexStart = [1, 2, 3];
  const arraySuraNameStart = ["", "", ""];
  let data = [];


 

  const getPageData = () => {
    beginningSura = false;
    

    lenPageSura = bookPages[currentPage].length;
    for (let i = 0; i < lenPageSura; i++) {
      if (bookPages[currentPage][i]["Start"] === 1) {
        beginningSura = true;
        data.push({ chapter: 1, text: "Fatih", verse: -1 });
        arraySuraIndexStart[i] = data.length - 1;
      }

      const dataSura = bookData[bookPages[currentPage][i]["Sura"]];
      data = data.concat(
        dataSura.slice(
          bookPages[currentPage][i]["Start"] - 1,
          bookPages[currentPage][i]["End"]
        )
      );
    }

    if (!data) return [];
    const startIndex = currentPage * 20; // Начало текущей страницы
    const endIndex = startIndex + 20; // Конец текущей страницы
    return data;
  };



  const playAudio = async (surah, ayah) => {
    try {
      // Получаем путь к файлу
      const file = audioFiles[surah][ayah];
      if (!file) {
        console.error("Аудиофайл не найден");
        return;
      }

      // Если звук уже воспроизводится, останавливаем и разгружаем его
      if (sound) {
        await sound.stopAsync();  // Останавливаем воспроизведение
        await sound.unloadAsync(); // Разгружаем звук
      }

      // Создаем новый объект звука и загружаем его
      const soundObject = new Audio.Sound();
      await soundObject.loadAsync(file);
      await soundObject.playAsync(); // Воспроизводим новый звук

      // Обновляем состояние, чтобы хранить текущий объект звука
      setSound(soundObject);

    } catch (error) {
      console.error("Ошибка при воспроизведении аудио:", error);
    }
  };


  const hasNextPage = () => {
    const data = bookData[currentKey];
    return data && currentPage < 600;
  };

  const hasPrevPage = () => currentPage > 0;

  const handleRectanglePress = (index) => {
    setActiveIndex(index);
    pathAudio = './assets/audio/' + data[index]["chapter"].toString().padStart(3, '0') + '/' + data[index]["verse"].toString().padStart(3, '0') + '.mp3';
    const uri = './assets/audio/sample.mp3'; // Замените на путь к вашим файлам
    console.log(`Rectangle pressed with index: ${index}`);

    playAudio(data[index]["chapter"].toString().padStart(3, '0'), data[index]["verse"].toString().padStart(3, '0') );


  };




 
  


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Содержимое главы {currentKey}</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {getPageData().map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.rectangle,
              {
                backgroundColor:
                  index === activeIndex ? 'red' : item.verse === -1 ? 'green' : '#007bff',
              },
            ]}
            onPress={() => handleRectanglePress(index)}
          >
            <Text style={styles.text}>{item.text}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Кнопки управления */}
      <View style={styles.controls}>
        {hasPrevPage() && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => setCurrentPage(currentPage - 1)}
          >
            <Text style={styles.buttonText}>Назад</Text>
          </TouchableOpacity>
        )}
        <View style={styles.audioPlayer}>
          <TouchableOpacity  style={styles.playPauseButton}>
            <Text style={styles.buttonText}>{isPlaying ? 'Пауза' : 'Плей'}</Text>
          </TouchableOpacity>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={playbackDuration || 1}
            value={playbackPosition}
            onSlidingComplete={async (value) => {
              if (audio) {
                await audio.setPositionAsync(value);
              }
            }}
          />
        </View>
        {hasNextPage() && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => setCurrentPage(currentPage + 1)}
          >
            <Text style={styles.buttonText}>Вперед</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Кнопка для смены аудио */}
      <View style={styles.changeAudioContainer}>
        <Button
          title="Сменить аудио"
          onPress={() => changeAudio(require('./assets/sample.mp3'))}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  rectangle: {
    width: '90%',
    backgroundColor: '#d0ebff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  text: {
    fontSize: 18,
    color: '#333',
    textAlign: 'right',
    writingDirection: 'rtl', // Для арабского текста
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  audioPlayer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  playPauseButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  slider: {
    width: 200,
    height: 40,
  },
  changeAudioContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default App;
