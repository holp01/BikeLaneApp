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

function RegisterScreen() {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fontsLoaded] = useFonts({
        'Roboto-Bold': require("../assets/fonts/Roboto-Bold.ttf"),
        'Roboto-Regular': require("../assets/fonts/Roboto-Regular.ttf")
    });

    const handleRegister = () => {
        // RegisterAPI Request using name, email, password, confirm password
        // If Success
        navigation.navigate('Login');
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
                        label={'Name'}
                        fieldOnChangeText={(text) => setName(text)}
                    />
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
                        fieldOnChangeText={(text) => setPassword(text)}
                    />

                    <InputField
                        label={'Confirm Password'}
                        icon={
                            <Ionicons
                                name="ios-lock-closed-outline"
                                size={20}
                                color="#666"
                                style={{ marginRight: 5 }}
                            />
                        }
                        inputType="password"
                        fieldOnChangeText={(text) => setConfirmPassword(text)}
                    />

                    <CustomButton label={"Register"} onPress={handleRegister} bkColor={'#FF4040'} textColor={'#fff'} />
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView >
    )
}

export default RegisterScreen;