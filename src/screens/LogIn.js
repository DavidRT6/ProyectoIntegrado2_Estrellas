import { useState, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import ScreenContext from './ScreenContext';
import CryptoJS from 'crypto-js';

/**
 * LogIn component
 * 
 * @returns {JSX.Element} - JSX Element containing the LogIn component.
 */
const LogIn = () => {
  const { setId, theme } = useContext(ScreenContext);
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Toggles the visibility of the password.
   */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Handles changes in the email input field.
   * 
   * @param {string} text - The new value of the email input.
   */
  const handleEmailChange = (text) => {
    setEmail(text);
  };

  /**
   * Handles changes in the password input field.
   * 
   * @param {string} text - The new value of the password input.
   */
  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  /**
   * Handles the login process.
   */
  const handleLogin = () => {
    const url = 'http://44.195.98.192:8080/ESTRELLAS/login';
    const md5Password = CryptoJS.MD5(password).toString();
    const body = {
      email: email,
      password: md5Password,
    };
    postData(url, body);
  };

  /**
   * Sends a POST request with user credentials for login.
   * 
   * @param {string} url - The URL for the POST request.
   * @param {object} body - The body of the POST request containing user credentials.
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

      if (response.status === 202) {
        if (response.ok) {
          const jsonResponse = await response.json();
          const id = jsonResponse.id;
          setId(id);
          navigation.navigate('Profile');
        }
      } else {
        setEmail('');
        setPassword('');
        alert('Credenciales incorrectas.');
      }
    } catch (error) {
      console.error('An error has occurred with the POST request:', error);
    }
  };

  return (
    <View
      style={[
        styles.container,
        theme === 'black' ? styles.containerDark : styles.containerLight,
      ]}>
      <Text
        style={[
          styles.title,
          theme === 'black' ? styles.titleDark : styles.titleLight,
        ]}>
        Datos Inicio de Sesión
      </Text>
      <TextInput
        label="📧 Correo electrónico"
        onChangeText={handleEmailChange}
        value={email}
        placeholder="Introduce correo"
        mode="outlined"
        outlineColor={theme === 'black' ? 'white' : 'purple'}
      />
      <TextInput
        label="🔒 Contraseña"
        onChangeText={handlePasswordChange}
        value={password}
        placeholder="Introduce Contraseña"
        mode="outlined"
        outlineColor={theme === 'black' ? 'white' : 'purple'}
        style={{ marginTop: 10 }}
        secureTextEntry={!showPassword}
        right={
          <TextInput.Icon
            name={showPassword ? 'eye-off' : 'eye'}
            color={theme === 'black' ? 'white' : 'black'}
            onPress={togglePasswordVisibility}
          />
        }
      />
      <Text
        style={[
          styles.forgotPasswordText,
          theme === 'black' ? styles.signupTextDark : styles.signupTextLight,
        ]}
        onPress={() => navigation.navigate('ForgotPassword')}>
        ¿Has olvidado la contraseña?
      </Text>

      <View style={{ marginTop: 30 }}>
        <Button
          style={styles.button}
          mode="contained"
          icon="login"
          color={theme === 'black' ? 'white' : 'black'}
          onPress={handleLogin}>
          Iniciar Sesión
        </Button>
      </View>
      <Text
        style={[
          styles.signupText,
          theme === 'black' ? styles.signupTextDark : styles.signupTextLight,
        ]}
        onPress={() => navigation.navigate('SignUp')}>
        ¿No tienes una cuenta? Regístrate aquí
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  containerDark: {
    backgroundColor: '#001122',
  },
  containerLight: {
    backgroundColor: 'lightblue',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  titleDark: {
    color: 'white',
  },
  titleLight: {
    color: 'black',
  },
  button: {
    borderRadius: 10,
  },
  signupText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  forgotPasswordText: {
    marginTop: 16,
    textAlign: 'right',
    fontSize: 16,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  signupTextDark: {
    color: 'white',
  },
  signupTextLight: {
    color: 'black',
  },
});

export default LogIn;