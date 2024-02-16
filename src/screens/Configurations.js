import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import i18n from '../Services/i18n'; // Importa i18n desde tu archivo de configuración
import ScreenContext from './ScreenContext';
import { useTranslation } from 'react-i18next';

/**
 * ConfigurationsScreen component provides options for configuring settings such as dark mode and language.
 * @returns {JSX.Element} - JSX element representing the ConfigurationsScreen component.
 */
const ConfigurationsScreen = () => {
  /**
   * Context variables for theme and theme setter function.
   */
  const { theme, setTheme } = useContext(ScreenContext);
  /**
   * State variable for the current language.
   */
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  /**
   * State variable for dark mode.
   */
  const [darkMode, setDarkMode] = useState('black');
  /**
   * Localization hook for translating text.
   */
  const { t } = useTranslation();
  /**
   * Context variable for actual theme and theme setter function.
   */
  const { actualTheme, setActualTheme } = useContext(ScreenContext);

  /**
    * Effect to update actual theme based on the selected theme.
    */
  useEffect(() => {
    if (theme === 'black') {
      setActualTheme('#005588');
    } else {
      setActualTheme('lightblue');
    }
  }, [theme]);

  /**
   * Effect to set the current language when component mounts.
   */
  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, []);

  /**
   * Function to toggle dark mode.
   */
  const toggleDarkMode = () => {
    const newTheme = darkMode ? 'light' : 'black'; // Cambiar a 'black' cuando darkMode sea verdadero
    setDarkMode(!darkMode);
    setTheme(newTheme);
  };

  /**
   * Function to toggle language between English and Spanish.
   */
  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLanguage);
    setCurrentLanguage(newLanguage);
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: theme === 'black' ? '#005588' : 'lightblue' },
    ]}>
      <View style={styles.sectionContainer}>

        <Text style={styles.title}>{t('Configuraciones')}</Text>
        <View style={styles.option}>
          <Text>{t('Modo oscuro:')}</Text>
          <Switch value={darkMode} onValueChange={toggleDarkMode} />
        </View>
        <View style={styles.option}>
          <Text style={styles.languageText}>{t('Cambiar idioma:')}</Text>
          <TouchableOpacity onPress={toggleLanguage}>
            <Text style={styles.languageButton}>{currentLanguage === 'es' ? 'English' : 'Español'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightblue',
  },
  sectionContainer: {
    padding: 20,
    marginBottom: 20,
    borderRadius: 4,
    backgroundColor: 'white',
    borderRadius: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 15,
  },
  languageButton: {
    color: 'blue',
  },
  languageText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default ConfigurationsScreen;
