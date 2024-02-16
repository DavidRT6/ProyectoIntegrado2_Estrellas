import { useState, useContext } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import ScreenContext from './ScreenContext';

/**
 * UpdatePassword component for updating user password.
 * 
 * @param {object} navigation - The navigation object used for navigation actions.
 * @returns {JSX.Element} - JSX Element containing the UpdatePassword component.
 */
const UpdatePassword = ({ navigation }) => {
  const { theme, email } = useContext(ScreenContext);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showWarningPass, setShowWarningPass] = useState(false);
  const [showWarningConfirmPass, setShowWarningConfirmPass] = useState(false);
  const [warningPass, setWarningPass] = useState('');
  const [warningConfirmPass, setWarningConfirmPass] = useState('');

  /**
   * Toggles the visibility of the password.
   */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Validates the password based on certain criteria.
   * 
   * @returns {boolean} - True if the password is valid, false otherwise.
   */
  const validatePassword = () => {
    const haveUpperCase = /[A-Z]/.test(password);
    const haveNumber = /\d/.test(password);
    const haveCharacterSpecial = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(
      password
    );
    const longValid = password.length >= 8;

    return haveUpperCase && haveNumber && haveCharacterSpecial && longValid;
  };

  /**
   * Handles the password update process.
   */
  const handleUpdatePass = () => {
    if (password != '') {
      if (validatePassword()) {
        if (password == confirmPassword) {
          handlePutUpdatePassword();
        } else {
          setShowWarningConfirmPass(true);
          setWarningConfirmPass('Las contraseñas no coinciden.');
        }
      } else {
        setShowWarningPass(true);
        setWarningPass(
          'La contraseña no es válida. \nDebe de contener almenos: \n\t8 caracteres \n\t1 letra mayúscula \n\t1 número \n\t1 carácter especial.'
        );
      }
    } else {
      setWarningPass('La contraseña no debe estar vacía');
    }
  };

  /**
   * Sends the updated password to the server.
   */
  const handlePutUpdatePassword = () => {
    let url = `http://44.195.98.192:8080/ESTRELLAS/updatePassword`;
    let body = {
      email: email,
      password: password,
    };

    postData(url, body);
  };

  /**
   * Posts data to the server.
   * 
   * @param {string} url - The URL to post the data.
   * @param {object} body - The data to be sent.
   */
  const postData = async (url, body) => {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        if (response.status === 204) {
          Alert.alert(
            'Información',
            'Se ha actualizado la contraseña correctamente.'
          );
          navigation.navigate('LogIn');
          return { status: response.status, data: null };
        } else {
          const responseData = await response.json();
          return { status: response.status, data: responseData };
        }
      } else {
        throw new Error('Network response was not ok.');
      }
    } catch (error) {
      console.error('There was a problem with the PUT request:', error);
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
        Nueva contraseña:
      </Text>
      <TextInput
        label="🔒 Contraseña"
        onChangeText={(text) => {
          setPassword(text);
          if (showWarningPass) {
            setShowWarningPass(false);
          }
        }}
        value={password}
        placeholder="Introduce Contraseña"
        mode="outlined"
        outlineColor={theme === 'black' ? 'white' : 'purple'}
        style={{ marginTop: 10, marginBottom: 20 }}
        secureTextEntry={!showPassword}
        right={
          <TextInput.Icon
            name={showPassword ? 'eye-off' : 'eye'}
            color={theme === 'black' ? 'white' : 'black'}
            onPress={togglePasswordVisibility}
          />
        }
      />
      {showWarningPass ? (
        <Text style={{ fontSize: 15, color: 'red' }}>{warningPass}</Text>
      ) : null}
      <Text
        style={[
          styles.title,
          theme === 'black' ? styles.titleDark : styles.titleLight,
        ]}>
        Confirmar nueva contraseña:
      </Text>
      <TextInput
        label="🔒 Confirmar contraseña"
        onChangeText={(text) => {
          setConfirmPassword(text);
          if (setShowWarningConfirmPass) {
            setShowWarningConfirmPass(false);
          }
        }}
        value={confirmPassword}
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
      {showWarningConfirmPass ? (
        <Text style={{ fontSize: 15, color: 'red' }}>{warningConfirmPass}</Text>
      ) : null}
      <View style={{ marginTop: 30 }}>
        <Button
          style={styles.button}
          mode="contained"
          icon="update"
          color={theme === 'black' ? 'white' : 'black'}
          onPress={handleUpdatePass}>
          Actualizar Contraseña
        </Button>
      </View>
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
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
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
});

export default UpdatePassword;