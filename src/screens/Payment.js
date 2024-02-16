import { useState, useContext } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { TextInput, Button, Divider } from 'react-native-paper';
import ScreenContext from './ScreenContext';
import { useTranslation } from 'react-i18next';

/**
 * Payment component
 * 
 * @param {object} props - The properties passed to the Payment component.
 * @returns {JSX.Element} - JSX Element containing the Payment component.
 */
const Payment = (props) => {
  const { theme } = useContext(ScreenContext);
  const { room } = useContext(ScreenContext);
  const { id } = useContext(ScreenContext);
  const { entranceDateContext } = useContext(ScreenContext);
  const { exitDateContext } = useContext(ScreenContext);
  const [cardOwner, setCardOwner] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardDate, setCardDate] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const { t } = useTranslation();

  /**
   * Handles changes in the card owner input field.
   * 
   * @param {string} text - The new value of the card owner input.
   */
  const handleCardOwnerChange = (text) => {
    setCardOwner(text);
  };

  /**
   * Handles changes in the card number input field.
   * 
   * @param {string} text - The new value of the card number input.
   */
  const handleCardNumberChange = (text) => {
    let formattedText = text.replace(/\D/g, '');
    formattedText = formattedText.substring(0, 16);
    setCardNumber(formattedText);
  };

  /**
   * Handles changes in the expiry date input field.
   * 
   * @param {string} text - The new value of the expiry date input.
   */
  const handleExpiryChange = (text) => {
    const formattedDate = text
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/g, '$1/$2')
      .replace(/^(\d{2}\/\d{2})\d+$/, '$1');
    setCardDate(formattedDate);
  };

  /**
   * Handles changes in the security code input field.
   * 
   * @param {string} text - The new value of the security code input.
   */
  const handleSecurityCodeChange = (text) => {
    const formattedCode = text.replace(/\D/g, '').substring(0, 3);
    setSecurityCode(formattedCode);
  };

  /**
   * Validates the card number.
   * 
   * @param {string} cardNumber - The card number to validate.
   * @returns {boolean} - Whether the card number is valid or not.
   */
  const validateCardNumber = (cardNumber) => {
    return cardNumber.length === 16;
  };

  /**
   * Validates the expiry date.
   * 
   * @param {string} expiryDate - The expiry date to validate.
   * @returns {boolean} - Whether the expiry date is valid or not.
   */
  const validateExpiryDate = (expiryDate) => {
    if (!expiryDate) return false;
    const [month, year] = expiryDate.split('/');
    const currentDate = new Date();
    const expiryYear = parseInt('20' + year, 10);
    const expiryMonth = parseInt(month, 10) - 1;
    const expiryDateObject = new Date(expiryYear, expiryMonth, 1);
    return expiryDateObject > currentDate;
  };

  /**
   * Validates the security code.
   * 
   * @param {string} securityCode - The security code to validate.
   * @returns {boolean} - Whether the security code is valid or not.
   */
  const validateSecurityCode = (securityCode) => {
    return securityCode.length === 3;
  };

  /**
   * Handles the payment process.
   */
  const handlePayment = () => {
    
    if (!validateCardNumber(cardNumber)) {
      alert('Número de tarjeta inválido.');
      return;
    }
    if (!validateExpiryDate(cardDate)) {
      alert('Fecha de caducidad inválida.');
      return;
    }
    if (!validateSecurityCode(securityCode)) {
      alert('Código de seguridad inválido.');
      return;
    }
    if (!cardOwner || !cardNumber || !cardDate || !securityCode) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    setCardOwner('');
    setCardNumber('');
    setCardDate('');
    setSecurityCode('');
    bookRoom();
  };

  /**
   * Books the room by sending a POST request to the server.
   */
  const bookRoom = () => {
    const url = 'http://44.195.98.192:8080/ESTRELLAS/bookRoom';

    const body = {
      entranceDate: entranceDateContext,
      exitDate: exitDateContext,
      idUser: id,
      idRoom: room,
    };

    postData(url, body);
  };

  /**
   * Sends a POST request with booking data to the server.
   * 
   * @param {string} url - The URL for the POST request.
   * @param {object} body - The body of the POST request containing booking data.
   */
  const postData = async (url, body) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });

      if (response.status === 204) {
        if (response.ok) {
          Alert.alert(t('Pago realizado')
            ,
            t('¡Tu pago ha sido procesado correctamente!')
          );
          
          props.navigation.navigate('Filters');
        }
      } else {
        Alert.alert(
            t('Pago no realizado'),
          t('Se ha producido un error al momento de pagar.')
        );
      }
    } catch (error) {
      console.error('An error has occurred with the POST request:', error);
    }
  };

  return (
    <View
      style={[
        styles.layout,
        theme === 'black'
          ? { backgroundColor: '#005588' }
          : { backgroundColor: 'lightblue' },
      ]}>
      <Text
        style={[
          styles.title,
          theme === 'black' ? { color: 'white' } : { color: 'black' },
        ]}>
        {t("Realizar Pago")}
      </Text>
      <TextInput
        label="💳 Titular de la tarjeta"
        onChangeText={handleCardOwnerChange}
        value={cardOwner}
        mode="outlined"
        outlineColor="purple"
      />
      <TextInput
        label="🔢 Nº tarjeta"
        onChangeText={handleCardNumberChange}
        value={cardNumber}
        mode="outlined"
        outlineColor="purple"
        keyboardType="numeric"
      />
      <TextInput
        label="📅 Caducidad"
        onChangeText={handleExpiryChange}
        value={cardDate}
        mode="outlined"
        outlineColor="purple"
        keyboardType="numeric"
      />
      <TextInput
        label="🔒 Cod. Seguridad"
        onChangeText={handleSecurityCodeChange}
        value={securityCode}
        mode="outlined"
        outlineColor="purple"
        keyboardType="numeric"
      />
      <View style={styles.swiperBorder} />
      <View style={styles.buttonContainer}>
        <Button
          style={styles.button}
          mode="outlined"
          labelStyle={{
            fontSize: 18,
            color: 'white',
            fontWeight: 'bold',
            letterSpacing: 1,
          }}
          onPress={handlePayment}>
          {t("PAGAR")}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    justifyContent: 'center',
    padding: 8,
  },

  title: {
    color: 'white',
    marginBottom: 20,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },

  buttonContainer: {
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    backgroundColor: 'orange',
    borderRadius: 30,
    padding: 15,
  },

  swiperBorder: {
    borderBottomWidth: 2,
    borderBottomColor: 'purple',
    paddingBottom: 50,
    width: '80%',
    alignSelf: 'center',
  },
});

export default Payment;