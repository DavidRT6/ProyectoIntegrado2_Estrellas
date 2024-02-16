import { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Button } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import getData from '../Services/GetData';
import ScreensContext from './ScreenContext';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

/**
 * Filters component allows users to filter rooms based on various criteria such as dates and number of people.
 * @param {object} navigation - Navigation prop object for navigating between screens.
 * @returns {JSX.Element} - JSX element representing the Filters component.
 */
const Filters = ({ navigation }) => {
  /**
   * Context variables for theme, filtered rooms, images, entrance date, and exit date along with their respective setter functions.
   */
  const {
    theme,
    filterRooms,
    setFilterRooms,
    imagesRooms,
    setImagesRooms,
    setEntranceDateContext,
    setExitDateContext,
  } = useContext(ScreensContext);

  /**
   * Localization hook for translating text.
   */
  const { t } = useTranslation();

  /**
   * State variables for selected entrance date, selected exit date, date picker visibility for entrance date, date picker visibility for exit date,
   * date entry error flag, date exit error flag, error message for entrance date, error message for exit date, number of adults, number of children,
   * loading flag, and total number of people.
   */
  const [selectedDateEntrada, setSelectedDateEntrada] = useState(new Date());
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [selectedDateSalida, setSelectedDateSalida] = useState(tomorrow);
  const [isDatePickerVisibleEntrada, setDatePickerVisibilityEntrada] =
    useState(false);
  const [isDatePickerVisibleSalida, setDatePickerVisibilitySalida] =
    useState(false);
  const [dateEntryError, setDateEntryError] = useState(false);
  const [dateExitError, setDateExitError] = useState(false);
  const [errorMessageDateEntry, setErrorMessageDateEntry] = useState({});
  const [errorMessageDateExit, setErrorMessageDateExit] = useState({});
  const [numAdults, setNumAdults] = useState(1);
  const [numChildren, setNumChildren] = useState(0);
  const [loading, setLoading] = useState(false);
  const [numPeople, setNumPeople] = useState(1);

  /**
   * Function to validate the number of adults and update the total number of people accordingly.
   * @param {number} option - Option to increase or decrease the number of adults.
   */
  const validateNumAdults = (option) => {
    if (option == 1) {
      setNumAdults(numAdults - 1);
      setNumPeople(numPeople - 1);
    } else {
      if (numPeople < 7) {
        setNumAdults(numAdults + 1);
        setNumPeople(numPeople + 1);
      }
    }
  };

  /**
   * Function to validate the number of children and update the total number of people accordingly.
   * @param {number} option - Option to increase or decrease the number of children.
   */
  const validateNumChildren = (option) => {
    if (option == 1) {
      setNumChildren(numChildren - 1);
      setNumPeople(numPeople - 1);
    } else {
      if (numPeople < 5) {
        setNumChildren(numChildren + 1);
        setNumPeople(numPeople + 1);
      }
    }
  };

  /**
    * Effect to be executed when filterRooms state changes.
    */
  useEffect(() => { }, [filterRooms]);

  /**
   * Function to handle confirmation of entrance date selection.
   * @param {Date} date - Selected entrance date.
   */
  const handleConfirmDateEntrada = (date) => {
    setSelectedDateEntrada(date);
    const currentDate = new Date();
    const dateEnterObj = new Date(date);

    if (dateEnterObj.getDate() < currentDate.getDate()) {
      setErrorMessageDateEntry({
        msgDate:
          t('Error: La fecha de entrada no puede ser anterior a la fecha actual.')
      });
      setDateEntryError(true);
    } else if (dateEnterObj.getTime() >= selectedDateSalida.getTime()) {
      setErrorMessageDateEntry({
        msgDate:
          t('Error: La fecha de entrada no puede ser igual o mayor que la fecha de salida.'),
      });
      setDateEntryError(true);
    } else {
      setDateEntryError(false);
    }
    hideDatePickerEntrada();
  };

  /**
   * Function to handle confirmation of exit date selection.
   * @param {Date} date - Selected exit date.
   */
  const handleConfirmDateSalida = (date) => {
    setSelectedDateSalida(date);
    const currentDate = new Date();
    const dateExitObj = new Date(date);

    if (dateExitObj.getDate() < currentDate.getDate()) {
      setErrorMessageDateExit({
        msgDate:
          t('Error: La fecha de salida no puede ser anterior a la fecha actual.'),
      });
      setDateExitError(true);
    } else if (dateExitObj.getTime() <= selectedDateEntrada.getTime()) {
      setErrorMessageDateExit({
        msgDate:
          t('Error: La fecha de salida debe ser posterior a la fecha de entrada.'),
      });
      setDateExitError(true);
    } else {
      setDateExitError(false);
    }
    hideDatePickerSalida();
  };

  /**
   * Function to show entrance date picker.
   */
  const showDatePickerEntrada = () => {
    setDatePickerVisibilityEntrada(true);
  };

  /**
   * Function to hide entrance date picker.
   */
  const hideDatePickerEntrada = () => {
    setDatePickerVisibilityEntrada(false);
  };

  /**
   * Function to show exit date picker.
   */
  const showDatePickerSalida = () => {
    setDatePickerVisibilitySalida(true);
  };

  /**
   * Function to hide exit date picker.
   */
  const hideDatePickerSalida = () => {
    setDatePickerVisibilitySalida(false);
  };

  /**
   * Function to fetch filtered rooms based on selected dates and number of people.
   * @param {Date} dataEnter - Selected entrance date.
   * @param {Date} dataExit - Selected exit date.
   */
  const getFilteredRooms = async (dataEnter, dataExit) => {
    try {
      setLoading(true);
      const formattedDateEnter = dataEnter.toISOString();
      const formattedDateExit = dataExit.toISOString();

      const response = await getData(
        `http://44.195.98.192:8080/ESTRELLAS/filterRooms?entranceDate=${formattedDateEnter}&exitDate=${formattedDateExit}&peopleNumber=${numPeople}`
      );

      let roomsInfo = [];
      if (response === 'Error') {
        Alert.alert(
          'Error',
          t('La fecha de entrada es mayor que la fecha de salida.')
        );
      } else {
        response.forEach((room) => {
          const idRoom = room.idRoom;
          const titleRoom = room.title;
          const peopleNumber = room.peopleNumber;
          const price = room.price;
          const beds = room.beds;
          const m2 = room.m2;
          const imagesAPI = [...room.images];
          setImagesRooms(imagesAPI);

          roomsInfo.push({
            id: idRoom,
            title: titleRoom,
            peopleNumber: peopleNumber,
            beds: beds,
            m2: m2,
            price: price,
            images: imagesAPI,
          });
        });
        setLoading(false);
        setFilterRooms(roomsInfo);
        setEntranceDateContext(selectedDateEntrada);
        setExitDateContext(selectedDateSalida);

        navigation.navigate('ActiveFilters');
      }
    } catch (error) {
      console.log('Error al obtener datos:', error);
      Alert.alert(
        'Error',
        t('No hay habitaciones disponibles para las fechas seleccionadas.')
      );
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.container,
            { backgroundColor: theme === 'black' ? '#005588' : 'lightblue' },
          ]}>
          <Text
            style={[
              styles.filterButtonText,
              theme === 'black' ? { color: 'white' } : { color: 'black' },
            ]}>
            {t("RESERVA HABITACIONES")}
          </Text>
          <View style={styles.swiperBorder} />
          <View style={styles.dateContainer}>
            <View style={styles.dates}>
              <Text style={styles.datePickerLabel}>{t("Introduce fechas")}</Text>
              <View style={styles.calendar}>
                <Icon name="calendar" size={24} color="black" />
              </View>
            </View>
            <TouchableOpacity onPress={showDatePickerEntrada}>
              <Text style={styles.dateLabelText}>{t("Fecha de entrada:")}</Text>
              <Text style={styles.selectedDateText}>
                {selectedDateEntrada.toDateString()}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisibleEntrada}
              mode="date"
              date={selectedDateEntrada}
              onConfirm={handleConfirmDateEntrada}
              onCancel={hideDatePickerEntrada}
              minimumDate={new Date()}
            />
            {dateEntryError && (
              <View style={styles.messageErrorDateEntry}>
                <Text style={styles.errorMessage}>
                  {dateEntryError ? errorMessageDateEntry.msgDate : ''}
                </Text>
              </View>
            )}
            <TouchableOpacity onPress={showDatePickerSalida}>
              <Text style={styles.dateLabelText}>{t("Fecha de salida:")}</Text>
              <Text style={styles.selectedDateText}>
                {selectedDateSalida.toDateString()}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisibleSalida}
              mode="date"
              date={selectedDateSalida}
              onConfirm={handleConfirmDateSalida}
              onCancel={hideDatePickerSalida}
              minimumDate={new Date()}
            />
            {dateExitError && (
              <View style={styles.messageErrorDateExit}>
                <Text style={styles.errorMessage}>
                  {errorMessageDateExit ? errorMessageDateExit.msgDate : ''}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.peopleContainer}>
            <View style={styles.people}>
              <Icon name="account" size={24} color="black" />
              <Text style={styles.personsLabel}>{t("Cantidad de personas")}</Text>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("Adultos")}</Text>
              <Button
                onPress={() => validateNumAdults(1)}
                icon="minus"
                labelStyle={{
                  fontSize: 16,
                  color: '#16C4F3',
                  fontWeight: 'bold',
                }}
                style={{
                  backgroundColor: 'white',
                  width: 50,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 5,
                }}
                color="white"
                disabled={numAdults === 1}></Button>
              <Text style={styles.value}>{numAdults}</Text>
              <Button
                onPress={() => validateNumAdults(2)}
                icon="plus"
                labelStyle={{
                  fontSize: 16,
                  color: '#16C4F3',
                  fontWeight: 'bold',
                }}
                style={{
                  backgroundColor: 'white',
                  width: 50,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                color="white"
                disabled={numAdults === 7}></Button>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("Niños")}</Text>
              <Button
                onPress={() => validateNumChildren(1)}
                icon="minus"
                labelStyle={{
                  fontSize: 16,
                  color: '#16C4F3',
                  fontWeight: 'bold',
                }}
                style={{
                  backgroundColor: 'white',
                  width: 50,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                disabled={numChildren === 0}
                color="white"></Button>
              <Text style={styles.value}>{numChildren}</Text>
              <Button
                onPress={() => validateNumChildren(2)}
                icon="plus"
                labelStyle={{
                  fontSize: 16,
                  color: '#16C4F3',
                  fontWeight: 'bold',
                }}
                style={{
                  backgroundColor: 'white',
                  width: 50,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                color="white"
                disabled={numChildren === 5}></Button>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              onPress={() => {
                if (!dateEntryError && !dateExitError) {
                  getFilteredRooms(selectedDateEntrada, selectedDateSalida);
                }
              }}
              icon="filter"
              labelStyle={{
                fontSize: 14,
                color: 'white',
                fontWeight: 'bold',
              }}
              style={styles.filter}>
              {t("APLICAR FILTROS")}
            </Button>
          </View>
          {loading && (
            <View style={styles.activityIndicatorContainer}>
              <ActivityIndicator
                animating={true}
                color="darkblue"
                size="large"
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 35,
    backgroundColor: 'lightblue',
  },
  dates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  activityIndicatorContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  datePickerLabel: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  calendar: {
    marginLeft: 10,
  },
  people: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateContainer: {
    flex: 0.6,
    width: 310,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
    shadowOpacity: 0.25,
    elevation: 5,
  },
  peopleContainer: {
    flex: 0.6,
    padding: 22,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 5,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  dateLabelText: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  selectedDateText: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
    borderWidth: 2,
    padding: 8,
    borderRadius: 5,
    borderColor: '#3498db',
    color: '#3498db',
  },
  personsLabel: {
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 15,
    fontSize: 18,
  },
  filter: {
    width: 200,
    height: 40,
    marginTop: 20,
    backgroundColor: '#3498db',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowRadius: 3,
  },
  filterButtonText: {
    color: '#4B5601',
    fontSize: 23,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    padding: '10px 20px',
    borderRadius: 5,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s ease, color 0.3s ease',
    cursor: 'pointer',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: 270,
    padding: 6,
  },
  label: {
    flex: 1,
  },
  value: {
    width: 50,
    textAlign: 'center',
  },
  messageErrorDateEntry: {
    marginBottom: 4,
  },
  errorMessage: {
    fontSize: 15,
    color: 'red',
    marginBottom: 6,
  },
  swiperBorder: {
    borderBottomWidth: 2,
    borderBottomColor: 'purple',
    paddingBottom: 20,
    marginBottom: 15,
    width: '100%',
    alignSelf: 'center',
  },
});

export default Filters;