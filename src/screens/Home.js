import { useRef, useEffect, useState, useContext } from 'react';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import Swiper from 'react-native-swiper';
import {
  Card,
  Title,
  Paragraph,
  Modal,
  Button,
  Portal,
} from 'react-native-paper';
import ScreenContext from './ScreenContext';
import { useTranslation } from 'react-i18next';

const images = [
  require('../img/fachadaHotel.jpg'),
  require('../img/Hall.jpg'),
  require('../img/Comedor.jpg'),
];

/**
 * Home component
 * 
 * @returns {JSX.Element} - JSX Element containing the Home component.
 */
const Home = () => {
  const { theme } = useContext(ScreenContext);
  const [poolModal, setPoolModal] = useState(false);
  const [massageModal, setMassageModal] = useState(false);
  const swiperRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (swiperRef.current && swiperRef.current.state.total > 1) {
        swiperRef.current.scrollBy(1);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [swiperRef]);

  /**
   * Toggles the visibility of the pool modal.
   */
  const handlePoolModal = () => {
    setPoolModal(!poolModal);
  };
  /**
     * Toggles the visibility of the massage modal.
     */
  const handleMassageModal = () => {
    setMassageModal(!massageModal);
  };

  /**
   * Closes all modals.
   */
  const closeModal = () => {
    setPoolModal(false);
    setMassageModal(false);
  };

  return (
    <Portal.Host>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={[
          styles.layout,
          theme === 'black'
            ? { backgroundColor: '#005588' }
            : { backgroundColor: 'lightblue' },
        ]}>
        <View style={styles.container}>
          <Swiper style={styles.carouselWrapper} ref={swiperRef}>
            {images.map((image, index) => (
              <View style={styles.slide} key={index}>
                <Image
                  source={image}
                  style={[styles.image, styles.border]}
                  resizeMode="cover"
                />
              </View>
            ))}
          </Swiper>
          <View style={styles.swiperBorder} />

          <View style={styles.containerServicios}>
            <Text
              style={[
                styles.serviciosTitle,
                theme === 'black' ? { color: 'white' } : { color: 'black' },
              ]}>
              {t("SERVICIOS")}
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardScrollContainer}>
            <TouchableOpacity onPress={handlePoolModal}>
              <Card style={styles.card}>
                <Image
                  source={require('../img/PiscinaExterior.jpg')}
                  style={styles.imageCard}
                  resizeMode="cover"
                />
                <Card.Content>
                  <Title style={styles.text}>{t("Piscina exterior")}</Title>
                </Card.Content>
              </Card>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleMassageModal}>
              <Card style={styles.card}>
                <Image
                  source={require('../img/masaje.jpg')}
                  style={styles.imageCard}
                  resizeMode="cover"
                />
                <Card.Content>
                  <Title style={styles.text}>{t("Zona de masajes")}</Title>
                </Card.Content>
              </Card>
            </TouchableOpacity>

            <TouchableOpacity>
              <Card style={styles.card}>
                <Image
                  source={require('../img/ZonaComun.jpg')}
                  style={styles.imageCard}
                  resizeMode="cover"
                />
                <Card.Content>
                  <Title style={styles.text}>{t("Zona común")}</Title>
                </Card.Content>
              </Card>
            </TouchableOpacity>

            <TouchableOpacity>
              <Card style={styles.card}>
                <Image
                  source={require('../img/Gym.jpg')}
                  style={styles.imageCard}
                  resizeMode="cover"
                />
                <Card.Content>
                  <Title style={styles.text}>{t("Gimnasio")}</Title>
                </Card.Content>
              </Card>
            </TouchableOpacity>

            <TouchableOpacity>
              <Card style={styles.card}>
                <Image
                  source={require('../img/Comedor.jpg')}
                  style={styles.imageCard}
                  resizeMode="cover"
                />
                <Card.Content>
                  <Title style={styles.text}>{t("Comedor")}</Title>
                </Card.Content>
              </Card>
            </TouchableOpacity>

            <TouchableOpacity>
              <Card style={styles.card}>
                <Image
                  source={require('../img/ParqueInfantil.jpg')}
                  style={styles.imageCard}
                  resizeMode="cover"
                />
                <Card.Content>
                  <Title style={styles.text}>{t("Parque infantil")}</Title>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          </ScrollView>

          <Portal>
            <Modal
              visible={poolModal}
              onDismiss={closeModal}
              contentContainerStyle={styles.modalContainer}>
              <Card style={styles.modalCard}>
                <Card.Content>
                  <Title>{t("Piscina exterior")}</Title>
                  <Paragraph>
                    {t("Piscina climatizada de gran capacidad abierta las 24 horas para que puedas relajarte en cualquier momento del día.")}
                  </Paragraph>
                </Card.Content>
                <Card.Actions>
                  <Button onPress={closeModal}>{t("Cerrar")}</Button>
                </Card.Actions>
              </Card>
            </Modal>

            <Modal
              visible={massageModal}
              onDismiss={closeModal}
              contentContainerStyle={styles.modalContainer}>
              <Card style={styles.modalCard}>
                <Card.Content>
                  <Title>{t("Zona de masajes")}</Title>
                  <Paragraph>
                    {t(" Disponemos de masajistas con gran experiencia que te asegurarán una estancia tranquila y relajante.")}
                  </Paragraph>
                </Card.Content>
                <Card.Actions>
                  <Button onPress={closeModal}>{t("Cerrar")}</Button>
                </Card.Actions>
              </Card>
            </Modal>
          </Portal>
        </View>
      </ScrollView>
    </Portal.Host>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  carouselWrapper: {
    height: 300,
  },

  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    marginTop: 10,
    marginBottom: 20,
    width: '95%',
    flex: 1,
    borderRadius: 5,
  },

  border: {
    borderWidth: 2,
    borderColor: 'white',
  },

  swiperBorder: {
    borderBottomWidth: 2,
    borderBottomColor: 'purple',
    paddingBottom: 20,
    width: '80%',
    alignSelf: 'center',
  },

  imageCard: {
    marginTop: 2,
    width: 295,
    flex: 1,
    borderRadius: 5,
    height: 200
  },

  containerServicios: {
    marginTop: 10,
    alignItems: 'center',
  },

  serviciosTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  text: {
    fontFamily: 'Rosariva',
    fontSize: 20,
    alignSelf: 'center',
    marginTop: 10,
  },

  cardScrollContainer: {
    flexDirection: 'row',
    justifyContent: 'center',

    paddingHorizontal: 10,
    alignItems: 'center',
  },

  card: {
    flex: 1,
    width: 300,
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',

  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalCard: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    elevation: 4,
  },
});

export default Home;