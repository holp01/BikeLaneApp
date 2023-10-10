import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import your screens here:
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import RewardsScreen from '../screens/RewardsScreen';

const Stack = createStackNavigator();

function AppNavigator({ initialRoute }) {
    return (
        <Stack.Navigator initialRouteName={initialRoute}>
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="RewardsScreen"
                component={RewardsScreen}
                options={{ title: 'Rewards' }}
            />
        </Stack.Navigator>
    );
}

export default AppNavigator;