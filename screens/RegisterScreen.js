import React from "react";
import { View, Button, TextInput } from "react-native";
import { useNavigation } from '@react-navigation/native';

function RegisterScreen() {
    const navigation = useNavigation();

    const handleRegister = () => {
        // RegisterAPI Request
        // If Success
        navigation.navigate('Login');
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <TextInput placeholder="Email"></TextInput>
            <TextInput placeholder="Password" secureTextEntry={true}></TextInput>
            <Button title="Register" onPress={handleRegister} />
        </View>
    )
}

export default RegisterScreen;