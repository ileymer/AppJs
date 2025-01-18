import React, { useState, useEffect } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';

import * as Utils from './Utils';





const SettingsScreen = ({ navigation, route }) => {
    const [fontSize, setFontSize] = useState(0);
    const [fontSizeTranslate, setFontSizeTranslate] = useState(0);

    const [translationEnabled, setTranslationEnabled] = useState(false);
    const [isTranslate, setTranslate] = useState(false); // Текущая страница
    const toggleSwitch = () => setTranslate(previousState => !previousState);
    const toggleSwitchTadjweed = () => setTadjweed(previousState => !previousState);

    const [activeButton, setActiveButton] = useState('left'); // Логика для отслеживания активной кнопки
    const [modeReading, setModeReading] = useState(1);    
    const [tadjweed, setTadjweed] = useState(false);

    let page;

    React.useEffect(() => {
        if (route.params) {
       
    
    
        }
      }, [route.params]);
    

    const selectMode = (mode) => {
        setModeReading(mode);
    };

    const [fontsLoaded] = useFonts({
        MyFont: require('./assets/fonts/p1.otf'), // Указываем путь к шрифту
        MyFontPage: require('./assets/fonts/p604.otf'), // Указываем путь к шрифту

      });
    const saveSettings = () => {

        Utils.saveData('fontSize', fontSize);
        Utils.saveData('tadjweed', tadjweed);
        Utils.saveData('modeReading', modeReading);
        Utils.saveData('fontSizeTranslate', fontSizeTranslate);
        Utils.saveData('translate', isTranslate);




        
        navigation.navigate('MainScreen', { fontSize, isTranslate, modeReading, tadjweed, fontSizeTranslate, page}); // Передача данных на основной экран
      };

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
              setFontSizeTranslate(parseInt(savedFontSizeTranslate, 10));
            }
            const savedModeReading3 = await AsyncStorage.getItem('currentPage');

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


  
    return (
      <View style={styles.containerSettings}>
        <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.buttonMode,
            modeReading === 1 ? styles.activeButton : styles.inactiveButton,
          ]}
          onPress={() => selectMode(1)}
        >
          <Text style={styles.buttonTextMode}>Список</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.buttonMode,
            modeReading === 2 ? styles.activeButton : styles.inactiveButton,
          ]}
         onPress={() => selectMode(2)}
        >
          <Text style={styles.buttonTextMode}>Страницы</Text>
        </TouchableOpacity>
      </View>
      {modeReading == 2 && <View style={styles.sectionSettings}>
      <Text style={[styles.text, {fontSize: 23}, {textAlign: 'center'}, {fontFamily: 'MyFontPage'}]}>" ﭑ ﭒ ﭓ ﭔ ﭕ"</Text>

      </View>}



        {modeReading == 1 && <View style={styles.sectionSettings}>
          <View style={styles.rectangleWhite}>
            
    
            <TouchableOpacity
              style={[
                styles.rectangle,
                {
                  width: '90%',
                },
              ]}
              //onPress={() => handleRectanglePress(index)}
            >
              <Text style={[styles.text, {fontSize}, {fontFamily: 'MyFont'}]}>ﱐ ﱑ</Text>
              <Text >{"1"}</Text>
  
            </TouchableOpacity>
  
            {isTranslate && (
                <Text style={[styles.textTranslate, {fontSize : (fontSizeTranslate)}]}>Аллах</Text>)
            }
  
  
            </View>
            </View>}
          
    <View style={styles.sectionSettings}>

    <Text>Таджвид:</Text>

    
  
  <Switch
    trackColor={{ false: '#767577', true: '#81b0ff' }} // Цвет фона переключателя
    thumbColor={tadjweed ? '#f5dd4b' : '#f4f3f4'} // Цвет кнопки переключателя
    value={tadjweed} // Текущее состояние переключателя
    onValueChange={toggleSwitchTadjweed} // Функция переключения
  />

    
<Text>Перевод:</Text>
  
  <Switch
    trackColor={{ false: '#767577', true: '#81b0ff' }} // Цвет фона переключателя
    thumbColor={isTranslate ? '#f5dd4b' : '#f4f3f4'} // Цвет кнопки переключателя
    value={isTranslate} // Текущее состояние переключателя
    onValueChange={toggleSwitch} // Функция переключения
  />


        {isTranslate && <View style={styles.sectionSettings}>
        <Text>Размер шрифта:</Text>
        <Slider
          style={styles.slider}
          minimumValue={30} // Минимальное значение
          maximumValue={65} // Максимальное значение
          step={1} // Шаг изменения
          value={fontSize} // Текущее значение
          onValueChange={(value) => setFontSize(value)} // Обновление состояния
          minimumTrackTintColor="#1E90FF" // Цвет активной части
          maximumTrackTintColor="#d3d3d3" // Цвет неактивной части
          thumbTintColor="#1E90FF" // Цвет ползунка
  
        />
        
        <Text>Размер шрифта перевода:</Text>
        <Slider
          style={styles.slider}
          minimumValue={30} // Минимальное значение
          maximumValue={65} // Максимальное значение
          step={1} // Шаг изменения
          value={fontSizeTranslate} // Текущее значение
          onValueChange={(value) => setFontSizeTranslate(value)} // Обновление состояния
          minimumTrackTintColor="#1E90FF" // Цвет активной части
          maximumTrackTintColor="#d3d3d3" // Цвет неактивной части
          thumbTintColor="#1E90FF" // Цвет ползунка
  
        />
        </View>
        }
        


      {/* Кнопка "Сохранить" */}
      <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
        <Text style={styles.saveButtonText}>Сохранить</Text>
      </TouchableOpacity>
  
        
        </View>
  
      </View>
    );
  };


const styles = StyleSheet.create({
    buttonTextMode: {
        fontSize: 16,
        color: '#333',
      },
    buttonMode: {
        paddingVertical: 10,
        paddingHorizontal: 60,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
      },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between', // Разместить кнопки слева и справа
        paddingHorizontal: 20,
      },
      activeButton: {
        backgroundColor: '#1E90FF',
        borderColor: '#1E90FF',
      },
      inactiveButton: {
        backgroundColor: '#f5f5f5',
      },
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
      color: '#333' ,
     // marginHorizontal: 4, // Отступы между элементами текста
      writingDirection: 'rtl', // Для арабского текста
  
    },
    saveButton: {
        position: 'absolute', // Абсолютное позиционирование
        bottom: 20, // Отступ от нижнего края
        left: '50%', // Смещаем кнопку в центр экрана
        transform: [{ translateX: -75 }], // Корректируем смещение для точного центрирования
        backgroundColor: '#1E90FF',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        alignItems: 'center',
      },
      saveButtonText: {
        color: '#fff',
        fontSize: 18,
      },
  });
  


export default SettingsScreen;
