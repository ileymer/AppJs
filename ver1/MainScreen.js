import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet,Image, Switch, ScrollView, TouchableOpacity, SafeAreaView, Button } from 'react-native';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import audioFiles from "./audioFiles"; 
import { useFonts } from 'expo-font';
import * as Font from 'expo-font';
import * as FileSystem from 'expo-file-system';

import * as Utils from './Utils';

import AsyncStorage from '@react-native-async-storage/async-storage';



import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CheckBox from '@react-native-community/checkbox';
import { Asset } from 'expo-asset';


const Stack = createStackNavigator();
//import fileData from './assets/audioFiles.json'; // JSON с файлами

// Импорт JSON из assets
const bookData = require('./assets/merged (1).json');
const bookDataTranslate = require('./assets/ru.json');
const bookDataName = require('./assets/ruName.json');
let book = require('./assets/QuranPageLine2.json');


let isTranslateVar = false;

const bookPages = require('./assets/Pages.json');






const MainScreen = ({navigation, route}) => {
  const [currentPage, setCurrentPage] = useState(600); // Текущая страница
  const [currentKey, setCurrentKey] = useState("1"); // Текущая глава
  const [activeIndex, setActiveIndex] = useState(1); // Индекс активного прямоугольника
  const [activeIndexTwo, setActiveIndexTwo] = useState(2); // Индекс активного прямоугольника

  const [audio, setAudio] = useState(null); // Аудиоплеер
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Состояние загрузки аудио
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const [sound, setSound] = useState(null); 
  const [pause, setPause] = useState(true);// Состояние для хранения текущего звука
  const [fontSize, setFontSize] = useState(16); 
  const [fontSizeTranslate, setFontSizeTransalate] = useState(16); 

  const [fontLoaded, setFontLoaded] = useState(false); // Состояние загрузки шрифта
  const [currentFont, setCurrentFont] = useState('DefaultFont');
  const [onePageFont, setOnePageFont] = useState('p1');
  const [actIndex, setActIndex] = useState(1);
  const [modeReading, setModeReading] = useState(2);
  const [textInfo, setTextInfo] = useState("");

  const [isTranslate, setTranslate] = useState(false); // Текущая страница


  const [tadjweed, setTadjweed] = useState(false);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const buttonRef = useRef(null);


  let dataLen = 1;

  React.useEffect(() => {
    if (route.params) {
      if (route.params.fontSize !== undefined) setFontSize(route.params.fontSize);
     // if (route.params.isTranslate !== undefined) setIsTranslate(route.params.isTranslate);
      if (route.params.modeReading !== undefined) setModeReading(route.params.modeReading);

      if (route.params.tadjweed !== undefined) setTadjweed(route.params.tadjweed);

      if (route.params.isTranslate !== undefined) setTranslate(route.params.isTranslate);

      if (route.params.fontSizeTranslate !== undefined) setFontSizeTransalate(route.params.fontSizeTranslate);



        
      if (modeReading == 2)
      {
        if (route.params.tadjweed !== undefined && !route.params.tadjweed) 
            book = require('./assets/QuranPageLineNo.json');
        else if (route.params.tadjweed !== undefined && route.params.tadjweed) 
        book = require('./assets/QuranPageLine2.json');

      }


    }
  }, [route.params]);


  useEffect(() => {
    const loadSettings = async () => {
      try {
        
        const savedFontSize = await AsyncStorage.getItem('fontSize');
        if (savedFontSize !== null) {
          setFontSize(parseInt(savedFontSize, 10));
        }

        const savedTadjweed = await AsyncStorage.getItem('tadjweed');
        if (savedTadjweed !== null) {
            setTadjweed(JSON.parse(savedTadjweed));
        }

        const savedModeReading = await AsyncStorage.getItem('modeReading');
        if (savedModeReading !== null) {
            setModeReading(JSON.parse(savedModeReading));
        }

        const savedFontSizeTranslate = await AsyncStorage.getItem('fontSizeTranslate');
        if (savedFontSizeTranslate !== null) {
            setFontSizeTransalate(parseInt(savedFontSizeTranslate, 10));
        }

        const SavedCurrentPage = await AsyncStorage.getItem('currentPage');
        if (SavedCurrentPage !== null) {
          //setCurrentPage(parseInt(SavedCurrentPage, 10));
        }

        const savedTranslate = await AsyncStorage.getItem('translate');
        if (savedTranslate !== null) {
            setTranslate(JSON.parse(savedTranslate));
        }

      } catch (error) {
        console.error('Ошибка при загрузке шрифта', error);
      }
    };

    loadSettings();
  }, []);

  const scrollViewRef = useRef(null); 

  const itemRefs = useRef([]); // Массив рефов для элементов// Реф для ScrollView


  //loadFont("http://89.191.225.107/fonts/p"+ currentPage + ".otf", "p" + currentPage);
  
  loadFonts(currentPage);
  const [playNext, setPlayNext] = useState(false);

  let lenPageSura = 1;
  let g = 0;
  let isTranslationEnabled = true;
  let beginningSura = false;
  const arraySuraIndexStart = [1, 2, 3];
  const arraySuraNameStart = ["", "", ""];
  let data = [];

  let act = 0;
  
  const pageData = book["604"];


  const [loaded] = useFonts({
    MainFont: require('./assets/fonts/UthmanTN1-Ver10.otf'),
  });

  async function loadFonts(page) {
    if (tadjweed)
        await loadFont("http://89.191.225.107/fonts/p"+ page + ".otf", "p" + page, "otf");
    else
        await loadFont("http://89.191.225.107/fontsNT/pnt"+ page + ".otf", "pnt" + page, "otf");

}


  async function loadFont(fontUrl, fontName, extension) {
    try {
      const fontFilePath = `${FileSystem.documentDirectory}${fontName}.${extension}`;

  
  
      // Проверяем, существует ли шрифт локально
      const fileInfo = await FileSystem.getInfoAsync(fontFilePath);
      if (!fileInfo.exists) {
       // console.log('Скачивание шрифта:', fontUrl);
        await FileSystem.downloadAsync(fontUrl, fontFilePath);
      } else {
        //console.log('Шрифт уже существует локально:', fontName);
      }
  
      // Подключаем шрифт
      await Font.loadAsync({
        [fontName]: fontFilePath,
      });
  
      setFontLoaded(true);
      setCurrentFont(fontName);


    } catch (error) {
      console.error('Ошибка при загрузке шрифта:', error);
    }
  }

  async function loadAudio(audioUrl, audioName) {
      
    setIsLoading(true);

    console.log(audioUrl);
    console.log("3333232")


    try {
      const audioFilePath = `${FileSystem.documentDirectory}${audioName}.mp3`;

      const fileInfo = await FileSystem.getInfoAsync(audioFilePath);
      if (!fileInfo.exists) {
        console.log('Скачивание аудио:', audioUrl);
        await FileSystem.downloadAsync(audioUrl, audioFilePath);
      } else {
        console.log('Аудио уже загружено локально:', audioName);
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioFilePath },
        { shouldPlay: false }
      );

      setSound(newSound);
      setIsLoading(false);
    } catch (error) {
      console.error('Ошибка при загрузке аудио:', error);
      setIsLoading(false);
    }
  }

  async function playAudio(surah, ayat) {
      
    playAudio2("https://tanzil.net/res/audio/afasy/"+ surah + ayat + ".mp3",  surah + ayat);



    
  }


  const [currentAudioName, setCurrentAudioName] = useState(null);


  useEffect(() => {
    if (currentAudioName) {
      console.log("Текущее аудио обновлено:", currentAudioName);
      // Здесь вы можете выполнить действия с обновлённым состоянием
    }
  }, [currentAudioName]); 

  let ggs = "d";


async function playAudio17(audioUrl, audioName) {
    
    setCurrentAudioName(audioName);
    ggs = audioName // Обновляем состояние  
    try {
    let status;
    if (sound)
    status= await sound.getStatusAsync();
  
    // Остановка предыдущего аудио, если оно воспроизводится
    if (sound && status.isPlaying) {
      await sound.stopAsync();

      await sound.unloadAsync();
      setSound(null);
      console.log('🔇 Предыдущее аудио остановлено');
    }

    // Загрузка нового аудио
    const audioFilePath = `${FileSystem.documentDirectory}${audioName}.mp3`;

    const fileInfo = await FileSystem.getInfoAsync(audioFilePath);
    if (!fileInfo.exists) {
      console.log('🔄 Скачивание аудио:', audioUrl);
      await FileSystem.downloadAsync(audioUrl, audioFilePath);
    } else {
      console.log('✅ Аудио уже загружено локально:', audioName);
    }

    console.log(currentAudioName+ "-"+ audioName);
    if (currentAudioName != audioName)
      return;

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: audioFilePath },
      { shouldPlay: true } // Автоматическое воспроизведение
    );
    

    setSound(newSound);
    setIsPlaying(true);


    // Подписка на завершение аудио
    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        console.log('🎵 Аудио завершено');
        setIsPlaying(false);
        
        
        console.log("next = " + actIndex);
        let n = actIndex + 1;
        setActIndex((prevIndex) => {
          const nextIndex = prevIndex + 1; // prevIndex - актуальное значение actIndex
          console.log("next =", nextIndex);
          handleRectanglePress(nextIndex);
          return nextIndex; // Возвращаем новое значение
        });        
         
        
      }
    });

    console.log('▶️ Воспроизведение аудио:', audioName);
  } catch (error) {
    console.error('❌ Ошибка при воспроизведении аудио:', error.message);
  }
}





  async function playAudio2(audioUrl, audioName) {
    
    

    try {
      setIsButtonDisabled(true);
      let status;
      if (sound)
      status= await sound.getStatusAsync();
    
      // Остановка предыдущего аудио, если оно воспроизводится
      if (sound && status.isPlaying) {
        await sound.stopAsync();

        await sound.unloadAsync();
        setSound(null);
        console.log('🔇 Предыдущее аудио остановлено');
      }
  
      // Загрузка нового аудио
      const audioFilePath = `${FileSystem.documentDirectory}${audioName}.mp3`;
  
      const fileInfo = await FileSystem.getInfoAsync(audioFilePath);
      if (!fileInfo.exists) {
        console.log('🔄 Скачивание аудио:', audioUrl);
        await FileSystem.downloadAsync(audioUrl, audioFilePath);
      } else {
        console.log('✅ Аудио уже загружено локально:', audioName);
      }
  
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioFilePath },
        { shouldPlay: true } // Автоматическое воспроизведение
      );
      

      setSound(newSound);
      setIsPlaying(true);



  
      // Подписка на завершение аудио
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          console.log('🎵 Аудио завершено');
          setIsPlaying(false);
          
          
          console.log("next = " + actIndex);
          let n = actIndex + 1;
          setActIndex((prevIndex) => {
            const nextIndex = prevIndex + 1; // prevIndex - актуальное значение actIndex
            console.log("next =", nextIndex);
            nextAyat(nextIndex, true);
            //handleRectanglePress(nextIndex);
            return nextIndex; // Возвращаем новое значение
          });        
           
          
        }
      });
  
      console.log('▶️ Воспроизведение аудио:', audioName);

      setIsButtonDisabled(false);

    } catch (error) {
      console.error('❌ Ошибка при воспроизведении аудио:', error.message);
    }
  }

  async function playAudio3(audioUrl, audioName) {
    try {
      // 🛑 Остановка предыдущего аудио, если оно воспроизводится
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        console.log('🔇 Предыдущее аудио остановлено');
      }
  
      // 📥 Загрузка нового аудио
      const audioFilePath = `${FileSystem.documentDirectory}${audioName}.mp3`;
  
      const fileInfo = await FileSystem.getInfoAsync(audioFilePath);
      if (!fileInfo.exists) {
        console.log('🔄 Скачивание аудио:', audioUrl);
  
        // Попытка загрузки с повторами в случае ошибки
        let downloadSuccess = false;
        let attempts = 0;
  
        while (!downloadSuccess && attempts < 3) {
          try {
            await FileSystem.downloadAsync(audioUrl, audioFilePath);
            downloadSuccess = true;
          } catch (downloadError) {
            attempts++;
            console.warn(`⚠️ Попытка ${attempts}: Ошибка загрузки аудио`, downloadError.message);
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Ожидание перед повторной попыткой
          }
        }
  
        if (!downloadSuccess) {
          throw new Error('Не удалось загрузить аудио после 3 попыток.');
        }
      } else {
        console.log('✅ Аудио уже загружено локально:', audioName);
      }
  
      // ▶️ Воспроизведение нового аудио
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioFilePath },
        { shouldPlay: true }
      );
  
      setSound(newSound);
      setIsPlaying(true);
  
      // 🎧 Подписка на завершение воспроизведения
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          console.log('🎵 Аудио завершено');
          setIsPlaying(false);
          handleRectanglePress(act + 1);
        }
      });
  
      console.log('▶️ Воспроизведение аудио:', audioName);
    } catch (error) {
      console.error('❌ Ошибка при воспроизведении аудио:', error.message);
    }
  }

  useEffect(() => {
    console.log("Pause state updated:", pause);
    // Здесь можно добавить любое действие, зависящее от изменения pause
    if (pause) {
      console.log("Paused");
    } else {
      console.log("Resumed");
    }
  }, [pause]);
  
  async function togglePause() {
    let pa = pause;
    setPause((prevPause) => !prevPause); 


    if (sound) {
      const status = await sound.getStatusAsync();
  
      if (status.isPlaying) {
        // Если воспроизведение идет, ставим на паузу
        await sound.pauseAsync();
        setIsPlaying(false);
        console.log('⏸️ Аудио поставлено на паузу');
      } else {
        // Если воспроизведение на паузе, продолжаем воспроизведение
        await sound.playAsync();
        setIsPlaying(true);
        console.log('▶️ Аудио продолжено');
      }
    }
    else if (pa)
    {
      if (modeReading == 1)
        playAudio(data[actIndex]["chapter"].toString().padStart(3, '0'), data[actIndex]["verse"].toString().padStart(3, '0') );
      else
      playAudio(data[actIndex]["chapter"].toString().padStart(3, '0'), data[actIndex]["verse"].toString().padStart(3, '0') );

    }
  }

  const getDataPageModeTwo = () => {
    data = (book[currentPage.toString()])
    dataLen = getLenMode2(data);
  

    return data;
  }
  const getPageData = () => {
    beginningSura = false;

    
    

    lenPageSura = bookPages[currentPage].length;
    for (let i = 0; i < lenPageSura; i++) {
      if (bookPages[currentPage][i]["Start"] === 1) {
        beginningSura = true;
        data.push({ chapter: 1, text: bookDataName[bookPages[currentPage][i]["Sura"] - 1]['transliteration'], verse: -1 });

        if (bookPages[currentPage][i]["Sura"] > 1)
        data.push({ chapter: 1, text: "ﱁ ﱂ ﱃ ﱄ", verse: 0 });


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

    //console.log(bookDataTranslate[1]["2"].text);
    const startIndex = currentPage * 20; // Начало текущей страницы
    const endIndex = startIndex + 20; // Конец текущей страницы

    //console.log(data);
    dataLen = data.length;
    return data;
  };

  const getPageDataIndex = (indexPage) => {
    beginningSura = false;

    
    data = [];


    lenPageSura = bookPages[indexPage].length;
    for (let i = 0; i < lenPageSura; i++) {
      if (bookPages[indexPage][i]["Start"] === 1) {
        beginningSura = true;
        //data.push({ chapter: 1, text: "Fatih", verse: -1 });

        data.push({ chapter: 1, text: bookDataName[bookPages[indexPage][i]["Sura"] - 1]['transliteration'], verse: -1 });

        if (bookPages[indexPage][i]["Sura"] > 1)
        data.push({ chapter: 1, text: "ﱁ ﱂ ﱃ ﱄ", verse: 0 });
        
        arraySuraIndexStart[i] = data.length - 1;
      }

      const dataSura = bookData[bookPages[indexPage][i]["Sura"]];
      data = data.concat(
        dataSura.slice(
          bookPages[indexPage][i]["Start"] - 1,
          bookPages[indexPage][i]["End"]
        )
      );
    }

    if (!data) return [];

    //console.log(bookDataTranslate[1]["2"].text);
    const startIndex = indexPage * 20; // Начало текущей страницы
    const endIndex = startIndex + 20; // Конец текущей страницы
    dataLen = data.length;

    //console.log(data);
    return data;
  };



  const playAudioLocal = async (surah, ayah) => {
    
    try {
      // Получаем путь к файлу
      const file = audioFiles[surah][ayah];
      if (!file) {
        console.error("Аудиофайл не найден");
        return;
      }
  
      // Если звук уже воспроизводится, останавливаем и разгружаем его
      if (sound) {
        await sound.stopAsync(); // Останавливаем воспроизведение
        await sound.unloadAsync(); // Разгружаем звук
      }
  
      // Создаем новый объект звука и загружаем его
      const soundObject = new Audio.Sound();
      await soundObject.loadAsync(file);
  
      // Устанавливаем слушатель для статуса воспроизведения
      soundObject.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          console.log("Аудио закончилось");
          soundObject.unloadAsync(); // Выгружаем звук, если он закончился
          setSound(null); // Сбрасываем состояние звука

          handleRectanglePress(act + 1);

        }
      });
  
      await soundObject.playAsync(); // Воспроизводим новый звук
  
      // Обновляем состояние, чтобы хранить текущий объект звука
      setSound(soundObject);
  
    } catch (error) {
      console.error("Ошибка при воспроизведении аудио:", error);
    }
  };

  const ensureVisible = (elementRef, scrollView) => {
    if (elementRef && scrollView.current) {
      elementRef.measureLayout(
        scrollView.current, // Измеряем относительно ScrollView
        (x, y, width, height) => {
          // Проверяем, находится ли элемент в зоне видимости
          scrollView.current.measure((scrollX, scrollY, scrollWidth, scrollHeight) => {
            if (y < scrollY || y + height > scrollY + scrollHeight) {
              // Если элемент вне видимой области, прокручиваем к нему
              scrollView.current.scrollTo({ y, animated: true });
            }
          });
        },
        (error) => {
          console.error('Ошибка измерения:', error);
        }
      );
    }
  };
  


  const hasNextPage = () => {
    // if (scrollViewRef.current) {
    //   scrollViewRef.current.scrollTo({
    //     y: 0,         // Прокрутка к началу по оси Y
    //     animated: true, // Анимация прокрутки
    //   });
    // }
    //const data = bookData[currentKey];
    return currentPage < 610 ;
  };

  const hasPrevPage = () => currentPage > 0;

  const getLenMode2 = (d) =>
  {
    let l = d[d.length - 1][d[d.length - 1].length - 1].Index + 1;
    return l;
  }


  const nextPage = (index) => {
    


    handleRectanglePress(index)
  }

  const nextAyat = (index, next) => {
    if (index > -1 && index < dataLen && modeReading == 1)
    {
      if (data[index].verse == -1)
      {
        if (next)
          index++;
        else
          index--;
      }
      
    }

    handleRectanglePress(index);

  }


  const handleRectanglePress = (index) => {
    savePage(currentPage);


    if (index >= dataLen)
    {
      let p = currentPage + 1;
      setCurrentPage(currentPage + 1); // Правильное обновление
      getPageDataIndex(p);


      if (data[0]["verse"] == -1)
        index = 1;
      else
        index = 0;

    }

    if (index < 0)
    {
      let p = currentPage - 1;
      setCurrentPage(currentPage - 1); // Правильное обновление
      getPageDataIndex(p);


      if (data[0]["verse"] == -1)
        index = 1;
      else
        index = 0;
    }


    



    setActiveIndex(index);


    setActIndex(index);
    console.log("kkk", activeIndex);
    console.log(dataLen);

    setTextInfo(currentPage);


    //pathAudio = './assets/audio/' + data[index]["chapter"].toString().padStart(3, '0') + '/' + data[index]["verse"].toString().padStart(3, '0') + '.mp3';
    //const uri = './assets/audio/sample.mp3'; // Замените на путь к вашим файлам
   //console.log(`Rectangle pressed with index: ${data[index]["chapter"]}`);

    ensureVisible(itemRefs.current[index], scrollViewRef);
    if (!pause)
    {
      if (modeReading == 1)
        playAudio(data[index]["chapter"].toString().padStart(3, '0'), data[index]["verse"].toString().padStart(3, '0') );
      else
      {
        
        let suraAyat = getSuraAyat(data, index).split(':');

        playAudio(suraAyat[0].toString().padStart(3, '0'), suraAyat[1].toString().padStart(3, '0') );
      }

    }

  };

  function getSuraAyat(d, ind)
  {
    let st = "0";
        for (let i = 0; i < d.length; i++)
        {
          for (let j = 0; j < d[i].length; j++)
          {
            if (d[i][j].Index == ind)
            {
              st = d[i][j].SuraAyt;
              break;
            }
          }

          if (st != "0")
            break;

        }
    return st;


  }
  


  async function savePage(page) {
    
    Utils.saveData('currentPage', currentPage);
  }

 
  


  return (
    <SafeAreaView style={styles.container}>
       <View style={styles.controls}>
        {hasPrevPage() && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => setCurrentPage(currentPage - 1)}
          >
            <Text style={styles.buttonText}>Назад</Text>
          </TouchableOpacity>
        )}
        
        <Text>{textInfo}</Text>

        {hasNextPage() && (
          <TouchableOpacity
            style={styles.button}

            onPress={() => navigation.navigate('SettingsScreen', {currentPage})} 
          >
            <Image
          source={require('./assets/str2.png')}
          style={styles.icon}  // Указываем путь к изображению
          
        />
          </TouchableOpacity>
        )}
      </View>
      {modeReading == 1 && <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContainer}>
        {getPageData().map((item, index) => (
          <View key={index} style={styles.rectangleWhite} ref={(ref) => (itemRefs.current[index] = ref)}>
          
  
          <TouchableOpacity
            style={[
              styles.rectangle,
              {
                backgroundColor:
                  index === activeIndex ? '#FFF8E1' : item.verse === -1 ? '#28e0d2' : '#E6E6FA',
                width: '90%',
              },
            ]}
            onPress={() => item.verse > -1  ? handleRectanglePress(index) : null}
          >
            <Text style={[styles.text, {fontSize: fontSize}, { fontFamily: item.verse != 0 ? currentFont : onePageFont}] }>{tadjweed ? item.text: item.textNo}</Text>
            <Text >{item.verse}</Text>

          </TouchableOpacity>

          {isTranslate && item.verse > 0 && (
              <Text style={[styles.textTranslate, {fontSize: fontSizeTranslate}]}>{bookDataTranslate[item.chapter][(item.verse - 1).toString()].text}</Text>)
          }


          </View>

          

           
          
        ))}
        
      </ScrollView>}

      {modeReading == 2 && <ScrollView contentContainerStyle={styles.containerModeTwo}>
      {getDataPageModeTwo().map((line, lineIndex) => (
        <View key={lineIndex} style={styles.lineModeTwo}>
          {line.map((item, itemIndex) => (
                  <TouchableOpacity onPress={() => handleRectanglePress(item.Index)}>
            <Text key={itemIndex} style={[styles.textModeTwo, {fontFamily: currentFont, backgroundColor:
              item.Index === activeIndex ? '#FFE9EE' : null}]}>
              {item.text == "Name-Sura" ? (bookDataName[item.SuraAyt].transliteration) : item.text}
            </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScrollView>}

      {/* Кнопки управления */}
      <View style={styles.controls}>
        {hasPrevPage() && (
          <TouchableOpacity
          disabled={isButtonDisabled || currentPage <= 1}

            style={styles.button}
            onPress={() => setCurrentPage(currentPage - 1)}
          >
             <Image
          source={
            isButtonDisabled || currentPage <= 1
            ? require('./assets/str2-disabled.png') // если true, используем это изображение
            : require('./assets/str2.png')
          }
          
          style={styles.icon}  // Указываем путь к изображению
          
        />
          </TouchableOpacity>
        )}
       

       
          <TouchableOpacity
            style={styles.button}

            onPress={() => nextAyat(actIndex - 1, false)}
          >
            <Image
          source={require('./assets/str1.png')}
          style={styles.icon}  // Указываем путь к изображению
          
        />
          </TouchableOpacity>
        


      

        
          <TouchableOpacity style={[styles.button, {backgroundColor: '#0080FF00' }]}         onPress={togglePause}>
            <Image
              style={styles.icon}
              source={
                isPlaying
                  ? require('./assets/pause.png') // Если isPlaying === true
                  : require('./assets/play.png')   // Если isPlaying === false
              }

            />          

          </TouchableOpacity>
          
       

          <TouchableOpacity
            style={styles.button}
            ref={buttonRef}
            disabled={isButtonDisabled}
            onPress={() => nextAyat(actIndex + 1, true)}
          >
            <Image
          source={
            isButtonDisabled
            ? require('./assets/str1-2-disabled.png') // если true, используем это изображение
            : require('./assets/str1-2.png')
          }
          style={styles.icon}  // Указываем путь к изображению
          
        />
          </TouchableOpacity>

        {hasNextPage() && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleRectanglePress(dataLen)}
            //onPress={() => setCurrentPage(currentPage + 1)}
          >
            <Image
          source={require('./assets/str2-2.png')}
          style={styles.icon}  // Указываем путь к изображению
          
        />
          </TouchableOpacity>
        )}
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
    alignItems: 'flex-end',
    width: '100%',
    backgroundColor: '#d0ebff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  rectangleWhite: {
    alignItems: 'flex-end',
    width: '100%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  text: {
    fontSize: 32,
    fontFamily: 'MainFont',
    textAlign: 'right',
    writingDirection: 'rtl', // Для арабского текста
  },
  textTranslate: {
    fontSize: 22,
    color: 'grey',
    fontFamily: 'MainFont',
    textAlign: 'justify',
    writingDirection: 'rtl', // Для арабского текста
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    gap: 10, //
  },
  button: {
    backgroundColor: '#0080FF00',
    padding: 10,
    borderRadius: 5,
    width: 50,    // Ширина изображения
    height: 50,
    justifyContent: 'center', // Центрирование по вертикали
    alignItems: 'center', 
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
  icon: {
    width: 50,    // Ширина изображения
    height: 50,   // Высота изображения
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

  containerSettings: {
    flex: 1, // Заполнение всего экрана
    flexDirection: 'column', // Вертикальное направление
  },
  sectionSettings: {
    flex: 1, // Равномерное распределение пространства
    justifyContent: 'center', // Центрирование содержимого по вертикали
    alignItems: 'center', // Центрирование содержимого по горизонтали
  },
  loadingContainerModeTwo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  containerModeTwo: {
    justifyContent: 'center',

    padding: 16,
  },
  lineModeTwo: {
    flexDirection: 'row-reverse', // Все элементы в одной строке
   // marginBottom: 10,
    justifyContent: 'center', // Центрирование элементов по горизонтали
    flexWrap: 'wrap', // Перенос на следующую строку при необходимости
  },
  textModeTwo: {
    backgroundColor: 'white',
    fontSize: 22,
    color: '#333',
   // marginHorizontal: 4, // Отступы между элементами текста
    writingDirection: 'rtl', // Для арабского текста

  },
});

export default MainScreen;
