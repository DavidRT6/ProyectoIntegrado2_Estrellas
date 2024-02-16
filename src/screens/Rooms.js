import React, { useEffect, useState, useContext } from 'react';
import { View, Image, ScrollView, StyleSheet, Text, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/FontAwesome';
import ScreenContext from './ScreenContext';
import getData from '../Services/GetData';
import { useTranslation } from 'react-i18next';

/**
 * Rooms component
 * 
 * @param {object} props - The properties passed to the Rooms component.
 * @returns {JSX.Element} - JSX Element containing the Rooms component.
 */
const Rooms = (props) => {
  const { theme, room, id } = useContext(ScreenContext);
  const [roomImages, setRoomImages] = useState([]);
  const [titleRoom, setTitleRoom] = useState('');
  const [description, setDescription] = useState('');
  const [peopleNumber, setPeopleNumber] = useState(null);
  const [price, setPrice] = useState(null);
  const [beds, setBeds] = useState(null);
  const [m2, setM2] = useState(null);
  const [index, setIndex] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    getInfo();
  }, []);

  /**
   * Fetches room information from the server.
   */
  const getInfo = async () => {
    try {
      const data = await getData(
        `http://44.195.98.192:8080/ESTRELLAS/roomInformation?id=${room}`
      );
      const title = data.title;
      const images = data.images;
      const description = data.description;
      const numPeople = data.peopleNumber;
      const price = data.price;
      const beds = data.beds;
      const m2 = data.m2;

      setTitleRoom(title);
      setDescription(description);
      setPeopleNumber(numPeople);
      setPrice(price);
      setBeds(beds);
      setRoomImages(images);
      setM2(m2);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', `Failed to fetch Room`);
    }
  };

  /**
   * Handles the onPress event for the payment button.
   */
  const handlePaymentOnPress = () => {
    if (id === -1) {
      Alert.alert('Inicio sesión', 'Antes de pagar debes iniciar sesión.');
    } else {
      props.navigation.navigate('Payment');
    }
  };

  /**
 * Represents a single row of features for a room.
 * 
 * @param {Object} props - The properties passed to the FeatureRow component.
 * @param {string} props.iconName - The name of the icon to display.
 * @param {string} props.label - The label for the feature.
 * @param {string} [props.value] - The value for the feature (optional).
 * @returns {JSX.Element} - A JSX Element representing a single row of room features.
 */
  const FeatureRow = ({ iconName, label, value }) => (
    <View style={styles.column}>
      <Icon name={iconName} size={15} style={styles.icon} />
      <Text style={styles.label}>{label}</Text>
      {value && <Text style={styles.value}>{value}</Text>}
    </View>
  );

  /**
 * Represents a set of room features including breakfast, TV, USB charging, etc.
 * 
 * @param {Object} props - The properties passed to the RoomFeatures component.
 * @param {number} props.peopleNumber - The number of people allowed in the room.
 * @param {number} props.beds - The number of beds in the room.
 * @param {number} props.m2 - The area of the room in square meters.
 * @returns {JSX.Element} - A JSX Element representing a set of room features.
 */
  const RoomFeatures = ({ peopleNumber, beds, m2 }) => (
    <View style={styles.featuresContainer}>
      <FeatureSquare>
        <FeatureRow iconName="coffee" label="Breakfast" />
      </FeatureSquare>
      <FeatureSquare>
        <FeatureRow iconName="television" label="32'' TV" />
      </FeatureSquare>
      <FeatureSquare>
        <FeatureRow iconName="usb" label="Bedsite USB charging" />
      </FeatureSquare>
      <FeatureSquare>
        <FeatureRow iconName="users" label="Persons:" value={peopleNumber} />
      </FeatureSquare>
      <FeatureSquare>
        <FeatureRow iconName="bed" label="Beds:" value={beds} />
      </FeatureSquare>
      <FeatureSquare>
        <FeatureRow iconName="bed" label="Meters Square:" value={m2} />
      </FeatureSquare>
    </View>
  );

  /**
 * Represents a square container for room features.
 * 
 * @param {Object} props - The properties passed to the FeatureSquare component.
 * @param {ReactNode} props.children - The children components to be rendered inside the square container.
 * @returns {JSX.Element} - A JSX Element representing a square container for room features.
 */
  const FeatureSquare = ({ children }) => (
    <View style={styles.square}>{children}</View>
  );

  /**
   * Renders room images in a swiper.
   */
  const renderImages = () => {
    return roomImages.map((image, idx) => (
      <View key={idx} style={styles.slide}>
        <Image
          source={{ uri: `data:image/png;base64,${image}` }}
          style={[styles.image, styles.border]}
        />
      </View>
    ));
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <Swiper
          style={[
            styles.swiper,
            { backgroundColor: theme === 'black' ? '#005588' : 'lightblue' },
          ]}
          showsButtons={false}
          loop={false}
          index={index}
          onIndexChanged={(newIndex) => setIndex(newIndex)}
          showsPagination={true}>
          {renderImages()}
        </Swiper>
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
            {titleRoom}
          </Text>
          <View style={styles.swiperBorder} />
          <View style={styles.descriptionContainer}>
            <Text
              style={[
                { fontSize: 18, fontWeight: 'bold' },
                theme === 'black' ? { color: 'white' } : { color: 'black' },
              ]}>
              {t("Descripción")}
            </Text>
            <Text
              style={[
                { textAlign: 'center' },
                theme === 'black' ? { color: 'white' } : { color: 'black' },
              ]}>
              {description}
            </Text>
            <View style={styles.swiperBorder2} />
            <Text
              style={[
                { fontSize: 18, fontWeight: 'bold' },
                theme === 'black' ? { color: 'white' } : { color: 'black' },
              ]}>
              {t("Información")}
            </Text>
            <RoomFeatures
              peopleNumber={peopleNumber}
              price={price}
              beds={beds}
              m2={m2}
            />
          </View>
          <View
            style={{ backgroundColor: 'white', margin: 30, borderRadius: 10 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.price}>{price} </Text>
              <Icon name="eur" size={40} style={{ color: 'purple' }} />
            </View>
            <View style={{ alignItems: 'center' }}>
              <Button
                style={styles.button}
                mode="contained"
                onPress={() => handlePaymentOnPress()}>
                {t("RESERVAR")}
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightblue',
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '90%',
    height: 300,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  swiper: {
    height: 500,
    backgroundColor: 'lightblue',
    marginBottom: -200,
  },
  swiperBorder: {
    borderBottomWidth: 3,
    borderBottomColor: 'purple',
    padding: 10,
    width: '80%',
    alignSelf: 'center',
    marginBottom: 10,
  },
  swiperBorder2: {
    borderBottomWidth: 3,
    borderBottomColor: 'purple',
    padding: 10,
    width: '80%',
    alignSelf: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  border: {
    borderWidth: 2,
    borderColor: 'white',
  },
  descriptionContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
    alignItems: 'center',
    marginBottom: -370,
  },
  featuresContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
  },
  square: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#e0e0e0',
    padding: 5,
    borderRadius: 2,
    margin: 2,
    alignItems: 'center',
  },
  column: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 10,
  },
  label: {
    fontSize: 10,
    marginRight: 5,
  },
  value: {
    fontWeight: 'bold',
  },
  price: {
    fontSize: 45,
    fontWeight: 'bold',
    color: 'purple',
  },
  button: {
    backgroundColor: '#d4afe0',
    width: '50%',
    marginBottom: 20,
  },
  filterButtonText: {
    marginTop: 13,
    fontSize: 20,
    fontWeight: 'bold',
    padding: '10px 20px',
    textTransform: 'uppercase',
    borderRadius: 5,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s ease, color 0.3s ease',
    cursor: 'pointer',
    textAlign: 'center',
  },
});

export default Rooms;