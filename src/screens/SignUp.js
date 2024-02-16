import { useState, useContext } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import CryptoJS from 'crypto-js';
import ScreenContext from './ScreenContext';

/**
 * SignUp component for user registration.
 * 
 * @param {object} props - The properties passed to the SignUp component.
 * @returns {JSX.Element} - JSX Element containing the SignUp component.
 */
const SignUp = (props) => {
  const { theme } = useContext(ScreenContext);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [warningName, setWarningName] = useState('');
  const [warningSurname, setWarningSurname] = useState('');
  const [warningEmail, setWarningEmail] = useState('');
  const [warningPass, setWarningPass] = useState('');
  const [warningConfirmPass, setWarningConfirmPass] = useState('');
  const [showWarningName, setShowWarningName] = useState(false);
  const [showWarningSurname, setShowWarningSurname] = useState(false);
  const [showWarningEmail, setShowWarningEmail] = useState(false);
  const [showWarningPass, setShowWarningPass] = useState(false);
  const [showWarningConfirmPass, setShowWarningConfirmPass] = useState(false);

  const [code, setCode] = useState('');
  const [codeInsert, setCodeInsert] = useState('');
  const [timeRemain, setTimeRemain] = useState(30);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [showConfirmEmail, setShowConfirmEmail] = useState(false);
  const [warningConfirmEmail, setWarningConfirmEmail] = useState('');
  const [showWarningCode, setShowWarningCode] = useState(false);

  /**
   * Validates if all the required fields are completed.
   * 
   * @returns {boolean} - True if all required fields are completed, false otherwise.
   */
  const warningsComplete = () => {
    let boolName = true;
    let boolSurname = true;
    let boolEmail = true;
    let boolPass = true;
    let boolConfirmPass = true;

    if (name == '') {
      setShowWarningName(true);
      setWarningName('Campo nombre requerido.');
      boolName = false;
    }
    if (surname == '') {
      setShowWarningSurname(true);
      setWarningSurname('Campo apellidos requerido.');
      boolSurname = false;
    }
    if (email == '') {
      setShowWarningEmail(true);
      setWarningEmail('Campo correo electrónico requerido.');
      boolEmail = false;
    }
    if (pass == '') {
      setShowWarningPass(true);
      setWarningPass('Campo contraseña requerido.');
      boolPass = false;
    }
    if (confirmPass == '') {
      setShowConfirmPassword(true);
      setWarningConfirmPass('Campo confirmar contraseña requerido.');
      boolConfirmPass = false;
    }
    return boolName && boolSurname && boolEmail && boolPass && boolConfirmPass;
  };

  /**
   * Validates if the password meets the required criteria.
   * 
   * @returns {boolean} - True if the password is valid, false otherwise.
   */
  const validatePassword = () => {
    const haveUpperCase = /[A-Z]/.test(pass);
    const haveNumber = /\d/.test(pass);
    const haveCharacterSpecial = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(pass);
    const longValid = pass.length >= 8;

    return haveUpperCase && haveNumber && haveCharacterSpecial && longValid;
  };

  /**
   * Toggles the visibility of the password.
   */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Toggles the visibility of the confirm password.
   */
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  /**
   * Handles the email sending for confirmation.
   */
  const handlePostEmail = () => {
    let url = 'http://44.195.98.192:8080/ESTRELLAS/emailConfirmationSignUp';
    setButtonEnabled(false);

    let body = email;

    postDataEmail(url, body);
    setTimeRemain(30);
    const intervalId = setInterval(() => {
      setTimeRemain((prevTiempo) => {
        if (prevTiempo > 0) {
          return prevTiempo - 1;
        } else {
          clearInterval(intervalId);
          setButtonEnabled(true);
          return 0;
        }
      });
    }, 1000);

    setTimeout(() => {
      clearInterval(intervalId);
      setTimeRemain(30);
      setButtonEnabled(true);
    }, 30000);
  };

  /**
   * Posts the email data to the server.
   * 
   * @param {string} url - The URL to post the data.
   * @param {string} body - The email body to be sent.
   */
  const postDataEmail = async (url, body) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: body,
      });

      if (response.ok) {
        setShowConfirmEmail(true);
        const codigoRecibido = await response.text();
        setCode(codigoRecibido);
        return { status: response.status, data: codigoRecibido };
      } else {
        Alert.alert('Error', 'Ya existe un correo registrado anteriormente.');
      }
    } catch (error) {
      console.error('There was a problem with the POST request:', error);
    }
  };

  /**
   * Handles the registration after validation.
   */
  const handlePostRegister = () => {
    let url = 'http://44.195.98.192:8080/ESTRELLAS/register';
    const md5Password = CryptoJS.MD5(pass).toString();
    let body = {
      name: name,
      surname: surname,
      password: md5Password,
      email: email,
    };
    postData(url, body);
  };

  /**
   * Posts the registration data to the server.
   * 
   * @param {string} url - The URL to post the data.
   * @param {object} body - The registration data to be sent.
   */
  const postData = async (url, body) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        if (response.status === 204) {
          Alert.alert('Information', 'Te has registrado correctamente.');
          return { status: response.status, data: null };
        } else {
          const responseData = await response.json();
          return { status: response.status, data: responseData };
        }
      } else {
        throw new Error('Network response was not ok.');
      }
    } catch (error) {
      console.error('There was a problem with the POST request:', error);
    }
  };

  /**
   * Handles the registration process.
   */
  const handleRegister = () => {
    if (warningsComplete()) {
      if (validatePassword()) {
        if (pass === confirmPass) {
          if (!showConfirmEmail) {
            handlePostEmail();
          } else {
            if (codeInsert === code) {
              handlePostRegister();
              props.navigation.navigate('LogIn');
            } else {
              setWarningConfirmEmail('Código introducido no válido');
            }
          }
        } else {
          setShowWarningConfirmPass(true);
          setWarningConfirmPass('Las contraseñas no coinciden.');
        }
      } else {
        setShowWarningPass(true);
        setWarningPass(
          'La contraseña no es válida. \nDebe de contener al menos: \n\t8 caracteres \n\t1 letra mayúscula \n\t1 número \n\t1 carácter especial.'
        );
      }
    } else {
      console.log('Incompletos');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View
        style={[
          styles.container,
          theme === 'black'
            ? { backgroundColor: '#005588' }
            : { backgroundColor: 'lightblue' },
        ]}>
        <View style={styles.sectionContainer}>
          <Text style={styles.usuari}>Nombre:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              setName(text);
              if (showWarningName) {
                setShowWarningName(false);
              }
            }}
            placeholder="👤 Nombre"
            value={name}
            mode="outlined"
            outlineColor="#d4afe0"
            right={<TextInput.Icon name="account" />}
          />
          {showWarningName ? (
            <Text style={{ fontSize: 15, color: 'red', marginBottom: 10 }}>
              {warningName}
            </Text>
          ) : null}
          <Text style={styles.usuari}>Apellidos:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              setSurname(text);
              if (showWarningSurname) {
                setShowWarningSurname(false);
              }
            }}
            placeholder="👤 Apellidos"
            value={surname}
            mode="outlined"
            outlineColor="#d4afe0"
            right={<TextInput.Icon name="account" />}
          />
          {showWarningSurname ? (
            <Text style={{ fontSize: 15, color: 'red', marginBottom: 10 }}>
              {warningSurname}
            </Text>
          ) : null}
          <Text style={styles.contrasenya}>Correo electronico:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              setEmail(text);
              if (showWarningEmail) {
                setShowWarningEmail(false);
              }
            }}
            placeholder="📧 Correo electrónico"
            value={email}
            mode="outlined"
            outlineColor="#d4afe0"
            right={<TextInput.Icon name="email" />}
          />
          {showWarningEmail ? (
            <Text style={{ fontSize: 15, color: 'red', marginBottom: 10 }}>
              {warningEmail}
            </Text>
          ) : null}
          <Text style={styles.contrasenya}>Contraseña:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              setPass(text);
              if (showWarningPass) {
                setShowWarningPass(false);
              }
            }}
            placeholder="🔒 Contraseña"
            value={pass}
            secureTextEntry={!showPassword}
            mode="outlined"
            outlineColor="#d4afe0"
            right={
              <TextInput.Icon
                name={showPassword ? 'eye-off' : 'eye'}
                onPress={togglePasswordVisibility}
              />
            }
          />
          {showWarningPass ? (
            <Text style={{ fontSize: 15, color: 'red' }}>{warningPass}</Text>
          ) : null}
          <Text style={styles.contrasenya}>Confirmar contraseña:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              setConfirmPass(text);
              if (setShowWarningConfirmPass) {
                setShowWarningConfirmPass(false);
              }
            }}
            placeholder="🔒 Confirmar contraseña"
            value={confirmPass}
            secureTextEntry={!showConfirmPassword}
            mode="outlined"
            outlineColor="#d4afe0"
            right={
              <TextInput.Icon
                name={showConfirmPassword ? 'eye-off' : 'eye'}
                onPress={toggleConfirmPasswordVisibility}
              />
            }
          />
          {showConfirmPassword ? (
            <Text style={{ fontSize: 15, color: 'red' }}>
              {warningConfirmPass}
            </Text>
          ) : null}
          {showConfirmEmail ? (
            <View style={styles.confirmCode}>
              <Text style={styles.usuari}>CONFIRMACIÓN DE REGISTRO:</Text>
              {!buttonEnabled ? (
                <Text style={{ fontSize: 15, color: 'red' }}>
                  Espera {timeRemain}s para volver a intentar
                </Text>
              ) : null}
              <Text style={{ marginTop: 10, fontSize: 20 }}>
                Introduce código:
              </Text>
              <TextInput
                style={styles.inputCode}
                onChangeText={(text) => {
                  setCodeInsert(text);
                  if (showWarningCode) {
                    setShowWarningCode(false);
                  }
                }}
                placeholder="Introduce el código"
                value={codeInsert}
                mode="outlined"
                outlineColor="#d4afe0"
              />
              <Text style={{ fontSize: 15, color: 'red' }}>
                {warningConfirmEmail}
              </Text>
              <Button
                disabled={!buttonEnabled}
                mode="contained"
                style={{ backgroundColor: 'blue' }}
                onPress={() => handlePostEmail(email)}>
                VOLVER A ENVIAR CÓDIGO
              </Button>
            </View>
          ) : null}
          <Button
            style={styles.button}
            mode="contained"
            icon="account-plus"
            onPress={() => handleRegister()}>
            CREAR CUENTA
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
    backgroundColor: 'lightblue',
  },
  sectionContainer: {
    flex: 0.9,
    width: 330,
    padding: 20,
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  usuari: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Rosarivo',
  },
  contrasenya: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    fontFamily: 'Rosarivo',
  },
  input: {
    marginBottom: 10,
    width: '100%',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#d4afe0',
  },
  confirmCode: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
    marginTop: 10,
  },
  inputCode: {
    width: '100%',
  },
});

export default SignUp;