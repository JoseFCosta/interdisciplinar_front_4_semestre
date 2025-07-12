
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Pressable,
} from 'react-native';
import { Button, Provider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import axios from 'axios';

const ADMIN_EMAIL = 'admin@fasipe.com';
const ADMIN_PASSWORD = 'senhaAdm';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();
  const [secureText, setSecureText] = useState(true);

  const toggleSecureText = () => setSecureText(!secureText);

  const isFormValid = () => email.trim() !== '' && senha.trim() !== '';

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg('');

    if (
      email.trim().toLowerCase() === ADMIN_EMAIL &&
      senha === ADMIN_PASSWORD
    ) {
      await AsyncStorage.setItem('isLoggedIn', 'true');
      setLoading(false);
      router.replace('/homeScreen');
      return; 
    }

    try {
      const response = await axios.post('http://160.20.22.99:5280/login', {
        LOGUSUARIO: email,
        SENHAUSUA: senha,
      });

      if (response.data?.code === 'LOGIN_SUCCESS') {
        await AsyncStorage.setItem('isLoggedIn', 'true');
        router.replace('/homeScreen');
      } else {
        setErrorMsg(response.data.message || 'Usuário ou senha inválidos.');
      }
    } catch (error: any) {
      const apiMessage = error?.response?.data?.message;
      setErrorMsg(apiMessage || 'Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Provider>
      <View style={styles.container}>
        <Image
          source={require('../../assets/images/accounting.png')}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.title}>Login</Text>

        {errorMsg !== '' && <Text style={styles.error}>{errorMsg}</Text>}

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={secureText}
          placeholderTextColor="#999"
        />

        <TouchableOpacity onPress={toggleSecureText}>
          <Text style={styles.toggleText}>
            {secureText ? 'Mostrar senha' : 'Ocultar senha'}
          </Text>
        </TouchableOpacity>

        <Pressable
          onPress={handleLogin}
          disabled={!isFormValid() || loading}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            (!isFormValid() || loading) && styles.buttonDisabled,
          ]}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Carregando...' : 'Entrar'}
          </Text>
        </Pressable>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
    justifyContent: 'center',
  },
  image: {
    width: 180,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 24,
    alignSelf: 'center',
  },
  label: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 6,
  },
  input: {
    height: 50,
    borderColor: '#00913D',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 16,
    fontSize: 16,
    color: '#000000',
  },
  button: {
    backgroundColor: '#00913D',
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonPressed: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    transform: [{ translateY: 1 }],
  },
  buttonDisabled: {
    backgroundColor: '#a0aec0',
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  error: {
    color: '#c53030',
    backgroundColor: '#fed7d7',
    padding: 10,
    borderRadius: 6,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  toggleText: {
    fontSize: 16,
    color: '#00913D',
    marginLeft: 8,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
