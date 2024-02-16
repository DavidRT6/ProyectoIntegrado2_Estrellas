import { useContext } from 'react';
import { View, Image, ScrollView, StyleSheet, Text } from 'react-native';
import { Card, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ScreensContext from './ScreenContext';
import customIcon from '../img/m2.png';
import { useTranslation } from 'react-i18next';

/**
 * ActiveFilters component displays filtered rooms with their details and allows users to view more information about each room.
 * @param {object} props - Component props.
 * @returns {JSX.Element} - JSX element representing the ActiveFilters component.
 */
const ActiveFilters = (props) => {
  /**
   * Context variables for theme, filtered rooms, room details, and room setter function.
   */
  const { theme, filterRooms, imagesRooms, room, setRoom } =
    useContext(ScreensContext);

  /**
 * Navigates to room information screen.
 * @param {number} idRoom - ID of the selected room.
 */
  const informationRoom = (idRoom) => {
    setRoom(idRoom);
    props.navigation.navigate('Rooms');
  };

  /**
   * Localization hook for translating text.
   */
  const { t } = useTranslation();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === 'black' ? '#005588' : 'lightblue' },
      ]}>
      <Text
        style={[
          styles.llista,
          theme === 'black' ? { color: 'white' } : { color: 'black' },
        ]}>
        {t("HABITACIONES DISPONIBLES")}
      </Text>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}>
        {filterRooms.map((room, index) => (
          <Card key={index} style={styles.card}>
            {room.title && (
              <View style={styles.imageContainer}>
                {imagesRooms.length > 0 && (
                  <Image
                    source={{
                      uri: `data:image/png;base64,${room.images[0]}`,
                    }}
                    style={styles.cardImage}
                  />
                )}
              </View>
            )}
            <Card.Content>
              <Text style={styles.title}>{room.title}</Text>
              <View style={styles.information}>
                {(room.beds || room.peopleNumber) && (
                  <View style={styles.infoContainer}>
                    {room.beds && (
                      <View style={styles.infoItem}>
                        <Icon
                          name="bed-double"
                          size={28}
                          color="black"
                          style={styles.icon}
                        />
                        <Text style={styles.text}>{room.beds} {t("Camas")}</Text>
                      </View>
                    )}
                    {room.peopleNumber && (
                      <View style={styles.infoItem}>
                        <Icon
                          name="account-group"
                          size={28}
                          color="black"
                          style={styles.icon}
                        />
                        <Text style={styles.text}>
                          {room.peopleNumber} {t("Personas")}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
                {room.m2 && (
                  <View style={styles.row}>
                    <View style={styles.infoItem}>
                      <Text style={styles.text}>
                        <Image source={customIcon} style={styles.customIcon} />
                        {room.m2} m²
                      </Text>
                    </View>
                  </View>
                )}
              </View>
              <View style={styles.priceContainer}>
                <View style={styles.number}>
                  <Text style={styles.textDesde}>{t("Desde")}</Text>
                  <Text style={styles.priceText}>{room.price}€</Text>
                </View>
              </View>
            </Card.Content>
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                icon="information-outline"
                labelStyle={{
                  fontSize: 15,
                  color: 'white',
                  fontWeight: 'bold',
                }}
                onPress={() => informationRoom(room.id)}
                style={styles.button}>
                {t("MÁS INFORMACIÓN")}
              </Button>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightblue',
    padding: 18,
  },
  llista: {
    fontSize: 20,
    fontWeight: 'bold',
    borderWidth: 2,
    borderColor: 'purple',
    padding: 10,
    textAlign: 'center',
    borderRadius: 8,
  },
  imageContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scrollViewContent: {
    padding: 3,
    marginTop: 8,
    paddingTop: 30,
  },
  card: {
    marginVertical: 5,
    elevation: 4,
    marginTop: 0,
    marginBottom: 20,
    width: '100%',
  },
  cardImage: {
    height: 200,
    width: '100%',
    resizeMode: 'cover',
    marginTop: 0,
  },
  title: {
    fontSize: 19,
    marginTop: 13,
    marginBottom: 13,
    fontWeight: 'bold',
  },
  button: {
    margin: 8,
    backgroundColor: '#d4afe0',
    justifyContent: 'center',
    borderRadius: 5,
    width: '80%',
    height: 45,
  },
  buttonContainer: {
    alignItems: 'flex-end',
    margin: 5,
  },
  icon: {
    marginBottom: 5,
    justifyContent: 'center',
  },
  customIcon: {
    height: 24,
    width: 24,
    margin: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'darkblue',
    marginLeft: 5,
  },
  information: {
    flexDirection: 'column',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    elevation: 3,
    margin: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
  },
  number: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  textDesde: {
    fontWeight: 'bold',
    fontSize: 16,
    alignItems: 'flex-end',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
});

export default ActiveFilters;
