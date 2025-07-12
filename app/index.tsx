// app/index.tsx
import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
    const [redirectTo, setRedirectTo] = useState<null | '/(tabs)/homeScreen' | '/(auth)/login'>(null);


  useEffect(() => {
    const checkLogin = async () => {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
setRedirectTo(isLoggedIn === 'true' ? '/(tabs)/homeScreen' : '/(auth)/login');

    };

    checkLogin();
  }, []);

  if (!redirectTo) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#38a169" />
      </View>
    );
  }

  return <Redirect href={redirectTo} />;
}
