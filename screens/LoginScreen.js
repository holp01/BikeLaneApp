import React from "react";
import { View, Button, TextInput } from "react-native";
import { useNavigation } from '@react-navigation/native';

function LoginScreen() {
    const navigation = useNavigation();

    const handleLogin = () => {
        // API Login
        //if success
        navigation.navigate('Home');
    };

    const handleRegisterRedirect = () => {
        navigation.navigate('Register');
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <TextInput placeholder="Email"></TextInput>
            <TextInput placeholder="Password" secureTextEntry={true}></TextInput>
            <Button title="Login" onPress={handleLogin} />
            <Button title="Register" onPress={handleRegisterRedirect} />
        </View>
    )
}

export default LoginScreen;