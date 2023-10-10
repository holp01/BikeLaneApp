import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
    const [isTokenAvailable, setTokenAvailable] = useState(null);

    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem('accessToken');
            setTokenAvailable(!!token); // !! converts value to boolean
        };
        checkToken();
    }, []);

    if (isTokenAvailable === null) return null; // Render nothing till we determine the token's presence

    return (
        <NavigationContainer>
            <AppNavigator initialRoute={isTokenAvailable ? 'Home' : 'Login'} />
        </NavigationContainer>
    );
}