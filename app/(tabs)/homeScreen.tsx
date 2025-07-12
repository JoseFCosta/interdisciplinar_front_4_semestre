// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Pressable } from 'react-native';
// import { Provider } from 'react-native-paper';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useRouter } from 'expo-router';
// import NetInfo from '@react-native-community/netinfo';

// export default function HomeScreen() {
//   const router = useRouter();
//   const [isOffline, setIsOffline] = useState(false);
//   const [userName, setUserName] = useState('');
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     NetInfo.fetch().then((state) => {
//       setIsOffline(!state.isConnected);
//     });

//     const loadUser = async () => {
//       const name = await AsyncStorage.getItem('userName');
//       if (name) {
//         setUserName(name);
//       }
//     };
//     loadUser();
//   }, []);

//   const handleLogout = async () => {
//     await AsyncStorage.removeItem('isLoggedIn');
//     router.replace('/login');
//   };

//   const verifyLogin = async () => {
//     const loggedInStatus = await AsyncStorage.getItem('isLoggedIn');
//     if (loggedInStatus === 'true') {
//       setIsLoggedIn(true);
//     } else {
//       setIsLoggedIn(false);
//     }
//   };

//   useEffect(() => {
//     verifyLogin();
//   }, []);

//   return (
//     <Provider>
//       <View style={styles.container}>
//         <Text style={styles.title}>Bem-vindo ao App</Text>

//         {isOffline ? (
//           <View style={styles.offlineContainer}>
//             <Text style={styles.offlineText}>⚠️ Você está offline</Text>
//           </View>
//         ) : (
//           <Text style={styles.onlineText}>✅ Você está online</Text>
//         )}

//         <Text style={styles.username}>
//           Olá, {userName ? userName : 'Usuário'}!
//         </Text>

//         <Pressable
//           onPress={handleLogout}
//           style={({ pressed }) => [
//             styles.logoutButton,
//             pressed && styles.logoutPressed,
//           ]}
//         >
//           <Text style={styles.logoutText}>Sair</Text>
//         </Pressable>
//       </View>
//     </Provider>
//   );
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 24,
//   },
//   title: {
//     fontSize: 24,
//     color: '#000000',
//     fontWeight: 'bold',
//     marginBottom: 30,
//   },
//   offlineContainer: {
//     backgroundColor: '#FFF4E5',
//     padding: 10,
//     borderRadius: 6,
//     borderLeftWidth: 5,
//     borderLeftColor: '#FFA500',
//     marginBottom: 16,
//   },
//   offlineText: {
//     color: '#FF6B00',
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
//   onlineText: {
//     fontSize: 14,
//     color: '#00913D',
//     marginBottom: 10,
//   },
//   username: {
//     fontSize: 18,
//     color: '#000000',
//     fontWeight: '600',
//     marginBottom: 20,
//   },
//   logoutButton: {
//     borderWidth: 1,
//     borderColor: '#00913D',
//     borderRadius: 6,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     backgroundColor: '#FFFFFF',
//   },
//   logoutPressed: {
//     backgroundColor: '#E6F9EC',
//     transform: [{ translateY: 1 }],
//   },
//   logoutText: {
//     color: '#00913D',
//     fontWeight: 'bold',
//     fontSize: 16,
//     textAlign: 'center',
//   },
// });
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Provider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import NetInfo from '@react-native-community/netinfo';

export default function HomeScreen() {
  const router = useRouter();
  const [isOffline, setIsOffline] = useState(false);
  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      setIsOffline(!state.isConnected);
    });

    const loadUser = async () => {
      const name = await AsyncStorage.getItem('userName');
      if (name) {
        setUserName(name);
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    router.replace('/login');
  };

  const verifyLogin = async () => {
    const loggedInStatus = await AsyncStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    verifyLogin();
  }, []);

  return (
    <Provider>
      <View style={styles.container}>
        <Text style={styles.title}>Bem-vindo ao App</Text>

        {isOffline ? (
          <View style={styles.offlineContainer}>
            <Text style={styles.offlineText}>⚠️ Você está offline</Text>
          </View>
        ) : (
          <Text style={styles.onlineText}>✅ Você está online</Text>
        )}

        <Text style={styles.username}>
          Olá, {userName ? userName : 'Usuário'}!
        </Text>

        {/* Descrição do projeto */}
        <View style={styles.projectDescriptionContainer}>
          <Text style={styles.projectDescriptionText}>
            Este é o projeto Contabil, cujo objetivo é visualizar as movimentações
            contábeis e suas relações com outras tabelas, como itens de venda,
            profissionais, venda e clientes.
          </Text>
        </View>

        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.logoutPressed,
          ]}
        >
          <Text style={styles.logoutText}>Sair</Text>
        </Pressable>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    color: '#000000',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  offlineContainer: {
    backgroundColor: '#FFF4E5',
    padding: 10,
    borderRadius: 6,
    borderLeftWidth: 5,
    borderLeftColor: '#FFA500',
    marginBottom: 16,
  },
  offlineText: {
    color: '#FF6B00',
    fontWeight: 'bold',
    fontSize: 14,
  },
  onlineText: {
    fontSize: 14,
    color: '#00913D',
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '600',
    marginBottom: 20,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#00913D',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  logoutPressed: {
    backgroundColor: '#E6F9EC',
    transform: [{ translateY: 1 }],
  },
  logoutText: {
    color: '#00913D',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  projectDescriptionContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#F1F1F1',
    borderRadius: 6,
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  projectDescriptionText: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
  },
});
