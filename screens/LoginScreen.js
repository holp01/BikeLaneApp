import React, { useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import CustomButton from '../components/customButton';
import InputField from "../components/inputField";

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useFonts } from "expo-font";

function LoginScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fontsLoaded] = useFonts({
        'Roboto-Bold': require("../assets/fonts/Roboto-Bold.ttf"),
        'Roboto-Regular': require("../assets/fonts/Roboto-Regular.ttf")
    });

    const handleLogin = () => {
        // API Login with email and password
        //if success
        navigation.navigate('Home');
    };

    const handleRegisterRedirect = () => {
        navigation.navigate('Register');
    };

    const handlePress = () => {
        Keyboard.dismiss(); // dismisses the keyboard when user taps outside of TextInput
    };

    if (!fontsLoaded)
        return null;

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', backgroundColor: "#fff" }}>
            <TouchableWithoutFeedback onPress={handlePress}>
                <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
                    <InputField
                        label={'person@example.com'}
                        icon={
                            <MaterialIcons
                                name="alternate-email"
                                size={20}
                                color="#666"
                                style={{ marginRight: 5 }}
                            />
                        }
                        keyboardType="email-address"
                        fieldOnChangeText={(text) => setEmail(text)}
                    />

                    <InputField
                        label={'Password'}
                        icon={
                            <Ionicons
                                name="ios-lock-closed-outline"
                                size={20}
                                color="#666"
                                style={{ marginRight: 5 }}
                            />
                        }
                        inputType="password"
                        fieldButtonLabel={"Forgot?"}
                        fieldOnChangeText={(text) => setPassword(text)}
                    />

                    <CustomButton label={"Login"} onPress={handleLogin} bkColor={'#FF4040'} textColor={'#fff'} />
                    <CustomButton label={"Register"} onPress={handleRegisterRedirect} bkColor={'#984040'} textColor={'#fff'} />
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView >
    )
}

export default LoginScreen;